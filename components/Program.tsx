
import {
	useLayoutEffect,
	useRef,
	useState,
	useEffect,
	useCallback,
	FC,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	ArrowRight,
	ArrowLeft,
	Sparkles,
	PlayCircle,
} from "lucide-react";
import { ProgramItem } from "../types";
import { ProgramCard } from "./ProgramCard";
import { trackSectionView, trackEvent } from "../services/analyticsService";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "Training", "Wellness", "Community"];

interface ProgramProps {
  programs: ProgramItem[];
}

export const Program: FC<ProgramProps> = ({ programs }) => {
	const container = useRef<HTMLElement>(null);
	const sliderRef = useRef<HTMLDivElement>(null);
	const sliderWrapperRef = useRef<HTMLDivElement>(null);
	const counterRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);

	const [activeCategory, setActiveCategory] = useState("All");
	const [filteredPrograms, setFilteredPrograms] = useState(programs);
	const [activeIndex, setActiveIndex] = useState(0);
	const [wrapperWidth, setWrapperWidth] = useState(0);
	const [isHoverPaused, setIsHoverPaused] = useState(false);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        trackSectionView('Program');
    }, []);

    // Sync filtered programs when prop updates
    useEffect(() => {
        const newPrograms =
					activeCategory === "All"
						? programs
						: programs.filter((p) => p.category === activeCategory);
        setFilteredPrograms(newPrograms);
    }, [programs, activeCategory]);

	// Filter Logic
	useEffect(() => {
		const timeline = gsap.timeline();
		
		timeline.to(sliderRef.current, {
			opacity: 0,
			y: 20,
			duration: 0.3,
			ease: "power2.in",
			onComplete: () => {
				const newPrograms =
					activeCategory === "All"
						? programs
						: programs.filter((p) => p.category === activeCategory);

				setFilteredPrograms(newPrograms);
				setActiveIndex(0);
			},
		})
		.to(sliderRef.current, { 
			opacity: 1, 
			y: 0, 
			duration: 0.4, 
			ease: "power2.out" 
		});

	}, [activeCategory, programs]);

	// Responsive resize handler
	const handleResize = useCallback(() => {
		if (sliderWrapperRef.current) {
			setWrapperWidth(sliderWrapperRef.current.offsetWidth);
		}
	}, []);

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize]);

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			// Entrance Animation for Header
			gsap.from(".program-header-anim", {
				y: 60,
				opacity: 0,
				duration: 1.1,
				stagger: 0.1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: container.current,
					start: "top 75%",
				},
			});

			// Cards Staggered Entrance
			gsap.from(".program-card-anim", {
				x: 100,
				opacity: 0,
				duration: 1,
				stagger: 0.1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sliderRef.current,
					start: "top 85%",
				},
			});
		}, container);
		return () => ctx.revert();
	}, []);

	// Counter Animation on Change
	useEffect(() => {
		if (counterRef.current) {
			gsap.fromTo(
				counterRef.current,
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
			);
		}
	}, [activeIndex]);

    // Bounded Manual Navigation
	const handleNext = useCallback(() => {
		if (filteredPrograms.length === 0) return;
        setActiveIndex(prev => Math.min(prev + 1, filteredPrograms.length - 1));
        trackEvent('Program Nav', { action: 'Next' });
	}, [filteredPrograms.length]);

	const handlePrev = useCallback(() => {
		if (filteredPrograms.length === 0) return;
        setActiveIndex(prev => Math.max(prev - 1, 0));
        trackEvent('Program Nav', { action: 'Prev' });
	}, [filteredPrograms.length]);

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        trackEvent('Filter Change', { category: cat });
    };

	// Auto-play (Loops back to start for continuity, but manual is bounded)
	useEffect(() => {
		if (isHoverPaused) return;
		const interval = setInterval(() => {
            setActiveIndex(prev => {
                if (prev >= filteredPrograms.length - 1) return 0;
                return prev + 1;
            });
        }, 6000);
		return () => clearInterval(interval);
	}, [isHoverPaused, filteredPrograms.length]);

	// Combined Centered Slider Logic - Single Source of Truth for Position
	useEffect(() => {
		if (sliderRef.current && sliderWrapperRef.current) {
			const activeCard = sliderRef.current.children[activeIndex] as HTMLElement;
			
			if (activeCard) {
                // Ensure offsetLeft is relative to the slider container (requires 'relative' class on container)
				const cardLeft = activeCard.offsetLeft;
				const cardWidth = activeCard.offsetWidth;
				
				// Calculate X to center the active card in the wrapper
				// formula: centerOfWrapper - centerOfCard (relative to start of list)
				// centerOfWrapper = wrapperWidth / 2
				// centerOfCard (relative to list start) = cardLeft + cardWidth / 2
				// x = (wrapperWidth / 2) - (cardLeft + cardWidth / 2)
				
				const x = (wrapperWidth / 2) - (cardLeft + (cardWidth / 2));

				gsap.to(sliderRef.current, {
					x: x,
					duration: 0.8,
					ease: "power3.inOut",
					overwrite: true 
				});
			}
		}
	}, [activeIndex, wrapperWidth, filteredPrograms]);

	// Touch logic
	const onTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientX);
	};
	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};
	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		if (distance > 50) handleNext();
		if (distance < -50) handlePrev();
		setTouchStart(0);
		setTouchEnd(0);
	};

    const isAtStart = activeIndex === 0;
    const isAtEnd = activeIndex === filteredPrograms.length - 1;

	return (
		<section
            id="program"
			ref={container}
			className="bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-hidden relative z-10"
		>
			<div className="py-20 md:py-32 px-4 sm:px-6 md:px-10 max-w-[1920px] mx-auto">
				
				{/* HEADER SECTION */}
				<div className="mb-16 md:mb-24 flex flex-col gap-10">
					{/* Top Row: Filters & Label */}
					<div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-6 md:gap-12 relative z-20">
						
						{/* Categories - Sticky on Mobile for better UX */}
						<div className="sticky top-[70px] md:static w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0 py-3 md:py-0 bg-white/80 dark:bg-zinc-950/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-b border-gray-100 dark:border-white/5 md:border-none transition-all duration-300">
							<div className="flex flex-wrap gap-2 program-header-anim">
								{categories.map((cat) => (
									<button
										key={cat}
										onClick={() => handleCategoryChange(cat)}
										className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 ${
											activeCategory === cat
												? "bg-brand-dark dark:bg-white text-white dark:text-brand-dark border-transparent shadow-md transform scale-105"
												: "bg-transparent text-gray-500 border-gray-200 dark:border-zinc-800 hover:border-brand-orange hover:text-brand-orange hover:bg-white/50 dark:hover:bg-zinc-900"
										}`}
									>
										{cat === "All" && (
											<Sparkles
												size={12}
												className={activeCategory === cat ? "fill-current" : ""}
											/>
										)}
										{cat}
									</button>
								))}
							</div>
						</div>

						{/* Section Label */}
						<div className="flex items-center gap-2 program-header-anim px-2 md:px-0">
							<div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
							<span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
								The Program
							</span>
						</div>
					</div>

					{/* Title Row */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
						<div className="lg:col-span-8 program-header-anim">
							<h2
								ref={titleRef}
								className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem] leading-[0.95] font-medium tracking-tight text-brand-dark dark:text-white max-w-5xl"
							>
								Elevate your
								<span className="inline-block mx-2 md:mx-4 relative top-1 md:top-3">
									<img
										src="https://images.unsplash.com/photo-1519861531473-92002639313cc?q=80&w=200&auto=format&fit=crop"
										className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-[3px] border-white dark:border-zinc-800 shadow-lg rotate-12"
										alt="Ball"
									/>
								</span>
								experience
								with handpicked featured.
							</h2>
						</div>
						<div className="lg:col-span-4 program-header-anim pb-2 lg:pb-4">
							<p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md ml-0 lg:ml-auto text-left lg:text-right text-balance">
								Your sports journey starts right here with us and the crew. Designed for elite performance.
							</p>
						</div>
					</div>
				</div>

				{/* MAIN CONTENT GRID */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
					
					{/* Left Column: Counter & Controls */}
					{/* On Mobile: Controls appear AFTER the slider (Order 2) */}
					{/* On Desktop: Controls appear BEFORE the slider (Order 1) */}
					<div className="lg:col-span-3 order-2 lg:order-1 relative z-10 program-header-anim">
						<div className="lg:sticky lg:top-40 flex flex-row lg:flex-col justify-between items-end lg:items-start w-full gap-8 border-t lg:border-t-0 border-gray-100 dark:border-white/10 pt-8 lg:pt-0">
							<div className="flex-1">
								<div className="flex items-baseline mb-2">
									<span
										ref={counterRef}
										className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tighter text-brand-dark dark:text-white leading-none tabular-nums"
									>
										{String(activeIndex + 1).padStart(2, "0")}
									</span>
									<span className="text-xl md:text-2xl text-gray-300 dark:text-zinc-700 font-medium ml-2">
										/{filteredPrograms.length}
									</span>
								</div>
								<div className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-0 lg:mb-8 flex items-center gap-2">
									<PlayCircle size={12} />
									Upcoming Event
								</div>
							</div>

							{/* Navigation Buttons */}
							<div className="flex gap-4">
								<button
									onClick={handlePrev}
                                    disabled={isAtStart}
									className={`w-14 h-14 md:w-16 md:h-16 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all duration-300 group shadow-sm active:scale-95 ${isAtStart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}`}
									aria-label="Previous Slide"
								>
									<ArrowLeft
										size={24}
										className="group-hover:-translate-x-1 transition-transform stroke-[1.5]"
									/>
								</button>
								<button
									onClick={handleNext}
                                    disabled={isAtEnd}
									className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-orange text-white flex items-center justify-center transition-all duration-300 shadow-xl shadow-brand-orange/20 group active:scale-95 ${isAtEnd ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-orange-600 hover:scale-110'}`}
									aria-label="Next Slide"
								>
									<ArrowRight
										size={24}
										className="group-hover:translate-x-1 transition-transform stroke-[1.5]"
									/>
								</button>
							</div>
						</div>
					</div>

					{/* Right Column: Content Window */}
					<div
                        ref={sliderWrapperRef}
						className="lg:col-span-9 order-1 lg:order-2 w-full min-w-0 program-header-anim overflow-hidden"
						onMouseEnter={() => setIsHoverPaused(true)}
						onMouseLeave={() => setIsHoverPaused(false)}
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
					>
						{/* Slider container: flex-row always */}
						<div
							ref={sliderRef}
							className="flex gap-5 sm:gap-6 lg:gap-8 w-max px-4 pb-10 relative lg:min-h-[600px] cursor-grab active:cursor-grabbing"
						>
							{filteredPrograms.map((item) => (
								<ProgramCard 
                                    key={item.id} 
                                    item={item} 
                                    className="program-card-anim w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[420px] xl:w-[480px] h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] flex-shrink-0" 
                                />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

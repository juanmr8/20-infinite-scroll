"use client";

import { useState, useEffect } from "react";
import { useMotionValue, useTransform, motion, animate } from "framer-motion";
import useMeasure from "react-use-measure";
import Image from "next/image";

const IMAGES = [
	{ src: "/pulp-1.png", alt: "Pulp Fiction 1" },
	{ src: "/pulp-2.png", alt: "Pulp Fiction 2" },
	{ src: "/pulp-3.png", alt: "Pulp Fiction 3" },
	{ src: "/pulp-4.png", alt: "Pulp Fiction 4" },
	{ src: "/pulp-5.png", alt: "Pulp Fiction 5" },
	{ src: "/pulp-6.png", alt: "Pulp Fiction 6" },
	{ src: "/pulp-7.png", alt: "Pulp Fiction 7" },
	{ src: "/pulp-8.png", alt: "Pulp Fiction 8" },
	{ src: "/pulp-9.png", alt: "Pulp Fiction 9" },
];

const COPIES = 20;
const INITIAL_OFFSET = 0;
const AUTO_SCROLL_SPEED = 0.5;
const LERP_FACTOR = 0.1;

export function InfiniteGallery() {
	// Create duplicated item array for seamless looping
	const items = Array.from({ length: IMAGES.length * COPIES }, (_, i) => {
		const imageIndex = i % IMAGES.length;
		return {
			id: `item-${i}`,
			...IMAGES[imageIndex],
		};
	});

	// Measure container heights for modulo wrapping
	const [ref, { height }] = useMeasure();
	const [refRight, { height: heightRight }] = useMeasure();

	// Scroll state
	const scrollY = useMotionValue(INITIAL_OFFSET);
	const targetScrollY = useMotionValue(INITIAL_OFFSET);
	const [hasInitialKick, setHasInitialKick] = useState(false);
	const [isAutoScrolling, setIsAutoScrolling] = useState(true);

	// Left gallery - wraps using modulo at halfway point
	const yTranslation = useTransform(scrollY, (latest) => {
		if (!height) return 0;
		const halfHeight = height / 2;
		const wrapped = ((latest % halfHeight) + halfHeight) % halfHeight;
		return -wrapped;
	});

	// Right gallery - inverted scroll direction
	const yTranslationInverse = useTransform(yTranslation, (value) => {
		if (!heightRight) return 0;
		return -value - heightRight / 2;
	});

	// Initial kick animation
	useEffect(() => {
		const controls = animate(targetScrollY, [0, 300], {
			duration: 1,
			ease: [0.25, 0.46, 0.45, 0.94],
			onComplete: () => setHasInitialKick(true),
		});

		return () => controls.stop();
	}, [targetScrollY]);

	// Wheel control
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			setIsAutoScrolling(false);

			const currentTarget = targetScrollY.get();
			targetScrollY.set(currentTarget + e.deltaY);
		};

		window.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			window.removeEventListener("wheel", handleWheel);
		};
	}, [targetScrollY]);

	// Unified animation loop (auto-scroll + lerp)
	useEffect(() => {
		let rafId: number;

		const animate = () => {
			// Auto-scroll: increment target if enabled
			if (isAutoScrolling && hasInitialKick) {
				const current = targetScrollY.get();
				targetScrollY.set(current + AUTO_SCROLL_SPEED);
			}

			// Lerp: smooth interpolation
			const current = scrollY.get();
			const target = targetScrollY.get();
			const diff = target - current;

			if (Math.abs(diff) > 0.1) {
				scrollY.set(current + diff * LERP_FACTOR);
			}

			rafId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [isAutoScrolling, hasInitialKick, scrollY, targetScrollY]);

	return (
		<div className="flex h-screen w-screen select-none items-center justify-center gap-4 overflow-hidden bg-neutral-900">
			{/* Left gallery */}
			<div className="relative h-full w-[400px] overflow-hidden">
				<motion.div
					ref={ref}
					className="absolute inset-x-0 flex flex-col items-center gap-2 py-2"
					style={{ y: yTranslation }}
				>
					{items.map((item, idx) => (
						<div
							key={`left-1-${idx}`}
							className="relative aspect-square w-[350px] overflow-hidden rounded-xl shadow-lg"
						>
							<Image
								src={item.src}
								alt={item.alt}
								fill
								className="object-cover"
								sizes="350px"
							/>
						</div>
					))}
					{items.map((item, idx) => (
						<div
							key={`left-2-${idx}`}
							className="relative aspect-square w-[350px] overflow-hidden rounded-xl shadow-lg"
						>
							<Image
								src={item.src}
								alt={item.alt}
								fill
								className="object-cover"
								sizes="350px"
							/>
						</div>
					))}
				</motion.div>
			</div>

			{/* Right gallery (inverse) */}
			<div className="relative h-full w-[400px] overflow-hidden">
				<motion.div
					ref={refRight}
					className="absolute inset-x-0 flex flex-col items-center gap-2 py-2"
					style={{ y: yTranslationInverse }}
				>
					{items.reverse().map((item, idx) => (
						<div
							key={`right-1-${idx}`}
							className="relative aspect-square w-[350px] overflow-hidden rounded-xl shadow-lg"
						>
							<Image
								src={item.src}
								alt={item.alt}
								fill
								className="object-cover"
								sizes="350px"
							/>
						</div>
					))}
					{items.map((item, idx) => (
						<div
							key={`right-2-${idx}`}
							className="relative aspect-square w-[350px] overflow-hidden rounded-xl shadow-lg"
						>
							<Image
								src={item.src}
								alt={item.alt}
								fill
								className="object-cover"
								sizes="350px"
							/>
						</div>
					))}
				</motion.div>
			</div>
		</div>
	);
}

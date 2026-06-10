'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DemoCard from '../../components/DemoCard';
import ScrollReveal from '../../components/ScrollReveal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { demos } from '../../data/demos';

export default function AllDemosPage() {
	const [navHidden, setNavHidden] = useState(false);

	useEffect(() => {
		let lastY = window.scrollY;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const currentY = window.scrollY;
				const delta = currentY - lastY;
				if (currentY < 80) {
					setNavHidden(false);
				} else if (delta > 4) {
					setNavHidden(true);
				} else if (delta < -4) {
					setNavHidden(false);
				}
				lastY = currentY;
				ticking = false;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<div className="relative w-full min-h-screen bg-background text-foreground">
			<nav
				aria-label="Primary"
				className={`fixed top-4 left-1/2 z-50 border border-foreground/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 px-3 py-2.5 font-mono text-sm transition-transform duration-300 ease-out ${navHidden ? '-translate-x-1/2 -translate-y-[200%]' : '-translate-x-1/2 translate-y-0'}`}
			>
				<ul className="flex items-center gap-1 text-foreground/70">
					<li>
						<Link href="/" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
							home
						</Link>
					</li>
					<li>
						<Link href="/#scroll-target-aboutme" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
							about
						</Link>
					</li>
					<li>
						<Link href="/#scroll-target-contactme" className="nav-link inline-block px-3 py-1.5 hover:bg-foreground hover:text-background">
							contact
						</Link>
					</li>
				</ul>
			</nav>
			<div className="fixed right-4 top-4 z-50">
				<ThemeToggle />
			</div>

			<main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
				<header className="mb-12">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
						Demos
					</h1>
					<p className="mt-3 font-mono text-sm text-muted-foreground">
						{demos.length} {demos.length === 1 ? 'demo' : 'demos'} — interactive 3D experiments.
					</p>
				</header>

				<div className="grid gap-6 sm:grid-cols-2">
					{demos.map((demo, index) => (
						<ScrollReveal key={demo.id} delay={(index % 2) * 100} className="h-full">
							<DemoCard demo={demo} />
						</ScrollReveal>
					))}
				</div>

				<div className="mt-16 flex justify-center">
					<Link
						href="/"
						className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-5 py-2.5 font-mono text-sm text-foreground/80 hover:bg-foreground hover:text-background"
					>
						<ChevronLeft className="h-4 w-4" />
						back to home
					</Link>
				</div>
			</main>
		</div>
	);
}

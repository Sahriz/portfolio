'use client';

import Link from 'next/link';
import { Play, Sparkles } from 'lucide-react';
import type { Demo } from '../data/demos';

type DemoCardProps = {
	demo: Demo;
};

export default function DemoCard({ demo }: DemoCardProps) {
	return (
		<article className="demo-card-wrapper group relative flex h-full flex-col overflow-hidden rounded-xl demo-card-custom">
			{/* Animated gradient border background */}
			<div className="demo-card-border absolute inset-0 -z-10 opacity-0 group-hover:opacity-100" />

			{/* Main card content */}
			<div className="flex h-full flex-col border border-foreground/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-400/60 group-hover:bg-card/60 group-hover:shadow-lg group-hover:shadow-purple-500/10">
				{/* Top-right animated icon */}
				<div className="absolute right-4 top-4 text-foreground/20 transition-colors duration-300 group-hover:text-foreground/40">
					<Sparkles className="h-6 w-6 animate-demo-icon" />
				</div>

				<h3 className="text-xl font-bold tracking-tight text-foreground">{demo.title}</h3>
				<p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{demo.description}</p>
				<div className="mt-6 flex justify-end">
					<Link
						href={`/demos/${demo.id}`}
						className="demo-cta-link nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 transition-all duration-300 hover:scale-105"
					>
						<Play className="demo-cta-icon h-3.5 w-3.5" />
						view demo
					</Link>
				</div>
			</div>
		</article>
	);
}

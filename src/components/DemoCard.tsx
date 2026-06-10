'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import type { Demo } from '../data/demos';

type DemoCardProps = {
	demo: Demo;
};

export default function DemoCard({ demo }: DemoCardProps) {
	return (
		<article className="flex h-full flex-col border border-foreground/30 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-foreground/60 hover:bg-card/60">
			<h3 className="text-xl font-bold tracking-tight text-foreground">{demo.title}</h3>
			<p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{demo.description}</p>
			<div className="mt-6 flex justify-end">
				<Link
					href={`/demos/${demo.id}`}
					className="nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 hover:bg-foreground hover:text-background"
				>
					<Play className="h-3.5 w-3.5" />
					view demo
				</Link>
			</div>
		</article>
	);
}

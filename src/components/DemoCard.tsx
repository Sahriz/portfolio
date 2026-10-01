import Link from 'next/link';
import { Play, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Demo } from '../data/demos';

type DemoCardProps = {
	demo: Demo;
};

export default function DemoCard({ demo }: DemoCardProps) {
	return (
		<article className="group relative flex h-full flex-col border border-foreground/30 bg-card/40 p-6 glow-card glow-card-demo">
			{/* Invisible link covering the whole card. */}
			<Link
				href={`/demos/${demo.id}`}
				aria-label={`Open ${demo.title} demo`}
				className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
			/>
			<div className="absolute right-4 top-4 text-foreground/20 glow-icon">
				<Sparkles className="h-6 w-6" />
			</div>

			<h3 className="pr-8 text-xl font-bold tracking-tight text-foreground">{demo.title}</h3>
			<p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">{demo.description}</p>
			<div className="mt-6 flex justify-end">
				{/* Looks like a button, but the stretched link above does the work. */}
				<span
					aria-hidden
					className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-follow')}
				>
					<Play className="h-3.5 w-3.5" />
					view demo
				</span>
			</div>
		</article>
	);
}

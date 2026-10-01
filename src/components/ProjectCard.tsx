'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Joystick } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { Project } from '../data/projects';

type ProjectCardProps = {
	project: Project;
	index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [visible, setVisible] = useState(false);
	const [mediaLoaded, setMediaLoaded] = useState(false);
	const isVideo = project.image.endsWith('.webm');

	// A cached or locally served video reaches canplay before React attaches
	// the onCanPlay handler, so the event is missed and the element stays at
	// opacity 0 forever. Catch the already-ready case on mount.
	useEffect(() => {
		const el = videoRef.current;
		if (el && el.readyState >= 3) setMediaLoaded(true);
	}, []);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const staggerDelay = `${(index % 3) * 0.1}s`;

	return (
		<div
			ref={wrapperRef}
			className={`project-card-reveal ${visible ? 'project-card-reveal-visible' : ''} h-full`}
			style={{ transitionDelay: visible ? staggerDelay : '0s' }}
		>
			<article className="group relative flex h-full flex-col overflow-hidden border border-foreground/30 bg-card text-card-foreground glow-card glow-card-project">
				{/* Invisible link covering the whole card. z-10 puts it above the
				    media and text; the actions row sits above it at z-20. */}
				<Link
					href={`/projects/${project.id}`}
					aria-label={`Open ${project.title}`}
					className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
				/>
				<div className="relative h-52 overflow-hidden bg-muted/20">
					{isVideo ? (
						<video
							ref={videoRef}
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
							onCanPlay={() => setMediaLoaded(true)}
							className={`h-full w-full object-cover transition-opacity duration-500 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
						>
							<source src={project.image} type="video/webm" />
						</video>
					) : (
						<Image
							src={project.image}
							alt={project.title}
							fill
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover transition-opacity duration-500"
							onLoad={() => setMediaLoaded(true)}
						/>
					)}
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background/90" />
				</div>
				<div className="flex flex-1 flex-col gap-2 px-6 pb-4 pt-4">
					<div className="flex items-start justify-between gap-4">
						<h3 className="flex-1 text-xl font-semibold leading-tight tracking-tight">{project.title}</h3>
						<div className="mt-1 border border-foreground/15 bg-background/50 p-2 text-foreground/30 glow-icon-box">
							<Joystick className="h-4 w-4" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
				</div>
				<div className="mt-auto flex items-center justify-end gap-2 px-6 pb-6">
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-source glow-cta-follow relative z-20')}
					>
						source ↗
					</a>
					{/* Looks like a button, but the stretched link above does the work. */}
					<span
						aria-hidden
						className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-follow')}
					>
						<Joystick className="h-3.5 w-3.5" />
						view project
					</span>
				</div>
			</article>
		</div>
	);
}

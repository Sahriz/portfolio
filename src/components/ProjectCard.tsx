'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
	const isVideo = project.image.endsWith('.webm');

	// Scroll-reveal: fires once, the first time the card enters the viewport.
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

	// The video downloads nothing until it scrolls into view (preload="none"
	// plus a poster), then plays only while on screen.
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// play() rejects if the browser blocks autoplay; the poster stays up.
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.25 }
		);
		observer.observe(video);
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
				<div className="relative aspect-video overflow-hidden bg-muted/20">
					{isVideo ? (
						<video
							ref={videoRef}
							loop
							muted
							playsInline
							preload="none"
							poster={project.poster}
							className="h-full w-full object-cover"
						>
							<source src={project.image} type="video/webm" />
						</video>
					) : (
						<Image
							src={project.image}
							alt={project.title}
							fill
							// Only the first row is likely to be near the fold.
							priority={index < 3}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
					)}
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-card" />
				</div>
				<div className="flex flex-1 flex-col px-6 pb-4 pt-4">
					<h3 className="text-xl font-semibold leading-tight tracking-tight">
						{project.title}
						{project.status === 'in-progress' && (
							<span className="ml-2 inline-block border border-brand/45 px-1.5 py-1 align-middle font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-brand">
								in progress
							</span>
						)}
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{project.description}</p>
					<ul className="mt-3.5 flex flex-wrap gap-1.5">
						{project.tags.map((tag) => (
							<li
								key={tag}
								className="border border-foreground/15 px-[7px] py-[5px] font-mono text-[11px] leading-none text-foreground/70"
							>
								{tag}
							</li>
						))}
					</ul>
				</div>
				<div className="mt-auto flex flex-wrap items-center gap-2 px-6 pb-6">
					{/* Looks like a button, but the stretched link above does the work. */}
					<span
						aria-hidden
						className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'glow-cta glow-cta-follow')}
					>
						details →
					</span>
					{project.link && (
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-source glow-cta-follow relative z-20')}
						>
							source ↗
						</a>
					)}
					{project.demo && (
						<a
							href={project.demo}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(buttonVariants({ size: 'sm' }), 'glow-cta glow-cta-demo glow-cta-follow relative z-20')}
						>
							demo ↗
						</a>
					)}
				</div>
			</article>
		</div>
	);
}

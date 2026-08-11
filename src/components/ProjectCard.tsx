'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Joystick } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
			className={`project-card-reveal ${visible ? 'project-card-reveal-visible' : 'opacity-0 translate-y-8 scale-[0.98]'} h-full`}
			style={{ transitionDelay: visible ? staggerDelay : '0s' }}
		>
				<Card className="project-card-custom flex h-full flex-col overflow-hidden rounded-xl border border-foreground/30 bg-card text-card-foreground shadow-sm transition-all duration-300">
				<CardContent className="p-0">
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
				</CardContent>
					<CardHeader className="gap-2 pb-4 pt-4 flex-1">
						<div className="flex items-start justify-between gap-4">
							<CardTitle className="flex-1 text-xl font-semibold leading-tight">{project.title}</CardTitle>
							<div className="pointer-events-none mt-1 rounded-full border border-foreground/15 bg-background/50 p-2 text-foreground/30 backdrop-blur-sm transition-all duration-300 project-card-icon">
								<Joystick className="h-4 w-4" />
							</div>
						</div>
					<p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
				</CardHeader>
				<CardFooter className="mt-auto flex justify-end pt-0">
					<Link
						href={`/projects/${project.id}`}
						className="project-cta-link nav-link inline-flex items-center gap-2 border border-foreground/60 px-3 py-1.5 font-mono text-xs text-foreground/80 transition-all duration-300 hover:scale-105"
					>
						<Joystick className="project-cta-icon h-3.5 w-3.5" />
						view project
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { Project } from '../data/projects';

type ProjectCardProps = {
	project: Project;
	index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	const [mediaLoaded, setMediaLoaded] = useState(false);
	const isVideo = project.image.endsWith('.webm');

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
			<Card className="project-card-custom flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300">
				<CardContent className="p-0">
					<div className="relative h-52 overflow-hidden bg-muted/20">
						{isVideo ? (
							<video
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
								onLoadingComplete={() => setMediaLoaded(true)}
							/>
						)}
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background/90" />
					</div>
				</CardContent>
				<CardHeader className="gap-2 pb-4 pt-4 flex-1">
					<CardTitle className="text-xl font-semibold leading-tight">{project.title}</CardTitle>
					<p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
				</CardHeader>
				<CardFooter className="mt-auto flex justify-end pt-0">
					<Button asChild variant="secondary">
						<Link href={`/projects/${project.id}`}>Read more</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

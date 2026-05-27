'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { Project } from '../data/projects';

type ProjectCardProps = {
	project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
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
			{ threshold: 0.15 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={wrapperRef}
			className={`project-card-reveal ${visible ? 'project-card-reveal-visible' : ''} h-full`}
		>
			<Card className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
				<CardContent className="p-0">
					<div className="relative h-52 overflow-hidden">
						{isVideo ? (
							<video
								autoPlay
								loop
								muted
								playsInline
								className="h-full w-full object-cover"
							>
								<source src={project.image} type="video/webm" />
								Your browser does not support the video tag.
							</video>
						) : (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={project.image}
								alt={project.title}
								className="h-full w-full object-cover"
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

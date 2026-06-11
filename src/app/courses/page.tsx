'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import PrimaryNav from '../../components/PrimaryNav';
import { ThemeToggle } from '../../components/ThemeToggle';
import { courses, CATEGORY_ORDER, type CourseCategory } from '../../data/courses';

type Filter = 'All' | CourseCategory;

const filters: Filter[] = ['All', ...CATEGORY_ORDER];

export default function CoursesPage() {
  const [filter, setFilter] = useState<Filter>('All');

  const filteredCourses = useMemo(
    () => (filter === 'All' ? courses : courses.filter((c) => c.category === filter)),
    [filter]
  );

  const totalHP = useMemo(() => courses.reduce((sum, c) => sum + c.credits, 0), []);

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground">
      <PrimaryNav />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Coursework
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            {courses.length} courses · {totalHP} HP total
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`border border-foreground/60 px-3 py-1.5 font-mono text-xs transition-colors ${
                  active
                    ? 'bg-foreground text-background'
                    : 'text-foreground/70 hover:bg-foreground hover:text-background'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="border border-foreground/30">
          <div className="grid grid-cols-[1fr_3rem_4rem_3rem_3rem] items-center gap-3 border-b border-foreground/30 bg-foreground/[0.03] px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
            <span>Course</span>
            <span className="text-center">Level</span>
            <span className="text-right">Year</span>
            <span className="text-right">HP</span>
            <span className="text-right">Grade</span>
          </div>
          {filteredCourses.map((course) => (
            <div
              key={`${course.name}-${course.date}`}
              className="grid grid-cols-[1fr_3rem_4rem_3rem_3rem] items-baseline gap-3 border-b border-foreground/10 px-4 py-3 font-mono text-sm transition-colors last:border-b-0 hover:bg-foreground/[0.04]"
            >
              <span className="text-foreground/90">{course.name}</span>
              <span
                className="text-center text-foreground/60"
                title={course.level === 'A' ? 'Avancerad nivå (Master’s)' : 'Grundnivå (Bachelor’s)'}
              >
                {course.level}
              </span>
              <span className="text-right text-foreground/60 tabular-nums">{course.date.split('-')[0]}</span>
              <span className="text-right text-foreground/60 tabular-nums">{course.credits}</span>
              <span className="text-right font-bold text-foreground tabular-nums">{course.grade}</span>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div className="px-4 py-6 text-center font-mono text-sm text-foreground/50">
              No courses in this category.
            </div>
          )}
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

'use client'

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function ProjectPage(props0: ProjectPageProps) {
  const params = use(props0.params);
  const [content, setContent] = useState<string>('');
  const { projectId } = params;

  // Mapping for project IDs to README folder names
  const getReadmePath = (id: string): string => {
    const mapping: Record<string, string> = {
      TerrainLibrary: 'TerrainLib',
      Portals: 'Portal',
    };

    const folderName = mapping[id] || id;
    return `/projects/${folderName}/README.md`;
  };

  useEffect(() => {
    fetch(getReadmePath(projectId))
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then((text) => setContent(text))
      .catch(() => setContent('# Error\nCould not load README.'));
  }, [projectId]);

  return (
    <>
      <Link href="/" className="back-to-home-btn">&#8592; Back to Home</Link>
      <div className="markdown-content">
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
            h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
            h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
            p: ({node, ...props}) => <p className="markdown-p" {...props} />,
            ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
            li: ({node, ...props}) => <li className="markdown-li" {...props} />,
            a: ({node, ...props}) => <a className="markdown-a" {...props} />,
            img: ({node, ...props}) => <img className="markdown-img" {...props} />,
            video: ({node, ...props}) => <video className="markdown-video" controls {...props} />,
            code: ({node, ...props}) => <code className="markdown-code" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
          }}
        />
      </div>
    </>
  );
}

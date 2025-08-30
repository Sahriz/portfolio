import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectReader({ projectId }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!projectId) return;
    const fetchUrl = `/projects/${projectId}/README.md`;
    let cancelled = false;

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((error) => {
        console.error('Error fetching README:', error);
        if (!cancelled) setContent(`# Error\nCould not load README for ${projectId}.`);
      });

    return () => { cancelled = true; };
  }, [projectId]);

  return (
    <div className="project-details">
      <div className="project-detail-content">
        <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
}
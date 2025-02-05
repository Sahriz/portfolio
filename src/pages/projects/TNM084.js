import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ProjectDetails = () => {
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    const projectId = 'TNM084'; // Hardcoded project ID
    console.log('Project ID:', projectId); // Debugging log

    if (projectId) {
      const fetchUrl = `/projects/${projectId}/README.md`;
      console.log('Fetching URL:', fetchUrl); // Debugging log

      fetch(fetchUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((text) => {
          console.log('Fetched README content:', text); // Debugging log
          setContent(text);
        })
        .catch((error) => console.error('Error fetching README:', error));
    }
  }, []);

  return (
    <div className="project-details">
        <div className="project-detail-content">
      <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
        </div>
    </div>
  );
};

export default ProjectDetails;
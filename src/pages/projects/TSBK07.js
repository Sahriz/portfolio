import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProjectReader from '../../components/ProjectReader';

export default function TSBK07() {
  return <ProjectReader projectId="TSBK07" />;
}


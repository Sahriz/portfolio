import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import ShaderBanner from '../components/ShaderBanner';
import projects from '../data/projects';

export default function Portfolio() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [canvasZIndex, setCanvasZIndex] = useState(9);
  useEffect(() => {
    const handleScroll = () => {
      const canvas = document.querySelector('.canvas-container');
      const overlayText = document.querySelector('.overlayText');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = 300; // Adjust as needed for scroll-based fade-out

      // Calculate opacity for scroll (both canvas and text fade out together)
      const opacity = Math.max(0, 1 - scrollTop / maxScroll);

      // Apply opacity changes for canvas and overlayText (fade in/out with scroll)
      if (canvas) canvas.style.opacity = opacity;
      if (overlayText) {
        // Disable transition for scroll fade-out
        overlayText.style.transition = "none";
        overlayText.style.opacity = opacity;
      }

      // Change z-index when opacity is zero
      if (opacity === 0) {
        setCanvasZIndex(-1);
      } else {
        setCanvasZIndex(9);
      }
    };

    // Fade-in the overlay text after 5 seconds
    const fadeInTimeout = setTimeout(() => {
      const overlayText = document.querySelector('.overlayText');
      if (overlayText) {
        overlayText.style.transition = "opacity 2s ease-out"; // Smooth fade-in
        overlayText.style.opacity = 1; // Set opacity to 1 after 5 seconds
      }
    }, 5000); // 5 seconds delay for the fade-in

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the timeout and event listener on component unmount
    return () => {
      clearTimeout(fadeInTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  const MeshComponent = () => {
    useFrame(() => {
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    return (
      <mesh>
        <planeGeometry args={[25, 25, 1250, 1250]} />
        <ShaderBanner />
      </mesh>
    );
  };
  
  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      
      {/* Apply the CSS class to control size */}
      <div className="canvas-container" style={{ zIndex: canvasZIndex }}>
      
      <Canvas
          gl={{ alpha: false, antialias: true }}
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          camera={{ position: [0, 0, 10], fov: 75 }} // Adjust camera if needed
        >
          
          <MeshComponent />
            
          
        </Canvas>
     
      </div>
      {isInitialized && (
        <>
       {/* Overlay Text */}
       <div className="overlayText">
        <h1 className="title" style={{color: 'white'}}>Jonatan Ebenholms Portfolio</h1>
        <p className="subtitle">A list of my more recent and interesting projects.</p>
      </div>

      {/* Projects grid */}
      <div className='padder'>
        <div className="projectContainer projectsGrid move-down">
          {projects.map((project, index) => (
            <a key={index} href={project.link} className="projectLink">
              <img src={project.image} alt={project.title} className="projectImage" />
              <h2 className="projectTitle">{project.title}</h2>
              <p className="projectDescription">{project.description}</p>
            </a>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
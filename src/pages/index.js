import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import ShaderBanner from '../components/ShaderBanner';
import projects from '../data/projects';
import Link from 'next/link';

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
    }, 2000); // 5 seconds delay for the fade-in

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
            <h1 className="title" style={{ color: 'white' }}>Jonatan Ebenholm's Portfolio</h1>
            <a href = "#scroll-target-projects">
              <div style={{ display: 'inline-block', backgroundColor: 'black', width: '45%', opacity: '0.8', marginRight: '10px' , borderRadius: '10px', border: '1px solid white'}}>
                <p className="subtitle">My projects</p>
            ¨ </div>
            </a>
            <a href = "#scroll-target-aboutme">
              <div style={{ display: 'inline-block', backgroundColor: 'black', width: '45%', opacity: '0.8', marginRight: '10px' , borderRadius: '10px', border: '1px solid white'}}>
                <p className="subtitle">About me</p>
            ¨ </div>
            </a>
          </div>

          {/* Projects grid */}
         
            <div className="projectContainer projectsGrid move-down" id="scroll-target-projects">
              {projects.map((project, index) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="projectLink">
                  <div>
                    <img src={project.image} alt={project.title} className="projectImage" />
                    <h2 className="projectTitle">{project.title}</h2>
                    <p className="projectDescription">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/*About Me */}
            <div className="Aboutme-Container" id="scroll-target-aboutme">
              <h1 className="Aboutme-Title">About Me</h1>
              <p className="Aboutme-Content">I am a fourth year student at Linköpings University studying to
                become a Master of Science in Media Technology and Enginering.
                During my masters program i am specializing in Computer Graphics,
                video game programming and fill in the gaps with machine learning and AI. I originally
                got into computer graphics as a way to combine my love for drawing with coding,
                since I, in my younger age, considered that a more usefull skill to have. Today my love for computer graphics and
                coding has surpassed my love for drawing, but I still do draw, for a paper in fact. The 
                paper is called LiTHanian and can be found in the link below. I grew up in Västerås
                but moved to Norrköping to pursue my studies. On my free time I've recently picked
                up a habit of starting new personal coding projects, one of the better looking ones being
                a WIP of portals that I am showcasing in my projects list above. Otherwise I enjoy playing video games, going to the gym
                or socializing with my friends.
              </p>
              {/*LiTHanian*/}
              <div className = "bottom">
                <a href = "https://lithanian.se/redaktionen/" style = {{ }}><h2>LiThanian</h2></a>
                <a href = "https://github.com/Sahriz"><h2>Github.com/Sahriz</h2></a>
                </div>
            </div>
            
            {/*Skills*/}
            <div style = {{paddingBottom: '10%'}} >
              <h1 className="skills">Skills</h1>
              <div style = {{  marginLeft: '23%'}}> 
              <img className = 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" />
              <img className = 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg" />
              <img className= 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg" />
              <img className = 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg" />
              <img className = 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" />
              <img className = 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg" />
              <img className = 'skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opengl/opengl-original.svg" />
          
          
              </div>
            </div>
          
            
        </>
      )}
    </div>
  );
}
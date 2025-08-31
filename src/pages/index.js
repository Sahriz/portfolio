import React, { useRef } from 'react';
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import ShaderBanner from '../components/ShaderBanner';
import Background from '../components/Background';
import Link from 'next/link';
import projects from '../data/projects';

export default function Portfolio() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [canvasZIndex, setCanvasZIndex] = React.useState(9);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const spinRef = useRef(0); // This is the spin angle
  const dragStartSpin = useRef(0);
  const dragLastX = useRef(0);
  const dragLastTime = useRef(0);
  const spinVelocity = useRef(0); // Angular velocity
  const canvasRef = useRef();
  const timeSpinDir = useRef(1); // 1 or -1, direction of time-based spin
  // Mouse drag handlers for rotating ShaderBanner
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let lastTime = performance.now();
    let animating = true;
    const handlePointerDown = (e) => {
      if (e.target.closest('.hero-outline-btn')) return;
      isDragging.current = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragStartX.current = clientX;
      dragStartSpin.current = spinRef.current;
      dragLastX.current = clientX;
      dragLastTime.current = performance.now();
      spinVelocity.current = 0;
      document.body.style.userSelect = 'none';
    };
    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - dragStartX.current;
      spinRef.current = dragStartSpin.current - deltaX * 0.005;
      // If user drag direction is opposite to time spin, update timeSpinDir
      const dragVel = -(clientX - dragLastX.current) * 0.005 / ((performance.now() - dragLastTime.current) / 1000 || 1);
      if (Math.abs(dragVel) > 0.001 && Math.sign(dragVel) !== timeSpinDir.current) {
        timeSpinDir.current = Math.sign(dragVel);
      }
      // Calculate velocity
      const now = performance.now();
      const dt = (now - dragLastTime.current) / 1000;
      if (dt > 0) {
  spinVelocity.current = -(clientX - dragLastX.current) * 0.005 / dt;
      }
      dragLastX.current = clientX;
      dragLastTime.current = now;
    };
    const handlePointerUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
    };
    // Animate spin when not dragging
    function animateSpin() {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (!isDragging.current) {
        const absVel = Math.abs(spinVelocity.current);
        if (absVel > 0.1) {
          spinRef.current += spinVelocity.current * dt;
          spinVelocity.current *= 0.96;
        } else if (absVel > 0.01) {
          // Smooth fade between velocity and time-based spin
          const blend = (absVel - 0.01) / (0.1 - 0.01);
          spinRef.current += blend * spinVelocity.current * dt + (1 - blend) * dt * 0.125 * timeSpinDir.current;
          spinVelocity.current *= 0.96;
        } else {
          spinRef.current += dt * 0.125 * timeSpinDir.current;
        }
      }
      if (animating) requestAnimationFrame(animateSpin);
    }
    animating = true;
    requestAnimationFrame(animateSpin);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      animating = false;
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      document.body.style.userSelect = '';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const canvas = document.querySelector('.canvas-container');
      const overlayText = document.querySelector('.overlayText');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = 300; // Adjust as needed for scroll-based fade-out

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

  // Restore original MeshComponent with planeGeometry and ShaderBanner
  const MeshComponent = () => {
    useFrame(() => {
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });
    return (
      <mesh position={[0, 2, -2]}>
        <planeGeometry args={[25, 25, 1250, 1250]} />
        <ShaderBanner spinRef={spinRef} />
      </mesh>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      {/* Banner Canvas with overlays */}
  <div className="canvas-container" ref={canvasRef} style={{ zIndex: canvasZIndex, height: "75vh", pointerEvents: 'auto' }}>
        <Canvas
          gl={{ alpha: false, antialias: true, clearColor: '#ffffff' }}
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [0, 2, 12], fov: 20, near: 0.1, far: 1000 }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={0.7} />
          {/* Background gradient mesh */}
          <mesh position={[0, 0, -25]}>
            <planeGeometry args={[250, 250]} />
            <Background />
          </mesh>
          <MeshComponent />
        </Canvas>
        {/* Gradient overlay for subtle effect */}
        <div className="canvas-gradient-overlay" />
        {/* Bottom fade for smooth transition */}
        <div className="canvas-bottom-fade" />
        {/* Overlay Text */}
        <div className="overlayText">
          <h1 className="title">Jonatan Ebenholm's Portfolio</h1>
          <a className='subtitle'>5th year student as Master of Science in Media Technology and Engineering</a>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', pointerEvents: 'auto' }}>
            <a href="#scroll-target-projects" className="hero-outline-btn">My projects</a>
            <a href="#scroll-target-aboutme" className="hero-outline-btn">About me</a>
            <a href="#scroll-target-contactme" className="hero-outline-btn">Contact me</a>
          </div>
        </div>
  </div>
  <div className="below-canvas-gradient" />
      {/* Main Content */}
      {isInitialized && (
        <>
          {/* Projects grid */}
          <div className="projectContainer projectsGrid move-down" id="scroll-target-projects">
            {projects.map((project, index) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="projectLink">
                <div className="projectCard">
                  <div className="projectImageWrapper">
                    {project.image && project.image.endsWith('.webm') ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        //poster={project.image.replace('.webm', '.png')}
                        className="projectImage"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      >
                        <source src={project.image} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="projectImage"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                  </div>
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
            
          </div>
          {/*Skills*/}
          <div style = {{paddingBottom: '10%'}} >
            <h1 className="skills">Skills</h1>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="skills-icons-row" style={{  margin: '0 auto' }}>
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" />
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg" />
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg" />
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg" />
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" />
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original.svg" />
                  <img className='skillIcon' src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opengl/opengl-original.svg" />
                </div>
              </div>
          </div>
        </>
      )}
    {/* Contact Bar at the bottom of the page */}
    <footer className="contact-bar-bottom">
      <div className="contact-bar-content" id="scroll-target-contactme">
        <span><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jonatan-ebenholm-904222343/" target="_blank" rel="noopener noreferrer">Jonatan Ebenholm</a></span>
        <span style={{ marginLeft: '2rem' }}><strong>Phone:</strong> <a>+46 70 7789107</a></span>
        <span style={{ marginLeft: '2rem' }}><strong>Email:</strong> <a href="mailto:ebenholmdev@gmail.com">ebenholmdev@gmail.com</a></span>
        <span style={{ marginLeft: '2rem' }}><strong>CV:</strong> <a href="/JonatanEbenholmCV.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a></span>
        <span style={{ marginLeft: '2rem' }}><strong>GitHub:</strong> <a href="https://github.com/Sahriz" target="_blank" rel="noopener noreferrer">Sahriz</a></span>
      </div>
    </footer>
  </div>
  );
}

const projects = [
    {
      title: "Procedurally Generated Terrain",
      description: "A real-time infinite procedurally generated world using perlin noise in Unity utilising C#. The project was made for the course TNM084 at LIU.",
      image: "/PlayerCharacterView.png",
      link: "https://github.com/Sahriz/InfiniteWorld"
    },
    {
      title: "Pathtracer",
      description: "A photo-realistic pathtracing renderer written in C++ using the CPU for the course TNCG15 at LIU.",
      image: "/1600x1600RayTracer.png",
      link: "https://github.com/eLdOchLagor/TNCG15-Monte-Carlo-Pathtracer"
    },
    {
      title: "Solar system simulation",
      description: "A Blender Python addon that adds an UI and allow the user to simulate and automatically animate a solar system. It also adds materials to the planets. Blender has a tendacy to update their API, so the code might not work with the latest version of Blender.",
      image: "/RedoVisning4.png",
      link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file"
    },
    {
      title: "WIP: Pathtracer on GPU",
      description: "A photo-realistic pathtracer written in C++ using OpenGL. It is a work in progress and is a project made for the course TSKB07 at LIU. Currently, without optimization, it is still generating around 14 images per second on my 1070. Also worth noting is that we have to use a library which chatGPT doesn't recognise, which is why on github it says that the code uses C, but all of that would be OpenGL or C++ otherwise.",
      image: "/GpuPathTracer.png",
      link: "https://github.com/eLdOchLagor/TSBK07-Raytracer"
    }
    ,
    {
      title: "WIP: Portals",
      description: "A little side-project where I am trying to implement portals in Unity. It is still a work in progress, so you can't enter them yet, but they still look pretty.",
      image: "/PortalGif.gif",
      link: "https://github.com/Sahriz/BlenderSolarsystemSim?tab=readme-ov-file"
    }
  ];
  export default projects;
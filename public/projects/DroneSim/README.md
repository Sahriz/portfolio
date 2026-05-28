# DroneSim

> ⚠️ This repository doesn't have a written README on GitHub yet. The page below is a stub — the figures are progress shots from local development. When a real README is pushed to the repo, it can replace this file.

Autonomous drone navigating procedurally generated terrain in C++ / OpenGL. A control loop steers the drone through the simulated environment in real time, with the surrounding world meshed on the fly using marching cubes over a 3D scalar field.

## Progress

<video src="/images/DroneSim/marchingCubesImproved.webm" autoplay loop muted playsinline width="100%"></video>

*Improved marching-cubes meshing in motion — smoother surfaces and fewer artifacts at the chunk seams compared to the initial implementation.*

![Absolute world-space normals debug visualization](/images/DroneSim/absnormals.png)

*Debug pass: absolute world-space normals shaded directly onto the terrain to verify that the marching-cubes output looks correct before any lighting is applied.*

![Terrain scale calibration](/images/DroneSim/scale.png)

*Sizing the procedural terrain chunks relative to the drone — used for collision tests and tuning the navigation control loop.*

## Tech stack

- **Language:** C++
- **Graphics:** OpenGL with GLSL shaders
- **Terrain:** Marching cubes on a 3D scalar field
- **Build:** CMake

[View source on GitHub →](https://github.com/Sahriz/DroneSim)

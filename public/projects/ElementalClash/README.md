
# Terrain Library for c++

## Overview
This project is a WIP library for personal use, but open for anyone to use or modify. Its purpose is to have a plethora of easy single call functions that can generate terrain for future game projects that I might have, and for debugging and testing purposes has demos to show the intent and possible use of the library.

## Current Features
- **Heightmap generation on CPU or GPU**: The CPU and GPU implementation are very similar, with the only difference being that the CPU version is not optimized and simply exists as a way to debug if the GPU version works or not. 
- **Marching Cubes 3D terrain Generation on CPU or GPU**: 
- **VoxelCube terrain Generation on GPU**: 

## Technologies Used
- **C++**: C++ is a high level, general-purpose programming language.
- **OpenGL Graphics pipeline**: OpenGL (Open Graphics Library) is a cross language, cross-platform API for rendering 2D and 3D vector graphics. Typically used for graphics, the render pipeline works almost entirelly on the GPU, allowing for super fast rendering.
- **OpenGL ComputeShaders/Gpu Programming**: Compute shaders have been core to OpenGL since version 4.3, and are a way to program using the GPU as opposed to the CPU, which allows for parallel programming which can speed up certain tasks by making the task go from a linear time complexity to a constant time complexity (kind of).
- **Premake**: A build language that helps set up the paths for the c++ program. 
### A showcase of the portal in its current form
![image](../../images/Portal/PortalGif.gif)


## TODO List
- **Make shadows pass through portal**: 
- **Slice gameobjects to allow smooth transition of objects**: 
- **Portal effect when switching links**: 

## [Back To Start Page](/)


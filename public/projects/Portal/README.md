
# Portals

## Overview
This is a work in progress passion project where I try to recreate a portal effect. I was inspired by *Sebastian Lague* on youtube, and one of my favorite games ever is *Portal 2*, and I was reminded of this sort of effect while watching gameplay of *Marvel Rivals*. The portals are as of right now fully functional! They are missing some things that would make them better though. So I'll write my TODO list below on things to fix.

## Current Features
- **Realistic Looking Portal Surfaces**: The surfaces of the portal are actually image textures that are rendered from two different cameras that move in unison with the player, one camera for each portal. The portal surface, which is really just a very thin cube, has its' texture coordinates manipulated to match with the part of the image texture that contains the portal surface. This gives a near perfect illusion of a portal surface. 
- **Teleportation in line with physics loop**: The teleportation happens during the physics frames which makes the portal teleportation very smooth. This will be great for future development where I will implement more physics interaction with the portal.


## Technologies Used
- **Unity**: An all purpose game engine which hosts powerfull tools for most usecases.  
### A showcase of the portal in its current form
![image](../../images/Portal/PortalGif.gif)


## TODO List
- **Make shadows pass through portal**: Currently, the shadows are cut of by the portal sufrace and are not rendering on the other side of the portal. This is most likely something I will fix using a shader.
- **Slice gameobjects to allow smooth transition of objects**: Currently, if another gameobject moves through the portal, it looks horrible as an onlooker, this can be fixed by slicing the object where it intersects the portal surface, and then duplicating its visuals to the other side of the other portal, allowing it to appear in two spots at once, but only working with one physics object. 
- **Portal effect when switching links**: I want portals to be able to, in real time, switch its target portal to new one. This would probably look pretty lame if the portal just turned on a switch, and BAM, new portal surface. I want to make a shader that handles transitions between portals, to make it smoother and prettier.

## [Back To Start Page](/)


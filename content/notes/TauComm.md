---
title: Project; Tau40K
Date: 2024-11-03
layout: wiki-single
---
il be chronicling my process and thoughts of making a [Risk of Rain 2](https://store.steampowered.com/app/632360/Risk_of_Rain_2/) [Skin](https://en.wikipedia.org/wiki/Skin_(video_games)) [Mod](https://en.wikipedia.org/wiki/Video_game_modding). 

For this project, I’ll be creating the [Tau Commander](https://warhammer40k.fandom.com/wiki/T'au_Commander) from the Warhammer 40K series for a community-made character, [Paladin](https://thunderstore.io/package/Paladin_Alliance/PaladinMod/).

![Tau Paladin](https://lh3.googleusercontent.com/d/1V6NBo23DLPnV5vyUbfKB1c75Bwlf1Bnl)

---
# Process

## 1. Concept and Design
As with all my projects, I started by drafting a visual design. I based the skin on the iconic Tau hero, Commander Farsight. While there are references available on the Games Workshop Marketplace, they lack clarity. To overcome this, I collaborated with my friend, artist and animator [NoahSingka](https://www.instagram.com/noahsingka/), who created a detailed concept sketch.

![Sketch](https://lh3.googleusercontent.com/d/181V7BhJH0onfgh-P0h9EAhydOozd-ohK)
 

## 2. Acquiring Base Rig
Since this approach requires reusing the armature/rig of the character being modded, I need to get Paladin's Armature. Since Paladin is a community-made character, the base model is publicly available on Github, making the process more accessible.
 
## 3. Modeling in Blender
I moved into Blender, beginning with blocking out the basic shapes and progressively adding details. *Risk of Rain 2* employs a low-poly art style, allowing for creative liberties, such as disconnected head structures and exaggerated proportions. This freedom aligns perfectly with the game's aesthetic and helped streamline the design process.

One major challenge was adapting the Tau Commander’s top-heavy design to Paladin’s realistic proportions. I resolved this by tweaking armor sizes to mask the differences effectively. Due to the scarcity of accurate references, I also took liberties with the design.

Midway through the process, I identified some design errors. As Noah had warned, inaccuracies were inevitable given the limited references. Adjustments were made to correct these issues before moving on.
 

## 4. Vertex Painting 
Vertex painting was used to apply base colors to the model. This technique adheres well to deformations and eliminates the need for initial textures. It’s a straightforward and effective approach for low-poly models like this one.
 

## 5. Weight Painting
Since the model is robotic, weight painting was relatively simple. I applied single-weight painting to the mesh. However, mirroring issues and rig naming conventions caused some confusion, requiring additional troubleshooting.
 

## 6. UV Unwrapping
Next, I UV-unwrapped the model, a meticulous process that involved placing seams on various parts of the mesh. This step took several hours, but the result was a somewhat workable UV map.

*mind you i am still figuring out on how to plan out Topology and UV maps properly. til then, here's the best i could do.*
{class="small"}

![Character UV Map, Character Seams Only](https://lh3.googleusercontent.com/d/1bOvGcgsltmT_8mgOxx5aXdjHMP1rYh-b)
 

## 7. Texturing in Substance Painter
After baking the vertex colors into an image, I imported the model into Adobe Substance Painter. Before painting, I ensured the mesh normals were correct and baked the mesh maps. Being a robot, the challenge was balancing a shiny yet rugged appearance. Normal maps were used to enhance visual details like indents and bolts without increasing polygon count.

Substance Painter’s high-resolution previews were particularly satisfying:

![Substance Painter Screenshot](https://lh3.googleusercontent.com/d/1CWY39XhNOhgmyOtmqagkB0cKnDn1lnww)

The textures were exported in the following formats:
- **Diffuse Texture** (with Specular in the alpha channel)
- **Normal Map** (DirectX format)

These formats match the shader conventions of *Risk of Rain 2*. Although Blender loses some texture detail during import, this was not a priority.
 

## 8. Sword Design
I modified Paladin’s base sword, leveraging its existing weight paint to save time. The design was inspired by Commander Farsight’s signature sword, for which I had ample references. Texturing followed the same process as the body.
 

## 9. Integration in Unity
The model and textures were imported into Unity 2019. I created new categories for the skin, set up specialized materials to match the game’s shaders, and configured everything according to *Risk of Rain 2* conventions. Using the community-made Skin Builder Tool, The final output was compiled as a .DLL file.

![Unity Pics](https://lh3.googleusercontent.com/d/1jHeDDBdsALWUnckUPCcqMnbJbDhtdpYK)
 

## 10. Final Testing
Using R2modman, I launched the game in modded mode to test the skin. Despite some distractions, the project was completed in approximately four days.

![In-game Screenshot 1](https://lh3.googleusercontent.com/d/1ViFVDaYV82463A8NLgpbNs6_46PuvMid)
 

---

## Conclusion

This Project was fun. This Commander had me doing a lot of research in terms of Lore for this Relatively New faction in the Warhammer 40K story. W40K related project always had a way with making me challenge the notion of "does have enough detail?" in a game that has aesthetics in low detail.
in Any Case, The Tau Commander Paladin is now ready for battle!

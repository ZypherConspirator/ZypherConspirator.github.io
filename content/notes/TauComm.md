---
title: Project; Tau40K
Date: 2024-11-03
---
## Tau Commander

for this Skin Modding Project il be making the [Tau Commander](https://warhammer40k.fandom.com/wiki/T'au_Commander) from the WarHammer 40K series for a community made character [Paladin](https://thunderstore.io/package/Paladin_Alliance/PaladinMod/).

#### Skin Modding?
Skin Modding has it easy when it comes to Game modding. due to the logic of the game, Skins are usually just models overlay-ed over a rig of a character. simple example would be in League of legends or Dota 2 where the visuals of the character can vary but the animation of the characters are largely the same.
simply means i would need to reuse the Armature/Rig of the character im making. since paladin is a community made character, the Base model is available to the public.

#### Process
as all of my projects go, ive started with drafting the visual for this character. i decided to based it off the famous Tau Hero, Commander Farsight. He Has a figure on the Games Workshop Marketplace but the images are not vary clear thus ive tasked my good friend, artist & Animator, [NoahSingka](https://www.instagram.com/noahsingka/), to do the drawing.

![sketch](https://lh3.googleusercontent.com/d/181V7BhJH0onfgh-P0h9EAhydOozd-ohK)

after that ive moved on to blender, starting with blocking then slowly laying out the details for the character. Risk of Rain 2 utilizes very low poly art style of its game and character designs take liberty of this freedom to not follow realistic conventions such as disconnected heads, cartoonish movements, exaggerated actions, etc. I also use this to my advantage & it also fits the game, 2 birds with 1 stone as the saying goes.

one of the main issues of translating characters like this is to consider their scale. most of these kinds of design are built around a certain body shape. Tau Commanders are specifically Top Heavy yet Paladin is design with realistic proportion. this can easily be solve with tweaking some elements like armor size its can easily mask the problem away. i took quite a liberty with the design of the commander due to scarcity of accurate references.

during the mid section ive notice it that design errors were made on my part. Noah did warn me that even he didn't know the full design so errors to be expected. after that i moved on to Vertex painting. this is a technique ive seen a lot used where they used this data set to put a base color first. Vertex Paint has a odd property of sticking even with major deformation without the need of textures.

then i jumped to weight painting, for robot-likes like these are simple Select Mesh and single Weight Procedure. did struggle a bit as mirroring and naming conventions of the rig did cause a bit of confusion.

after that i wanted to do texturing, which needs me to UV unwrap the model. this took several hours as i tried to figure out where does it need Seams on any separated mesh in on the model. here the end result of that

![Character UVmap, Character Seams only](https://lh3.googleusercontent.com/d/1bOvGcgsltmT_8mgOxx5aXdjHMP1rYh-b)

i baked the vertex colors into an image then moved over to Adobe Substance Painter to get started. Had to make sure the normal direction of the mesh isn't messed up and Bake the Mesh Maps first for it to be workable in the substance painter. since its a robot i just had to consider how to make it shiny but still rugged. i utilized normal maps to further enhance the visual while still attempting to optimize the model. adding details such as indents and bolts without making it a High poly mesh issue.

do love seeing it in hi-res preview in substance

![substance painter screenshot](https://lh3.googleusercontent.com/d/1CWY39XhNOhgmyOtmqagkB0cKnDn1lnww)

after thats done i exported the textures out, specifically
- Diffuse Texture with Specular in alpha channel
- Normal Map (DirectX)

this is due to the shaders packed the game shader as such, im just following the conventions.
moving it over blender it will lose some detail but it isn't the priority.

after some more fiddling around in Blender with WeightPaints and minor detail i moved on to the sword

i took the liberty of modifying the base Sword as it already has most of the weight paint figured out (The Sword Rig is Bendy, figuring that out will take time). i took the design for Commander Farsight's signature sword (Quite a lot of references on it). finished it off to texturing, which i did the same texturing process as the body.

i continued to Unity 2019 to make the mod. i imported the FBX and textures. made its own categories as did my other skin projects. textures were put under a specialized Material, this is does to the uniqueness of its code. Material Variables has to be translated into it then it could be used in-game. then compiled it as .DLL .

![Unity Pics](https://lh3.googleusercontent.com/d/1jHeDDBdsALWUnckUPCcqMnbJbDhtdpYK)

i used R2modman to launch the game in Modded mode and project completed. took around 4 days but 2 days were filled with distractions else i could finished it earlier.

![in-game 1](https://lh3.googleusercontent.com/d/1ViFVDaYV82463A8NLgpbNs6_46PuvMid)
![in-game 2](https://lh3.googleusercontent.com/d/1V6NBo23DLPnV5vyUbfKB1c75Bwlf1Bnl)
---
---
title: "Don't get scammed buying RAM in an inflated market"
date: "2024-06-19"
category: "Hardware"
---
By Asif Sayyed

You need more RAM, but global prices are currently inflated and marketing specs are actively trying to confuse you. Here is the technical breakdown of how to identify what your laptop actually supports, why dual-channeling matters, and how to mix RAM modules without destroying performance.

### DDR4 vs DDR5: Check your memory controller limits

Before buying anything, you need to know if your motherboard supports DDR4 or DDR5. They are physically incompatible, the notch is in a different place. 

The fastest way to check without opening the chassis is looking at your current RAM speed. Open Task Manager -> Performance -> Memory in Windows. 
- If the speed says **2133 MT/s to 3200 MT/s**, you are on DDR4. 
- If it says **4800 MT/s or higher**, you have DDR5.

Don't buy 5600 MT/s RAM if your CPU's memory controller maxes out at 4800 MT/s. The motherboard will forcefully downclock your expensive new stick to match the CPU's maximum supported speed.

### Why dual-channeling doubles your bus width

Buying a single 16GB stick instead of two 8GB sticks is the most common mistake in budget upgrades. 

Your CPU communicates with RAM over a 64-bit bus. When you install two identical sticks in the correct slots, the motherboard enables dual-channel memory. This merges the two 64-bit channels into a single 128-bit channel, doubling your maximum memory bandwidth. 

If you use integrated graphics (like AMD Radeon or Intel Iris Xe), those GPUs use your system RAM as VRAM. Running single-channel cuts your graphics bandwidth in half, dropping your frame rates by up to 40%. 

### Flex Mode: When mismatched RAM is good enough

In an ideal world, you buy a matched kit. In a market where prices are up, you might want to just add a 16GB stick next to your existing 8GB stick. This creates an asymmetrical 24GB configuration.

Modern processors handle this using **Flex Mode**. The system maps the first 16GB (the 8GB stick plus 8GB from the new stick) in fast dual-channel mode. The leftover 8GB operates in slower single-channel mode.

If you are just running Chrome tabs, Docker containers, and an IDE, Flex Mode works perfectly. If you are training models or relying on integrated graphics for gaming, keep your sticks symmetrical.

Check your task manager, buy the cheapest stick matching your DDR generation and maximum supported speed, and snap it in.

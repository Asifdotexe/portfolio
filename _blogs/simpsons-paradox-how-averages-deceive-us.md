---
title: "How Averages Deceive Us: The Math and Meaning of Simpson's Paradox"
published: true
date: "2025-10-18"
description: "A deep dive into Simpson's Paradox, exploring how aggregated data can mislead us and why subgroup analysis is crucial."
tags: ["data-science", "statistics", "math", "analysis", "simpsons-paradox"]
---

## Introduction

Imagine this: you're analysing data for a company's customer satisfaction survey. Last quarter, the overall satisfaction score dropped. But when you split the data by user type (new and existing customers), you find something strange… both groups individually show higher satisfaction than before.

Well, that doesn't make sense right? How can everyone be happier, yet the average goes down?

It sounds weird, but this is a well-known statistical trap called **Simpson's Paradox**; a phenomenon where trends that appear in separate groups disappear or even reverse when the groups are combined.

![Simpson's Paradox](./assets/images/blogs/simpsons-paradox-hero.webp)

## When Averages Betray You

Now, imagine you're presenting these results.
You show the leadership team that both new and existing customers' satisfaction improved. They smile. Then you show the overall average, and suddenly it's worse.

Someone questions your SQL query. Another blames a data refresh. But the data is correct; it's just that the summary is lying to your intuition.

This happens because when you mix groups of different sizes, the combined picture can distort reality. That is Simpson's Paradox in action; a mathematical illusion where the overall trend contradicts the trends in the subgroups.

It's not that the data is wrong, it's that we're looking at it from too far away. Zoom out too much, and the details blur.

Think of two roads both sloping uphill. If you build a bridge connecting them, that bridge can slope downhill, even though both roads rise. That's exactly what happens when you merge groups with uneven weights in data.

## Why Does It Happen?

Let's break this down from scratch.
When you combine two groups, you don't just "average the averages." You weight each average by the group's size.

The combined mean looks like this:

![Simpson's Paradox](./assets/images/blogs/simpsons-paradox-formula-mean.webp)

Where:
- `n1`, `n2` = number of observations in each group
- `x1_bar`, `x2_bar` = average for each group

The larger the group, the more it drags the overall mean toward itself. Let's take a small example:

| Group          | Avg. Satisfaction (Last Quarter) | Avg. Satisfaction (This Quarter) | Change     |
|----------------|----------------------------------|----------------------------------|------------|
| New Users      | 6.0                              | 7.0                              | +1.0       |
| Existing Users | 8.0                              | 8.5                              | +0.5       |
| **Overall**    | **7.5**                          | **7.2**                          | **-0.3**❗ |

**How can this happen?**
Because there are now far more new users, who start with lower scores. The increase in their numbers drags down the overall average, even though both groups individually improved.

This imbalance of group sizes and base rates is exactly what creates Simpson's Paradox.

## Demonstration

Let's see Simpson's Paradox in action with a simple simulated experiment:

Two treatments (A and B) are tested on two groups (Young and Old). Within each group, Treatment A performs better than B. But we assign A mostly to older patients, who naturally have lower success rates. That imbalance flips the overall result when we aggregate the data.

### Exhibits A: Success Rate by Group

![Success Rate by Group](./assets/images/blogs/simpsons-paradox-exhibit-a.webp)

Barplot for success rate by treatment and age group. Notice how A outperforms B in both groups individually.

| AgeGroup | A    | B    |
| -------- | ---- | ---- |
| Young    | 0.90 | 0.80 |
| Old      | 0.60 | 0.50 |

*Within each age group, A is clearly better.*

### Exhibits B: Overall Success Rate (Aggregated)

![Overall Success Rate](./assets/images/blogs/simpsons-paradox-exhibit-b.webp)

When you ignore age, the aggregate data makes B look better; it is the paradox in action.

| Treatment | Success Rate |
| --------- | ------------ |
| A         | 0.65         |
| B         | 0.75         |

*But when we combine all patients, B now appears better overall.*

## The Math Behind the Illusion

So, what's happening mathematically?

![Simpson's Paradox Formula](./assets/images/blogs/simpsons-paradox-conditional-probability.webp)

When we aggregate, we're effectively doing a weighted average. The key term here is `P(Group i | Treatment)`, i.e., the mix of groups under each treatment.

If Treatment A has more "Old" patients, its overall probability of success gets pulled down, even if within every group, it outperforms B.

That's why statisticians are obsessed with controlling for confounders, because failing to do so is how we get fooled by Simpson's Paradox.

![Simpson's Paradox Formula](./assets/images/blogs/simpsons-paradox-confounding-variable.webp)
*(Image credits: https://www.ztable.net/confounding-variable/)*

## Real-World Parallels

This paradox isn't just theoretical. It's haunted real-world analyses for decades.

- **[University Admissions (Berkeley, 1973)](https://en.wikipedia.org/wiki/Simpson%27s_paradox#UC_Berkeley_gender_bias):** Women seemed to have a lower overall acceptance rate. But when broken down by department, women were actually admitted at higher rates in most departments. The "bias" came from women applying to more competitive programs.
- **[Medical Treatments](https://en.wikipedia.org/wiki/Simpson%27s_paradox#Kidney_stone_treatment):** A drug may appear less effective overall because it's prescribed to patients with more severe conditions.
- **[Sports Analytics](https://en.wikipedia.org/wiki/Simpson%27s_paradox#Batting_averages):** A baseball player's batting average might be lower overall, yet higher against both left- and right-handed pitchers separately.

## What Does It Teach Us?

It teaches three core lessons:

1. **Never trust aggregates blindly.** Always check the subgroups.
2. **Control for confounding variables.** Ask: what else could be influencing this trend?
3. **Tell stories, not just statistics.** Data alone doesn't reveal the truth; interpretation does.

## Conclusion

Data isn't deceptive, humans are hasty. Simpson's Paradox reminds us that even when every number is right, the story can still be wrong.

It's a paradox not because it breaks math, but because it exposes our blind spots. Whenever you see a surprising trend, pause and ask: *"What happens if I split this data just one layer deeper?"*

That's often where the real truth hides. So the next time your dashboard surprises you, don't panic. Zoom in. Slice deeper. Because the truth might just be hiding in plain sight.

If you want to experiment with this yourself? Check out the interactive notebook I’ve prepared: Simpson’s Paradox Notebook.

Thank you!

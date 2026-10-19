---
name: performance
description: Frontend performance rules for Flow Board.
---

# Performance

## First principle
Do not optimize blindly.
Prefer simple architecture and measure when performance is actually a concern.

## Client JavaScript
- Keep Server Components server-side.
- Minimize `"use client"` boundaries.
- Avoid importing large libraries into frequently rendered client components.
- Do not put entire pages behind a client boundary unnecessarily.

## Rendering
Avoid unnecessary state updates and effects.
Do not introduce memoization without a concrete reason.

## Images
Use optimized image handling where appropriate.
Always provide meaningful dimensions/aspect ratios to avoid layout shifts.

## Lists
For large lists:
- avoid rendering unnecessary items
- paginate or virtualize when justified
- avoid expensive work inside render

## Network
Avoid waterfalls when requests can safely run in parallel.
Use server-side fetching where it reduces client round trips.

## Bundle
Prefer importing only what is needed.
Be cautious with barrel exports that cause large client bundles.

## Fonts
Use the project's existing font strategy.
Avoid loading unnecessary font families and weights.

## Monitoring
When investigating performance, identify:
- render cost
- network cost
- bundle cost
- server response time
- image/font cost

Fix the actual bottleneck rather than applying generic optimizations.

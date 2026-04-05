# Interactive Chart Test

##### Apr 2026

This is a test entry to verify that interactive D3.js charts work inside markdown blog posts.

## How it works

The chart below is rendered by D3.js. In the markdown, it's just a simple `<div>` placeholder. The actual chart logic lives in a separate JavaScript file that runs after the markdown is rendered.

<div id="test-bar-chart" class="d3-chart"></div>

The chart above shows randomly generated data. Each time you reload the page, the values will change. Try hovering over the bars to see the tooltip.

## Why this matters

This approach lets us keep writing blog posts in markdown while embedding interactive visualizations wherever needed. No build step, no iframes, no hacks.

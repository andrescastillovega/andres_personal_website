function renderTestBarChart(containerSelector) {
  const container = d3.select(containerSelector);
  if (container.empty()) return;

  const categories = ['Python', 'JavaScript', 'Rust', 'Go', 'TypeScript', 'Java'];
  const data = categories.map(name => ({
    name,
    value: Math.floor(Math.random() * 80) + 20
  }));

  function draw() {
    container.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = container.node().getBoundingClientRect().width;
    const height = Math.max(250, Math.min(350, width * 0.5));
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container.append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    const fontSize = Math.max(10, Math.min(14, width * 0.022)) + 'px';

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-family', 'Source-Serif-Regular, serif')
      .style('font-size', fontSize);

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-family', 'Source-Serif-Regular, serif')
      .style('font-size', fontSize);

    // Tooltip
    const tooltip = container.append('div')
      .style('position', 'absolute')
      .style('background', '#393939')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '6px')
      .style('font-family', 'Source-Serif-Regular, serif')
      .style('font-size', fontSize)
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Bars
    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', '#393939')
      .attr('rx', 4)
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', '#6b6b6b');
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong>: ${d.value}`);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, container.node());
        tooltip
          .style('left', (mx + 12) + 'px')
          .style('top', (my - 10) + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#393939');
        tooltip.style('opacity', 0);
      })
      .on('touchstart', function (event, d) {
        event.preventDefault();
        g.selectAll('rect').attr('fill', '#393939');
        d3.select(this).attr('fill', '#6b6b6b');
        const [mx, my] = d3.pointer(event, container.node());
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong>: ${d.value}`)
          .style('left', (mx + 12) + 'px')
          .style('top', (my - 30) + 'px');
      })
      .on('touchend', function () {
        d3.select(this).attr('fill', '#393939');
        tooltip.style('opacity', 0);
      });
  }

  draw();

  let resizeTimer;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 150);
  }).observe(container.node());
}

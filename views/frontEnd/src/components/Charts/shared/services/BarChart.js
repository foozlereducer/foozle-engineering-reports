import * as d3 from 'd3';

class BarChartService {
  static drawChart(element, data, width, height) {
    // Clear the previous chart
    d3.select(element).selectAll('*').remove();
  
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;
  
    const svg = d3.select(element)
      .append('svg')
      .attr('width', adjustedWidth + margin.left + margin.right)
      .attr('height', adjustedHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value));

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  }
}

export default BarChartService;

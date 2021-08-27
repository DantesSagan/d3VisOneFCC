import React, { useState } from 'react';
import * as d3 from 'd3';

export default function App() {
  const [url] = useState(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  );
  const [req] = useState(new XMLHttpRequest());
  let [data] = useState();
  let [values] = useState();

  let [xScale] = useState();

  let heightScale;

  let xAxisScale;
  let yAxisScale;

  const width = 800;
  const height = 600;
  const padding = 60;

  let svg = d3.select('svg');

  const drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
  };
  const generateScales = () => {
    heightScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(values, (item) => {
          return item[1];
        }),
      ])
      .range([0, height - 2 * padding]);

    xScale = d3
      .scaleLinear()
      .domain([0, values.length - 1])
      .range([padding, width - padding]);

    const datesArray = values.map((item) => {
      return new Date(item[0]);
    });
    console.log(datesArray);

    xAxisScale = d3
      .scaleTime()
      .domain([d3.min(datesArray), d3.max(datesArray)])
      .range([padding, width - padding]);

    yAxisScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(values, (item) => {
          return item[1];
        }),
      ])
      .range([height - padding, padding]);

    return { xScale, datesArray };
  };
  const drawBars = () => {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('visibility', 'hidden')
      .style('width', 'auto')
      .style('height', 'auto');

    svg
      .selectAll('rect')
      .data(values)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', (width - 2 * padding) / values.length)
      .attr('data-date', (item) => {
        return item[0];
      })
      .attr('data-gdp', (item) => {
        return item[1];
      })
      .attr('height', (item) => {
        return heightScale(item[1]);
      })
      .attr('x', (item, i) => {
        return xScale(i);
      })
      .attr('y', (item) => {
        return height - padding - heightScale(item[1]);
      })
      .on('mouseover', (item) => {
        tooltip.transition().duration(200).style('visibility', 'visible');
        tooltip.text(item[0], item[1]);

        document.querySelector('#tooltip').setAttribute('data-date', item[0]);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(200).style('visibility', 'hidden');
      });
  };

  const generateAxis = () => {
    const xAxis = d3.axisBottom(xAxisScale);
    const yAxis = d3.axisLeft(yAxisScale);
    svg
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0, ' + (height - padding) + ')');

    svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',  0)');
    return { xAxis, svg, yAxis };
  };

  req.open('GET', url, true);
  req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values);
    drawCanvas();
    generateScales();
    drawBars();
    generateAxis();
  };
  req.send();
  return (
    <svg>
      <text id='title' x='360' y='30'>
        USA GDP
      </text>
    </svg>
  );
}

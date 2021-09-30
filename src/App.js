import React, { useState } from 'react';

import { pointer } from 'd3-selection';
import * as d3 from 'd3';

export default function App() {
  const [url] = useState(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  );
  const [req] = useState(new XMLHttpRequest());
  let data;
  let values = [];

  let xScale;
  let heightScale;

  let xAxisScale;
  let yAxisScale;

  const width = 1000;
  const height = 600;
  const padding = 90;

  let svg = d3.select('svg');

  const infoText = () => {
    let textContainer = d3
      .select('svg')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    textContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -350)
      .attr('y', 125)
      .text('Gross Domestic Product');

    textContainer
      .append('text')
      .attr('x', width - 530)
      .attr('y', height - 560)
      .attr('id', 'title')
      .text('Usa GDP');
  };

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
      .on('mouseover', (event, item) => {
        const [x, y] = pointer(event);
        tooltip.transition().duration(200).style('visibility', 'visible');
        tooltip
          .html(item[0] + ' - Y/M/D  <br/> ' + item[1] + ' $')
          .style('left', x + 460 + 'px')
          .style('top', y + 130 + 'px');

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
      .attr('transform', 'translate(0, ' + (height - padding) + ')')
      .style('font-size', '18px');

    svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',  0)')
      .style('font-size', '18px');
    return { xAxis, svg, yAxis };
  };

  req.open('GET', url, true);
  req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    drawCanvas();
    generateScales();
    drawBars();
    generateAxis();
    infoText();
  };
  req.send();
  return (
    <svg>
      <text id='info' x={width - 820} y={height - 20}>
        More Information:{' '}
        <a href='http://www.bea.gov/national/pdf/nipaguid.pdf'>
          http://www.bea.gov/national/pdf/nipaguid.pdf
        </a>{' '}
      </text>
    </svg>
  );
}

import * as d3 from 'd3';
import { useRef, useState, useEffect } from 'react';

import axios from 'axios';

import XAxis from './components/xAxis';
import './App.css';

export default function App() {
  const [dataset, setDataset] = useState([12, 31, 22, 17, 25, 18, 29, 14, 9]);
  const [posts, setPosts] = useState({});
  const ref = useRef();

  const w = 500;
  const h = 100;

  useEffect(() => {
    axios
      .get(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
      )
      .then((res) => {
        console.log(res);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
      
    const svgElement = d3
      .select('body')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svgElement
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 30)
      .attr('y', (d, i) => {
        // Add your code below this line
        return h - 3 * d;

        // Add your code above this line
      })
      .attr('width', 25)
      .attr('height', (d, i) => 3 * d);
  }, [dataset]);

  return (
    <div className='mx-auto rounded-xl p-3 mt-44 '>
      <svg ref={ref} />
      <XAxis />
    </div>
  );
}

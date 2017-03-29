'use strict';
import React from 'react';
import { get } from 'object-path';
import { scaleLinear, scaleBand } from 'd3-scale';
import debounce from 'lodash.debounce';

import LoadingIndicator from '../app/loading-indicator';

const margin = {
  top: 50,
  right: 15,
  bottom: 15,
  left: 70
};

const Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      width: 0,
      height: 0
    };
  },

  onWindowResize: function () {
    let rect = this.refs.chartContainer.getBoundingClientRect();
    this.setState({ width: rect.width, height: rect.height });
  },

  componentDidMount: function () {
    this.onWindowResize();
    this.onWindowResize = debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
  },

  render: function () {
    const { width, height } = this.state;
    const { inflight, data } = this.props.data;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // short circuit if the area is too small; loading if the data is inflight
    if (innerWidth <= 0) return <div className='chart__container' ref='chartContainer' />;
    else if (inflight && !data) {
      return (
        <div className='chart__container' ref='chartContainer'>
          <LoadingIndicator />
        </div>
      );
    }

    const histogram = get(data, 'histogram', []);

    const xScale = scaleLinear()
    .range([0, innerWidth])
    .domain([0, Math.max.apply(Math, histogram.map(d => +d.count))]);

    const scaleOrdinal = scaleBand()
    .paddingInner(0.6)
    .paddingOuter(0.2);

    const yScale = scaleOrdinal
    .rangeRound([0, innerHeight])
    .domain(histogram.map(d => d.date));

    const band = yScale.bandwidth();

    return (
      <div className='chart__container' ref='chartContainer'>
        <svg className='chart' width={width} height={height} ref='svg'>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {histogram.map(d => {
              return <rect
                key={d.date}
                className='chart__bar'
                x={0}
                y={yScale(d.date) - band / 2}
                width={xScale(+d.count)}
                height={band}
              />;
            })}
          </g>
        </svg>
      </div>
    );
  }
});
export default Chart;

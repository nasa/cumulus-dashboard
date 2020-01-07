'use strict';
import React from 'react';
import { get } from 'object-path';
import { scaleLinear, scaleBand } from 'd3-scale';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import PropTypes from 'prop-types';
import { tally } from '../../utils/format';
import LoadingIndicator from '../app/loading-indicator';

const noop = (x) => x;
const tooltipDelay = 100;

const margin = {
  top: 50,
  right: 15,
  bottom: 15,
  left: 70
};

class Histogram extends React.Component {
  constructor () {
    super();
    this.state = {
      width: 0,
      height: 0,
      tooltip: null,
      tooltipX: 0,
      tooltipY: 0
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.setHoverState = this.setHoverState.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  onWindowResize () {
    let rect = this.refs.chartContainer.getBoundingClientRect();
    this.setState({ width: rect.width, height: rect.height });
  }

  componentDidMount () {
    this.setHoverState = throttle(this.setHoverState, tooltipDelay);
    this.mouseOut = debounce(this.mouseOut, tooltipDelay);
    this.onWindowResize();
    this.onWindowResize = debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
  }

  setHoverState (tooltip, tooltipX, tooltipY) {
    this.setState({ tooltip, tooltipX, tooltipY });
  }

  mouseMove (e) {
    // http://stackoverflow.com/questions/38142880/react-js-throttle-mousemove-event-keep-throwing-event-persist-error
    e.persist();
    this.setHoverState(
      e.currentTarget.getAttribute('data-tooltip'),
      e.clientX,
      e.clientY
    );
  }

  mouseOut () {
    this.setState({ tooltip: null });
  }

  render () {
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
      .domain([0, 1.25 * Math.max.apply(Math, histogram.map(d => +d.count))]);

    const scaleOrdinal = scaleBand()
      .paddingInner(0.6)
      .paddingOuter(0.2);

    const yScale = scaleOrdinal
      .rangeRound([0, innerHeight])
      .domain(histogram.map(d => d.date));

    const band = yScale.bandwidth();
    const tooltipFormat = this.props.tooltipFormat || noop;

    return (
      <div className='chart__container' ref='chartContainer'>
        <svg className='chart' width={width} height={height} ref='svg'>
          <g className='axis axis__top' transform={`translate(${margin.left}, ${margin.top})`}>
            <line
              className='axis__line'
              x1='0'
              x2={innerWidth}
            />
            {xScale.ticks(3).map((label, i) => {
              // don't render the first tick
              if (!i) return <g key={label}></g>;
              return <g key={label} transform={`translate(${xScale(label)}, 0)`}>
                <line className='axis__tick'
                  y1='-4'
                  y2='0'
                />
                <text className='axis__text'
                  dy={-8}
                  textAnchor={'middle'}>{tally(label)}</text>
              </g>;
            })}
          </g>

          <g className='axis axis__left' transform={`translate(${margin.left}, ${margin.top})`}>
            <line
              className='axis__line'
              y1='0'
              y2={innerHeight}
            />
            {histogram.map(d => {
              return <g key={d.date} transform={`translate(0, ${yScale(d.date)})`}>
                <line className='axis__tick'
                  x1='-4'
                  x2='0'
                />
                <text className='axis__text'
                  dx='-8'
                  dy='3'
                  textAnchor={'end'}>{d.date}</text>
              </g>;
            })}
          </g>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {histogram.map(d => {
              return <rect
                key={d.date}
                className='chart__bar'
                x={0}
                y={yScale(d.date) - band / 2}
                width={xScale(+d.count)}
                height={band}
                data-tooltip={d.count}
                onMouseMove={this.mouseMove}
                onMouseOut={this.mouseOut}
              />;
            })}
          </g>
        </svg>

        <div className='tooltip' style={{
          display: this.state.tooltip ? 'block' : 'none',
          left: this.state.tooltipX,
          top: this.state.tooltipY}}
        >
          <div className='tooltip__inner'>
            {tooltipFormat(this.state.tooltip)}
          </div>
        </div>
      </div>
    );
  }
}

Histogram.propTypes = {
  data: PropTypes.object,
  tooltipFormat: PropTypes.func
};

export default Histogram;

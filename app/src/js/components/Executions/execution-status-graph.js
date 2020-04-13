'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { window } from '../../utils/browser';
import dagre from 'dagre-d3';
import * as d3 from 'd3';

import {
  getExecutionEvents,
  workflowToGraph,
  addEventsToGraph,
  draw
} from './execution-graph-utils';

// dagre-d3 expects d3 to be attached to the window
if (process.env.NODE_ENV !== 'test') window.d3 = d3;

class ExecutionStatusGraph extends React.Component {
  componentDidMount () {
    const {
      executionStatus: {
        executionHistory,
        stateMachine
      }
    } = this.props;

    const workflow = JSON.parse(stateMachine.definition);

    var events = getExecutionEvents(executionHistory);
    var graph = workflowToGraph(workflow);
    addEventsToGraph(events, graph);
    this.g = draw(graph);
    var render = new dagre.render();
    var svg = d3.select('svg');
    render(svg, this.g);
    var height = d3.select('svg g').node().getBBox().height;
    var width = d3.select('svg g').node().getBBox().width;
    console.log('HEIGHT: ' + height);
    console.log('WIDTH: ' + width);
    svg.attr('height', height + 10);
    svg.attr('width', width);
    svg.attr('padding-right', 150);
  }

  componentWillUnmount () {
    this.g = null;
  }

  render () {
    return (
      <svg></svg>
    );
  }
}

ExecutionStatusGraph.propTypes = {
  executionStatus: PropTypes.object
};

export default connect(state => ({}))(ExecutionStatusGraph);

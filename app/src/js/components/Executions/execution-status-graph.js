import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import dagre from 'dagre-d3';
import * as d3 from 'd3';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import {
  getExecutionEvents,
  workflowToGraph,
  addEventsToGraph,
  draw
} from './execution-graph-utils';
import { window } from '../../utils/browser';

// dagre-d3 expects d3 to be attached to the window
if (process.env.NODE_ENV !== 'test') window.d3 = d3;

const ExecutionStatusGraph = ({ executionStatus }) => {
  const { executionHistory, stateMachine } = executionStatus;
  const g = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const workflow = JSON.parse(stateMachine.definition);
    const events = getExecutionEvents(executionHistory);
    const graph = workflowToGraph(workflow);
    addEventsToGraph(events, graph);
    g.current = draw(graph);
    renderGraph('.visual', g);
  }, [executionHistory, stateMachine.definition]);

  function renderGraph (svgSelector) {
    const render = new dagre.render();
    const svg = d3.select(svgSelector);
    render(svg, g.current);
    const { height } = d3.select(`${svgSelector} g`).node().getBBox();
    const { width } = d3.select(`${svgSelector} g`).node().getBBox();
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.attr('width', '100%');
    svg.attr('height', '100%');
  }

  function handleClick (e) {
    e.preventDefault();
    setShowModal(true);
  }

  function onHide () {
    setShowModal(false);
  }

  function onShow () {
    renderGraph('.modal-svg');
  }
  return (
    <div className='execution__visual'>
      <div className='header' onClick={handleClick} role="button" tabIndex="0">
        <div>Click to enlarge to fullscreen</div>
        <div><FontAwesomeIcon className='button__icon--animation' icon={faExpand} /></div>
      </div>
      <div className='execution__content' onClick={handleClick} role="button" tabIndex="0">
        <div className='execution__content--visual'>
          <svg className='visual'></svg>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={onHide}
        onShow={onShow}
        className='default-modal execution__modal--visual'>
        <Modal.Header>
          <div className='header' onClick={onHide} role="button" tabIndex="0">
            <div>Click to return to execution view</div>
            <div><FontAwesomeIcon icon={faCompress} className='button__icon--animation'/></div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <svg className='modal-svg'></svg>
        </Modal.Body>
      </Modal>
    </div>
  );
};

ExecutionStatusGraph.propTypes = {
  executionStatus: PropTypes.shape({
    executionHistory: PropTypes.object.isRequired,
    stateMachine: PropTypes.object.isRequired,
  })
};

export default ExecutionStatusGraph;

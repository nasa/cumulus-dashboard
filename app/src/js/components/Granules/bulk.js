'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Modal from 'react-bootstrap/Modal';

import { bulkGranule } from '../../actions';
import Ellipsis from '../LoadingEllipsis/loading-ellipsis';
import { kibanaRoot } from '../../config';
import TextArea from '../TextAreaForm/text-area';

class BulkGranule extends React.Component {
  constructor () {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.buttonClass = this.buttonClass.bind(this);
    this.elementClass = this.elementClass.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {};
  }

  cancel (e) {
    this.setState({ modal: false });
  }

  submit (e) {
    e.preventDefault();
    const requestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let { query } = this.state;
    this.setState({requestId});
    if (this.props.status !== 'inflight') {
      try {
        var json = JSON.parse(query);
      } catch (e) {
        return this.setState({ error: 'Syntax error in JSON' });
      }
      this.props.dispatch(bulkGranule({requestId, json}));
    }
  }

  buttonClass (processing) {
    let className = 'button button--small form-group__element button--green';
    if (processing) className += ' button--loading';
    if (this.props.className) className += ' ' + this.props.className;
    return className;
  }

  // a generic className generator for non-button elements
  elementClass (processing) {
    let className = 'async__element';
    if (processing) className += ' async__element--loading';
    if (this.props.className) className += ' ' + this.props.className;
    return className;
  }

  handleClick (e) {
    e.preventDefault();
    if (this.props.confirmAction) {
      this.setState({ modal: true });
    }
  }

  onChange (id, value) {
    this.setState({ query: value });
  }

  render () {
    const { requestId, query, modal } = this.state;
    const defaultValue = {
      workflowName: '',
      index: '',
      query: ''
    };
    const queryValue = query || JSON.stringify(defaultValue, null, 2);
    const status = get(this.props.state.bulk, [requestId, 'status']);
    const error = get(this.props.state.bulk, [requestId, 'error']) || this.state.error;
    const buttonText = status === 'inflight' ? 'loading...'
      : status === 'success' ? 'Success!' : 'Run Bulk Granules';
    const inflight = status === 'inflight';
    const props = {
      className: this.props.element ? this.elementClass(inflight) : this.buttonClass(inflight),
      onClick: this.handleClick
    };
    const text = 'Run Bulk Granules';
    const children = (
      <span>
        {text}{inflight ? <Ellipsis /> : ''}
      </span>
    );
    const element = this.props.element || 'button';
    const button = React.createElement(element, props, children);
    if (status === 'success') {
      const asyncOpId = get(this.props.state.bulk, [requestId, 'data', 'id']);
      return (
        <div>
          { button }
          {/* Once the new Bootstrap Modal is working per the built in functionality */}
          { modal && <div className='modal__cover' />}
          <div className={c({
            modal__container: true,
            'modal__container--onscreen': modal
          })}>
            <Modal
              dialogClassName="bulk_granules-modal"
              show={modal}
              onHide={this.cancel}
              centered
              aria-labelledby="modal__bulk_granules-modal"
            >
              <Modal.Header className="bulk_granules-modal__header" closeButton onClick={this.cancel}></Modal.Header>
                <Modal.Title id="modal__bulk_granules-modal" className="bulk_granules-modal__title">Bulk Granules</Modal.Title>
                  <p>
                    Your request to process a bulk granules operation has been submitted. <br/>
                    ID <strong>{asyncOpId}</strong>
                  </p>
                  <br/>
                  <Modal.Footer>
                    <button
                      className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
                      onClick={this.cancel}
                      readOnly={true}
                      alt="Close"
                      >Close</button>
                    <a
                      className={'button button__bulkgranules button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right'}
                      href='/#/executions'
                      readOnly={true}
                      alt="Go To Executions"
                      >Go To Executions
                    </a>
                  </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    }
    return (
      <div>
        { button }
        {/* Once the new Bootstrap Modal is working per the built in functionality */}
        { modal && <div className='modal__cover' />}
        <div className={c({
          modal__container: true,
          'modal__container--onscreen': modal
        })}>
          <Modal
            dialogClassName="bulk_granules-modal"
            show={modal}
            onHide={this.cancel}
            centered
            size="lg"
            aria-labelledby="modal__bulk_granules-modal"
            style={{overflowY: 'scroll'}}
          >
            <Modal.Header className="bulk_granules-modal__header" closeButton onClick={this.cancel}></Modal.Header>
              <Modal.Title id="modal__bulk_granules-modal" className="bulk_granules-modal__title">Bulk Granules</Modal.Title>
                <Modal.Body>
                  <h4 className="modal_subtitle">To run and complete your bulk granule task:</h4>
                  <p>
                    1. In the box below, enter the <strong>workflowName</strong>. <br/>
                    2. Then add either an array of granule Ids or an elasticsearch query and index. <br/>
                  </p>
                  <br/>
                  <h4 className="modal_subtitle">If you need to construct a query</h4>
                  <p>
                    To construct a query, go to Kibana and run a search. Then place the elasticsearch query in the operation input. <br/>
                    <button className="button button__kibana_open button--small" href={kibanaRoot} alt="Open Kibana">Open Kibana</button>
                  </p>
                  <br/>
                  <form>
                    <TextArea
                      value={queryValue}
                      id={'run-bulk-granule'}
                      error={error}
                      onChange={this.onChange}
                      mode={'json'}
                      minLines={30}
                      maxLines={200}
                    />
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
                    onClick={this.cancel}
                    readOnly={true}
                    alt="Cancel Bulk Granules"
                    >Cancel</button>
                  <button
                    className={'button button__bulkgranules button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right' + (status === 'inflight' ? ' button--disabled' : '')}
                    onClick={this.submit}
                    readOnly={true}
                    alt="Run Bulk Granules"
                    >{buttonText}
                  </button>
                </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

BulkGranule.propTypes = {
  dispatch: PropTypes.func,
  status: PropTypes.string,
  action: PropTypes.func,
  state: PropTypes.object,
  confirmAction: PropTypes.bool,
  className: PropTypes.string,
  element: PropTypes.string
};

export default connect(state => ({
  collections: state.collections
}))(BulkGranule);

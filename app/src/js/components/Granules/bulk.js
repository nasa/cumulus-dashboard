'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { bulkGranule } from '../../actions';

import Ellipsis from '../LoadingEllipsis/loading-ellipsis';
// import { getCollectionId, collectionHref } from '../../utils/format';
// import AddRaw from '../AddRaw/add-raw';
import { kibanaRoot } from '../../config';
import TextArea from '../TextAreaForm/text-area';

// const getBaseRoute = function (collectionId) {
//   if (collectionId) {
//     return collectionHref(collectionId);
//   } else {
//     return '/collections/collection';
//   }
// };

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
    let { query } = this.state;

    if (this.props.status !== 'inflight') {
      try {
        var json = JSON.parse(query);
      } catch (e) {
        return this.setState({ error: 'Syntax error in JSON' });
      }
      this.props.dispatch(bulkGranule(json));
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
    // else if (this.props.status !== 'inflight') {
    //   this.props.action();
    // }
  }

  onChange (id, value) {
    this.setState({ query: value });
  }

  render () {
    // const { status } = this.props;
    const { error } = this.state;
    const defaultValue = {
      queueName: '',
      workflowName: '',
      index: '',
      query: ''
    };
    const defaultValueString = JSON.stringify(defaultValue, null, 2);
    const status = null;
    // get(this.props.state.bulk, [pk, 'status']);
    const buttonText = status === 'inflight' ? 'loading...'
      : status === 'success' ? 'Success!' : 'Submit';
    const { modal } = this.state;
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
    return (
      <div>
        { button }
        { modal ? <div className='modal__cover'></div> : null }
        <div className={c({
          modal__container: true,
          'modal__container--onscreen': modal
        })}>
          { modal ? (
            <div className='modal__large'>
              <div className='modal__internal modal__formcenter'>
                <h1 className='heading--large heading--shared-content with-description '>Bulk Granules</h1>
                <h4>To run and complete your bulk granule task:</h4>
                1. In the box below, enter your queueName and the workflowName. <br/>
                2. Then add either an array of granule Ids or an elasticsearch query and index. <br/>
                To construct a query, go to Kibana and run a search. Then place the elasticsearch query in the operation input. <br/>
                <a href={kibanaRoot}>Open Kibana</a> <br/>
                <form>
                  <TextArea
                    value={defaultValueString}
                    id={'run-bulk-granule'}
                    error={error}
                    onChange={this.onChange}
                    mode={'json'}
                    minLines={30}
                    maxLines={200}
                  />
                </form>
                <button
                  className={'button button--submit button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right' + (status === 'inflight' ? ' button--disabled' : '')}
                  onClick={this.submit}
                  readOnly={true}
                  >{buttonText}</button>
                <button
                  className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
                  onClick={this.cancel}
                  readOnly={true}
                >Cancel</button>
              </div>
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

BulkGranule.propTypes = {
  // collections: PropTypes.object
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

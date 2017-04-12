import React from 'react';
import { findDOMNode } from 'react-dom';
import AsyncCommand from '../form/async-command';
import { addGlobalListener } from '../../utils/browser';
import { updateDelay } from '../../config';

const DropdownAsync = React.createClass({
  propTypes: {
    config: React.PropTypes.array
  },

  getInitialState: function () {
    return { showActions: false };
  },

  componentWillMount: function () {
    this.cleanup = addGlobalListener('click', this.onOutsideClick);
  },

  componentWillUnmount: function () {
    if (this.cleanup && typeof this.cleanup === 'function') this.cleanup();
  },

  onOutsideClick: function (e) {
    if (findDOMNode(this).contains(e.target)) return;
    else this.setState({ showActions: false });
  },

  toggleActions: function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showActions: !this.state.showActions });
  },

  close: function () {
    this.setState({ showActions: false });
  },

  onSuccess: function (success) {
    this.setState({ showActions: false });
    if (typeof success === 'function') success();
  },

  render: function () {
    const { config } = this.props;
    const { showActions } = this.state;
    return (
      <div className='dropdown__options form-group__element--right'>
        <a className='dropdown__options__btn button--green button' href='#' onClick={this.toggleActions}><span>Options</span></a>
        {showActions ? (
          <ul className='dropdown__menu'>
            {config.map(d => <li key={d.text}>
              <AsyncCommand action={d.action}
                success={() => this.onSuccess(d.success)}
                successTimeout={updateDelay}
                error={this.close}
                status={d.status}
                disabled={d.disabled}
                className={'link--no-underline'}
                element='a'
                text={d.text} />
            </li>)}
          </ul>
        ) : null}
      </div>
    );
  }
});
export default DropdownAsync;

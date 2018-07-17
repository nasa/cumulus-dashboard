import React from 'react';
import c from 'classnames';
import { findDOMNode } from 'react-dom';
import AsyncCommand from '../form/async-command';
import { addGlobalListener } from '../../utils/browser';

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
        <a className='dropdown__options__btn button--green button button--small' href='#' onClick={this.toggleActions}><span>Options</span></a>
        <ul className={c('dropdown__menu', {
          'dropdown__menu--hidden': !showActions
        })}>
          {config.map(d => <li key={d.text}>
            <AsyncCommand action={d.action}
              success={() => this.onSuccess(d.success)}
              error={this.close}
              status={d.status}
              disabled={d.disabled}
              confirmAction={d.confirmAction}
              confirmText={d.confirmText}
              confirmHasDropdown={d.confirmHasDropdown}
              confirmDropdownConfigs={d.confirmDropdownConfigs}
              className={'link--no-underline'}
              element='a'
              text={d.text} />
          </li>)}
        </ul>
      </div>
    );
  }
});
export default DropdownAsync;

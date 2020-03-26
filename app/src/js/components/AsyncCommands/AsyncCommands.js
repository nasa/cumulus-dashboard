// Will need to review: Modal needs to be put into its own component and link the actions to that component as well as ButtonGroup aka bulkactions
/* For Delete Collection Modal (later other modals): Need to copy logic from here and implement in AsyncDeleteCollectionModal.js */
'use strict';
import React from 'react';
import c from 'classnames';
import PropTypes from 'prop-types';
import Ellipsis from '../LoadingEllipsis/loading-ellipsis';
import DefaultModal from '../Modal/modal';
import { preventDefault } from '../../utils/noop';
import _config from '../../config';

const { updateDelay } = _config;

class AsyncCommand extends React.Component {
  constructor () {
    super();
    this.state = { confirmModal: false };
    this.buttonClass = this.buttonClass.bind(this);
    this.elementClass = this.elementClass.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (
      prevProps.status === 'inflight' &&
      this.props.status === 'success' &&
      typeof prevProps.success === 'function'
    ) {
      const timeout = isNaN(prevProps.successTimeout) ? updateDelay : prevProps.successTimeout;
      setTimeout(prevProps.success, timeout);
      this.setState({ successModal: true }); // eslint-disable-line react/no-did-update-set-state
    } else if (
      prevProps.status === 'inflight' &&
        this.props.status === 'error' &&
        typeof prevProps.error === 'function'
    ) {
      prevProps.error();
    }
  }

  buttonClass (processing) {
    return [
      'button button--small form-group__element',
      `${processing ? 'button--loading' : ''}`,
      `${this.props.disabled ? 'button--disabled' : ''}`,
      `${this.props.className ? this.props.className : 'button__group'}`
    ].join(' ');
  }

  // a generic className generator for non-button elements
  elementClass (processing) {
    let className = 'async__element';
    if (processing) className += ' async__element--loading';
    if (this.props.disabled) className += ' async__element--disabled';
    if (this.props.className) className += ' ' + this.props.className;
    return className;
  }

  handleClick (e) {
    e.preventDefault();
    if (this.props.confirmAction) {
      this.setState({ confirmModal: true });
    } else if (this.props.status !== 'inflight' && !this.props.disabled) {
      // prevent duplicate action if the action is already inflight.
      this.props.action();
    }
  }

  confirm () {
    this.props.action();
    this.setState({ confirmModal: false });
    if (this.props.status === 'success') this.setState({ successModal: true });
  }

  cancel () {
    this.setState({ confirmModal: false, successModal: false });
  }

  render () {
    const { status, text, confirmText, confirmOptions, showSuccessModal, postActionText } = this.props;
    const { confirmModal, successModal } = this.state;
    const inflight = status === 'inflight';
    const element = this.props.element || 'button';
    const props = {
      className: this.props.element ? this.elementClass(inflight) : this.buttonClass(inflight),
      onClick: this.props.disabled ? preventDefault : this.handleClick
    };
    if (element === 'a') props.href = '#';
    const children = (
      <span>
        {text}{inflight ? <Ellipsis /> : ''}
      </span>
    );
    const button = React.createElement(element, props, children);

    return (
      <div>
        { button }
        { confirmModal ? <div className='modal__cover'></div> : null }
        <div className={c({
          modal__container: true,
          'modal__container--onscreen': confirmModal
        })}>
          <DefaultModal
            className='async-modal'
            onCancel={this.cancel}
            onCloseModal={this.cancel}
            onConfirm={this.confirm}
            title={text}
            children={(
              <div className='modal__internal modal__formcenter'>
                { confirmOptions ? (confirmOptions).map(option =>
                  <div key={`option-${confirmOptions.indexOf(option)}`}>
                    {option}
                    <br />
                  </div>
                ) : null }
                <h4>{confirmText}</h4>
              </div>
            )}
            showModal={confirmModal}
          />
          <DefaultModal
            className='link--no-underline'
            onCancel={this.cancel}
            onCloseModal={this.cancel}
            cancelButtonText={'Close'}
            hasConfirmButton={false}
            title={text}
            children={postActionText}
            showModal={(successModal && showSuccessModal)}
            cancelButtonClass={'button--cancel'}
          />
        </div>
      </div>
    );
  }
}

AsyncCommand.propTypes = {
  action: PropTypes.func,
  success: PropTypes.func,
  error: PropTypes.func,
  status: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  successTimeout: PropTypes.number,
  element: PropTypes.string,
  confirmAction: PropTypes.bool,
  confirmText: PropTypes.string,
  confirmOptions: PropTypes.array,
  showSuccessModal: PropTypes.bool,
  postActionText: PropTypes.string,
  href: PropTypes.string
};

export default AsyncCommand;

import React from 'react';
import c from 'classnames';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import { addGlobalListener } from '../../utils/browser';

class DropdownAsync extends React.Component {
  constructor () {
    super();
    this.state = { showActions: false };
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.toggleActions = this.toggleActions.bind(this);
    this.close = this.close.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount () {
    this.cleanup = addGlobalListener('click', this.onOutsideClick);
  }

  componentWillUnmount () {
    if (this.cleanup && typeof this.cleanup === 'function') this.cleanup();
  }

  onOutsideClick (e) {
    if (!findDOMNode(this).contains(e.target)) this.close();
  }

  toggleActions (e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState((prevState) => ({
      showActions: !prevState.showActions
    }));
  }

  close () {
    this.setState({ showActions: false });
  }

  handleSuccess (onSuccess) {
    this.close();
    if (typeof onSuccess === 'function') onSuccess();
  }

  handleError (onError) {
    this.close();
    if (typeof onError === 'function') onError();
  }

  render () {
    const { config } = this.props;
    const { showActions } = this.state;
    return (
      <div className='dropdown__options form-group__element--right'>
        <button className='dropdown__options__btn button--green button button--small' onClick={this.toggleActions}><span>Options</span></button>
        <ul className={c('dropdown__menu', {
          'dropdown__menu--hidden': !showActions
        })}>
          {config.map((d) => <li key={d.text}>
            <AsyncCommand action={d.action}
              success={() => this.handleSuccess(d.success)}
              error={() => this.handleError(d.error)}
              status={d.status}
              disabled={d.disabled}
              confirmAction={d.confirmAction}
              confirmText={d.confirmText}
              confirmOptions={d.confirmOptions}
              showSuccessModal={d.postActionModal}
              postActionText={d.postActionText}
              className={'link--no-underline'}
              element='a'
              text={d.text} />
          </li>)}
        </ul>
      </div>
    );
  }
}

DropdownAsync.propTypes = {
  config: PropTypes.array
};

export default DropdownAsync;

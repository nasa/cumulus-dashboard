import React from 'react';
import c from 'classnames';
import { findDOMNode } from 'react-dom';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import DefaultModal from '../Modal/modal';
import PropTypes from 'prop-types';
import { addGlobalListener } from '../../utils/browser';

class DropdownAsync extends React.Component {
  constructor () {
    super();
    this.state = { showActions: false };
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.toggleActions = this.toggleActions.bind(this);
    this.close = this.close.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    this.cleanup = addGlobalListener('click', this.onOutsideClick);
  }

  componentWillUnmount () {
    if (this.cleanup && typeof this.cleanup === 'function') this.cleanup();
  }

  onOutsideClick (e) {
    if (findDOMNode(this).contains(e.target)) return;
    else this.setState({ showActions: false });
  }

  toggleActions (e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showActions: !this.state.showActions });
  }

  handleClick (success) {
    this.setState({ activeModal: false });
    if (typeof success === 'function') success();
  }

  close () {
    this.setState({ showActions: false });
  }

  onSuccess () {
    this.setState({ activeModal: true, showActions: false });
    // if (typeof success === 'function') success();
  }

  render () {
    const { config } = this.props;
    const { showActions, activeModal } = this.state;
    console.log('posttext', config[0].postActionText);
    return (
      <div className='dropdown__options form-group__element--right'>
        <a className='dropdown__options__btn button--green button button--small' href='#' onClick={this.toggleActions}><span>Options</span></a>
        <ul className={c('dropdown__menu', {
          'dropdown__menu--hidden': !showActions
        })}>
          {config.map(d => <li key={d.text}>
            <AsyncCommand action={d.action}
              success={this.onSuccess}
              error={this.close}
              status={d.status}
              disabled={d.disabled}
              confirmAction={d.confirmAction}
              confirmText={d.confirmText}
              confirmOptions={d.confirmOptions}
              className={'link--no-underline'}
              element='a'
              text={d.text} />
            { activeModal && <div className='modal__cover'></div>}
            <div className={ activeModal ? 'modal__container modal__container--onscreen' : 'modal__container' }>
              <DefaultModal
                className='link--no-underline'
                onCancel={this.close}
                onCloseModal={() => this.handleClick(d.success)}
                cancelButtonText={'Close'}
                hasConfirmButton={false}
                title={d.postActionText}
                children={(<p>{d.postActionText}</p>)}
                showModal={activeModal}
                cancelButtonClass={'button--cancel'}
              />
            </div>
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

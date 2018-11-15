'use strict';
import React from 'react';
import { login, setTokenState } from '../../actions';
import { window } from '../../utils/browser';
import { updateDelay } from '../../config';
import ErrorReport from '../errors/report';
import Text from '../form/text';

var LoginModal = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object,
    location: React.PropTypes.object,
    router: React.PropTypes.object,
    show: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      user: '',
      pass: '',
      token: null
    };
  },

  componentWillReceiveProps: function (newProps) {
    // delay-close the modal if it's open
    if (newProps.api.authenticated && this.props.show) {
      const { dispatch } = this.props;
      dispatch(setTokenState(this.state.token));
      const { pathname } = this.props.location;
      if (pathname !== '/login' && window.location && window.location.reload) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/login') {
        setTimeout(() => this.props.router.push('/'), updateDelay);
      }
    }
  },

  onSubmit: function (e) {
    e.preventDefault();
    if (this.props.api.authenticated) return false;
    const { user, pass } = this.state;
    const token = new Buffer(`${user}:${pass}`).toString('base64');
    const { dispatch } = this.props;
    this.setState({ token }, () => dispatch(login(token)));
  },

  render: function () {
    const { authenticated, inflight, error } = this.props.api;
    const { show } = this.props;

    return (
      <div>
        { show ? <div className='modal__cover'></div> : null }
        <div className={ show ? 'modal__container modal__container--onscreen' : 'modal__container' }>
          { show ? (
            <div className='modal'>
              <div className='modal__internal'>
                <h2 className='heading--medium with-description'>Log in to Cumulus</h2>
                <p className='metadata__updated'>{ authenticated ? <strong>Success!</strong> : 'Enter your username and password' }</p>
                <form>
                  <div className='form__login'>
                    <Text label={'Username'}
                      value={this.state.user}
                      id={'login-user'}
                      className='input--lg'
                      onChange={(id, value) => this.setState({user: value})} />
                    <Text label={'Password'}
                      value={this.state.pass}
                      id={'login-pass'}
                      type={'password'}
                      className='input--lg'
                      onChange={(id, value) => this.setState({pass: value})} />
                    <span className='button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'>
                      <input
                        type='submit'
                        value={inflight ? 'Loading...' : 'Submit'}
                        onClick={this.onSubmit}
                        readOnly={true}
                      />
                    </span>
                  </div>
                </form>
                { error ? <ErrorReport report={error} /> : null }
              </div>
            </div>
          ) : null }
        </div>
      </div>
    );
  }
});

export default LoginModal;

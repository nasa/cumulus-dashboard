'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { login, setTokenState } from '../../actions';
import { window } from '../../utils/browser';
import { updateDelay } from '../../config';
import ErrorReport from '../errors/report';
import Text from '../form/text';

class LoginModal extends React.Component {
  constructor () {
    super();
    this.state = {
      user: '',
      pass: '',
      token: null
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate (prevProps) {
    // delay-close the modal if it's open
    if (this.props.api.authenticated && prevProps.show) {
      const { dispatch } = prevProps;
      dispatch(setTokenState(this.state.token));
      const { pathname } = prevProps.location;
      if (pathname !== '/login' && window.location && window.location.reload) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/login') {
        setTimeout(() => prevProps.router.push('/'), updateDelay);
      }
    }
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.props.api.authenticated) return false;
    const { user, pass } = this.state;
    const token = new Buffer(`${user}:${pass}`).toString('base64');
    const { dispatch } = this.props;
    this.setState({ token }, () => dispatch(login(token)));
  }

  render () {
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
}

LoginModal.propTypes = {
  dispatch: PropTypes.func,
  api: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object,
  show: PropTypes.bool
};

export default LoginModal;

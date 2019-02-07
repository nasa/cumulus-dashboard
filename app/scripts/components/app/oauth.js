'use strict';

import React from 'react';
import { connect } from 'react-redux';
import url from 'url';
import { login, setTokenState } from '../../actions';
import { window } from '../../utils/browser';
import { buildRedirectUrl } from '../../utils/format';
import { updateDelay, apiRoot } from '../../config';
import PropTypes from 'prop-types';
import ErrorReport from '../errors/report';
import Header from './header';

class OAuth extends React.Component {
  constructor () {
    super();
    this.state = {
      token: null,
      error: null
    };
  }

  componentDidUpdate (prevProps) {
    // delay-close the modal if it's open
    if (this.props.api.authenticated &&
        this.props.api.authenticated !== prevProps.api.authenticated) {
      prevProps.dispatch(setTokenState(this.state.token));
      const { pathname } = prevProps.location;
      if (pathname !== '/auth' && window.location && window.location.reload) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/auth') {
        setTimeout(() => this.props.router.push('/'), updateDelay);
      }
    }
  }

  componentDidMount () {
    const query = this.props.location.query;
    if (query.token) {
      const token = query.token;
      const { dispatch } = this.props;
      this.setState({ token }, () => dispatch(login(token))); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  render () {
    const { dispatch, api, apiVersion } = this.props;

    let button;
    if (!api.authenticated && !api.inflight) {
      const redirect = buildRedirectUrl(window.location);
      button = <div style={{textAlign: 'center'}}><a href={url.resolve(apiRoot, `token?state=${redirect}`)} >Login with Earthdata Login</a></div>;
    }
    return (
      <div className='app'>
        <Header dispatch={dispatch} api={api} apiVersion={apiVersion} minimal={true}/>
        <main className='main' role='main'>
          <div>
            <div className='modal__cover'></div>
            <div className='modal__container modal__container--onscreen'>
              <div className='modal'>
                <div className='modal__internal'>
                  { api.inflight ? <h2 className='heading--medium'>Authenticating ... </h2> : null }
                  { api.error ? <ErrorReport report={api.error} /> : null }
                  { button }
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

OAuth.propTypes = {
  dispatch: PropTypes.func,
  api: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object,
  apiVersion: PropTypes.object
};

export default connect(state => state)(OAuth);

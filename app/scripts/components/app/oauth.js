'use strict';

import React from 'react';
import { connect } from 'react-redux';
import url from 'url';
import createReactClass from 'create-react-class';
import { login, setTokenState } from '../../actions';
import { window } from '../../utils/browser';
import { updateDelay, apiRoot } from '../../config';
import PropTypes from 'prop-types';
import ErrorReport from '../errors/report';
import Header from './header';

var OAuth = createReactClass({
  propTypes: {
    dispatch: PropTypes.func,
    api: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object,
    apiVersion: PropTypes.object
  },

  getInitialState: function () {
    return {
      token: null,
      error: null
    };
  },

  UNSAFE_componentWillReceiveProps: function (newProps) {
    // delay-close the modal if it's open
    if (newProps.api.authenticated &&
        newProps.api.authenticated !== this.props.api.authenticated) {
      this.props.dispatch(setTokenState(this.state.token));
      const { pathname } = this.props.location;
      if (pathname !== '/auth' && window.location && window.location.reload) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/auth') {
        setTimeout(() => this.props.router.push('/'), updateDelay);
      }
    }
  },

  UNSAFE_componentWillMount: function () {
    const query = this.props.location.query;
    if (query.token) {
      const token = query.token;
      const { dispatch } = this.props;
      this.setState({ token }, () => dispatch(login(token)));
    }
  },

  render: function () {
    const { dispatch, api, apiVersion } = this.props;

    let button;
    if (!api.authenticated && !api.inflight) {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const redirect = encodeURIComponent(url.resolve(origin, pathname) + hash);
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
});

export default connect(state => state)(OAuth);

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import url from 'url';
import request from 'request';
import { login } from '../../actions';
import { window } from '../../utils/browser';
import { set as setToken } from '../../utils/auth';
import { updateDelay, apiRoot } from '../../config';
import ErrorReport from '../errors/report';
import Header from './header';

var OAuth = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object,
    location: React.PropTypes.object,
    router: React.PropTypes.object,
    show: React.PropTypes.bool,
    error: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      token: null,
      error: null
    };
  },

  componentWillReceiveProps: function (newProps) {
    // delay-close the modal if it's open
    if (newProps.api.authenticated) {
      setToken(this.state.token);
      const { pathname } = this.props.location;
      if (pathname !== '/auth' && window.location && window.location.reload) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/auth') {
        setTimeout(() => this.props.router.push('/'), updateDelay);
      }
    }
  },

  componentDidMount: function () {
    const params = window.location.hash.split('?')[1];
    const args = { url: url.resolve(apiRoot, `auth/token?${params}`) };
    request.get(args, (error, resp, body) => {
      if (error || +resp.statusCode >= 400) {
        const message = error || JSON.parse(resp.body).message;
        this.setState({ error: message });
      } else {
        const { user, password } = JSON.parse(resp.body);
        const token = new Buffer(`${user}:${password}`).toString('base64');
        const { dispatch } = this.props;
        this.setState({ token }, () => dispatch(login(token)));
      }
    });
  },

  render: function () {
    const { dispatch, api, error } = this.props;
    return (
      <div className='app'>
        <Header dispatch={dispatch} api={api} minimal={true}/>
        <main className='main' role='main'>
          <div>
            <div className='modal__cover'></div>
            <div className='modal__container modal__container--onscreen'>
              <div className='modal'>
                <div className='modal__internal'>
                  <h2 className='heading--medium'>Checking login { error ? null : '...' }</h2>
                  { error ? <ErrorReport report={error} /> : null }
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

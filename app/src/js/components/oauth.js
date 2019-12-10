'use strict';

import React from 'react';
import { connect } from 'react-redux';
import url from 'url';
import { login, setTokenState } from '../actions';
import { window } from '../utils/browser';
import { buildRedirectUrl } from '../utils/format';
import { updateDelay, apiRoot, oauthMethod } from '../config';
import PropTypes from 'prop-types';
import ErrorReport from './Errors/report';
import Header from './Header/header';
import Modal from 'react-bootstrap/Modal';

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
      if (oauthMethod === 'launchpad') {
        button = <div style={{textAlign: 'center'}}><a className="button button--oauth" href={url.resolve(apiRoot, `saml/login?RelayState=${redirect}`)}>Login with Launchpad</a></div>;
      } else {
        button = <div style={{textAlign: 'center'}}><a className="button button--oauth" href={url.resolve(apiRoot, `token?state=${redirect}`)} >Login with Earthdata Login</a></div>;
      }
    }

    return (
      <div className='app'>
        <Header dispatch={dispatch} api={api} apiVersion={apiVersion} minimal={true}/>
          <main className='main' role='main'>
            <div className="modal-content">
              <Modal
              dialogClassName="oauth-modal"
              show= {true}
              centered
              size="sm"
              aria-labelledby="modal__oauth-modal"
              >
                <Modal.Header className="oauth-modal__header"></Modal.Header>
                  <Modal.Title id="modal__oauth-modal" className="oauth-modal__title">Welcome To Cumulus Dashboard</Modal.Title>
                    <Modal.Body>
                      { api.inflight ? <h2 className='heading--medium'>Authenticating ... </h2> : null }
                      { api.error ? <ErrorReport report={api.error} /> : null }
                    </Modal.Body>
                      <Modal.Footer>
                        { button }
                      </Modal.Footer>
              </Modal>
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

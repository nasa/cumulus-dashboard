import React from 'react';
import { connect } from 'react-redux';
import withQueryParams from 'react-router-query-params';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import { login, setTokenState } from '../actions';
import { window } from '../utils/browser';
import { buildRedirectUrl } from '../utils/format';
import _config from '../config';
import ErrorReport from './Errors/report';
import Header from './Header/header';
import { historyPushWithQueryParams } from '../utils/url-helper';

const { updateDelay, apiRoot, oauthMethod } = _config;

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
      if (pathname !== '/auth' && get(window, 'location.reload')) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/auth') {
        setTimeout(() => historyPushWithQueryParams('/'), updateDelay); // react isn't seeing this a function
      }
    }
  }

  componentDidMount () {
    const { token } = this.props.queryParams;
    if (token) {
      const { dispatch } = this.props;
      this.setState({ token }, () => dispatch(login(token)));
    }
  }

  render () {
    const { dispatch, api, apiVersion } = this.props;
    let button;
    if (!api.authenticated && !api.inflight) {
      const redirect = buildRedirectUrl(window.location);
      if (oauthMethod === 'launchpad') {
        button = <div style={{ textAlign: 'center' }}><a className="button button--oauth" href={new URL(`saml/login?RelayState=${redirect}`, apiRoot).href}>Login with Launchpad</a></div>;
      } else {
        button = <div style={{ textAlign: 'center' }}><a className="button button--oauth" href={new URL(`token?state=${redirect}`, apiRoot).href} >Login with Earthdata Login</a></div>;
      }
    }

    return (
      <div className='app'>
        <Helmet>
          <title>Cumulus Login</title>
        </Helmet>
        <Header dispatch={dispatch} api={api} apiVersion={apiVersion} minimal={true}/>
        <main className='main' role='main'>
          <div className="modal-content">
            <Modal
              dialogClassName="oauth-modal"
              show= {true}
              centered
              size="sm"
              aria-labelledby="modal__oauth-modal"
              role="main"
            >
              <Modal.Header className="oauth-modal__header"></Modal.Header>
              <h1><Modal.Title id="modal__oauth-modal" className="oauth-modal__title">Welcome To Cumulus Dashboard</Modal.Title></h1>
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
  apiVersion: PropTypes.object,
  queryParams: PropTypes.object
};

export { OAuth };

export default withRouter(withQueryParams()(connect((state) => state)(OAuth)));

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
// import get from 'lodash/get';
import { login, setTokenState } from '../actions';
import { window } from '../utils/browser';
import { buildRedirectUrl } from '../utils/format';
import _config from '../config';
import ErrorReport from './Errors/report';
import Header from './Header/header';
// import { historyPushWithQueryParams } from '../utils/url-helper';
import { withUrlHelper } from '../withUrlHelper';
// import withRouter from '../withRouter';

const { updateDelay, apiRoot, oauthMethod } = _config;

const OAuth = ({ urlHelper }) => {
  const [token, setToken] = useState(null);

  const dispatch = useDispatch(); // using dispatch hook to call from redux store actions
  const { location, historyPushWithQueryParams } = urlHelper; // using props in withUrlHelper wrapper

  const authenticated = useSelector((state) => state.api.authenicated);
  const api = useSelector((state) => state.api);
  const apiVersion = useSelector((state) => state.apiVersion);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryToken = params.get('token');
    const stateParam = params.get('state');

    if (queryToken) {
      setToken(queryToken);

      let state = {};
      try {
        state = JSON.parse(decodeURIComponent(stateParam));
        console.log('Parsed state:', state);
      } catch (error) {
        console.error('Error parsing state:', error);
      }

      dispatch(login(queryToken));
      dispatch(setTokenState(queryToken));
    }
  }, [dispatch, location]);

  useEffect(() => {
    if (authenticated) {
      dispatch(setTokenState(token));
      const { pathname } = location;
      if (pathname !== '/auth') {
        setTimeout(() => window.location.reload(), updateDelay);
      } else {
        setTimeout(() => historyPushWithQueryParams('/'), updateDelay);
      }
    }
  }, [authenticated, location, dispatch, token, historyPushWithQueryParams]);

  let button;
  if (!authenticated && !api.inflight) {
    const redirect = buildRedirectUrl(window.location);
    console.log('Redirect URL:', redirect);
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
};

OAuth.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    historyPushWithQueryParams: PropTypes.func,
  }),
};

export { OAuth };

export default withUrlHelper(OAuth);

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import withQueryParams from 'react-router-query-params';
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
// import { historyPushWithQueryParams } from '../utils/url-helper';
import withRouter from '../withRouter';

const { updateDelay, apiRoot, oauthMethod } = _config;

const OAuth = ({
  router
}) => {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const { location, navigate } = router; // using props in withRouter wrapper
  const api = useSelector((state) => state.api);
  const apiVersion = useSelector((state) => state.apiVersion);
  const authenticated = useSelector((state) => state.api.authenicated);

  console.log('location:', location);

  useEffect(() => {
    if (authenticated) {
      dispatch(setTokenState(token));
      const { pathname } = location;
      if (pathname !== '/auth' && get(window, 'location.reload')) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/auth') {
        setTimeout(() => navigate('/'), updateDelay); // react isn't seeing this a function
      }
    }
  }, [authenticated, dispatch, location, token, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryToken = params.get('token');
    if (queryToken) {
      setToken(queryToken);
      dispatch(login(queryToken));
    }
  }, [dispatch, location]);

  let button;
  if (!authenticated && !(api && api.inflight)) {
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
              { api && api.inflight ? <h2 className='heading--medium'>Authenticating ... </h2> : null }
              { api && api.error ? <ErrorReport report={api.error} /> : null }
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
  router: PropTypes.shape({
    location: PropTypes.object,
    navigate: PropTypes.func,
    params: PropTypes.object
  })
};

export { OAuth };

export default withRouter(OAuth);

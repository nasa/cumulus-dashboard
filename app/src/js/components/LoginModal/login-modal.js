import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import get from 'lodash/get';
import { login, setTokenState } from '../../actions';
import { window } from '../../utils/browser';
import { updateDelay } from '../../config';
import ErrorReport from '../Errors/report';
import Text from '../TextAreaForm/text';
import { historyPushWithQueryParams } from '../../utils/url-helper';

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
      if (pathname !== '/login' && get(window, 'location.reload')) {
        setTimeout(() => window.location.reload(), updateDelay);
      } else if (pathname === '/login') {
        setTimeout(() => historyPushWithQueryParams('/'), updateDelay);
      }
    }
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.props.api.authenticated) return false;
    const { user, pass } = this.state;
    const token = Buffer.from(`${user}:${pass}`).toString('base64');
    const { dispatch } = this.props;
    this.setState({ token }, () => dispatch(login(token)));
  }

  render () {
    const { authenticated, inflight, error } = this.props.api;
    const { show } = this.props;

    return (
      <div>
        { show ? <div className='modal__content'></div> : null }
        <div className={ show ? 'modal__container modal__container--onscreen' : 'modal__container' }>
          { show
            ? (
            <Modal
              dialogClassName="login-modal"
              show= {true}
              centered
              size="md"
              aria-labelledby="modal__login-modal"
            >
              <Modal.Header className="login-modal__header" closeButton></Modal.Header>
              <Modal.Title id="modal__login-modal" className="login-modal__title">Log in to Cumulus</Modal.Title>
              <Modal.Body>
                <p className='metadata__updated'>{ authenticated ? <strong>Success!</strong> : 'Enter your username and password' }</p>
                <form>
                  <div className='form__login'>
                    <Text label={'Username'}
                      value={this.state.user}
                      id={'login-user'}
                      className='input--lg'
                      onChange={(id, value) => this.setState({ user: value })} />
                    <Text label={'Password'}
                      value={this.state.pass}
                      id={'login-pass'}
                      type={'password'}
                      className='input--lg'
                      onChange={(id, value) => this.setState({ pass: value })} />
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
              </Modal.Body>
            </Modal>
              )
            : null }
        </div>
      </div>
    );
  }
}

LoginModal.propTypes = {
  dispatch: PropTypes.func,
  api: PropTypes.object,
  location: PropTypes.object,
  show: PropTypes.bool
};

export default LoginModal;

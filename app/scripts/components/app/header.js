'use strict';
import React from 'react';
import { Link } from 'react-router';
import { login, logout } from '../../actions';
import { graphicsPath } from '../../config';
import { Form, formTypes } from '../form';
import { window } from '../../utils/browser';
import * as validate from '../../utils/validate';
import { set as setToken } from '../../utils/auth';

const inputElements = [
  {
    schemaProperty: 'user',
    label: 'Username',
    type: formTypes.text,
    validate: validate.isText
  },
  {
    schemaProperty: 'pass',
    label: 'Password',
    type: formTypes.text,
    validate: validate.isText
  }
];

var Header = React.createClass({
  displayName: 'Header',
  propTypes: {
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      showModal: false,
      token: null
    };
  },

  componentWillReceiveProps: function (newProps) {
    // delay-close the modal if it's open
    if (newProps.api.authenticated && this.state.showModal) {
      setToken(this.state.token);
      if (window.location && window.location.reload) {
        setTimeout(() => window.location.reload(), 500);
      }
    }
  },

  showLoginModal: function () {
    this.setState({ showModal: true });
  },

  hideLoginModal: function () {
    this.setState({ showModal: false });
  },

  login: function (credentials) {
    const { user, pass } = credentials;
    const token = new Buffer(`${user}:${pass}`).toString('base64');
    const { dispatch } = this.props;
    this.setState({ token }, () => dispatch(login(token)));
  },

  logout: function () {
    this.props.dispatch(logout());
    if (window.location && window.location.reload) {
      setTimeout(() => window.location.reload(), 50);
    }
  },

  render: function () {
    const { authenticated, inflight } = this.props.api;
    const { showModal } = this.state;
    return (
      <div className='header'>
        <div className='row'>
          <h1 className='logo'><Link to='/'><img alt="Cumulus Logo" src={graphicsPath + 'layout/cumulus-logo.png'} /></Link></h1>
          <nav>
            <ul>
              <li><Link to='/collections'>Collections</Link></li>
              <li><Link to='/granules'>Granules</Link></li>
              <li><Link to='/pdrs'>PDR's</Link></li>
              <li><Link to='/logs'>Logs</Link></li>
              <li><Link to='/contact'>Contact</Link></li>
              <li className='rightalign'>{ authenticated ? <a onClick={this.logout}>Log out</a> : <a onClick={this.showLoginModal}>Log in</a> }</li>
            </ul>
          </nav>
        </div>

        { showModal ? <div className='modal__cover'></div> : null }

        <div className={ showModal ? 'login login__onscreen' : 'login' }>
          <div className='modal'>
            <div className='modal__internal'>
              <p>{ authenticated ? 'Success!' : 'Enter your username and password' }</p>
              <Form
                inputMeta={inputElements}
                cancel={this.hideLoginModal}
                submit={this.login}
                inflight={inflight}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Header;

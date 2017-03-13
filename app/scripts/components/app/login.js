import React from 'react';
import { connect } from 'react-redux';
import Header from './header';
import LoginModal from './login-modal';

var Login = React.createClass({

  propTypes: {
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object,
    location: React.PropTypes.object,
    router: React.PropTypes.object
  },

  render: function () {
    const { dispatch, api, location, router } = this.props;
    return (
      <div className='app'>
        <Header dispatch={dispatch} api={api} minimal={true}/>
        <main className='main' role='main'>
          <LoginModal dispatch={dispatch} api={api} location={location} show={true} router={router}/>
        </main>
      </div>
    );
  }
});

export default connect(state => state)(Login);

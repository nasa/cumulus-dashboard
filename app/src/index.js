import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { target, environment } from './js/config';
import { displayCase } from './js/utils/format';

import Header from './js/components/Header/header';
import Footer from './js/components/Footer/footer';
import TopButton from './js/components/TopButton/TopButton';

class App extends React.Component {
  constructor () {
    super();
    this.displayName = 'App';
  }

  render () {
    return (
      <div className='app'>
        { target !== 'cumulus' ? (
          <div className='app__target--container'>
            <div className="alert alert-primary" role="alert">
              This is a primary alert—check it out!
            </div>
            <h4 className='app__target'>{displayCase(target)} ({displayCase(environment)})</h4>
          </div>
        ) : null }
        <Header dispatch={this.props.dispatch} api={this.props.api} location={this.props.location}/>
        <main className='main' role='main'>
          {this.props.children}
        </main>
        <section className='page__section--top'>
            <TopButton/>
          </section>
        <Footer api={this.props.api} apiVersion={this.props.apiVersion} />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  api: PropTypes.object,
  apiVersion: PropTypes.object
};

export default connect(state => state)(App);

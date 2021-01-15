import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _config from './config';
import { displayCase } from './utils/format';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import TopButton from './components/TopButton/TopButton';

const { target, environment } = _config;

class Main extends Component {
  render () {
    return (
      <div className='app'>
        {target !== 'cumulus' ? (
          <div className='app__target--container'>
            <h4 className='app__target'>{displayCase(target)} ({displayCase(environment)})</h4>
          </div>
        ) : null}
        <Header
          dispatch={this.props.dispatch}
          api={this.props.api}
          location={this.props.location}
          cumulusInstance={this.props.cumulusInstance}
        />
        <main className='main' role='main'>
          {this.props.children}
        </main>
        <section className='page__section--top'>
          <TopButton />
        </section>
        <Footer api={this.props.api} apiVersion={this.props.apiVersion} />
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  dispatch: PropTypes.func,
  location: PropTypes.object,
  api: PropTypes.object,
  apiVersion: PropTypes.object,
  cumulusInstance: PropTypes.object
};

export { Main };

export default withRouter(connect((state) => state)(Main));

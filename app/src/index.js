import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// import { target, environment } from './config';
// import { displayCase } from './utils/format';

import './css/main.scss';
import './public/favicon.ico';

import App from '../src/js/App';

ReactDOM.render(<App />, document.getElementById('site-canvas'));

/* <div className='app'>
{target !== 'cumulus' ? (
  <div className='app__target--container'>
    <h4 className='app__target'>{displayCase(target)} ({displayCase(environment)})</h4>
  </div>
) : null}
<Header dispatch={this.props.dispatch} api={this.props.api} location={this.props.location} />
<main className='main' role='main'>
  {this.props.children}
</main>
<section className='page__section--top'>
  <TopButton />
</section>
<Footer api={this.props.api} apiVersion={this.props.apiVersion} />
</div>
*/

/* App.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  api: PropTypes.object,
  apiVersion: PropTypes.object
};*/

export default connect(state => state)(App);

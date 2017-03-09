'use strict';
import React from 'react';
import LoadingEllipsis from '../app/loading-ellipsis';
import { document } from '../../utils/browser';

const Search = React.createClass({
  displayName: 'Search',

  propTypes: {
    dispatch: React.PropTypes.func,
    action: React.PropTypes.func,
    results: React.PropTypes.object,
    format: React.PropTypes.func,
    clear: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      value: ''
    };
  },

  componentWillMount: function () {
    const self = this;
    function onWindowClick () {
      setTimeout(() => {
        self.cleanup();
      }, 50);
    }
    if (document && typeof document.addEventListener === 'function') {
      document.addEventListener('click', onWindowClick);
      this.clearListener = () => document.removeEventListener('click', onWindowClick);
    }
  },

  componentWillUnmount: function () {
    this.cleanup();
    if (this.clearListener) { this.clearListener(); }
  },

  cleanup: function () {
    if (this.cancelDelay) { this.cancelDelay(); }
    const { dispatch, clear } = this.props;
    dispatch(clear());
  },

  complete: function (e) {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (this.cancelDelay) { this.cancelDelay(); }
    this.cancelDelay = this.delayedQuery(value);
  },

  submit: function (e) {
    e.preventDefault();
    const value = e.currentTarget.value;
    const { dispatch, action } = this.props;
    if (this.cancelDelay) { this.cancelDelay(); }
    dispatch(action({ prefix: value }));
  },

  delayedQuery: function (value) {
    const { dispatch, action, clear } = this.props;
    const timeoutId = setTimeout(function () {
      if (value && value.length) {
        dispatch(action({ prefix: value }));
      } else {
        dispatch(clear());
      }
    }, 650);
    return () => clearTimeout(timeoutId);
  },

  render: function () {
    const { results } = this.props;
    return (
      <form className='search__wrapper form-group__element' onSubmit={this.submit} value={this.state.value}>
        <input className='search' type='search' onChange={this.complete}/>
        <span className={results.inflight ? 'search__loading' : 'search__icon'}>
          {results.inflight ? <LoadingEllipsis /> : null}
        </span>
        {results.data.length ? (
          <ul className='search__results'>
            {results.data.map(this.props.format)}
          </ul>
        ) : null}
      </form>
    );
  }
});
export default Search;

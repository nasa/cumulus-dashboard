'use strict';
import React from 'react';
import LoadingEllipsis from '../app/loading-ellipsis';

const Search = React.createClass({
  displayName: 'Search',

  propTypes: {
    dispatch: React.PropTypes.func,
    action: React.PropTypes.func,
    results: React.PropTypes.object,
    format: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      value: ''
    };
  },

  componentWillUnmount: function () {
    if (this.cancelDelay) { this.cancelDelay(); }
  },

  complete: function (e) {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (this.cancelDelay) { this.cancelDelay(); }
    this.cancelDelay = this.delayedQuery(value);
  },

  submit: function (e) {
    e.preventDefault();
    const { dispatch, action } = this.props;
    if (this.cancelDelay) { this.cancelDelay(); }
    dispatch(action({ q: e.currentTarget.value }));
  },

  delayedQuery: function (value) {
    const { dispatch, action } = this.props;
    const timeoutId = setTimeout(function () {
      if (value.length > 2) {
        dispatch(action({ q: value }));
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

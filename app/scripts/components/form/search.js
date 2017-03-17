'use strict';
import React from 'react';

const Search = React.createClass({
  displayName: 'Search',

  propTypes: {
    dispatch: React.PropTypes.func,
    action: React.PropTypes.func,
    format: React.PropTypes.func,
    clear: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      value: null
    };
  },

  componentWillUnmount: function () {
    if (this.cancelDelay) { this.cancelDelay(); }
    const { dispatch, clear } = this.props;
    dispatch(clear());
  },

  complete: function (e) {
    const value = e.currentTarget.value || null;
    this.setState({ value });
    if (this.cancelDelay) { this.cancelDelay(); }
    this.cancelDelay = this.delayedQuery(value);
  },

  submit: function (e) {
    e.preventDefault();
    const value = e.currentTarget.getAttribute('value') || null;
    this.setState({ value });
    const { dispatch, action } = this.props;
    if (this.cancelDelay) { this.cancelDelay(); }
    dispatch(action(value));
  },

  delayedQuery: function (value) {
    const { dispatch, action, clear } = this.props;
    const timeoutId = setTimeout(function () {
      if (value && value.length) {
        dispatch(action(value));
      } else {
        dispatch(clear());
      }
    }, 650);
    return () => clearTimeout(timeoutId);
  },

  render: function () {
    return (
      <div className='filter__item'>
        <form className='search__wrapper form-group__element' onSubmit={this.submit} value={this.state.value}>
          <input className='search' type='search' onChange={this.complete}/>
          <span className='search__icon'/>
        </form>
      </div>
    );
  }
});
export default Search;

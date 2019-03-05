'use strict';
import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
  constructor () {
    super();
    this.displayName = 'Search';
    this.state = { value: null };
    this.complete = this.complete.bind(this);
    this.submit = this.submit.bind(this);
    this.delayedQuery = this.delayedQuery.bind(this);
  }

  componentWillUnmount () {
    if (this.cancelDelay) { this.cancelDelay(); }
    const { dispatch, clear } = this.props;
    dispatch(clear());
  }

  complete (e) {
    const value = e.currentTarget.value || null;
    this.setState({ value });
    if (this.cancelDelay) { this.cancelDelay(); }
    this.cancelDelay = this.delayedQuery(value);
  }

  submit (e) {
    e.preventDefault();
    const value = e.currentTarget.getAttribute('value') || null;
    this.setState({ value });
    const { dispatch, action } = this.props;
    if (this.cancelDelay) { this.cancelDelay(); }
    dispatch(action(value));
  }

  delayedQuery (value) {
    const { dispatch, action, clear } = this.props;
    const timeoutId = setTimeout(function () {
      if (value && value.length) {
        dispatch(action(value));
      } else {
        dispatch(clear());
      }
    }, 650);
    return () => clearTimeout(timeoutId);
  }

  render () {
    return (
      <div className='filter__item'>
        <form className='search__wrapper form-group__element' onSubmit={this.submit} value={this.state.value}>
          <input className='search' type='search' onChange={this.complete}/>
          <span className='search__icon'/>
        </form>
      </div>
    );
  }
}

Search.propTypes = {
  dispatch: PropTypes.func,
  action: PropTypes.func,
  clear: PropTypes.func
};

export default Search;

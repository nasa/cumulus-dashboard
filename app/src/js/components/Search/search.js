'use strict';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initialValueFromLocation } from '../../utils/url-helper';
import withQueryParams from 'react-router-query-params';
import { withRouter } from 'react-router-dom';

class Search extends React.Component {
  constructor (props) {
    super(props);
    this.displayName = 'Search';
    const value = initialValueFromLocation(props);
    this.state = { value };
    this.complete = this.complete.bind(this);
    this.submit = this.submit.bind(this);
    this.delayedQuery = this.delayedQuery.bind(this);
  }

  componentDidMount () {
    const { dispatch, action, paramKey, queryParams } = this.props;
    const queryValue = queryParams[paramKey];
    if (queryValue) dispatch(action(queryValue));
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {paramKey, dispatch, action, queryParams} = this.props;
    const queryValue = queryParams[paramKey];
    if (queryValue !== prevProps.queryParams[paramKey]) {
      dispatch(action(queryValue));
      this.setState({queryValue}); // eslint-disable-line react/no-did-update-set-state
    }
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
  }

  delayedQuery (value) {
    const { dispatch, action, clear, paramKey, setQueryParams } = this.props;
    const timeoutId = setTimeout(function () {
      if (value && value.length) {
        setQueryParams({[paramKey]: value});
        dispatch(action(value));
      } else {
        setQueryParams({[paramKey]: undefined});
        dispatch(clear());
      }
    }, 650);
    return () => clearTimeout(timeoutId);
  }

  render () {
    const { label, paramKey } = this.props;
    const formID = `form-${label}-${paramKey}`;
    return (
      <div className='filter__item'>
        {label ? <label htmlFor={formID}>{label}</label> : null}
        <form className='search__wrapper form-group__element' onSubmit={this.submit} >
          <input className='search' type='search' onChange={this.complete} value={this.state.value || ''} placeholder={this.props.placeholder || ''}/>
          <span className='search__icon'/>
        </form>
      </div>
    );
  }
}

Search.defaultProps = {
  paramKey: 'search'
};

Search.propTypes = {
  dispatch: PropTypes.func,
  action: PropTypes.func,
  clear: PropTypes.func,
  paramKey: PropTypes.string,
  label: PropTypes.any,
  location: PropTypes.object,
  router: PropTypes.object,
  query: PropTypes.object,
  queryParams: PropTypes.object,
  setQueryParams: PropTypes.func,
  placeholder: PropTypes.string
};

export default withRouter(withQueryParams()(connect(state => state)(Search)));

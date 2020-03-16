'use strict';
import c from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Autocomplete from 'react-autocomplete';
import { initialValueFromLocation } from '../../utils/url-helper';
import withQueryParams from 'react-router-query-params';

function shouldItemRender ({ label }, value) {
  return label.toLowerCase().indexOf(value) >= 0;
}

function renderItem (item, highlighted) {
  return <div className={c('autocomplete__select', {
    'autocomplete__select--highlighted': highlighted
  })} key={item.value}>{item.label}</div>;
}

function renderMenu (items, value, style) {
  return (
    <div className='autocomplete__menu' style={style} children={items} />
  );
}

/**
 * Translator for status objects.
 *
 * @param {Object} statusObject
 * @param {string} status - url query parameter to match. e.g. "running", "completed", "failed"
 * @returns {string} - either the correct label from the status Object, or the input status.
 */
const statusToLabel = (statusObject = {}, status) => {
  let result = Object.keys(statusObject).filter(
    (label) => statusObject[label] === status
  );
  if (result.length) return result[0];
  return status;
};

class Dropdown extends React.Component {
  constructor (props) {
    super(props);
    this.displayName = 'Dropdown';
    const value = statusToLabel(props.options, initialValueFromLocation(props));
    this.state = { value };
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {paramKey, dispatch, action, options, queryParams} = this.props;
    if (queryParams[paramKey] !== prevProps.queryParams[paramKey]) {
      let value = queryParams[paramKey];
      dispatch(action({ key: paramKey, value }));
      if (value) value = statusToLabel(options, value);
      this.setState({value}); // eslint-disable-line react/no-did-update-set-state
    }
  }

  componentDidMount () {
    const { dispatch, getOptions, action, paramKey, queryParams } = this.props;
    if (getOptions) { dispatch(getOptions()); }
    if (queryParams[paramKey]) dispatch(action({key: paramKey, value: queryParams[paramKey]}));
  }

  componentWillUnmount () {
    const { dispatch, clear, paramKey } = this.props;
    dispatch(clear(paramKey));
  }

  onSelect (selected, item) {
    const { dispatch, action, paramKey, setQueryParams } = this.props;
    dispatch(action({ key: paramKey, value: selected }));
    this.setState({ value: item.label });
    setQueryParams({ [paramKey]: item.value });
  }

  onChange (e) {
    e.preventDefault();
    const { dispatch, clear, paramKey, setQueryParams } = this.props;
    const { value } = e.target;
    this.setState({ value });
    if (!value.length) {
      dispatch(clear(paramKey));
      setQueryParams({ [paramKey]: undefined });
    }
  }

  onSubmit (e) {
    e.preventDefault();
  }

  render () {
    // `options` are expected in the following format:
    // {displayValue1: optionElementValue1, displayValue2, optionElementValue2, ...}
    const { options, label, paramKey, inputProps } = this.props;
    const items = options ? Object.keys(options).map(label => ({label, value: options[label]})) : [];

    // Make sure this form ID is unique!
    // If needed in future, could add MD5 hash of stringified options,
    // or a UUID library such as `hat()`
    const formID = `form-${label}-${paramKey}`;

    return (
      <div className='filter__item'>
        {label ? <label htmlFor={formID}>{label}</label> : null}
        <form className='form-group__element' id={formID} onSubmit={this.onSubmit}>
          <Autocomplete
            getItemValue={item => item.value}
            items={items}
            renderItem={renderItem}
            shouldItemRender={shouldItemRender}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            renderMenu={renderMenu}
            inputProps={inputProps}
          />
        </form>
      </div>
    );
  }
}

Dropdown.propTypes = {
  dispatch: PropTypes.func,
  options: PropTypes.object,
  getOptions: PropTypes.func,
  action: PropTypes.func,
  clear: PropTypes.func,
  paramKey: PropTypes.string,
  label: PropTypes.any,
  location: PropTypes.object,
  router: PropTypes.object,
  queryParams: PropTypes.object,
  setQueryParams: PropTypes.func,
  inputProps: PropTypes.object
};

export default withRouter(withQueryParams()(connect()(Dropdown)));

'use strict';
import c from './node_modules/classnames';
import React from './node_modules/react';
import PropTypes from './node_modules/prop-types';
import { connect } from './node_modules/react-redux';
import { withRouter } from './node_modules/react-router';
import Autocomplete from './node_modules/react-autocomplete';
import { initialValueFromLocation, updateRouterLocation } from '../../utils/url-helper';

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
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {location, paramKey, dispatch, action, options} = this.props;
    if (location.query[paramKey] !== prevProps.location.query[paramKey]) {
      let value = location.query[paramKey];
      dispatch(action({ key: paramKey, value }));
      if (value) value = statusToLabel(options, value);
      this.setState({value}); // eslint-disable-line react/no-did-update-set-state
    }
  }

  componentDidMount () {
    const { dispatch, getOptions, action, location, paramKey } = this.props;
    if (getOptions) { dispatch(getOptions()); }
    dispatch(action({key: paramKey, value: location.query[paramKey]}));
  }

  componentWillUnmount () {
    const { dispatch, clear, paramKey } = this.props;
    dispatch(clear(paramKey));
  }

  onSelect (selected, item) {
    const { dispatch, action, router, location, paramKey } = this.props;
    dispatch(action({ key: paramKey, value: selected }));
    this.setState({ value: item.label });
    updateRouterLocation(router, location, paramKey, item.value);
  }

  onChange (e) {
    const { dispatch, clear, router, location, paramKey } = this.props;
    const { value } = e.target;
    this.setState({ value });
    if (!value.length) {
      dispatch(clear(paramKey));
      updateRouterLocation(router, location, paramKey, '');
    }
  }

  render () {
    // `options` are expected in the following format:
    // {displayValue1: optionElementValue1, displayValue2, optionElementValue2, ...}
    const { options, label, paramKey } = this.props;
    const items = options ? Object.keys(options).map(label => ({label, value: options[label]})) : [];

    // Make sure this form ID is unique!
    // If needed in future, could add MD5 hash of stringified options,
    // or a UUID library such as `hat()`
    const formID = `form-${label}-${paramKey}`;

    return (
      <div className='filter__item'>
        {label ? <label htmlFor={formID}>{label}</label> : null}
        <form className='form-group__element' id={formID}>
          <Autocomplete
            getItemValue={item => item.value}
            items={items}
            renderItem={renderItem}
            shouldItemRender={shouldItemRender}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            renderMenu={renderMenu}
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
  router: PropTypes.object
};

export default withRouter(connect()(Dropdown));

'use strict';
import c from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autocomplete from 'react-autocomplete';

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

class Dropdown extends React.Component {
  constructor () {
    super();
    this.displayName = 'Dropdown';
    this.state = {
      value: ''
    };
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  UNSAFE_componentWillMount () { // eslint-disable-line camelcase
    const { dispatch, getOptions } = this.props;
    if (getOptions) { dispatch(getOptions()); }
  }

  componentWillUnmount () {
    const { dispatch, clear } = this.props;
    dispatch(clear(this.props.paramKey));
  }

  onSelect (selected, item) {
    const { dispatch, action } = this.props;
    dispatch(action({ key: this.props.paramKey, value: selected }));
    this.setState({ value: item.label });
  }

  onChange (e) {
    const { dispatch, clear } = this.props;
    const { value } = e.target;
    this.setState({ value });
    if (!value.length) {
      dispatch(clear(this.props.paramKey));
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
  label: PropTypes.any
};

export default connect()(Dropdown);

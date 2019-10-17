'use strict';
import c from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Autocomplete from 'react-autocomplete';
import isEmpty from 'lodash.isempty';

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
  constructor (props) {
    super(props);
    this.displayName = 'Dropdown';
    this.state = {
      value: ''
    };
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  updateHistory(router, location, value) {
    let newQuery = { ...location.query };
    if (value.length) {
      newQuery = { ...newQuery, [this.props.paramKey]: value };
    } else {
      delete newQuery[this.props.paramKey];
    }
    if (location.query[this.props.paramKey] !== newQuery[this.props.paramKey]) {
      location.query = newQuery;
      router.push(location);
    }
  }

  componentDidMount () {
    const { dispatch, getOptions, action, location } = this.props;
    if (
      !isEmpty(location.query) &&
        Object.hasOwnProperty.call(location.query, this.props.paramKey)
       ) {
      dispatch(action({key: this.props.paramKey, value: location.query[this.props.paramKey]}));
      // This shouldn't do this.setState here
      // TODO [MHS, 2019-10-16] And really
      // any stuff we're doing in this dropdown.js should be passed in by the
      // parent as props.  Figure that out
      this.setState({value: location.query[this.props.paramKey]});
    }
    if (getOptions) { dispatch(getOptions()); }
  }

  componentWillUnmount () {
    const { dispatch, clear } = this.props;
    dispatch(clear(this.props.paramKey));
  }

  onSelect (selected, item) {
    const { dispatch, action, router, location } = this.props;
    dispatch(action({ key: this.props.paramKey, value: selected }));
    this.setState({ value: item.label });
    this.updateHistory(router, location, item.value);
  }

  onChange (e) {
    const { dispatch, clear, router, location } = this.props;
    const { value } = e.target;
    this.setState({ value });
    if (!value.length) {
      dispatch(clear(this.props.paramKey));
      this.updateHistory(router, location, "");
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

export default withRouter(connect()(Dropdown));

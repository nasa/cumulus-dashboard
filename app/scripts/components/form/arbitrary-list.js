'use strict';
import React from 'react';

const List = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.array,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  onChange: function (index, newValue) {
    const value = this.props.value.slice();
    value[index] = newValue;
    this.props.onChange(this.props.id, value);
  },

  add: function (e) {
    e.preventDefault();
    const value = this.props.value.slice();
    if (!value[value.length - 1]) return false;
    value.push('');
    this.props.onChange(this.props.id, value);
  },

  remove: function (index) {
    let value = this.props.value.slice();
    value.splice(index, 1);
    this.props.onChange(this.props.id, value);
  },

  render: function () {
    let {
      label,
      value,
      error
    } = this.props;

    // if there are no items, include an extra row
    const items = value.length ? value : [''];

    return (
      <div className='form__addone'>
        <label>{label}</label>
        <span className='form__error'>{error}</span>
        <ul className='form__addone--items'>
          {items.map(this.renderItem)}
        </ul>
      </div>
    );
  },

  renderItem: function (item, i, items) {
    const add = i === items.length - 1;
    // only allow adds if you've entered something
    const disabled = add && !item.length;
    return (
      <li key={i} className='form__addone--item'>
        <input
          className='form__addone--input'
          value={item}
          onChange={(e) => this.onChange(i, e.target.value)}
        />
        { add ? <button
          onClick={this.add}
          className={'button form__addone--button' + (disabled ? ' button--disabled' : '')}>+</button>
        : null }

        { !add ? <button
          onClick={(e) => { e.preventDefault(); this.remove(i); }}
          className='button form__addone--button'>-</button>
        : null }
      </li>
    );
  }
});
export default List;

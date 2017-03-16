'use strict';
import React from 'react';

var List = React.createClass({
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
    value.push('');
    this.props.onChange(this.props.id, value);
  },

  remove: function (index) {
    const value = this.props.value.slice().splice(index);
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
      <div className='form__list'>
        <label>{label} {error}</label>
        <ul className='form__list--items'>
          {items.map(this.renderItem)}
        </ul>
      </div>
    );
  },

  renderItem: function (item, i, items) {
    const add = i === items.length - 1;
    return (
      <li key={item + i} className='form__list--item'>
        <input
          value={item}
          onChange={(e) => this.onChange(i, e.target.value)}
        />
        { add ? <button onClick={this.add} className='button form__list--button'>+</button> : null }
        { !add ? <button onClick={(e) => { e.preventDefault(); this.remove(i); }} className='button form__list--button'>-</button> : null }
      </li>
    );
  }
});
export default List;

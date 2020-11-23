import React from 'react';
import PropTypes from 'prop-types';

class List extends React.Component {
  constructor () {
    super();
    this.onChange = this.onChange.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onChange (index, newValue) {
    const value = this.props.value.slice();
    value[index] = newValue;
    this.props.onChange(this.props.id, value);
  }

  add (e) {
    e.preventDefault();
    const value = this.props.value.slice();
    if (!value[value.length - 1]) return;
    value.push('');
    this.props.onChange(this.props.id, value);
  }

  remove (index) {
    const value = this.props.value.slice();
    value.splice(index, 1);
    this.props.onChange(this.props.id, value);
  }

  render () {
    const {
      label,
      value,
      error
    } = this.props;

    // if there are no items, include an extra row
    const items = value.length ? value : [''];

    return (
      <div className={`form__addone${error ? ' form__error--wrapper' : ''}`}>
        <label>{label}
          {error && <span className='form__error'>{error}</span>}
          <ul className='form__addone--items'>
            {items.map(this.renderItem)}
          </ul>
        </label>
      </div>
    );
  }

  renderItem (item, i, items) {
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
          aria-label="Add"
          onClick={this.add}
          className={`button form__addone--button${disabled ? ' button--disabled' : ''}`}>+</button>
          : null }

        { !add ? <button
          aria-label="Remove"
          onClick={(e) => { e.preventDefault(); this.remove(i); }}
          className='button form__addone--button'>-</button>
          : null }
      </li>
    );
  }
}

List.propTypes = {
  label: PropTypes.any,
  value: PropTypes.array,
  id: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};

export default List;

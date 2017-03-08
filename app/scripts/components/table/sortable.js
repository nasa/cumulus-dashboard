'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { isUndefined } from '../../utils/validate';

const defaultSortOrder = 'desc';
const otherOrder = {
  desc: 'asc',
  asc: 'desc'
};

const Table = React.createClass({
  displayName: 'SortableTable',

  propTypes: {
    primaryIdx: React.PropTypes.number,
    data: React.PropTypes.array,
    header: React.PropTypes.array,
    props: React.PropTypes.array,
    row: React.PropTypes.array,
    sortIdx: React.PropTypes.number,
    order: React.PropTypes.string,
    changeSortProps: React.PropTypes.func,
    changeSelectionProp: React.PropTypes.func,
    isRemovable: React.PropTypes.bool,
    selectedRows: React.PropTypes.array
  },

  unSortable: function () {
    return isUndefined(this.props.sortIdx) || !this.props.order || !Array.isArray(this.props.props);
  },

  changeSort: function (e) {
    if (this.unSortable()) { return; }
    const value = e.currentTarget.getAttribute('data-value');
    const sortIdx = this.props.header.indexOf(value);
    if (!this.props.props[sortIdx]) { return; }
    const order = this.props.sortIdx === sortIdx ? otherOrder[this.props.order] : defaultSortOrder;
    if (typeof this.props.changeSortProps === 'function') {
      this.props.changeSortProps({ sortIdx, order });
    }
  },

  selectThis: function (e) {
    if (typeof this.props.changeSelectionProp === 'function') {
      const targetNum = [Number(e.currentTarget.getAttribute('data-value'))];
      const currentSelection = this.props.selectedRows;
      let updatedSelection = '';

      if (currentSelection.indexOf(targetNum[0]) === -1) {
        updatedSelection = targetNum.concat(currentSelection);
      } else {
        updatedSelection = currentSelection.filter(k => k !== targetNum[0]);
      }

      const newSelection = {selectedRows: updatedSelection};

      this.changeAllSelections(newSelection);
    }
  },

  changeAllSelections: function (newSelection) {
    this.props.changeSelectionProp(newSelection);
  },

  render: function () {
    const canSort = !this.unSortable();
    let { primaryIdx, sortIdx, order, props, row, data } = this.props;
    primaryIdx = primaryIdx || 0;

    return (
      <table>
        <thead>
          <tr>
            {this.props.isRemovable &&
              <td></td>
            }
            {this.props.header.map((h, i) => {
              let className = canSort && props[i] ? 'table__sort' : '';
              if (i === sortIdx) { className += (' table__sort--' + order); }
              return (
                <td
                className={className}
                key={h}
                data-value={h}
                onClick={this.changeSort}>{h}</td>
              );
            })}

          </tr>
        </thead>
        <tbody>
          {this.props.data.map((d, i) => {
            let checked = false;

            this.props.selectedRows.forEach((j) => {
              if (i === Number(j)) {
                checked = true;
              }
            });

            return (
              <tr key={i} data-value={i} onClick={this.selectThis}>
                {this.props.isRemovable &&
                  <td>
                    <input type='checkbox' checked={checked} />
                  </td>
                }
                {row.map((accessor, k) => {
                  let className = k === primaryIdx ? 'table__main-asset' : '';
                  let text;

                  if (typeof accessor === 'function') {
                    text = accessor(d, k, data);
                  } else {
                    text = d[accessor];
                  }
                  return <td key={String(i) + String(k) + text} className={className}>{text}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
});

export default connect(state => state)(Table);

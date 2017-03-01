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
    row: React.PropTypes.array,
    sortIdx: React.PropTypes.number,
    order: React.PropTypes.string,
    changeSortProps: React.PropTypes.func
  },

  changeSort: function (e) {
    if (isUndefined(this.props.sortIdx) || isUndefined(this.props.order)) { return; }
    const value = e.currentTarget.getAttribute('data-value');
    const sortIdx = this.props.header.indexOf(value);
    const order = this.props.sortIdx === sortIdx ? otherOrder[this.props.order] : defaultSortOrder;
    if (typeof this.props.changeSortProps === 'function') {
      this.props.changeSortProps({ sortIdx, order });
    }
  },

  render: function () {
    let { primaryIdx, sortIdx, order, row, data } = this.props;
    primaryIdx = primaryIdx || 0;
    return (
      <table>
        <thead>
          <tr>
            {this.props.header.map((h, i) => <td
              className={i === sortIdx ? 'table__sort table__sort--' + order : ''}
              key={h}
              data-value={h}
              onClick={this.changeSort}>{h}</td>)}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((d, i) => {
            return (
              <tr key={i}>
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

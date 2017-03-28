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
    onSelect: React.PropTypes.func,
    canSelect: React.PropTypes.bool,
    selectedRows: React.PropTypes.array,
    rowId: React.PropTypes.string
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

  select: function (e) {
    if (typeof this.props.onSelect === 'function') {
      const targetId = (e.currentTarget.getAttribute('data-value'));
      this.props.onSelect(targetId);
    }
  },

  render: function () {
    const canSort = !this.unSortable();
    let { primaryIdx, sortIdx, order, props, row, data, selectedRows, canSelect } = this.props;
    primaryIdx = primaryIdx || 0;

    return (
      <div className='table--wrapper'>
        <table>
          <thead>
            <tr>
              {canSelect && <td></td> }
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
              const dataId = d[this.props.rowId];
              const checked = canSelect && selectedRows.indexOf(dataId) !== -1;
              return (
                <tr key={dataId + i} data-value={dataId} onClick={this.select}>
                  {canSelect &&
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
      </div>
    );
  }
});

export default connect(state => state)(Table);

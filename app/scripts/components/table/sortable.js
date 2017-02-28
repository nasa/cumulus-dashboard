'use strict';
import React from 'react';
import { connect } from 'react-redux';

const Table = React.createClass({
  displayName: 'SortableTable',

  propTypes: {
    data: React.PropTypes.array,
    header: React.PropTypes.array,
    row: React.PropTypes.array,
    primaryItemIndex: React.PropTypes.number
  },

  render: function () {
    const { row, data } = this.props;
    const pIndex = this.props.primaryItemIndex || 0;
    return (
      <table>
        <thead>
          <tr>
            {this.props.header.map(h => <td key={h}>{h}</td>)}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((d, i) => {
            return (
              <tr key={i}>
                {row.map((accessor, k) => {
                  let className = k === pIndex ? 'table__main-asset' : '';
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

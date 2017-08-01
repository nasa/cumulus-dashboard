'use strict';
import React from 'react';
import { get } from 'object-path';
import { tally } from '../../utils/format';

// defines the order in which the granules meta bar appears
const granuleMeta = [
  [['ingesting', 'processing', 'cmr', 'archive'], 'Processing'],
  ['completed', 'Completed'],
  ['failed', 'Failed']
];
const Progress = React.createClass({
  propTypes: {
    granules: React.PropTypes.array
  },

  getItem: function (key) {
    return this.props.granules.find(count => count.key === key);
  },

  render: function () {
    return (
      <ul className='timeline--processing--overall'>
        {granuleMeta.map(d => {
          let item = Array.isArray(d[0]) ? d[0].map(this.getItem).reduce((a, b) => {
            return a + get(b, 'count', 0);
          }, 0) : get(this.getItem(d[0]), 'count', 0);
          return (
            <li key={d[0]} className={'timeline--processing--' + d[0]}>
              <span className='num--medium'>{tally(item)}</span>
              Granules {d[1]}
            </li>
          );
        })}
      </ul>
    );
  }
});
export default Progress;

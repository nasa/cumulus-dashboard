'use strict';
import React from 'react';
import { get } from 'object-path';
import { tally } from '../../utils/format';

// defines the order in which the granules meta bar appears
const granuleMeta = [
  ['ingesting', 'Ingesting'],
  ['processing', 'Processing'],
  ['cmr', 'Updating CMR'],
  ['archive', 'Archiving'],
  ['completed', 'Completed'],
  ['failed', 'Failed']
];
const Progress = React.createClass({
  propTypes: {
    granules: React.PropTypes.array
  },
  render: function () {
    const granules = this.props.granules || [];
    return (
      <ul className='timeline--processing--overall'>
        {granuleMeta.map(d => {
          let item = granules.find(count => count.key === d[0]);
          let value = item ? get(item, 'count', 0) : 0;
          return (
            <li key={d[0]} className={'timeline--processing--' + d[0]}>
              <span className='num--medium'>{tally(value)}</span>
              Granules {d[1]}
            </li>
          );
        })}
      </ul>
    );
  }
});
export default Progress;

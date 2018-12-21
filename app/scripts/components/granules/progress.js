'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { tally } from '../../utils/format';
import { strings } from '../locale';

// defines the order in which the granules meta bar appears
const granuleMeta = [
  ['running', 'Running'],
  ['completed', 'Completed'],
  ['failed', 'Failed']
];
const Progress = createReactClass({
  propTypes: {
    granules: PropTypes.array
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
              {strings.granules} {d[1]}
            </li>
          );
        })}
      </ul>
    );
  }
});
export default Progress;

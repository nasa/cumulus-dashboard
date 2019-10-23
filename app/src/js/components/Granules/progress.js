'use strict';
import React from './node_modules/react';
import PropTypes from './node_modules/prop-types';
import { get } from './node_modules/object-path';
import { tally } from '../../utils/format';
import { strings } from '../locale';

// defines the order in which the granules meta bar appears
const granuleMeta = [
  ['running', 'Running'],
  ['completed', 'Completed'],
  ['failed', 'Failed']
];
class Progress extends React.Component {
  constructor () {
    super();
    this.getItem = this.getItem.bind(this);
  }

  getItem (key) {
    return this.props.granules.find(count => count.key === key);
  }

  render () {
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
}

Progress.propTypes = { granules: PropTypes.array };

export default Progress;

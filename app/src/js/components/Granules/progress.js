import React from 'react';
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
class Progress extends React.Component {
  constructor () {
    super();
    this.getItem = this.getItem.bind(this);
    this.tallyDisplay = this.tallyDisplay.bind(this);
  }

  getItem (key) {
    return this.props.granules.find((count) => count.key === key);
  }

  tallyDisplay (type, item) {
    if (type[1] === 'Failed' && item > 0) {
      if (item > 99) {
        return (
          <span className='num--medium num--medium--red'>{item}</span>
        );
      } if (item > 0) {
        return (
          <span className='num--medium num--medium--yellow'>{item}</span>
        );
      }
    } else {
      return (
        <span className='num--medium'>{item}</span>
      );
    }
  }

  render () {
    return (
      <ul className='timeline--processing--overall'>
        {granuleMeta.map((d) => {
          const item = Array.isArray(d[0])
            ? d[0].map(this.getItem).reduce((a, b) => a + get(b, 'count', 0), 0)
            : get(this.getItem(d[0]), 'count', 0);

          return (
            <li key={d[0]} className={`timeline--processing--${d[0]}`}>
              {this.tallyDisplay(d, tally(item))}
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

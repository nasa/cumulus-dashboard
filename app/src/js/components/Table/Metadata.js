'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { nullValue } from '../../utils/format';

class Metadata extends React.Component {
  render () {
    const { data, accessors } = this.props;
    return (
      <dl className='metadata__details'>
        {accessors.reduce((acc, meta) => {
          let value = get(data, meta[1]);
          if (value !== nullValue && typeof meta[2] === 'function') {
            value = meta[2](value);
          }
          return acc.concat([
            <div className="meta__row">
              <dt key={`meta-${meta[1]}--dt`}>{meta[0]}</dt>
              <dd key={`meta-${meta[1]}--dd`}>{value}</dd>
            </div>
          ]);
        }, [])}
      </dl>
    );
  }
}

Metadata.propTypes = {
  data: PropTypes.object,
  accessors: PropTypes.array
};

export default Metadata;

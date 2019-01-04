'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { nullValue } from '../../utils/format';
const Metadata = createReactClass({
  propTypes: {
    data: PropTypes.object,
    accessors: PropTypes.array
  },
  render: function () {
    const { data, accessors } = this.props;
    return (
      <dl className='metadata__details'>
        {accessors.reduce((acc, meta, i) => {
          let value = get(data, meta[1]);
          if (value !== nullValue && typeof meta[2] === 'function') {
            value = meta[2](value);
          }
          return acc.concat([
            <dt key={`meta-${meta[1]}--dt`}>{meta[0]}</dt>,
            <dd key={`meta-${meta[1]}--dd`}>{value}</dd>
          ]);
        }, [])}
      </dl>
    );
  }
});
export default Metadata;

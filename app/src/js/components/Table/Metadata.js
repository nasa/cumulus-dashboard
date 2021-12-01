import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { nullValue } from '../../utils/format';

const Metadata = ({
  data,
  accessors
}) => (
  <dl className='metadata__details'>
    {accessors.map((item, index) => {
      const { label, property, accessor } = item;
      let value = get(data, property);
      if (value !== nullValue && typeof accessor === 'function') {
        value = accessor(value, data);
      }
      return (
        <React.Fragment key={index}>
          {value && <div className="meta__row">
            <dt key={`meta-${property}--dt`}>{label}</dt>
            <dd key={`meta-${property}--dd`}>{value}</dd>
          </div>}
        </React.Fragment>
      );
    })}
  </dl>
);

Metadata.propTypes = {
  data: PropTypes.object,
  accessors: PropTypes.array
};

export default Metadata;

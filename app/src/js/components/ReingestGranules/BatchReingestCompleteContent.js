import React from 'react';
import PropTypes from 'prop-types';

const BatchReingestCompleteContent = ({
  results,
  error
}) => {
  const confirmation = `successfully reingested ${results.length > 1 ? 'these' : 'this'} granule${results.length > 1 ? 's' : ''}`;
  return (
    <>
      {(results && results.length > 0) &&
        <>
          <p>{confirmation}</p>
          <ul>
            {results.map((result, index) => {
              return <li key={index}>{result}</li>;
            })}
          </ul>
        </>
      }
      {error && <span className='error'>{error}</span>}
    </>
  );
};

BatchReingestCompleteContent.propTypes = {
  results: PropTypes.array,
  error: PropTypes.string
};

export default BatchReingestCompleteContent;

import React from 'react';
import PropTypes from 'prop-types';

export const maxDisplayed = 10;

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
             if (index < maxDisplayed) {
               return <li key={index}>{result}</li>;
             } return <></>;
           })}
           {(results.length > maxDisplayed) &&
            <li key={maxDisplayed}>and {results.length - maxDisplayed} more.</li>}
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

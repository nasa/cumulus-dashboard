import React from 'react';
import PropTypes from 'prop-types';

export const maxDisplayed = 10;

const BatchReingestCompleteContent = ({
  results,
  error
}) => {
  const confirmation = () => `successfully reingested ${results.length > 1 ? 'these' : 'this'} granule${results.length > 1 ? 's' : ''}`;
  const displayedItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(results.length, maxDisplayed); i++) {
      items.push(<li key={i}>{results[i]}</li>);
    }
    if (results.length > maxDisplayed) {
      items.push(<li key={maxDisplayed}>and {results.length - maxDisplayed} more.</li>);
    }
    return items;
  };

  return (
    <>
      {(results && results.length > 0) &&
       <>
         <p>{confirmation()}</p>
         <ul>
           {displayedItems()}
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

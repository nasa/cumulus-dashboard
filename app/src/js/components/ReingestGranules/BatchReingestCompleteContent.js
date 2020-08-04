import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import Collapsible from 'react-collapsible';

export const maxDisplayed = 10;

const BatchReingestCompleteContent = ({
  results,
  errors
}) => {
  const confirmation = () => `successfully reingested ${results.length > 1 ? 'these' : 'this'} granule${results.length > 1 ? 's' : ''}`;

  const displayedItems = (array, renderContent) => {
    const items = [];
    for (let i = 0; i < Math.min(array.length, maxDisplayed); i++) {
      items.push(renderContent(i, array[i]));
    }
    if (array.length > maxDisplayed) {
      items.push(<li key={maxDisplayed}>and {array.length - maxDisplayed} more.</li>);
    }
    return items;
  };

  const renderResults = (index, result) => <li key={index}>{result}</li>;

  const renderErrors = (index, error) => {
    const { id, error: errorMessage } = error;
    return (
      <li key={index}>
        {id}
        <Collapsible trigger='Show Error' triggerWhenOpen='Hide Error' open={index === 0}>
          {errorMessage.toString()}
        </Collapsible>
      </li>
    );
  };

  return (
    <>
      {(results && results.length > 0) &&
        <>
          <Alert variant='success'><strong>Success:</strong> Your request has been processed.</Alert>
          <p>{confirmation()}</p>
          <ul>
            {displayedItems(results, renderResults)}
          </ul>
          <p>To quickly view the status, click "View Granules".</p>
        </>
      }
      {(errors && errors.length > 0) &&
        <>
          <Alert variant='danger'><strong>Error:</strong> There is an issue with the request.</Alert>
          <ul>
            {displayedItems(errors, renderErrors)}
          </ul>
          <p>To return to granules page, click "Close".</p>
        </>
      }
    </>
  );
};

BatchReingestCompleteContent.propTypes = {
  results: PropTypes.array,
  errors: PropTypes.array
};

export default BatchReingestCompleteContent;

import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { collectionNameVersion } from '../../utils/format';

const BatchDeleteCompleteContent = ({
  results,
  error
}) => (
  <>
    {(results && results.length > 0) &&
      <>
        <Alert variant="success"><strong>Success</strong></Alert>
        <p>Successfully deleted these collections:</p>
        <ul>
          {results.map((result, index) => {
            const { name, version } = collectionNameVersion(result);
            return <li key={index}>{name} / {version}</li>;
          })}
        </ul>
      </>
    }
    {error &&
    <>
      <Alert variant="danger"><strong>Error</strong></Alert>
      <span className='error'>{error}</span>
    </>
    }
  </>
);

BatchDeleteCompleteContent.propTypes = {
  results: PropTypes.array,
  error: PropTypes.string
};

export default BatchDeleteCompleteContent;

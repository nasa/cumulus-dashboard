import React from 'react';
import PropTypes from 'prop-types';
import { collectionNameVersion } from '../../utils/format';

const BatchDeleteWithGranulesContent = ({ selectionsWithGranules }) => (
  <>
    <span>
      You have submitted a request to delete multiple collections.
      The following collections contain associated granules:
    </span>
    <ul className='collections-with-granules'>
      {selectionsWithGranules.map((collection, index) => {
        const { name, version } = collectionNameVersion(collection);
        return (
          <li className='collection-with-granules' key={index}>{`${name} / ${version}`}</li>
        );
      })}
    </ul>
    <span>
      In order to complete this request, the granules associated with the above collections must first be deleted.
      Would you like to be redirected to the Granules pages?
    </span>
  </>
);

BatchDeleteWithGranulesContent.propTypes = {
  selectionsWithGranules: PropTypes.array
};

export default BatchDeleteWithGranulesContent;

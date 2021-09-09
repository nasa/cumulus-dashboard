import React from 'react';
import PropTypes from 'prop-types';
import { collectionNameVersion } from '../../utils/format';

const BatchDeleteWithGranulesContent = ({ selectionsWithGranules }) => (
  <>
    <span>
    In order to complete this request, the granules associated with the following collections must first be deleted.
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
      Would you like to go to the Granules page to remove these granules?
    </span>
  </>
);

BatchDeleteWithGranulesContent.propTypes = {
  selectionsWithGranules: PropTypes.array
};

export default BatchDeleteWithGranulesContent;

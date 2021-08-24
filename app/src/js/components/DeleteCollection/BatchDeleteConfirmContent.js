import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { collectionNameVersion } from '../../utils/format';

const BatchDeleteConfirmContent = ({ selected = [] }) => (
  <>
    <Alert variant="warning"><strong>Warning: This action cannot be reversed once you submit it.</strong></Alert>
    <p>You have submitted a request to delete the following collections: </p>
    <ul>
      {selected.map((selection, index) => {
        const { name, version } = collectionNameVersion(selection);
        return <li key={index}>{name} / {version}</li>;
      })}
    </ul>
    <p>Are you sure that you want to delete all of these?</p>
  </>
);

BatchDeleteConfirmContent.propTypes = {
  selected: PropTypes.array
};

export default BatchDeleteConfirmContent;

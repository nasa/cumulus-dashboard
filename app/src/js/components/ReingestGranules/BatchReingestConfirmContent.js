import React from 'react';
import PropTypes from 'prop-types';

export const maxDisplayed = 10;
const pluralRequest = 'You have submitted a request to reingest the following granules.';
const singularRequest = 'You have submitted a request to reingest the following granule.';

const pluralConfirm = 'Are you sure that you want to reingest these granules?\nNote: These granule files will be overwritten.';
const singularConfirm = 'Are you sure that you want to reingest this granule?\nNote: The granule file will be overwritten.';

const BatchReingestConfirmContent = ({ selected = [] }) => {
  const isMultiple = (selected.length > 1);
  const requestText = isMultiple ? pluralRequest : singularRequest;
  const confirmText = isMultiple ? pluralConfirm : singularConfirm;

  return (
    <>
      {requestText}
      <ul>
        {selected.map((selection, index) => {
          if (index < maxDisplayed) {
            return <li key={index}>{selection}</li>;
          } return <></>;
        })}
        {(selected.length > maxDisplayed) &&
         <li key={maxDisplayed}>and {selected.length - maxDisplayed} more.</li>}
      </ul>
      {confirmText.split('\n').map((line, index) => <p key={index}>{line}</p>)}
    </>
  );
};

BatchReingestConfirmContent.propTypes = {
  selected: PropTypes.array
};

export default BatchReingestConfirmContent;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CopyToClipboard = ({
  text,
}) => {
  const [copy, copiedTextState] = useState('Copy');

  async function handleClick(e) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      copiedTextState('Copied!');
    } catch (err) {
      copiedTextState('Error Copying');
    }
  }

  return (
    <>
      <button
        className="button button--small button--primary button--show button--copy_error"
        onClick={handleClick}>
        {copy}
      </button>
    </>);
};

CopyToClipboard.propTypes = {
  text: PropTypes.string,
};

export default CopyToClipboard;

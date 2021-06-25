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
      copiedTextState('Not Copied!');
    }
  }

  function render() {
    return (
      <>
        <button
          className="button button--small button--primary button--show button--copy"
          onClick={handleClick}
        >
          {copy}
        </button>
      </>
    );
  }

  return render();
};

CopyToClipboard.propTypes = {
  text: PropTypes.string,
  truncate: PropTypes.bool,
};

export default CopyToClipboard;

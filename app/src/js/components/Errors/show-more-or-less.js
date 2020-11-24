import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { truncate as truncateText } from '../../utils/format';

const ShowMoreOrLess = ({
  text,
  truncate,
}) => {
  const [showMore, setShowMore] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    setShowMore(!showMore);
  }

  function render() {
    const truncatedText = truncate ? truncateText(text) : text;
    const textShown = showMore ? text : truncatedText;
    const buttonText = showMore ? 'Show Less' : 'Show More';

    // No need to make error collapsible if the truncated
    // output is the same length as the original output
    if (!truncate || text.length === truncatedText.length) {
      return <p>{text}</p>;
    }

    return (
      <>
`       <p>{textShown}</p>
        <button
          className="button button--small button--primary button--show"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </>
    );
  }

  return render();
};

ShowMoreOrLess.propTypes = {
  text: PropTypes.string,
  truncate: PropTypes.bool,
};

export default ShowMoreOrLess;

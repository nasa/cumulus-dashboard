import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

  function truncateFunc (string) {
    if (!truncate) return string;
    return truncateText(string, 100, false);
  }

  function render() {
    const truncatedText = truncateFunc(text);
    const textShow = showMore ? text : truncatedText;
    const buttonText = showMore ? 'Show Less' : 'Show More';

    // No need to make error collapsible if the truncated
    // output is the same length as the original output
    if (typeof text === 'string' &&
        text === truncatedText &&
        text.length === truncatedText.length) {
      return <p>{text}</p>;
    }

    return (
      <>
`      <p>{textShow}</p>
        <button
          className="button button--small button--primary form-group__element--left"
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

export default connect((state) => state)(ShowMoreOrLess);

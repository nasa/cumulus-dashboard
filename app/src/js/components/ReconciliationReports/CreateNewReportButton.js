import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';

const CreateNewReportButton = ({ createReportInflight, getPersistentQueryParams }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const search = getPersistentQueryParams(window.location);
    navigate(`/reconciliation-reports/create${search}`);
  };

  return (
    <button
      className="button button--green button--file button--small form-group__element--right"
      onClick={handleClick}
      disabled={createReportInflight}
    >
      {createReportInflight ? <LoadingEllipsis /> : 'Create New Report'}
    </button>
  );
};

CreateNewReportButton.propTypes = {
  createReportInflight: PropTypes.string,
  getPersistentQueryParams: PropTypes.func
};

export default CreateNewReportButton;

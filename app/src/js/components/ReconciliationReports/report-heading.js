import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as DropdownBootstrap } from 'react-bootstrap';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ErrorReport from '../Errors/report';

const ReportHeading = ({
  downloadOptions,
  endDate,
  error,
  name,
  startDate,
  reportState,
}) => {
  const breadcrumbConfig = [
    {
      label: 'Dashboard Home',
      href: '/',
    },
    {
      label: 'Reports',
      href: '/reconciliation-reports',
    },
    {
      label: name,
      active: true,
    },
  ];

  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString()
    : 'missing';

  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString()
    : 'missing';
  return (
    <>
      <section className="page__section page__section__controls">
        <div className="reconciliation-reports__options--top">
          <ul>
            <li key="breadcrumbs">
              <Breadcrumbs config={breadcrumbConfig} />
            </li>
          </ul>
        </div>
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <div>
            <h1 className="heading--large heading--shared-content with-description ">
              {name}
            </h1>
          </div>
          <div className="status--process">
            <dl className="status--process--report">
              <dt>Date Range:</dt>
              <dd>{`${formattedStartDate} to ${formattedEndDate}`}</dd>
              <dt>State:</dt>
              <dd
                className={`status__badge status__badge--${
                  reportState === 'PASSED' ? 'passed' : 'conflict'
                }`}
              >
                {reportState}
              </dd>
            </dl>
            {downloadOptions && (
              <DropdownBootstrap className="form-group__element--right">
                <DropdownBootstrap.Toggle
                  className="button button--small button--download"
                  id="download-report-dropdown"
                >
                  Download Report
                </DropdownBootstrap.Toggle>
                <DropdownBootstrap.Menu>
                  {downloadOptions.map(({ label, onClick }, index) => (
                    <DropdownBootstrap.Item
                      key={index}
                      as="button"
                      onClick={onClick}
                    >
                      {label}
                    </DropdownBootstrap.Item>
                  ))}
                </DropdownBootstrap.Menu>
              </DropdownBootstrap>
            )}
          </div>
          {error && <ErrorReport report={error} />}
        </div>
      </section>
    </>
  );
};

ReportHeading.propTypes = {
  downloadOptions: PropTypes.arrayOf(PropTypes.object),
  endDate: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string,
  startDate: PropTypes.string,
  reportState: PropTypes.string,
};

export default ReportHeading;

import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import List from '../Table/Table';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Tooltip from '../Tooltip/tooltip';
import {
  collectionLink,
  providerLink,
  fullDate,
} from '../../utils/format';
import Metadata from '../Table/Metadata';
import { tableColumnsGranuleConflictDetails } from '../../utils/table-config/reconciliation-reports';

const displayDataLocation = (reportType, granule) => {
  const { conflictFiles = [], okFilesCount = 0 } = granule;
  const cumulusFilesCount = okFilesCount +
    conflictFiles.filter((file) => file.reason === 'onlyInCumulus').length;

  if (reportType === 'ORCA Backup') {
    const orcaFilesCount = okFilesCount +
      conflictFiles.filter((file) => ['onlyInOrca', 'shouldBeExcludedFromOrca'].includes(file.reason)).length;

    return <div className='granule__location'>
      <ul>
        <div>
        Cumulus
        <Tooltip
          className="tooltip--blue"
          id={granule.granuleId}
          placement='right'
          target={
            <span
              className={'status-indicator status-indicator--found status-indicator--granule'}
            ></span>
          }
          tip={<div>{cumulusFilesCount ? 'Found' : 'Not Found'}</div>}
        />
        </div>
        <div>
        Number of Files: {cumulusFilesCount}
        </div>
      </ul>
      <ul>
      <div>
        Orca
        <Tooltip
          className="tooltip--blue"
          id={granule.granuleId}
          placement='right'
          target={
            <span
              className={'status-indicator status-indicator--found status-indicator--granule'}
            ></span>
          }
          tip={<div>{orcaFilesCount ? 'Found' : 'Not Found'}</div>}
        />
      </div>
      <div>
        Number of Files: {orcaFilesCount}
      </div>
      </ul>
      </div>;
  }
  return <>
    <ul>Cumulus Found Number of Files: ${cumulusFilesCount}</ul>
    </>;
};

const metaAccessors = (reportType, granule) => ([
  {
    label: 'Collection',
    property: 'collectionId',
    accessor: collectionLink,
  },
  {
    label: 'Provider',
    property: 'provider',
    accessor: providerLink,
  },
  {
    label: 'Ingest',
    property: 'createdAt',
    accessor: fullDate,
  },
  {
    label: 'Location',
    property: 'createdAt',
    accessor: () => displayDataLocation(reportType, granule),
  },
]);

const BackupReportGranuleDetails = ({
  location = {},
}) => {
  const { state: locationState } = location;
  const { reportName, reportType, granule } = locationState || {};

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
      label: reportName,
      href: `/reconciliation-reports/report/${reportName}`,
    },
    {
      label: 'Granule Conflict Details',
      active: true,
    },
  ];

  return (
    <div className='page__component'>
      <Helmet>
        <title> Granule Conflict Details </title>
      </Helmet>
      <section className='page__section page__section__header-wrapper'>
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <h1 className='heading--large heading--shared-content with-description with-bottom-border width--full'>
          {reportType} Report: {reportName}
        </h1>
        <h2 className='heading--medium heading--shared-content with-description with-bottom-border width--full'>
          Granule: {granule.granuleId}
        </h2>
        <p className='with-description'>
          Below is a deep dive into where the backup issues are for this granule.
        </p>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium with-description">
              Conflict Details
            </h2>
          </div>
          <div className='reconciliation-granule__content'>
            <Metadata data={granule} accessors={metaAccessors(reportType, granule)} />
          </div>
        </section>
        <section className="page__section">
          <List
            data={granule.conflictFiles}
            tableColumns={tableColumnsGranuleConflictDetails({ reportType })}
            rowId='fileName'
            initialSortId='updatedAt'
            useSimplePagination={true}
          >
          </List>
        </section>
      </section>
    </div>
  );
};

BackupReportGranuleDetails.propTypes = {
  location: PropTypes.object,
};

export default BackupReportGranuleDetails;

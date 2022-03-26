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
  const cumulusFilesCount = granule.okFilesCount + granule.conflictFiles.filter((file) => file.onlyInCumulus).length;

  if (reportType === 'ORCA Backup') {
    const orcaFilesCount = granule.okFilesCount +
      granule.conflictFiles.filter((file) => (!!file.onlyInOrca || !!file.shouldBeExcludedFromOrca)).length;

    return <>
      <ul>
        <span>Cumulus</span>
        <Tooltip
          id={granule.granuleId}
          placement='right'
          target={
            <span
              className={'status-indicator status-indicator--found status-indicator--granule'}
            ></span>
          }
          tip={<div>{cumulusFilesCount ? 'Found' : 'Not Found'}</div>}
        />
        <span>Number of Files:</span><span>{cumulusFilesCount}</span>
      </ul>
      <ul>
        <span>Orca</span>
        <Tooltip
          id={granule.granuleId}
          placement='right'
          target={
            <span
              className={'status-indicator status-indicator--found status-indicator--granule'}
            ></span>
          }
          tip={<div>{orcaFilesCount ? 'Found' : 'Not Found'}</div>}
        />
        <span>Number of Files:</span><span>{orcaFilesCount}</span>
      </ul>
      </>;
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
  filterString,
  legend,
  onSelect,
  recordData,
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
          <Metadata data={granule} accessors={metaAccessors(reportType, granule)} />
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
  filterString: PropTypes.string,
  legend: PropTypes.node,
  onSelect: PropTypes.func,
  granule: PropTypes.object,
  location: PropTypes.object,
  recordData: PropTypes.object,
};

export default BackupReportGranuleDetails;

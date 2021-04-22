import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import { displayCase, fullDate, parseJson } from '../format';
import { getPersistentQueryParams } from '../url-helper';
import { kibanaExecutionLink } from '../kibana';
import { window } from '../browser';
import DefaultModal from '../../components/Modal/modal';

export const tableColumns = [
  {
    Header: 'Id',
    accessor: 'id',
    width: 10
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Step Name',
    accessor: 'name',
  },
  {
    Header: 'Timestamp',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fullDate(value)
  },
  {
    Header: 'Event Details',
    accessor: 'eventDetails',
    Cell: ({ cell: { value } }) => {
      const [showModal, setShowModal] = useState(false);
      const { id } = value || {};
      function toggleModal(e) {
        if (e) {
          e.preventDefault();
        }
        setShowModal(!showModal);
      }
      if (value) {
        return (
          <>
            <button
              onClick={toggleModal}
              className="button button--small button--no-left-padding"
            >
              More Details
            </button>
            <DefaultModal
              showModal={showModal}
              title={`ID ${id}: Event Details`}
              onCloseModal={toggleModal}
              hasConfirmButton={false}
              cancelButtonClass="button--close"
              cancelButtonText="Close"
              className="execution__modal"
            >
              <pre>{JSON.stringify(value, null, 2)}</pre>
            </DefaultModal>
          </>
        );
      }
      return 'N/A';
    },
    disableSortBy: true,
  }
];

export const metaAccessors = ({
  cumulusInstance,
  metricsNotConfigured,
  showInputModal,
  showOutputModal,
  toggleModal,
}) => [
  {
    label: 'Execution Status',
    property: 'status',
    accessor: (d) => (
      <span
        className={`status__badge--small status__badge--${d.toLowerCase()}`}
      >
        {displayCase(d)}
      </span>
    ),
  },
  {
    label: 'Execution Arn',
    property: 'executionArn',
  },
  {
    label: 'State Machine Arn',
    property: 'stateMachineArn',
  },
  {
    label: 'Async Operation ID',
    property: 'output',
    accessor: (d) => {
      if (!d) return;
      const outputJson = JSON.parse(d);
      return get(outputJson.cumulus_meta, 'asyncOperationId');
    },
  },
  {
    label: 'Started',
    property: 'startDate',
    accessor: fullDate,
  },
  {
    label: 'Ended',
    property: 'stopDate',
    accessor: fullDate,
  },
  {
    label: 'Parent Workflow Execution',
    property: 'input',
    accessor: (d) => {
      if (!d) return 'N/A';
      const input = JSON.parse(d);
      const parent = get(input.cumulus_meta, 'parentExecutionArn');
      if (parent) {
        return (
          <Link
            to={(location) => ({
              pathname: `/executions/execution/${parent}`,
              search: getPersistentQueryParams(location),
            })}
            title={parent}
          >
            {parent}
          </Link>
        );
      }
      return 'N/A';
    },
  },
  {
    label: 'Input',
    property: 'input',
    accessor: (d) => {
      if (d) {
        return (
          <>
            <button
              onClick={() => toggleModal('input')}
              className="button button--small button--no-left-padding"
            >
              Show Input
            </button>
            <DefaultModal
              showModal={showInputModal}
              title="Execution Input"
              onCloseModal={() => toggleModal('input')}
              hasConfirmButton={false}
              cancelButtonClass="button--close"
              cancelButtonText="Close"
              className="execution__modal"
            >
              <pre>{parseJson(d)}</pre>
            </DefaultModal>
          </>
        );
      }
      return 'N/A';
    },
  },
  {
    label: 'Output',
    property: 'output',
    accessor: (d) => {
      if (d) {
        const jsonData =
          typeof Blob !== 'undefined'
            ? new Blob([d], { type: 'text/json' })
            : null;
        const downloadUrl =
          typeof window.URL.createObjectURL === 'function'
            ? window.URL.createObjectURL(jsonData)
            : '';
        return (
          <>
            <button
              onClick={() => toggleModal('output')}
              className="button button--small button--no-left-padding"
            >
              Show Output
            </button>
            <DefaultModal
              showModal={showOutputModal}
              title={
                <>
                  <span>Execution Output</span>
                  <a
                    className="button button--small button--download button--green form-group__element--right"
                    id="download_link"
                    download="output.json"
                    href={downloadUrl}
                  >
                    Download File
                  </a>
                </>
              }
              onCloseModal={() => toggleModal('output')}
              hasConfirmButton={false}
              cancelButtonClass="button--close"
              cancelButtonText="Close"
              className="execution__modal"
            >
              <pre>{parseJson(d)}</pre>
            </DefaultModal>
          </>
        );
      }
      return 'N/A';
    },
  },
  {
    label: 'Logs',
    property: 'executionArn',
    accessor: (d) => {
      const kibanaLink = kibanaExecutionLink(cumulusInstance, d);
      const className =
        'button button--small button__goto button__arrow button__animation button__arrow--white';
      if (kibanaLink && kibanaLink.length) {
        return (
          <a href={kibanaLink} target="_blank" className={className}>
            View Logs in Kibana
          </a>
        );
      }
      if (metricsNotConfigured) return null;
      return (
        <Link
          to={(location) => ({
            pathname: `/executions/execution/${d}/logs`,
            search: getPersistentQueryParams(location),
          })}
          title={`${d}/logs`}
          className={className}
        >
          View Execution Logs
        </Link>
      );
    },
  },
];

export default tableColumns;

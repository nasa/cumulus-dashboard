/* eslint-disable react/prop-types */
import React from 'react';
import { displayCase } from '../format';
import { window } from '../browser';
import DefaultModal from '../../components/Modal/modal';

export const metaAccessors = ({
  showOutputModal,
  toggleModal
}) => [
  {
    label: 'ID',
    property: 'id'
  },
  {
    label: 'Status',
    property: 'status',
    accessor: (d) => {
      // Normalize status values for CSS class mapping
      // Both RUNNER_FAILED and TASK_FAILED should map to 'failed' for red color
      let statusClass = d.toLowerCase();
      if (statusClass.includes('failed')) {
        statusClass = 'failed';
      }
      
      return (
        <span
          className={`status__badge--small status__badge--${statusClass}`}
        >
          {displayCase(d)}
        </span>
      );
    }
  },
  {
    label: 'Operation Type',
    property: 'operationType'
  },
  {
    label: 'Description',
    property: 'description'
  },
  {
    label: 'Task ARN',
    property: 'taskArn'
  },
  {
    label: 'Output',
    property: 'output',
    accessor: (d) => {
      if (d) {
        const jsonData = typeof Blob !== 'undefined' ? new Blob([d], { type: 'text/json' }) : null;
        const downloadUrl = typeof window.URL.createObjectURL === 'function' ? window.URL.createObjectURL(jsonData) : '';

        let formattedOutput = d;
        try {
          // If it's a JSON string, parse and pretty print it
          // If it's already an object, stringify it
          // If it's a simple string, leave as is
          if (typeof d === 'string') {
            const parsed = JSON.parse(d);
            formattedOutput = JSON.stringify(parsed, null, 2);
          } else if (typeof d === 'object') {
            formattedOutput = JSON.stringify(d, null, 2);
          }
        } catch (e) {
          // Fallback to original value
        }

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
                  <span>Operation Output</span>
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
              className="operation__modal"
            >
              <pre>{formattedOutput}</pre>
            </DefaultModal>
          </>
        );
      }
      return 'N/A';
    }
  }
];

export default metaAccessors;


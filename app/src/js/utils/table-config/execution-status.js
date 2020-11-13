import React from 'react';
import { fullDate } from '../format';

export const tableColumns = () => [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Timestamp',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fullDate(value)
  },
  {
    Header: 'Input Details',
    accessor: 'eventDetails',
    Cell: ({ cell: { value } }) => { // eslint-disable-line react/prop-types
      if (value) {
        return (
          <>
            <button
              onClick={() => this.openModal('input')}
              className="button button--small button--no-icon"
            >
              Show Input
            </button>
            {/* <DefaultModal
              // showModal={showInputModal}
              title="Execution Input"
              // onCloseModal={() => this.closeModal('input')}
              hasConfirmButton={false}
              cancelButtonClass="button--close"
              cancelButtonText="Close"
              className="execution__modal"
            >
              <pre>{parseJson(value)}</pre>
            </DefaultModal> */}
          </>
        );
      }
      return 'N/A';
    },
  }
];

export default tableColumns;

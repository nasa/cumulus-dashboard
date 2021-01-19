import React, { useState } from 'react';
import { fullDate } from '../format';
import DefaultModal from '../../components/Modal/modal';

export const tableColumns = [
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

export default tableColumns;

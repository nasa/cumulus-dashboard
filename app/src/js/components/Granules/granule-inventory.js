import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { createReconciliationReport } from '../../actions';
import { historyPushWithQueryParams } from '../../utils/url-helper';
import DefaultModal from '../Modal/modal';
import TextForm from '../TextAreaForm/text';

const GranuleInventory = ({
  history,
  dispatch,
  className,
  confirmAction,
  granules,
  element = 'button',
  selected,
  queryConfig
}) => {
  const defaultListName = `granuleList-${moment().format('YYYYMMDDTHHmmssSSS')}`;
  const [showModal, setShowModal] = useState(false);
  const [listRequestSubmitted, setListRequestSubmitted] = useState(false);
  const [listName, setListName] = useState(defaultListName);

  function toggleModal() {
    setShowModal(!showModal);
  }

  function submitListRequest(e) {
    const { collectionId, status, search: granuleIdFilter } = queryConfig;

    const requestBody = {
      reportName: listName,
      reportType: 'Granule Inventory',
      status,
      collectionId,
      // granuleId accepts a string or an array of granuleIds.
      // In this case, the granuleIdFilter is a search infix and selected is an array of granuleIds.
      granuleId: granuleIdFilter || ((selected.length > 0) ? selected : undefined),
    };

    setListRequestSubmitted(true);
    dispatch(createReconciliationReport(
      requestBody
    ));
  }

  function goToListPage() {
    historyPushWithQueryParams('/granules/lists');
  }

  function closeModal() {
    toggleModal();
    setListRequestSubmitted(false);
    setListName(defaultListName);
  }

  function handleReportTypeInputChange(id, value) {
    setListName(value);
  }

  return (
    <>
      <button className='csv__download button button--small button--file button--green form-group__element'
        id='download_link'
        onClick={toggleModal}
      >Create Granule Inventory List</button>
      <DefaultModal
        className="granule-inventory"
        onCloseModal={closeModal}
        onConfirm={listRequestSubmitted ? goToListPage : submitListRequest}
        showModal={showModal}
        title='Create Granule List'
      >
        {!listRequestSubmitted && (
          <div>
            <div>You have generated a selection to process for the following list:</div>
            <div className="list-name">
              <TextForm
                id="reportName"
                label="List Name"
                onChange={handleReportTypeInputChange}
                value={listName}
              />
            </div>
            <div>Would you like to continue with generating the list?</div>
          </div>
        )}
        {listRequestSubmitted && (
          <div>
            <div>The following request is being processed and will be available shortly</div>
            <div className="list-name">{listName}</div>
            <div>On the Lists page, view the status and download your list when available</div>
          </div>
        )}
      </DefaultModal>
    </>
  );
};

GranuleInventory.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  confirmAction: PropTypes.bool,
  className: PropTypes.string,
  element: PropTypes.string,
  granules: PropTypes.object,
  selected: PropTypes.array,
  queryConfig: PropTypes.object,
};

export { GranuleInventory };

export default withRouter(connect((state) => ({
  granules: state.granules
}))(GranuleInventory));

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOperation } from '../../actions';
import { displayCase } from '../../utils/format';
import { window } from '../../utils/browser';
import ErrorReport from '../Errors/report';
import Metadata from '../Table/Metadata';
import Loading from '../LoadingIndicator/loading-indicator';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import DefaultModal from '../Modal/modal';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Operations',
    href: '/operations'
  },
  {
    label: 'Operation Details',
    active: true
  }
];

const metaAccessors = ({
  operation,
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
    accessor: (value) => displayCase(value)
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

const OperationStatus = () => {
  const { operationId } = useParams();
  const dispatch = useDispatch();
  const { data: operation, error, inflight } = useSelector((state) => state.operationStatus) || {};

  const [showOutputModal, setShowOutputModal] = useState(false);

  function toggleModal(type) {
    switch (type) {
      case 'output':
        setShowOutputModal(!showOutputModal);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (operationId) {
      dispatch(getOperation(operationId));
    }
  }, [dispatch, operationId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (inflight || !operation || !operation.id) {
    return (
      <section className="page__section page__section__header-wrapper">
        {error && <ErrorReport report={error} />}
        {!error && <Loading />}
      </section>
    );
  }

  return (
    <div className="page__component">
      <Helmet>
        <title> Async Operation Details </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <h1 className="heading--large heading--shared-content with-description width--three-quarters">
            Async Operation: {operation.id}
          </h1>
          {error && <ErrorReport report={error} />}
        </div>
      </section>

      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium">
            <span>Details</span>
          </h2>
        </div>
        <div className="operation__content">
          <Metadata
            data={operation}
            accessors={metaAccessors({
              operation,
              showOutputModal,
              toggleModal
            })}
          />
        </div>
      </section>
    </div>
  );
};

export default OperationStatus;

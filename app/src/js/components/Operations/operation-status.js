import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOperation } from '../../actions';
import { metaAccessors } from '../../utils/table-config/operation-status';
import { window } from '../../utils/browser';
import ErrorReport from '../Errors/report';
import Metadata from '../Table/Metadata';
import Loading from '../LoadingIndicator/loading-indicator';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

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

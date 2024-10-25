import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import { getProvider, deleteProvider, listCollections } from '../../actions';
import { lastUpdated, deleteText } from '../../utils/format';
import Loading from '../LoadingIndicator/loading-indicator';
import LogViewer from '../Logs/viewer';
import ErrorReport from '../Errors/report';
import Metadata from '../Table/Metadata';
// import { getPersistentQueryParams, historyPushWithQueryParams } from '../../utils/url-helper';
import { metaAccessors } from '../../utils/table-config/providers';
import { withUrlHelper } from '../../withUrlHelper';
// import withRouter from '../../withRouter';

const ProviderOverview = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { providerId } = useParams();
  const { location, getPersistentQueryParams, historyPushWithQueryParams } = urlHelper;

  const providers = useSelector((state) => state.providers);
  // const logs = useSelector((state) => state.logs);

  const record = providers.map[providerId];

  useEffect(() => {
    dispatch(getProvider(providerId));
  }, [dispatch, providerId]);

  useEffect(() => {
    dispatch(
      listCollections({
        limit: 100,
        fields: 'collectionName',
        providers: providerId,
      })
    );
  }, [dispatch, providerId]);

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

  if (record.error) {
    return <ErrorReport report={record.error} truncate={true} />;
  }

  const provider = record.data;
  const errors = [
    get(providers.map, [providerId, 'error']),
    get(providers.deleted, [providerId, 'error']),
  ].filter(Boolean);

  function navigateBack() {
    historyPushWithQueryParams('/providers');
  }

  function handleDelete() {
    if (!provider.published) {
      dispatch(deleteProvider(providerId));
    }
  }

  function handleSuccess(onSuccess) {
    if (typeof onSuccess === 'function') onSuccess();
  }

  function handleError(onError) {
    if (typeof onError === 'function') onError();
  }

  const deleteStatus = get(providers.deleted, [providerId, 'status']);
  const dropdownConfig = [
    {
      text: 'Delete',
      action: handleDelete,
      disabled: provider.published,
      status: deleteStatus,
      success: navigateBack,
      confirmAction: true,
      confirmText: deleteText(providerId),
    },
  ];

  return (
    <div className="page__component">
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description">
          Provider: {providerId}
        </h1>
        <div className="dropdown__options form-group__element--right">
          <ul>
            {dropdownConfig.map((d) => (
              <li key={d.text}>
                <AsyncCommand
                  action={d.action}
                  success={() => handleSuccess(d.success)}
                  error={() => handleError(d.error)}
                  status={d.status}
                  className="button button--small button--red button--delete form-group__element--right"
                  disabled={d.disabled}
                  confirmAction={d.confirmAction}
                  confirmText={d.confirmText}
                  confirmOptions={d.confirmOptions}
                  showSuccessModal={d.postActionModal}
                  postActionText={d.postActionText}
                  element="a"
                  text={d.text}
                />
              </li>
            ))}
          </ul>
        </div>
        <Link
          className="button button--small button--green button--edit form-group__element--right"
          to={{
            pathname: `/providers/edit/${providerId}`,
            search: getPersistentQueryParams(location),
          }}
        >
          Edit
        </Link>
        {lastUpdated(provider.timestamp || provider.updatedAt)}
      </section>

      <section className="page__section">
        {errors.length > 0 && <ErrorReport report={errors} truncate={true} />}
        <div className="heading__wrapper--border">
          <h2 className="heading--medium with-description">
            Provider Overview
          </h2>
        </div>
        <div className="provider__content">
          <Metadata data={provider} accessors={metaAccessors} />
        </div>
      </section>

      <section className="page__section">
        <LogViewer
          query={{ q: providerId }}
          dispatch={dispatch}
          notFound={`No recent logs for ${providerId}`}
        />
      </section>
    </div>
  );
};

ProviderOverview.propTypes = {
  providers: PropTypes.object,
  // logs: PropTypes.object,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    historyPushWithQueryParams: PropTypes.func,
    getPersistentQueryParams: PropTypes.object
  }),
};

export default withUrlHelper(ProviderOverview);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import BatchAsyncCommand from '../BatchAsyncCommands/BatchAsyncCommands';
import Timer from '../Timer/timer';

const ListActions = ({
  children,
  bulkActions,
  groupAction,
  onBulkActionSuccess,
  onBulkActionError,
  selected,
  dispatch,
  action,
  queryConfig,
  completedBulkActions
}) => {
  const [actionsExpanded, setFiltersExpanded] = useState(false);
  const hasActions = Array.isArray(bulkActions) && bulkActions.length > 0;
  const hasGroupAction = hasActions && groupAction;

  function handleBulkActionSuccess(results, error) {
    if (typeof onBulkActionSuccess === 'function') {
      onBulkActionSuccess(results, error);
    }
  }

  function handleBulkActionError(error) {
    if (typeof onBulkActionError === 'function') {
      onBulkActionError(error);
    }
  }

  function listBulkActions() {
    return bulkActions.map((item, index) => {
      const { Component, text } = item;
      return (
        <React.Fragment key={text || index}>
          {Component && React.cloneElement(Component, { selected })}
          {!Component &&
            <BatchAsyncCommand
              dispatch={dispatch}
              action={item.action}
              state={item.state}
              text={item.text}
              clearError={item.clearError}
              confirm={item.confirm}
              confirmOptions={item.confirmOptions}
              getModalOptions={item.getModalOptions}
              onSuccess={handleBulkActionSuccess}
              onError={handleBulkActionError}
              selected={selected}
              className={item.className || ''}
            />
          }
        </React.Fragment>
      );
    });
  }

  function renderGroupActions() {
    return (
      <>
        <div className={'list-actions'}>
          <div className='form--controls'>
            <button
              aria-expanded={actionsExpanded}
              className={`button button--small form-group__element button--group-action${actionsExpanded ? '--collapsed' : ''}`}
              onClick={() => setFiltersExpanded(!actionsExpanded)}
            >
              {groupAction.title}
            </button>
          </div>
          <Timer
            noheader={!hasActions}
            dispatch={dispatch}
            action={action}
            config={queryConfig}
            reload={completedBulkActions}
          />
        </div>
        <Collapse in={actionsExpanded}>
          <div className='group-action--wrapper'>
            <h4>{groupAction.title}</h4>
            <p>{groupAction.description}</p>
            <div className='form--controls'>
              {listBulkActions()}
            </div>
          </div>
        </Collapse>
      </>
    );
  }

  function renderActions() {
    return (
      <div className='list-actions'>
        {hasActions && (
          <div className='form--controls'>
            {listBulkActions()}
          </div>
        )}
        <Timer
          noheader={!hasActions}
          dispatch={dispatch}
          action={action}
          config={queryConfig}
          reload={completedBulkActions}
        />
      </div>
    );
  }

  return (
    <div className={`list-action-wrapper${!hasActions || !children ? ' no-actions' : ''}`}>
      {children}
      {hasGroupAction && renderGroupActions()}
      {!hasGroupAction && renderActions()}
    </div>
  );
};

ListActions.propTypes = {
  children: PropTypes.node,
  bulkActions: PropTypes.array,
  groupAction: PropTypes.object,
  onBulkActionSuccess: PropTypes.func,
  onBulkActionError: PropTypes.func,
  selected: PropTypes.array,
  dispatch: PropTypes.func,
  action: PropTypes.func,
  queryConfig: PropTypes.object,
  completedBulkActions: PropTypes.number
};

export default ListActions;

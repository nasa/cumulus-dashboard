import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import BatchAsyncCommand from '../BatchAsyncCommands/BatchAsyncCommands';
import Timer from '../Timer/timer';

const ListActions = ({
  children,
  bulkActions,
  groupActions,
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
  const hasGroupActions = hasActions && groupActions;

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

  // TODO collapsible actions
  /*
  return (
    <div className={`list-action-wrapper${!hasActions || !children ? ' no-actions' : ''}`}>
      {children}
      <div className='list-actions'>
        {hasActions && (
          <div className='form--controls'>
            {bulkActions.map((item, index) => {
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
            })}
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
    </div>
  );
  */

  function renderBulkActions() {
    return bulkActions.map((item, index) => {
      const { Component, text } = item;
      return (
        <React.Fragment key={text || index}>
          {Component && React.cloneElement(Component, { selected, queryConfig })}
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

  function renderActions() {
    if (groupActions) {
      return (
        <Collapse in={actionsExpanded}>
          <div className='group-actions'>
            <h4>{groupActions.title}</h4>
            <p>{groupActions.description}</p>
            <div className='form--controls'>
              {renderBulkActions()}
            </div>
          </div>
        </Collapse>
      );
    }
    return (
      <div className='form--controls'>
        {renderBulkActions()}
      </div>
    );
  }

  return (
    <div className={`list-action-wrapper${!hasActions || !children ? ' no-actions' : ''}`}>
      {children}
      {hasGroupActions && (
        <div className={'filters filter__item form-group__element'}>
          <button
            aria-expanded={actionsExpanded}
            className={`button button--small form-group__element button--actions${actionsExpanded ? '--collapsed' : ''}`}
            onClick={() => setFiltersExpanded(!actionsExpanded)}
          >
            {groupActions.title}
          </button>
        </div>
      )}
      <div className={`list-actions${hasGroupActions ? ' group-actions--wrapper' : ''}`}>
        {hasActions &&
          renderActions()}
        <Timer
          noheader={!hasActions}
          dispatch={dispatch}
          action={action}
          config={queryConfig}
          reload={completedBulkActions}
        />
      </div>
    </div>
  );
};

ListActions.propTypes = {
  children: PropTypes.node,
  bulkActions: PropTypes.array,
  groupActions: PropTypes.object,
  onBulkActionSuccess: PropTypes.func,
  onBulkActionError: PropTypes.func,
  selected: PropTypes.array,
  dispatch: PropTypes.func,
  action: PropTypes.func,
  queryConfig: PropTypes.object,
  completedBulkActions: PropTypes.number
};

export default ListActions;

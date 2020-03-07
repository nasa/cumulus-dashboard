import React from 'react';
import PropTypes from 'prop-types';
import BatchAsyncCommand from '../BatchAsyncCommands/BatchAsyncCommands';
import Timer from '../Timer/timer';

const ListActions = ({
  children,
  bulkActions,
  onBulkActionSuccess,
  onBulkActionError,
  selected,
  dispatch,
  action,
  queryConfig,
  completedBulkActions
}) => {
  const hasActions = Array.isArray(bulkActions) && bulkActions.length > 0;

  function handleBulkActionSuccess () {
    if (typeof onBulkActionSuccess === 'function') {
      onBulkActionSuccess();
    }
  }

  function handleBulkActionError () {
    if (typeof onBulkActionError === 'function') {
      onBulkActionError();
    }
  }

  return (
    <div className='list-action-wrapper'>
      {children}
      <div className='list-actions'>
        {hasActions && (
          <div className='form--controls'>
            {bulkActions.map((item, index) => {
              const { Component, text } = item;
              return (
                <React.Fragment key={text || index}>
                  {Component && Component}
                  {!Component &&
                    <BatchAsyncCommand
                      dispatch={dispatch}
                      action={item.action}
                      state={item.state}
                      text={item.text}
                      confirm={item.confirm}
                      confirmOptions={item.confirmOptions}
                      onSuccess={handleBulkActionSuccess}
                      onError={handleBulkActionError}
                      selection={selected}
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
};

ListActions.propTypes = {
  children: PropTypes.node,
  bulkActions: PropTypes.array,
  onBulkActionSuccess: PropTypes.func,
  onBulkActionError: PropTypes.func,
  selected: PropTypes.array,
  dispatch: PropTypes.func,
  action: PropTypes.func,
  queryConfig: PropTypes.object,
  completedBulkActions: PropTypes.number
};

export default ListActions;

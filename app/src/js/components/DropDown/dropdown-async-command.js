import React, { useState, useEffect, useCallback, useRef } from 'react';
import c from 'classnames';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import { addGlobalListener } from '../../utils/browser';

const DropdownAsync = ({
  config
}) => {
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);

  const close = useCallback(() => {
    setShowActions(false);
  }, []);

  const onOutsideClick = useCallback((e) => {
    const domNode = findDOMNode(dropdownRef.current);
    if (domNode && !domNode.contains(e.target)) {
      close();
    }
  }, [close]);

  const toggleActions = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActions((prevState) => !prevState);
  }, []);

  const handleSuccess = useCallback((onSuccess) => {
    close();
    if (typeof onSuccess === 'function') onSuccess();
  }, [close]);

  const handleError = useCallback((onError) => {
    close();
    if (typeof onError === 'function') onError();
  }, [close]);

  useEffect(() => {
    const cleanup = addGlobalListener('click', onOutsideClick);
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [onOutsideClick]);

  return (
    <div className='dropdown__options form-group__element--right'>
        <button className='dropdown__options__btn button--green button button--small' onClick={toggleActions}><span>Options</span></button>
        <ul className={c('dropdown__menu', {
          'dropdown__menu--hidden': !showActions
        })}>
          {config.map((d) => <li key={d.text}>
            <AsyncCommand action={d.action}
              success={() => handleSuccess(d.success)}
              error={() => handleError(d.error)}
              status={d.status}
              disabled={d.disabled}
              confirmAction={d.confirmAction}
              confirmText={d.confirmText}
              confirmOptions={d.confirmOptions}
              showSuccessModal={d.postActionModal}
              postActionText={d.postActionText}
              className={'link--no-underline'}
              element='a'
              text={d.text} />
          </li>)}
        </ul>
      </div>
  );
};

DropdownAsync.propTypes = {
  config: PropTypes.array
};

export default DropdownAsync;

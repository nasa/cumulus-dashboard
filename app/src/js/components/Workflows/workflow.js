import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Ace from 'react-ace';
import { listWorkflows } from '../../actions';
import config from '../../config';
import { setWindowEditorRef } from '../../utils/browser';
import Loading from '../LoadingIndicator/loading-indicator';

const Workflow = () => {
  const [view, setView] = useState('json');

  const { workflowName } = useParams();
  const dispatch = useDispatch();
  const workflows = useSelector((state) => state.workflows);

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch, workflowName]);

  const renderReadOnlyJson = (name, data) => (
    <Ace
      mode='json'
      theme={config.editorTheme}
      name={`collection-read-only-${name}`}
      readOnly={true}
      value={JSON.stringify(data, null, '\t')}
      width='auto'
      tabSize={config.tabSize}
      showPrintMargin={false}
      minLines={1}
      maxLines={35}
      wrapEnabled={true}
      ref={setWindowEditorRef}
    />
  );

  const renderJson = (data) => (
    <ul>
      <li>
        <label>{data.name}</label>
        {renderReadOnlyJson('recipe', data)}
      </li>
    </ul>
  );

  const data = workflows.map?.[workflowName];

  if (!data) {
    return <Loading />;
  }

  return (
    <div className='page__component'>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description'>
          Workflow: {workflowName}
        </h1>
      </section>
      <section className='page__section'>
        <div className='tab--wrapper'>
          <button
            className={`button--tab ${view === 'json' ? 'button--active' : ''}`}
            onClick={() => view !== 'json' && setView('json')}
          >
            JSON View
          </button>
        </div>
        <div>
          {view === 'list' ? null : renderJson(data)}
        </div>
      </section>
    </div>
  );
};

export default Workflow;

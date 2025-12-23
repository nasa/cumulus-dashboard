import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Ace from 'react-ace';
import get from 'object-path';

import { getCollection } from '../../actions';
import { getCollectionId, nullValue } from '../../utils/format';
import config from '../../config';
import Loading from '../LoadingIndicator/loading-indicator';
import CollectionHeader from './collection-header';

const breadcrumbConfig = [
  {
    label: 'Definition',
    active: true,
  }
];

const CollectionIngest = () => {
  const [view, setView] = useState('json');

  const collections = useSelector((state) => state.collections);
  const dispatch = useDispatch();

  const { name, version } = useParams();

  useEffect(() => {
    const decodedVersion = decodeURIComponent(version);
    dispatch(getCollection(name, decodedVersion));
  }, [name, version, dispatch]);

  const renderReadOnlyJson = (dataName, data) => (
    <Ace
      mode="json"
      theme={config.editorTheme}
      name={`collection-read-only-${dataName}`}
      readOnly={true}
      value={JSON.stringify(data, null, '\t')}
      width="auto"
      tabSize={config.tabSize}
      showPrintMargin={false}
      minLines={1}
      maxLines={35}
      wrapEnabled={true}
    />
  );

  const renderList = (data) => {
    const ingest = get(data, 'ingest', {});
    const recipe = get(data, 'recipe', {});

    return (
      <div className="list-view">
        <section className="page__section--small">
          <h2 className="heading--medium">Ingest</h2>
          <p>Type: {ingest.type}</p>
          <dt>Configuration</dt>
          <dd>Concurrency: {get(ingest, 'config.concurrency', nullValue)}</dd>
          <dd>Endpoint: {get(ingest, 'config.endpoint', nullValue)}</dd>
        </section>

        <section className="page__section--small">
          <h2 className="heading--medium">Recipe</h2>
          <dt>Order</dt>
          {get(recipe, 'order', []).map((step, i) => (
            <dd key={i}>{step}</dd>
          ))}
          <dt>Process step</dt>
          <dd>Description: {get(recipe, 'processStep.description', '--')}</dd>
          <dt>Input files</dt>
          {get(recipe, 'processStep.config.inputFiles', []).map((file, i) => (
            <dd key={i}>{file}</dd>
          ))}
          <dt>Output files</dt>
          {get(recipe, 'processStep.config.outputFiles', []).map((file, i) => (
            <dd key={i}>{file}</dd>
          ))}
        </section>
      </div>
    );
  };

  const renderJson = (data) => (
    <ul>
      <li>
        <label>{data.name}</label>
        {renderReadOnlyJson('recipe', data)}
      </li>
    </ul>
  );

  const decodedVersion = decodeURIComponent(version);
  const collectionId = getCollectionId({ name, version: decodedVersion });
  const record = collections.map[collectionId];

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

  const { data } = record;

  return (
    <div className="page__component">
      <CollectionHeader
        breadcrumbConfig={breadcrumbConfig}
        name={name}
        queriedAt={data.queriedAt}
        version={decodedVersion}
      />
      <section className="page__section">
        <div className="tab--wrapper">
          <button
            className={`button--tab ${view === 'json' ? 'button--active' : ''}`}
            onClick={() => view !== 'json' && setView('json')}
          >
            JSON View
          </button>
        </div>
        <div>
          {view === 'list' ? renderList(data) : renderJson(data)}
        </div>
      </section>
    </div>
  );
};

export default CollectionIngest;

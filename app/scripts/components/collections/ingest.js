'use strict';
import React from 'react';
import { Link } from 'react-router';
import Ace from 'react-ace';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getCollection } from '../../actions';
import { lastUpdated, nullValue, getCollectionId } from '../../utils/format';
import config from '../../config';
import Loading from '../app/loading-indicator';

var CollectionIngest = createReactClass({
  displayName: 'CollectionIngest',

  getInitialState: function () {
    return {
      view: 'json'
    };
  },

  propTypes: {
    params: PropTypes.object,
    collections: PropTypes.object,
    dispatch: PropTypes.func
  },

  componentWillReceiveProps: function (props) {
    const { name, version } = this.props.params;
    const collectionId = getCollectionId({ name, version });
    const record = this.props.collections.map[collectionId];
    if (!record) {
      this.get(name, version);
    }
  },

  componentWillMount: function () {
    const { name, version } = this.props.params;
    this.get(name, version);
  },

  get: function (name, version) {
    this.props.dispatch(getCollection(name, version));
  },

  renderReadOnlyJson: function (name, data) {
    return (
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
      />
    );
  },

  render: function () {
    const { name, version } = this.props.params;
    const collectionId = getCollectionId(this.props.params);
    const record = this.props.collections.map[collectionId];
    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }
    const { data } = record;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{name}</h1>
          <Link className='button button--small form-group__element--right button--green' to={`/collections/edit/${name}/${version}`}>Edit</Link>
          {lastUpdated(data.queriedAt)}
        </section>
        <section className='page__section'>
          <div className='tab--wrapper'>
            <button className={'button--tab ' + (this.state.view === 'json' ? 'button--active' : '')}
              onClick={() => this.state.view !== 'json' && this.setState({ view: 'json' })}>JSON View</button>
          </div>
          <div>
            {this.state.view === 'list' ? this.renderList(data) : this.renderJson(data)}
          </div>
        </section>
      </div>
    );
  },

  renderList: function (data) {
    const ingest = get(data, 'ingest', {});
    const recipe = get(data, 'recipe', {});

    return (
      <div className='list-view'>
        <section className='page__section--small'>
          <h2 className='heading--medium'>Ingest</h2>
          <p>Type: {ingest.type}</p>
          <dt>Configuration</dt>
          <dd>Concurrency: {get(ingest, 'config.concurrency', nullValue)}</dd>
          <dd>Endpoint: {get(ingest, 'config.endpoint', nullValue)}</dd>
        </section>

        <section className='page__section--small'>
          <h2 className='heading--medium'>Recipe</h2>

          <dt>Order</dt>
          {get(recipe, 'order', []).map((step, i) => <dd key={i}>{step}</dd>)}

          <dt>Process step</dt>
          <dd>Description: {get(recipe, 'processStep.description', '--')}</dd>

          <dt>Input files</dt>
          {get(recipe, 'processStep.config.inputFiles', []).map((file, i) => <dd key={i}>{file}</dd>)}

          <dt>Output files</dt>
          {get(recipe, 'processStep.config.outputFiles', []).map((file, i) => <dd key={i}>{file}</dd>)}
        </section>
      </div>
    );
  },

  renderJson: function (data) {
    return (
      <ul>
        <li>
          <label>{data.name}</label>
          {this.renderReadOnlyJson('recipe', data)}
        </li>
      </ul>
    );
  }
});

export default connect(state => state)(CollectionIngest);

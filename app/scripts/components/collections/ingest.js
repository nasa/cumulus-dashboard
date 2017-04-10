'use strict';
import React from 'react';
import { Link } from 'react-router';
import Ace from 'react-ace';
import { connect } from 'react-redux';
import { get } from 'object-path';
import omit from 'lodash.omit';
import { getCollection } from '../../actions';
import { fullDate, lastUpdated, nullValue } from '../../utils/format';
import config from '../../config';
import Loading from '../app/loading-indicator';

var CollectionIngest = React.createClass({
  displayName: 'CollectionIngest',

  getInitialState: function () {
    return {
      view: 'json'
    };
  },

  propTypes: {
    params: React.PropTypes.object,
    collections: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentWillReceiveProps: function (props) {
    const collectionName = props.params.collectionName;
    const record = this.props.collections.map[collectionName];
    if (!record) {
      this.get(collectionName);
    }
  },

  componentWillMount: function () {
    this.get(this.props.params.collectionName);
  },

  get: function (collectionName) {
    this.props.dispatch(getCollection(collectionName));
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
        maxLines={12}
        wrapEnabled={true}
      />
    );
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const record = this.props.collections.map[collectionName];
    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }
    const { data } = record;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{collectionName}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to={`/collections/edit/${collectionName}`}>Edit</Link>
          {lastUpdated(data.queriedAt)}
        </section>
        <section className='page__section'>
          <div className='tab--wrapper'>
            <button className={'button--tab ' + (this.state.view === 'list' ? 'button--active' : '')}
              onClick={() => this.state.view !== 'list' && this.setState({ view: 'list' })}>List View</button>
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
    const granuleDefinition = get(data, 'granuleDefinition', {});
    const ingest = get(data, 'ingest', {});
    const recipe = get(data, 'recipe', {});

    return (
      <div className='list-view'>
        <section className='page__section--small'>
          <dl>
            <dt>Collection Name</dt>
            <dd>{data.collectionName}</dd>

            <dt>Created at</dt>
            <dd>{fullDate(data.createdAt)}</dd>

            <dt>Updated at</dt>
            <dd>{fullDate(data.updatedAt)}</dd>

            <dt>Changed by</dt>
            <dd>{fullDate(data.changedBy)}</dd>
          </dl>
        </section>

        <section className='page__section--small'>
          <h2 className='heading--medium'>Granule Definition</h2>
          <p>{granuleDefinition.granuleId}</p>
          <h3 className='heading--small'>Files</h3>
          {Object.keys(get(granuleDefinition, 'files', [])).map(name => {
            let file = granuleDefinition.files[name];
            return (
              <dl key={name}>
                <dt>{name}</dt>
                <dd>Regex: {file.regex}</dd>
                <dd>Access: {file.access}</dd>
                <dd>Source: {file.source}</dd>
              </dl>
              );
          })}
          <h1>Needed for processing: {get(granuleDefinition, 'neededForProcessing', []).join(', ')}</h1>
        </section>

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
          <label>{data.collectionName}</label>
          {this.renderReadOnlyJson('recipe', omit(data, ['recipe', 'granuleDefinition', 'granulesStatus']))}
        </li>
        <li>
          <label>Recipe</label>
          {this.renderReadOnlyJson('recipe', data.recipe)}
        </li>
        <li>
          <label>Granule Definition</label>
          {this.renderReadOnlyJson('granuleDefinition', data.granuleDefinition)}
        </li>
        <li>
          <label>Granule Status</label>
          {this.renderReadOnlyJson('granuleStatus', data.granulesStatus)}
        </li>
      </ul>
    );
  }
});

export default connect(state => state)(CollectionIngest);

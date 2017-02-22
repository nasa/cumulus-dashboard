'use strict';
import React from 'react';
import Ace from 'react-ace';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { getCollection } from '../../actions';
import { fullDate } from '../../utils/format';
import config from '../../config';

var Collection = React.createClass({
  displayName: 'Collection',

  getInitialState: function () {
    return {
      view: 'list'
    };
  },

  propTypes: {
    params: React.PropTypes.object,
    collections: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentWillReceiveProps: function (props) {
    const collectionName = props.params.collectionName;
    const record = get(this.props.collections, ['map', collectionName]);
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

  render: function () {
    const record = get(this.props.collections, ['map', this.props.params.collectionName]);
    if (!record) {
      return <div></div>;
    } else if (record.inflight) {
      // TODO loading indicator
      return <div></div>;
    }
    const { data } = record;
    return (
      <div className='page__component'>
        <h1>{data.collectionName}</h1>

        <button onClick={() => this.state.view !== 'list' && this.setState({ view: 'list' })}>List View</button>
        <button onClick={() => this.state.view !== 'json' && this.setState({ view: 'json' })}>JSON View</button>

        <div>
          {this.state.view === 'list' ? this.renderList(data) : this.renderJson(data)}
        </div>
      </div>
    );
  },

  renderList: function (data) {
    const {
      granuleDefinition,
      ingest,
      recipe
    } = data;

    return (
      <div>

        <div>
          <h1>Collection Name</h1>
          <p>{data.collectionName}</p>
        </div>

        <div>
          <h1>Created at</h1>
          <p>{fullDate(data.createdAt)}</p>

          <h1>Updated at</h1>
          <p>{fullDate(data.updatedAt)}</p>

          <h1>Changed by</h1>
          <p>{fullDate(data.changedBy)}</p>
        </div>

        <div>
          <h1>Granule Definition</h1>
          <p>{granuleDefinition.granuleId}</p>
          <h1>Files</h1>
          {Object.keys(granuleDefinition.files).map(name => {
            let file = granuleDefinition.files[name];
            return (
              <div key={name}>
                <h3>{name}</h3>
                <p>Regex: {file.regex}</p>
                <p>Access: {file.access}</p>
                <p>Source: {file.source}</p>
              </div>
              );
          })}
          <h1>Needed for processing: {granuleDefinition.neededForProcessing.join(', ')}</h1>
        </div>

        <div>
          <h1>Ingest</h1>
          <p>Type: {ingest.type}</p>

          <h1>Configuration</h1>
          <p>Concurrency: {ingest.config.concurrency}</p>
          <p>Endpoint: {ingest.config.endpoint}</p>
        </div>

        <div>
          <h1>Recipe</h1>

          <h1>Order</h1>
          {get(recipe, 'order', []).map((step, i) => <p key={i}>{step}</p>)}

          <h1>Process step</h1>
          <p>Description: {get(recipe, 'processStep.description', '--')}</p>

          <h1>Input files</h1>
          {get(recipe, 'processStep.config.inputFiles', []).map((file, i) => <p key={i}>{file}</p>)}

          <h1>Output files</h1>
          {get(recipe, 'processStep.config.outputFiles', []).map((file, i) => <p key={i}>{file}</p>)}

        </div>

      </div>
    );
  },

  renderJson: function (data) {
    return (
      <div>
        <Ace
          mode='json'
          theme={config.editorTheme}
          name='collection-read-only'
          readOnly={true}
          value={JSON.stringify(data, null, '\t')}

          width='auto'
          tabSize={config.tabSize}
          showPrintMargin={false}
          minLines={1}
          maxLines={200}
          wrapEnabled={true}
        />

      </div>
    );
  }
});

export default connect(state => state)(Collection);

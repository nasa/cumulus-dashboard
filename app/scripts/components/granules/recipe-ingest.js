'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  getGranule,
  reprocessGranule,
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import { get } from 'object-path';
import { lastUpdated, seconds } from '../../utils/format';
import Ace from 'react-ace';
import config from '../../config';
import Loading from '../app/loading-indicator';
import AsyncCommands from '../form/dropdown-async-command';

const noop = () => true;
var GranuleRecipe = React.createClass({
  displayName: 'GranuleRecipe',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object,
    router: React.PropTypes.object
  },

  componentWillMount: function () {
    const granuleId = this.props.params.granuleId;
    if (!this.props.granules.map[granuleId]) {
      this.props.dispatch(getGranule(granuleId));
    }
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/granules');
  },

  reprocess: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reprocessGranule(granuleId));
  },

  reingest: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reingestGranule(granuleId));
  },

  remove: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(removeGranule(granuleId));
  },

  delete: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(deleteGranule(granuleId));
  },

  render: function () {
    const granuleId = this.props.params.granuleId;
    const record = this.props.granules.map[granuleId];

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }

    const granule = record.data;
    const recipeOrder = get(granule, 'recipe.order', []);

    // processing step blocks
    const recipeSteps = recipeOrder.map((step, index) => {
      const description = get(granule, ['recipe', step, 'description']);
      return (
        <div key={step + index} className='recipe'>
          <label>Step {index + 1}: {step}</label>
          {description ? <span className='label__description'>{description}</span> : null}
          <Ace mode='json'
            theme={config.editorTheme}
            name='recipe-read-only'
            readOnly={true}
            value={JSON.stringify(granule.recipe[step], null, '\t')}
            width='auto'
            tabSize={config.tabSize}
            showPrintMargin={false}
            minLines={7}
            maxLines={25}
            wrapEnabled={true}
          />
        </div>
      );
    });

    const ingestedFiles = Object.keys(get(granule, 'files', {})).map((filename, index) => (
      <div key={filename + index}>
        <label>{filename}</label>
        <Ace mode='json'
          theme={config.editorTheme}
          name='recipe-read-only'
          readOnly={true}
          value={JSON.stringify(granule.files[filename], null, '\t')}
          width='auto'
          tabSize={config.tabSize}
          showPrintMargin={false}
          minLines={10}
          maxLines={25}
          wrapEnabled={true}
        />
      </div>
    ));

    const dropdownConfig = [{
      text: 'Reprocess',
      action: this.reprocess,
      status: get(this.props.granules.reprocessed, [granuleId, 'status']),
      success: noop
    }, {
      text: 'Reingest',
      action: this.reingest,
      status: get(this.props.granules.reingested, [granuleId, 'status']),
      success: noop
    }, {
      text: 'Remove from OnEarth',
      action: this.remove,
      status: get(this.props.granules.removed, [granuleId, 'status']),
      success: noop
    }, {
      text: 'Delete',
      action: this.delete,
      disabled: granule.published,
      status: get(this.props.granules.deleted, [granuleId, 'status']),
      success: this.navigateBack
    }];

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{granuleId}</h1>
          <AsyncCommands config={dropdownConfig} />
          {lastUpdated(granule.queriedAt)}
        </section>

        <section className='page__section'>
          <h2 className='heading--medium'>Recipe</h2>
          {recipeSteps}
        </section>

        <section className='page__section'>
          <h2 className='heading--medium'>Ingest</h2>
          <div>
            <h3>Duration: {seconds(granule.ingestDuration)}</h3>
            {ingestedFiles}
          </div>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(GranuleRecipe);

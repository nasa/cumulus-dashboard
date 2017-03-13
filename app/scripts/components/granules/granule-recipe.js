'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { getGranule } from '../../actions';
import { get } from 'object-path';
import { Link } from 'react-router';
import { lastUpdated, seconds } from '../../utils/format';
import Ace from 'react-ace';
import config from '../../config';
import Loading from '../app/loading-indicator';

var GranuleRecipe = React.createClass({
  displayName: 'GranuleRecipe',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object
  },

  componentWillMount: function () {
    const granuleId = this.props.params.granuleId;
    if (!get(this.props.granules.map, granuleId)) {
      this.props.dispatch(getGranule(granuleId));
    }
  },

  render: function () {
    const granuleId = this.props.params.granuleId;
    const record = get(this.props.granules, ['map', granuleId]);

    if (!record) {
      return <div></div>;
    } else if (record.inflight) {
      return <Loading />;
    }

    const granule = record.data;
    const recipeOrder = get(granule, 'recipe.order', []);

    // processing steps list items
    const steps = recipeOrder.map((step) => <li key={step}>{step}</li>);

    // processing step blocks
    const recipeSteps = recipeOrder.map((step, index) => (
      <div key={step + index} className='recipe'>
        <h3>Step {index + 1}: {step}</h3>
        <p>Description: {granule.recipe[step].description}</p>
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
    ));

    const ingestedFiles = Object.keys(get(granule, 'files', {})).map((filename, index) => (
      <div key={filename + index}>
        <h3>{filename}</h3>
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

    return (
      <div className='page__component'>

        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{granuleId}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to='/'>Delete</Link>
          <Link className='button button--small form-group__element--right button--green' to='/'>Remove from CMR</Link>
          <Link className='button button--small form-group__element--right button--green' to='/'>Reprocess</Link>
          {lastUpdated(granule.queriedAt)}
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Recipe</h2>
          </div>
          <div>
            <h3>Processing Order</h3>
            <ol>{steps}</ol>
            {recipeSteps}
          </div>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Ingest</h2>
          </div>
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

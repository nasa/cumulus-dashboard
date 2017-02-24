'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { getGranule } from '../../actions';
import { get } from 'object-path';
import { Link } from 'react-router';
import Ace from 'react-ace';
import config from '../../config';

var GranuleRecipe = React.createClass({
  displayName: 'Granule',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object
  },

  componentWillMount: function () {
    const collectionName = this.props.params.collectionName;
    const granuleId = this.props.params.granuleId;

    // check for granule in map first, otherwise request it
    const mapId = `${this.props.params.collectionName}-${granuleId}`;
    if (!get(this.props.granules.map, mapId)) {
      this.props.dispatch(getGranule(collectionName, granuleId));
    }
  },

  render: function () {
    const granuleId = this.props.params.granuleId;

    const mapId = `${this.props.params.collectionName}-${granuleId}`;
    const record = get(this.props.granules, ['map', mapId]);

    if (!record) {
      return <div></div>;
    } else if (record.inflight) {
      // TODO loading indicator
      return <div></div>;
    }

    const granule = record.data;

    // processing steps list items
    const steps = granule.recipe.order.map((step) => (
      <li key={step}>{step}</li>
    ));

    // processing step blocks
    const recipeSteps = granule.recipe.order.map((step, index) => (
      <div key={index} className='recipe'>
        <h3>Step {index + 1}: {step}</h3>

        <p>{granule.recipe[step].description}</p>

        <Ace mode='json'
          theme={config.editorTheme}
          name='recipe-read-only'
          readOnly={true}
          value={JSON.stringify(granule.recipe[step].config, null, '\t')}
          width='auto'
          tabSize={config.tabSize}
          showPrintMargin={false}
          minLines={1}
          maxLines={200}
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
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Recipe</h2>
          </div>

          <div className='granule-recipes'>
            <h3>Processing Order</h3>
            <ol>{steps}</ol>

            {recipeSteps}
          </div>
        </section>

      </div>
    );
  }
});

export default connect(state => state)(GranuleRecipe);

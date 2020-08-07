import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Ace from 'react-ace';
import {
  getGranule,
  reprocessGranule,
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import { lastUpdated, seconds } from '../../utils/format';
import config from '../../config';
import Loading from '../LoadingIndicator/loading-indicator';
import DropdownAsync from '../DropDown/dropdown-async-command';
import { strings } from '../locale';
import { historyPushWithQueryParams } from '../../utils/url-helper';

const noop = () => true;
class GranuleRecipe extends React.Component {
  constructor () {
    super();
    this.navigateBack = this.navigateBack.bind(this);
    this.reprocess = this.reprocess.bind(this);
    this.reingest = this.reingest.bind(this);
    this.remove = this.remove.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount () {
    const { granuleId } = this.props.params;
    if (!this.props.granules.map[granuleId]) {
      this.props.dispatch(getGranule(granuleId));
    }
  }

  navigateBack () {
    historyPushWithQueryParams('/granules');
  }

  reprocess () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reprocessGranule(granuleId));
  }

  reingest () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reingestGranule(granuleId));
  }

  remove () {
    const { granuleId } = this.props.params;
    this.props.dispatch(removeGranule(granuleId));
  }

  delete () {
    const { granuleId } = this.props.params;
    this.props.dispatch(deleteGranule(granuleId));
  }

  render () {
    const { granuleId } = this.props.params;
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
      text: strings.remove_from_cmr,
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
          <DropdownAsync config={dropdownConfig} />
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
}

GranuleRecipe.propTypes = {
  params: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
};

export default connect((state) => state)(GranuleRecipe);

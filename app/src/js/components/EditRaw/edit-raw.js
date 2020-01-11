'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextArea from '../TextAreaForm/text-area';
import { get } from 'object-path';
import { getSchema } from '../../actions';
import Loading from '../LoadingIndicator/loading-indicator';
import { removeReadOnly } from '../FormSchema/schema';
import _config from '../../config';

const { updateDelay } = _config;

class EditRaw extends React.Component {
  constructor () {
    super();
    this.state = {
      pk: null,
      data: '',
      error: null
    };
    this.queryRecord = this.queryRecord.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  queryRecord (pk) {
    if (!this.props.state.map[pk]) {
      this.props.dispatch(this.props.getRecord(pk));
    }
  }

  submit (e) {
    e.preventDefault();
    const { state, pk } = this.props;
    const updateStatus = get(state.updated, [pk, 'status']);
    if (updateStatus === 'inflight') { return; }
    try {
      var json = JSON.parse(this.state.data);
    } catch (e) {
      return this.setState({ error: 'Syntax error in JSON' });
    }
    this.setState({ error: null });
    console.log('About to update', json);
    this.props.dispatch(this.props.updateRecord(json));
  }

  cancel () {
    this.props.router.push(this.props.backRoute);
  }

  componentDidMount () {
    this.queryRecord(this.props.pk);
    this.props.dispatch(getSchema(this.props.schemaKey));
  }

  componentDidUpdate (prevProps) {
    const { pk, state, schema, schemaKey } = this.props;
    const { dispatch, router, clearRecordUpdate, backRoute } = prevProps;
    // successfully updated, navigate away
    if (get(state.updated, [pk, 'status']) === 'success') {
      return setTimeout(() => {
        dispatch(clearRecordUpdate(pk));
        router.push(backRoute);
      }, updateDelay);
    }
    if (this.state.pk === pk || !schema[schemaKey]) { return; }
    const recordSchema = schema[schemaKey];

    const newRecord = state.map[pk] || {};
    if (newRecord.error) {
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        pk,
        data: '',
        error: newRecord.error
      });
    } else if (newRecord.data) {
      let data = removeReadOnly(newRecord.data, recordSchema);
      try {
        var text = JSON.stringify(data, null, '\t');
      } catch (error) {
        this.setState({ error, pk }); // eslint-disable-line react/no-did-update-set-state
      }
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        pk,
        data: text,
        error: null
      });
    } else if (!newRecord.inflight) {
      this.queryRecord(pk);
    }
  }

  onChange (id, value) {
    this.setState({ data: value });
  }

  render () {
    const { data, pk } = this.state;
    const updateStatus = get(this.props.state.updated, [pk, 'status']);
    const buttonText = updateStatus === 'inflight' ? 'loading...'
      : updateStatus === 'success' ? 'Success!' : 'Submit';
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className="heading__wrapper--border">
            <h1 className='heading--large'>{pk}</h1>
          </div>
          { data || data === '' ? (
            <form>
              <TextArea
                value={data}
                id={`edit-${pk}`}
                error={this.state.error}
                onChange={this.onChange}
                mode={'json'}
                minLines={1}
                maxLines={200}
              />
              <button
                className={'button button--submit button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right' + (updateStatus === 'inflight' ? ' button--disabled' : '')}
                onClick={this.submit}
                value={buttonText}
              >{buttonText}</button>
              <button
                className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
                onClick={this.cancel}
              >Cancel</button>
            </form>
          ) : <Loading /> }
        </section>
      </div>
    );
  }
}

EditRaw.propTypes = {
  dispatch: PropTypes.func,
  pk: PropTypes.string,
  schema: PropTypes.object,
  schemaKey: PropTypes.string,
  state: PropTypes.object,
  backRoute: PropTypes.string,
  router: PropTypes.object,

  getRecord: PropTypes.func,
  updateRecord: PropTypes.func,
  clearRecordUpdate: PropTypes.func
};

export default withRouter(connect(state => ({
  schema: state.schema
}))(EditRaw));

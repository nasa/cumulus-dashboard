'use strict';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'object-path';
import { getSchema } from '../../actions';
import Schema from '../FormSchema/schema';
import Loading from '../LoadingIndicator/loading-indicator';
import _config from '../../config';
import { strings } from '../locale';

const { updateDelay } = _config;

class AddCollection extends React.Component {
  constructor () {
    super();
    this.state = {
      pk: null
    };
    this.navigateBack = this.navigateBack.bind(this);
    this.post = this.post.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(getSchema(this.props.schemaKey));
  }

  componentDidUpdate (prevProps) {
    const { pk } = this.state;
    const { history, baseRoute } = prevProps;
    const status = get(this.props.state, ['created', pk, 'status']);
    if (status === 'success') {
      return setTimeout(() => {
        history.push(path.join(baseRoute, pk));
      }, updateDelay);
    }
  }

  navigateBack () {
    this.props.history.push(this.props.baseRoute.split('/')[1]);
  }

  post (id, payload) {
    const {
      primaryProperty,
      dispatch,
      attachMeta,
      validate,
      createRecord
    } = this.props;
    if (attachMeta) {
      payload.createdAt = new Date().getTime();
      payload.updatedAt = new Date().getTime();
      payload.changedBy = strings.dashboard;
    }
    if (!validate || validate(payload)) {
      const pk = get(payload, primaryProperty);
      this.setState({ pk }, () => dispatch(createRecord(pk, payload)));
    } else {
      console.log('Payload failed validation');
    }
  }

  render () {
    const { title, state, schemaKey } = this.props;
    const { pk } = this.state;
    const record = pk ? get(state.created, pk, {}) : {};
    const schema = this.props.schema[schemaKey];
    return (
      <div className='page__component page__content--shortened--centered'>
        <section className='page__section page__section--fullpage-form'>
          <div className='page__section__header'>
            <h1 className='heading--large'>{title}</h1>
          </div>
          {schema ? <Schema
            schema={schema}
            pk={'new-collection'}
            onSubmit={this.post}
            onCancel={this.navigateBack}
            status={record.status}
            error={record.status === 'inflight' ? null : record.error}
          /> : <Loading />}
        </section>
      </div>
    );
  }
}

AddCollection.propTypes = {
  schema: PropTypes.object,
  schemaKey: PropTypes.string,
  primaryProperty: PropTypes.string,
  title: PropTypes.string,

  dispatch: PropTypes.func,
  state: PropTypes.object,

  history: PropTypes.object,
  baseRoute: PropTypes.string,
  attachMeta: PropTypes.bool,

  createRecord: PropTypes.func,
  validate: PropTypes.func
};

export default withRouter(connect(state => ({
  schema: state.schema
}))(AddCollection));

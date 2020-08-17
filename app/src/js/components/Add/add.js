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
import { window } from '../../utils/browser';
import { historyPushWithQueryParams } from '../../utils/url-helper';

const { updateDelay } = _config;

class AddRecord extends React.Component {
  constructor (props) {
    super(props);
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
    const { baseRoute } = prevProps;
    const status = get(this.props.state, ['created', pk, 'status']);

    if (status === 'success') {
      return setTimeout(() => {
        historyPushWithQueryParams(path.join(baseRoute, pk));
        window.scrollTo(0, 0);
      }, updateDelay);
    }
  }

  navigateBack () {
    const { baseRoute } = this.props;
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
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
      payload.updatedAt = payload.createdAt;
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
    const { data, title, state, schemaKey } = this.props;
    const { pk } = this.state;
    const record = pk ? get(state.created, pk, {}) : {};
    const schema = this.props.schema[schemaKey];

    return (
      <div className="page__component page__content--shortened--centered">
        <section className="page__section page__section--fullpage-form">
          <div className="page__section__header">
            <h1 className="heading--large">{title}</h1>
          </div>
          {schema ? (
            <Schema
              data={data}
              schema={schema}
              pk={'new-collection'}
              onSubmit={this.post}
              onCancel={this.navigateBack}
              status={record.status}
              error={record.status === 'inflight' ? null : record.error}
              include={this.props.include}
              exclude={this.props.exclude}
              enums={this.props.enums}
            />
          ) : (
            <Loading />
          )}
        </section>
      </div>
    );
  }
}

AddRecord.propTypes = {
  data: PropTypes.object,
  schema: PropTypes.object,
  schemaKey: PropTypes.string,
  primaryProperty: PropTypes.string,
  title: PropTypes.string,
  enums: PropTypes.objectOf(PropTypes.array),

  dispatch: PropTypes.func,
  state: PropTypes.object,

  baseRoute: PropTypes.string,
  attachMeta: PropTypes.bool,

  createRecord: PropTypes.func,
  validate: PropTypes.func,

  // Specifies schema properties to include on the form.  Each element in this
  // array may be either a string that specifies the full path of the property
  // within the schema (e.g., "collection.name" and "collection.version") or a
  // regular expression (e.g., /^collection/).
  include: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  ),
  // Specifies schema properties to exclude from the form.  Elements in this
  // array are specified the same was as in the "include" array.  However,
  // exclusions are applied after inclusions, so a property that is included
  // via the "include" array may be excluded by this array, preventing it from
  // appearing on the form.
  exclude: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  )
};

Schema.defaultProps = {
  // Exclude no schema properties
  exclude: [],
  // Include all schema properties
  include: [/.+/]
};

export default withRouter(
  connect((state) => ({
    schema: state.schema
  }))(AddRecord)
);

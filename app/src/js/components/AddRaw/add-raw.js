'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextArea from '../TextAreaForm/text-area';
import { get } from 'object-path';
import { updateDelay } from '../../config';

class AddRaw extends React.Component {
  constructor () {
    super();
    this.state = {
      data: '',
      pk: null,
      error: null
    };
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  cancel (e) {
    this.props.router.push(this.props.getBaseRoute().split('/')[1]);
  }

  submit (e) {
    e.preventDefault();
    const { state, dispatch, createRecord, getPk } = this.props;
    let { pk, data } = this.state;
    // prevent duplicate submits while the first is inflight.
    if (!pk || get(state.created, [pk, 'status']) !== 'inflight') {
      try {
        var json = JSON.parse(data);
      } catch (e) {
        return this.setState({ error: 'Syntax error in JSON' });
      }
      this.setState({ error: null, pk: getPk(json) });
      dispatch(createRecord(json));
    }
  }

  componentDidMount () {
    if (this.props.defaultValue) {
      this.setState({ data: JSON.stringify(this.props.defaultValue, null, 2) }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  componentDidUpdate (prevProps) {
    const { router, getBaseRoute } = prevProps;
    const { pk, error } = this.state;
    if (!pk) {
      return;
    }

    const status = get(this.props.state.created, [pk, 'status']);
    if (status === 'success') {
      const baseRoute = getBaseRoute(pk);
      return setTimeout(() => {
        router.push(baseRoute);
      }, updateDelay);
    } else if (status === 'error' && !error) {
      this.setState({ error: get(this.props.state.created, [pk, 'error']) }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  onChange (id, value) {
    this.setState({ data: value });
  }

  render () {
    const { pk, error, data } = this.state;
    const status = get(this.props.state.created, [pk, 'status']);
    const buttonText = status === 'inflight' ? 'loading...'
      : status === 'success' ? 'Success!' : 'Submit';
    return (
      <div className='page__component page__content--shortened--centered'>
        <section className='page__section page__section--fullpage-form'>
          <div className='page__section__header'>
            <h1 className='heading--large'>{this.props.title}</h1>
            <form>
              <TextArea
                value={data}
                id={'create-new-record'}
                error={error}
                onChange={this.onChange}
                mode={'json'}
                minLines={30}
                maxLines={200}
              />
                <button
                  className={'button button--submit button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right' + (status === 'inflight' ? ' button--disabled' : '')}
                  onClick={this.submit}
                  readOnly={true}
                  >{buttonText}</button>
                <button
                  className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right'
                  onClick={this.cancel}
                  readOnly={true}
                >Cancel</button>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

AddRaw.propTypes = {
  dispatch: PropTypes.func,
  state: PropTypes.object,
  defaultValue: PropTypes.object,
  title: PropTypes.string,
  getPk: PropTypes.func,
  getBaseRoute: PropTypes.func,
  router: PropTypes.object,
  createRecord: PropTypes.func
};

export default withRouter(connect()(AddRaw));

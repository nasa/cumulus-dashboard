'use strict';
import React from 'react';
import Ace from 'react-ace';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { listWorkflows } from '../../actions';
import config from '../../config';
import { setWindowEditorRef } from '../../utils/browser';
import Loading from '../app/loading-indicator';

var Workflow = createReactClass({
  getInitialState: function () {
    return {
      view: 'json'
    };
  },

  propTypes: {
    params: PropTypes.object,
    workflows: PropTypes.object,
    dispatch: PropTypes.func
  },

  UNSAFE_componentWillReceiveProps: function ({ params }) {
    const { workflowName } = params;
    if (workflowName !== this.props.params.workflowName) {
      this.get();
    }
  },

  UNSAFE_componentWillMount: function () {
    this.get();
  },

  get: function (workflowName) {
    this.props.dispatch(listWorkflows());
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
        maxLines={35}
        wrapEnabled={true}
        ref={setWindowEditorRef}
      />
    );
  },

  render: function () {
    const { workflows, params } = this.props;
    const { workflowName } = params;
    const data = workflows.map[workflowName];
    if (!data) {
      return <Loading />;
    }
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{workflowName}</h1>
        </section>
        <section className='page__section'>
          <div className='tab--wrapper'>
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

  renderJson: function (data) {
    return (
      <ul>
        <li>
          <label>{data.name}</label>
          {this.renderReadOnlyJson('recipe', data)}
        </li>
      </ul>
    );
  }
});

export default connect(state => ({
  workflows: state.workflows
}))(Workflow);

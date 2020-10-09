import React from 'react';
import Ace from 'react-ace';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { listWorkflows } from '../../actions';
import config from '../../config';
import { setWindowEditorRef } from '../../utils/browser';
import Loading from '../LoadingIndicator/loading-indicator';

class Workflow extends React.Component {
  constructor () {
    super();
    this.state = { view: 'json' };
    this.get = this.get.bind(this);
    this.renderReadOnlyJson = this.renderReadOnlyJson.bind(this);
    this.renderJson = this.renderJson.bind(this);
  }

  componentDidUpdate (prevProps) {
    const { workflowName } = this.props.match.params;
    if (workflowName !== prevProps.match.params.workflowName) {
      this.get();
    }
  }

  componentDidMount () {
    this.get();
  }

  get (workflowName) {
    this.props.dispatch(listWorkflows());
  }

  renderReadOnlyJson (name, data) {
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
  }

  render () {
    const { workflows, match: { params: { workflowName } } } = this.props;
    const data = workflows.map[workflowName];
    if (!data) {
      return <Loading />;
    }
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>Workflow: {workflowName}</h1>
        </section>
        <section className='page__section'>
          <div className='tab--wrapper'>
            <button className={`button--tab ${this.state.view === 'json' ? 'button--active' : ''}`}
              onClick={() => this.state.view !== 'json' && this.setState({ view: 'json' })}>JSON View</button>
          </div>
          <div>
            {this.state.view === 'list' ? this.renderList(data) : this.renderJson(data)}
          </div>
        </section>
      </div>
    );
  }

  renderJson (data) {
    return (
      <ul>
        <li>
          <label>{data.name}</label>
          {this.renderReadOnlyJson('recipe', data)}
        </li>
      </ul>
    );
  }
}

Workflow.propTypes = {
  match: PropTypes.object,
  workflows: PropTypes.object,
  dispatch: PropTypes.func
};

export default withRouter(connect((state) => ({
  workflows: state.workflows
}))(Workflow));

'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { listRules } from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import List from '../Table/Table';
import { tableColumns, bulkActions } from '../../utils/table-config/rules';

class RulesOverview extends React.Component {
  constructor () {
    super();
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(listRules);
  }

  generateBulkActions () {
    const { rules } = this.props;
    return bulkActions(rules);
  }

  render () {
    const { list } = this.props.rules;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>Rule Overview</h1>
            {lastUpdated(queriedAt)}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>All Rules <span className='num--title'>{count ? ` ${tally(count)}` : 0}</span></h2>
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listRules}
            tableColumns={tableColumns}
            query={{}}
            sortIdx='timestamp'
            bulkActions={this.generateBulkActions()}
            rowId='name'
          />
        </section>
      </div>
    );
  }
}

RulesOverview.propTypes = {
  dispatch: PropTypes.func,
  rules: PropTypes.object
};

export default withRouter(connect(state => ({
  rules: state.rules
}))(RulesOverview));

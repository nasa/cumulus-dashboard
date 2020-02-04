'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import CollectionList from '../../components/Collections/list';
import AddCollection from '../../components/Collections/add';
import EditCollection from '../../components/Collections/edit';
import CollectionOverview from '../../components/Collections/overview';
import CollectionGranules from '../../components/Collections/granules';
import CollectionIngest from '../../components/Collections/ingest';
import CollectionLogs from '../../components/Collections/logs';

class Collections extends React.Component {
  constructor () {
    super();
    this.displayName = strings.collection;
  }

  render () {
    const { pathname } = this.props.location;
    const existingCollection = pathname !== '/collections/add';
    return (
      <div className='page__collections'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>{strings.collections}</h1>
            {existingCollection ? <Link className='button button--large button--white button__addcollections button__arrow button__animation' to='/collections/add'>{strings.add_a_collection}</Link> : null}
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            {existingCollection ? <Sidebar currentPath={pathname} params={this.props.queryParams} /> : null}
            <div className={existingCollection ? 'page__content--shortened' : 'page__content'}>
              <Switch>
                <Redirect exact from='/collections' to='/collections/all' />
                <Route path='/collections/all' component={CollectionList} />
                <Route path='/collections/add' component={AddCollection} />
                <Route path='/collections/edit/:name/:version' component={EditCollection} />
                <Route path='/collections/collection/:name/:version' component={CollectionOverview} />
                <Route path='/collections/collection/:name/:version/granules' component={CollectionGranules} />
                <Route path='/collections/collection/:name/:version/granules/completed' component={CollectionGranules} />
                <Route path='/collections/collection/:name/:version/granules/processing' component={CollectionGranules} />
                <Route path='/collections/collection/:name/:version/granules/failed' component={CollectionGranules} />
                <Redirect exact from='/collections/collection/:name/:version/granules/running'
                  to='/collections/collection/:name/:version/granules/processing' />
                <Route path='/collections/collection/:name/:version/definition' component={CollectionIngest} />
                <Route path='/collections/collection/:name/:version/logs' component={CollectionLogs} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Collections.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  queryParams: PropTypes.object
};

export default withRouter(withQueryParams()(connect(state => state)(Collections)));

import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { connect } from 'react-redux';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import { interval, getCount } from '../../actions';
import _config from '../../config';
import { strings } from '../locale';
import AllGranules from './list';
import GranuleOverview from './granule';
import GranulesOverview from './overview';

const { updateInterval } = _config;

class Granules extends React.Component {
  constructor () {
    super();
    this.query = this.query.bind(this);
    this.displayName = strings.granules;
  }

  componentDidMount () {
    this.cancelInterval = interval(() => this.query(), updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  query () {
    this.props.dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
  }

  render () {
    const count = get(this.props.stats, 'count.data.granules.count');
    return (
      <div className='page__granules'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>{strings.granules}</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
              count={count}
            />
            <div className='page__content--shortened'>
              <Switch>
                <Route exact path='/granules' component={GranulesOverview} />
                <Route path='/granules/granule/:granuleId' component={GranuleOverview} />
                <Route path='/granules/granule/:granuleId/completed' component={AllGranules} />
                <Route path='/granules/granule/:granuleId/processing' component={AllGranules} />
                <Route path='/granules/granule/:granuleId/failed' component={AllGranules} />
                <Redirect exact from='/granules/running' to='/granules/processing' />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Granules.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  stats: PropTypes.object
};

export default withRouter(connect(state => ({
  stats: state.stats
}))(Granules));

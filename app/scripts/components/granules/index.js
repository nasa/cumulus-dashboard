import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';
import { interval, getCount, getGranuleCSV } from '../../actions';
import { updateInterval } from '../../config';
import { strings } from '../locale';

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
    this.props.dispatch(getGranuleCSV());
  }

  newFunction (fileData) {
    console.log(fileData);
  }

  render () {
    const count = get(this.props.stats, 'count.data.granules.count');
    const { granuleCSV } = this.props;
    const { csvData } = granuleCSV;
    // console.log('data csv', dataCSV);
    return (
      <div className='page__granules'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>{strings.granules}</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
              count={count}
            />
            <div className='page__content--shortened'>
              <button onClick={this.newFunction(csvData)}>Click me</button>
              {this.props.children}
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
  stats: PropTypes.object,
  granuleCSV: PropTypes.object
};

export default connect(state => ({
  stats: state.stats,
  granuleCSV: state.granuleCSV
}))(Granules);

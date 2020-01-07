'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';

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
            {existingCollection ? <Sidebar currentPath={pathname} params={this.props.params} /> : null}
            <div className={existingCollection ? 'page__content--shortened' : 'page__content'}>
              {this.props.children}
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
  params: PropTypes.object
};

export default connect(state => state)(Collections);

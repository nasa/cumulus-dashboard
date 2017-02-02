'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var Granule = React.createClass({
  displayName: 'Granule',

  render: function () {
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>Granule Name</h1>
          <Link className='button button--small form-group__element--right button--disabled' to='/'>Delete</Link>
          <Link className='button button--small form-group__element--right' to='/'>Remove from CMR</Link>
          <Link className='button button--small form-group__element--right' to='/'>Reprocess</Link>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          <div className='page__section--subsection page__section__granule--progress'>
            <div className='progress-bar'>
              <span></span>
            </div>
            <ol>
              <li>Ingest</li>
              <li>Processing</li>
              <li>Pushed to CMR</li>
              <li>Archive</li>
            </ol>
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium'>Granule Overview</h2>
          </div>
          <dl className='metadata__granule__details'>
            <dt>Collection</dt>
            <dd>Collection Name</dd>
            <dt>Created</dt>
            <dd>Date Created</dd>
            <dt>Ingested</dt>
            <dd>Date Ingested</dd>
            <dt>Processed</dt>
            <dd>Date Processed</dd>
            <dt>Processed</dt>
            <dd>Date Name</dd>
            <dt>Metadata Pushed to CMR</dt>
            <dd>Date Created</dd>
            <dt>Archived</dt>
            <dd>Date Archived</dd>
          </dl>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Logs</h2>
            <form className="search__wrapper form-group__element form-group__element--right form-group__element--right--sm form-group__element--small" onSubmit="">
              <input className='search' type="search" />
              <span className="search__icon"></span>
            </form>
          </div>
          <div className="logs">
            <p>This is where the logs would go</p>
          </div>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(Granule);

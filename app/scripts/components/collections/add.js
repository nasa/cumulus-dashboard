'use strict';
import React from 'react';
import { connect } from 'react-redux';

var AddCollection = React.createClass({
  displayName: 'AddCollection',

  render: function () {
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Add a Collection</h1>
          <p className='description'>Instructions to add JSON in the below fields. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt, orci vel tincidunt ultricies, augue libero egestas felis, vel blandit arcu elit et nisl. Pellentesque luctus sapien eu augue sodales auctor.</p>
        </section>
        <form>
          <ul className='form__multistep'>
            <li>
              <label>Collection Name</label>
              <input type="text" name="collection_name" />
            </li>
            <li>
              <label>Granule Definition</label>
              <textarea rows="4" cols="50"></textarea>
            </li>
            <li>
              <label>Ingest</label>
              <textarea rows="4" cols="50"></textarea>
            </li>
            <li>
              <label>Recipe</label>
              <textarea rows="4" cols="50"></textarea>
            </li>
          </ul>
          <button className='button form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' type="button">Submit</button>
          <button className='button button--secondary form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__cancel' type="button">Cancel</button>
        </form>
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);

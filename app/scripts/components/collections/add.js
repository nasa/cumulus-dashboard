'use strict';
import React from 'react';
import { connect } from 'react-redux';

var AddCollection = React.createClass({
  displayName: 'AddCollection',

  render: function () {
    return (
      <div className='page__component'>
        <h1>Add a Collection</h1>
        <p>Instructions to add JSON in the below fields. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt, orci vel tincidunt ultricies, augue libero egestas felis, vel blandit arcu elit et nisl. Pellentesque luctus sapien eu augue sodales auctor.</p>
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
          <button className='button' type="button">Submit</button>
          <button className='button button--secondary' type="button">Cancel</button>
        </form>
      </div>
    );
  }
});

export default connect(state => state)(AddCollection);

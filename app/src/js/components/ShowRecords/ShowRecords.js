import React from 'react';
import Table from '../SortableTable/SortableTable';
import PropTypes from 'prop-types'

class ShowRecords extends React.Component {
  constructor(props){
    super(props);
  }

  render () {
    //const recordsCount = ();
    
        return (
        <div className="ShowRecords">
           <span>Showing<span className="data-record">
           
          </span> Records</span>
        </div>
        );
  }
}

ShowRecords.propTypes = {
  data: PropTypes.array,
};

export default ShowRecords;
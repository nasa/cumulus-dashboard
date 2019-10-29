import React from 'react';
import Pagination from '../Pagination/Pagination';
import ShowRecords from '../ShowRecords/ShowRecords';
import PropTypes from 'prop-types';

class TableOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="options">
          <ul className="form__options">
            <li className="records">
              {/*<ShowRecords/>*/}
            </li>
            <li className="pager">
              <Pagination
                count={this.props.count}
                limit={this.props.limit}
                page={this.props.page}
                onNewPage={this.props.queryNewPage}
                showPages={this.props.showPages}
              />
            </li>
            <li className="amount">{/*Show <input type="text" value={this.props.page}></input>per table*/}</li>
          </ul>
      </div>

    );
  }
}

// TableOptions.propTypes = {
//   page: PropTypes.number,
//   limit: PropTypes.number,
//   count: PropTypes.number,
//   onNewPage: PropTypes.func,
//   showPages: PropTypes.boolean,
// };

export default TableOptions
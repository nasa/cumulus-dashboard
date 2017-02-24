'use strict';
import React from 'react';

const Pagination = React.createClass({
  displayName: 'Pagination',

  propTypes: {
    page: React.PropTypes.number,
    limit: React.PropTypes.number,
    count: React.PropTypes.number,
    onNewPage: React.PropTypes.func
  },

  onPageClick: function (e) {
    e.preventDefault();
    const newPage = +e.currentTarget.getAttribute('data-value');
    this.setPage(newPage);
  },

  setPage: function (newPage) {
    const { page, limit, count } = this.props;
    if (+page !== newPage && newPage > 1 && newPage < Math.ceil(count / limit)) {
      this.props.onNewPage(newPage);
    }
  },

  render: function () {
    const { page, limit, count } = this.props;
    let paginatedPages = 0;
    let currentPage = 1;

    if (!isNaN(count) && !isNaN(limit) && !isNaN(page)) {
      paginatedPages = Math.ceil(count / limit);
      currentPage = +page;
    }

    const pages = [];
    for (let i = 1; i <= paginatedPages; ++i) { pages.push(i); }

    return (
      <div className='pagination'>
        {paginatedPages ? (
          <ol>
            <li><a className='previous' href="#" data-value={currentPage - 1} onClick={this.onPageClick}>Previous</a></li>
            {pages.map(d => (
              <li key={d} className={d === currentPage ? 'pagination__link--active' : ''}>
                <a href='#' data-value={d} onClick={this.onPageClick}>{d}</a>
              </li>
            ))}
            <li><a className='next' href="#" data-value={currentPage + 1} onClick={this.onPageClick}>Next</a></li>
          </ol>
        ) : ''}
      </div>
    );
  }
});

export default Pagination;

'use strict';
import React from 'react';
import Paginator from 'paginator';
import PropTypes from 'prop-types';

const noop = (e) => e.preventDefault();
const disabled = ' pagination__link--disabled';

class Pagination extends React.Component {
  constructor () {
    super();
    this.onPageClick = this.onPageClick.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  onPageClick (e) {
    e.preventDefault();
    const newPage = +e.currentTarget.getAttribute('data-value');
    this.setPage(newPage);
  }

  setPage (newPage) {
    const { page, limit, count } = this.props;
    if (+page !== newPage && newPage >= 1 && newPage <= Math.ceil(count / limit)) {
      this.props.onNewPage(newPage);
    }
  }

  render () {
    const { page, limit, count } = this.props;
    if (!isNaN(count) && !isNaN(limit) && !isNaN(page)) {
      const currentPage = +page;
      const paginator = new Paginator(limit, 7);
      const meta = paginator.build(count, currentPage);
      const pages = [];
      for (let i = meta.first_page; i <= meta.last_page; ++i) { pages.push(i); }
      const jumpToFirst = meta.first_page > 1 && <li><a href='#' data-value={1} onClick={this.onPageClick}>1</a> ... </li>;
      const jumpToLast = meta.last_page < meta.total_pages &&
        <li> ... <a href='#' data-value={meta.total_pages} onClick={this.onPageClick}>{meta.total_pages}</a> </li>;

      return (
        <div className='pagination'>
          <ol>
            <li><a
              className={'previous' + (meta.has_previous_page ? '' : disabled)}
              data-value={meta.previous_page}
              onClick={(meta.has_previous_page ? this.onPageClick : noop)}>Previous</a></li>
            {jumpToFirst}
            {pages.map(d => (
              <li key={d} className={d === currentPage ? 'pagination__link--active' : ''}>
                <a href='#' data-value={d} onClick={this.onPageClick}>{d}</a>
              </li>
            ))}
            {jumpToLast}
            <li><a
              className={'next' + (meta.has_next_page ? '' : disabled)}
              data-value={meta.next_page}
              onClick={(meta.has_next_page ? this.onPageClick : noop)}>Next</a></li>
          </ol>
        </div>
      );
    } else return <div></div>;
  }
}

Pagination.propTypes = {
  page: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number,
  onNewPage: PropTypes.func
};

export default Pagination;

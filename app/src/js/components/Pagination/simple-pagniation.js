import React from 'react';
import PropTypes from 'prop-types';

/**
 * SimplePagination
 * @description Component for rendering pagination for tables using the react-table usePagination hook
 */

const disabled = ' pagination__link--disabled';

const SimplePagination = ({
  canPreviousPage,
  canNextPage,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  pageOptions,
  pageIndex
}) => {
  const currentPage = pageIndex + 1;
  return (
    <div className='pagination'>
      <ol>
        <li>
          <a className={`previous ${canPreviousPage ? '' : disabled}`}
            data-value={currentPage - 1}
            onClick={() => previousPage()}
          >Previous</a>
        </li>
        {pageOptions.map(page => {
          const pageNumber = page + 1;
          return (
            <li key={page} className={page === pageIndex ? 'pagination__link--active' : ''}>
              <a data-value={pageNumber} onClick={() => gotoPage(page)}>{pageNumber}</a>
            </li>
          );
        })}
        <li>
          <a className={`next ${canNextPage ? '' : disabled}`}
            data-value={currentPage + 1}
            onClick={() => nextPage()}
          >Next</a>
        </li>
      </ol>
    </div>
  );
};

SimplePagination.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  pageCount: PropTypes.number,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  pageOptions: PropTypes.array,
  pageIndex: PropTypes.number
};

export default SimplePagination;

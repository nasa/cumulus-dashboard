import React from 'react';
import PropTypes from 'prop-types';

/**
 * SimplePagination
 * @description Component for rendering pagination for tables using the react-table usePagination hook
 */

const disabled = ' pagination__link--disabled';
const VISIBLE_PAGES = 7;
const PAGE_RANGE = Math.floor(VISIBLE_PAGES / 2);

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
  let hiddenLowNumbers = 0;
  let hiddenHighNumbers = 0;

  return (
    <div className='pagination simple-pagination'>
      <ol>
        <li>
          <a className={`previous ${canPreviousPage ? '' : disabled}`}
            data-value={currentPage - 1}
            onClick={() => previousPage()}
          >Previous</a>
        </li>
        {pageOptions.map(page => {
          const firstPage = 1;
          const pageNumber = page + 1;
          const isNotFirstPage = pageNumber !== firstPage;
          const isNotLastPage = pageNumber !== pageCount;
          const isLessThanCurrentPage = pageNumber < currentPage;
          const isGreaterThanCurrentPage = pageNumber > currentPage;
          /**
           * 'buffers' for cases when we want to display 7 pages
           * but the current page has fewer than 3 additional pages on one side or another
           * ie: instead of 1 <2> 3 4 5 ... 25, it allows us to show 1 <2> 3 4 5 6 7 8 ... 25
          */
          const isNotLowerBuffer = pageNumber - firstPage < VISIBLE_PAGES;
          const isNotHigherBuffer = pageCount - pageNumber < VISIBLE_PAGES;
          const isOutsidePageRange = Math.abs(currentPage - pageNumber) > PAGE_RANGE;
          if (isNotFirstPage && isLessThanCurrentPage && isNotLowerBuffer && isOutsidePageRange) {
            hiddenLowNumbers++;
            return <React.Fragment key={page}>{hiddenLowNumbers === 1 && <li>...</li>}</React.Fragment>;
          }
          if (isNotLastPage && isGreaterThanCurrentPage && isNotHigherBuffer && isOutsidePageRange) {
            hiddenHighNumbers++;
            return <React.Fragment key={page}>{hiddenHighNumbers === 1 && <li>...</li>}</React.Fragment>;
          }
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

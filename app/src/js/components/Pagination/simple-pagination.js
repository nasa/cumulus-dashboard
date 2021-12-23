import React from 'react';
import PropTypes from 'prop-types';
import Paginator from 'paginator';

/**
 * SimplePagination
 * @description Component for rendering pagination for tables using the react-table usePagination hook
 */

const disabled = ' pagination__link--disabled';
const VISIBLE_PAGES = 7;
const PAGE_LIMIT = 10;

const SimplePagination = ({
  canNextPage,
  canPreviousPage,
  dataCount,
  gotoPage,
  nextPage,
  pageCount,
  pageIndex,
  pageOptions,
  previousPage,
}) => {
  const currentPage = pageIndex + 1;

  const paginator = new Paginator(PAGE_LIMIT, VISIBLE_PAGES);
  const pageMeta = paginator.build(dataCount, currentPage);

  return (
    <div className="pagination simple-pagination">
      <ol>
        <li>
          <button
            className={`previous ${canPreviousPage ? '' : disabled}`}
            data-value={currentPage - 1}
            onClick={() => previousPage()}
          >
            Previous
          </button>
        </li>
        {pageOptions.map((page) => {
          const firstPage = 1;
          const pageNumber = page + 1;
          const isNotFirstPage = pageNumber !== firstPage;
          const isNotLastPage = pageNumber !== pageCount;
          const isHiddenPage =
            pageNumber < pageMeta.first_page || pageNumber > pageMeta.last_page;
          const shouldHaveEllipses =
            isHiddenPage &&
            (pageNumber === firstPage + 1 || pageNumber === pageCount - 1);

          if (isNotFirstPage && isNotLastPage && isHiddenPage) {
            if (shouldHaveEllipses) {
              return <li key={page}>...</li>;
            }
            return null;
          }

          return (
            <li
              key={page}
              className={page === pageIndex ? 'pagination__link--active' : ''}
            >
              <button data-value={pageNumber} onClick={() => gotoPage(page)}>
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li>
          <button
            className={`next ${canNextPage ? '' : disabled}`}
            data-value={currentPage + 1}
            onClick={() => nextPage()}
          >
            Next
          </button>
        </li>
      </ol>
    </div>
  );
};

SimplePagination.propTypes = {
  canNextPage: PropTypes.bool,
  canPreviousPage: PropTypes.bool,
  dataCount: PropTypes.number,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.array,
  previousPage: PropTypes.func,
};

export default SimplePagination;

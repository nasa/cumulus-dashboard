import React from 'react';
import Paginator from 'paginator';
import PropTypes from 'prop-types';
import Dropdown from '../DropDown/dropdown';

const noop = (e) => e.preventDefault();
const disabled = ' pagination__link--disabled';

const Pagination = ({
  action,
  clear,
  count,
  displayAsInput = false,
  limit,
  onNewPage,
  page,
}) => {
  function onPageClick(e) {
    e.preventDefault();
    const newPage = +e.currentTarget.getAttribute('data-value');
    setPage(newPage);
  }

  function setPage(newPage, callback) {
    if (
      +page !== newPage &&
      newPage >= 1 &&
      newPage <= Math.ceil(count / limit)
    ) {
      onNewPage(newPage);
      if (typeof callback === 'function') callback();
    }
  }

  function handleDropdownChange({ selections, updateSelection }) {
    if (selections && selections.length > 0) {
      const { id: selectedValue } = selections[0];
      setPage(selectedValue, updateSelection);
    } else {
      updateSelection();
    }
  }

  function renderOptions(totalPages) {
    const pages = [];

    for (let p = 1; p <= totalPages; p++) {
      pages.push(
        {
          id: p,
          label: p.toString(),
        }
      );
    }

    return pages;
  }

  if (Number.isNaN(count) && Number.isNaN(limit) && Number.isNaN(page)) return null;

  const currentPage = +page;
  const paginator = new Paginator(limit, 7);
  const meta = paginator.build(count, currentPage);
  const pages = [];
  const hasTotalPages = !!meta.total_pages;
  const renderInput = displayAsInput && hasTotalPages;

  for (let i = meta.first_page; i <= meta.last_page; ++i) {
    pages.push(i);
  }
  const jumpToFirst = meta.first_page > 1 && (
    <li>
      <button data-value={1} onClick={onPageClick}>
        1
      </button>{' '}
      ...{' '}
    </li>
  );
  const jumpToLast = meta.last_page < meta.total_pages && (
    <li>
      {' '}
      ...{' '}
      <button data-value={meta.total_pages} onClick={onPageClick}>
        {meta.total_pages}
      </button>{' '}
    </li>
  );

  return (
    <div className={`pagination ${displayAsInput ? 'pagination-dropdown' : 'pagination-list'}`}>
      <ol>
        <li>
          <button
            className={`previous${meta.has_previous_page ? '' : disabled}`}
            data-value={meta.previous_page}
            onClick={meta.has_previous_page ? onPageClick : noop}
          >
            Previous
          </button>
        </li>
        {renderInput && (
          <Dropdown
            action={action}
            clear={clear}
            clearButton={false}
            inputProps={{ 'aria-label': 'Page' }}
            label={<span className="sr-only">Page</span>}
            onChange={handleDropdownChange}
            options={renderOptions(meta.total_pages)}
            paramKey="page"
            clearOnClick={true}
            selectedValues={[
              {
                id: currentPage,
                label: `${currentPage}`
              }]}
          />
        )}
        {!displayAsInput && (
          <>
            {jumpToFirst}
            {pages.map((d) => (
              <li
                key={d}
                className={d === currentPage ? 'pagination__link--active' : ''}
              >
                <button data-value={d} onClick={onPageClick}>
                  {d}
                </button>
              </li>
            ))}
            {jumpToLast}
          </>
        )}
        <li>
          <button
            className={`next${meta.has_next_page ? '' : disabled}`}
            data-value={meta.next_page}
            onClick={meta.has_next_page ? onPageClick : noop}
          >
            Next
          </button>
        </li>
      </ol>
    </div>
  );
};

Pagination.propTypes = {
  action: PropTypes.func,
  clear: PropTypes.func,
  count: PropTypes.number,
  displayAsInput: PropTypes.bool,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onNewPage: PropTypes.func,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Pagination;

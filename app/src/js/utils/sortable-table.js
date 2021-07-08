import React, { useEffect, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';

export const getColumnWidth = (rows, accessor, headerText, originalWidth) => {
  const maxWidth = 400;
  const magicSpacing = 10;
  const cellLength = Math.max(
    ...rows.map(
      (row) => (`${row.values[accessor]}` || '').length * magicSpacing
    ),
    headerText.length * magicSpacing,
    originalWidth
  );
  return Math.min(maxWidth, cellLength);
};

/**
 * IndeterminateCheckbox
 * @description Component for rendering the header and column checkboxs when canSelect is true
 * Taken from react-table examples
 */
export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, title, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        aria-label={title}
        title={title}
        {...rest}
      />
    );
  }
);

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any,
  onChange: PropTypes.func,
  title: PropTypes.string,
};

export function checkInView(container, element, partial) {
  if (!container || !element) {
    return true;
  }

  // Get container properties
  const cLeft = container.scrollLeft;
  const cRight = cLeft + container.clientWidth;

  // Get element properties
  const eLeft = element.offsetLeft - container.offsetLeft;
  const eRight = eLeft + element.clientWidth;

  // Check if in view
  const isTotal = eLeft >= cLeft && eRight <= cRight;
  const isPartial =
    partial &&
    ((eLeft < cLeft && eRight > cLeft) || (eRight > cRight && eLeft < cRight));

  // Return outcome
  return isTotal || isPartial;
}

export const sortData = ({
  allColumns,
  availableSortBy,
  orderByFn,
  rows,
  sortedFlatRows,
}) => {
  // Use the orderByFn to compose multiple sortBy's together.
  // This will also perform a stable sorting using the row index
  // if needed.
  const sortedData = orderByFn(
    rows,
    availableSortBy.map((sort) => {
      // Support custom sorting methods for each column
      const column = allColumns.find((d) => d.id === sort.id);

      if (!column) {
        throw new Error(
          `React-Table: Could not find a column with id: ${sort.id} while sorting`
        );
      }

      const { sortMethod } = column;
      // Return the correct sortFn.
      // This function should always return in ascending order
      return (a, b) => sortMethod(a, b, sort.id, sort.desc);
    }),
    // Map the directions
    availableSortBy.map((sort) => {
      // Detect and use the sortInverted option
      const column = allColumns.find((d) => d.id === sort.id);

      if (column && column.sortInverted) {
        return sort.desc;
      }

      return !sort.desc;
    })
  );

  // If there are sub-rows, sort them
  sortedData.forEach((row) => {
    sortedFlatRows.push(row);
    if (!row.subRows || row.subRows.length === 0) {
      return;
    }
    row.subRows = sortData(row.subRows);
  });

  return sortedData;
};

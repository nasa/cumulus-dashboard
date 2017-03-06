'use strict';

export const selectAll = function () {
  let selectAllBox = document.querySelector('.form-select__all');
  let allTheBoxes = document.querySelectorAll('.form-checkbox');

  if (selectAllBox.checked) {
    allTheBoxes.forEach((d) => {
      d.checked = true;
    });
  } else {
    allTheBoxes.forEach((d) => {
      d.checked = false;
    });
  }
};

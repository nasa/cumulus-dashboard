import colorVariables from '../../css/utils/variables/_colors.scss';
import shadowVariables from '../../css/utils/variables/_shadows.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

const { borderGrey, hoverBlue, oceanBlue, white } = colorVariables;
const { shadowDefault } = shadowVariables;

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <div className="dropdown__indicator" />
  </components.DropdownIndicator>
);

const border = `1px solid ${borderGrey}`;
const borderRadius = '0.5em';
const boxShadow = shadowDefault;

const customStyles = {
  control: (base) => ({
    ...base,
    border,
    borderRadius,
    boxShadow,
  }),
  menu: (base) => ({
    ...base,
    width: 100,
    margin: 0,
    zIndex: 9999,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    backgroundColor: oceanBlue,
    borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
    boxShadow,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  option: (base, state) => {
    const { isFocused, isSelected } = state;
    let styles = {};

    if (isFocused) {
      styles = {
        backgroundColor: hoverBlue,
      };
    }

    if (isSelected) {
      styles = {
        backgroundColor: oceanBlue,
        color: white,
      };
    }

    return {
      ...base,
      ...styles,
    };
  },
};

export default {customStyles, DropdownIndicator};

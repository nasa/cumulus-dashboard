import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Hint, Input } from 'react-bootstrap-typeahead';

export function renderTypeaheadInput({ inputRef, referenceElementRef, ...inputProps }) {
  return (
    <Hint
      // Selects the hint when the user hits the 'enter' key.
      shouldSelect={(shouldSelect, e) => e.keyCode === 13 || shouldSelect}
    >
      <Input
        {...inputProps}
        ref={(input) => {
          inputRef(input);
          referenceElementRef(input);
        }}
      />
    </Hint>
  );
}

renderTypeaheadInput.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
  referenceElementRef: PropTypes.func,
};

export function renderSearchInput({ inputRef, referenceElementRef, ...inputProps }) {
  return (
    <>
      <Input
        {...inputProps}
        ref={(input) => {
          inputRef(input);
          referenceElementRef(input);
        }}
      />
      <span className='search__icon'/>
    </>
  );
}

renderSearchInput.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
  referenceElementRef: PropTypes.func,
};

export function renderTypeaheadMenu(results, menuProps) {
  const customOption = results.find((result) => result.customOption);
  return (
    <Menu {...menuProps} className="autocomplete__menu">
      {customOption && (
        <MenuItem
          className="autocomplete__select"
          key={0}
          option={customOption}
          position={0}
        >
          {customOption.label}
        </MenuItem>
      )}
      {results.map((result, index) => {
        if (result.customOption) return null;
        const position = customOption ? index + 1 : index;
        return (
          <MenuItem
            className="autocomplete__select"
            key={position}
            option={result}
            position={position}
          >
            {result.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

export function renderSearchMenu(results, menuProps, labelKey) {
  return (
    <Menu {...menuProps} className="autocomplete__menu">
      {results.map((result, index) => (
        <MenuItem
          className="autocomplete__select"
          key={index}
          option={result}
          position={index}
        >
          {result[labelKey]}
        </MenuItem>
      ))}
    </Menu>
  );
}

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import Ace from 'react-ace';
import config from '../../config';
import { setWindowEditorRef } from '../../utils/browser';
import ErrorReport from '../Errors/report';

const minLinesDefault = 8;
const maxLinesDefault = 18;

const TextAreaForm = ({
  label,
  value,
  id,
  error,
  mode = 'json',
  onChange,
  minLines = minLinesDefault,
  maxLines = maxLinesDefault
}) => {
  const handleChange = (newValue) => {
    onChange(id, newValue);
  };

  return (
    <div className='form__textarea'>
      <label>{label}
        <ErrorReport report={error} />
        <Ace
          editorProps={{ $blockScrolling: Infinity }}
          mode={mode}
          theme={config.editorTheme}
          onChange={handleChange}
          name={id}
          value={value}
          width='auto'
          tabSize={config.tabSize}
          showPrintMargin={false}
          minLines={minLines}
          maxLines={maxLines}
          wrapEnabled={true}
          ref={setWindowEditorRef}
        />
      </label>
    </div>
  );
};
TextAreaForm.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  minLines: PropTypes.number,
  maxLines: PropTypes.number
};
export default connect((state) => state)(TextAreaForm);

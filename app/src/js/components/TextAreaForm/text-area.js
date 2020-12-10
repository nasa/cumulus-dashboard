import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import config from '../../config';
import { setWindowEditorRef } from '../../utils/browser';
import ErrorReport from '../Errors/report';

const minLinesDefault = 8;
const maxLinesDefault = 18;

class TextAreaForm extends React.Component {
  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      Ace: null
    };
  }

  componentDidMount() {
    if (window) {
      import('react-ace').then((AceEditor) => {
        this.setState({ Ace: AceEditor.default });
      });
    }
  }

  onChange (newValue, event) {
    this.props.onChange(this.props.id, newValue);
  }

  render () {
    const {
      label,
      value,
      id,
      error,
      mode
    } = this.props;
    const { Ace } = this.state;

    const minLines = this.props.minLines || minLinesDefault;
    const maxLines = this.props.maxLines || maxLinesDefault;

    return (
      <div className='form__textarea'>
        <label>{label}
          <ErrorReport report={error} />
          {Ace && <Ace
            editorProps={{ $blockScrolling: Infinity }}
            mode={mode}
            theme={config.editorTheme}
            onChange={this.onChange}
            name={id}
            value={value}
            width='auto'
            tabSize={config.tabSize}
            showPrintMargin={false}
            minLines={minLines}
            maxLines={maxLines}
            wrapEnabled={true}
            ref={setWindowEditorRef}
            setOptions={{ useWorker: false }}
          />}
        </label>
      </div>
    );
  }
}

TextAreaForm.propTypes = {
  label: PropTypes.any,
  value: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.any,
  mode: PropTypes.string,
  onChange: PropTypes.func,
  minLines: PropTypes.number,
  maxLines: PropTypes.number
};

export default connect((state) => state)(TextAreaForm);

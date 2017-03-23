'use strict';
import React from 'react';
import { get } from 'object-path';
import { Form, formTypes } from './';
import Loading from '../app/loading-indicator';
import { isText, isNumber, isArray, arrayWithLength } from '../../utils/validate';
import t from '../../utils/strings';
const { errors } = t;

export const traverseSchema = function (schema, fn, path) {
  for (let property in schema.properties) {
    const meta = schema.properties[property];
    if (meta.type === 'object' && meta.hasOwnProperty('properties')) {
      const nextPath = path ? path + '.' + property : property;
      traverseSchema(meta, fn, nextPath);
    } else {
      fn(property, meta, schema, path);
    }
  }
};

// recursively scan a schema object and create a form config from it.
// returns a flattened representation of the schema.
export const createFormConfig = function (data, schema) {
  data = data || {};
  const fields = [];
  traverseSchema(schema, function (property, meta, schemaProperty, path) {
    // determine the label
    const required = Array.isArray(schemaProperty.required) &&
      schemaProperty.required.indexOf(property) >= 0;
    var label = [<span className='label__name'>{meta.title || property}</span>];
    if (path) label.unshift(<span className='label__path'>{path + ' - '}</span>);
    if (meta.description) label.push(<span className='label__description'> ({meta.description})</span>);
    if (required) label.push(<span className='label__required'> *required</span>);

    // create an object-path-ready accessor string
    const accessor = path ? path + '.' + property : property;
    const value = get(data, accessor) || get(meta, 'default');
    const config = { value, label, schemaProperty: accessor };

    // dropdowns have type set to string, but have an enum prop.
    // use enum as the type instead of string.
    const type = Array.isArray(meta['enum']) ? 'enum'
      : meta.hasOwnProperty('patternProperties') ? 'pattern' : meta.type;
    switch (type) {
      case 'pattern':
        // pattern fields are an abstraction on arrays of objects.
        // each item in the array will be a grouped set of field inputs.

        // get the first pattern property, which should be a regex that
        // validates _key.
        const { patternProperties } = meta;
        const pattern = Object.keys(patternProperties)[0];

        // attach the schema object
        config.fieldSet = patternProperties[pattern];
        config.type = formTypes.subform;
        fields.push(config);
        break;
      case 'enum':
        // pass the enum fields as options
        config.options = meta.enum;
        fields.push(dropdown(config, property, (required && isText)));
        break;
      case 'array':
        // some array types have a minItems property
        let validate = !required ? null
          : (meta.minItems && isNaN(meta.minItems))
            ? arrayWithLength(+meta.minItems) : isArray;
        fields.push(list(config, property, validate));
        break;
      case 'string':
        fields.push(textfield(config, property, (required && isText)));
        break;
      case 'number':
        fields.push(textfield(config, property, (required && isNumber)));
        break;
      default: return;
    }
  });
  return fields;
};

function textfield (config, property, validate) {
  config.type = formTypes.text;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

function dropdown (config, property, validate) {
  config.type = formTypes.dropdown;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

function list (config, property, validate) {
  config.type = formTypes.list;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

export const Schema = React.createClass({
  propTypes: {
    schema: React.PropTypes.object,
    data: React.PropTypes.object,
    pk: React.PropTypes.string,
    onSubmit: React.PropTypes.func
  },

  getInitialState: function () {
    return { fields: null };
  },

  componentWillMount: function () {
    const { schema, data } = this.props;
    this.setState({ fields: createFormConfig(data, schema) });
  },

  componentWillReceiveProps: function (newProps) {
    const { props } = this;
    const { schema, data } = newProps;
    if (props.pk !== newProps.pk) {
      this.setState({ fields: createFormConfig(data, schema) });
    }
  },

  render: function () {
    const { fields } = this.state;
    if (!fields) return <Loading />;
    return (
      <div>
        <Form inputMeta={fields} submit={this.props.onSubmit}/>
      </div>
    );
  }
});
export default Schema;

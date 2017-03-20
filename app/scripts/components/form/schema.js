'use strict';
import React from 'react';
import { get } from 'object-path';
import { Form, formTypes } from './';
import Loading from '../app/loading-indicator';
import { isText, isNumber, isArray, arrayWithLength } from '../../utils/validate';
import t from '../../utils/strings';
const { errors } = t;
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

  componentWillReceiveProps: function (newProps) {
    const { props } = this;
    const { schema, data } = newProps;
    if ((props.pk !== newProps.pk) ||
        ((!props.schema || !props.data) && schema && data)) {
      this.setState({ fields: this.createFormConfig(data, schema) });
    }
  },

  textfield: function (config, property, validate) {
    config.type = formTypes.text;
    config.validate = validate;
    config.error = validate && get(errors, property, errors.required);
    return config;
  },

  dropdown: function (config, property, validate) {
    config.type = formTypes.dropdown;
    config.validate = validate;
    config.error = validate && get(errors, property, errors.required);
    return config;
  },

  list: function (config, property, validate) {
    config.type = formTypes.list;
    config.validate = validate;
    config.error = validate && get(errors, property, errors.required);
    return config;
  },

  onSubmit: function (payload) {
    console.log(payload);
  },

  traverseSchema: function (schema, fn, path) {
    for (let property in schema.properties) {
      const meta = schema.properties[property];
      if (meta.type === 'object' && meta.hasOwnProperty('properties')) {
        const nextPath = path ? path + '.' + property : property;
        this.traverseSchema(meta, fn, nextPath);
      } else {
        fn(property, meta, schema, path);
      }
    }
  },

  // recursively scan a schema object and create a form config from it.
  // returns a flattened representation of the schema.
  createFormConfig: function (data, schema) {
    data = data || {};
    const fields = [];
    this.traverseSchema(schema, function (property, meta, schemaProperty, path) {
      // determine the label
      const required = Array.isArray(schemaProperty.required) &&
        schemaProperty.required.indexOf(property) >= 0;
      var label = meta.title || property;
      if (meta.description) label += ` (${meta.description})`;
      if (required) label += ' *required';

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

          // get any pre-existing objects, assigning the object key as _key.
          // this becomes the nested object's "name".
          var values = value ? Object.keys(value).map(key => Object.assign({_key: key}, value[key])) : [{}];
          if (!values.length) values = [{}];

          // get the first pattern property, which should be a regex that
          // validates _key.
          const { patternProperties } = meta;
          const pattern = Object.keys(patternProperties)[0];

          // attach the fields
          config.fields = values.map(item => ({
            name: item._key,
            forms: this.createFormConfig(item, patternProperties[pattern])
          }));
          config.type = formTypes.subform;
          fields.push(config);
          break;
        case 'enum':
          // pass the enum fields as options
          config.options = meta.enum;
          fields.push(this.dropdown(config, property, (required && isText)));
          break;
        case 'array':
          // some array types have a minItems property
          let validate = !required ? null
            : (meta.minItems && isNaN(meta.minItems))
              ? arrayWithLength(+meta.minItems) : isArray;
          fields.push(this.list(config, property, validate));
          break;
        case 'string':
          fields.push(this.textfield(config, property, (required && isText)));
          break;
        case 'number':
          fields.push(this.textfield(config, property, (required && isNumber)));
          break;
        default: return;
      }
    }.bind(this));
    return fields;
  },

  render: function () {
    const { fields } = this.state;
    if (!fields) return <Loading />;
    return (
      <div>
        <Form inputMeta={fields} submit={this.onSubmit}/>
      </div>
    );
  }
});
export default Schema;

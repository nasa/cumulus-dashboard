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
      if (meta.type === 'object') {
        const nextPath = path ? path + '.' + property : property;
        this.traverseSchema(meta, fn, nextPath);
      } else {
        fn(property, meta, schema, path);
      }
    }
  },

  createFormConfig: function (data, schema) {
    const fields = [];
    this.traverseSchema(schema, function (property, meta, schemaProperty, path) {
      const required = Array.isArray(schemaProperty.required) &&
        schemaProperty.required.indexOf(property) >= 0;
      var label = meta.title || property;
      if (meta.description) label += ` (${meta.description})`;
      if (required) label += ' *required';

      const accessor = path ? path + '.' + property : property;
      const value = get(data, accessor);
      const config = { value, label, schemaProperty: accessor };

      const type = Array.isArray(meta['enum']) ? 'enum' : meta.type;
      switch (type) {
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


  // recursively scan a schema object and create a form config from it.
  // returns a flattened representation of the schema.
  traverseObject: function (data, object, path) {
    let requiredProperties = object.required || [];
    let fields = [];

    // traverse each property in this object
    for (let property in object.properties) {
      // the schema field
      const schema = object.properties[property];

      // dropdowns have type set to string, but have an enum prop.
      // use enum as the type instead of string.
      const type = Array.isArray(schema['enum']) ? 'enum' : schema.type;

      // create an object-path-ready accessor string
      const accessor = path ? path + '.' + property : property;
      if (type === 'object') {
        // recursively traverse if it's another object
        fields = fields.concat(this.traverseObject(data, schema, accessor));
      } else {
        // determine the label
        var label = schema.title || property;
        const required = requiredProperties.indexOf(property) >= 0;
        if (schema.description) label += ` (${schema.description})`;
        if (required) label += ' *required';

        // create the form configuration
        const value = get(data, accessor);
        var config = { value, label, schemaProperty: accessor };
        switch (type) {
          case 'enum':
            // pass the enum fields as options
            config.options = schema.enum;
            fields.push(this.dropdown(config, property, (required && isText)));
            break;
          case 'array':
            // some array types have a minItems property
            let validate = !required ? null
              : (schema.minItems && isNaN(schema.minItems))
                ? arrayWithLength(+schema.minItems) : isArray;
            fields.push(this.list(config, property, validate));
            break;
          case 'string':
            fields.push(this.textfield(config, property, (required && isText)));
            break;
          case 'number':
            fields.push(this.textfield(config, property, (required && isNumber)));
            break;
          default: continue;
        }
      }
    }
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

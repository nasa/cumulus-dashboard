'use strict';
import React from 'react';
import { get } from 'object-path';
import { Form, formTypes } from './';
import Loading from '../app/loading-indicator';
import { isText, isNumber, isArray } from '../../utils/validate';
import t from '../../utils/strings';
const { errors } = t;
export const Schema = React.createClass({

  propTypes: {
    schema: React.PropTypes.object,
    data: React.PropTypes.object,
    pk: React.PropTypes.string
  },

  getInitialState: function () {
    return { fields: null };
  },

  componentWillReceiveProps: function (newProps) {
    const { props } = this;
    const { schema, data } = newProps;
    if ((props.pk !== newProps.pk) ||
        ((!props.schema || !props.data) && schema && data)) {
      this.setState({ fields: this.traverseObject(data, schema) });
    }
  },

  textfield: function (value, schema, property, schemaProperty, validate) {
    let label = schema.title || property;
    if (validate) label += ' (required)';
    return {
      value, schemaProperty, label, validate,
      type: formTypes.text,
      error: validate && get(errors, property, errors.required)
    };
  },

  dropdown: function (value, schema, property, schemaProperty, validate) {
    let label = schema.title || property;
    if (validate) label += ' (required)';
    return {
      value, schemaProperty, label, validate,
      options: schema['enum'],
      type: formTypes.dropdown,
      error: validate && get(errors, property, errors.required)
    };
  },

  list: function (value, schema, property, schemaProperty, validate) {
    let label = schema.title || property;
    if (validate) label += ' (required)';
    return {
      value, schemaProperty, label, validate,
      type: formTypes.list,
      error: validate && get(errors, property, errors.required)
    };
  },

  // recursively scan a schema object and create a form config from it.
  // returns a flattened representation of the schema.
  traverseObject: function (data, object, path) {
    let requiredProperties = object.required || [];
    let fields = [];
    for (let property in object.properties) {
      const accessor = path ? path + '.' + property : property;
      const value = get(data, accessor);
      const schema = object.properties[property];
      const required = requiredProperties.indexOf(property) >= 0;
      const type = Array.isArray(schema['enum']) ? 'enum' : schema.type;
      switch (type) {
        case 'object':
          fields = fields.concat(this.traverseObject(data, schema, accessor));
          break;
        case 'enum':
          fields.push(this.dropdown(
            value, schema, property, accessor, (required && isText)));
          break;
        case 'array':
          fields.push(this.list(
            value, schema, property, accessor, (required && isArray)));
          break;
        case 'string':
          fields.push(this.textfield(
            value, schema, property, accessor, (required && isText)));
          break;
        case 'number':
          fields.push(this.textfield(
            value, schema, property, accessor, (required && isNumber)));
          break;
        default: continue;
      }
    }
    return fields;
  },

  render: function () {
    const { fields } = this.state;
    if (!fields) return <Loading />;
    return (
      <div>
        <Form inputMeta={fields} />
      </div>
    );
  }
});
export default Schema;

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
    schema: React.PropTypes.object
  },

  textfield: function (schema, property, schemaProperty, validate) {
    let label = schema.title || property;
    if (validate) label += ' (required)';
    return {
      schemaProperty, label, validate,
      type: formTypes.text,
      error: validate && get(errors, property, errors.required)
    };
  },

  dropdown: function (schema, property, schemaProperty, validate) {
    let label = schema.title || property;
    if (validate) label += ' (required)';
    return {
      schemaProperty, label, validate,
      options: schema['enum'],
      type: formTypes.dropdown,
      error: validate && get(errors, property, errors.required)
    };
  },

  list: function (schema, property, schemaProperty, validate) {
    let label = schema.title || property;
    if (validate) label += ' (required)';
    return {
      schemaProperty, label, validate,
      type: formTypes.list,
      error: validate && get(errors, property, errors.required)
    };
  },

  // recursively scan a schema object and create a form config from it.
  // returns a flattened representation of the schema.
  traverseObject: function (object, path) {
    let requiredProperties = object.required || [];
    let fields = [];
    for (let property in object.properties) {
      const accessor = path ? path + '.' + property : property;
      const schema = object.properties[property];
      const required = requiredProperties.indexOf(property) >= 0;
      const type = Array.isArray(schema['enum']) ? 'enum' : schema.type;
      switch (type) {
        case 'object':
          fields = fields.concat(this.traverseObject(schema, accessor));
          break;
        case 'enum':
          fields.push(this.dropdown(schema, property, accessor, (required && isText)));
          break;
        case 'array':
          fields.push(this.list(schema, property, accessor, (required && isArray)));
          break;
        case 'string':
          fields.push(this.textfield(schema, property, accessor, (required && isText)));
          break;
        case 'number':
          fields.push(this.textfield(schema, property, accessor, (required && isNumber)));
          break;
        default: continue;
      }
    }
    return fields;
  },

  render: function () {
    const { schema } = this.props;
    if (!schema) return <Loading />;
    const fields = this.traverseObject(schema);
    return (
      <div>
        <Form inputMeta={fields} />
      </div>
    );
  }
});
export default Schema;

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { get, set } from 'object-path';
import { Form, formTypes } from '../Form/Form';
import {
  isText,
  isNumber,
  isArray,
  arrayWithLength
} from '../../utils/validate';
import t from '../../utils/strings';
import ErrorReport from '../Errors/report';

const { errors } = t;

export const traverseSchema = function (schema, fn, path = []) {
  for (let property in schema.properties) {
    const meta = schema.properties[property];

    if (meta.type !== 'object' || meta.additionalProperties === true) {
      fn([...path, property], meta, schema);
    } else if (typeof meta.properties === 'object') {
      traverseSchema(meta, fn, [...path, property]);
    }
  }
};

/**
 * Remove read-only and administrative fields from
 * the list of fields that are returned for addition and editing
 * in the forms.
 *
 * Any fields that are included in the record but are not in
 * the schema will remain
 *
 * @function removeReadOnly
 * @param  {object} data   the fields data
 * @param  {object} schema the form schema
 * @return {object} updated list of fields
 */
export const removeReadOnly = function (data, schema) {
  const readOnlyRemoved = {};
  const schemaFields = [];

  traverseSchema(schema, function (path, meta) {
    schemaFields.push(path[path.length - 1]);

    if (!meta.readonly) {
      set(readOnlyRemoved, path, get(data, path));
    }
  });

  // filter fields that are not in the schema
  const esFields = ['queriedAt', 'timestamp', 'stats'];
  const nonSchemaFields = Object.keys(data).filter(
    f => !schemaFields.includes(f) && !esFields.includes(f)
  );

  // add them to the list of fields
  nonSchemaFields.forEach(f => set(readOnlyRemoved, f, get(data, f)));

  return readOnlyRemoved;
};

// recursively scan a schema object and create a form config from it.
// returns a flattened representation of the schema.
export const createFormConfig = function (data, schema, include, exclude) {
  data = data || {};
  const fields = [];
  const toRegExps = stringsOrRegExps =>
    stringsOrRegExps.map(strOrRE =>
      typeof strOrRE === 'string' ? new RegExp(`^${strOrRE}$`, 'i') : strOrRE
    );
  const inclusions = toRegExps(include);
  const exclusions = toRegExps(exclude);
  const matches = string => regexp => regexp.test(string);
  const includeProperty = path =>
    inclusions.some(matches(path)) && !exclusions.some(matches(path));

  traverseSchema(schema, function (path, meta, schemaProperty) {
    const fullyQualifiedProperty = path.join('.');

    // If a field isn't user-editable, hide it from the form
    if (meta.readonly) return;

    // if there are included properties, only create forms for those
    if (!includeProperty(fullyQualifiedProperty)) return;

    // determine the label
    const property = path[path.length - 1];
    const required =
      Array.isArray(schemaProperty.required) &&
      schemaProperty.required.includes(property);

    const labelText = meta.title || property;
    const label = (
      <span>
        <span className="label__name">{labelText}</span>
        {required && <span className="label__required"> *</span>}
        {meta.description && (
          <span className="label__description"> ({meta.description})</span>
        )}
      </span>
    );

    const value = get(data, path, get(meta, 'default'));
    const config = {
      value,
      label,
      schemaProperty: fullyQualifiedProperty,
      required
    };

    // dropdowns have type set to string, but have an enum prop.
    // use enum as the type instead of string.
    const type = Array.isArray(meta['enum'])
      ? 'enum'
      : meta.hasOwnProperty('patternProperties')
        ? 'pattern'
        : meta.type;

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
        fields.push(dropdownField(config, property, required && isText));
        break;
      case 'array':
        // some array types have a minItems property
        let validate = !required
          ? null
          : meta.minItems && isNaN(meta.minItems)
            ? arrayWithLength(+meta.minItems)
            : isArray;
        fields.push(listField(config, property, validate));
        break;
      case 'string':
        fields.push(textField(config, property, required && isText));
        break;
      case 'integer':
      case 'number':
        fields.push(numberField(config, property, required && isNumber));
        break;
      case 'object':
        fields.push(textAreaField(config, property, required && isText));
        break;
      default:
        return;
    }
  });
  return fields;
};

const textAreaField = (config, property, validate) => ({
  ...config,
  type: formTypes.textArea,
  mode: 'json',
  value: '{}',
  validate: validate,
  error: validate && get(errors, property, errors.required)
});

function textField (config, property, validate) {
  config.type = formTypes.text;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  if (property === 'password') config.isPassword = true;

  return config;
}

function numberField (config, property, validate) {
  config.type = formTypes.number;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);

  return config;
}

function dropdownField (config, property, validate) {
  config.type = formTypes.dropdown;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

function listField (config, property, validate) {
  config.type = formTypes.list;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

export class Schema extends React.Component {
  constructor (props) {
    super(props);
    this.props = props;
    const { schema, data, include, exclude } = this.props;
    this.state = { fields: createFormConfig(data, schema, include, exclude) };
  }

  componentDidUpdate (prevProps) {
    const { schema, data, include, exclude, pk } = this.props;

    if (prevProps.pk !== pk) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        fields: createFormConfig(data, schema, include, exclude)
      });
    }
  }

  render () {
    const { fields } = this.state;
    const { error } = this.props;

    return (
      <div>
        {error ? <ErrorReport report={error} /> : null}
        <Form
          inputMeta={fields}
          submit={this.props.onSubmit}
          cancel={this.props.onCancel}
          status={this.props.status}
        />
      </div>
    );
  }
}

Schema.propTypes = {
  schema: PropTypes.object,
  data: PropTypes.object,
  pk: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  status: PropTypes.string,
  error: PropTypes.any,

  // Specifies schema properties to include on the form.  Each element in this
  // array may be either a string that specifies the full path of the property
  // within the schema (e.g., "collection.name" and "collection.version") or a
  // regular expression (e.g., /^collection/).
  include: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  ),
  // Specifies schema properties to exclude from the form.  Elements in this
  // array are specified the same was as in the "include" array.  However,
  // exclusions are applied after inclusions, so a property that is included
  // via the "include" array may be excluded by this array, preventing it from
  // appearing on the form.
  exclude: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  )
};

Schema.defaultProps = {
  // Exclude no schema properties
  exclude: [],
  // Include all schema properties
  include: [/.+/]
};

export default Schema;

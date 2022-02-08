/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';
import { get, set } from 'object-path';
import noop from 'lodash/noop';
import startCase from 'lodash/startCase';
import { Form, formTypes } from '../Form/Form';
import {
  arrayWithLength,
  isArray,
  isNumber,
  isObject,
  isText,
} from '../../utils/validate';
import t from '../../utils/strings';
import ErrorReport from '../Errors/report';

const { errors } = t;

const traverseSchema = (schema, enums, fn, path = []) => {
  // eslint-disable-next-line guard-for-in
  for (const property in schema.properties) {
    const meta = schema.properties[property];

    if (
      meta.type !== 'object' ||
      meta.additionalProperties === true ||
      property in enums
    ) {
      fn([...path, property], meta, schema);
    } else if (typeof meta.properties === 'object') {
      traverseSchema(meta, enums, fn, [...path, property]);
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
export const removeReadOnly = (data, schema) => {
  const readOnlyRemoved = {};
  const schemaFields = [];

  traverseSchema(schema, {}, (path, meta) => {
    schemaFields.push(path[path.length - 1]);

    if (!meta.readonly) {
      set(readOnlyRemoved, path, get(data, path));
    }
  });

  // filter fields that are not in the schema
  const esFields = ['queriedAt', 'timestamp', 'stats'];
  const nonSchemaFields = Object.keys(data).filter(
    (f) => !schemaFields.includes(f) && !esFields.includes(f)
  );

  // add them to the list of fields
  nonSchemaFields.forEach((f) => set(readOnlyRemoved, f, get(data, f)));

  return readOnlyRemoved;
};

// recursively scan a schema object and create a form config from it.
// returns a flattened representation of the schema.
export const createFormConfig = ({
  data = {},
  schema,
  include,
  exclude,
  enums = {},
  handleInputChange = {},
}) => {
  const fields = [];
  const toRegExps = (stringsOrRegExps) => stringsOrRegExps.map((strOrRE) => (typeof strOrRE === 'string' ? new RegExp(`^${strOrRE}$`, 'i') : strOrRE));
  const inclusions = toRegExps(include);
  const exclusions = toRegExps(exclude);
  const matches = (string) => (regexp) => regexp.test(string);
  const includeProperty = (path) => inclusions.some(matches(path)) && !exclusions.some(matches(path));

  traverseSchema(schema, enums, (path, meta, schemaProperty) => {
    const fullyQualifiedProperty = path.join('.');

    // If a field isn't user-editable, hide it from the form
    if (meta.readonly) return;

    // if there are included properties, only create forms for those
    if (!includeProperty(fullyQualifiedProperty)) return;

    // determine the label
    const property = path[path.length - 1];
    const required =
      isArray(schemaProperty.required) &&
      schemaProperty.required.includes(property);

    const labelText = meta.title || startCase(property);
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
      labelText,
      schemaProperty: fullyQualifiedProperty,
      required,
      handleChange: handleInputChange[property] || noop,
    };

    // dropdowns have type set to string, but have an enum prop.
    // use enum as the type instead of string.
    let type;

    if (isArray(meta.enum) || property in enums) {
      type = 'enum';
    } else if (
      Object.prototype.hasOwnProperty.call(meta, 'patternProperties')
    ) {
      type = 'pattern';
    } else {
      type = meta.type;
    }

    switch (type) {
      case 'pattern': {
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
      }
      case 'enum': {
        // pass the enum fields as options
        config.options = enums[property] || meta.enum;
        fields.push(dropdownField(config, property, required && isText));
        break;
      }
      case 'array': {
        // some array types have a minItems property
        let validate;

        if (!required) {
          validate = false;
        } else if (meta.minItems && Number.isNaN(+meta.minItems)) {
          validate = arrayWithLength(+meta.minItems);
        } else {
          validate = isArray;
        }
        fields.push(listField(config, property, validate));
        break;
      }
      case 'string':
        fields.push(textField(config, property, required && isText));
        break;
      case 'integer':
      case 'number':
        fields.push(numberField(config, property, required && isNumber));
        break;
      case 'object':
        fields.push(textAreaField(config, property, required && isObject));
        break;
      default:
    }
  });

  return fields;
};

const textAreaField = (config, property, validate) => ({
  ...config,
  type: formTypes.textArea,
  mode: 'json',
  value: isObject(config.value)
    ? JSON.stringify(config.value, null, 2)
    : config.value,
  validate,
  error: validate && get(errors, property, errors.required),
});

function textField(config, property, validate) {
  config.type = formTypes.text;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  if (property === 'password' || property === 'username') { config.isPassword = true; }

  return config;
}

function numberField(config, property, validate) {
  config.type = formTypes.number;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);

  return config;
}

function dropdownField(config, property, validate) {
  config.type = formTypes.dropdown;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

function listField(config, property, validate) {
  config.type = formTypes.list;
  config.validate = validate;
  config.error = validate && get(errors, property, errors.required);
  return config;
}

const Schema = ({
  data,
  enums,
  error,
  exclude,
  handleInputChange,
  include,
  onCancel,
  onSubmit,
  schema,
  status,
}) => {
  const fields = createFormConfig({
    data,
    schema,
    include,
    exclude,
    enums,
    handleInputChange,
  });

  return (
    <div
      ref={(element) => {
        error && element && element.scrollIntoView(true);
      }}
    >
      {error && <ErrorReport report={error} />}
      <Form
        inputMeta={fields}
        submit={onSubmit}
        cancel={onCancel}
        status={status}
      />
    </div>
  );
};

Schema.propTypes = {
  schema: PropTypes.object,
  // Mapping from property name to function that supplies dynamic enum values
  // for cases where the list of enum values is not static, but rather is
  // derived from the current state.  For example, the "workflow" property of
  // a Rule must specify the name of an existing Workflow, thus the list of
  // possible values for the property must come from the current state.
  // When a schema property name is found in this enums component property,
  // the associated function is invoked with no arguments and is expected to
  // return a list of values to select from.  Each value in the list may
  // be either a single value or a pair of values.  When a list element is a
  // single value, it is used for both the value and text of the select option.
  // When it is a pair of values (a 2-element array), the first element is used
  // as the value of the select option, and the second value is the option text.
  enums: PropTypes.objectOf(PropTypes.array),
  data: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  status: PropTypes.string,
  error: PropTypes.any,

  // Schema properties to include on the form.  Each element in this
  // array may be either a string that specifies the full path of the property
  // within the schema (e.g., "collection.name" and "collection.version") or a
  // regular expression (e.g., /^collection/).
  include: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  ),
  // Schema properties to exclude from the form.  Elements in this
  // array are specified the same was as in the "include" array.  However,
  // exclusions are applied after inclusions, so a property that is included
  // via the "include" array may be excluded by this array, preventing it from
  // appearing on the form.
  exclude: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
  ),
  handleInputChange: PropTypes.objectOf(PropTypes.func),
};

Schema.defaultProps = {
  enums: {},
  // Exclude no schema properties
  exclude: [],
  // Include all schema properties
  include: [/.+/],
};

export default Schema;

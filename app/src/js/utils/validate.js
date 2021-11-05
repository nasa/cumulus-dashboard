export const isObject = (object) => !Array.isArray(object) && typeof object === 'object';

export const isText = (string) => typeof string === 'string' && string.length;

export const isNumber = (string) => !Number.isNaN(+string);

export const isArray = (object) => Array.isArray(object) && object.every(Boolean);

export const arrayWithLength = (length) => (object) => isArray(object) && object.length >= length;

export const granuleModel = (obj) => isText(obj.granuleId);

export const collectionModel = (obj) => isText(obj.collectionName) && granuleModel(obj.granuleDefinition);

export const isUndefined = (test) => typeof test === 'undefined';

export const isValidProvider = (provider) => {
  if (!provider.globalConnectionLimit) return true;
  if (provider.globalConnectionLimit > 0) return true;
  return false;
};

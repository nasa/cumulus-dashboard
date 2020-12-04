import window from 'global/window';
import document from 'global/document';
export const encode = (str) => (window.encodeURI ? window.encodeURI(str) : str);

// add an event listener on document that returns it's cleanup function
export const addGlobalListener = (type, callback) => {
  if (document && typeof document.addEventListener === 'function') {
    document.addEventListener(type, callback);
    return () => document.removeEventListener(type, callback);
  }
  return () => true;
};

export const setWindowEditorRef = (editorRef) => {
  if (window && window.Cypress && window.Cypress.env('TESTING') === true) {
    window.aceEditorRef = editorRef;
  }
};

export { window, document };

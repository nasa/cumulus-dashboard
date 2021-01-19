import React from 'react';
import ReactDOM from 'react-dom';

import './css/main.scss';
import './public/favicon.ico';

import App from './js/App';

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react')
    .then((axe) => {
      axe.default(React, ReactDOM, 1000);
    });
}

ReactDOM.render(<App />, document.getElementById('site-canvas'));

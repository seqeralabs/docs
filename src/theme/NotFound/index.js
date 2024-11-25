import React from 'react';
import { Link } from '@docusaurus/Link';

function NotFound() {
  return React.createElement(
    'div',
    { style: { textAlign: 'center', padding: '50px' } },
    React.createElement('h1', null, 'Page not found'),
    React.createElement('p', null, 'Sorry, we couldn\'t find the page you\'re looking for.'),
    React.createElement(
      'p',
      null,
      'You can return to the ',
      React.createElement(Link, { to: '/' }, 'home page'),
      ' or check out our ',
      React.createElement(Link, { to: '/docs' }, 'documentation'),
      ' for more information.'
    )
  );
}

export default NotFound;

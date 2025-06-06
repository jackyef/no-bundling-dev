import { appName } from './constants.js';
import * as preact from 'preact';
import { html } from 'htm/preact';

const App = () => {
  return html`<div>Hello, ${appName}!</div>`;
}

preact.render(html`<${App} />`, document.getElementById('app'));

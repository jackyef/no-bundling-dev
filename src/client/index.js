import * as preact from 'preact';
import htm from 'htm';

import { Hero } from './components/Hero/index.js';
import { Header } from './components/Header/index.js';

globalThis.html = htm.bind(preact.h); // Make html available globally for JSX-like syntax

const App = () => {
  return html`
    <main>
      <${Header} />
      <${Hero} />
    </main>
  `;
}

preact.render(html`<${App} />`, document.getElementById('app'));

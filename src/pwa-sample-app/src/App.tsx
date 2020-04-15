import React from 'react';
import * as Sentry from '@sentry/browser';

import logo from './logo.png';
import './App.css';

const sentryOptions = {
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: `my-project-name@${process.env.REACT_APP_VERSION}`
} as Sentry.BrowserOptions;

Sentry.init(sentryOptions);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to <code>PWA Samples</code>.
        </p>
        <a
          className="App-link"
          href="https://bit.ly/pwa-samples-src"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code available
        </a>
      </header>
    </div>
  );
}

export default App;

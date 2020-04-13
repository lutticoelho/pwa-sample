import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import GeolocationComponent from 'components/Geolocation/geolocation.component';
import { Message } from 'components/Message/message.component';
import CameraComponent from 'components/Camera/camera.component';

declare global {
  interface Window { ga: any; }
}

var history = createBrowserHistory();

history.listen((location) => {
  if (!window.ga)
    return;

  console.log("Send page view: " + location.pathname + location.search);
  window.ga('set', 'page', location.pathname + location.search);
  window.ga('send', 'pageview');
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/geolocation" component={GeolocationComponent} />
        <Route exact path="/camera" component={CameraComponent} />
        <Route exact path="/404" >
          <Message message="404 Not found" />
        </Route>
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
      <div className="navbar">
        <nav>
          <Link to="/" className={history.location.pathname === '/' ? "active" : ''}>Home</Link>
          <Link to="/geolocation" className={history.location.pathname === '/geolocation' ? "active" : ''}>Geolocation</Link>
          <Link to="/camera" className={history.location.pathname === '/camera' ? "active" : ''}>Camera</Link>
          <Link to="not-found" className={history.location.pathname === '/404' ? "active" : ''}>404</Link>
        </nav>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

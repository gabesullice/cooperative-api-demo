import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
} from 'react-router-dom';
import Collection from './Collection.js';
import Article from './Article.js';
import JuissyClient from './juissy/index.js';

const h1client = new JuissyClient('https://http1.sullice.com');
const h2client = new JuissyClient('https://http2.sullice.com');

const ManyArticles = Collection(Article);

const limit = 5;
const NoPushPage = () => (
  <ManyArticles className="Articles" resourceType="node--article" sort="-created" limit={limit} preserveOrder client={h1client} />
);

const PushPage = () => (
  <ManyArticles className="Articles" resourceType="node--article" sort="-created" limit={limit} preserveOrder client={h2client} />
);

const HomePage = () => (
  <div>welcome</div>
);

const App = () => (
  <Router>
    <div className="App">
      <div className="header">
        <h1>
          <NavLink to="/http1" activeClassName="active">HTTP/1.1</NavLink>&nbsp;
          <NavLink to="/http2" activeClassName="active">HTTP/2</NavLink>
        </h1>
      </div>
      <div className="main">
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/http1" component={NoPushPage}/>
        <Route exact path="/http2" component={PushPage}/>
      </div>
    </div>
  </Router>
);

export default App;

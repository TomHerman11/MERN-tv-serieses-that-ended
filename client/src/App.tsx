import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AddTvSeriesPage from './Pages/AddTvSeriesPage/AddTvSeriesPage';
import NavigationButton from './Pages/common/NavigationButton';
import TvSeriesesPage from './Pages/TvSeriesesPage/TvSeriesesPage';
import TvSeriesPage from './Pages/TvSeriesPage/TvSeriesPage';
import RouteNotFound from './Pages/RouteNotFound';
import { routerRoutes } from './Utils/Utils';
import './App.css';

const SERVER_API_URL = 'http://localhost:4000/graphql';

const apolloClient = new ApolloClient({
  uri: SERVER_API_URL,
  cache: new InMemoryCache()
});

function App() {
  return (
    <Router>
      <ApolloProvider client={apolloClient}>
        <div className="App">
          <header className="AppHeader">
            <div className="AppHeaderTitles">
              <h1>Best TV Shows That Ended</h1>
              <h2>{"Popularity & Years on Air"}</h2>
            </div>
            <div className="navigationButtons">
              <NavigationButton pageTitle="Home" pageRoute={routerRoutes.home} />
              <NavigationButton pageTitle="Add TV Series" pageRoute={routerRoutes.addTvSeries} />
            </div>
          </header>

          <Switch>
            <Route exact path={routerRoutes.home}>
              <TvSeriesesPage />
            </Route>
            <Route exact path={routerRoutes.addTvSeries}>
              <AddTvSeriesPage />
            </Route>
            <Route path={`${routerRoutes.tvSeries}/:tvSeriesTitle`}>
              <TvSeriesPage />
            </Route>
            <Route path="*">
              <RouteNotFound />
            </Route>
          </Switch>
        </div>
      </ApolloProvider>
    </Router>
  );
}

export default App;

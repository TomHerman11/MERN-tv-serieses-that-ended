import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import AddTvSeries from './AddTvSeries';
import TvSerieses from './TvSerieses';
import './App.css';

const SERVER_URL = 'http://localhost:4000/graphql';
const apolloClient = new ApolloClient({
  uri: SERVER_URL,
  cache: new InMemoryCache()
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <header className="App-header">
          <h1>Best TV Serieses That Ended</h1>
          <h2>{"Popularity & Years on Air"}</h2>
          <AddTvSeries />
        </header>
        <div className="App-body">
          <TvSerieses />
        </div>
      </ApolloProvider>
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import { TvSeriesInterface } from './TvSeriesInterface';
import TvSeries from './TvSeries';

const serieses: TvSeriesInterface[] = [
  { _id: 1, title: 'series1', yearBegin: 2001, yearEnd: 2001, popularity: 91 },
  { _id: 2, title: 'series2', yearBegin: 2002, yearEnd: 2002, popularity: 92 },
  { _id: 3, title: 'series3', yearBegin: 2003, yearEnd: 2003, popularity: 93 },
  { _id: 4, title: 'series4', yearBegin: 2004, yearEnd: 2004, popularity: 94 },
  { _id: 5, title: 'series5', yearBegin: 2005, yearEnd: 2005, popularity: 95 },
  { _id: 6, title: 'series6', yearBegin: 2006, yearEnd: 2006, popularity: 96 },
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Best TV Serieses That Ended</h1>
        <h2>{"Popularity & Years on Air"}</h2>
      </header>
      <div className="App-body">
        {serieses.map(series => <TvSeries key={series._id} {...series} />)}
      </div>
    </div>
  );
}

export default App;

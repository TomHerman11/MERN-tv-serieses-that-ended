import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { TvSeriesInterface } from './TvSeriesInterface';
import TvSeries from './TvSeries';
import './TvSerieses.css';

const TV_SERIESES = gql`
query GetTvSerieses {
    serieses {
        _id
        title
        yearBegin
        yearEnd
        popularity
    }
  }
`;

function TvSerieses() {
    const { loading, error, data } = useQuery(TV_SERIESES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div className="TvSerieses">
            {data.serieses.map((series: TvSeriesInterface) => <TvSeries key={series._id} {...series} />)}
        </div>
    );
}

export default TvSerieses;
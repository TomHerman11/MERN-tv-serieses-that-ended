import React from 'react';
import { useQuery } from '@apollo/client';
import { TvSeriesInterface, TV_SERIESES_QUERY } from './Utils';
import TvSeries from './TvSeries';
import './TvSerieses.css';


function TvSerieses() {
    const { loading, error, data } = useQuery(TV_SERIESES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div className="TvSerieses">
            {data.serieses.map((series: TvSeriesInterface) => <TvSeries key={series.id} {...series} />)}
        </div>
    );
}

export default TvSerieses;
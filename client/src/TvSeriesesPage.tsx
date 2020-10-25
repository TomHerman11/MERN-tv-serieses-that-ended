import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from "react-router-dom";
import { TvSeriesInterface, QUERY_TV_SERIESES, capitalizeFirstLetters, routerRoutes } from './Utils';
import './TvSeriesesPage.css';

function TvSeriesesPage() {
    const { loading, error, data } = useQuery(QUERY_TV_SERIESES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error. Try to refresh.</p>;

    return (
        <div className="TvSeriesesPage">
            {data?.serieses?.map((series: TvSeriesInterface) => <TvSeries key={series.id} {...series} />)}
        </div>
    );
}

function TvSeries({ id, title, yearBegin, yearEnd, popularity }: TvSeriesInterface) {
    // Redirect to TvSeriesPage upon click:
    const routerHistory = useHistory();
    const redirectToTvSeriesPage = (title: string) => {
        routerHistory.push(`${routerRoutes.tvSeries}/${title}`);
    }

    return (
        <div className="TvSeries" onClick={() => redirectToTvSeriesPage(title)}>
            <div className="TvSeriesTitle">
                <h3>{capitalizeFirstLetters(title)}</h3>
            </div>
            <div className="TvSeriesInformation">
                <h5>{popularity}%</h5>
                <h5>{yearBegin}-{yearEnd}</h5>
            </div>
        </div>
    );
}

export default TvSeriesesPage;

import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from "react-router-dom";
import { TvSeriesInterface, QUERY_TV_SERIESES, capitalizeFirstLetters, routerRoutes } from '../../Utils/Utils';
import Popularity from '../../Utils/Popularity';
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
                <h2>{capitalizeFirstLetters(title)}</h2>
            </div>
            <div className="TvSeriesInformation">
                <Popularity popularity={popularity} size={4} />
                <h4>{yearBegin}-{yearEnd}</h4>
            </div>
        </div>
    );
}

export default TvSeriesesPage;

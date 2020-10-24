import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { QUERY_TV_SERIES, capitalizeFirstLetters } from './Utils';
import './TvSeriesPage.css';

function TvSeriesPage() {
    // react router:
    let { tvSeriesTitle } = useParams<{ tvSeriesTitle: string }>();

    // apollo:
    const { loading, error, data } = useQuery(QUERY_TV_SERIES,
        {
            variables: { title: tvSeriesTitle },
        }
    );

    // if (loading) return <p>Loading...</p>;
    // if (error) return (
    //     <div>
    //         <p>
    //             {`Could not find the TV Series '${tvSeriesTitle}'. Please try again later.`}
    //         </p>
    //     </div>

    // );


    if (error) {
        console.log(error);
        return (
            <div className="TvSeriesPage">
                <p>Could not find the TV Series '{tvSeriesTitle}'.</p>
                <p>Please try again later.</p>
            </div>
        );
    }

    if (loading) return (
        <div className="TvSeriesPage">Loading...</div>
    );

    return (
        <div className="TvSeriesPage">
            <h1>{capitalizeFirstLetters(data?.series?.title)}</h1>
            <h2>{data?.series?.yearBegin}-{data?.series?.yearEnd}</h2>
            <h2>{data?.series?.popularity}%</h2>
            <h3>{'<TV Series POSTER. TBD.>'}</h3>
        </div >
    );
}

export default TvSeriesPage;

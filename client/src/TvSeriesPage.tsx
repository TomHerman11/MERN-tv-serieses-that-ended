import React from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client';
import {
    QUERY_TV_SERIES,
    QUERY_TV_SERIESES,
    MUTATION_DELETE_TV_SERIES,
    capitalizeFirstLetters,
    deleteSeriesFromArray,
    TvSeriesInterface,
    routerRoutes
} from './Utils';
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
            <RemoveTvSeriesButton {...data?.series} />
        </div >
    );
}

export default TvSeriesPage;

function RemoveTvSeriesButton({ id }: { id: string }) {
    // Router:
    const routerHistory = useHistory();
    const redirectToHomePage = () => {
        routerHistory.push(routerRoutes.home);
    }

    // Apollo deletion:
    const [removeTvSeries, { loading, error }] = useMutation(MUTATION_DELETE_TV_SERIES, {
        // Update can be used to update the client's cache:
        // 'deleteSeries' is the id of the removed tvSeries
        update: (cache, { data: { deleteSeries } }) => {
            const queryRes = cache.readQuery({ query: QUERY_TV_SERIESES }) as { serieses: TvSeriesInterface[] };
            cache.writeQuery({
                query: QUERY_TV_SERIESES, data: {
                    serieses: deleteSeriesFromArray(queryRes?.serieses, deleteSeries) // keep sorted cache
                }
            });
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error. Try to refresh.</p>;

    // handle delete clicked:
    const handleDelete = async () => {
        // apollo:
        await removeTvSeries({
            variables: { id }
        });

        redirectToHomePage();
    };


    return (
        <div className="RemoveTvSeriesButton" onClick={() => handleDelete()}>
            <h5>Delete</h5>
        </div>
    );
}

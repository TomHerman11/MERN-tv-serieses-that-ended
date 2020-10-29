import React from 'react';
import { useHistory } from "react-router-dom";
import { useMutation } from '@apollo/client';
import {
    QUERY_TV_SERIESES,
    MUTATION_DELETE_TV_SERIES,
    deleteSeriesFromArray,
    TvSeriesInterface,
    routerRoutes
} from '../../Utils/Utils';
import './TvSeriesPage.css';

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
        <div className="BottomButton RedButton" onClick={() => handleDelete()}>
            Delete
        </div>
    );
}

export default RemoveTvSeriesButton;
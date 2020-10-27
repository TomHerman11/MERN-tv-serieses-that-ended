import React from 'react';
import { useMutation } from '@apollo/client';
import {
    MUTATION_ADD_TV_SERIES,
    QUERY_TV_SERIESES,
    insertIntoSortedTvSerieses,
    TvSeriesPropsInterface,
    TvSeriesInterface
} from '../../Utils';
import TvSeriesForm from '../common/TvSeriesForm';

function AddTvSeriesPage() {
    // Apollo insertion:
    const [addTvSeries, { loading, error }] = useMutation(MUTATION_ADD_TV_SERIES, {
        // Update can be used to update the client's cache:
        update: (cache, { data: { addSeries } }) => {
            const queryRes = cache.readQuery({ query: QUERY_TV_SERIESES }) as { serieses: TvSeriesInterface[] };
            cache.writeQuery({
                query: QUERY_TV_SERIESES, data: {
                    serieses: insertIntoSortedTvSerieses(queryRes?.serieses, addSeries) // keep sorted cache
                }
            });
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error. Try to refresh.</p>;

    const addTvSeriesOnSubmit = async ({ title, yearBegin, yearEnd, popularity }: TvSeriesPropsInterface): Promise<void> => {
        // Add tvSeries to the db:
        await addTvSeries({
            variables: { title, yearBegin, yearEnd, popularity }
        });
    }

    return (
        <TvSeriesForm
            submitButtonString={"Add"}
            shouldRedirectAfterSubmit={true}
            tvSeriesProps={{ title: '', yearBegin: -1, yearEnd: -1, popularity: -1 }} // pass "false" values for the form
            onSubmitDbAction={addTvSeriesOnSubmit}
        />
    );
}

export default AddTvSeriesPage;

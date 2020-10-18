import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { TV_SERIESES_QUERY } from './Utils';
import './AddTvSeries.css';

const ADD_TV_SERIES = gql`
    mutation AddTvSeries($title: String!, $yearBegin: Int!, $yearEnd: Int!, $popularity: Int!) {
        addSeries(title: $title, yearBegin: $yearBegin, yearEnd: $yearEnd, popularity: $popularity) {
            id
            title
            yearBegin
            yearEnd
            popularity
        }
    }
`;

function AddTvSeries() {
    const [addTvSeries, { loading, error, data }] = useMutation(ADD_TV_SERIES, {
        update: (cache, { data: { addSeries } }) => {
            console.log(addSeries);
            const queryRes = cache.readQuery({ query: TV_SERIESES_QUERY }) as { serieses: any[] };
            cache.writeQuery({
                query: TV_SERIESES_QUERY, data: {
                    serieses: [...queryRes.serieses, addSeries]
                }
            });
        }
    });

    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div className="AddTvSeries" onClick={() => {
            addTvSeries({
                variables: { title: 'tom', yearBegin: 2020, yearEnd: 2020, popularity: 100 }
            });
        }}>
            Add Tv Series
            {loading && <p>Loading...</p>}
            {error && <p>Error :( Please try again</p>}
        </div>
    );
}

export default AddTvSeries;
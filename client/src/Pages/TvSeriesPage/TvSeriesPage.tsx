import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client';
import TvSeriesForm from '../common/TvSeriesForm';
import RemoveTvSeriesButton from './RemoveTvSeriesButton';
import {
    QUERY_TV_SERIES,
    MUTATION_UPDATE_TV_SERIES,
    capitalizeFirstLetters,
    TvSeriesInterface,
} from '../../Utils';
import './TvSeriesPage.css';

function TvSeriesPage() {
    const [shouldPresentUpdateForm, setShouldPresentUpdateForm] = useState(false);

    // react router:
    let { tvSeriesTitle } = useParams<{ tvSeriesTitle: string }>();

    // apollo:
    // Get TV Series Info:
    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(QUERY_TV_SERIES,
        {
            variables: { title: tvSeriesTitle },
        }
    );

    // For Update scenario:
    // In case of 'update' *apollo* takes care of updating the cache!
    const [updateTvSeries, { loading: updateLoading, error: updateError }] = useMutation(MUTATION_UPDATE_TV_SERIES);

    if (queryLoading) return (<div className="TvSeriesPage">Loading...</div>);
    if (queryError) {
        console.log(queryError);
        return (
            <div className="TvSeriesPage">
                <p>Could not find the TV Series '{tvSeriesTitle}'.</p>
                <p>Please try again later.</p>
            </div>
        );
    }

    if (updateLoading) return (<div className="TvSeriesPage">Loading...</div>);
    if (updateError) {
        console.log(updateError);
        return (
            <div className="TvSeriesPage">
                <p>Error. Try to refresh.</p>
            </div>
        );
    }

    const updateTvSeriesOnSubmit = async ({ title, yearBegin, yearEnd, popularity }: TvSeriesInterface): Promise<void> => {
        if (queryData?.series?.id) {
            // Add tvSeries to the db:
            await updateTvSeries({
                variables: { id: queryData?.series?.id, title, yearBegin, yearEnd, popularity }
            });
        }

        // Show again the "presential" page:
        setShouldPresentUpdateForm(false);
    }

    const handleUpdateButtonClick = () => {
        setShouldPresentUpdateForm(true);
    };

    return (
        <div>
            {!shouldPresentUpdateForm &&
                <div className="TvSeriesPage">
                    <h1>{capitalizeFirstLetters(queryData?.series?.title)}</h1>
                    <h2>{queryData?.series?.yearBegin}-{queryData?.series?.yearEnd}</h2>
                    <h2>{queryData?.series?.popularity}%</h2>
                    <h3>{'<TV Series POSTER. TBD.>'}</h3>
                    <div className="BottomButtons">
                        <div className="BottomButton" onClick={() => handleUpdateButtonClick()}>
                            Edit
                        </div>

                        <RemoveTvSeriesButton {...queryData?.series} />
                    </div>
                </div >
            }
            {shouldPresentUpdateForm &&
                <TvSeriesForm
                    submitButtonString={"Update"}
                    shouldRedirectAfterSubmit={false}
                    tvSeriesProps={{
                        title: queryData?.series?.title || '',
                        yearBegin: queryData?.series?.yearBegin || -1,
                        yearEnd: queryData?.series?.yearEnd || -1,
                        popularity: queryData?.series?.popularity || -1
                    }}
                    onSubmitDbAction={updateTvSeriesOnSubmit}
                />
            }
        </div>
    );
}

export default TvSeriesPage;

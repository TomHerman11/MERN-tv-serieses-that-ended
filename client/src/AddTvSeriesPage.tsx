import React, { useState } from 'react';
import * as _ from 'lodash';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from "react-router-dom";
import { TV_SERIESES_QUERY, routerRoutes } from './Utils';
import './AddTvSeriesPage.css';

const EARLIEST_YEAR_BEGIN = 1920;
const CURRENT_YEAR = new Date().getFullYear();

function AddTvSeriesPage() {
    // Form values:    
    const [title, setTitle] = useState('');
    const [yearBegin, setYearBegin] = useState(CURRENT_YEAR);
    const [yearEnd, setYearEnd] = useState(CURRENT_YEAR);
    const [popularity, setPopularity] = useState(100);
    const [titleEmptyOnSubmit, setTitleEmptyOnSubmit] = useState(false);

    // Router:
    const routerHistory = useHistory();
    const redirectToHomePage = () => {
        routerHistory.push(routerRoutes.home);
    }

    // Apollo insertion:
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

    const [addTvSeries, { loading, error, data }] = useMutation(ADD_TV_SERIES, {
        // Update can be used to update the client's cache:
        update: (cache, { data: { addSeries } }) => {
            const queryRes = cache.readQuery({ query: TV_SERIESES_QUERY }) as { serieses: any[] };
            cache.writeQuery({
                query: TV_SERIESES_QUERY, data: {
                    serieses: [...queryRes?.serieses ? queryRes.serieses : [], addSeries]
                }
            });
        }
    });

    // Form submit:
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (title.length === 0) {
            setTitleEmptyOnSubmit(true);
            return;
        }

        // Add tvSeries to the db:
        addTvSeries({
            variables: { title, yearBegin, yearEnd, popularity }
        });

        // Navigate to home route:
        redirectToHomePage();
    }

    return (
        <div className="AddTvSeriesPage">
            <form onSubmit={handleSubmit} className="AddTvSeriesPage">
                {/* TITLE: */}
                <div className="formRow">
                    <input type="text" placeholder={"Title"} value={title} onChange={(e) => {
                        setTitleEmptyOnSubmit(false);
                        if (isAllowedTitle(e.target.value)) {
                            setTitle(e.target.value)
                        }
                    }}
                    />
                </div>

                {/* YAER BEGIN: */}
                <div className="formRow formRowSelect">
                    <label>When the show premeired</label>
                    <select value={yearBegin} onChange={(e) => setYearBegin(parseInt(e.target.value))}>
                        {
                            _.range(new Date().getFullYear(), EARLIEST_YEAR_BEGIN - 1, -1).map(year => {
                                return <option value={year}>{year}</option>
                            })
                        }
                    </select>
                </div>

                {/* YEAR END: */}
                <div className="formRow formRowSelect">
                    <label>When the show ended</label>
                    <select value={yearEnd} onChange={(e) => setYearEnd(parseInt(e.target.value))}>
                        {
                            _.range(new Date().getFullYear(), yearBegin - 1, -1).map(year => {
                                return <option value={year}>{year}</option>
                            })
                        }
                    </select>
                </div>

                {/* POPULARITY: */}
                <div className="formRow formRowSelect">
                    <label>Popularity %</label>
                    <select value={popularity} onChange={(e) => setPopularity(parseInt(e.target.value))}>
                        {
                            _.range(100, - 1, -1).map(option => {
                                return <option value={option}>{option}</option>
                            })
                        }
                    </select>
                </div>
                <div className="formRow formRowSubmit">
                    <input type="submit" value="Add!" />
                </div>
            </form>
            {titleEmptyOnSubmit &&
                <div style={{ color: 'red' }}>
                    Title can not be empty!
                </div>
            }
        </div >
    );
}

export default AddTvSeriesPage;


function isAllowedTitle(value: string): boolean {
    if (value.length > 100) return false;

    let code, i, len;
    for (i = 0, len = value.length; i < len; i++) {
        code = value.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code === 32 || code === 33 || code === 63 || code === 46) // ' ', !, ?, .
        ) {
            return false;
        }
    }
    return true;
}
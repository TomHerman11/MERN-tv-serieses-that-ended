import React, { useState } from 'react';
import _ from 'lodash';
import { useHistory } from "react-router-dom";
import { TvSeriesPropsInterface, routerRoutes } from '../../Utils/Utils';
import './TvSeriesForm.css'

const EARLIEST_YEAR_BEGIN = 1920;
const CURRENT_YEAR = new Date().getFullYear();

function TvSeriesForm(
    {
        submitButtonString,
        shouldRedirectAfterSubmit,
        tvSeriesProps,
        onSubmitDbAction
    }:
        {
            submitButtonString: string,
            shouldRedirectAfterSubmit: boolean,
            tvSeriesProps: TvSeriesPropsInterface,
            onSubmitDbAction: (tvSeries: any)
                => Promise<void>
        }
) {
    const [title, setTitle] = useState(tvSeriesProps.title);
    const [yearBegin, setYearBegin] = useState(tvSeriesProps.yearBegin >= 0 ? tvSeriesProps.yearBegin : CURRENT_YEAR);
    const [yearEnd, setYearEnd] = useState(tvSeriesProps.yearEnd >= 0 ? tvSeriesProps.yearEnd : CURRENT_YEAR);
    const [popularity, setPopularity] = useState(tvSeriesProps.popularity >= 0 ? tvSeriesProps.popularity : 100);
    const [titleEmptyOnSubmit, setTitleEmptyOnSubmit] = useState(false);

    // Router:
    const routerHistory = useHistory();
    const redirectToTvSeriesPage = (title: string) => {
        routerHistory.push(`${routerRoutes.tvSeries}/${title}`);
    }

    // Form submit:
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (title.length === 0) {
            setTitleEmptyOnSubmit(true);
            return;
        }

        // make 'title' for ease of search:
        setTitle(title.toLowerCase());

        // call 'dbAction' to apply changes to the db (add, update, etc.):
        await onSubmitDbAction({ title, yearBegin, yearEnd, popularity });

        // in case redirecting did not work, empty form fields:
        setTitle('');
        setYearBegin(CURRENT_YEAR);
        setYearEnd(CURRENT_YEAR);
        setPopularity(100);

        // Navigate to the new tv series route:
        if (shouldRedirectAfterSubmit) {
            redirectToTvSeriesPage(title);
        }
    }

    return (
        <div className="TvSeriesForm">
            <h2 className="TvSeriesFormTitle">{submitButtonString} TV Series</h2>
            <form onSubmit={handleSubmit} className="TvSeriesForm">
                {/* TITLE: */}
                <div className="formRow">
                    <input autoFocus type="text" placeholder={"Title"} value={title} onChange={(e) => {
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
                                return <option key={year} value={year}>{year}</option>
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
                                return <option key={year} value={year}>{year}</option>
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
                                return <option key={option} value={option}>{option}</option>
                            })
                        }
                    </select>
                </div>
                <div className="formRow formRowSubmit">
                    <input type="submit" value={`${submitButtonString}!`} />
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

export default TvSeriesForm;

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
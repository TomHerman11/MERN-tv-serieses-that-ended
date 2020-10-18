import React from 'react';
import { TvSeriesInterface } from './Utils';
import './TvSeries.css';

function TvSeries({ id, title, yearBegin, yearEnd, popularity }: TvSeriesInterface) {
    return (
        <div className="TvSeries">
            <div className="TvSeriesTitle">
                <h3>{title}</h3>
            </div>
            <div className="TvSeriesInformation">
                <h5>{popularity}%</h5>
                <h5>{yearBegin}-{yearEnd}</h5>
            </div>
        </div>
    );
}

export default TvSeries;

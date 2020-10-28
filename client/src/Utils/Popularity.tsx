import React from 'react';
import _ from 'lodash';
import Emoji from './Emoji';

function Popularity({ popularity, size }: { popularity: number, size: number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {size === 1 && <h1>{popularity}% </h1>}
            {size === 2 && <h2>{popularity}% </h2>}
            {size === 3 && <h3>{popularity}% </h3>}
            {size === 4 && <h4>{popularity}% </h4>}
            {size === 5 && <h5>{popularity}% </h5>}
            {size === 6 && <h6>{popularity}% </h6>}
            <div>
                {_.range(popularity / 20).map(
                    starIndex => <Emoji symbol="⭐" label="star" key={starIndex} />
                )
                }
            </div>
        </div>
    );
}

export default Popularity;
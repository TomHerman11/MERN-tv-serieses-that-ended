import React from 'react';

function Emoji({ symbol, label }: { label: string, symbol: string }) {
    return (<span
        className="emoji"
        role="img"
        aria-label={label ? label : ""}
        aria-hidden={label ? "false" : "true"}
    >
        {symbol}
    </span>
    );
}

export default Emoji;
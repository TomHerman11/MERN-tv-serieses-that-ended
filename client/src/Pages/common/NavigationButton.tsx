import React from 'react';
import { useHistory } from "react-router-dom";
import './NavigationButton.css';

function NavigationButton({ pageTitle, pageRoute }: { pageTitle: string, pageRoute: string }) {
    const routerHistory = useHistory();

    return (<div className="navigationButton" onClick={() => {
        routerHistory.push(pageRoute);
    }}>
        <h3 className="noSelectText">
            {pageTitle}
        </h3>
    </div>);
}

export default NavigationButton;
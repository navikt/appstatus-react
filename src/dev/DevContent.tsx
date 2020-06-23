import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getRouteConfig } from './config/routeConfig';
import Intro from './Intro';

type Props = RouteComponentProps;

const DevContent = ({ history }: Props) => {
    const {
        location: { pathname },
    } = history;
    const routeConfig = getRouteConfig(pathname);
    return (
        <>
            <article style={{ maxWidth: '1000px' }} className="mainContent">
                {routeConfig ? routeConfig.renderContent() : <Intro />}
            </article>
        </>
    );
};

export default withRouter(DevContent);

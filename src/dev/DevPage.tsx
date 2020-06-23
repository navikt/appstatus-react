import React from 'react';
import ApplicationStatus from '../appstatus-react/components/application-status/ApplicationStatus';
import { Systemtittel } from 'nav-frontend-typografi';
import NAVLogo from './components/svg/NAVLogo';
import './styles/dev.less';

const DevPage = () => {
    return (
        <main className="devPage">
            <header className="header">
                <span className="navLogo">
                    <NAVLogo />
                </span>
                <span className="header__title">
                    <Systemtittel>appstatus-react</Systemtittel>
                </span>
            </header>
            <div className="contentWrapper">
                <h2>Applikasjonsstatus hentet fra Sanity</h2>
                <ApplicationStatus applicationKey="pleiepengesoknad" />
            </div>
        </main>
    );
};

export default DevPage;

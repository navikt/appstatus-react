import React, { useState } from 'react';
import ApplicationStatus from './components/application-status/ApplicationStatus';
import { Systemtittel } from 'nav-frontend-typografi';
import { Flatknapp } from 'nav-frontend-knapper';
import NAVLogo from './components/svg/NAVLogo';
import './styles/dev.less';

const DevPage = () => {
    const [app, setApp] = useState<string>('pleiepengesoknad');
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
                <ApplicationStatus applicationKey={app} />
                <Flatknapp onClick={() => setApp('pleiepengesoknad')}>Pleiepengesøknad</Flatknapp>
                <Flatknapp onClick={() => setApp('foreldrepengesoknad')}>Foreldrepengersøknad</Flatknapp>
            </div>
        </main>
    );
};

export default DevPage;

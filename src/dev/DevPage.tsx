import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Systemtittel } from 'nav-frontend-typografi';
import NAVLogo from './components/svg/NAVLogo';
import DevContent from './DevContent';
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
                <BrowserRouter>
                    <DevContent />
                </BrowserRouter>
            </div>
        </main>
    );
};

export default DevPage;

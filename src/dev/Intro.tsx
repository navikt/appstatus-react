import React from 'react';
import PageIntro from './components/page-intro/PageIntro';
import SystemMessage from '../appstatus-react/components/system-message/SystemMessage';
import ApplicationIsAvailable from '../appstatus-react/components/application-is-available/ApplicationIsAvailable';
import ApplicationStatus from '../appstatus-react/components/application-status/ApplicationStatus';

const Intro = () => (
    <PageIntro title="@navikt/appstatus-react">
        <h2>Applikasjonsstatus hentet fra Sanity</h2>
        <ApplicationStatus applicationKey="pleiepengesoknad" />
        <SystemMessage applicationKey="pleiepengesoknad" />
        <ApplicationIsAvailable
            applicationKey="pleiepengesoknad"
            notAvailableRenderer={() => <span style={{ color: 'red' }}>Pleiepengesøknad er ikke tilgjengelig</span>}>
            Pleiepengesoknad er tilgjengelig
        </ApplicationIsAvailable>
    </PageIntro>
);

export default Intro;

import React from 'react';
import AlertStripe, { AlertStripeType } from 'nav-frontend-alertstriper';
import useSystemMessage from '../../hooks/useSystemMessages';
import { SYSTEM_MESSAGE_TYPE } from '../../types';
import { getLocaleBlockContent } from '../../utils';
import SanityBlock from '../sanity-block/SanityBlock';
import './systemMessage.less';

const getAlertstripeTypeFromSystemMessageType = (systemMessageType: SYSTEM_MESSAGE_TYPE): AlertStripeType => {
    switch (systemMessageType) {
        case SYSTEM_MESSAGE_TYPE.info:
            return 'info';
        case SYSTEM_MESSAGE_TYPE.alert:
            return 'advarsel';
        case SYSTEM_MESSAGE_TYPE.unavailable:
            return 'feil';
    }
};

interface Props {
    applicationKey: string;
}

const SystemMessage = ({ applicationKey }: Props) => {
    const { message } = useSystemMessage(applicationKey);
    if (!message) {
        return null;
    }
    return (
        <AlertStripe type={getAlertstripeTypeFromSystemMessageType(message.messageType)} className="systemMessage">
            <SanityBlock content={getLocaleBlockContent(message.content)} />
        </AlertStripe>
    );
};

export default SystemMessage;

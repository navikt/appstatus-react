import React from 'react';
import AlertStripe, { AlertStripeType } from 'nav-frontend-alertstriper';
import { SanityLocale, SanityMessageType } from '../../types';
import { SanityStatusMessage } from '../../types/sanityObjects';
import { getLocaleBlockContent } from '../../utils';
import SanityBlock from '../sanity-block/SanityBlock';
import './statusMessage.less';

interface Props {
    message: SanityStatusMessage;
    wrapInAlertStripe?: boolean;
    locale?: SanityLocale;
}

const getAlertStripeTypeFromMessageType = (type?: SanityMessageType): AlertStripeType => {
    switch (type) {
        case SanityMessageType.info:
            return 'info';
        case SanityMessageType.warning:
            return 'advarsel';
        case SanityMessageType.error:
            return 'feil';
        default:
            return 'info';
    }
};

const StatusMessage = ({ message, locale = 'nb', wrapInAlertStripe = true }: Props) => {
    const info = getLocaleBlockContent(message.message, locale);
    if (!info || info.length === 0) {
        return null;
    }
    const content = <SanityBlock content={info} />;
    return wrapInAlertStripe ? (
        <AlertStripe type={getAlertStripeTypeFromMessageType(message.messageType)} className="statusMessage">
            {content}
        </AlertStripe>
    ) : (
        <>{content}</>
    );
};

export default StatusMessage;

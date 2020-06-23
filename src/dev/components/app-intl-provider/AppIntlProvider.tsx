import React from 'react';
import { IntlProvider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { appMessages } from './messages';

export interface IntlProviderProps {
    locale: string;
}
export interface IntlProviderProps {
    locale: string;
    children: React.ReactNode;
    onError?: (error: any) => void;
}

const AppIntlProvider = ({ locale, onError, children }: IntlProviderProps) => {
    const messages = locale === 'nb' ? appMessages.nb : appMessages.nn;
    return (
        <IntlProvider locale={locale} messages={messages} onError={onError}>
            {children}
        </IntlProvider>
    );
};

export default AppIntlProvider;

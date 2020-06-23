import { SanityStatusMessage } from './sanityObjects';

export enum Status {
    'normal' = 'normal',
    'unstable' = 'unstable',
    'unavailable' = 'unavailable',
}

export type TeamStatus = Status;

export type ApplicationStatus = Status | ApplicationInheritTeamStatus;

export enum ApplicationInheritTeamStatus {
    'team' = 'team',
}

export enum SanityMessageType {
    'info' = 'info',
    'warning' = 'warning',
    'error' = 'error',
}

export interface AppState {
    status: Status;
    message?: SanityStatusMessage;
}

export type StringBlockValue = string | string[];
export type BlockContentType = string | string[];

export type SanityLocale = 'nb' | 'nn';

export const sanityDefaultLocale: SanityLocale = 'nb';

export interface LocaleStringObject {
    nb: string;
    nn?: string;
}

export interface LocaleRichTextObject {
    nb: StringBlockValue;
    nn?: StringBlockValue;
}

export type LocaleObject = LocaleStringObject | LocaleRichTextObject;

export const isValidLocaleObject = (obj: any): obj is LocaleObject =>
    obj !== undefined && obj[sanityDefaultLocale] !== undefined;

export const isValidLocaleStringObject = (obj: any): obj is LocaleStringObject =>
    obj !== undefined && obj[sanityDefaultLocale] !== undefined && typeof obj[sanityDefaultLocale] === 'string';

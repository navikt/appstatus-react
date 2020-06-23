export type StringBlockValue = string | string[];
export type BlockContentType = string | string[];

export type Locale = 'nb' | 'nn';

export const defaultLocale: Locale = 'nb';

export interface LocaleStringObject {
    nb: string;
    nn?: string;
}

export enum SYSTEM_MESSAGE_TYPE {
    info = 'info',
    alert = 'alert',
    unavailable = 'unavailable',
}

export interface LocaleRichTextObject {
    nb: StringBlockValue;
    nn?: StringBlockValue;
}

export type LocaleObject = LocaleStringObject | LocaleRichTextObject;

export const isValidLocaleObject = (obj: any): obj is LocaleObject =>
    obj !== undefined && obj[defaultLocale] !== undefined;

export const isValidLocaleStringObject = (obj: any): obj is LocaleStringObject =>
    obj !== undefined && obj[defaultLocale] !== undefined && typeof obj[defaultLocale] === 'string';

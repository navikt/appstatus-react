import sanityClient from '@sanity/client';
import { SanityConfig } from '../types';

export const getAppSanityClient = ({ projectId, dataset, apiVersion = '', token = '' }: SanityConfig) => {
    return sanityClient({
        projectId,
        dataset,
        apiVersion,
        token,
        useCdn: false,
    });
};

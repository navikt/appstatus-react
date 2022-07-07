import sanityClient from '@sanity/client';
import { DEFAULT_API_VERSION } from '.';
import { SanityConfig } from '../types';

export const getAppSanityClient = ({ projectId, dataset, token = '', apiVersion }: SanityConfig) => {
    return sanityClient({
        projectId,
        dataset,
        token,
        useCdn: false,
        apiVersion: apiVersion || DEFAULT_API_VERSION,
    });
};

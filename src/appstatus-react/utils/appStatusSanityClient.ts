import sanityClient from '@sanity/client';

const appStatusSanityClient = sanityClient({
    projectId: 'ryujtq87',
    dataset: 'production',
    token: '',
    useCdn: false,
});

export default appStatusSanityClient;

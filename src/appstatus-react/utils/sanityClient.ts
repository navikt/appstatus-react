import sanityClient from '@sanity/client';

const appSanityClient = sanityClient({
    projectId: 'ryujtq87',
    dataset: 'production',
    token: '',
    useCdn: false,
});

export default appSanityClient;

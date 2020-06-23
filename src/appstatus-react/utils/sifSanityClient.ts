import sanityClient from '@sanity/client';

const sifSanityClient = sanityClient({
    projectId: '8ux9tyb9',
    dataset: 'production',
    token: '',
    useCdn: false,
});

export default sifSanityClient;

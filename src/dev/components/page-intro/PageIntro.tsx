import React from 'react';
import { Ingress, Undertittel } from 'nav-frontend-typografi';
import Box from '../box/Box';

interface Props {
    title: string;
    children: React.ReactNode;
}

const PageIntro = ({ title, children }: Props) => (
    <>
        <Box margin="m">
            <Box>
                <Undertittel>{title}</Undertittel>
            </Box>
            {children && (
                <Box padBottom="xl">
                    <Ingress tag="div">{children}</Ingress>
                </Box>
            )}
        </Box>
    </>
);

export default PageIntro;

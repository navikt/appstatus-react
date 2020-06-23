import React from 'react';
import useAppStatus from '../../hooks/useAppStatus';
import SanityBlock from '../sanity-block/SanityBlock';
import { getLocaleBlockContent } from '../../utils';

interface Props {
    applicationKey: string;
}

const ApplicationStatus = ({ applicationKey }: Props) => {
    const { isLoading, status, message } = useAppStatus(applicationKey);
    if (isLoading) {
        return <div>Laster</div>;
    }
    return (
        <div>
            {status}
            {message && <SanityBlock content={getLocaleBlockContent(message)} />}
        </div>
    );
};

export default ApplicationStatus;

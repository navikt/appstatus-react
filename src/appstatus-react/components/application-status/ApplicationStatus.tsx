import React from 'react';
import useAppStatus from '../../hooks/useAppStatus';
import StatusMessage from '../status-message/StatusMessage';

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
            {message && <StatusMessage message={message} />}
        </div>
    );
};

export default ApplicationStatus;

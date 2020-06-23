import React from 'react';
import StatusMessage from '../status-message/StatusMessage';
import useAppAndTeamStatus from '../../hooks/useAppAndTeamStatus';

interface Props {
    applicationKey: string;
}

const ApplicationStatus = ({ applicationKey }: Props) => {
    const { isLoading, status, message } = useAppAndTeamStatus(applicationKey);
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

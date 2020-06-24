import React from 'react';
import StatusMessage from '../../../appstatus-react/components/status-message/StatusMessage';
import useAppStatus from '../../../appstatus-react/hooks/useAppStatus';

interface Props {
    applicationKey: string;
}

const ApplicationStatus = ({ applicationKey }: Props) => {
    const { isLoading, status, message } = useAppStatus(applicationKey, {
        projectId: 'ryujtq87',
        dataset: 'production',
    });
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

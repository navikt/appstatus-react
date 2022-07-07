import React from 'react';
import StatusMessage from '../../../appstatus-react/components/status-message/StatusMessage';
import useAppStatus from '../../../appstatus-react/hooks/useAppStatus';
import { DEFAULT_API_VERSION } from '../../../appstatus-react/utils';

interface Props {
    applicationKey: string;
}

const ApplicationStatus = ({ applicationKey }: Props) => {
    const { isLoading, status, message } = useAppStatus(applicationKey, {
        projectId: 'ryujtq87',
        dataset: 'staging',
        apiVersion: DEFAULT_API_VERSION,
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

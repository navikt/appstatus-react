import React from 'react';
import useIsApplicationAvailable from '../../hooks/useIsApplicationAvailable';

interface Props {
    applicationKey: string;
    children: React.ReactNode;
    notAvailableRenderer?: () => React.ReactNode;
}

const ApplicationIsAvailable = ({ applicationKey, notAvailableRenderer, children }: Props) => {
    const { isAvailable, isLoading } = useIsApplicationAvailable(applicationKey);
    if (isLoading) {
        return <div>Laster</div>;
    }
    if (isAvailable === false) {
        return notAvailableRenderer ? <>{notAvailableRenderer()}</> : <div>Ikke tilgjengelig</div>;
    }
    return <div>{children}</div>;
};

export default ApplicationIsAvailable;

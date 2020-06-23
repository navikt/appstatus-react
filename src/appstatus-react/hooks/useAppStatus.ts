import { useEffect, useRef, useState } from 'react';
import { Status, ApplicationStatus } from '../types';
import { SanityStatusMessage } from '../types/sanityObjects';
import { getMessage } from '../utils';
import appSanityClient from '../utils/sanityClient';

const getApplicationDocumentStatusQuery = (key: string, team?: string): string => {
    const teamQuery = team ? `team->.key == "${team}"` : '';
    return `*[_type == 'application' && key == "${key}"${teamQuery}]{
        key,
        applicationStatus,
        message,
        name,
        team->{key}
      }`;
};

interface ApplicationSanityQueryResult {
    key: string;
    name: string;
    applicationStatus: {
        type: '_applicationStatus';
        status: ApplicationStatus;
    };
    message: SanityStatusMessage[];
    team?: {
        key: string;
    };
}

interface ApplicationState {
    status: ApplicationStatus;
    message?: SanityStatusMessage;
}

const defaultState: ApplicationState = {
    status: Status.normal,
    message: undefined,
};

export interface AppStatus {
    team?: string;
    isLoading: boolean;
    message?: SanityStatusMessage;
    status: ApplicationStatus;
}

function useAppStatus(applicationKey: string): AppStatus {
    const [state, setState] = useState<ApplicationState>(defaultState);
    const [application, setApplication] = useState<ApplicationSanityQueryResult | undefined>();
    const [applicationTeam, setApplicationTeam] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const subscription = useRef<any>();

    async function fetch(key: string) {
        setIsLoading(true);
        try {
            const result: ApplicationSanityQueryResult[] = await appSanityClient.fetch(
                getApplicationDocumentStatusQuery(key)
            );
            if (result.length === 1) {
                const appResult = result[0];
                setApplication(appResult);
                setApplicationTeam(appResult.team?.key);
            }
        } catch (error) {
            setApplication(undefined);
            setApplicationTeam(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    const startSubscription = (key: string) => {
        subscription.current = appSanityClient
            .listen(getApplicationDocumentStatusQuery(key))
            .subscribe(({ result }) => {
                const appResult = (result as any) as ApplicationSanityQueryResult;
                setApplication(appResult);
                setApplicationTeam(appResult.team?.key);
            });
    };

    useEffect(() => {
        fetch(applicationKey);
        if (!subscription.current) {
            startSubscription(applicationKey);
        }
    }, [applicationKey]);

    useEffect(() => {
        if (application) {
            setState({
                status: application.applicationStatus.status,
                message: getMessage(application.message),
            });
        }
    }, [application]);

    return { ...state, team: applicationTeam, isLoading };
}

export default useAppStatus;

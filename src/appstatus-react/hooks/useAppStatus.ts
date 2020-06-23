import { useEffect, useRef, useState } from 'react';
import { Status } from '../types';
import { SanityStatusMessage } from '../types/sanityObjects';
import { getMessage } from '../utils';
import appSanityClient from '../utils/sanityClient';
import useTeamStatus from './useTeamStatus';

const getApplicationDocumentStatusQuery = (key: string, team?: string): string => {
    const teamQuery = team ? `team->.key == "${team}"` : '';
    return `*[_type == 'application' && key == "${key}"${teamQuery}]{
        key,
        applicationStatus,
        message,
        name,
        team->{key, name, teamApplicationStatus}
      }`;
};

enum InheritStatus {
    'team' = 'team',
}

interface ApplicationResult {
    key: string;
    name: string;
    applicationStatus: {
        type: '_applicationStatus';
        status: InheritStatus | Status;
    };
    message: SanityStatusMessage[];
    team?: {
        key: string;
        name: string;
        teamApplicationStatus?: {
            type: '_teamApplicationStatus';
            status: Status;
        };
        message: SanityStatusMessage[];
    };
}

interface AggregatedState {
    status: Status;
    message?: SanityStatusMessage;
}

const defaultState: AggregatedState = {
    status: Status.normal,
    message: undefined,
};

interface AppStatus {
    isLoading: boolean;
    status: Status;
    message?: SanityStatusMessage;
}

function useAppStatus(applicationKey: string): AppStatus {
    const [state, setState] = useState<AggregatedState>(defaultState);
    const [application, setApplication] = useState<ApplicationResult | undefined>();
    const [applicationTeam, setApplicationTeam] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const subscription = useRef<any>();

    const { teamMessage, teamStatus } = useTeamStatus(applicationTeam);

    async function fetch(key: string) {
        setIsLoading(true);
        try {
            const result: ApplicationResult[] = await appSanityClient.fetch(getApplicationDocumentStatusQuery(key));
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
                const appResult = (result as any) as ApplicationResult;
                setApplication(appResult);
                setApplicationTeam(appResult.team);
            });
    };

    useEffect(() => {
        fetch(applicationKey);
        startSubscription(applicationKey);
        return function cleanup() {
            if (subscription.current && subscription.current.unsubscribe) {
                subscription.current.unsubscribe();
            }
        };
    }, [applicationKey]);

    useEffect(() => {
        const { applicationStatus, message } = application || {};
        if (applicationStatus) {
            if (
                applicationStatus.status === InheritStatus.team &&
                teamStatus !== undefined &&
                teamStatus !== undefined
            ) {
                setState({
                    status: teamStatus,
                    message: teamMessage || getMessage(message),
                });
            } else if (applicationStatus.status !== InheritStatus.team) {
                setState({
                    status: applicationStatus.status,
                    message: getMessage(message) || teamMessage,
                });
            }
        } else {
            setState(defaultState);
        }
    }, [teamMessage, teamStatus, application]);

    return { ...state, isLoading };
}

export default useAppStatus;

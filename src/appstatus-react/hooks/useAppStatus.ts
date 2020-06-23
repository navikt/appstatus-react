import { useEffect, useState, useRef } from 'react';
import appStatusSanityClient from '../utils/appStatusSanityClient';
import useTeamStatus from './useTeamStatus';
import { LocaleRichTextObject } from '../types';

const getApplicationDocumentStatusQuery = (key: string, team?: string): string => {
    const teamQuery = team ? `team->.key == "${team}"` : '';
    return `*[_type == 'application' && key == "${key}"${teamQuery}]{
        key,
        applicationStatus,
        name,
        team->{key, name, teamApplicationStatus}
      }`;
};

enum InheritStatus {
    'team' = 'team',
}

enum Status {
    'normal' = 'normal',
    'unstable' = 'unstable',
    'unavailable' = 'unavailable',
}

interface ApplicationResult {
    key: string;
    name: string;
    applicationStatus: {
        type: '_applicationStatus';
        message: LocaleRichTextObject;
        status: InheritStatus | Status;
    };
    team?: {
        key: string;
        name: string;
        teamApplicationStatus?: {
            type: '_teamApplicationStatus';
            status: Status;
        };
    };
}

interface AggregatedState {
    status: Status;
    message?: LocaleRichTextObject;
}

const defaultState: AggregatedState = {
    status: Status.normal,
    message: undefined,
};

interface AppStatus {
    isLoading: boolean;
    status: Status;
    message?: LocaleRichTextObject;
}
function useAppStatus(applicationKey: string): AppStatus {
    const [state, setState] = useState<AggregatedState>(defaultState);

    // const [status, setStatus] = useState<Status | undefined>();
    // const [message, setMessage] = useState<LocaleRichTextObject | undefined>();

    const [application, setApplication] = useState<ApplicationResult | undefined>();
    const [applicationTeam, setApplicationTeam] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const subscription = useRef<any>();
    const { teamMessage, teamStatus } = useTeamStatus(applicationTeam);

    async function fetch(key: string) {
        console.log('fetch');
        setIsLoading(true);
        try {
            const result: ApplicationResult[] = await appStatusSanityClient.fetch(
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
        console.log('sub');
        subscription.current = appStatusSanityClient
            .listen(getApplicationDocumentStatusQuery(key))
            .subscribe(({ result }) => {
                const appResult = (result as any) as ApplicationResult;
                setApplication(appResult);
                setApplicationTeam(appResult.team);
            });
    };

    useEffect(() => {
        console.log('init');
        fetch(applicationKey);
        startSubscription(applicationKey);
        return function cleanup() {
            if (subscription.current && subscription.current.unsubscribe) {
                subscription.current.unsubscribe();
            }
        };
    }, [applicationKey]);

    useEffect(() => {
        console.log('effect');
        const { applicationStatus } = application || {};
        if (applicationStatus) {
            if (
                applicationStatus.status === InheritStatus.team &&
                teamStatus !== undefined &&
                teamStatus !== undefined
            ) {
                setState({
                    status: teamStatus,
                    message: teamMessage,
                });
            } else if (applicationStatus.status !== InheritStatus.team) {
                setState({
                    status: applicationStatus.status,
                    message: applicationStatus.message,
                });
            }
        } else {
            setState(defaultState);
        }
    }, [teamMessage, teamStatus, application]);

    return { ...state, isLoading };
}

export default useAppStatus;

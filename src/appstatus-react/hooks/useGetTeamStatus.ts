import { useEffect, useRef, useState } from 'react';
import { TeamStatus, SanityError } from '../types';
import { SanityStatusMessage } from '../types/sanityObjects';
import { getMessage } from '../utils';
import appSanityClient from '../utils/sanityClient';
import { usePrevious } from './usePrevious';

const getTeamStatusQuery = (key: string): string => {
    return `*[_type == 'team' && key == "${key}"]{
        key,
        teamApplicationStatus,
        message,
      }`;
};

interface TeamStatusResult {
    key: string;
    name: string;
    teamApplicationStatus: {
        type: '_teamApplicationStatus';
        status: TeamStatus;
    };
    message?: SanityStatusMessage[];
}

export interface TeamState {
    status?: TeamStatus;
    message?: SanityStatusMessage;
    error?: SanityError;
    isLoading: boolean;
}
function useGetTeamStatus(teamKey?: string): TeamState {
    const [status, setStatus] = useState<TeamStatus | undefined>();
    const [message, setMessage] = useState<SanityStatusMessage | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<SanityError | undefined>();

    const subscription = useRef<any>();

    async function fetch(key: string) {
        const query = getTeamStatusQuery(key);
        setIsLoading(true);
        try {
            const result: TeamStatusResult[] = await appSanityClient.fetch(query);
            if (result.length === 1) {
                const team = result[0];
                setStatus(team.teamApplicationStatus.status);
                setMessage(getMessage(team.message));
            }
        } catch (error) {
            setError(error);
            setStatus(undefined);
            setMessage(undefined);
        } finally {
            setIsLoading(false);
        }
    }
    const startSubscription = (key: string) => {
        const query = getTeamStatusQuery(key);
        subscription.current = appSanityClient.listen(query).subscribe(({ result }) => {
            const team = (result as any) as TeamStatusResult;
            setStatus(team.teamApplicationStatus.status);
            setMessage(getMessage(team.message));
        });
    };

    const stopSubscription = () => {
        if (subscription.current && subscription.current.unsubscribe) {
            subscription.current.unsubscribe();
        }
    };

    const prevTeamKey = usePrevious(teamKey);

    useEffect(() => {
        if (error) {
            stopSubscription();
            return;
        }
        if (teamKey) {
            fetch(teamKey);
            if (!subscription.current) {
                startSubscription(teamKey);
            }
            if (prevTeamKey !== teamKey) {
                stopSubscription();
                startSubscription(teamKey);
            }
        }
        if (teamKey === undefined && subscription.current !== undefined) {
            stopSubscription();
        }
    }, [teamKey, prevTeamKey, error]);

    return { status, message, isLoading, error };
}

export default useGetTeamStatus;

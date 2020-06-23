import { useEffect, useRef, useState } from 'react';
import { SanityStatusMessage } from '../types/sanityObjects';
import { getMessage } from '../utils';
import appSanityClient from '../utils/sanityClient';

const getTeamStatusQuery = (key: string): string => {
    return `*[_type == 'team' && key == "${key}"]{
        key,
        teamApplicationStatus,
        message,
      }`;
};

enum Status {
    'normal' = 'normal',
    'unstable' = 'unstable',
    'unavailable' = 'unavailable',
}

interface TeamStatusResult {
    key: string;
    name: string;
    teamApplicationStatus: {
        type: '_teamApplicationStatus';
        status: Status;
    };
    message?: SanityStatusMessage[];
}

function useTeamStatus(teamKey?: string) {
    const [teamStatus, setTeamStatus] = useState<Status | undefined>();
    const [teamMessage, setTeamMessage] = useState<SanityStatusMessage | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const subscription = useRef<any>();

    async function fetch(key: string) {
        const query = getTeamStatusQuery(key);
        setIsLoading(true);
        try {
            const result: TeamStatusResult[] = await appSanityClient.fetch(query);
            if (result.length === 1) {
                const team = result[0];
                setTeamStatus(team.teamApplicationStatus.status);
                setTeamMessage(getMessage(team.message));
            }
        } catch (error) {
            setTeamStatus(undefined);
            setTeamMessage(undefined);
        } finally {
            setIsLoading(false);
        }
    }
    const startSubscription = (key: string) => {
        const query = getTeamStatusQuery(key);
        subscription.current = appSanityClient.listen(query).subscribe(({ result }) => {
            const team = (result as any) as TeamStatusResult;
            setTeamStatus(team.teamApplicationStatus.status);
            setTeamMessage(getMessage(team.message));
        });
    };

    useEffect(() => {
        if (teamKey) {
            fetch(teamKey);
            startSubscription(teamKey);
        }
        return function cleanup() {
            if (subscription.current && subscription.current.unsubscribe) {
                subscription.current.unsubscribe();
            }
        };
    }, [teamKey]);

    return { teamStatus, teamMessage, isLoading };
}

export default useTeamStatus;

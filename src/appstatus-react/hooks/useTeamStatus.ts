import { useEffect, useState, useRef } from 'react';
import appStatusSanityClient from '../utils/appStatusSanityClient';
import { LocaleRichTextObject } from '../types';

const getTeamStatusQuery = (key: string): string => {
    return `*[_type == 'team' && key == "${key}"]{
        key,
        teamApplicationStatus,
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
    message?: LocaleRichTextObject;
}

function useTeamStatus(teamKey?: string) {
    const [teamStatus, setTeamStatus] = useState<Status | undefined>();
    const [teamMessage, setTeamMessage] = useState<LocaleRichTextObject | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const subscription = useRef<any>();

    async function fetch(key: string) {
        const query = getTeamStatusQuery(key);
        setIsLoading(true);
        try {
            const result: TeamStatusResult[] = await appStatusSanityClient.fetch(query);
            if (result.length === 1) {
                setTeamStatus(result[0].teamApplicationStatus.status);
                setTeamMessage(result[0].message);
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
        subscription.current = appStatusSanityClient.listen(query).subscribe(({ result }) => {
            setTeamStatus(((result as any) as TeamStatusResult).teamApplicationStatus.status);
            setTeamMessage(((result as any) as TeamStatusResult).message);
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

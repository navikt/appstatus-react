import { useEffect, useState } from 'react';
import { Status, ApplicationStatus, ApplicationInheritTeamStatus } from '../types';
import { SanityStatusMessage } from '../types/sanityObjects';
import useAppStatus from './useAppStatus';
import useTeamStatus from './useTeamStatus';

interface State {
    status: Status;
    message?: SanityStatusMessage;
}

const defaultState: State = {
    status: Status.normal,
    message: undefined,
};

const getStateForApplication = (
    appStatus: ApplicationStatus,
    appMessage: SanityStatusMessage | undefined,
    teamStatus: Status | undefined,
    teamMessage: SanityStatusMessage | undefined
) => {
    if (appStatus !== ApplicationInheritTeamStatus.team) {
        return {
            status: appStatus,
            message: appMessage || teamMessage,
        };
    }
    if (appStatus === ApplicationInheritTeamStatus.team && teamStatus !== undefined) {
        return {
            status: teamStatus,
            message: appMessage || teamMessage,
        };
    }
    return defaultState;
};

function useAppAndTeamStatus(applicationKey: string): State & { isLoading: boolean } {
    const [state, setState] = useState<State>(defaultState);

    const { status: appStatus, message: appMessage, team: appTeam, isLoading: appIsLoading } = useAppStatus(
        applicationKey
    );
    const { status: teamStatus, message: teamMessage, isLoading: teamIsLoading } = useTeamStatus(appTeam);

    const [isLoading, setIsLoading] = useState<boolean>(appIsLoading || teamIsLoading);

    useEffect(() => {
        setIsLoading(appIsLoading || teamIsLoading);
        setState(getStateForApplication(appStatus, appMessage, teamStatus, teamMessage));
    }, [appStatus, appMessage, appTeam, teamMessage, teamStatus, appIsLoading, teamIsLoading]);

    return { ...state, isLoading };
}

export default useAppAndTeamStatus;

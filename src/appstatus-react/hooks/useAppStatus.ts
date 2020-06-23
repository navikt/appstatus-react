import { useEffect, useState } from 'react';
import { Status, ApplicationStatus, ApplicationInheritTeamStatus, SanityError } from '../types';
import { SanityStatusMessage } from '../types/sanityObjects';
import useApplicationStatus from './useApplicationStatus';
import useTeamStatus from './useTeamStatus';

interface State {
    status: Status;
    message?: SanityStatusMessage;
    error?: SanityError;
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

function useAppStatus(applicationKey: string): State & { isLoading: boolean } {
    const [state, setState] = useState<State>(defaultState);

    const {
        status: appStatus,
        message: appMessage,
        team: appTeam,
        isLoading: appIsLoading,
        error: appError,
    } = useApplicationStatus(applicationKey);
    const { status: teamStatus, message: teamMessage, isLoading: teamIsLoading, error: teamError } = useTeamStatus(
        appTeam
    );

    const [isLoading, setIsLoading] = useState<boolean>(appIsLoading || teamIsLoading);
    const [error, setError] = useState<SanityError | undefined>(appError || teamError);

    useEffect(() => {
        setIsLoading(appIsLoading || teamIsLoading);
        setState(getStateForApplication(appStatus, appMessage, teamStatus, teamMessage));
    }, [appStatus, appMessage, appTeam, teamMessage, teamStatus, appIsLoading, teamIsLoading]);

    useEffect(() => {
        setError(appError || teamError);
    }, [appError, teamError]);

    return { ...state, isLoading, error };
}

export default useAppStatus;

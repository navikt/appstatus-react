import { useEffect, useState, useRef } from 'react';
import sifSanityClient from '../utils/sifSanityClient';

const getIsAvailable = (key: string): string => `*[_type == 'application' && key == "${key}"]{available}`;

interface IsAvailableResponse {
    available: boolean | undefined;
}

type IsAvailableResult = IsAvailableResponse[];

function useIsApplicationAvailable(applicationKey: string) {
    const [isAvailable, setIsAvailable] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const subscription = useRef<any>();

    async function fetchAndListen(key: string) {
        const query = getIsAvailable(key);
        setIsLoading(true);
        try {
            const availableResult: IsAvailableResult = await sifSanityClient.fetch(query);
            setIsAvailable(availableResult.length === 1 && availableResult[0].available === true);
            subscription.current = sifSanityClient.listen(query).subscribe(({ result }) => {
                const isAvailable = result && result['available'] === true;
                setIsAvailable(isAvailable);
            });
        } catch (error) {
            setIsAvailable(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAndListen(applicationKey);
        return function cleanup() {
            if (subscription.current && subscription.current.unsubscribe) {
                subscription.current.unsubscribe();
            }
        };
    }, [applicationKey]);

    return { isAvailable, isLoading };
}

export default useIsApplicationAvailable;

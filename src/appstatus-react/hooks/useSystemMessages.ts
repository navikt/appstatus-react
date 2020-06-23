import { useEffect, useState } from 'react';
import sifSanityClient from '../utils/sifSanityClient';
import { LocaleRichTextObject, SYSTEM_MESSAGE_TYPE } from '../types';

const getSystemMessageQuery = (time: Date): string =>
    `*[_type == 'systemMessage' && starts < '${time.toISOString()}' && stops > '${time.toISOString()}']{..., application[]->}`;

type SystemMessage = {
    messageType: SYSTEM_MESSAGE_TYPE;
    content: LocaleRichTextObject;
};

interface Application {
    key: string;
}

interface SystemMessageResult {
    isGlobal?: boolean;
    application: Application[];
    content: LocaleRichTextObject;
    starts: string;
    stops: string;
    messageType: SYSTEM_MESSAGE_TYPE;
}

export const isSystemMessageResult = (result: any | any): result is SystemMessageResult => {
    return (
        result['content'] !== undefined &&
        result['application'] !== undefined &&
        (result.messageType === SYSTEM_MESSAGE_TYPE.info ||
            result.messageType === SYSTEM_MESSAGE_TYPE.alert ||
            result.messageType === SYSTEM_MESSAGE_TYPE.unavailable)
    );
};

const extractMessageFromResult = (result: any, applicationKey: string): SystemMessage | undefined => {
    if (
        (isSystemMessageResult(result) && result.isGlobal === true) ||
        result.application.filter((a) => a.key === applicationKey).length === 1
    ) {
        return {
            content: result.content,
            messageType: result.messageType,
        };
    }
    return undefined;
};

function useSystemMessage(applicationKey: string) {
    const [message, setMessage] = useState<SystemMessage | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function listen(key: string) {
        const query = getSystemMessageQuery(new Date());
        setIsLoading(true);
        try {
            sifSanityClient.listen(query).subscribe(({ result }) => {
                setMessage(extractMessageFromResult(result, key));
            });
        } catch (error) {
            setMessage(undefined);
        } finally {
            setIsLoading(false);
        }
    }
    async function fetch(key: string) {
        const query = getSystemMessageQuery(new Date());
        setIsLoading(true);
        try {
            const result = await sifSanityClient.fetch(query);
            setMessage(result.length > 0 ? extractMessageFromResult(result[0], key) : undefined);
        } catch (error) {
            setMessage(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetch(applicationKey);
        listen(applicationKey);
    }, [applicationKey]);

    return { message, isLoading };
}

export default useSystemMessage;

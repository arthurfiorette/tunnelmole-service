import fs from 'fs';
import { ROOT_DIR } from '../../constants';

interface ApiKeyRecord {
    apiKey: string
}

const loadApiKeys = (): ApiKeyRecord[] => {
    return JSON.parse(fs.readFileSync(ROOT_DIR + "/src/authentication/apiKeys.json").toString());
}

const isAuthorizedApiKey = (apiKey?: string): boolean => {
    if (typeof apiKey !== 'string' || apiKey.length === 0) {
        return false;
    }

    const apiKeys = loadApiKeys();
    return apiKeys.some((record: ApiKeyRecord) => record.apiKey === apiKey);
}

export {
    isAuthorizedApiKey
}

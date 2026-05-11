import fs from 'fs';
import { ROOT_DIR } from '../../constants';
import HostipWebSocket from '../websocket/host-ip-websocket';
import InitialiseMessage from '../messages/initialise-message';
import InvalidSubscriptionMessage from '../messages/invalid-subscription-message';
import config from '../../config';
import { shouldRequireApiKey } from './connection-auth-policy';

type ApiKeyRecord = {
    apiKey: string
}

const authorize = async(message: InitialiseMessage, websocket: HostipWebSocket) : Promise<boolean> => {
    const requireApiKeyForAllConnections = config.server.requireApiKeyForAllConnections ?? true;

    if (!shouldRequireApiKey(message, requireApiKeyForAllConnections)) {
        return true;
    }

    const { apiKey } = message;
    const apiKeys: ApiKeyRecord[] = JSON.parse(fs.readFileSync(ROOT_DIR + "/src/authentication/apiKeys.json").toString());

    const apiKeyRecord = apiKeys.find((record: ApiKeyRecord) => {
        return record.apiKey == apiKey;
    });

    if (process.env.LOG_CONNECTION_INFO) {
        console.info(JSON.stringify(message.connectionInfo));
    }

    // No API key record. Send back a message, close the connection and return false 
    if (typeof apiKeyRecord == 'undefined') {
        const invalidSubscriptionMessage : InvalidSubscriptionMessage = {
            type: "invalidSubscription",
            apiKey: apiKey
        }

        websocket.sendMessage(invalidSubscriptionMessage);
        websocket.close();
        return false;
    }

    return true;
}

export {
    authorize
}

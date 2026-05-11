import InitialiseMessage from "../messages/initialise-message";

const shouldRequireApiKey = (
    message: InitialiseMessage,
    requireApiKeyForAllConnections: boolean
): boolean => {
    return requireApiKeyForAllConnections || typeof message.subdomain === 'string' || typeof message.domain === 'string';
}

export {
    shouldRequireApiKey
}

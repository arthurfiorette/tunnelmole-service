import InitialiseMessage from "../messages/initialise-message";

type RequestedHostname = {
    hostname: string,
    subdomain?: string
}

const normalizeHostname = (hostname: string): string => {
    return hostname.trim().replace(/\.$/, '').toLowerCase();
}

const extractSubdomain = (hostname: string, defaultDomain: string): string|undefined => {
    const normalizedHostname = normalizeHostname(hostname);
    const normalizedDefaultDomain = normalizeHostname(defaultDomain);
    const suffix = `.${normalizedDefaultDomain}`;

    if (!normalizedHostname.endsWith(suffix)) {
        return undefined;
    }

    const subdomain = normalizedHostname.slice(0, -suffix.length);
    return subdomain.length > 0 ? subdomain : undefined;
}

const resolveRequestedHostname = (
    message: InitialiseMessage,
    defaultDomain: string,
    allowCustomDomains: boolean
): RequestedHostname|undefined => {
    if (typeof message.subdomain === 'string') {
        const subdomain = normalizeHostname(message.subdomain);

        return {
            subdomain,
            hostname: `${subdomain}.${normalizeHostname(defaultDomain)}`
        };
    }

    if (typeof message.domain !== 'string') {
        return undefined;
    }

    const hostname = normalizeHostname(message.domain);
    const subdomain = extractSubdomain(hostname, defaultDomain);

    if (typeof subdomain === 'string') {
        return {
            hostname,
            subdomain
        };
    }

    if (!allowCustomDomains) {
        return undefined;
    }

    return {
        hostname
    };
}

export {
    extractSubdomain,
    RequestedHostname,
    resolveRequestedHostname
}

import { shouldRequireApiKey } from "./connection-auth-policy";

describe("shouldRequireApiKey", () => {
    const connectionInfo = {} as any;

    it("should require api keys for all connections when enabled", () => {
        expect(shouldRequireApiKey({
            type: "initialise",
            clientId: "client-1",
            connectionInfo
        }, true)).toBe(true);
    });

    it("should allow random subdomains without api keys when disabled", () => {
        expect(shouldRequireApiKey({
            type: "initialise",
            clientId: "client-1",
            connectionInfo
        }, false)).toBe(false);
    });

    it("should still require api keys for requested subdomains", () => {
        expect(shouldRequireApiKey({
            type: "initialise",
            clientId: "client-1",
            subdomain: "docs",
            connectionInfo
        }, false)).toBe(true);
    });

    it("should still require api keys for requested domains", () => {
        expect(shouldRequireApiKey({
            type: "initialise",
            clientId: "client-1",
            domain: "docs.example.com",
            connectionInfo
        }, false)).toBe(true);
    });
});

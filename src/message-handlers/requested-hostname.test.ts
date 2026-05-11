import { extractSubdomain, resolveRequestedHostname } from "./requested-hostname";

describe("requested hostname resolution", () => {
    const connectionInfo = {} as any;

    it("should keep explicit subdomain requests on the default domain", () => {
        expect(resolveRequestedHostname({
            type: "initialise",
            clientId: "client-1",
            subdomain: "Docs",
            connectionInfo
        }, "tunnelmole.com", false)).toEqual({
            subdomain: "docs",
            hostname: "docs.tunnelmole.com"
        });
    });

    it("should accept domain requests that target the default domain even when custom domains are blocked", () => {
        expect(resolveRequestedHostname({
            type: "initialise",
            clientId: "client-1",
            domain: "Docs.Tunnelmole.com",
            connectionInfo
        }, "tunnelmole.com", false)).toEqual({
            subdomain: "docs",
            hostname: "docs.tunnelmole.com"
        });
    });

    it("should ignore custom domains when they are blocked", () => {
        expect(resolveRequestedHostname({
            type: "initialise",
            clientId: "client-1",
            domain: "docs.example.com",
            connectionInfo
        }, "tunnelmole.com", false)).toBeUndefined();
    });

    it("should allow custom domains when enabled", () => {
        expect(resolveRequestedHostname({
            type: "initialise",
            clientId: "client-1",
            domain: "docs.example.com",
            connectionInfo
        }, "tunnelmole.com", true)).toEqual({
            hostname: "docs.example.com"
        });
    });
});

describe("extractSubdomain", () => {
    it("should return the requested subdomain for the default domain", () => {
        expect(extractSubdomain("preview.tunnelmole.com", "tunnelmole.com")).toBe("preview");
    });

    it("should return undefined when the hostname does not match the default domain", () => {
        expect(extractSubdomain("preview.example.com", "tunnelmole.com")).toBeUndefined();
    });
});

import { deleteReservedDomain } from "../repository/reserved-subdomain-repository";
import { isAuthorizedApiKey } from "../authentication/api-key";
import unreserveSubdomain from "./unreserve-subdomain";

jest.mock("../repository/reserved-subdomain-repository", () => ({
    deleteReservedDomain: jest.fn()
}));

jest.mock("../authentication/api-key", () => ({
    isAuthorizedApiKey: jest.fn()
}));

const mockedDeleteReservedDomain = deleteReservedDomain as jest.MockedFunction<typeof deleteReservedDomain>;
const mockedIsAuthorizedApiKey = isAuthorizedApiKey as jest.MockedFunction<typeof isAuthorizedApiKey>;

const createResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis()
    };
};

describe("unreserveSubdomain", () => {
    it("returns 401 and does not delete when the api key is invalid", async () => {
        mockedIsAuthorizedApiKey.mockReturnValue(false);

        const request = {
            body: Buffer.from(JSON.stringify({ apiKey: "invalid-api-key", subdomain: "example" }))
        };
        const response = createResponse();

        await unreserveSubdomain(request as any, response as any);

        expect(mockedDeleteReservedDomain).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.send).toHaveBeenCalledWith("Unauthorized");
        expect(response.end).not.toHaveBeenCalled();
    });

    it("returns 401 and does not delete when the api key is missing", async () => {
        mockedIsAuthorizedApiKey.mockReturnValue(false);

        const request = {
            body: Buffer.from(JSON.stringify({ subdomain: "example" }))
        };
        const response = createResponse();

        await unreserveSubdomain(request as any, response as any);

        expect(mockedDeleteReservedDomain).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.send).toHaveBeenCalledWith("Unauthorized");
    });

    it("deletes the reservation when the api key is valid", async () => {
        mockedIsAuthorizedApiKey.mockReturnValue(true);

        const request = {
            body: Buffer.from(JSON.stringify({ apiKey: "valid-api-key", subdomain: "example" }))
        };
        const response = createResponse();

        await unreserveSubdomain(request as any, response as any);

        expect(mockedDeleteReservedDomain).toHaveBeenCalledWith("valid-api-key", "example");
        expect(response.status).toHaveBeenCalledWith(204);
        expect(response.end).toHaveBeenCalled();
    });
});

afterEach(() => {
    jest.resetAllMocks();
});

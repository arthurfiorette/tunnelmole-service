import {
    addReservedDomain,
    countReservedDomainsByApiKey,
    findSubdomainsNotBelongingToApiKey
} from "../repository/reserved-subdomain-repository";
import { DOMAIN_ALREADY_RESERVED, SUCCESS, reserveDomain } from "./reserved-domain";

jest.mock("../repository/reserved-subdomain-repository", () => ({
    addReservedDomain: jest.fn(),
    countReservedDomainsByApiKey: jest.fn(),
    findSubdomainsNotBelongingToApiKey: jest.fn()
}));

const mockedAddReservedDomain = addReservedDomain as jest.MockedFunction<typeof addReservedDomain>;
const mockedCountReservedDomainsByApiKey = countReservedDomainsByApiKey as jest.MockedFunction<typeof countReservedDomainsByApiKey>;
const mockedFindSubdomainsNotBelongingToApiKey = findSubdomainsNotBelongingToApiKey as jest.MockedFunction<typeof findSubdomainsNotBelongingToApiKey>;

describe("reserveDomain", () => {
    it("should return success if no other users own this subdomain", async () => {
        mockedFindSubdomainsNotBelongingToApiKey.mockImplementation(async() => {
            return Promise.resolve(undefined);
        });
        mockedCountReservedDomainsByApiKey.mockResolvedValue(0);
        mockedAddReservedDomain.mockResolvedValue(undefined);

        const reservedDomain = { apiKey: "test-api-key", subdomain: "example" };
        const result = await reserveDomain(reservedDomain);
        expect(result).toBe(SUCCESS);
    });

    it("should return an error if the domain is already reserved by a different apiKey", async () => {
        mockedFindSubdomainsNotBelongingToApiKey.mockImplementation(async () => {
            return Promise.resolve({ 
                apiKey: "other-api-key", 
                subdomain: "example" 
            });
        });

        const reservedDomain = { apiKey: "test-api-key", subdomain: "example" };
        const result = await reserveDomain(reservedDomain);
        expect(result).toBe(DOMAIN_ALREADY_RESERVED);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});

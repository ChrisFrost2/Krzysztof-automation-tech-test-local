import { test, expect } from '@playwright/test';
import { ApiClient } from './common/apiClient';

let context: ApiClient;
test.describe(`API Tests for 'fn-techtest-ase'`, { tag: '@api' }, () => {
    test.beforeEach(async ({ request }) => {
        context = new ApiClient(request);
    });

    test('should return list of companies for valid exchange symbol', async ({ request }) => {
        const exchangeSymbol = 'ASX';
        const response = await context.get(`/exchanges/${exchangeSymbol}/companies`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const companies = await response.json();
        expect(companies.length).toBeGreaterThan(0);
        expect(companies[0]).toHaveProperty("sector");
        expect(companies[0]).toHaveProperty("country");
        expect(companies[0]).toHaveProperty("fullTimeEmployees");
        expect(companies[0]).toHaveProperty("symbol");
        expect(companies[0]).toHaveProperty("name");
        expect(companies[0]).toHaveProperty("price");
        expect(companies[0]).toHaveProperty("exchange");
        expect(companies[0]).toHaveProperty("exchangeShortName");
        expect(companies[0]).toHaveProperty("type");

        // {
        //     "sector": "Basic Materials",
        //         "country": "US",
        //             "fullTimeEmployees": "2000",
        //                 "symbol": "NEU",
        //                     "name": "Neuren Pharmaceuticals Limited",
        //                         "price": null,
        //                             "exchange": "Australian Securities Exchange",
        //                                 "exchangeShortName": "ASX",
        //                                     "type": "stock"
        // },
    });

    test('should return 404 or empty list for unknown exchange symbol', async ({ request }) => {
        const exchangeSymbol = 'UNKNOWN';
        const response = await context.get(`/exchanges/${exchangeSymbol}/companies`);

        expect([404, 200]).toContain(response.status());
        if (response.status() === 200) {
            const body = await response.json();
            expect(body.length).toBe(0);
        }
    });

    test('should return 404 or empty list for missing exchange symbol', async ({ request }) => {
        const response = await context.get(`/exchanges//companies`);

        expect([404, 200]).toContain(response.status());
        if (response.status() === 200) {
            const body = await response.json();
            expect(body.length).toBe(0);
        }
    });

    test('should return status code 401 Unauthorized for wrong Api Key', async ({ request }) => {
        const response = await request.get(`${context.baseURL}/exchanges/NDAQ/companies?code=wrongApiKey`);
        expect(response.status()).toBe(401);
    });

    // --------------------- extra tests samples for schema  ---------------------
    test('API returns valid company schema - first option', async ({ request }) => {
        const exchangeSymbol = 'ASX';
        const response = await context.get(`/exchanges/${exchangeSymbol}/companies`);
        const companies = await response.json();
        expect(companies.length).toBeGreaterThan(0);
        const company = companies.find(c => c.name === 'Genetic Signatures Limited');
        expect(company).toBeTruthy();
        
        expect(company).toHaveProperty("sector");
        expect(company).toHaveProperty("country");
        expect(company).toHaveProperty("fullTimeEmployees");
        expect(company).toHaveProperty("symbol");
        expect(company).toHaveProperty("name");
        expect(company).toHaveProperty("price");
        expect(company).toHaveProperty("exchange");
        expect(company).toHaveProperty("exchangeShortName");
        expect(company).toHaveProperty("type");

        expect(typeof company.name).toBe('string');
        expect(typeof company.sector).toBe('string');
        expect(typeof company.fullTimeEmployees).toBe('string');
        expect(company.symbol).toMatch(/^\w{3}$/);
    });

    test('API returns valid company schema - second option', async ({ request }) => {
        const exchangeSymbol = 'ASX';
        const response = await context.get(`/exchanges/${exchangeSymbol}/companies`);
        expect(response.status()).toBe(200);

        const companies = await response.json();
        expect(companies.length).toBeGreaterThan(0);
        const company = companies.find(c => c.name === 'Genetic Signatures Limited');
        expect(company).toBeTruthy();

        expect(company).toEqual(expect.objectContaining({
            "sector": "Basic Materials",
            "country": "CA",
            "fullTimeEmployees": "652",
            "symbol": "GSS",
            "name": "Genetic Signatures Limited",
            "price": null,
            "exchange": "Australian Securities Exchange",
            "exchangeShortName": "ASX",
            "type": "stock"
        }));
    });
});
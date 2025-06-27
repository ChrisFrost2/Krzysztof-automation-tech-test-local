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

    test('should return status sode 401 Unauthorized for wrong Api Key', async ({ request }) => {
        const response = await request.get(`${context.baseURL}/exchanges/NDAQ/companies?code=wrongApiKey`);
        expect(response.status()).toBe(401);
    });
});
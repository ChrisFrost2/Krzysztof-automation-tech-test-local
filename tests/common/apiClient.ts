import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  readonly baseURL: string = `https://fn-techtest-ase.azurewebsites.net/api`;
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  public async get(urlPortfix: string) {
    const url = `${this.baseURL}${urlPortfix}`;
    try {
      return await this.request.get(`${url}?code=${process.env.API_KEY}`);
    } catch (error) {
      throw new Error(`Error during GET ${url}: ${error}`);
    }
  }
}
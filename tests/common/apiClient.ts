import { APIRequestContext } from "@playwright/test";
import { Post } from "./types";

export class ApiClient {
  readonly baseURL: string = `https://fn-techtest-ase.azurewebsites.net/api`;
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  public async get(urlPortfix: string) {
    //return await this.request.get(`${this.baseURL}/${urlPortfix}?code=IbqMIOfPtEQ-qmUKdhFsOkllkRqcgJ9P4AZRW41wVr_ZAzFuM79Vyw%3D%3D`);       
    return await this.request.get(`${this.baseURL}/${urlPortfix}?code=${process.env.API_KEY}`);                      
  }  
}
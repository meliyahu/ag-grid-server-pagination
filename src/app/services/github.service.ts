import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  url = 'https://api.github.com/users/vega/repos?';

  constructor(private http: HttpClient) { }

  getGitHubUsers(page: number, perPage: number) {
    console.log(`getGitHubUsers fired with page=${page} and perPage=${perPage}`);
    return this.http.get<User[]>(`${this.url}page=${page}&per_page=${perPage}`);
  }
}

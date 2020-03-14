import { ClientOption, GitlabGraphqlClient } from './client/gitlab-graphql-client';
import { Issue, MergeRequest, Repo } from './basic/data-types';
import { getBasicInfo } from './query/basic-info';
import { getIssues } from './query/issues';
import { getMergeRequests } from './query/merge-requests';
import { getRepo } from './query/repo';

export class GitlabDataFetcher {
  private client: GitlabGraphqlClient;

  constructor(options: ClientOption) {
    if (!options.host) {
      throw new Error('Host param needed.')
    }
    if (!options.token) {
      throw new Error('You need to specify a personal access token to fetch data.');
    }
    this.client = new GitlabGraphqlClient(options);
  }

  public async getBasicInfo(fullPath: string) {
    return getBasicInfo(this.client, fullPath);
  }

  public async getIssues(fullPath: string, icount?: number, updatedAfter?: Date): Promise<Issue[]> {
    return getIssues(this.client, fullPath, icount, updatedAfter);
  }

  public async getMergeRequests(fullPath: string, pcount?: number): Promise<MergeRequest[]> {
    return getMergeRequests(this.client, fullPath, pcount);
  }

  public async getRepo(fullPath: string, icount?: number, pcount?: number): Promise<Repo> {
    return getRepo(this.client, fullPath, icount, pcount);
  }

}
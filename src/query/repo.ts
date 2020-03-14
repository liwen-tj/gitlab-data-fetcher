import { Repo } from '../basic/data-types';
import { GitlabGraphqlClient } from '../client/gitlab-graphql-client';
import { getIssues } from './issues';
import { getMergeRequests } from './merge-requests';
import { getBasicInfo } from './basic-info';


export async function getRepo(client: GitlabGraphqlClient, fullPath: string, icount?: number, pcount?: number): Promise<Repo> {


  const basicInfo = await getBasicInfo(client, fullPath);
  const issue = await getIssues(client, fullPath, icount);
  const mergeRequest = await getMergeRequests(client, fullPath, pcount);

  return {
    ...basicInfo,
    issues: issue,
    mergeRequests: mergeRequest,
  };

}

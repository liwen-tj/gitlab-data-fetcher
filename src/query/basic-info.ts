import { BasicInfo } from '../basic/data-types';
import { GitlabGraphqlClient } from '../client/gitlab-graphql-client';

const basicInfoQuery = `query basicInfoQuery($fullPath: ID!){
  project(fullPath: $fullPath){
    id
    name: path
    createdAt
    updatedAt: lastActivityAt
    description
    starCount
    forkCount: forksCount
  }
}
`;

export async function getBasicInfo(client: GitlabGraphqlClient, fullPath: string): Promise<BasicInfo> {
  const basicInfo = JSON.parse(await client.query(basicInfoQuery, { fullPath })).data.project;
  return {
    id: (() => {
      const x = basicInfo.id.split('/');
      return x[x.length - 1];
    })(),
    owner: fullPath.split('/')[0],
    name: basicInfo.name,
    createdAt: new Date(basicInfo.createdAt),
    updatedAt: new Date(basicInfo.updatedAt),
    description: basicInfo.description,
    starCount: basicInfo.starCount,
    forkCount: basicInfo.forkCount,
  }
}

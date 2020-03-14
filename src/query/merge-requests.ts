import { MergeRequest } from '../basic/data-types';
import { GitlabGraphqlClient } from '../client/gitlab-graphql-client';

const mergerequest_query = `query mergerequest_query($fullPath: ID!, $iids_list: [String!])
{
  project(fullPath: $fullPath) {
    mergeRequests(iids: $iids_list){
      edges{
        node{
          id: iid
          createdAt
          updatedAt
          title
          body: description
          comments: notes(first: 100){
            edges{
              node{
                id
                login: author{
                  username
                }
                body
                url: project{
                  webUrl
                }
                createdAt
              }
            }
          }
        }
      }
    }
  }
}
`;

interface RawMergeRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  body: string;
  comments: {
    edges: Array<{
      node: {
        id: string;
        login: {
          username: string;
        }
        body: string;
        url: {
          webUrl: string;
        }
        createdAt: string;
      },
    }>;
  };
}

function formatMergeRequest(pr: RawMergeRequest): MergeRequest {
  const mycomments = pr.comments.edges.map(x => {
    const info = x.node;
    const comment_id = (() => {
      const x = info.id.split('/');
      return Number(x[x.length - 1]);
    })();
    return {
      id: comment_id,
      login: info.login.username,
      body: info.body,
      url: `${info.url.webUrl}/merge_requests/${pr.id}/#note_${comment_id}`,
      createdAt: new Date(info.createdAt),
    };
  });
  return {
    id: pr.id,
    number: pr.id, // equal to id,
    createdAt: new Date(pr.createdAt),
    updatedAt: new Date(pr.updatedAt),
    title: pr.title,
    body: pr.body,
    comments: mycomments,
  };
}

export async function getMergeRequests(client: GitlabGraphqlClient, name: string, pcount?: number): Promise<MergeRequest[]> {
  // fetch 5 merge request each time in default.
  const icount = pcount ? pcount : 5;
  const arr = Array.from(Array(icount + 1).keys()).slice(1);
  let all_prs: MergeRequest[] = [];
  let base: number = 0;
  let return_length: number = icount;
  const MAX_TOLERANCE = 3;
  let tolerance = MAX_TOLERANCE; // just in case pr is deleted.
  let tmp = '';
  while (return_length === icount || tolerance > 0) {
    const iids = arr.map(a => (a + base).toString());
    base += icount;
    try {
      tmp = await client.query(mergerequest_query, {
        fullPath: name,
        iids_list: iids,
      });
      const res = JSON.parse(tmp);
      const raw_prs = res.data.project.mergeRequests.edges;
      return_length = raw_prs.length;
      const part_prs = raw_prs.map(x => formatMergeRequest(x.node));
      all_prs = all_prs.concat(part_prs);
    } catch (e) {
      console.log(e.message);
      console.log(tmp);
    }
    if (return_length === icount) {
      tolerance = MAX_TOLERANCE;
    } else if (return_length < icount && tolerance === MAX_TOLERANCE) {
      tolerance = MAX_TOLERANCE - 1;
    } else { // return_length < icount && tolerance < MAX_TOLERANCE
      if (return_length === 0) {
        tolerance -= 1;
      } else {
        tolerance = MAX_TOLERANCE - 1;
      }
    }
  }
  return all_prs;
}

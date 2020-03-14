import { GitlabDataFetcher } from '../src/gitlab-data-fetcher';

async function eg3() {
  let data_fetcher = new GitlabDataFetcher({
    host: 'https://gitlab.com/',
    token: 'L_BZXTzocna2y39nWz4T',
  });

  let issues = await data_fetcher.getMergeRequests("NTPsec/ntpsec");
  console.log(issues);
};

eg3();
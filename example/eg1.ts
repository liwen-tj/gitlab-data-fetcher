import { GitlabDataFetcher } from '../src/gitlab-data-fetcher';

async function eg1() {
  let data_fetcher = new GitlabDataFetcher({
    host: 'https://gitlab.com/',
    token: 'L_BZXTzocna2y39nWz4T',
  });

  let repos = await data_fetcher.getBasicInfo("gitlab-org/gitlab");
  console.log(repos);
};

eg1();
# Introduction
With `gitlab-data-fetcher`, you can easily get gitlab repo data. This project uses gitlab graphql api to get repo basic info, issues details and merge requests details. You don't have to worry about request failure as our `gitlab-graphql-client` has retry mechanism. To the best of my knowledge, gitlab has no rate limitation, which means with one token you can send as many requests as possible.

# Repo Info You can Get
Repo info consists of three parts. Details can be found in src/basic/DataTypes.ts
- basic-info
- issues
- merge-requests

# Usage
You need a token to authenticate. Login your gitlab platform, find `access token` from `settings`. You can generate a personal access token there.

Here is an example of getting basic info of `gitlab-org/gitlab` from `https://gitlab.com/`.
Aha, token in the following code has been out-of-date. You should use your own personal access token to run the code.

```typescript
let data_fetcher = new GitlabDataFetcher({
  host: 'https://gitlab.com/',
  token: 'L_BZXTzocna2y39nWz4T',
});

let basic = await data_fetcher.getBasicInfo("gitlab-org/gitlab");
console.log(basic);
```

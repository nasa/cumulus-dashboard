/* eslint-disable-next-line import/no-unresolved */
import { graphql } from '@octokit/graphql';

// Query Github API for first commit on target ref and see if it has an associated pull request
async function getPrsForRef(headRefName, baseRefName) {
  const queryResponse = await graphql(`{
    repository(owner:"nasa", name:"cumulus-dashboard") {
        name
        ref(qualifiedName: "${headRefName}") {
          name
          target {
            ... on Commit{
              history(first: 1) {
                nodes{
                  id
                  associatedPullRequests(last: 100) {
                    edges{
                      node{
                        title
                        state
                        headRefName
                        baseRefName
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
  }`, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  console.log(JSON.stringify(queryResponse));
  const { edges } = queryResponse.repository.ref.target.history.nodes[0].associatedPullRequests;
  const nodes = edges
    .map((x) => x.node)
    .filter(
      (node) => node.headRefName === headRefName && node.baseRefName === baseRefName
    );

  if (nodes.length > 0) {
    console.log(`Current commit is associated with a PR to ${baseRefName}: ${JSON.stringify(nodes)}`);
    process.exitCode = 100;
  } else {
    console.log(`Current commit is not associated with a PR to ${baseRefName}`);
  }
}

getPrsForRef(process.argv[2], process.argv[3]).catch((error) => {
  console.log('Error querying API');
  console.log(error);
  process.exitCode = 1;
});

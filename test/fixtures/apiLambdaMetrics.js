'use strict';

export const apiLambdaFixture = `{
  "took": 42,
  "timed_out": false,
  "_shards": {
    "total": 591,
    "successful": 591,
    "skipped": 571,
    "failed": 0
  },
  "hits": {
    "total": 17,
    "max_score": 0.0,
    "hits": []
  },
  "aggregations": {
    "2": {
      "buckets": {
        "LambdaAPIErrors": {
          "doc_count": 10
        },
        "LambdaAPISuccesses": {
          "doc_count": 4001
        }
      }
    }
  }
}`;

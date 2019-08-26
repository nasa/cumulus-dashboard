'use strict';

export const teaLambdaFixture = `{
  "took": 42,
  "timed_out": false,
  "_shards": {
    "total": 5991,
    "successful": 5901,
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
        "TEALambdaErrors": {
          "doc_count": 18
        },
        "TEALambdaSuccesses": {
          "doc_count": 34301
        }
      }
    }
  }
}`;

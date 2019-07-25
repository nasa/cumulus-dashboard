'use strict';

export const s3AccessFixture = `{
  "took": 49,
  "timed_out": false,
  "_shards": {
    "total": 591,
    "successful": 591,
    "skipped": 571,
    "failed": 0
  },
  "hits": {
    "total": 2,
    "max_score": 0.0,
    "hits": []
  },
  "aggregations": {
    "2": {
      "buckets": {
        "s3AccessFailures": {
          "doc_count": 1
        },
        "s3AccessSuccesses": {
          "doc_count": 200
        }
      }
    }
  }
}`;

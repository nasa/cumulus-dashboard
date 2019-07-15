'use strict';

export const apiGatewayFixture = `{
  "took": 424,
  "timed_out": false,
  "_shards": {
    "total": 581,
    "successful": 581,
    "skipped": 101,
    "failed": 0
  },
  "hits": {
    "total": 168,
    "max_score": 0.0,
    "hits": []
  },
  "aggregations": {
    "2": {
      "buckets": {
        "ApiAccessErrors": {
          "doc_count": 1
        },
        "ApiAccessSuccesses": {
          "doc_count": 20
        },
        "ApiExecutionSuccesses": {
          "doc_count": 7
        },
        "ApiExecutionErrors": {
          "doc_count": 0
        }
      }
    }
  }
}`;
// POST http://localhost:9201/_search/
// HTTP/1.1 200 OK
// content-type: application/json; charset=UTF-8
// content-length: 326
// Request duration: 0.567140s

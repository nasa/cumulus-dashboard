'use strict';

export const teaLambdaSearchTemplate = (prefix, startTimeEpochMilli, endTimeEpochMilli) => `{
  "aggs": {
    "2": {
      "filters": {
        "filters": {
          "TEALambdaErrors": {
            "query_string": {
              "query": "response_status:failure",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "TEALambdaSuccesses": {
            "query_string": {
              "query": "response_status:success",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          }
        }
      }
    }
  },
  "size": 0,
  "_source": {
    "excludes": []
  },
  "stored_fields": [
    "*"
  ],
  "script_fields": {},
  "docvalue_fields": [
    {
      "field": "@timestamp",
      "format": "date_time"
    }
  ],
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        },
        {
          "range": {
            "@timestamp": {
              "gte": ${startTimeEpochMilli},
              "lte": ${endTimeEpochMilli},
              "format": "epoch_millis"
            }
          }
        },
        {
          "match_phrase": {
            "_index": {
              "query": "${prefix}-cloudwatch*"
            }
          }
        },
        {
          "match_phrase": {
            "logGroup": {
              "query": "/aws/lambda/${prefix}-thin-egress-app-EgressLambda"
            }
          }
        }
      ],
      "filter": [],
      "should": [],
      "must_not": []
    }
  }
}`;

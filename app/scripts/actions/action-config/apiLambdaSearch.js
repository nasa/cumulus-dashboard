'use strict';

export const apiLambdaSearchString = `{
  "aggs": {
    "2": {
      "filters": {
        "filters": {
          "LambdaAPIErrors": {
            "query_string": {
              "query": "message:(+GET +HTTP -(200 307))",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "LambdaAPISuccesses": {
            "query_string": {
              "query": "message:(+GET +HTTP (200 307))",
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
              "gte": 1563205145243,
              "lte": 1563291545243,
              "format": "epoch_millis"
            }
          }
        },
        {
          "match_phrase": {
            "_index": {
              "query": "mhs4-cloudwatch*"
            }
          }
        },
        {
          "match_phrase": {
            "logGroup": {
              "query": "/aws/lambda/mhs4-ApiDistribution"
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

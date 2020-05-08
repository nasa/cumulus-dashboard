'use strict';

export const apiGatewaySearchTemplate = (prefix, startTimeEpochMilli, endTimeEpochMilli) => `{
  "aggs": {
    "2": {
      "filters": {
        "filters": {
          "ApiExecutionErrors": {
            "query_string": {
              "query": "+\\"Method completed with status:\\" +(4?? 5??)",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "ApiExecutionSuccesses": {
            "query_string": {
              "query": "+\\"Method completed with status:\\" +(2?? 3??)",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "ApiAccessErrors": {
            "query_string": {
              "query": "statusCode:[400 TO 599]",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "ApiAccessSuccesses": {
            "query_string": {
              "query": "statusCode:[200 TO 399]",
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
              "query": "\\"API\\\\-Gateway\\\\-Execution*\\""
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

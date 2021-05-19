export const apiLambdaSearchTemplate = (prefix, startTimeEpochMilli, endTimeEpochMilli) => `{
  "aggs": {
    "2": {
      "filters": {
        "filters": {
          "LambdaAPIErrors": {
            "query_string": {
              "query": "message:(+GET +HTTP +(4?? 5??) -(200 307))",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "LambdaAPISuccesses": {
            "query_string": {
              "query": "message:(+GET +HTTP +(2?? 3??))",
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
              "query": "/aws/lambda/${prefix}-ApiDistribution"
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

export default apiLambdaSearchTemplate;

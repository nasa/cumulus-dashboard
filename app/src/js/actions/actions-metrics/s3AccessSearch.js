export const s3AccessSearchTemplate = (prefix, startTimeEpochMilli, endTimeEpochMilli) => `{
  "aggs": {
    "2": {
      "filters": {
        "filters": {
          "s3AccessSuccesses": {
            "query_string": {
              "query": "response:200",
              "analyze_wildcard": true,
              "default_field": "*"
            }
          },
          "s3AccessFailures": {
            "query_string": {
              "query": "NOT response:200",
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
              "query": "${prefix}-s3*"
            }
          }
        },
        {
          "match_phrase": {
            "operation": {
              "query": "REST.GET.OBJECT"
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

export default s3AccessSearchTemplate;

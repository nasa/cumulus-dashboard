--
-- PostgreSQL database dump
--

-- Dumped from database version 10.17
-- Dumped by pg_dump version 10.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.providers (cumulus_id, name, protocol, host, port, username, password, global_connection_limit, private_key, cm_key_id, certificate_uri, created_at, updated_at) VALUES (1, 'PODAAC_SWOT', 's3', 'cumulus-test-sandbox-internal', NULL, NULL, NULL, 10, NULL, NULL, NULL, '2018-04-25 20:02:15.23+00', '2018-05-10 20:00:59.499+00');
INSERT INTO public.providers (cumulus_id, name, protocol, host, port, username, password, global_connection_limit, private_key, cm_key_id, certificate_uri, created_at, updated_at) VALUES (2, 's3_provider', 's3', 'cumulus-test-sandbox-internal', NULL, NULL, NULL, 10, NULL, NULL, NULL, '2018-10-09 17:09:03.69+00', '2018-10-09 17:09:03.69+00');


--
-- Name: providers_cumulus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.providers_cumulus_id_seq', 2, true);

--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.collections (cumulus_id, name, version, sample_file_name, granule_id_validation_regex, granule_id_extraction_regex, files, process, url_path, duplicate_handling, report_to_ems, ignore_files_config_for_discovery, meta, tags, created_at, updated_at) VALUES (1, 'https_testcollection', '001', '20170603090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1.nc', '^.*$', '^(.*)\.(nc|nc\.md5)$', '{}', NULL, NULL, 'replace', NULL, NULL, NULL, NULL, '2018-09-24 23:06:59.369+00', '2018-09-24 23:06:59.369+00');
INSERT INTO public.collections (cumulus_id, name, version, sample_file_name, granule_id_validation_regex, granule_id_extraction_regex, files, process, url_path, duplicate_handling, report_to_ems, ignore_files_config_for_discovery, meta, tags, created_at, updated_at) VALUES (2, 'MOD09GQ', '006', 'MOD09GQ.A2017025.h21v00.006.2017034065104.hdf', '^MOD09GQ\.A[\d]{7}\.[\S]{6}\.006\.[\d]{13}$', '(MOD09GQ\..*)(\.hdf|\.cmr|_ndvi\.jpg)', '{}', 'modis', '{cmrMetadata.Granule.Collection.ShortName}___{cmrMetadata.Granule.Collection.VersionId}/{substring(file.name, 0, 3)}', 'replace', NULL, NULL, NULL, NULL, '2018-09-24 23:06:59.503+00', '2018-09-24 23:06:59.503+00');
INSERT INTO public.collections (cumulus_id, name, version, sample_file_name, granule_id_validation_regex, granule_id_extraction_regex, files, process, url_path, duplicate_handling, report_to_ems, ignore_files_config_for_discovery, meta, tags, created_at, updated_at) VALUES (3, 'http_testcollection', '001', '20170603090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1.nc', '^.*$', '^(.*)\.(nc|nc\.md5)$', '{}', NULL, NULL, 'replace', NULL, NULL, NULL, NULL, '2018-09-24 23:06:59.471+00', '2018-09-24 23:06:59.471+00');
INSERT INTO public.collections (cumulus_id, name, version, sample_file_name, granule_id_validation_regex, granule_id_extraction_regex, files, process, url_path, duplicate_handling, report_to_ems, ignore_files_config_for_discovery, meta, tags, created_at, updated_at) VALUES (4, 'L2_HR_PIXC', '000', 'L2_HR_PIXC_product_0001-of-4154.h5', '^.*$', '^(.*)(\.h5|\.cmr)', '{}', NULL, NULL, 'replace', NULL, NULL, NULL, NULL, '2018-09-24 23:06:59.272+00', '2018-09-24 23:06:59.272+00');
INSERT INTO public.collections (cumulus_id, name, version, sample_file_name, granule_id_validation_regex, granule_id_extraction_regex, files, process, url_path, duplicate_handling, report_to_ems, ignore_files_config_for_discovery, meta, tags, created_at, updated_at) VALUES (5, 'MOD09GK', '006', 'MOD09GQ.A2017025.h21v00.006.2017034065104.hdf', '^MOD09GQ\.A[\d]{7}\.[\S]{6}\.006.[\d]{13}$', '(MOD09GQ\..*)(\.hdf|\.cmr|_ndvi\.jpg)', '{}', 'modis', '{cmrMetadata.Granule.Collection.ShortName}/{substring(file.name, 0, 3)}', 'replace', NULL, NULL, NULL, NULL, '2018-06-14 17:22:40.585+00', '2018-06-14 17:22:40.585+00');
INSERT INTO public.collections (cumulus_id, name, version, sample_file_name, granule_id_validation_regex, granule_id_extraction_regex, files, process, url_path, duplicate_handling, report_to_ems, ignore_files_config_for_discovery, meta, tags, created_at, updated_at) VALUES (6, 'Test-L2-Coastal', 'Operational/Near-Real-Time', 'test_20100818_002101_metopa_19866_eps_o_coa_1100_ovw.l2.nc', '^test_[0-9]{8}_[0-9]{6}_metopa_[0-9]{5}_eps_o_coa_[0-9]{4}_ovw\.l2$', '^(test_[0-9]{8}_[0-9]{6}_metopa_[0-9]{5}_eps_o_coa_[0-9]{4}_ovw\.l2)(\.tar\.gz)?((\.nc)|(\.cmr\.json)|(\.nc\.dmrpp))?$', '{}', NULL, '{cmrMetadata.CollectionReference.ShortName}', 'replace', NULL, NULL, '{}', NULL, '2018-06-14 17:22:40.585+00', '2018-06-14 17:22:40.585+00');


--
-- Name: collections_cumulus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.collections_cumulus_id_seq', 6, true);


--
-- Data for Name: executions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.executions (cumulus_id, arn, async_operation_cumulus_id, collection_cumulus_id, parent_cumulus_id, cumulus_version, url, status, tasks, error, workflow_name, duration, original_payload, final_payload, "timestamp", created_at, updated_at) VALUES (1, 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:7a71f849-57a0-40e7-8fca-5cf796602a07', NULL, NULL, NULL, NULL, 'https://console.aws.amazon.com/states/home?region=us-east-1#/executions/details/arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:7a71f849-57a0-40e7-8fca-5cf796602a07', 'running', '{"Report": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}}', '{"Cause": "{\"errorMessage\":\"Source file not found s3://cumulus-test-sandbox-internal/non-existent-path/non-existent-file\",\"errorType\":\"FileNotFound\",\"stackTrace\":[\"S3Granule.sync (/var/task/index.js:142314:13)\",\"<anonymous>\",\"process._tickDomainCallback (internal/process/next_tick.js:228:7)\"]}", "Error": "FileNotFound"}', 'ExampleWorkflow1', 26.6350002, NULL, NULL, '2018-11-13 17:11:39.323+00', '2018-11-13 17:11:11.756+00', '2018-11-13 17:11:38.391+00');
INSERT INTO public.executions (cumulus_id, arn, async_operation_cumulus_id, collection_cumulus_id, parent_cumulus_id, cumulus_version, url, status, tasks, error, workflow_name, duration, original_payload, final_payload, "timestamp", created_at, updated_at) VALUES (2, 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:c33e4091-e90d-449c-93f5-c4462b6e4e87', NULL, NULL, NULL, NULL, 'https://console.aws.amazon.com/states/home?region=us-east-1#/executions/details/arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:c33e4091-e90d-449c-93f5-c4462b6e4e87', 'failed', '{"StopStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}}', '{"Cause": "{\"errorMessage\":\"Source file not found s3://cumulus-test-sandbox-internal/non-existent-path/non-existent-file\",\"errorType\":\"FileNotFound\",\"stackTrace\":[\"S3Granule.sync (/var/task/index.js:142314:13)\",\"<anonymous>\",\"process._tickDomainCallback (internal/process/next_tick.js:228:7)\"]}", "Error": "FileNotFound"}', 'ExampleWorkflow2', 28.6940002, NULL, NULL, '2018-11-13 15:43:44.136+00', '2018-11-13 15:43:14.842+00', '2018-11-13 15:43:43.536+00');
INSERT INTO public.executions (cumulus_id, arn, async_operation_cumulus_id, collection_cumulus_id, parent_cumulus_id, cumulus_version, url, status, tasks, error, workflow_name, duration, original_payload, final_payload, "timestamp", created_at, updated_at) VALUES (3, 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationParsePdrStateMachine-JVlCKfoXElDQ:9888b858-d70c-42ec-a887-c9367dcfd7cf', NULL, NULL, NULL, NULL, 'https://console.aws.amazon.com/states/home?region=us-east-1#/executions/details/arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationParsePdrStateMachine-JVlCKfoXElDQ:9888b858-d70c-42ec-a887-c9367dcfd7cf', 'completed', '{"ParsePdr": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-ParsePdr:ParsePdr-2979f1f71736621607b0d6ccc9875dce4fdcccab", "name": "test-source-integration-ParsePdr", "version": "19"}, "StopStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}, "CheckStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-PdrStatusCheck:PdrStatusCheck-870b3ba8ae46bd75407798ef59cc1e459d363312", "name": "test-source-integration-PdrStatusCheck", "version": "19"}, "StatusReport": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}, "QueueGranules": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-QueueGranules:QueueGranules-5f5de321741f77e2d7f89f41f16498f02ce111cd", "name": "test-source-integration-QueueGranules", "version": "19"}}', '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'ExampleWorkflow3', 77.1039963, NULL, NULL, '2018-11-12 20:05:39.921+00', '2018-11-12 20:04:22.238+00', '2018-11-12 20:05:39.343+00');
INSERT INTO public.executions (cumulus_id, arn, async_operation_cumulus_id, collection_cumulus_id, parent_cumulus_id, cumulus_version, url, status, tasks, error, workflow_name, duration, original_payload, final_payload, "timestamp", created_at, updated_at) VALUES (4, 'arn:aws:states:us-east-1:012345678901:execution:test-stack-HelloWorldWorkflow:8e21ca0f-79d3-4782-8247-cacd42a595ea', NULL, NULL, NULL, NULL, 'https://console.aws.amazon.com/states/home?region=us-east-1#/executions/details/arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestGranuleStateMachine-MOyI0myKEXzf:8e21ca0f-79d3-4782-8247-cacd42a595ea', 'completed', '{"StopStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}, "ProcessingStep": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-FakeProcessing:FakeProcessing-ca2504cf11020f7a7a2b01304752adf11fa43a56", "name": "test-source-integration-FakeProcessing", "version": "35"}, "MoveGranuleStep": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-MoveGranules:MoveGranules-065967facfd624617685271a921be71a8c436f27", "name": "test-source-integration-MoveGranules", "version": "32"}, "SyncGranuleNoVpc": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SyncGranuleNoVpc:SyncGranuleNoVpc-71bf2cfeda020e9409a3f67293d1f7b8f42e0546", "name": "test-source-integration-SyncGranuleNoVpc", "version": "35"}}', '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'ExampleWorkflow4', 20.3649998, NULL, NULL, '2018-11-12 20:05:31.165+00', '2018-11-12 20:05:10.348+00', '2018-11-12 20:05:30.713+00');
INSERT INTO public.executions (cumulus_id, arn, async_operation_cumulus_id, collection_cumulus_id, parent_cumulus_id, cumulus_version, url, status, tasks, error, workflow_name, duration, original_payload, final_payload, "timestamp", created_at, updated_at) VALUES (5, 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationDiscoverAndQueuePdrsStateMachine-T4MDdDs9ADnK:c3ce6b76-a5f5-47d2-80a5-8b5c56300da8', NULL, NULL, NULL, NULL, 'https://console.aws.amazon.com/states/home?region=us-east-1#/executions/details/arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationDiscoverAndQueuePdrsStateMachine-T4MDdDs9ADnK:c3ce6b76-a5f5-47d2-80a5-8b5c56300da8', 'completed', '{"QueuePdrs": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-QueuePdrs:QueuePdrs-8e81d722bac219528d2be0ba8d8104a8cbb1bb04", "name": "test-source-integration-QueuePdrs", "version": "18"}, "StopStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}, "StartStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-852e08f1fd5e168685bed68ab05230471247aa2b", "name": "test-source-integration-SfSnsReport", "version": "18"}, "DiscoverPdrs": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-DiscoverPdrs:DiscoverPdrs-c155ebecc4d03a9a0a3737b844122643e93d3887", "name": "test-source-integration-DiscoverPdrs", "version": "19"}}', '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'ExampleWorkflow5', 13.1269999, NULL, NULL, '2018-11-12 20:04:24.551+00', '2018-11-12 20:04:10.795+00', '2018-11-12 20:04:23.922+00');
INSERT INTO public.executions (cumulus_id, arn, async_operation_cumulus_id, collection_cumulus_id, parent_cumulus_id, cumulus_version, url, status, tasks, error, workflow_name, duration, original_payload, final_payload, "timestamp", created_at, updated_at) VALUES (6, 'arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1', NULL, NULL, NULL, NULL, 'https://console.aws.amazon.com/states/home?region=us-east-1#/executions/details/arn:aws:states:us-east-1:123456789012:execution:TestSourceIntegrationIngestAndPublishGranuleStateMachine-yCAhWOss5Xgo:b313e777-d28a-435b-a0dd-f1fad08116t1', 'completed', '{"CmrStep": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-PostToCmr:PostToCmr-e7dd30c53fd4c8b13241e5c9ebfe6f92c148b6c0", "name": "test-source-integration-PostToCmr", "version": "30"}, "StopStatus": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SfSnsReport:SfSnsReport-d4c3a5a1e006ace8ad2368605afb331abdaf1431", "name": "test-source-integration-SfSnsReport", "version": "23"}, "ProcessingStep": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-FakeProcessing:FakeProcessing-769a215f9b18c5a0f376e25d2b4326c810baaaa8", "name": "test-source-integration-FakeProcessing", "version": "41"}, "MoveGranuleStep": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-MoveGranules:MoveGranules-0df332b0b971a1e01cac875e2c1497b0cab840fc", "name": "test-source-integration-MoveGranules", "version": "38"}, "SyncGranuleNoVpc": {"arn": "arn:aws:lambda:us-east-1:123456789012:function:test-source-integration-SyncGranuleNoVpc:SyncGranuleNoVpc-1baa8c522bf76a37ed6d577ebc3e5fdb678512e3", "name": "test-source-integration-SyncGranuleNoVpc", "version": "41"}}', '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'ExampleWorkflow6', 29.9710007, '{"pdr": {"name": "MOD09GQ_1granule_v3.PDR", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "size": 596, "time": 1520873050000}, "granules": [{"files": [{"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "fileSize": 17865615}, {"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf.met", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "fileSize": 44118}, {"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685_ndvi.jpg", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "fileSize": 44118}], "version": "006", "dataType": "MOD09GQ_test-test-source-integration-IngestGranuleSuccess-1544123771801", "granuleId": "MOD09GQ.A4826606.CX9u3i.006.1751203470685"}]}', '{"process": "modis", "granules": [{"files": [{"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "bucket": "test-source-integration-protected", "fileSize": 17865615, "filename": "s3://test-source-integration-protected/MOD09GQ___006/2017/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf", "filepath": "MOD09GQ___006/2017/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf", "url_path": "{cmrMetadata.Granule.Collection.ShortName}___{cmrMetadata.Granule.Collection.VersionId}/{extractYear(cmrMetadata.Granule.Temporal.RangeDateTime.BeginningDateTime)}/{substring(file.name, 0, 3)}", "duplicate_found": true}, {"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf.met", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "bucket": "test-source-integration-private", "fileSize": 44118, "filename": "s3://test-source-integration-private/MOD09GQ___006/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf.met", "filepath": "MOD09GQ___006/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685.hdf.met", "url_path": "{cmrMetadata.Granule.Collection.ShortName}___{cmrMetadata.Granule.Collection.VersionId}/{substring(file.name, 0, 3)}", "duplicate_found": true}, {"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685_ndvi.jpg", "path": "test-source-integration-IngestGranuleSuccess-1544123771801-test-data/files", "bucket": "test-source-integration-public", "fileSize": 44118, "filename": "s3://test-source-integration-public/MOD09GQ___006/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685_ndvi.jpg", "filepath": "MOD09GQ___006/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685_ndvi.jpg", "url_path": "{cmrMetadata.Granule.Collection.ShortName}___{cmrMetadata.Granule.Collection.VersionId}/{substring(file.name, 0, 3)}", "duplicate_found": true}, {"name": "MOD09GQ.A4826606.CX9u3i.006.1751203470685.cmr.xml", "bucket": "test-source-integration-protected-2", "filename": "s3://test-source-integration-protected-2/MOD09GQ___006/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685.cmr.xml", "filepath": "MOD09GQ___006/MOD/MOD09GQ.A4826606.CX9u3i.006.1751203470685.cmr.xml", "url_path": "{cmrMetadata.Granule.Collection.ShortName}___{cmrMetadata.Granule.Collection.VersionId}/{substring(file.name, 0, 3)}"}], "cmrLink": "https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224871669-CUMULUS", "version": "006", "dataType": "MOD09GQ_test-test-source-integration-IngestGranuleSuccess-1544123771801", "granuleId": "MOD09GQ.A4826606.CX9u3i.006.1751203470685", "published": true}]}', '2018-12-06 19:18:41.145+00', '2018-12-06 19:18:11.174+00', '2018-12-17 04:00:48.081+00');


--
-- Name: executions_cumulus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.executions_cumulus_id_seq', 6, true);


--
-- Data for Name: granules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (1, 'MOD09GQ.A1530852.CljGDp.006.2163412421938', 'completed', 2, '2018-09-24 23:29:16.154+00', '2018-09-24 23:29:43.389+00', true, 26.9659996, 0.00999999978, 0.100000001, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020882-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', NULL, NULL, NULL, NULL, '2018-09-24 23:29:43.729+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (2, 'test_12345678_123456_metopa_12345_eps_o_coa_1234_ovwcl2', 'completed', 6, '2018-09-24 23:29:16.154+00', '2018-09-24 23:29:43.389+00', true, 26.9659996, 0.00999999978, 0.100000001, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020882-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', NULL, NULL, NULL, NULL, '2018-09-24 23:29:43.729+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (3, 'MOD09GQ.A1657416.CbyoRi.006.9697917818587', 'running', 2, '2018-09-24 23:28:43.341+00', '2018-09-24 23:29:10.922+00', true, 14.8149996, 10.5410004, 0.300000012, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020881-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', '2018-09-24 23:28:45.731+00', NULL, NULL, NULL, '2018-09-24 23:29:11.216+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (4, 'MOD09GQ.A2016358.h13v04.006.2016360104606.hdf', 'completed', 2, '2018-09-24 23:27:50.335+00', '2018-09-24 23:27:57.777+00', false, 7.44199991, 0.00999999978, 2.86299992, 17909733, '{"Cause": "\"None\"", "Error": "Unknown Error"}', NULL, NULL, 2, NULL, NULL, NULL, NULL, '2018-09-24 23:27:55.872+00', NULL, NULL, '2018-09-24 23:27:58.152+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (5, 'MOD09GQ.A2016358.h13v04.006.2016360104606', 'completed', 2, '2018-11-12 20:05:10.348+00', '2020-07-31 13:52:24.157+00', false, 20.5720005, 0.00999999978, 0.342000008, 17911979, '{"Cause": "\"None\"", "Error": "Unknown Error"}', NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-07-31 13:52:24.626+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (6, 'MOD09GQ.A5456658.rso6Y4.006.4979096122140', 'completed', 2, '2018-09-24 23:11:06.647+00', '2018-09-24 23:11:33.542+00', true, 26.7010002, 0.0430000015, 0.432000011, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020880-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', NULL, NULL, NULL, NULL, '2018-09-24 23:11:33.975+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (7, 'MOD09GQ.A2417309.YZ9tCV.006.4640974889044', 'failed', 2, '2018-09-24 23:09:52.105+00', '2018-09-24 23:10:20.074+00', false, 27.9689999, 0.0430000015, 0.935000002, 17953851, '{"Cause": "{\"errorMessage\":\"verifyFile s3://cumulus-test-sandbox-internal/non-existent-path/non-existent-file failed: Actual file size 2MB did not match expected file size 3MB\",\"errorType\":\"UnexpectedFileSize\",\"stackTrace\":[\"S3Granule.sync (/var/task/index.js:147549:13)\",\"<anonymous>\",\"process._tickDomainCallback (internal/process/next_tick.js:228:7)\"]}", "Error": "UnexpectedFileSize"}', NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2018-09-24 23:10:20.568+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (8, 'MOD09GQ.A0142558.ee5lpE.006.5112577830916', 'completed', 2, '2018-09-24 17:53:10.359+00', '2018-09-24 17:53:36.392+00', true, 25.7520008, 0.300000012, 0.342000008, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020684-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', NULL, NULL, NULL, NULL, '2018-09-24 17:53:37.065+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (9, 'MOD09GQ.A0501579.PZB_CG.006.8580266395214', 'running', 2, '2018-09-24 17:52:32.232+00', '2018-09-24 17:53:06.313+00', true, 14.0109997, 9.88399982, 0.829999983, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020683-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', '2018-09-24 17:52:34.578+00', NULL, NULL, NULL, '2018-09-24 17:53:06.955+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (10, 'MOD09GQ.A8022119.sk3Sph.006.0494433853533', 'completed', 2, '2018-09-24 17:38:15.121+00', '2018-09-24 17:38:42.395+00', true, 26.9389992, 0.0299999993, 0.89200002, 17956339, '{"Cause": "\"None\"", "Error": "Unknown Error"}', 'https://cmr.uat.earthdata.nasa.gov/search/granules.json?concept_id=G1224020681-CUMULUS', NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524+00', NULL, NULL, NULL, NULL, '2018-09-24 17:38:42.632+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (11, 'MOD09GQ.A9344328.K9yI3O.006.4625818663028', 'failed', 2, '2018-09-24 17:29:51.858+00', '2018-09-24 17:30:18.839+00', false, 26.9810009, 0.300000012, 0.782999992, 17953851, '{"Cause": "{\"errorMessage\":\"Source file not found s3://cumulus-test-sandbox-internal/non-existent-path/non-existent-file\",\"errorType\":\"FileNotFound\",\"stackTrace\":[\"S3Granule.sync (/var/task/index.js:147549:13)\",\"<anonymous>\",\"process._tickDomainCallback (internal/process/next_tick.js:228:7)\"]}", "Error": "FileNotFound"}', NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2018-09-24 17:30:19.425+00');
INSERT INTO public.granules (cumulus_id, granule_id, status, collection_cumulus_id, created_at, updated_at, published, duration, time_to_archive, time_to_process, product_volume, error, cmr_link, pdr_cumulus_id, provider_cumulus_id, beginning_date_time, ending_date_time, last_update_date_time, processing_end_date_time, processing_start_date_time, production_date_time, query_fields, "timestamp") VALUES (12, 'MOD09GQ.A4622742.B7A8Ma.006.7857260550036', 'completed', 2, '2019-12-11 23:19:23.823+00', '2019-12-11 23:19:31.468+00', false, 7.546, 0.00999999978, 0.317999989, 2488, '{"Cause": "None", "Error": "Unknown Error"}', NULL, NULL, 2, '2017-10-24 00:00:00+00', '2017-11-08 23:59:59+00', '2018-04-25 21:45:45.524053+00', '2019-12-11 23:19:30.946+00', '2019-12-11 23:19:23.823+00', '2018-07-19 12:01:01+00', NULL, '2019-12-11 23:19:31.369+00');


--
-- Name: granules_cumulus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.granules_cumulus_id_seq', 12, true);


--
-- Data for Name: granules_executions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (1, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (1, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (1, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (1, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (1, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (1, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (2, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (2, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (2, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (2, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (2, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (2, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (3, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (3, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (3, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (3, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (3, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (3, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (4, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (4, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (4, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (4, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (4, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (4, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (5, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (5, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (5, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (5, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (5, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (5, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (6, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (6, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (6, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (6, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (6, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (6, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (7, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (7, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (7, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (7, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (7, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (7, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (8, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (8, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (8, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (8, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (8, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (8, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (9, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (9, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (9, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (9, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (9, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (9, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (10, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (10, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (10, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (10, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (10, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (10, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (11, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (11, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (11, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (11, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (11, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (11, 6);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (12, 1);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (12, 2);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (12, 3);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (12, 4);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (12, 5);
INSERT INTO public.granules_executions (granule_cumulus_id, execution_cumulus_id) VALUES (12, 6);

--
-- Data for Name: rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rules (cumulus_id, name, workflow, collection_cumulus_id, provider_cumulus_id, type, enabled, value, arn, log_event_arn, execution_name_prefix, payload, meta, tags, queue_url, created_at, updated_at) VALUES (1, 'MOD09GK_TEST_kinesisRule', 'HelloWorldWorkflow', 2, 1, 'onetime', true, NULL, NULL, NULL, NULL, NULL, '{"cnmResponseStream": "test-src-integration-cnmResponseStream"}', NULL, NULL, '2018-09-28 03:31:13.704+00', '2018-09-28 03:31:13.704+00');


--
-- Name: rules_cumulus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rules_cumulus_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--


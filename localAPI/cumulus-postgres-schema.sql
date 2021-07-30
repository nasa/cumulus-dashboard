--
-- PostgreSQL database dump
--

-- Dumped from database version 10.17
-- Dumped by pg_dump version 10.17

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

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
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: async_operations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.async_operations (
    cumulus_id integer NOT NULL,
    id uuid NOT NULL,
    description text NOT NULL,
    operation_type text NOT NULL,
    output jsonb,
    status text NOT NULL,
    task_arn text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT async_operations_operation_type_check CHECK ((operation_type = ANY (ARRAY['ES Index'::text, 'Bulk Granules'::text, 'Bulk Granule Reingest'::text, 'Bulk Granule Delete'::text, 'Dead-Letter Processing'::text, 'Kinesis Replay'::text, 'Reconciliation Report'::text, 'Migration Count Report'::text, 'Data Migration'::text]))),
    CONSTRAINT async_operations_status_check CHECK ((status = ANY (ARRAY['RUNNING'::text, 'SUCCEEDED'::text, 'RUNNER_FAILED'::text, 'TASK_FAILED'::text])))
);


--
-- Name: COLUMN async_operations.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.async_operations.id IS 'Unique ID for async operation';


--
-- Name: COLUMN async_operations.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.async_operations.description IS 'description for async operation';


--
-- Name: COLUMN async_operations.operation_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.async_operations.operation_type IS 'type of async operation';


--
-- Name: COLUMN async_operations.output; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.async_operations.output IS 'output of completed async operation';


--
-- Name: COLUMN async_operations.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.async_operations.status IS 'async operation status';


--
-- Name: COLUMN async_operations.task_arn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.async_operations.task_arn IS 'async operation ECS task ARN';


--
-- Name: async_operations_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.async_operations_cumulus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: async_operations_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.async_operations_cumulus_id_seq OWNED BY public.async_operations.cumulus_id;


--
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    cumulus_id integer NOT NULL,
    name text NOT NULL,
    version text NOT NULL,
    sample_file_name text NOT NULL,
    granule_id_validation_regex text NOT NULL,
    granule_id_extraction_regex text NOT NULL,
    files jsonb NOT NULL,
    process text,
    url_path text,
    duplicate_handling text,
    report_to_ems boolean,
    ignore_files_config_for_discovery boolean,
    meta jsonb,
    tags jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT collections_duplicate_handling_check CHECK ((duplicate_handling = ANY (ARRAY['error'::text, 'replace'::text, 'skip'::text, 'version'::text])))
);


--
-- Name: COLUMN collections.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.name IS 'Collection short_name registered with the CMR';


--
-- Name: COLUMN collections.version; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.version IS 'The version registered with the CMR';


--
-- Name: COLUMN collections.sample_file_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.sample_file_name IS 'Example filename for this collection';


--
-- Name: COLUMN collections.granule_id_validation_regex; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.granule_id_validation_regex IS 'The regular expression used to validate the granule ID extracted from filenames according to the granuleIdExtraction';


--
-- Name: COLUMN collections.granule_id_extraction_regex; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.granule_id_extraction_regex IS 'The regular expression used to extract the granule ID from filenames';


--
-- Name: COLUMN collections.files; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.files IS 'List of collection file definitions';


--
-- Name: COLUMN collections.process; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.process IS 'Name of the docker process to be used, e.g. modis, aster';


--
-- Name: COLUMN collections.url_path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.url_path IS 'The folder (url) used to save granules on S3 buckets';


--
-- Name: COLUMN collections.duplicate_handling; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.duplicate_handling IS 'Duplicate handling behavior for this collection';


--
-- Name: COLUMN collections.report_to_ems; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.report_to_ems IS 'Flag to set if this collection should be reported to EMS';


--
-- Name: COLUMN collections.ignore_files_config_for_discovery; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.ignore_files_config_for_discovery IS 'When true, ignore the collection files config list for determining which files to ingest for a granule. When false, ingest only files that match a regex in the colletion files config list';


--
-- Name: COLUMN collections.meta; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.meta IS 'Collection meta object';


--
-- Name: COLUMN collections.tags; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.collections.tags IS 'JSON encoded array of collection tags';


--
-- Name: collections_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collections_cumulus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: collections_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collections_cumulus_id_seq OWNED BY public.collections.cumulus_id;


--
-- Name: executions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.executions (
    cumulus_id integer NOT NULL,
    arn text NOT NULL,
    async_operation_cumulus_id integer,
    collection_cumulus_id integer,
    parent_cumulus_id integer,
    cumulus_version text,
    url text,
    status text NOT NULL,
    tasks jsonb,
    error jsonb,
    workflow_name text,
    duration real,
    original_payload jsonb,
    final_payload jsonb,
    "timestamp" timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT executions_status_check CHECK ((status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text, 'unknown'::text])))
);


--
-- Name: COLUMN executions.arn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.arn IS 'Execution ARN';


--
-- Name: COLUMN executions.cumulus_version; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.cumulus_version IS 'Cumulus version for the execution';


--
-- Name: COLUMN executions.url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.url IS 'Execution page url on AWS console';


--
-- Name: COLUMN executions.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.status IS 'Execution status';


--
-- Name: COLUMN executions.tasks; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.tasks IS 'List of completed workflow tasks';


--
-- Name: COLUMN executions.error; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.error IS 'Error details in case of a failed execution';


--
-- Name: COLUMN executions.workflow_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.workflow_name IS 'Name of the Cumulus workflow run in this execution';


--
-- Name: COLUMN executions.duration; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.duration IS 'Execution duration';


--
-- Name: COLUMN executions.original_payload; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.original_payload IS 'Original payload of this workflow';


--
-- Name: COLUMN executions.final_payload; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions.final_payload IS 'Final payload of this workflow';


--
-- Name: COLUMN executions."timestamp"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.executions."timestamp" IS 'Execution timestamp';


--
-- Name: executions_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.executions_cumulus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: executions_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.executions_cumulus_id_seq OWNED BY public.executions.cumulus_id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.files (
    cumulus_id bigint NOT NULL,
    granule_cumulus_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_size bigint,
    bucket text NOT NULL,
    checksum_type text,
    checksum_value text,
    file_name text,
    key text NOT NULL,
    path text,
    source text
);


--
-- Name: COLUMN files.cumulus_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.cumulus_id IS 'Internal Cumulus ID for a file';


--
-- Name: COLUMN files.file_size; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.file_size IS 'Size of file (bytes)';


--
-- Name: COLUMN files.bucket; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.bucket IS 'AWS Bucket file is archived in';


--
-- Name: COLUMN files.checksum_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.checksum_type IS 'Type of file checksum (e.g. md5';


--
-- Name: COLUMN files.checksum_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.checksum_value IS 'File checksum';


--
-- Name: COLUMN files.file_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.file_name IS 'Source file name';


--
-- Name: COLUMN files.key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.key IS 'AWS S3 key file is archived at';


--
-- Name: COLUMN files.path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.path IS 'Source file path';


--
-- Name: COLUMN files.source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.files.source IS 'Full source path s3/ftp/sftp/http URI to granule';


--
-- Name: files_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.files_cumulus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: files_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.files_cumulus_id_seq OWNED BY public.files.cumulus_id;


--
-- Name: granules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.granules (
    cumulus_id bigint NOT NULL,
    granule_id text NOT NULL,
    status text NOT NULL,
    collection_cumulus_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published boolean,
    duration real,
    time_to_archive real,
    time_to_process real,
    product_volume bigint,
    error jsonb,
    cmr_link text,
    pdr_cumulus_id integer,
    provider_cumulus_id integer,
    beginning_date_time timestamp with time zone,
    ending_date_time timestamp with time zone,
    last_update_date_time timestamp with time zone,
    processing_end_date_time timestamp with time zone,
    processing_start_date_time timestamp with time zone,
    production_date_time timestamp with time zone,
    query_fields jsonb,
    "timestamp" timestamp with time zone,
    CONSTRAINT granules_status_check CHECK ((status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text])))
);


--
-- Name: COLUMN granules.cumulus_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.cumulus_id IS 'Internal Cumulus ID for a granule';


--
-- Name: COLUMN granules.granule_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.granule_id IS 'Granule ID';


--
-- Name: COLUMN granules.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.status IS 'Ingest status of the granule';


--
-- Name: COLUMN granules.published; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.published IS 'Flag that shows if the granule has been published in CMR';


--
-- Name: COLUMN granules.duration; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.duration IS 'Ingest duration';


--
-- Name: COLUMN granules.time_to_archive; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.time_to_archive IS 'Number of seconds granule took to archive';


--
-- Name: COLUMN granules.time_to_process; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.time_to_process IS 'Number seconds granule took to complete "processing"';


--
-- Name: COLUMN granules.error; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.error IS 'JSON error object';


--
-- Name: COLUMN granules.cmr_link; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.cmr_link IS 'Link to granule in the CMR API';


--
-- Name: COLUMN granules.beginning_date_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.beginning_date_time IS 'Date granule started';


--
-- Name: COLUMN granules.ending_date_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.ending_date_time IS 'Date granule completed';


--
-- Name: COLUMN granules.last_update_date_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.last_update_date_time IS 'Timestap for last update';


--
-- Name: COLUMN granules.processing_end_date_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.processing_end_date_time IS 'Date granule finished processing';


--
-- Name: COLUMN granules.processing_start_date_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.processing_start_date_time IS 'Date granule started processing';


--
-- Name: COLUMN granules.production_date_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.production_date_time IS 'Timestamp for granule production date/time';


--
-- Name: COLUMN granules.query_fields; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.granules.query_fields IS 'Arbitrary query fields for the granule';


--
-- Name: granules_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.granules_cumulus_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: granules_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.granules_cumulus_id_seq OWNED BY public.granules.cumulus_id;


--
-- Name: granules_executions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.granules_executions (
    granule_cumulus_id integer NOT NULL,
    execution_cumulus_id integer NOT NULL
);


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: pdrs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pdrs (
    cumulus_id integer NOT NULL,
    collection_cumulus_id integer NOT NULL,
    provider_cumulus_id integer NOT NULL,
    execution_cumulus_id integer,
    status text NOT NULL,
    name text NOT NULL,
    progress real,
    pan_sent boolean,
    pan_message text,
    stats jsonb,
    address text,
    original_url text,
    duration real,
    "timestamp" timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pdrs_status_check CHECK ((status = ANY (ARRAY['running'::text, 'failed'::text, 'completed'::text])))
);


--
-- Name: COLUMN pdrs.cumulus_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.cumulus_id IS 'Internal Cumulus ID for a PDR';


--
-- Name: COLUMN pdrs.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.status IS 'Status (running, failed, completed) of the PDR';


--
-- Name: COLUMN pdrs.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.name IS 'PDR name';


--
-- Name: COLUMN pdrs.progress; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.progress IS 'PDR completion progress percentage';


--
-- Name: COLUMN pdrs.pan_sent; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.pan_sent IS 'Boolean defining if a PAN response has been sent for this PDR';


--
-- Name: COLUMN pdrs.pan_message; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.pan_message IS 'PAN message text';


--
-- Name: COLUMN pdrs.stats; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs.stats IS 'PDR stats json object';


--
-- Name: COLUMN pdrs."timestamp"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.pdrs."timestamp" IS 'PDR timestamp';


--
-- Name: pdrs_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pdrs_cumulus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pdrs_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pdrs_cumulus_id_seq OWNED BY public.pdrs.cumulus_id;


--
-- Name: providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.providers (
    cumulus_id integer NOT NULL,
    name text NOT NULL,
    protocol text DEFAULT 'http'::text NOT NULL,
    host text NOT NULL,
    port integer,
    username text,
    password text,
    global_connection_limit integer,
    private_key text,
    cm_key_id text,
    certificate_uri text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT providers_protocol_check CHECK ((protocol = ANY (ARRAY['http'::text, 'https'::text, 'ftp'::text, 'sftp'::text, 's3'::text])))
);


--
-- Name: COLUMN providers.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.name IS 'Provider name';


--
-- Name: COLUMN providers.protocol; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.protocol IS 'Protocol for the provider';


--
-- Name: COLUMN providers.host; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.host IS 'Host name for the provider';


--
-- Name: COLUMN providers.port; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.port IS 'Port name for accessing the provider';


--
-- Name: COLUMN providers.username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.username IS 'Username for accessing the provider';


--
-- Name: COLUMN providers.password; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.password IS 'Password for accessing the provider';


--
-- Name: COLUMN providers.global_connection_limit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.global_connection_limit IS 'Maximum number of allowed concurrent connections to this provider';


--
-- Name: COLUMN providers.private_key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.private_key IS '
        Private key for accessing the provider, if necessary.
        Should specify a filename that is assumed to exist at
        s3://<your-internal-bucket>/<stack-name>/crypto
      ';


--
-- Name: COLUMN providers.cm_key_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.cm_key_id IS 'AWS KMS Customer Master Key ARN or alias for decrypting credentials';


--
-- Name: COLUMN providers.certificate_uri; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.providers.certificate_uri IS 'S3 URI (e.g. s3://bucket/key) for custom or self-signed SSL (TLS) certificate to access provider';


--
-- Name: providers_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.providers_cumulus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: providers_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.providers_cumulus_id_seq OWNED BY public.providers.cumulus_id;


--
-- Name: rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rules (
    cumulus_id integer NOT NULL,
    name text NOT NULL,
    workflow text NOT NULL,
    collection_cumulus_id integer,
    provider_cumulus_id integer,
    type text NOT NULL,
    enabled boolean NOT NULL,
    value text,
    arn text,
    log_event_arn text,
    execution_name_prefix text,
    payload jsonb,
    meta jsonb,
    tags jsonb,
    queue_url text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT rules_type_check CHECK ((type = ANY (ARRAY['onetime'::text, 'scheduled'::text, 'sns'::text, 'kinesis'::text, 'sqs'::text])))
);


--
-- Name: COLUMN rules.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.name IS 'Rule name';


--
-- Name: COLUMN rules.workflow; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.workflow IS 'Workflow name to invoke for this rule';


--
-- Name: COLUMN rules.type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.type IS 'Specifies how workflows are invoked for this rule';


--
-- Name: COLUMN rules.enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.enabled IS 'Whether rule is active or not';


--
-- Name: COLUMN rules.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.value IS '
        Value is multi-use. For a kinesis rule this is the target stream arn,
        for a scheduled event it is the schedule pattern (e.g. cron), for a one-time rule.
      ';


--
-- Name: COLUMN rules.arn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.arn IS 'For kinesis rules: ARN of event source mapping between Kinesis stream and message consumer Lambda';


--
-- Name: COLUMN rules.log_event_arn; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.log_event_arn IS 'For kinesis rules: ARN of event source mapping between Kinesis stream and inbound event logger Lambda';


--
-- Name: COLUMN rules.execution_name_prefix; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.execution_name_prefix IS 'Optional Execution name prefix';


--
-- Name: COLUMN rules.payload; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.payload IS 'Optional input payload to use for onetime and scheduled workflows';


--
-- Name: COLUMN rules.meta; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.meta IS 'Optional metadata for the rule. Contents will be automatically added to $.meta on invoked workflows.';


--
-- Name: COLUMN rules.tags; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.tags IS 'Optional tags for the rule';


--
-- Name: COLUMN rules.queue_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.rules.queue_url IS 'Optional SQS queue URL used to schedule executions for this rule';


--
-- Name: rules_cumulus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rules_cumulus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rules_cumulus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rules_cumulus_id_seq OWNED BY public.rules.cumulus_id;


--
-- Name: async_operations cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.async_operations ALTER COLUMN cumulus_id SET DEFAULT nextval('public.async_operations_cumulus_id_seq'::regclass);


--
-- Name: collections cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections ALTER COLUMN cumulus_id SET DEFAULT nextval('public.collections_cumulus_id_seq'::regclass);


--
-- Name: executions cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions ALTER COLUMN cumulus_id SET DEFAULT nextval('public.executions_cumulus_id_seq'::regclass);


--
-- Name: files cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files ALTER COLUMN cumulus_id SET DEFAULT nextval('public.files_cumulus_id_seq'::regclass);


--
-- Name: granules cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules ALTER COLUMN cumulus_id SET DEFAULT nextval('public.granules_cumulus_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: pdrs cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdrs ALTER COLUMN cumulus_id SET DEFAULT nextval('public.pdrs_cumulus_id_seq'::regclass);


--
-- Name: providers cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers ALTER COLUMN cumulus_id SET DEFAULT nextval('public.providers_cumulus_id_seq'::regclass);


--
-- Name: rules cumulus_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rules ALTER COLUMN cumulus_id SET DEFAULT nextval('public.rules_cumulus_id_seq'::regclass);


--
-- Name: async_operations async_operations_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.async_operations
    ADD CONSTRAINT async_operations_id_unique UNIQUE (id);


--
-- Name: async_operations async_operations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.async_operations
    ADD CONSTRAINT async_operations_pkey PRIMARY KEY (cumulus_id);


--
-- Name: collections collections_name_version_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_name_version_unique UNIQUE (name, version);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (cumulus_id);


--
-- Name: executions executions_arn_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_arn_unique UNIQUE (arn);


--
-- Name: executions executions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_pkey PRIMARY KEY (cumulus_id);


--
-- Name: executions executions_url_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_url_unique UNIQUE (url);


--
-- Name: files files_bucket_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_bucket_key_unique UNIQUE (bucket, key);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (cumulus_id);


--
-- Name: granules_executions granules_executions_granule_cumulus_id_execution_cumulus_id_uni; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules_executions
    ADD CONSTRAINT granules_executions_granule_cumulus_id_execution_cumulus_id_uni UNIQUE (granule_cumulus_id, execution_cumulus_id);


--
-- Name: granules granules_granule_id_collection_cumulus_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules
    ADD CONSTRAINT granules_granule_id_collection_cumulus_id_unique UNIQUE (granule_id, collection_cumulus_id);


--
-- Name: granules granules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules
    ADD CONSTRAINT granules_pkey PRIMARY KEY (cumulus_id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: pdrs pdrs_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdrs
    ADD CONSTRAINT pdrs_name_unique UNIQUE (name);


--
-- Name: pdrs pdrs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdrs
    ADD CONSTRAINT pdrs_pkey PRIMARY KEY (cumulus_id);


--
-- Name: providers providers_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_name_unique UNIQUE (name);


--
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (cumulus_id);


--
-- Name: rules rules_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_name_unique UNIQUE (name);


--
-- Name: rules rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (cumulus_id);


--
-- Name: executions executions_async_operation_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_async_operation_cumulus_id_foreign FOREIGN KEY (async_operation_cumulus_id) REFERENCES public.async_operations(cumulus_id);


--
-- Name: executions executions_collection_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_collection_cumulus_id_foreign FOREIGN KEY (collection_cumulus_id) REFERENCES public.collections(cumulus_id);


--
-- Name: executions executions_parent_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_parent_cumulus_id_foreign FOREIGN KEY (parent_cumulus_id) REFERENCES public.executions(cumulus_id);


--
-- Name: files files_granule_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_granule_cumulus_id_foreign FOREIGN KEY (granule_cumulus_id) REFERENCES public.granules(cumulus_id) ON DELETE CASCADE;


--
-- Name: granules granules_collection_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules
    ADD CONSTRAINT granules_collection_cumulus_id_foreign FOREIGN KEY (collection_cumulus_id) REFERENCES public.collections(cumulus_id);


--
-- Name: granules_executions granules_executions_execution_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules_executions
    ADD CONSTRAINT granules_executions_execution_cumulus_id_foreign FOREIGN KEY (execution_cumulus_id) REFERENCES public.executions(cumulus_id) ON DELETE CASCADE;


--
-- Name: granules_executions granules_executions_granule_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules_executions
    ADD CONSTRAINT granules_executions_granule_cumulus_id_foreign FOREIGN KEY (granule_cumulus_id) REFERENCES public.granules(cumulus_id) ON DELETE CASCADE;


--
-- Name: granules granules_pdr_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules
    ADD CONSTRAINT granules_pdr_cumulus_id_foreign FOREIGN KEY (pdr_cumulus_id) REFERENCES public.pdrs(cumulus_id);


--
-- Name: granules granules_provider_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granules
    ADD CONSTRAINT granules_provider_cumulus_id_foreign FOREIGN KEY (provider_cumulus_id) REFERENCES public.providers(cumulus_id);


--
-- Name: pdrs pdrs_collection_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdrs
    ADD CONSTRAINT pdrs_collection_cumulus_id_foreign FOREIGN KEY (collection_cumulus_id) REFERENCES public.collections(cumulus_id);


--
-- Name: pdrs pdrs_execution_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdrs
    ADD CONSTRAINT pdrs_execution_cumulus_id_foreign FOREIGN KEY (execution_cumulus_id) REFERENCES public.executions(cumulus_id);


--
-- Name: pdrs pdrs_provider_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdrs
    ADD CONSTRAINT pdrs_provider_cumulus_id_foreign FOREIGN KEY (provider_cumulus_id) REFERENCES public.providers(cumulus_id);


--
-- Name: rules rules_collection_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_collection_cumulus_id_foreign FOREIGN KEY (collection_cumulus_id) REFERENCES public.collections(cumulus_id);


--
-- Name: rules rules_provider_cumulus_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_provider_cumulus_id_foreign FOREIGN KEY (provider_cumulus_id) REFERENCES public.providers(cumulus_id);


--
-- PostgreSQL database dump complete
--


-- Table: public.group

-- DROP TABLE IF EXISTS public."group";

CREATE TABLE IF NOT EXISTS "group"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    is_disabled boolean DEFAULT false,
    updated_by character varying COLLATE pg_catalog."default",
    updated_date timestamp with time zone,
    CONSTRAINT "Group_pkey" PRIMARY KEY (id),
    CONSTRAINT uk UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS "group"
    OWNER to postgres;

-- Table: public.entity

-- DROP TABLE IF EXISTS public.entity;

CREATE TABLE IF NOT EXISTS entity
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    display_name character varying COLLATE pg_catalog."default",
    is_disabled boolean DEFAULT false,
    attributes json NOT NULL,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    comment character varying COLLATE pg_catalog."default",
    enable_audit_trial boolean NOT NULL DEFAULT false,
    group_id bigint NOT NULL,
    auto_number boolean DEFAULT true,
    CONSTRAINT entity_pkey PRIMARY KEY (id),
    CONSTRAINT uk_name UNIQUE (name),
    CONSTRAINT fk_group_id FOREIGN KEY (group_id)
        REFERENCES "group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS entity
    OWNER to postgres;


-- Table: public.rule

-- DROP TABLE IF EXISTS public.rule;

CREATE TABLE IF NOT EXISTS rule
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    entity_id integer NOT NULL,
    priority integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default",
    is_excluded boolean DEFAULT false,
    notification character varying COLLATE pg_catalog."default",
    condition json,
    action json,
    status character varying COLLATE pg_catalog."default",
    updated_by character varying COLLATE pg_catalog."default",
    updated_date timestamp with time zone,
    CONSTRAINT rule_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS rule
    OWNER to postgres;
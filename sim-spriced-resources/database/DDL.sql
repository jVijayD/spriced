-- Table: public.entity

-- DROP TABLE IF EXISTS public.entity;

CREATE TABLE IF NOT EXISTS public.entity
(
    name character varying COLLATE pg_catalog."default" NOT NULL,
	display_name character varying COLLATE pg_catalog."default",
	"group" character varying COLLATE pg_catalog."default" NOT NULL,
    version smallint NOT NULL,
    is_disabled boolean NOT NULL,
	enable_audit_trial boolean NOT NULL,
    attributes json NOT NULL,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp without time zone NOT NULL,
    CONSTRAINT entity_pkey PRIMARY KEY (name, "group", version)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.entity
    OWNER to postgres;

-- DROP INDEX IF EXISTS public.fki_group_fk;

CREATE INDEX IF NOT EXISTS fki_group_fk
    ON public.entity USING btree
    ("group" COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
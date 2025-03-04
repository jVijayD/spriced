-- Table: public.group

-- DROP TABLE IF EXISTS public."group";

CREATE TABLE IF NOT EXISTS public."group"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    is_disabled boolean DEFAULT false,
    updated_by character varying COLLATE pg_catalog."default",
    updated_date timestamp without time zone,
    CONSTRAINT "Group_pkey" PRIMARY KEY (id),
    CONSTRAINT uk UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."group"
    OWNER to postgres;

-- Table: public.entity

-- DROP TABLE IF EXISTS public.entity;

CREATE TABLE IF NOT EXISTS public.entity
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    display_name character varying COLLATE pg_catalog."default",
    is_disabled boolean DEFAULT false,
    attributes json NOT NULL,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp without time zone NOT NULL,
    comment character varying COLLATE pg_catalog."default",
    enable_audit_trial boolean NOT NULL DEFAULT false,
    group_id bigint NOT NULL,
    auto_number boolean DEFAULT true,
    CONSTRAINT entity_pkey PRIMARY KEY (id),
    CONSTRAINT uk_name UNIQUE (name),
    CONSTRAINT fk_group_id FOREIGN KEY (group_id)
        REFERENCES public."group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.entity
    OWNER to postgres;
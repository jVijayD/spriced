-- Table: public.group

-- DROP TABLE IF EXISTS public."group";

CREATE TABLE IF NOT EXISTS public."group"
(
    name character varying COLLATE pg_catalog."default" NOT NULL,
    is_disabled boolean,
    updated_by character varying COLLATE pg_catalog."default",
    updated_date timestamp without time zone,
    CONSTRAINT "Group_pkey" PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."group"
    OWNER to postgres;



-- Table: public.entity

-- DROP TABLE IF EXISTS public.entity;

CREATE TABLE IF NOT EXISTS public.entity
(
    name character varying COLLATE pg_catalog."default" NOT NULL,
    "group" character varying COLLATE pg_catalog."default" NOT NULL,
    version smallint NOT NULL,
    is_disabled boolean,
    attributes json,
    CONSTRAINT entity_pkey PRIMARY KEY (name, "group", version)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.entity
    OWNER to postgres;
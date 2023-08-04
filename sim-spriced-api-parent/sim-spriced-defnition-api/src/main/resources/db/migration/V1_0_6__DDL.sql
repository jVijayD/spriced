
	
-- Table: public.role_entity_permission_mapping

-- DROP TABLE IF EXISTS public.role_entity_permission_mapping;

CREATE TABLE IF NOT EXISTS public.role_entity_permission_mapping
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    role character varying(25) COLLATE pg_catalog."default" NOT NULL,
    group_id integer NOT NULL,
    entity_id integer NOT NULL,
    permission character varying(25) COLLATE pg_catalog."default" NOT NULL,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    attribute_details json,
    CONSTRAINT fk_entity_id FOREIGN KEY (entity_id)
        REFERENCES public.entity (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_group_id FOREIGN KEY (group_id)
        REFERENCES public."group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.role_entity_permission_mapping
    OWNER to postgres;
	
	
	
-- Table: public.role_group_permission_mapping

-- DROP TABLE IF EXISTS public.role_group_permission_mapping;

CREATE TABLE IF NOT EXISTS public.role_group_permission_mapping
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    role character varying(25) COLLATE pg_catalog."default" NOT NULL,
    group_id bigint NOT NULL,
    permission character varying(25) COLLATE pg_catalog."default" NOT NULL,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    CONSTRAINT fk_group_id FOREIGN KEY (group_id)
        REFERENCES public."group" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.role_group_permission_mapping
    OWNER to postgres;
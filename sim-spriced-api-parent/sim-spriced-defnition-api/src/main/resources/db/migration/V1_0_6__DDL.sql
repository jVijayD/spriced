
CREATE TABLE IF NOT EXISTS FileDetails
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    path character varying,
    status character varying,
    source character varying,
	entity_name character varying,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    CONSTRAINT "file_pkey" PRIMARY KEY (id)
    )

     TABLESPACE pg_default;
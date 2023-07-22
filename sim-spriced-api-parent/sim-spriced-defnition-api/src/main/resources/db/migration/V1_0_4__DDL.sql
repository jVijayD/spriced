
CREATE TABLE IF NOT EXISTS settings
(
    user_id  character varying  NOT NULL ,
    settings json NOT NULL,
    updated_by character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp without time zone NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY (user_id)
    )
    TABLESPACE pg_default;
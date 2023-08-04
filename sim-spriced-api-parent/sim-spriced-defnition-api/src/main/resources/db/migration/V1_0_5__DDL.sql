
CREATE TABLE IF NOT EXISTS audit_table
(
 id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1),
 entity_name text NOT NULL,
 column_name text NOT NULL,
 prior_value text,
 new_value text,
 "user" text NOT NULL,
 action text NOT NULL,
 transaction_type text NOT NULL,
 updated_date timestamp with time zone DEFAULT now(),
 CONSTRAINT "audit_trail_pkey" PRIMARY KEY (id,entity_name)
)
 TABLESPACE pg_default;


 CREATE OR REPLACE FUNCTION history_trigger() RETURNS TRIGGER AS $$
 DECLARE
   k text;
   v text;
   j_new jsonb := to_jsonb(new);
   j_old jsonb := to_jsonb(old);
 BEGIN
     IF TG_OP = 'INSERT' THEN
         FOR k, v in select * FROM jsonb_each_text(j_new) loop
             INSERT INTO audit_table (entity_name, column_name, new_value, "user", action, transaction_type)
             VALUES (TG_TABLE_NAME, k, v, New.updated_by, TG_OP, 'Member created');
         END LOOP;


     ELSIF TG_OP = 'UPDATE' THEN
         FOR k, v in select * FROM jsonb_each_text(j_new) loop
             IF (v <> j_old ->> k) THEN
                 INSERT INTO audit_table (entity_name, column_name, new_value, prior_value, "user", action, transaction_type)
                 VALUES (TG_TABLE_NAME, k, v, j_old ->> k, New.updated_by, TG_OP, 'Attribute value specified');
             END IF;
          END LOOP;


     ELSIF TG_OP = 'DELETE' THEN
         FOR k, v in SELECT * FROM jsonb_each_text(j_old) loop
             INSERT INTO audit_table (entity_name, column_name, prior_value, "user", action, transaction_type)
             VALUES (TG_TABLE_NAME, k, v, New.updated_by, TG_OP, 'Member status changed');
         end loop;
     END IF;
     RETURN NULL;

 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

-- creating table audit_trail and trigger function for storing details in json format
-- CREATE TABLE IF NOT EXISTS audit_trail
-- (
--     id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1),
--     entity_name  character varying  NOT NULL,
--     operation character varying  NOT NULL,
--     current_value  json,
--     previous_value  json ,
--     updated_by character varying COLLATE pg_catalog."default" NOT NULL,
--     updated_date timestamp with time zone DEFAULT now(),
--     CONSTRAINT "audit_trail_pkey" PRIMARY KEY (id,entity_name)
--     )
--     TABLESPACE pg_default;

--CREATE OR REPLACE FUNCTION history_trigger_json() RETURNS TRIGGER AS $$
--DECLARE
--    updated_current_cols JSON;
--    updated_previous_cols JSON;
--    new_json JSON;
--    old_json JSON;
--BEGIN
--    IF TG_OP = 'INSERT' THEN
--        INSERT INTO audit_trail (entity_name, operation, current_value, updated_by)
--        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), New.updated_by);
--        RETURN NEW;
--    ELSIF TG_OP = 'UPDATE' THEN
--        new_json := row_to_json(NEW);
--        old_json := row_to_json(OLD);
--
--        updated_current_cols := json_object_agg(key, value)::json
--        FROM (
--            SELECT key, value
--            FROM json_each_text(new_json)
--            WHERE (key, value) NOT IN (
--                SELECT key, value FROM json_each_text(old_json)
--            )
--        ) subquery;
--
--	updated_previous_cols := json_object_agg(key, value)::json
--        FROM (
--            SELECT key, value
--            FROM json_each_text(old_json)
--            WHERE (key, value) NOT IN (
--                SELECT key, value FROM json_each_text(new_json)
--            )
--        ) subquery;
--
--        INSERT INTO audit_trail (entity_name, operation, current_value, previous_value, updated_by)
--        VALUES (TG_TABLE_NAME, TG_OP, updated_current_cols, updated_previous_cols, New.updated_by);
--        RETURN NEW;
--    ELSIF TG_OP = 'DELETE' THEN
--        INSERT INTO audit_trail (entity_name, operation, previous_value, updated_by)
--        VALUES (TG_TABLE_NAME, TG_OP, updated_previous_cols, New.updated_by);
--        RETURN OLD;
--    END IF;
--END;
--$$ LANGUAGE plpgsql SECURITY DEFINER;



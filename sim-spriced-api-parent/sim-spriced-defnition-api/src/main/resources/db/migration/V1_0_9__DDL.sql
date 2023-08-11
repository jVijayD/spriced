CREATE OR REPLACE FUNCTION history_trigger() RETURNS TRIGGER AS $$
 DECLARE
   k text;
   v text;
   j_new jsonb := to_jsonb(new);
   j_old jsonb := to_jsonb(old);
 BEGIN
     IF TG_OP = 'INSERT' THEN
         FOR k, v in select * FROM jsonb_each_text(j_new) loop
             INSERT INTO audit_table (entity_name, column_name, new_value, updated_by, action, transaction_type)
             VALUES (TG_TABLE_NAME, k, v, New.updated_by, TG_OP, 'Member created');
         END LOOP;


     ELSIF TG_OP = 'UPDATE' THEN
         FOR k, v in select * FROM jsonb_each_text(j_new) loop
             IF (v <> j_old ->> k) THEN
                 INSERT INTO audit_table (entity_name, column_name, new_value, prior_value, updated_by, action, transaction_type)
                 VALUES (TG_TABLE_NAME, k, v, j_old ->> k, New.updated_by, TG_OP, 'Attribute value specified');
             END IF;
          END LOOP;


     ELSIF TG_OP = 'DELETE' THEN
         FOR k, v in SELECT * FROM jsonb_each_text(j_old) loop
             INSERT INTO audit_table (entity_name, column_name, prior_value, updated_by, action, transaction_type)
             VALUES (TG_TABLE_NAME, k, v, New.updated_by, TG_OP, 'Member status changed');
         end loop;
     END IF;
     RETURN NULL;

 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;
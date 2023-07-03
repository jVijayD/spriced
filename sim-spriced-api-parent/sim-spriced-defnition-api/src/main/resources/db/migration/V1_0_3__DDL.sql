ALTER TABLE IF EXISTS rule
    ADD CONSTRAINT fk_entity_id FOREIGN KEY (entity_id)
    REFERENCES entity (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
package com.sim.spriced.framework.data.filters;

import com.sim.spriced.framework.data.filters.FilterTypes.OperatorType;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.GREATER_THAN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.GREATER_THAN_EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.ILIKE;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IS_NOT_EQUAL;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LESS_THAN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LESS_THAN_EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LIKE;
import com.sim.spriced.framework.exceptions.data.FilterParsingException;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;

/**
 *
 * @author mukil.manohar_simadv
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FilterCondition<T> extends Filter {

    String key;
    T value;
    OperatorType operatorType;

    @Override
    public Condition generate(List fields) {
        Condition cnd = DSL.noCondition();
        // find the field fron fields based on its name
        List<Field> fieldsList = fields.stream()
                .filter(f -> f instanceof Field && ((Field) f).getName().equalsIgnoreCase(key))
                .toList();
        Field field = fieldsList.get(0);
        if (field == null) {
            throw new FilterParsingException("No field found for filtering");
        }
        // used trycatch to catch cast exceptions later need to consider datatype also
        try {
            cnd = switch (operatorType) {
                case EQUALS ->
                    field.eq(value);
                case GREATER_THAN ->
                    field.greaterThan(value);
                case GREATER_THAN_EQUALS ->
                    field.greaterOrEqual(value);
                case LESS_THAN ->
                    field.lessThan(value);
                case LESS_THAN_EQUALS ->
                    field.lessOrEqual(value);
                case LIKE ->
                    field.like((String) value);
                case ILIKE ->
                    field.likeIgnoreCase((String) value);
                case IS_NOT_EQUAL ->
                    field.ne((String) value);
                case IN ->
                    field.in(((String) value).split(","));
                //TODO consider DataType and cast it to corresponding DT
                default ->
                    field.eq(value);
            };
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cnd;
    }

}

package com.sim.spriced.framework.data.filters;

import com.sim.spriced.framework.data.filters.FilterTypes.OperatorType;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.GREATER_THAN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.GREATER_THAN_EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LESS_THAN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LESS_THAN_EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LIKE;
import com.sim.spriced.framework.exceptions.data.FilterParsingException;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.Condition;
import org.jooq.Field;

/**
 *
 * @author mukil.manohar_simadv
 */
@NoArgsConstructor
@Getter
@Setter
public class Filter_Condition<T> extends Filter {

    String key;
    T value;
    OperatorType operatorType;

    public Filter_Condition(String key, T value, OperatorType operator, FilterTypes.JoinType joinType) {
        super(joinType);
        this.key = key;
        this.value = value;
        this.operatorType = operator;
    }

    public Filter_Condition(String key, T value, OperatorType operator) {
        super();
        this.key = key;
        this.value = value;
        this.operatorType = operator;
    }

    @Override
    public Condition generate(List fields) {
        Condition cnd;
        List<Field> fieldsList = fields.stream()
                .filter(f -> f instanceof Field && ((Field) f).getName().equalsIgnoreCase(key))
                .toList();
        Field field = fieldsList.get(0);
        if (field == null) {
            throw new FilterParsingException("No field found for filtering");
        }
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
                field.lessThan(value);
            case ILIKE ->
                field.likeIgnoreCase((String) value);
            case IS_NOT_EQUAL ->
                field.ne((String) value);
            case LIKE ->
                field.like((String) value);
            case IN ->
                field.in(((String) value).split(","));
            //TODO consider DataType and cast it to corresponding DT
            default ->
                null;
        };
        return cnd;

    }

}

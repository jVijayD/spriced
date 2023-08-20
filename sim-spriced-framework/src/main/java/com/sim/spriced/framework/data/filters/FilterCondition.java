package com.sim.spriced.framework.data.filters;

//import com.sim.spriced.framework.data.filters.FilterTypes.DataType;
import com.sim.spriced.framework.data.filters.FilterTypes.OperatorType;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.CONTAINS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.ENDS_WITH;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.GREATER_THAN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.GREATER_THAN_EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.ILIKE;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IS_NOT_EQUAL;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IS_NOT_LIKE;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IS_NOT_NULL;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.IS_NULL;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LESS_THAN;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LESS_THAN_EQUALS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.LIKE;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.NOT_CONTAINS;
import static com.sim.spriced.framework.data.filters.FilterTypes.OperatorType.STARTS_WITH;
import com.sim.spriced.framework.exceptions.data.FilterParsingException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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
 * @param <T>
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FilterCondition<T> extends Filter {

    String key;
    String dataType;
    T value;
    OperatorType operatorType;

    private Object getParsedValue() throws ParseException {
        return switch (dataType) {
            case "string" ->
                value.toString();
            case "boolean" ->
                Boolean.valueOf(value.toString());
            case "date" ->
                new Date(new SimpleDateFormat("yyyy-MM-dd")
                .parse(value.toString()).getTime());
            case "number" ->
                Long.valueOf(value.toString());
            default ->
                value;
        };
    }

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
            if (dataType.equalsIgnoreCase("date")) {
                Date start = (Date)getParsedValue();
                long ltime = start.getTime() + 1 * 24 * 60 * 60 * 1000;
                Date end = new Date(ltime);
                cnd = switch (operatorType) {
                    case EQUALS ->
                        field.greaterOrEqual(start)
                        .and(
                        field.lessThan(end)
                        );
                    case GREATER_THAN ->
                        field.greaterThan(start);
                    case GREATER_THAN_EQUALS ->
                        field.greaterOrEqual(start);
                    case LESS_THAN ->
                        field.lessThan(start);
                    case LESS_THAN_EQUALS ->
                        field.lessThan(end);
                    case IS_NULL ->
                        field.isNull();
                    case IS_NOT_NULL ->
                        field.isNotNull();

                    default ->
                        field.greaterThan(start)
                        .and(
                        field.lessThan(end)
                        );
                };
                return cnd;
            }
            cnd = switch (operatorType) {
                case EQUALS ->
                    field.eq(getParsedValue());
                case GREATER_THAN ->
                    field.greaterThan(getParsedValue());
                case GREATER_THAN_EQUALS ->
                    field.greaterOrEqual(getParsedValue());
                case LESS_THAN ->
                    field.lessThan(getParsedValue());
                case LESS_THAN_EQUALS ->
                    field.lessOrEqual(getParsedValue());
                case LIKE ->
                    field.like(getParsedValue().toString());
                case ILIKE ->
                    field.likeIgnoreCase(getParsedValue().toString());
                case IS_NOT_LIKE ->
                    field.notLike(getParsedValue().toString());
                case CONTAINS ->
                    field.contains(getParsedValue());
                case NOT_CONTAINS ->
                    field.notContains(getParsedValue());
                case IS_NOT_EQUAL ->
                    field.ne(getParsedValue());
                case IN ->
                    field.in(getParsedValue().toString().split(","));
                case IS_NULL ->
                    field.isNull();
                case IS_NOT_NULL ->
                    field.isNotNull();
                case STARTS_WITH ->
                    field.startsWith(getParsedValue());
                case ENDS_WITH ->
                    field.endsWith(getParsedValue());
                //TODO consider DataType and cast it to corresponding DT
                default ->
                    field.eq(getParsedValue());
            };
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return cnd;
    }

}

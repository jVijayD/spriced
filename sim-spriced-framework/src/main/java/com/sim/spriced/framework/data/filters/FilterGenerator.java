package com.sim.spriced.framework.data.filters;

import static com.sim.spriced.framework.data.filters.FilterTypes.JoinType.AND;
import static com.sim.spriced.framework.data.filters.FilterTypes.JoinType.NONE;
import static com.sim.spriced.framework.data.filters.FilterTypes.JoinType.NOT;
import static com.sim.spriced.framework.data.filters.FilterTypes.JoinType.OR;
import java.util.List;
import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;

/**
 *
 * @author mukil.manohar_simadv
 */
public class FilterGenerator {

    public static Condition generate(List<Filter> filters, List<Field<Object>> fieldsList) {
        Condition condition = DSL.noCondition();
        if (filters == null) {
            return condition;
        }
        for (Filter f : filters) {
            if (null != f.getJoinType()) {
                condition = switch (f.getJoinType()) {
                    case AND -> condition.and(f.generate(fieldsList));
                    case OR -> condition.or(f.generate(fieldsList));
                    case NOT -> condition.andNot(f.generate(fieldsList));
                    case NONE -> f.generate(fieldsList);
                    default ->  f.generate(fieldsList);
                };
            }
        }
        return condition;
    }
}

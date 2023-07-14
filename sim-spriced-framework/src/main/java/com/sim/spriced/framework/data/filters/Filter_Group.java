package com.sim.spriced.framework.data.filters;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.jooq.Condition;
import org.jooq.impl.DSL;

/**
 *
 * @author mukil.manohar_simadv
 */
@Getter
@Setter
public class Filter_Group extends Filter {

    List<Filter> filters;

    public Filter_Group(List<Filter> filters, FilterTypes.JoinType joinType) {
        super(joinType);
        this.filters = filters;
    }

    public Filter_Group(List<Filter> filters) {
        super();
        this.filters = filters;
    }

    public Filter_Group() {
        super();
        this.filters = new ArrayList();
    }

    Filter_Group(FilterTypes.JoinType joinType) {
        super(joinType);
        this.filters = new ArrayList();
    }

    public void add(Filter filter) {
        this.filters.add(filter);
    }

    public void remove(Filter filter) {
        this.filters.remove(filter);
    }

    @Override
    public Condition generate(List fields) {
        Condition result = DSL.trueCondition();
        for (Filter f : filters) {
            if (f.getJoinType() == FilterTypes.JoinType.AND) {
                result = result.and(f.generate(fields));
            } else {
                result = result.and(f.generate(fields));
            }
        }
        return result;
    }

}

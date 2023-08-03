package com.sim.spriced.framework.data.filters;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.Condition;

/**
 *
 * @author mukil.manohar_simadv
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FilterGroup extends Filter {

    List<Filter> filters;

    public void add(Filter filter) {
        this.filters.add(filter);
    }

    public void remove(Filter filter) {
        this.filters.remove(filter);
    }

    @Override
    public Condition generate(List fields) {
     return  FilterGenerator.generate(filters, fields);
    }

}

package com.sim.spriced.framework.data.filters;

import java.util.List;
import org.jooq.Condition;
import org.jooq.Field;

/**
 *
 * @author mukil.manohar_simadv
 * @param <T>
 */
public interface IFilter<T> {
    Condition generate(List<Field> fields); 
}



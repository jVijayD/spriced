package com.sim.spriced.framework.data.filters;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import com.sim.spriced.framework.data.filters.FilterTypes.FilterType;
import com.sim.spriced.framework.data.filters.FilterTypes.JoinType;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author mukil.manohar_simadv
 */
@Getter
@Setter
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = As.PROPERTY,
        property = "filterType")
@JsonSubTypes({
    @JsonSubTypes.Type(value = Filter_Condition.class, name = "CONDITION"),
    @JsonSubTypes.Type(value = Filter_Group.class, name = "CONDITIONGROUP")
})
public abstract class Filter<T> implements IFilter {

    JoinType joinType = JoinType.NONE;
    FilterType filterType = FilterType.CONDITION;

    public Filter(JoinType joinType) {
        this.joinType = joinType;
    }

    public Filter(JoinType joinType, FilterType filterType) {
        this.filterType = filterType;
    }

    public Filter() {
    }

    public JoinType getJoinType() {
        return joinType;
    }

    public void setJoinType(JoinType joinType) {
        this.joinType = joinType;
    }

}

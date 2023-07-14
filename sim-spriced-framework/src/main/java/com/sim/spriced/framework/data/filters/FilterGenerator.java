package com.sim.spriced.framework.data.filters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.framework.exceptions.data.FilterParsingException;
import java.util.ArrayList;
import java.util.List;
import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author mukil.manohar_simadv
 */
public class FilterGenerator {

    public static Condition generate(List<Filter> filters, List<Field<Object>> fieldsList) {
        Condition result = DSL.trueCondition();
        if (filters == null) {
            return result;
        }
        for (Filter f : filters) {
            if (f.getJoinType() == FilterTypes.JoinType.AND) {
                result = result.and(f.generate(fieldsList));
            } else {
                result = result.and(f.generate(fieldsList));
            }
        }
        return result;
    }

    public static List<Filter> mapJSONToFilter(String filters) throws FilterParsingException {
        if (filters == null || filters.isEmpty()) {
            return null;
        }
        ObjectMapper objectMapper = new ObjectMapper();
        List<Filter> listFilters = new ArrayList();
        try {
            JSONArray filtersJSON = new JSONArray(filters);
            for (int i = 0; i < filtersJSON.length(); i++) {
                JSONObject obj = filtersJSON.getJSONObject(i);

                if (obj.has("filterType") && obj.getString("filterType").equalsIgnoreCase("CONDITIONGROUP")) {
                    listFilters.add(objectMapper.readValue(obj.toString(), Filter_Group.class));
                } else {
                    listFilters.add(objectMapper.readValue(obj.toString(), Filter_Condition.class));
                }
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new com.sim.spriced.framework.exceptions.data.FilterParsingException("",e);
        }
        return listFilters;
    }

}

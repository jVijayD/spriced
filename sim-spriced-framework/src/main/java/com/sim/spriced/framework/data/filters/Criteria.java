package com.sim.spriced.framework.data.filters;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

/**
 *
 * @author mukil.manohar_simadv
 */
@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Criteria implements Serializable {

    Pager pager;
    List<Filter> filters = new ArrayList();
    List<Sorter> sorters = new ArrayList();

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class Sorter {

        public enum Direction {
            ASC, DESC
        }

        Sorter.Direction direction = Direction.ASC;
        String property;

    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class Pager {

        int pageNumber;
        int pageSize;

        public int getOffset() {
            return this.pageNumber * pageSize;
        }

    }

}

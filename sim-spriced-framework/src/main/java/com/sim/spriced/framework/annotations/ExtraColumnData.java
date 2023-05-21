package com.sim.spriced.framework.annotations;

import java.lang.annotation.*;
@Inherited
@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ExtraColumnData {
    boolean isPrimaryKey() default false;
    boolean convertToJson() default false;
    boolean exclude() default false;
    IDType id() default IDType.NONE;
    String businessString() default "";
    
    
}
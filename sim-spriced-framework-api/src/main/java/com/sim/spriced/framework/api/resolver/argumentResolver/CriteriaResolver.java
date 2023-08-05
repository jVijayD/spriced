package com.sim.spriced.framework.api.resolver.argumentResolver;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.framework.data.filters.Criteria;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 *
 * @author mukil.manohar_simadv
 */
@RequiredArgsConstructor
public class CriteriaResolver implements HandlerMethodArgumentResolver {

    private Criteria criteria;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameter().getType() == Criteria.class;
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory) {

        ObjectMapper objectMapper = new ObjectMapper();

        webRequest.getParameterMap().forEach((s, a) -> {
            try {
                criteria = objectMapper.readValue(a[0], Criteria.class);
            } catch (JsonProcessingException ex) {
                criteria = new Criteria();
                ex.printStackTrace();
            }
        });
//            System.out.println("***************** parameter : "+parameter.getParameter());
//            System.out.println("***************** parameter1 : "+((Criteria)parameter.getParameter().));

        return criteria;
    }
}

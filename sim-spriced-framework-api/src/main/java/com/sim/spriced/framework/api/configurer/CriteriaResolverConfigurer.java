package com.sim.spriced.framework.api.configurer;

import com.sim.spriced.framework.api.resolver.argumentResolver.CriteriaResolver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *
 * @author mukil.manohar_simadv
 */

@Component
@RequiredArgsConstructor
class CriteriaResolverConfigurer implements WebMvcConfigurer {

  @Override
  public void addArgumentResolvers(
      List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(new CriteriaResolver());
  }
}
package com.sim.spriced.framework.async;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfiguration  {
    @Bean
    public Executor asyncExecutor() {
        return new ThreadPoolTaskExecutor();
    }
}

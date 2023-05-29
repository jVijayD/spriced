package com.sim.spriced.defnition.data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sim.spriced.defnition.data.service.EntityDefnitionEvent;
import com.sim.spriced.framework.pubsub.IObserver;

@Configuration
public class ServiceBeanConfigurations {

	@Bean("entityDefnitionObservers")
	public List<IObserver<EntityDefnitionEvent>> entityDefnitionObservers(Map<String, IObserver<EntityDefnitionEvent>> beansMap) {
		 List<IObserver<EntityDefnitionEvent>> observers= new ArrayList<>();
		 beansMap.forEach((k,v)->{
			 observers.add(v);
		 });
		 return observers;
	}
}

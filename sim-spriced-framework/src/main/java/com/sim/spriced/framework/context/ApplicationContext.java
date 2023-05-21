package com.sim.spriced.framework.context;

import java.util.HashMap;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ApplicationContext {
	private String version;
	private final HashMap<String,Object> contextMap = new HashMap<>();
	
	private static ApplicationContext context;
	private static Object mutex = new Object();
	
	private ApplicationContext() {}
	
	public static ApplicationContext getInstance() {
		
		ApplicationContext result = context;
		if(result==null) {
			synchronized (mutex) {
				result = context;
				if(result==null) {
					context = result = new ApplicationContext();
				}
			}
		}
		
		return result;
	}
}

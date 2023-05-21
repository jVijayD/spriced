package com.sim.spriced.framework.context;

import java.util.HashMap;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class RequestContext {
	
	private String tenant;
	private String transactionId;
	private String user;
	private final HashMap<String,Object> contextMap = new HashMap<>();
	
	public void setContextMap(String key,Object value) {
		this.contextMap.put(key, value);
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getContextMap(String key) {
		return (T)this.contextMap.get(key);
	}
	
}

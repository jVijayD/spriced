package com.sim.spriced.framework.context;

/***
 * ContextManager holds the application context and the Request context data.
 * Makesure that the instance of the ContextManager class is created on request basis
 * and set the values.
 * @author shabeeb
 *
 */
public class SPricedContextManager {

	private  static ThreadLocal<RequestContext> requestContext = new ThreadLocal<>();
	private ApplicationContext appContext;

	public SPricedContextManager() {
		appContext = ApplicationContext.getInstance();
	}
	
	public void setRequestContext(RequestContext value) {
		requestContext.set(value);
	}
	
	public RequestContext getRequestContext() {
		return requestContext.get();
	}
	
	public void setApplicationContext(ApplicationContext value) {
		this.appContext=value;
	}
	
	public ApplicationContext getApplicationContext() {
		return this.appContext;
	}
	
	public void clearRequestContext() {
		requestContext.remove();
	}
}

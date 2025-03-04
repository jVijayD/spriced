package com.sim.spriced.framework.aop;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

	private static final String LOG_AOP = "########### AOP ";
	@Pointcut("within(@org.springframework.stereotype.Repository *) || within(@org.springframework.stereotype.Service *) || within(@org.springframework.web.bind.annotation.RestController *)")
	public void springBeanPointCut() {
		// Method is empty as this is just a Pointcut, the implementations are in the
		// advices.
	}

	@Around("springBeanPointCut()")
	public Object logAround(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
		MethodSignature methodSignature = (MethodSignature) proceedingJoinPoint.getSignature();

		// Get intercepted method details
		String className = methodSignature.getDeclaringType().getSimpleName();
		String methodName = methodSignature.getName();

		// Log method input parameters
		log.info(LOG_AOP + "Enter:Input parameters of " + className + "." + methodName + " :: "
				+ Arrays.toString(proceedingJoinPoint.getArgs()));

		final StopWatch stopWatch = new StopWatch();

		// Measure method execution time
		stopWatch.start();
		Object result = proceedingJoinPoint.proceed();
		stopWatch.stop();

		// Log method execution time
		log.info(LOG_AOP + "Exit:Result of " + className + "." + methodName + " :: " + result);
		// Log method execution time
		log.info(LOG_AOP + "Time:Execution time of " + className + "." + methodName + " :: " + stopWatch.getTotalTimeMillis()
				+ " ms");

		return result;
	}

	@AfterThrowing(pointcut = "springBeanPointCut()", throwing = "e")
	public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
		MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
		// Get intercepted method details
		String className = methodSignature.getDeclaringType().getSimpleName();
		String methodName = methodSignature.getName();
		
		log.error(LOG_AOP +"Exception in " + className + "." + methodName + " :: " ,e);

	}
}

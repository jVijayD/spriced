package com.sim.spriced.framework.async;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.ForkJoinPool;
import java.util.function.Consumer;
import java.util.function.Function;

import org.springframework.stereotype.Component;

@Component
public class AsyncManager {
	

	public <T, U> List<U> runAsync(Collection<T> collection, Function<T, U> functions,int threads) {
		Executor executor = Executors.newFixedThreadPool(threads);
		var list = collection.stream().map(m -> CompletableFuture.supplyAsync(() -> functions.apply(m), executor))
				.toList();
		return list.stream().map(CompletableFuture::join).toList();
	}

	public <T> void runAsync(Collection<T> collection, Consumer<T> consumer,int threads) {
		Executor executor = Executors.newFixedThreadPool(threads);
		var list = collection.stream().map(m -> CompletableFuture.runAsync(() -> consumer.accept(m), executor))
				.toList();
		list.stream().forEach(CompletableFuture::join);
	}
	
	public <T, U> List<U> runParallelStream(Collection<T> collection, Function<T, U> functions,int threads) throws InterruptedException, ExecutionException {
		ForkJoinPool customThreadPool = new ForkJoinPool(threads);
		try {
			return customThreadPool.submit(()->collection.parallelStream().map(functions::apply)).get().toList();
		} 
		finally {
			customThreadPool.shutdown();
		}
	}
}

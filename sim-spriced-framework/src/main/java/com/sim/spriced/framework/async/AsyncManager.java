package com.sim.spriced.framework.async;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.function.Function;

public class AsyncManager {
	private final Executor executor;

	public AsyncManager(int threads) {
		this.executor = Executors.newFixedThreadPool(threads);
	}

	public <T, U> List<U> runAsync(Collection<T> collection, Function<T, U> functions) {
		var list = collection.stream().map(m -> CompletableFuture.supplyAsync(() -> functions.apply(m), this.executor))
				.toList();
		return list.stream().map(CompletableFuture::join).toList();
	}

	public <T> void runAsync(Collection<T> collection, Consumer<T> consumer) {
		var list = collection.stream().map(m -> CompletableFuture.runAsync(() -> consumer.accept(m), this.executor))
				.toList();
		list.stream().forEach(CompletableFuture::join);
	}
}

package com.sim.spriced.framework.rule;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sim.spriced.framework.exceptions.rule.GroupMissingException;

public class RuleEngine<T> {

	private final Map<String, List<IRule<T>>> rules = new HashMap<>();

	public RuleEngine(List<String> groupPriority) {
		groupPriority.forEach(item -> rules.put(item, null));
	}

	public void addRule(IRule<T> rule) {

		String groupName = rule.getGroupName();
		List<IRule<T>> groupRules = this.rules.get(groupName);
		if (groupRules == null) {
			throw new GroupMissingException(String.format("Group with name %s missing.", groupName));
		}
		groupRules.add(rule);
		groupRules.sort((current, previous) -> (previous.getPriority() - current.getPriority()));
		rules.put(groupName, groupRules);

	}

	public List<Result<T>> executeRules(T fact) {
		return rules.keySet().stream().map(item -> {
			List<IRule<T>> groupRules = rules.get(item);
			return groupRules.stream().map(rul -> rul.apply(fact)).toList();
		}).flatMap(Collection::stream).toList();
	}
}

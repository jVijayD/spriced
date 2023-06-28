package com.sim.spriced.framework.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConditionalAction {
	private List<Action> ifActions;
	private List<Action> elseActions;
	
}

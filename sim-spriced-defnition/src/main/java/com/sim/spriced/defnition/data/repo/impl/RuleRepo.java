package com.sim.spriced.defnition.data.repo.impl;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.sim.spriced.defnition.data.repo.IRuleRepo;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.models.Action;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.models.Rule;
import com.sim.spriced.framework.repo.BaseRepo;


@Repository
public class RuleRepo extends BaseRepo implements IRuleRepo {

	@Override
	public Rule add(Rule rule) {
		return super.create(rule,this::convertToRule);
	}

	@Override
	public int remove(Rule rule) {
		return super.delete(rule);
	}

	@Override
	public List<Rule> fetchAll() {
		return super.fetchAll(Rule.TableConstants.TABLE, null, this::convertToRule);
	}

	@Override
	public Page<Rule> fetchAll(Pageable pagable) {
		return super.fetchAll(Rule.TableConstants.TABLE, null,this::convertToRule,pagable);
	}

	@Override
	public Rule fetchByName(String name) {
		Rule rule = new Rule(name);
		return super.fetchOne(rule,this::convertToRule);
	}
	
	@Override
	public Rule fetch(Integer id) {
		Rule rule = new Rule(id);
		return super.fetchOne(rule,this::convertToRule);
	}

	@Override
	public Rule change(Rule rule) {
		return super.update(rule,this::convertToRule);
	}

	@Override
	public Rule fetch(Rule rule) {
		return super.fetchOne(rule,this::convertToRule);
	}

	private Rule convertToRule(Record rec) {
		Rule result = new Rule();
		
		Condition condition = super.convertJsonToObject(rec, Condition.class, Rule.TableConstants.TABLE, Rule.TableConstants.CONDITION);
		Action action =  super.convertJsonToObject(rec, Action.class, Rule.TableConstants.TABLE, Rule.TableConstants.ACTION);
		
		result.setId((Integer)(rec.get(Rule.TableConstants.ID)));
		result.setDescription((String)rec.get(Rule.TableConstants.DESCRIPTION));
		result.setEntityId((Integer)rec.get(Rule.TableConstants.ENTITY_ID));
		result.setIsExcluded((Boolean)rec.get(Rule.TableConstants.IS_EXCLUDED));
		result.setName((String)rec.get(Rule.TableConstants.NAME));
		result.setNotification((String)rec.get(Rule.TableConstants.NOTIFICATION));
		result.setPriority((Integer)rec.get(Rule.TableConstants.PRIORITY));
		result.setStatus((String)rec.get(Rule.TableConstants.STATUS));
		result.setUpdatedBy((String)rec.get(ModelConstants.UPDATED_BY));
		result.setUpdatedDate((Timestamp)rec.get(ModelConstants.UPDATED_DATE));
		result.setCondition(condition);
		result.setAction(action);
		return result;
	}
	
}

package com.sim.spriced.data.service.impl;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import javax.transaction.Transactional;

import org.jooq.JSON;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sim.spriced.data.model.EntityData;
import com.sim.spriced.data.model.EntityDataResult;
import com.sim.spriced.data.repo.IEntityDataRepo;
import com.sim.spriced.data.service.IEntityDataRuleService;
import com.sim.spriced.data.service.IEntityDataService;
import com.sim.spriced.framework.constants.ModelConstants;
import com.sim.spriced.framework.data.filters.Criteria;
import com.sim.spriced.framework.models.Attribute;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.AttributeConstants.DataType;
import com.sim.spriced.framework.rule.FactResult;
import com.sim.spriced.framework.rule.IRule;
import com.sim.spriced.framework.rule.Result;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;


@Service
public class EntityDataService implements IEntityDataService {

	@Autowired
	IEntityDataRepo dataRepo;
	
	@Autowired
	IEntityDataRuleService dataRuleService;

	@Transactional
	@Override
	public EntityDataResult upsertBulk(EntityData data) {
//		this.setDateTimeValue(data);
                data = filterWithUpdateOnlyAttributes(data);
		return EntityDataResult.builder().rowsChanged(this.dataRepo.upsertBulk(data)).build();
	}

	@Override
	public EntityDataResult deleteBulk(EntityData data) {
		return EntityDataResult.builder().rowsChanged(this.dataRepo.deleteBulk(data)).build();
	}

	@Override
	public JSONArray fetchAll(EntityData data,Criteria criteria) {
		return this.dataRepo.fetchAll(data,criteria);
	}

	@Override
	public JSONObject fetchOne(EntityData data,Criteria criteria) {
		return this.dataRepo.fetchOne(data,criteria);
	}

        @Override
        public EntityDataResult upsert(EntityData data) {
    //		this.setDateTimeValue(data);
            data = filterWithUpdateOnlyAttributes(data);
            List<Map<String, Object>> jsonObj = Arrays.asList(this.dataRepo.upsert(data));
            return EntityDataResult.builder().rowsChanged(new int[]{1}).result(jsonObj).build();
        }

        private EntityData filterWithUpdateOnlyAttributes(EntityData data) {
            List<Attribute> attrib = data.getAttributes()
                    .stream()
                    .filter(a -> a.getPermission() == ModelConstants.ModelPermission.UPDATE)
                    .collect(Collectors.toList());
            data.setAttributes(attrib);
            return data;
        }
        
	@Override
	public EntityDataResult upsert(EntityData data, List<IRule<JSONObject>> rules) {
		//this.setDateTimeValue(data);
		return this.executeUpsert(data, rules, this::upsert);
	}

	@Transactional
	@Override
	public EntityDataResult upsertBulk(EntityData data, List<IRule<JSONObject>> rules) {
		//this.setDateTimeValue(data);
		return this.executeUpsert(data, rules, this::upsertBulk);
	}
	
	
	private EntityDataResult executeUpsert(EntityData data, List<IRule<JSONObject>> rules,Function<EntityData, EntityDataResult> upsertLogic) {
		
		if(rules!=null && !rules.isEmpty()) {
			List<FactResult<JSONObject>> ruleResults = this.dataRuleService.executeRules(rules, data.getValues());
			//Update is_valid field
			//ruleResults.stream().filter(item->!item.isSucces()).forEach(item->item.getOutput().put(ModelConstants.IS_VALID, false));
			
			List<JSONObject> dataAfterRuleExecution = this.setRuleExecutionErrorStatus(ruleResults);
			data.setValues(dataAfterRuleExecution);
			
			EntityDataResult result = upsertLogic.apply(data);
			result.setRuleValidations(ruleResults);
			return result;
		}
		else {
			return upsertLogic.apply(data);
		}
		
	}
	
	private List<JSONObject> setRuleExecutionErrorStatus(List<FactResult<JSONObject>> ruleResults) {
		return ruleResults.parallelStream().map(result->{
			if(!result.isSucces()) {
				List<Result> item = result.getRuleResults();
				ObjectMapper objectMapper = new ObjectMapper();
				try {
					JSON jsonVal = JSON.json(objectMapper.writeValueAsString(item));
					result.getOutput().put(ModelConstants.ERROR, jsonVal);
				} catch (JsonProcessingException e) {
					//No action if not able to serialize
				}
				result.getOutput().put(ModelConstants.IS_VALID, false);
			}
			else {
				result.getOutput().put(ModelConstants.IS_VALID, true);
			}
			return result.getOutput();
		}).toList();
	}
	
	private EntityData setDateTimeValue(EntityData data) {
        data.getAttributes().forEach(item->{
            if(!item.isAutoGenerated() && item.isEditable()) {
                String name = item.getName();
                if(item.getDataType().equals(DataType.TIME_STAMP)){
                    for(JSONObject obj:data.getValues()) {
                        if(obj.has(name)) {
                            var dateVar = obj.get(name).toString();
                            try {
                                SimpleDateFormat formatter =  new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.sss'Z'");
                                obj.put(name, new Timestamp(formatter.parse(dateVar).getTime()));
                            } catch (Exception e) {
                                try {
                                	SimpleDateFormat formatter =  new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.sss+00:00");
									obj.put(name, new Timestamp(formatter.parse(dateVar).getTime()));
								} catch (Exception e1) {
									// TODO Auto-generated catch block
									e1.printStackTrace();
								}
                            }
                        }
                    }
                }
                else if(item.getDataType().equals(DataType.DATE)) {
                    for(JSONObject obj:data.getValues()) {
                        if(obj.has(name)) {
                            obj.put(name, Date.valueOf(obj.get(name).toString()));//yyyy-MM-dd
                        }
                    }
                }
            }
        });
        return data;
    }

	@Override
	public String fetchAllAsJsonString(EntityData data,Criteria criteria) {
		return this.dataRepo.fetchAllAsJsonString(data,criteria);
	}

	@Override
	public List<Map<String, Object>> fetchAllAsMap(EntityData data,Criteria criteria) {
		return this.dataRepo.fetchAllAsMap(data,criteria);
	}
	@Override
	public Page fetchAllAsMapPage(EntityData data,Criteria criteria) {
		return this.dataRepo.fetchAllAsMapPage(data,criteria);
	}
}

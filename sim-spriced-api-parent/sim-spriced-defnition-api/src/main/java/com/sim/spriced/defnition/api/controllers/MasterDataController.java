package com.sim.spriced.defnition.api.controllers;

import com.sim.spriced.defnition.data.service.IMasterDataService;
import com.sim.spriced.framework.annotations.IDType;
import com.sim.spriced.framework.models.AttributeConstants;
import com.sim.spriced.framework.models.Condition;
import com.sim.spriced.framework.pubsub.EventType;
import io.micrometer.core.annotation.Timed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController()
@RequestMapping("/master-data")
@CrossOrigin(origins = "*")
public class MasterDataController {

    @Autowired
    IMasterDataService masterDataService;

    @Timed(value = "masterData.getAllDataType.time", description = "Time taken to return all data types.")
    @GetMapping("/data-types")
    public ResponseEntity<HashMap<AttributeConstants.DataType, String>> getAllDataType() {
        return new ResponseEntity<>(this.masterDataService.getAllDataType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllType.time", description = "Time taken to return all types.")
    @GetMapping("/types")
    public ResponseEntity<HashMap<AttributeConstants.Type, String>> getAllType() {
        return new ResponseEntity<>(this.masterDataService.getAllType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllConstraintType.time", description = "Time taken to return all constraint types.")
    @GetMapping("/constraint-types")
    public ResponseEntity<HashMap<AttributeConstants.ConstraintType, String>> getAllConstraintType() {
        return new ResponseEntity<>(this.masterDataService.getAllConstraintType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllIdType.time", description = "Time taken to return all id types.")
    @GetMapping("/id-types")
    public ResponseEntity<List<IDType>> getAllIdType() {
        return new ResponseEntity<>(this.masterDataService.getAllIdType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllConditionType.time", description = "Time taken to return all condition types.")
    @GetMapping("/condition-types")
    public ResponseEntity<HashMap<Condition.ConditionType, String>> getAllConditionType() {
        return new ResponseEntity<>(this.masterDataService.getAllConditionType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllOperatorType.time", description = "Time taken to return all operator types.")
    @GetMapping("/operator-types")
    public ResponseEntity<HashMap<Condition.OperatorType, String>> getAllOperatorType() {
        return new ResponseEntity<>(this.masterDataService.getAllOperatorType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllOperandType.time", description = "Time taken to return all operand types.")
    @GetMapping("/operand-types")
    public ResponseEntity<HashMap<Condition.OperandType, String>> getAllOperandType() {
        return new ResponseEntity<>(this.masterDataService.getAllOperandType(), HttpStatus.OK);
    }

    @Timed(value = "masterData.getAllEventType.time", description = "Time taken to return all event types.")
    @GetMapping("/event-types")
    public ResponseEntity<List<EventType>> getAllEventType() {
        return new ResponseEntity<>(this.masterDataService.getAllEventType(), HttpStatus.OK);
    }
}

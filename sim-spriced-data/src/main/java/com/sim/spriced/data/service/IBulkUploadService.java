package com.sim.spriced.data.service;

import com.sim.spriced.framework.models.BulkEntityDetails;
import org.springframework.web.multipart.MultipartFile;

public interface IBulkUploadService {

	public BulkEntityDetails uploadFileDetails(BulkEntityDetails bulkEntityDetails, MultipartFile file);

}

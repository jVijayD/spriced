package com.sim.spriced.data.repo;

import com.sim.spriced.framework.models.FileEntity;

public interface IDataFileRepo {
	
	FileEntity saveFileDetails(FileEntity fileEntity);

}

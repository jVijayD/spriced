package com.sim.spriced.enums;

public enum BulkUploadStatus {

	UPLOADED("uploaded"),
	IN_PROGRESS("in progress"),
	FAILED("falied"),
	UPLOAD_FAILED("upload failed"),
	SUCCESS("success");
	
	private final String bulkUploadStatus;

	private BulkUploadStatus(String status) {
		this.bulkUploadStatus = status;
	}

	public String getBulkUploadStatus() {
		return bulkUploadStatus;
	}	
}


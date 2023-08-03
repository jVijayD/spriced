package com.sim.spriced.enums;

public enum FileUploadStatus {

	NEW_FILE("new file"),
	IN_PROGRESS("inprogress"),
	FAILED("failed"),
	UPLOAD_FAILED("upload Failed"),
	SUCCESS("success");
	
	private final String status;

	private FileUploadStatus(String status) {
		this.status = status;
	}

	public String getStatus() {
		return status;
	}
	
}

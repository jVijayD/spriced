package com.sim.spriced.framework.api.export;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

public abstract class ExportFileGenerator {
	private static final int PAGE_SIZE = 500;
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;

	protected abstract <T> List<JSONObject> getData(T input);

	public <T> void generateExcelFile(HttpServletResponse response, T input) throws IOException {
		List<JSONObject> dataList = this.getData(input);
		ServletOutputStream outputStream = response.getOutputStream();
		while (!dataList.isEmpty()) {
			workbook.write(outputStream);
			dataList = this.getData(input);
		}
		workbook.close();
		outputStream.close();
	}
}

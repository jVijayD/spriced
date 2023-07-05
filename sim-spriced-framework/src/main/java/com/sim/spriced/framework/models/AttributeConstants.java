package com.sim.spriced.framework.models;

public class AttributeConstants {

	public enum DataType {

		BOOLEAN("Boolean"), LINK("Link"), BIT("Bit"), INTEGER("Integer"), DECIMAL("Decimal"), DOUBLE("Double"),
		FLOAT("Float"), TEXT("Text"), STRING("String"), STRING_VAR("Fixed Length String"), CHARACTER("Character"),
		JSON("Json"), XML("Xml"),AUTO("Identity"),BUSINESS_SEQUENCE("Business Sequence"),TIME_STAMP("Timestamp"),DATE("Date"),DATE_TIME("Date Time");

		private final String displayName;

		private DataType(String displayName) {
			this.displayName = displayName;
		}

		public String getDisplayName() {
			return this.displayName;
		}
	}

	public enum Type {

		FREE_FORM("Free Form"), LOOKUP("Lookup");

		private final String displayName;

		private Type(String displayName) {
			this.displayName = displayName;
		}

		public String getDisplayName() {
			return this.displayName;
		}
	}

	public enum ConstraintType {
		NONE("None"),PRIMARY_KEY("Primary Key"), UNIQUE_KEY("Unique Constraint"),
		COMPOSITE_UNIQUE_KEY("Composite Unique Constraint"), FOREIGN_KEY("Foreign Key");

		private final String displayName;

		private ConstraintType(String displayName) {
			this.displayName = displayName;
		}
		

		public String getDisplayName() {
			return this.displayName;
		}
		
	}
}

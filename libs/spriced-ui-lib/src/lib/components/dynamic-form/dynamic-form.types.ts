import { RuleProperties } from "json-rules-engine";

export type IAccessControl = {
  disabled: string[];
  hidden: string[];
};

export type IValidator = {
  name: string;
  validator: any;
  message: string;
};

export type IRule = {
  name: string;
  dependantItems: string[];
  properties: RuleProperties;
};

export type IData = {
  options?: any[];
  api?: {
    onLoad: boolean;
    isFixed: boolean;
    provider: string;
    method: string;
    params?: any;
  };
};

export type IColumn = {
  key: string;
  label: string;
  type?: string;
  width?: string;
  align?: "left" | "center" | "right";
};

export type IStyle = {
  colSpan: number;
};

export type IGroup = {
  title: string;
  formFieldControls: FormFieldControls;
};

export type InputControl = {
  type: "input";
  subType: "email" | "password" | "number" | "text" | "hidden";
  label: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  name: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  maxLength?: number;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type CheckboxControl = {
  type: "checkbox";
  label: string;
  name: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type NumericControl = {
  type: "numeric";
  subType: "text";
  decimalCount: number;
  label: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  name: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  maxLength?: number;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type InputPickerControl = {
  type: "input-picker";
  subType: "email" | "number" | "text";
  label: string;
  placeholder?: string;
  hint?: string;
  icon: string;
  name: string;
  value?: any;
  valueProp: string;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  maxLength?: number;
  isMultiSelect: boolean;
  isChip?: boolean;
  columnHeaders: IColumn[];
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type CheckboxGroupControl = {
  type: "checkbox-group";
  label: string;
  hint?: string;
  name: string;
  value?: any[];
  valueProp?: string;
  displayProp?: string;
  selProp?: string;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  orientation?: "vertical" | "horizontal";
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type RadioButtonGroupControl = {
  type: "radio-group";
  label: string;
  hint?: string;
  name: string;
  value?: any;
  valueProp?: string;
  displayProp?: string;
  selProp?: string;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  orientation?: "vertical" | "horizontal";
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type TextControl = {
  type: "input";
  subType: "text";
  label: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  name: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  rows?: number;
  column?: number;
  maxLength?: number;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type DateControl = {
  type: "date";
  format: string;
  subType?: "";
  label: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  name: string;
  value?: any;
  startDate: string;
  startView: "month" | "year" | "multi-year";
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type SelectControl = {
  type: "select";
  label: string;
  icon?: string;
  hint?: string;
  name: string;
  valueProp?: string;
  displayProp?: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  //disabled?: boolean;
  placeholder?: {
    value?: any;
    displayText: string;
  };
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type LookupSelectControl = {
  type: "lookup-select";
  label: string;
  icon?: string;
  hint?: string;
  name: string;
  valueProp?: string;
  displayProp?: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  placeholder?: {
    value?: any;
    displayText: string;
  };
  eventValue: any;
  eventType: string;
  toolTipText?: string,
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type SelectExtendedControl = {
  type: "select-extended";
  label: string;
  icon?: string;
  hint?: string;
  name: string;
  valueProp: string;
  displayProp: string;
  value?: any;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  //disabled?: boolean;
  placeholder?: {
    value?: any;
    displayText: string;
  };
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type MultiSelectControl = {
  type: "multiselect";
  label: string;
  hint?: string;
  name: string;
  value?: any[];
  valueProp?: string;
  displayProp?: string;
  selProp?: string;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  placeholder?: {
    value?: any;
    displayText: string;
  };
  data: IData;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type SliderControl = {
  type: "slider";
  orientation: "vertical" | "horizontal";
  label: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  visible?: boolean;
  readOnly?: boolean;
  hiddenDefault?: any;
  length?: number;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type RangeControl = {
  type: "range-slider";
  orientation: "vertical" | "horizontal";
  label: string;
  placeholder?: string;
  icon?: string;
  hint?: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  value: {
    start: number;
    end: number;
  };
  hiddenDefault?: any;
  visible?: boolean;
  readOnly?: boolean;
  length?: number;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
  accessControl?: IAccessControl;
  rule?: IRule;
  style?: IStyle;
};

export type DataControl =
  | SelectControl
  | LookupSelectControl
  | SelectExtendedControl
  | MultiSelectControl
  | InputPickerControl
  | CheckboxGroupControl
  | RadioButtonGroupControl;

export type GenericControl =
  | InputControl
  | CheckboxControl
  | NumericControl
  | DataControl
  | TextControl
  | DateControl
  | SliderControl
  | RangeControl;

export type FormFieldControls = GenericControl[];

export type FormFieldGroup = {
  title: string;
  columns: number;
  formFieldControls: FormFieldControls;
  validations?: IValidator[];
  asyncValidations?: IValidator[];
};

export type AppForm = {
  title: string;
  //columns: number;
  groups: IGroup[];
  validations: IValidator[];
  asyncValidations: IValidator[];
};

export type AppWizard = {
  title: string;
  items: AppForm[];
};

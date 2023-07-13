interface IDataItemComponentParam {
	keyName: string;
	name: string;
	textContent?: string;
	numberValue?: number;
	booleanValue?: boolean;
	textValue?: string;
	unit: string;
	compType: string;
	colorRGBUint24?: number;
	editEnabled:boolean;
	mobileWebEnabled: boolean;

	head_viewer: HTMLDivElement;
	body_viewer: HTMLDivElement | HTMLInputElement;
	inputType: string;
	numberMinValue: number;
	numberMaxValue: number;
	floatNumberEnabled: boolean;

	autoEncoding: boolean;
	getJsonStr(): string;
	toNumber(): void;
	toBoolean(): void;
	toText(): void;
	toColor(): void;
	updateColorInput(input: HTMLInputElement): void;
	updateFloatNumberInput(input: HTMLInputElement): void;
	updateIntegerNumberInput(input: HTMLInputElement): void;
	initEvents(): void;
	/**
	 * @param viewing the default value is true
	 */
	getCurrValueString(viewing?: boolean): string;
	displayToViewer(): void;
	/**
	 * @param valueStr value string
	 * @param syncViewing the default value is true
	 */
	updateValueWithStr(valueStr: string, syncViewing?: boolean): void;
}
export { IDataItemComponentParam };

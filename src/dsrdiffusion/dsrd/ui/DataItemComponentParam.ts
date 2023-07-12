function clamp(value: number, min: number, max: number): number {
	return Math.max(Math.min(value, max), min);
}
function numberToCSSHeXRGBColorStr(v: number): string {
	let str = v.toString(16);
	let tstr = "000000";
	let dis = tstr.length - str.length;
	if(dis > 0) {
		str = tstr.slice(0,dis) + str;
	}
	return str;
}
function checkCSSHexRGBColorStr(value: string): string {
	let str = value.replace(/[^\a,b,c,d,e,f\0-9]/g,'');
	if(str.length < 1) {
		str = "0"
	}else if(str.length > 6) {
		let dis = str.length - 6;
		str = str.slice(dis);
	}
	return str;
}
function checkIntegerNumberStr(value: string, min:number, max: number): string {
	let str = value.replace(/[^\.\0-9]/g,'');
	let nv = parseFloat(str)
	if(isNaN(nv)) {
		nv = 0;
	}
	nv = Math.round(nv);
	nv = clamp(nv, min, max);
	str = nv + '';
	return str;
}

function checkFloatNumberStr(value: string, min:number, max: number): string {
	let str = value.replace(/[^\.\0-9]/g,'');
	let nv = parseFloat(str)
	if(isNaN(nv)) {
		nv = 0.0;
	}
	nv = clamp(nv, min, max);
	console.log("checkFloatNumberStr(), nv: ", nv, str)
	str = nv.toFixed(4);
	nv = parseFloat(str);
	str = nv + '';
	if(str.indexOf(".") < 1) {
		str += ".0";
	}
	return str;
}
class DataItemComponentParam {
	keyName = "";
	textContent?: string;
	name = "";
	numberValue?: number;
	booleanValue?: boolean;
	textValue?: string;
	unit = "";
	compType = "number";
	colorRGBUint24?: number;
	editEnabled = false;

	head_viewer: HTMLDivElement;
	body_viewer: HTMLDivElement | HTMLInputElement;
	inputType = "text";
	numberMinValue = 0;
	numberMaxValue = 1;
	floatNumberEnabled = false;

	autoEncoding = true;
	constructor() {}
	getJsonStr(): string {
		let valueStr = this.getCurrValueString(false);
		valueStr = this.compType == "text" ? `"${valueStr}"` : valueStr;
		return `"${this.keyName}":${valueStr}`;
	}
	toNumber(): void {
		this.compType = "number";
	}
	toBoolean(): void {
		this.compType = "boolean";
	}
	toText(): void {
		this.compType = "text";
	}
	toColor(): void {
		this.compType = "color";
	}
	initEvents(): void {
		if (this.editEnabled) {
			let input = this.body_viewer as HTMLInputElement;
			input.type = "text";
			switch (this.compType) {
				case "color":
					if(this.inputType == "text") {
						// input.onkeyup = evt => {
						input.onkeyup = evt => {
							let str = checkCSSHexRGBColorStr( input.value );
							input.value = str + this.unit;
							this.numberValue = parseInt("0x" + str);
						}
					}
					break;
				default:
					if(this.inputType == "number") {
						if(this.floatNumberEnabled) {
							input.onkeyup = evt => {
								let str = checkFloatNumberStr( input.value, this.numberMinValue, this.numberMaxValue );
								input.value = str + this.unit;
								this.numberValue = parseFloat(str);
							}
						}else  {
							input.onkeyup = evt => {
								let str = checkIntegerNumberStr( input.value, this.numberMinValue, this.numberMaxValue );
								input.value = str + this.unit;
								this.numberValue = parseInt(str);
							}
						}
					}
			}
		}else {
			let div = this.body_viewer;
			switch (this.compType) {
				case "boolean":
					div.onmouseup = evt => {
						this.booleanValue = !this.booleanValue;
						this.displayToViewer();
					}
					break;
			}
		}
	}
	getCurrValueString(viewing: boolean = true): string {
		let valueStr = "";
		let unitStr = "";
		switch (this.compType) {
			case "number":
			case "text":
				if (viewing) {
					unitStr = this.unit;
					if (this.numberValue !== undefined) {
						valueStr = this.numberValue + "";
					} else if (this.textContent !== undefined) {
						valueStr = this.textContent;
					} else if (this.textValue !== undefined) {
						valueStr = this.textValue;
					}
				}else {
					if (this.numberValue !== undefined) {
						valueStr = this.numberValue + "";
					} else if (this.textValue !== undefined) {
						valueStr = this.textValue;
					} else if (this.textContent !== undefined) {
						valueStr = this.textContent;
					}
				}
				break;
			case "boolean":
				if (viewing) {
					valueStr = this.booleanValue ? "是" : "否";
				} else {
					valueStr = this.booleanValue ? "1" : "0";
				}
				break;
			case "color":
				if (viewing) {
					valueStr = numberToCSSHeXRGBColorStr(this.numberValue);
				} else {
					valueStr = this.numberValue + "";
				}
				break;
		}
		return viewing ? (valueStr + unitStr) : valueStr;
	}
	displayToViewer(): void {
		let head_viewer = this.head_viewer;
		let body_viewer = this.body_viewer;
		head_viewer.innerHTML = this.name;
		let valueStr = this.getCurrValueString(true);
		if (valueStr != "") {
			if (this.editEnabled) {
				(body_viewer as HTMLInputElement).value = valueStr;
			} else {
				body_viewer.innerHTML = valueStr;
			}
		}
	}
}
export { DataItemComponentParam };

import DivLog from "../../vox/utils/DivLog";

class InputTextField {
	private m_inputTF: HTMLInputElement;
	private m_px: number = 0;
	private m_py: number = 0;
	private m_pw: number = 100;
	private m_ph: number = 100;
	private m_initH: number = 100;
	private m_visible: boolean = true;
	private m_text: string = "";
	private m_multiLines: boolean = false;
	private m_disabled: boolean = false;
	private m_borderEnabled: boolean = true;
	initializeWithText(px: number, py: number, defaultText: string = ""): void {
		let input = document.createElement("input");
		input.type = "text";
		input.id = "inputText";
		input.value = defaultText;
		input.size = defaultText.length;
		console.log("input.size: ",input.size);
		this.m_text = defaultText;
		input.className = "InputTFClass";
		// input.style.width = "auto";
		//input.style.display = "flex";
		// input.style.outline = "none";
		this.m_inputTF = input;
		this.setVisible(this.m_visible);
		this.setDisabled(this.m_disabled);
		this.setBorderEnabled(this.m_borderEnabled);
		this.setXY(px, py);
		document.body.appendChild(input);

		let rect = this.m_inputTF.getBoundingClientRect();
		this.m_pw = rect.width;
		this.m_ph = rect.height;
		this.m_initH = this.m_ph;
	}
	initialize(px: number, py: number, pw: number, ph: number, defaultText: string = ""): void {

		let input = document.createElement("input");
		input.type = "text";
		input.id = "inputText";
		input.value = defaultText;
		this.m_text = defaultText;
		input.className = "InputTFClass";

		/*input.style.width = "300px";
        input.style.height = "16px";
        input.style.lineHeight = "16px";
        input.style.border = "1px solid #006699";
        input.style.font = "12px 'Microsoft Sans Serif'";
        input.style.padding = "2px";
        input.style.color = "#006699";*/

		this.m_inputTF = input;
		this.setVisible(this.m_visible);
		this.setDisabled(this.m_disabled);
		this.setBorderEnabled(this.m_borderEnabled);
		document.body.appendChild(input);

		this.setXY(px, py);
		this.setSize(pw, ph);

		this.m_initH = this.m_ph;
		//console.log("InputTextField::initialize(), B rect: ", rect);
	}
	// setMultiLinesEnabled(enabled: boolean): void {
	// 	this.m_multiLines = enabled;
	// 	this.setSize(this.m_pw, this.m_ph);
	// }
	setFont(font: string): void {
		if (this.m_inputTF != null) {
			this.m_inputTF.style.font = font;
		}
	}
	setDisabled(disabled:boolean): void {
		this.m_disabled = disabled;
		if (this.m_inputTF != null) {
			this.m_inputTF.disabled = disabled;
		}
	}
	setBorderEnabled(enabled:boolean): void {
		this.m_borderEnabled = enabled;
		if (this.m_inputTF != null) {
			this.m_inputTF.style.borderWidth = enabled ? "":"0";
		}
	}
	setVisible(visible: boolean): void {
		this.m_visible = visible;
		if (this.m_inputTF != null) {
			this.m_inputTF.style.visibility = visible ? "visible" : "hidden";
		}
	}
	getX(): number {
		return this.m_px;
	}
	getY(): number {
		return this.m_py;
	}

	getWidth(): number {
		return this.m_pw;
	}
	getHeight(): number {
		if (this.m_inputTF != null && !this.m_multiLines) {
			let rect = this.m_inputTF.getBoundingClientRect();
			console.log("InputTextField::getHeight(), rect: ", rect);
			console.log("InputTextField::getHeight(), m_inputTF.height: ", this.m_inputTF.height);
			console.log("InputTextField::getHeight(), m_inputTF.style.height: ", this.m_inputTF.style.height);
			console.log("InputTextField::getHeight(), m_inputTF.width: ", this.m_inputTF.width);
			console.log("InputTextField::getHeight(), m_inputTF.style.width: ", this.m_inputTF.style.width);
			this.m_ph = rect.height;
		}
		return this.m_ph;
	}
	setXY(px: number, py: number): void {
		if (this.m_inputTF != null) {
			this.m_px = px;
			this.m_py = py;
			let input = this.m_inputTF;
			let style = input.style;
			style.left = px + "px";
			style.top = px + "px";
			style.zIndex = "9999";
			style.position = "absolute";
		}
	}
	setSize(pw: number, ph: number): void {

		if (this.m_inputTF != null) {
			let input = this.m_inputTF;

			this.m_pw = pw < 2 ? 2 : pw;
			input.style.width = pw + "px";
			if (this.m_multiLines) {
				this.m_ph = ph;
				input.style.height = ph + "px";
			} else {
				let rect = this.m_inputTF.getBoundingClientRect();
				this.m_ph = rect.height;
			}
		}
	}

	setText(text: string): void {
		if (this.m_inputTF != null) {
			this.m_inputTF.value = text;
			this.m_text = text;
		}
	}
	appendText(text: string): void {
		if (this.m_inputTF != null) {
			this.m_text += text;
			this.m_inputTF.value = this.m_text;
		}
	}
	getText(): string {
		return this.m_text;
	}
}
/**
 * a demo
 */
export class DemoInputText {
	constructor() {}

	initialize(): void {
		console.log("DemoInputText::initialize()...");

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		this.init();
	}
	private m_inputTF: InputTextField;
	private init(): void {
		let inputTF = new InputTextField();
		this.m_inputTF = inputTF;
		// inputTF.setVisible( false );
		inputTF.setBorderEnabled( true );
		// inputTF.initialize(10, 10, 171, 100, "Test Text Field");
		inputTF.initializeWithText(10, 10, "Test Text Field");
		inputTF.setXY(100, 200);
	}
	private mouseDown(evt: any): void {
		console.log("mouse down...inputTF.getHeight(): ", this.m_inputTF.getHeight());
	}

	run(): void {}
}

export default DemoInputText;

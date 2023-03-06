/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
class RViewElement {
	private m_canvas: any = null;
	private m_div: HTMLElement = null;
	private m_divW: number = -1;
	private m_divH: number = -1;

	public resized: boolean = true;

	constructor() {}
	public setDiv(div: HTMLElement): void {
		this.m_div = div;
	}

	/**
	 * @returns for example: #350b7e
	 */
	getCSSHEXRGB(r: number, g: number, b: number): string {
		let str = "#";
		let t = Math.floor(r * 255.0);
		if (t < 0xf) {
			str += "0" + t.toString(16);
		} else {
			str += "" + t.toString(16);
		}

		t = Math.floor(g * 255.0);
		if (t < 0xf) {
			str += "0" + t.toString(16);
		} else {
			str += "" + t.toString(16);
		}
		t = Math.floor(b * 255.0);
		if (t < 0xf) {
			str += "0" + t.toString(16);
		} else {
			str += "" + t.toString(16);
		}
		return str;
	}
	public createViewEle(pdocument: any, autoResize: boolean, pw: number, ph: number): void {
		if (this.m_div == null) {
			this.m_div = document.getElementById("voxEngineDiv");
		}
		if (this.m_div == null) {
			this.m_div = pdocument.createElement("div");
			document.body.appendChild(this.m_div);
		}
		const style = this.m_div.style;
		style.display = "bolck";
		style.position = "absolute";

		if (style.left == "") {
			style.left = "0px";
			style.top = "0px";
		}
		if (autoResize) {
			style.width = "100%";
			style.height = "100%";
		} else {
			this.m_div.style.width = pw + "px";
			this.m_div.style.height = ph + "px";
		}

		if (this.m_canvas == null) {
			this.m_canvas = document.createElement("canvas");
			this.m_div.appendChild(this.m_canvas);
			this.m_canvas.width = 800;
			this.m_canvas.height = 600;
			this.m_canvas.style.display = "bolck";
			this.m_canvas.style.left = "0px";
			this.m_canvas.style.top = "0px";
			this.m_canvas.style.position = "absolute";
		}
	}
	setDivStyleLeftAndTop(px: number, py: number): void {
		this.m_div.style.left = px + "px";
		this.m_div.style.top = py + "px";
	}
	setDivStyleSize(pw: number, ph: number): void {
		if (this.m_divW != pw || this.m_divH != ph) {
			this.m_div.style.width = pw + "px";
			this.m_div.style.height = ph + "px";
			this.resized = true;
		}
	}
	getDiv(): any {
		return this.m_div;
	}
	getCanvas(): any {
		return this.m_canvas;
	}
}
export default RViewElement;

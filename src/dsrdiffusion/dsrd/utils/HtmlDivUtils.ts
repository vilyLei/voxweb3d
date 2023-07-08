class DivTool {
	static createDiv(pw: number, ph: number, display = "", position = "", center: boolean = false): HTMLDivElement {
		const div = document.createElement("div");
		let style = div.style;
		if (pw > 0 && ph > 0) {
			style.width = pw + "px";
			style.height = ph + "px";
		}

		style.display = "block";
		if (display != "") {
			style.display = display;
		}

		style.position = "relative";
		if (position != "") {
			style.position = position;
		}

		if (center) {
			style.alignItems = "center";
			style.justifyContent = "center";
		}
		return div;
	}
	static createDivT1(px: number, py: number, pw: number, ph: number, display = "", position = "", center: boolean = true): HTMLDivElement {
		const div = document.createElement("div");
		let style = div.style;
		if (px > 0 && py > 0) {
			style.left = px + "px";
			style.top = py + "px";
		}
		if (pw > 0 && ph > 0) {
			style.width = pw + "px";
			style.height = ph + "px";
		}

		style.display = "block";
		if (display != "") {
			style.display = display;
		}

		style.position = "relative";
		if (position != "") {
			style.position = position;
		}

		if (center) {
			style.alignItems = "center";
			style.justifyContent = "center";
		}
		return div;
	}
	static clearDivAllEles(div: HTMLDivElement): void {
		(div as any).replaceChildren();
	}

	static setVisible(div: HTMLDivElement, visible: boolean): void {
		let style = div.style;
		if (visible) {
			style.visibility = "visible";
		} else {
			style.visibility = "hidden";
		}
	}
	static isVisible(div: HTMLDivElement): boolean {
		return div.style.visibility == "visible";
	}

	static setTextColor(div:HTMLDivElement, uint24: number): void {
		div.style.color = "#" + uint24.toString(16);
	}
}
export { DivTool };

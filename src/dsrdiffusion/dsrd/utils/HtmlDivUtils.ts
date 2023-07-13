class DivTool {
	/**
	 * 水平均匀排列
	 */
	static hArrangementDivs(divChildren: HTMLDivElement[]): void {
		if (divChildren.length > 0) {
			let parentDiv = divChildren[0].parentElement;
			if (parentDiv) {
				let parent_rect = parentDiv.getBoundingClientRect();
				let sizeTotal = 0;
				for (let i = 0; i < divChildren.length; ++i) {
					const r = divChildren[i].getBoundingClientRect();
					sizeTotal += r.width;
				}
				let dis = parent_rect.width - sizeTotal;
				let px = dis * 0.5;
				dis /= divChildren.length + 1;
				console.log("hArrangementDivs(), dis: ", dis, "parent_rect.width: ", parent_rect.width, ", sizeTotal: ", sizeTotal,", px: ", px);
				if (dis <= 0) {
					dis = 0;
				}else {
					px = (parent_rect.width - sizeTotal - dis * (divChildren.length - 1)) * 0.5;
				}
				for (let i = 0; i < divChildren.length; ++i) {
					let div = divChildren[i];
					const r = div.getBoundingClientRect();
					div.style.left = Math.round(px) + "px";
					px += r.width + dis;
				}
			}
		}
	}
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
	/**
	 * @param px the div left
	 * @param py the div top
	 * @param pw the div width
	 * @param ph the div height
	 * @param display the default value is ""
	 * @param position the default value is ""
	 * @param center the default value is false
	 * @returns a HTMLDivElement instance
	 */
	static createDivT1(px: number, py: number, pw: number, ph: number, display = "", position = "", center: boolean = true): HTMLDivElement {
		const div = document.createElement("div");
		let style = div.style;
		style.left = px + "px";
		style.top = py + "px";
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

	static setTextColor(div: HTMLDivElement, uint24: number): void {
		div.style.color = "#" + uint24.toString(16);
	}
}
export { DivTool };

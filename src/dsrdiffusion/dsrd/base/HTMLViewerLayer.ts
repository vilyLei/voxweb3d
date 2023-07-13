import AABB2D from "../../../vox/geom/AABB2D";
import { DivTool } from "../utils/HtmlDivUtils";

class HTMLViewerLayer {
	protected m_viewer: HTMLDivElement | HTMLCanvasElement;
	protected m_style: CSSStyleDeclaration;
	// protected m_rect = new AABB2D();
	unit = "px";
	constructor(viewer: HTMLDivElement | HTMLCanvasElement = null) {
		this.m_viewer = viewer;
		if (viewer) {
			this.m_style = viewer.style;
		}
	}
	getDiv(): HTMLDivElement {
		return this.m_viewer as HTMLDivElement;
	}
	getStyle(): CSSStyleDeclaration {
		return this.m_viewer.style;
	}
	setViewer(viewer: HTMLDivElement | HTMLCanvasElement): void {
		this.m_viewer = viewer;
		if (viewer) {
			this.m_style = viewer.style;
		}
	}
	setInnerHTML(html: string): void {
		(this.m_viewer as HTMLDivElement).innerHTML = html;
	}
	clearInnerHTML(): void {
		(this.m_viewer as HTMLDivElement).innerHTML = "";
	}
	setDisplayMode(display = "block"): void {
		if (display != "") {
			this.m_style.display = display;
		}
	}
	setPositionMode(position = "relative"): void {
		if (position != "") {
			this.m_style.position = position;
		}
	}
	setTextAlign(align: string): void {
		this.m_style.textAlign = align;
	}
	contentAlignToCenter(): void {
		let s = this.m_style;
		s.textAlign = "center";
		s.alignItems = "center";
		s.justifyContent = "center";
	}
	layoutToCenter(offsetX: number = 0, offsetY: number = 0): void {
		let rect = this.m_viewer.getBoundingClientRect();
		let parent_rect = this.m_viewer.parentElement.getBoundingClientRect();
		console.log("layoutToCenter(), rect: ", rect);
		console.log("layoutToCenter(), parent_rect: ", parent_rect);
		let px = (parent_rect.width - rect.width) * 0.5 + offsetX;
		let py = (parent_rect.height - rect.height) * 0.5 + offsetY;
		this.setXY(px, py);
	}
	setXY(px: number, py: number): void {
		// this.m_rect.x = px;
		// this.m_rect.y = py;
		this.m_style.left = px + this.unit;
		this.m_style.top = py + this.unit;
	}

	setX(px: number): void {
		// this.m_rect.x = px;
		this.m_style.left = px + this.unit;
	}
	setY(py: number): void {
		// this.m_rect.y = py;
		this.m_style.top = py + this.unit;
	}
	setSize(pw: number, ph: number): void {
		if (pw > 0 && ph > 0) {
			// this.m_rect.width = pw;
			// this.m_rect.height = ph;
			this.m_style.width = pw + this.unit;
			this.m_style.height = ph + this.unit;
		}
	}
	setWidth(pw: number): void {
		if (pw > 0) {
			// this.m_rect.width = pw;
			this.m_style.width = pw + this.unit;
		}
	}
	setHeight(ph: number): void {
		if (ph > 0) {
			// this.m_rect.height = ph;
			this.m_style.height = ph + this.unit;
		}
	}
	setTextColor(uint24: number, alpha = 1.0): void {
		this.m_style.color = "#" + uint24.toString(16);
	}
	setBackgroundColor(uint24: number, alpha = 1.0): void {
		this.m_style.backgroundColor = "#" + uint24.toString(16);
	}
	setVisible(v: boolean): void {
		DivTool.setVisible(this.m_viewer as HTMLDivElement, v);
	}
	isVisible(): boolean {
		return DivTool.isVisible(this.m_viewer as HTMLDivElement);
	}
	show(): void {
		this.setVisible(true);
	}
	hide(): void {
		this.setVisible(false);
	}
	clearDivAllEles(): void {
		DivTool.clearDivAllEles(this.m_viewer as HTMLDivElement);
	}
	getRect(): DOMRect {
		return (this.m_viewer as HTMLDivElement).getBoundingClientRect() as DOMRect;
	}
}
export { HTMLViewerLayer };

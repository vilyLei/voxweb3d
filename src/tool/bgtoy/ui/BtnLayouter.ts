// import SelectionBar from "../../../orthoui/button/SelectionBar";
import IAABB2D from "../../../vox/geom/IAABB2D";
import Vector3D from "../../../vox/math/Vector3D";
// import ProgressBar from "../../../orthoui/button/ProgressBar";
import IVector3D from "../../../vox/math/IVector3D";
interface ILayoutBtn {
	getRect(): IAABB2D;
	update():void;
	getPosition(pv: IVector3D): any;
	setPosition(pv: IVector3D): any;
}
class BtnLayouter {
	private m_pv = new Vector3D();
	constructor() {}

	horizontalLayout(rect: IAABB2D, btns: ILayoutBtn[]): void {
		let width = 0;
		for (let i = 0; i < btns.length; ++i) {
			btns[i].update();
			width += btns[i].getRect().width;
		}
		width = rect.width - width;
		let disX = width / (btns.length - 1);
		let px = rect.x;
		let py = rect.y;
		let pv = this.m_pv;
		for (let i = 0; i < btns.length; ++i) {
			const bt = btns[i];
			bt.getPosition(pv);
			pv.x = Math.round(px);
			pv.y = Math.round(py);
			bt.setPosition(pv);
			bt.update();
			px += bt.getRect().width + disX;
		}
	}
	verticalLayout(rect: IAABB2D, btns: ILayoutBtn[]): void {
		let height = 0;
		for (let i = 0; i < btns.length; ++i) {
			btns[i].update();
			height += btns[i].getRect().height;
		}
		height = rect.height - height;
		let disY = height / (btns.length - 1);
		let px = rect.x;
		let py = rect.y;
		let pv = this.m_pv;
		for (let i = 0; i < btns.length; ++i) {
			const bt = btns[i];
			bt.getPosition(pv);
			pv.x = Math.round(px);
			pv.y = Math.round(py);
			bt.setPosition(pv);
			bt.update();
			px += bt.getRect().height + disY;
		}
	}
}

export { ILayoutBtn, BtnLayouter };

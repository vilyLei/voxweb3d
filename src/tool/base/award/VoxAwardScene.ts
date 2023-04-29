import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IAwardSceneParam } from "./IAwardSceneParam";

class VoxAwardScene {
	private m_init = true;
	private m_uisc: IRendererScene;
	private m_vasParam: IAwardSceneParam;
	constructor() {}

	initialize(uisc: IRendererScene, vasParam: IAwardSceneParam): void {
		if (this.m_init) {
			this.m_init = false;
			this.m_uisc = uisc;
			this.m_vasParam = vasParam;
			this.initScene();
		}
	}
	private m_plWebHome: IRenderEntity = null;
	private m_plAppHome: IRenderEntity = null;
	private m_plAward: IRenderEntity = null;
	private m_plAwardImg: IRenderEntity = null;
	private m_areaRect: IAABB2D = null;

	private initScene(): void {
		let vparam = this.m_vasParam;
		let tex = vparam.getTexByUrl("static/assets/ui/vox.png");
		tex.dataEnoughListener = (): void => {
			tex.flipY = true;
			let plane = vparam.createBtnEntity(tex, (evt: any): void => {
				console.log(".... mouse down to web home.");
				window.open("http://www.artvily.com/", "_blank");
			});
			this.m_plWebHome = plane;
			this.m_uisc.addEntity(plane, vparam.pid);
			this.updateLayout(this.m_areaRect);

			let tex3 = vparam.getTexByUrl("static/assets/ui/thankM01_lei.jpg");
			tex3.dataEnoughListener = (): void => {
				tex3.flipY = true;
				let plane = vparam.createXOYPlane(0, 0, tex3.getWidth(), tex3.getHeight(), tex3);
				this.m_plAwardImg = plane;
				// this.m_uisc.addEntity(plane, vparam.pid);
				// this.updateLayout(this.m_areaRect);
				// this.createAwardUI();
				let tex2 = vparam.getTexByUrl("static/assets/ui/award.png");
				tex2.dataEnoughListener = (): void => {
					tex2.flipY = true;
					let plane = vparam.createBtnEntity(tex2, (evt: any): void => {
						console.log(".... mouse down to award functions.");
						this.openAwardUI();
					});
					this.m_plAward = plane;
					this.m_uisc.addEntity(plane, vparam.pid);
					this.updateLayout(this.m_areaRect);
					this.createAwardUI();
				};
			};
		};
		let tex1 = vparam.getTexByUrl("static/assets/ui/back.png");
		tex1.dataEnoughListener = (): void => {
			tex1.flipY = true;
			let plane = vparam.createBtnEntity(tex1, (evt: any): void => {
				console.log(".... mouse down to app home.");
				let url = "https://blog.csdn.net/vily_lei/article/details/130445863?spm=1001.2014.3001.5502";
				window.open(url, "_blank");
			});
			this.m_plAppHome = plane;
			this.m_uisc.addEntity(plane, vparam.pid);
			this.updateLayout(this.m_areaRect);
			this.updateLayout(this.m_areaRect);
		};
	}
	private m_awardBG: IRenderEntity = null;
	private m_awardConfirmBtn: IRenderEntity = null;
	private m_tksImg: IRenderEntity = null;
	private openAwardUI(): void {
		let vparam = this.m_vasParam;
		if (this.m_awardBG) {
			this.m_awardBG.setVisible(true);
		}
		if (this.m_awardConfirmBtn) {
			this.m_awardConfirmBtn.setVisible(true);
		}
		this.m_plAwardImg.setVisible(true);
		this.updateLayout(this.m_areaRect);
		vparam.applyFunction("open_award");
	}
	private closeAwardUI(): void {
		let vparam = this.m_vasParam;
		if (this.m_awardBG) {
			this.m_awardBG.setVisible(false);
		}
		if (this.m_awardConfirmBtn) {
			this.m_awardConfirmBtn.setVisible(false);
		}
		this.m_plAwardImg.setVisible(false);
		vparam.applyFunction("close_award");
		this.m_tksImg.setVisible(true);
		this.updateLayout(this.m_areaRect);
	}
	private m_confirmBoo = false;
	private createAwardUI(): void {
		let vparam = this.m_vasParam;
		console.log("createAwardUI(), vparam.pid + 1: ", vparam.pid + 1);
		if (this.m_awardBG == null) {
			this.m_awardBG = vparam.createTextBtnEntity("", 200, 200, 30, (evt: any): void => {
				console.log(".... mouse down award bt bg.");
			});
			// this.m_awardBG.mouseEnabled = true;
			this.m_awardBG.setVisible(false);
			// (this.m_awardBG.getMaterial() as any).setRGBA4f(0.2, 0.2, 0.2, 0.5);
			this.m_uisc.addEntity(this.m_awardBG, vparam.pid + 1);
		}
		if (this.m_awardConfirmBtn == null) {
			this.m_awardConfirmBtn = vparam.createTextBtnEntity("确  认", 110, 60, 30, (evt: any): void => {
				console.log(".... mouse down award config.");
				this.m_confirmBoo = true;
				this.closeAwardUI();
			});
			this.m_awardConfirmBtn.setVisible(false);
			this.m_plAwardImg.setVisible(false);
			// this.m_awardConfirmBtn.setXYZ(0, 0, 115);
			this.m_uisc.addEntity(this.m_awardConfirmBtn, vparam.pid + 1);
			this.m_uisc.addEntity(this.m_plAwardImg, vparam.pid + 1);
		}
		let tex = vparam.createCharsTexFixSize(300, 80, "THANK YOU", 50);
		tex.flipY = true;
		this.m_tksImg = vparam.createXOYPlane(tex.getWidth() * -0.5, tex.getHeight() * -0.5, tex.getWidth(), tex.getHeight(), tex);
		this.m_tksImg.setVisible(false);
		this.m_uisc.addEntity(this.m_tksImg, vparam.pid + 1);
		this.updateLayout(this.m_areaRect);
	}
	private m_delayTime = 0;
	run(): void {
		if(this.m_init) {
			return;
		}
		if (this.m_delayTime >= 0) {
			this.m_delayTime--;
		}
		if (this.m_tksImg && this.m_tksImg.isVisible()) {
			let plane = this.m_tksImg;
			let bounds = plane.getGlobalBounds();
			let ph = -bounds.getHeight();
			let pos = plane.getPosition();
			if (pos.y < ph) {
				plane.setVisible(false);
			} else {
				if (this.m_delayTime >= 0) {
					plane = this.m_tksImg;
					let s = Math.PI;
					let f = 1.0 - this.m_delayTime / 30.0;
					f = Math.sin(f * s);
					s = f * 0.2 + 1.0;
					console.log();
					plane.setScaleXYZ(s, s, 1.0);
				} else {
					plane.setScaleXYZ(1.0, 1.0, 1.0);
				}
				pos.y += 1.0;
				this.m_tksImg.setPosition(pos);
				this.m_tksImg.update();
			}
		}
	}
	updateLayout(rect: IAABB2D): void {
		if(this.m_init) {
			return;
		}
		this.m_areaRect = rect;
		let dis = 30;
		let st = this.m_uisc.getStage3D();
		if (this.m_plWebHome) {
			let plane = this.m_plWebHome;
			let pw = (plane as any).getWidth();
			let ph = (plane as any).getHeight();
			plane.setXYZ(st.stageWidth - pw - dis, st.stageHeight - ph - dis, 100);
			plane.update();
		}
		if (this.m_plAppHome) {
			let plane = this.m_plAppHome;
			let ph = (plane as any).getHeight();
			plane.setXYZ(dis, st.stageHeight - ph - dis, 100);
			plane.update();
		}
		if (this.m_awardBG && this.m_awardBG.isVisible()) {
			this.m_awardBG.setScaleXYZ(st.stageWidth * 0.01, st.stageHeight * 0.01, 1.0);
			// this.m_awardBG.setScaleXYZ(st.stageWidth, st.stageHeight, 1.0);
			this.m_awardBG.setXYZ(0, 0, 110);
			this.m_awardBG.update();
			let btn = this.m_awardConfirmBtn;
			if (btn && btn.isVisible()) {
				let pw = (btn as any).getWidth();
				let ph = (btn as any).getHeight();
				btn.setXYZ((st.stageWidth - pw) * 0.5, (st.stageHeight - ph) * 0.5 - 200, 125.0);
				btn.update();
				let img = this.m_plAwardImg;
				let bounds = img.getGlobalBounds();
				pw = bounds.getWidth();
				ph = bounds.getHeight();
				img.setXYZ((st.stageWidth - pw) * 0.5, (st.stageHeight - ph) * 0.5, 125.0);
				img.update();
			}
		}
		if (this.m_plWebHome && this.m_plAward) {
			let plane = this.m_plWebHome;
			let pos = plane.getPosition();
			let pw = (plane as any).getWidth();
			let ph = (plane as any).getHeight();
			let pl2 = this.m_plAward;
			let pw2 = (pl2 as any).getWidth();
			let ph2 = (pl2 as any).getHeight();
			pos.x += 0.5 * pw;
			pos.x -= 0.5 * pw2;
			pl2.setXYZ(pos.x, st.stageHeight - (22 + ph + ph2) - dis, 100);
			pl2.update();
		}
		if (this.m_confirmBoo) {
			if (this.m_tksImg && this.m_tksImg.isVisible()) {
				let plane = this.m_tksImg;
				// plane.update();
				let bounds = plane.getGlobalBounds();
				let ph = bounds.getHeight();

				plane.setScaleXYZ(1.0, 1.0, 1.0);
				plane.setXYZ(st.stageHalfWidth, st.stageHeight - ph - 80, 130);
				plane.update();
				this.m_delayTime = 30;
			}
			this.m_confirmBoo = false;
		}
	}
}
export { VoxAwardScene };

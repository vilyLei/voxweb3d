import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";
import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import UIBarTool from "../../../orthoui/button/UIBarTool";
import IColor4 from "../../../vox/material/IColor4";
import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";
import RendererState from "../../../vox/render/RendererState";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import TextureConst from "../../../vox/texture/TextureConst";
import ImageResLoader from "../../../vox/assets/ImageResLoader";

class UIBuilder {
	private m_imgLoader = new ImageResLoader();
	private m_rscene: IRendererScene = null;
	private m_uisrc: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;
	private m_total = 0;
	saveBtn: ColorRectImgButton = null;
	resetBtn: ColorRectImgButton = null;
	addIntoBtn: ColorRectImgButton = null;
	expandUIItemBtn: ColorRectImgButton = null;
	buildFinishCall: () => void = null;
	constructor(sc: IRendererScene = null) {
		this.m_rscene = sc;
	}

	initialize(graph: IRendererSceneGraph): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			this.m_uisrc = this.m_graph.getNodeAt(1).getRScene();
			this.init();
		}
	}
	hideSpecBtns(): void {
		let addIntoBtn = this.addIntoBtn;
		if (addIntoBtn) {
			addIntoBtn.outColor.setRGBA4f(0.8, 0.8, 0.8, 0.0);
			addIntoBtn.overColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
			addIntoBtn.downColor.setRGBA4f(1.0, 1.0, 0.2, 0.0);
			addIntoBtn.setColor(addIntoBtn.outColor);
		}
	}
	private init(): void {
		let url = "static/assets/ui/reset.png";
		let fontColor = new Color4(1.0, 1.0, 1.0, 1.0);
		let bgColor = new Color4(1.0, 1.0, 1.0, 0.3);

		this.m_imgLoader.load(url, (pimg: HTMLImageElement, imgUrl: string): void => {
			let btn = this.createBtnWithIcon(
				"reset_btn",
				pimg,
				200,
				60,
				"恢复初始设置",
				25,
				new Vector3D(-20, 0),
				new Vector3D(-10),
				fontColor,
				bgColor
			);
			this.applyBtnColor(btn);
			this.resetBtn = btn;
			this.updateBuildFinish();
		});

		url = "static/assets/ui/download.png";
		this.m_imgLoader.load(url, (pimg: HTMLImageElement, imgUrl: string): void => {
			let btn = this.createBtnWithIcon("save_btn", pimg, 200, 60, "保存图片", 25, new Vector3D(-13, 0), new Vector3D(-20), fontColor, bgColor);
			this.applyBtnColor(btn);
			this.saveBtn = btn;
			this.updateBuildFinish();
		});

		url = "static/assets/ui/addInto.png";

		this.m_imgLoader.load(url, (pimg: HTMLImageElement, imgUrl: string): void => {
			let pw = pimg.width * 2.0;
			let ph = pimg.height * 2.0;
			let data = UIBarTool.CreateImageCanvasFixSize(512, 512, pw, ph, pimg, new Color4(1.0,1.0,1.0, 0.1), new Vector3D((512 - pw) * 0.5, (512 - ph) * 0.5));
			let tex = this.m_rscene.textureBlock.createImageTex2D();
			tex.setDataFromImage(data);
			let btn = UIBarTool.CreateBtnWithTex(tex);
			this.applyBtnColor(btn);
			btn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
			this.addIntoBtn = btn;
			this.updateBuildFinish();
		});

		let expandTrueBtnImg = UIBarTool.CreateCharsCanvasFixSize(60, 60, ">>", 25, fontColor, bgColor);
		let expandFalseBtnImg = UIBarTool.CreateCharsCanvasFixSize(60, 60, "<<", 25, fontColor, bgColor);
		UIBarTool.AddImageToAtlas("expandUIItem_true", expandTrueBtnImg);
		UIBarTool.AddImageToAtlas("expandUIItem_false", expandFalseBtnImg);
	}
	private applyBtnColor(btn: ColorRectImgButton): void {
		btn.outColor.setRGBA4f(0.8, 0.8, 0.8, 0.8);
		btn.overColor.setRGBA4f(1.0, 1.0, 1.0, 0.5);
		btn.downColor.setRGBA4f(1.0, 1.0, 0.2, 0.5);
		btn.setColor(btn.outColor);
	}
	private updateBuildFinish(): void {
		this.m_total++;
		if (this.m_total > 2 && this.buildFinishCall) {
			this.buildFinishCall();
		}
	}
	createBtn(btn_name: string, fontSize: number, fontColor: Color4 = null, fontBgColor: Color4 = null, fixWidth: number = 0): ColorRectImgButton {
		return UIBarTool.CreateBtn(btn_name, fontSize, fontColor, fontBgColor, fixWidth);
	}
	createCharsCanvasFixSize(
		width: number,
		height: number,
		str: string,
		fontSize: number,
		textPos: Vector3D,
		fontColor: IColor4,
		fontBgColor: IColor4
	): HTMLCanvasElement | HTMLImageElement {
		return UIBarTool.CreateCharsCanvasFixSize(width, height, str, fontSize, fontColor, fontBgColor, textPos);
	}
	createCharsTexFixSize(
		width: number,
		height: number,
		str: string,
		fontSize: number,
		textPos: Vector3D = null,
		fontColor: IColor4 = null,
		fontBgColor: IColor4 = null
	): IRenderTexture {
		if(textPos == null) {
			textPos = new Vector3D();
		}
		if(fontColor == null) {
			fontColor = new Color4();
		}
		if(fontBgColor == null) {
			fontBgColor = new Color4(1,1,1,0);
		}
		let img = UIBarTool.CreateCharsCanvasFixSize(width, height, str, fontSize, fontColor, fontBgColor, textPos);
		let tex = this.m_rscene.textureBlock.createImageTex2D();
		tex.minFilter = tex.magFilter = TextureConst.NEAREST;
		tex.mipmapEnabled = false;
		tex.setDataFromImage(img);
		return tex;
	}
	createBtnWithIcon(
		keyStr: string,
		img: HTMLCanvasElement | HTMLImageElement,
		width: number,
		height: number,
		str: string,
		fontSize: number,
		textPos: Vector3D,
		imgOffset: Vector3D,
		fontColor: IColor4,
		fontBgColor: IColor4
	): ColorRectImgButton {
		let canvas = UIBarTool.CreateCharsCanvasFixSize(width, height, str, fontSize, fontColor, fontBgColor, textPos);
		if (img) {
			let imgPx = imgOffset.x + canvas.width - img.width;
			let imgPy = imgOffset.y + Math.round((canvas.height - img.height) * 0.5);
			const ctx2d = canvas.getContext("2d");
			ctx2d.drawImage(img, 0, 0, img.width, img.height, imgPx, imgPy, img.width, img.height);
		}
		UIBarTool.AddImageToAtlas(keyStr, canvas);
		let btn = UIBarTool.CreateBtnWithKeyStr(keyStr);
		btn.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		return btn;
	}
}

export { UIBuilder };

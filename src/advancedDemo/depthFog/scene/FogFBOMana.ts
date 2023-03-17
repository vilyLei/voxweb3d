import TextureConst from "../../../vox/texture/TextureConst";
import TextureFormat from "../../../vox/texture/TextureFormat";
import TextureProxy from "../../../vox/texture/TextureProxy";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import { IRendererInstanceContext } from "../../../vox/scene/IRendererInstanceContext";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RendererScene from "../../../vox/scene/RendererScene";
import TextureDataType from "../../../vox/texture/TextureDataType";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";
import RendererDevice from "../../../vox/render/RendererDevice";

export class FogFBOMana {
	constructor() {}

	private m_rc: RendererScene = null;
	private m_rct: IRendererInstanceContext = null;
	private m_texLoader: ImageTextureLoader;
	getImageTexByUrl(pns: string): TextureProxy {
		let tex: TextureProxy = this.m_texLoader.getImageTexByUrl("static/voxgl/assets/" + pns);
		tex.mipmapEnabled = true;
		return tex;
	}
	private m_texs: IRTTTexture[] = [null, null, null, null, null, null];
	public getTextureAt(index: number, float: boolean = false): IRTTTexture {
		if (this.m_texs[index] != null) {
			return this.m_texs[index];
		}
		let tex = this.m_texs[index] = this.m_rc.textureBlock.createRTTTex2D() as RTTTextureProxy;
		// float = false;
		if (float) {
			// tex.internalFormat = TextureFormat.RGBA;
			tex.internalFormat = TextureFormat.RGBA16F;
			tex.srcFormat = TextureFormat.RGBA;
			if(RendererDevice.IsWebGL1()) {
				tex.dataType = TextureDataType.HALF_FLOAT_OES;
			}else {
				tex.dataType = TextureDataType.HALF_FLOAT;
			}
            // tex.internalFormat = TextureFormat.RGBA16F;
            // tex.srcFormat = TextureFormat.RGBA;
            // tex.dataType = TextureDataType.HALF_FLOAT_OES;
            // tex.minFilter = TextureConst.NEAREST;
            // tex.magFilter = TextureConst.NEAREST;
		} else {
			tex.internalFormat = TextureFormat.RGBA;
			tex.srcFormat = TextureFormat.RGBA;
		}
		tex.minFilter = TextureConst.NEAREST;
		tex.magFilter = TextureConst.NEAREST;
		// tex.minFilter = TextureConst.LINEAR;
		// tex.magFilter = TextureConst.LINEAR;

		return tex;
	}
	private m_middleFBO: FBOInstance = null;
	private m_parFBO: FBOInstance = null;
	private m_factorFBO: FBOInstance = null;
	createMiddleFBO(rpids: number[]): FBOInstance {
		this.m_middleFBO = this.m_rc.createFBOInstance();
		// this.m_middleFBO.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
		this.m_middleFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
		//this.m_middleFBO.createFBOAt(0,this.m_rct.getViewWidth(), this.m_rct.getViewHeight(),true,false);
		this.m_middleFBO.createViewportSizeFBOAt(0, true, false);
		this.m_middleFBO.setClearState(true, true, false);
		this.m_middleFBO.setRenderToTexture(this.getTextureAt(0, RendererDevice.IsWebGL1()), 0); // color
		this.m_middleFBO.setRenderToTexture(this.getTextureAt(1, true), 1); // depth
		this.m_middleFBO.setRProcessIDList(rpids, false);
		return this.m_middleFBO;
	}
	createParFBO(rpids: number[]): FBOInstance {
		this.m_parFBO = this.m_middleFBO.clone();
		this.m_parFBO.setRenderToTexture(this.getTextureAt(0, RendererDevice.IsWebGL1()), 0);
		this.m_parFBO.setClearState(false, false, false);
		this.m_parFBO.setRProcessIDList(rpids, false);
		return this.m_parFBO;
	}
	createFactorFBO(rpids: number[] = null): FBOInstance {
		this.m_factorFBO = this.m_rc.createFBOInstance();
		this.m_factorFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
		//this.m_factorFBO.createFBOAt(1,this.m_rct.getViewWidth(), this.m_rct.getViewHeight(),false,false);
		this.m_factorFBO.createViewportSizeFBOAt(1, true, false);
		this.m_factorFBO.setClearState(true, true, false);
		this.m_factorFBO.setRenderToTexture(this.getTextureAt(2, false), 0);
		this.m_factorFBO.setRenderToTexture(this.getTextureAt(3, false), 1);
		this.m_factorFBO.setRProcessIDList(rpids, false);

		return this.m_factorFBO;
	}
	initialize(rc: RendererScene): void {
		//console.log("FogFBOMana::initialize()......");
		if (this.m_rc == null) {
			this.m_rc = rc;
			this.m_rct = this.m_rc.getRendererContext();
		}
	}
}

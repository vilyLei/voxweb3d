import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";
import TextureConst from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";

import TextureFormat from "../../vox/texture/TextureFormat";
import TextureDataType from "../../vox/texture/TextureDataType";

import { FogDepthUVMaterial } from "../../advancedDemo/depthFog/material/FogDepthUVMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { PBRParam, PBRMateralBuilder } from "../../demo/material/PBRMateralBuilder";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import { IRTTTexture } from "../../vox/render/texture/IRTTTexture";
import FBOInstance from "../../vox/scene/FBOInstance";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import { FogSphRenderNode } from "../../advancedDemo/depthFog/scene/FogSphRenderNode";
import { FogSphShow2Material } from "../../advancedDemo/depthFog/material/FogSphShow2Material";

export class DemoSphDepthFog {
	private m_pbr = new PBRMateralBuilder();
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	constructor() {}

	private applyPBRTex(param: PBRParam, texName: string, envMapEnabled: boolean = true): void {
		param.envMap = envMapEnabled ? this.m_pbr.getEnvMap() : null;
		param.diffuseMap = this.getTexByUrl(`pbr/${texName}/albedo.jpg`);
		param.normalMap = this.getTexByUrl(`pbr/${texName}/normal.jpg`);
		param.roughnessMap = this.getTexByUrl(`pbr/${texName}/roughness.jpg`);
		param.metallicMap = this.getTexByUrl(`pbr/${texName}/metallic.jpg`);
		param.aoMap = this.getTexByUrl(`pbr/${texName}/ao.jpg`);
	}
	private getTexByUrl(pns: string): TextureProxy {
		return this.getImageTexByUrl("static/assets/" + pns);
	}
	private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);

		return ptex;
	}

	createMaterial(color: Color4 = null, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
		let material = new FogDepthUVMaterial();
		if (color) {
			material.setRGBColor(color);
		}
		return material;
	}
	createMaterial2(color: Color4 = null, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
		let param = new PBRParam(Math.random() * 1.2, Math.random() * 1.2, 1.2, new Color4(1.0, 1.0, 1.0));
		param.depthFog = true;
		if (uvParam != null) {
			param.setUVOffset(uvParam.x, uvParam.y);
			param.setUVScale(uvParam.z, uvParam.w);
		}
		ns = ns == "" ? "gold" : ns;
		this.applyPBRTex(param, ns);
		let material = this.m_pbr.createTextureMaterialWrapper(param);
		return material;
	}

	private m_texs: IRTTTexture[] = [null, null, null, null, null, null];
	public getTextureAt(index: number, float: boolean = false): IRTTTexture {
		if (this.m_texs[index] != null) {
			return this.m_texs[index];
		}
		let tex = (this.m_texs[index] = this.m_rscene.textureBlock.createRTTTex2D());
		// float = false;
		if (float) {
			// tex.internalFormat = TextureFormat.RGBA;
			tex.internalFormat = TextureFormat.RGBA16F;
			tex.srcFormat = TextureFormat.RGBA;
			if (RendererDevice.IsWebGL1()) {
				tex.dataType = TextureDataType.HALF_FLOAT_OES;
			} else {
				tex.dataType = TextureDataType.HALF_FLOAT;
			}
		} else {
			tex.internalFormat = TextureFormat.RGBA;
			tex.srcFormat = TextureFormat.RGBA;
		}
		tex.minFilter = TextureConst.NEAREST;
		tex.magFilter = TextureConst.NEAREST;

		return tex;
	}
	initialize(): void {
		if (this.m_rscene == null) {
			console.log("DemoSphDepthFog::initialize()......");
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

			let rparam = new RendererParam();
			// rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45.0, 1.0, 9000.0);
			rparam.setCamPosition(2500.0, 2500.0, 2500.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5).setAutoRunning(true);
			this.m_rscene.updateCamera();
			this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

			this.buildFBOs();
		}
	}

	createCommonFBO(rpids: number[]): FBOInstance {
		let fbo = this.m_rscene.createFBOInstance();
		fbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
		fbo.createViewportSizeFBOAt(0, true, false);
		fbo.setClearState(true, true, false);
		fbo.setRenderToTexture(this.getTextureAt(0, RendererDevice.IsWebGL1()), 0); // color
		fbo.setRenderToTexture(this.getTextureAt(1, true), 1); // depth
		fbo.setRProcessIDList(rpids, false);

		return fbo;
	}

	createParticleFBO(rpids: number[], srcFBO: FBOInstance): FBOInstance {
		let fbo = srcFBO.clone();
		fbo.setRenderToTexture(this.getTextureAt(0, RendererDevice.IsWebGL1()), 0);
		fbo.setClearState(false, false, false);
		fbo.setRProcessIDList(rpids, false);

		return fbo;
	}

	createFactorFBO(): FBOInstance {
		let fbo = this.m_rscene.createFBOInstance();
		fbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
		fbo.createViewportSizeFBOAt(1, true, false);
		fbo.setClearState(true, true, false);
		fbo.setRenderToTexture(this.getTextureAt(2, false), 0);
		fbo.setRenderToTexture(this.getTextureAt(3, false), 1);

		return fbo;
	}
	private buildFBOs(): void {
		let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
		let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");
		let tex2 = this.getImageTexByUrl("static/assets/flare_core_02.jpg");
		let tex3 = this.getImageTexByUrl("static/assets/flare_core_03.jpg");

		// add common 3d display entity ---------------------------------- begin

		let material = this.createMaterial();

		let plane = new Plane3DEntity();

		plane.setMaterial(material);
		plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
		this.m_rscene.addEntity(plane);

		let box = new Box3DEntity();
		box.setMaterial(material);
		box.initializeCube(150.0, [tex1]);
		this.m_rscene.addEntity(box);

		let size = 1800.0;
		let bgBox = new Box3DEntity();
		bgBox.normalScale = -1.0;
		material = this.createMaterial(null, new Vector3D(0.0, 0.0, 5.0, 5.0), "rusted_iron");
		// material = new FogDepthUVMaterial();
		// material.setFRGB3f(0.6, 0.6, 0.6);
		// material.setUVScale(10.0, 10.0);
		bgBox.setMaterial(material);
		bgBox.showFrontFace();
		bgBox.initialize(new Vector3D(-size, -size, -size), new Vector3D(size, size, size), [tex1]);
		bgBox.setScaleXYZ(2.0, 2.0, 2.0);
		this.m_rscene.addEntity(bgBox, 1);

		let particleProcIndex = 2;
		// let sph = new Sphere3DEntity();
		// // sph.setMaterial( material );
		// sph.initialize(50.0, 30, 30, [tex1]);
		// sph.setXYZ(0, 0, -200);
		// this.m_rscene.addEntity(sph, particleProcIndex);
		//*
		let src_particle = new Billboard3DEntity();
		src_particle.initialize(100, 100, [tex2]);
		let pv = new Vector3D();
		for(let i = 0; i < 30; ++i) {
			let particle = new Billboard3DEntity();
			particle.copyMeshFrom(src_particle);
			particle.initialize(100, 100, [tex3]);
			let scale = Math.random() + 0.2;
			particle.setXYZ(Math.random() * 2000 - 1000, Math.random() * 1000, Math.random() * 2000 - 1000);
			particle.setScaleXY(scale, scale);
			particle.setRGB3f(Math.random(), Math.random(), Math.random());
			this.m_rscene.addEntity(particle, particleProcIndex);
		}
		//*/
		// add common 3d display entity ---------------------------------- end

		let commonFBO = this.createCommonFBO([0, 1]);
		commonFBO.setAutoRunning(true);

		let partFBO = this.createParticleFBO([particleProcIndex], commonFBO);
		partFBO.setAutoRunning(true);

		let factorFBO = this.createFactorFBO();

		let factorRenderNode = new FogSphRenderNode();
		factorRenderNode.texLoader = this.m_texLoader;
		factorRenderNode.initialize(this.m_rscene, commonFBO.getRTTAt(1), factorFBO);

		this.m_rscene.prependRenderNode(factorRenderNode);



		let fogShow2M = new FogSphShow2Material();

		fogShow2M.setTextureList(
			[
				commonFBO.getRTTAt(0)
				, factorFBO.getRTTAt(0)
				, factorFBO.getRTTAt(1)
			]
		);

		let dstPlane = new Plane3DEntity();
		dstPlane.setMaterial(fogShow2M);
		dstPlane.initializeXOY(
			// -1.0, -1.0, 2.0, 2.0
			-0.5, -0.5, 1.0, 1.0
		);
		this.m_rscene.addEntity(dstPlane, 3);

		let tipsProcIndex = 4;
		let scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.9, -0.9, 0.3, 0.3, [commonFBO.getRTTAt(0)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);

		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.55, -0.9, 0.3, 0.3, [commonFBO.getRTTAt(1)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);

		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.2, -0.9, 0.3, 0.3, [factorFBO.getRTTAt(0)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);

		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(0.15, -0.9, 0.3, 0.3, [factorFBO.getRTTAt(1)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);
	}
}
export default DemoSphDepthFog;

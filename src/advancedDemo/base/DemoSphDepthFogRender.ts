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


import { FogDepthUVMaterial } from "../../advancedDemo/depthFog/material/FogDepthUVMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { PBRParam, PBRMateralBuilder } from "../../demo/material/PBRMateralBuilder";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import { SphDepthFogRenderNode } from "../../advancedDemo/depthFog/renderer/SphDepthFogRenderNode";
import RendererState from "../../vox/render/RendererState";

export class DemoSphDepthFogRender {
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

	createMaterial2(color: Color4 = null, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
		let material = new FogDepthUVMaterial();
		if (color) {
			material.setRGBColor(color);
		}
		return material;
	}
	createMaterial(color: Color4 = null, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
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

	initialize(): void {
		if (this.m_rscene == null) {
			console.log("DemoSphDepthFogRender::initialize()......");
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

			let rparam = new RendererParam();
			rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45.0, 1.0, 9000.0);
			rparam.setCamPosition(2500.0, 2500.0, 2500.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5).setAutoRunning(true);
			this.m_rscene.updateCamera();
			this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

			this.buildFogScene();
		}
	}
	private buildFogScene(): void {

		this.m_pbr.sharedLightColor = false;
		this.m_pbr.initialize(this.m_rscene);

		let tex3 = this.getImageTexByUrl("static/assets/flare_core_03.jpg");

		// add common 3d display entity ---------------------------------- begin

		let material = this.createMaterial();

		let planeSph = new Sphere3DEntity();
		planeSph.meshMode = -1;
		planeSph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		planeSph.setMaterial(material);
		planeSph.initialize(220.0, 30, 30);
		planeSph.setXYZ(0, -70, 0);
		this.m_rscene.addEntity(planeSph);

		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(150.0, 30, 30);
		this.m_rscene.addEntity(sph);

		let size = 1800.0;
		let bgBox = new Box3DEntity();
		bgBox.normalScale = -1.0;
		material = this.createMaterial(null, new Vector3D(0.0, 0.0, 5.0, 5.0), "rusted_iron");
		bgBox.setMaterial(material);
		bgBox.showFrontFace();
		bgBox.initialize(new Vector3D(-size, -size, -size), new Vector3D(size, size, size));
		bgBox.setScaleXYZ(2.0, 2.0, 2.0);
		this.m_rscene.addEntity(bgBox, 1);

		let particleProcIndex = 2;
		//*
		let src_particle = new Billboard3DEntity();
		src_particle.initialize(100, 100, [tex3]);
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

		let fogRenderNode = new SphDepthFogRenderNode();
		fogRenderNode.texLoader = this.m_texLoader;
		fogRenderNode.initialize(this.m_rscene, [0, 1], [particleProcIndex]);

		let displayMaterial = fogRenderNode.createDisplayMaterial();
		let dstPlane = new Plane3DEntity();
		dstPlane.setMaterial(displayMaterial);
		dstPlane.initializeXOY(
			// -1.0, -1.0, 2.0, 2.0
			-0.5, -0.5, 1.0, 1.0
		);
		this.m_rscene.addEntity(dstPlane, 3);

		const commonFBO = fogRenderNode.getCommonFBO();
		const factorFBO = fogRenderNode.getFactorFBO();
		let tipsProcIndex = 4;
		// display the color rtt rendering content
		let scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.9, -0.9, 0.3, 0.3, [commonFBO.getRTTAt(0)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);

		// display the depth rtt rendering content
		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.55, -0.9, 0.3, 0.3, [commonFBO.getRTTAt(1)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);

		// display the fog factor rtt rendering content
		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.2, -0.9, 0.3, 0.3, [factorFBO.getRTTAt(0)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);

		// display the fog color rendering content
		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(0.15, -0.9, 0.3, 0.3, [factorFBO.getRTTAt(1)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);
	}
}
export default DemoSphDepthFogRender;

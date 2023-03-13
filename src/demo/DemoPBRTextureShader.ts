import IRendererScene from "../vox/scene/IRendererScene";

import { PBRParam, PBRMateralBuilder } from "./material/PBRMateralBuilder";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cone3DEntity from "../vox/entity/Cone3DEntity";
import Torus3DEntity from "../vox/entity/Torus3DEntity";
import Color4 from "../vox/material/Color4";

export class DemoPBRTextureShader {
	private m_rscene: IRendererScene = null;
	private m_pbr = new PBRMateralBuilder();
	constructor() {}

	initialize(): void {
		this.initRenderer();
		this.initMouseInteract();
		this.init3DScene();
	}
	private initMouseInteract(): void {
		const mi = new MouseInteraction();
		mi.initialize(this.m_rscene).setAutoRunning(true);
	}
	private initRenderer(): void {
		let RD = RendererDevice;
		RD.SHADERCODE_TRACE_ENABLED = true;
		RD.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

		let rparam = new RendererParam();
		rparam.setCamPosition(1000.0, 1000.0, 1000.0);
		rparam.setCamProject(45, 20.0, 9000.0);
		this.m_rscene = new RendererScene()
		this.m_rscene.initialize(rparam).setAutoRunning(true);
		this.m_rscene.setClearUint24Color(0x888888);
	}
	
    private getTexByUrl(url: string): IRenderTexture {

        let tex = this.m_rscene.textureBlock.createImageTex2D();
        let img = new Image();
        img.onload = (evt: any): void => {
            tex.setDataFromImage(img);
        };
        img.src = url;
        return tex;
    }
	private applyTex(param: PBRParam, texName: string, envMapEnabled: boolean = true): void {

		param.envMap = envMapEnabled ? this.m_pbr.getEnvMap() : null;
		param.diffuseMap = this.getTexByUrl(`static/assets/pbr/${texName}/albedo.jpg`);
		param.normalMap = this.getTexByUrl(`static/assets/pbr/${texName}/normal.jpg`);
		param.roughnessMap = this.getTexByUrl(`static/assets/pbr/${texName}/roughness.jpg`);
		param.metallicMap = this.getTexByUrl(`static/assets/pbr/${texName}/metallic.jpg`);
		param.aoMap = this.getTexByUrl(`static/assets/pbr/${texName}/ao.jpg`);
	}
	private init3DScene(): void {
		this.m_pbr.sharedLightColor = false;
		this.m_pbr.initialize(this.m_rscene);

		let param = new PBRParam(Math.random() * 1.2, 0.3, 0.2, new Color4(1.0, 1.0, 1.0));
		this.applyTex(param, "rusted_iron");
		let material = this.m_pbr.createTextureMaterialWrapper(param);
		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(150, 20, 20);
		this.m_rscene.addEntity(sph);
		
		param = new PBRParam(Math.random() * 1.2, Math.random() * 1.2, 1.0);
		this.applyTex(param, "rusted_iron");
		// this.applyTex(param, "gold"); 
		material = this.m_pbr.createTextureMaterialWrapper(param);
		let cone = new Cone3DEntity();
		cone.setMaterial(material);
		cone.initialize(70, 150, 30);
		cone.setXYZ(-200, 0.0, 200.0);
		this.m_rscene.addEntity(cone);

		param = new PBRParam(Math.random() * 1.2, Math.random() * 1.2, 1.0);
		param.setUVScale(3.0, 1.0);
		this.applyTex(param, "wall");
		material = this.m_pbr.createTextureMaterialWrapper( param );
		let torus = new Torus3DEntity();
		torus.axisType = 1;
		torus.setMaterial(material);
		torus.initialize(80, 30, 30, 50, null, 1);
		torus.setXYZ(200, 0.0, -200.0);
		this.m_rscene.addEntity(torus);
	}
}

export default DemoPBRTextureShader;

// for running instance
if (!(document as any).demoState) {
	let ins = new DemoPBRTextureShader();
	ins.initialize();
}

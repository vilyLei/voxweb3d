import IRendererScene from "../../vox/scene/IRendererScene";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { PBREnvLightingMaterialWrapper } from "../material/PBREnvLightingMaterialWrapper";
import { PBRTextureMaterialWrapper } from "../material/PBRTextureMaterialWrapper";
import { BinaryTextureLoader } from "../../cospace/modules/loaders/BinaryTextureLoader";
import IColor4 from "../../vox/material/IColor4";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";

class PBRParam {
	roughness = 0.0;
	metallic = 0.0;
	ao = 1.0;
	albedoColor: IColor4 = null;

	envMap: IRenderTexture = null;
	diffuseMap: IRenderTexture = null;
	normalMap: IRenderTexture = null;
	roughnessMap: IRenderTexture = null;
	metallicMap: IRenderTexture = null;
	aoMap: IRenderTexture = null;

	uvTrans = new Vector3D(0,0,1.0,1.0);

	depthFog = false;

	constructor(roughness: number, metallic: number, ao: number = 1.0, albedoColor: IColor4 = null){
		this.roughness = roughness;
		this.metallic = metallic;
		this.ao = ao;
		this.albedoColor = albedoColor;
	}
	setUVOffset(px: number, py: number): void {
		this.uvTrans.x = px;
		this.uvTrans.y = py;
	}
	setUVScale(sx: number, sy: number): void {
		this.uvTrans.z = sx;
		this.uvTrans.w = sy;
	}
}
class PBRMateralBuilder {
	private m_rscene: IRendererScene = null;
	private static s_envMap: IRenderTexture;
	sharedLightColor = true;
	hdrBrnEnabled = true;
	/**
	 * 记录点光源灯光位置
	 */
	private m_lightPosList: Vector3D[];
	/**
	 * 记录点光源灯光颜色
	 */
	private m_lightColorList: IColor4[];
	getEnvMap(): IRenderTexture {
		
		if (PBRMateralBuilder.s_envMap == null) {
			let envMapUrl = "static/bytes/spe.mdf";
			if (this.hdrBrnEnabled) {
                envMapUrl = "static/bytes/speBrn.bin";
            }
			let loader = new BinaryTextureLoader(this.m_rscene);
			loader.hdrBrnEnabled = this.hdrBrnEnabled;
			loader.loadTextureWithUrl(envMapUrl);
			PBRMateralBuilder.s_envMap = loader.texture;
		}

		return PBRMateralBuilder.s_envMap;
	}
	initialize(sc: IRendererScene): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.initRenderingData();
		}
	}
	private initRenderingData(): void {

		const vec3 = new Vector3D();
		let dis = 700.0;
		let disY = 900.0;
		this.m_lightPosList = [
			vec3.clone().setXYZ(-dis, disY, -dis),
			vec3.clone().setXYZ(dis, disY, dis),
			vec3.clone().setXYZ(dis, disY, -dis),
			vec3.clone().setXYZ(-dis, disY, dis)
		];

		if (this.sharedLightColor) {
			this.initLightColor();
		}
	}
	private initLightColor(): void {
		const color = new Color4();
		let colorSize = 300.0;
		this.m_lightColorList = [
			color.clone().randomRGB(colorSize),
			color.clone().randomRGB(colorSize),
			color.clone().randomRGB(colorSize),
			color.clone().randomRGB(colorSize)
		];
	}
	createMaterial(roughness: number, metallic: number, ao: number = 1.0, albedoColor: IColor4 = null): IRenderMaterial {
		if (!this.sharedLightColor) {
			this.initLightColor();
		}
		let wrapper = new PBREnvLightingMaterialWrapper();
		wrapper.hdrBrnEnabled = this.hdrBrnEnabled;
		wrapper.setTextureList([ this.getEnvMap() ]);

		for (let i = 0; i < 4; ++i) {
			wrapper.setPosAt(i, this.m_lightPosList[i]);
			wrapper.setColorAt(i, this.m_lightColorList[i]);
		}
		wrapper.setRoughness(roughness);
		wrapper.setMetallic(metallic);
		wrapper.setAO(ao);
		if (albedoColor != null) {
			wrapper.setAlbedoColor(albedoColor);
		} else {
			wrapper.setAlbedoColor(new Color4().randomRGB(1.0));
		}
		return wrapper.material;
	}
	createTextureMaterialWrapper(param: PBRParam): IRenderMaterial {
		if (!this.sharedLightColor) {
			this.initLightColor();
		}
		let wrapper = new PBRTextureMaterialWrapper();
		wrapper.hdrBrnEnabled = this.hdrBrnEnabled;
		wrapper.depthFog = param.depthFog;
		
		let texList: IRenderTexture[] = [];
		wrapper.envMapEnabled = param.envMap != null;
		if(wrapper.envMapEnabled) {
			texList.push(param.envMap);
		}
		wrapper.diffuseMapEnabled = param.diffuseMap != null;
		if(wrapper.diffuseMapEnabled) {
			texList.push(param.diffuseMap);
		}
		wrapper.normalMapEnabled = param.normalMap != null;
		if(wrapper.normalMapEnabled) {
			texList.push(param.normalMap);
		}

		wrapper.roughnessMapEnabled = param.roughnessMap != null;
		if(wrapper.roughnessMapEnabled) {
			texList.push(param.roughnessMap);
		}

		wrapper.metallicMapEnabled = param.metallicMap != null;
		if(wrapper.metallicMapEnabled) {
			texList.push(param.metallicMap);
		}

		wrapper.aoMapEnabled = param.aoMap != null;
		if(wrapper.aoMapEnabled) {
			texList.push(param.aoMap);
		}
		for (let i = 0; i < 4; ++i) {
			wrapper.setLightPosAt(i, this.m_lightPosList[i]);
			wrapper.setLightColorAt(i, this.m_lightColorList[i]);
		}
		wrapper.setRoughness(param.roughness);
		wrapper.setMetallic(param.metallic);
		wrapper.setAO(param.ao);
		if (param.albedoColor != null) {
			wrapper.setAlbedoColor(param.albedoColor);
		} else {
			wrapper.setAlbedoColor(new Color4().randomRGB(1.0));
		}
		wrapper.setTextureList(texList);
		let uvTrans = param.uvTrans;
		wrapper.setUVOffset(uvTrans.x, uvTrans.y);
		wrapper.setUVScale(uvTrans.z, uvTrans.w);
		return wrapper.material;
	}
}

export {PBRParam, PBRMateralBuilder}
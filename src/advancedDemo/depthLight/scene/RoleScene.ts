import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";
import RendererState from "../../../vox/render/RendererState";
import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import RendererScene from "../../../vox/scene/RendererScene";

import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import { FogDepthUVMaterial } from "../material/FogDepthUVMaterial";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import { PBRParam, PBRMateralBuilder } from "../../../demo/material/PBRMateralBuilder";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

export class RoleScene {
	private m_pbr = new PBRMateralBuilder();
	constructor() {}

	private m_rc: RendererScene = null;
	texLoader: ImageTextureLoader = null;
	getImageTexByUrl(pns: string): TextureProxy {
		let tex: TextureProxy = this.texLoader.getImageTexByUrl("static/assets/" + pns);
		tex.setWrap(TextureConst.WRAP_REPEAT);
		tex.mipmapEnabled = true;
		return tex;
	}
	private m_entityRSCIndex: number = 0;
	private m_entityBGIndex: number = 2;
	private m_srcSph: Sphere3DEntity = new Sphere3DEntity();
	private m_srcBox: Box3DEntity = new Box3DEntity();
	private m_minV: Vector3D;
	private m_maxV: Vector3D;
	private m_size: number = 64.0;
	createMaterial2(color: Color4): IRenderMaterial {
		let material = new FogDepthUVMaterial();
		if (color) {
			material.setRGBColor(color);
		}
		return material;
	}
    createMaterial(color: Color4, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
        let param = new PBRParam(Math.random() * 1.2, Math.random() * 1.2, 1.2, new Color4(1.0, 1.0, 1.0));
        param.depthFog = true;
        if(uvParam != null) {
            param.setUVOffset(uvParam.x, uvParam.y);
            param.setUVScale(uvParam.z, uvParam.w);
        }
        ns = ns == "" ? "gold" : ns;
		this.applyTex(param, ns);
		let material = this.m_pbr.createTextureMaterialWrapper(param);
        return material;
    }
	private createRole(flag: number, pv: Vector3D, color: Color4, texs: TextureProxy[]): DisplayEntity {
		let material: IRenderMaterial;
		switch (flag) {
			case 0:
				let box: Box3DEntity = new Box3DEntity();
				// material = new FogDepthUVMaterial();
				// material.setRGBColor(color);
				material = this.createMaterial(color);
				box.setMaterial(material);
				box.setMesh(this.m_srcBox.getMesh());
				box.initialize(this.m_minV, this.m_maxV, texs);
				box.setPosition(pv);
				this.m_rc.addEntity(box, this.m_entityRSCIndex);
				return box;
				break;
			case 1:
				let sph: Sphere3DEntity = new Sphere3DEntity();
				// material = new FogDepthUVMaterial();
				// material.setRGBColor(color);
				material = this.createMaterial(color);
				sph.setMaterial(material);
				sph.setMesh(this.m_srcSph.getMesh());
				sph.initialize(0.5 * this.m_size, 20, 20, texs);
				sph.setPosition(pv);
				this.m_rc.addEntity(sph, this.m_entityRSCIndex);
				return sph;
				break;

			case 2:
				let box2 = new Box3DEntity();
				// material = new FogDepthUVMaterial();
				// material.setRGBColor(color);
				material = this.createMaterial(color);
				box2.setMaterial(material);
				box2.setMesh(this.m_srcBox.getMesh());
				box2.initialize(this.m_minV, this.m_maxV, texs);
				box2.setPosition(pv);
				box2.setRotationXYZ(-45.0, 0.0, -45.0);
				box2.setScaleXYZ(0.7, 0.7, -0.7);
				box2.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
				this.m_rc.addEntity(box2, this.m_entityRSCIndex);
				return box2;
				break;
		}
		return null;
	}

	private getTexByUrl(url: string): IRenderTexture {
		return this.getImageTexByUrl(url);
	}
	private applyTex(param: PBRParam, texName: string, envMapEnabled: boolean = true): void {
		param.envMap = envMapEnabled ? this.m_pbr.getEnvMap() : null;
		param.diffuseMap = this.getTexByUrl(`pbr/${texName}/albedo.jpg`);
		param.normalMap = this.getTexByUrl(`pbr/${texName}/normal.jpg`);
		param.roughnessMap = this.getTexByUrl(`pbr/${texName}/roughness.jpg`);
		param.metallicMap = this.getTexByUrl(`pbr/${texName}/metallic.jpg`);
		param.aoMap = this.getTexByUrl(`pbr/${texName}/ao.jpg`);
	}
	initialize(rc: RendererScene): void {
		if (this.m_rc == null) {
			this.m_rc = rc;

			let tex0 = this.getImageTexByUrl("moss_04.jpg");
			let tex1 = this.getImageTexByUrl("metal_08.jpg");
			let tex2 = this.getImageTexByUrl("brickwall_big.jpg");
			let tex3 = this.getImageTexByUrl("wood_01.jpg");

			this.m_pbr.sharedLightColor = false;
			this.m_pbr.initialize(this.m_rc);

			//  RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
			//  RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
			//  RendererState.CreateRenderState("ADD03",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.ALWAYS);

			this.m_size = 128.0;
			let size = this.m_size;
			let halfSize = this.m_size * 0.5;
			let i = 0;
			let j = 0;
			let k = 0;
			let total = 0;
			let scaleK = 1.0;
			this.m_minV = new Vector3D(-halfSize, -halfSize, -halfSize);
			this.m_maxV = new Vector3D(halfSize, halfSize, halfSize);
			let color = new Color4();
			let material = this.createMaterial(null);
			this.m_srcBox.setMaterial(material);
			this.m_srcSph.setMaterial(material);
			this.m_srcBox.initialize(this.m_minV, this.m_maxV, [tex0]);
			this.m_srcSph.initialize(0.6 * size, 20, 20, [tex0]);
			///*
			let tn = 8.0;
			let pv = new Vector3D();
			let tv = new Vector3D(-tn * size, -3.0 * size, -tn * size);
			let entity: DisplayEntity = null;
			let rn = tn * 2.0;
			let cn = tn * 2.0;
			let f: number;
			let hn: number;
			let dvs = new Float32Array(rn * cn);
			for (i = 0; i < rn; ++i) {
				for (j = 0; j < cn; ++j) {
					dvs[i * cn + j] = Math.random();
				}
			}
			for (i = 0; i < rn; ++i) {
				for (j = 0; j < cn; ++j) {
					pv.copyFrom(tv);
					pv.x += j * size;
					pv.y = 0.0;
					pv.z += i * size;
					color.setRGB3f(0.8 + Math.random() * 0.2, 0.8 + Math.random() * 0.2, 0.8 + Math.random() * 0.2);
					entity = this.createRole(0, pv, color, [tex2]);
					f = dvs[i * cn + j];
					if (f < 0.1) {
						if (f < 0.1) {
							hn = Math.round(Math.random() * 4 + 2);
						} else {
							hn = Math.round(Math.random() * 3);
						}
						for (k = 0; k < hn; ++k) {
							pv.y += size;
							color.setRGB3f(0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5);
							if (k < hn * 0.4) {
								entity = this.createRole(0, pv, color, [tex3]);
							} else if (k < hn * 0.7) {
								entity = this.createRole(1, pv, color, [tex3]);
							} else {
								entity = this.createRole(2, pv, color, [tex3]);
							}
						}
					}
				}
			}
			//*/
			///*
            size = 1800.0;
            let bgBox = new Box3DEntity();
            bgBox.normalScale = -1.0;
            material = this.createMaterial(null, new Vector3D(0.0,0.0, 5.0, 5.0), "rusted_iron");
            // material = new FogDepthUVMaterial();
            // material.setFRGB3f(0.6, 0.6, 0.6);
            // material.setUVScale(10.0, 10.0);
            bgBox.setMaterial(material);
            bgBox.showFrontFace();
            bgBox.initialize(new Vector3D(-size, -size, -size), new Vector3D(size, size, size), [tex1]);
            bgBox.setScaleXYZ(2.0, 2.0, 2.0);
            this.m_rc.addEntity(bgBox, this.m_entityBGIndex);
            //*/
		}
	}
	run(): void {}
}

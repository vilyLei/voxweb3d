
import * as Vector3DT from "../../../vox/geom/Vector3";
import * as Color4T from "../../../vox/material/Color4";
import * as RenderConstT from "../../../vox/render/RenderConst";
import * as RendererStateT from "../../../vox/render/RendererState";
import * as TextureConstT from "../../../vox/texture/TextureConst";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as TexResLoaderT from "../../../vox/texture/TexResLoader";
import * as RendererSceneT from "../../../vox/scene/RendererScene";

import * as DisplayEntityT from "../../../vox/entity/DisplayEntity";
import * as Box3DEntityT from "../../../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../../../vox/entity/Sphere3DEntity";
import * as FogDepthUVMaterialT from "../../../advancedDemo/depthLight/material/FogDepthUVMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import FogDepthUVMaterial = FogDepthUVMaterialT.advancedDemo.depthLight.material.FogDepthUVMaterial;
export namespace advancedDemo
{
    export namespace depthLight
    {
        export namespace scene
        {
        export class RoleScene
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            texLoader:TexResLoader = null;
            getTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.texLoader.getTexAndLoadImg("static/voxgl/assets/"+pns);
                tex.setWrap(TextureConst.WRAP_REPEAT);
                tex.mipmapEnabled = true;
                return tex;
            }
            private m_entityRSCIndex:number = 0;
            private m_entityBGIndex:number = 2;
            private m_srcSph:Sphere3DEntity = new Sphere3DEntity();
            private m_srcBox:Box3DEntity = new Box3DEntity();
            private m_minV:Vector3D;
            private m_maxV:Vector3D;
            private m_size:number = 64.0;
            private createRole(flag:number,pv:Vector3D,color:Color4,texs:TextureProxy[]):DisplayEntity
            {
                let material:FogDepthUVMaterial;
                switch(flag)
                {
                    case 0:
                        let box:Box3DEntity = new Box3DEntity();
                        material = new FogDepthUVMaterial();
                        material.setRGBColor(color);
                        box.setMaterial(material);
                        box.setMesh(this.m_srcBox.getMesh());
                        box.initialize(this.m_minV, this.m_maxV, texs);                        
                        box.setPosition(pv);
                        this.m_rc.addEntity(box, this.m_entityRSCIndex);
                        return box;
                    break;
                    case 1:
                        let sph:Sphere3DEntity = new Sphere3DEntity();
                        material = new FogDepthUVMaterial();
                        material.setRGBColor(color);
                        sph.setMaterial(material);
                        sph.setMesh(this.m_srcSph.getMesh());
                        sph.initialize(0.5 * this.m_size, 20,20,texs);                   
                        sph.setPosition(pv);
                        this.m_rc.addEntity(sph, this.m_entityRSCIndex);
                        return sph;
                    break;
                    
                    case 2:
                        let box2:Box3DEntity = new Box3DEntity();
                        material = new FogDepthUVMaterial();
                        material.setRGBColor(color);
                        box2.setMaterial(material);
                        box2.setMesh(this.m_srcBox.getMesh());
                        box2.initialize(this.m_minV, this.m_maxV, texs);                        
                        box2.setPosition(pv);
                        box2.setRotationXYZ(-45.0,0.0,-45.0);
                        box2.setScaleXYZ(0.7,0.7,-0.7);
                        box2.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
                        this.m_rc.addEntity(box2, this.m_entityRSCIndex);
                        return box;
                    break;
                }
                return null;
            }
            initialize(rc:RendererScene):void
            {
                if(this.m_rc == null)
                {
                    this.m_rc = rc;
                    
                    let tex0:TextureProxy = this.getTexByUrl("moss_04.jpg");
                    let tex1:TextureProxy = this.getTexByUrl("metal_08.jpg");
                    let tex2:TextureProxy = this.getTexByUrl("brickwall_big.jpg");
                    let tex3:TextureProxy = this.getTexByUrl("wood_01.jpg");
                    
                    //  RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    //  RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    //  RendererState.CreateRenderState("ADD03",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);

                    this.m_size = 128.0;
                    let size:number = this.m_size;
                    let halfSize:number = this.m_size * 0.5;
                    let i:number = 0;
                    let j:number = 0;
                    let k:number = 0;
                    let total:number = 0;
                    let scaleK:number = 1.0;
                    this.m_minV = new Vector3D(-halfSize,-halfSize,-halfSize);
                    this.m_maxV = new Vector3D(halfSize,halfSize,halfSize);
                    let color:Color4 = new Color4();
                    let material:FogDepthUVMaterial = new FogDepthUVMaterial();
                    this.m_srcBox.setMaterial(material);
                    this.m_srcSph.setMaterial(material);
                    this.m_srcBox.initialize(this.m_minV, this.m_maxV,[tex0]);
                    this.m_srcSph.initialize(0.6 * size,20,20,[tex0]);
                    ///*
                    let tn:number = 8.0;
                    let pv:Vector3D = new Vector3D();
                    let tv:Vector3D = new Vector3D(-tn * size,-3.0 * size,-tn * size);
                    let engity:DisplayEntity = null;
                    let rn:number = tn * 2.0;
                    let cn:number = tn * 2.0;
                    let f:number;
                    let hn:number;
                    let dvs:Float32Array = new Float32Array(rn * cn);
                    for(i = 0; i < rn; ++i)
                    {
                        for(j = 0; j < cn; ++j)
                        {
                            dvs[i * cn + j] = Math.random();
                        }
                    }
                    for(i = 0; i < rn; ++i)
                    {
                        for(j = 0; j < cn; ++j)
                        {
                            pv.copyFrom(tv);
                            pv.x += j * size;
                            pv.y = 0.0;
                            pv.z += i * size;
                            color.setRGB3f(0.8 + Math.random() * 0.2,0.8 + Math.random() * 0.2,0.8 + Math.random() * 0.2);
                            engity = this.createRole(0,pv,color,[tex2]);
                            f = dvs[i * cn + j];
                            if(f < 0.1)
                            {
                                if(f < 0.1)
                                {
                                    hn = Math.round(Math.random() * 4 + 2);
                                }
                                else
                                {
                                    hn = Math.round(Math.random() * 3);
                                }
                                for(k = 0; k < hn; ++k)
                                {
                                    pv.y += size;
                                    color.setRGB3f(0.6 + Math.random() * 0.5,0.6 + Math.random() * 0.5,0.6 + Math.random() * 0.5);
                                    if(k < hn * 0.4)
                                    {
                                        engity = this.createRole(0,pv,color,[tex3]);
                                    }
                                    else if(k < hn * 0.7)
                                    {
                                        engity = this.createRole(1,pv,color,[tex3]);
                                    }
                                    else
                                    {
                                        engity = this.createRole(2,pv,color,[tex3]);
                                    }
                                }
                            }
                        }
                    }
                    //*/
                    size = 2300.0;
                    let bgBox:Box3DEntity = new Box3DEntity();
                    material = new FogDepthUVMaterial();
                    material.setFRGB3f(0.6,0.6,0.6);
                    material.setUVScale(10.0,10.0);
                    bgBox.setMaterial(material);
                    bgBox.showBackFace();
                    bgBox.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[tex1]);
                    bgBox.setScaleXYZ(2.0,2.0,2.0);
                    this.m_rc.addEntity(bgBox,this.m_entityBGIndex);
                    
                }
            }
            run():void
            {

            }
        }
    }
}
}
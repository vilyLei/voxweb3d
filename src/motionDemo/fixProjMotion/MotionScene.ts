
import Vector3D from "../../vox/math/Vector3D";
import RendererDeviece from "../../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import MouseEvent from "../../vox/event/MouseEvent";
import Stage3D from "../../vox/display/Stage3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";
import CameraTrack from "../../vox/view/CameraTrack";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import * as FixPosProjYMotionT from "../../vox/motion/mcase/FixPosProjYMotion";
import * as MotionEntityBaseT from "./MotionEntityBase";
import * as MotionEntityT from "./ProjMotionEntity";
import * as BlendVecMotionEntityT from "./BlendVecMotionEntity";

import FixPosProjYMotion = FixPosProjYMotionT.vox.motion.mcase.FixPosProjYMotion;
import MotionEntityBase = MotionEntityBaseT.motionDemo.fixProjMotion.MotionEntityBase;
import ProjMotionEntity = MotionEntityT.motionDemo.fixProjMotion.ProjMotionEntity;
import BlendVecMotionEntity = BlendVecMotionEntityT.motionDemo.fixProjMotion.BlendVecMotionEntity;

export namespace motionDemo
{
    export namespace fixProjMotion
    {
        export class MotionScene
        {
            constructor()
            {
            }
            
            private m_renderer:RendererInstance = null;
            private m_entitys:MotionEntityBase[] = [];
            private m_texLoader:ImageTextureLoader;
            
            private m_srcBox:Box3DEntity = new Box3DEntity();
            private m_srcShadow:Plane3DEntity = new Plane3DEntity();
            initialize(renderer:RendererInstance):void
            {
                this.m_renderer = renderer;

                this.m_srcBox.initialize(new Vector3D(-100.0,0.0,-100.0),new Vector3D(100.0,200.0,100.0),[this.getTexAt(0)]);
                this.m_srcShadow.initializeXOZ(-100,-100,200.0,200,[this.getTexAt(4)]);

                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                RendererState.CreateRenderState("transparent02",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis_big";
                axis.initialize(500.0);
                this.m_renderer.addEntity(axis);

                let plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                //plane.showDoubleFace();
                plane.initializeXOZ(-500,-500,1000.0,1000,[this.getTexAt(1)]);
                this.m_renderer.addEntity(plane,0);
                
                let entity:MotionEntityBase = null;
                let box:Box3DEntity = null;      

                console.log("init create a box !!!");
                let i:number = 0;
                let len:number = 5;
                for(; i < len; ++i)
                {
                    box = new Box3DEntity();
                    box.name = "box_motion";
                    box.copyMeshFrom(this.m_srcBox);
                    box.initialize(null,null,[this.getTexAt(0)]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,0,Math.random() * 1000.0 - 500.0);
                    box.setScaleXYZ(0.1,0.1,0.1);
                    this.m_renderer.addEntity(box,2);

                    let shadow:Plane3DEntity = new Plane3DEntity();
                    shadow.name = "shadow";
                    shadow.copyMeshFrom(this.m_srcShadow);
                    shadow.setRenderStateByName("transparent02");
                    shadow.initializeXOZ(-100,-100,200.0,200,[this.getTexAt(4)]);
                    this.m_renderer.addEntity(shadow,1);
                    if(Math.random() > 0.5)
                    {
                        entity = new ProjMotionEntity();
                    }
                    else
                    {
                        entity = new BlendVecMotionEntity();
                    }
                    entity.disp = box;
                    entity.shadow = shadow;
                    this.m_entitys.push(entity);                    
                    entity.initialize();
                }
            }   
            run():void
            {
                let entitys:MotionEntityBase[] = this.m_entitys;
                let i:number = 0;
                let len:number = entitys.length;
                for(; i < len; ++i)
                {
                    entitys[i].run();
                }
                this.m_texLoader.run();
            }
            private m_texList:string[] = [
                "static/assets/default.jpg",
                "static/assets/ceil_01.jpg",
                "static/assets/flare_core_01.jpg",
                "static/assets/flare_core_02.jpg",
                "static/assets/blackAlpha0.png",
                "static/assets/blackAlpha2.png"
            ];
            private getTexAt(i:number):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getImageTexByUrl(this.m_texList[i]);
                tex.mipmapEnabled = true;
                //tex.setWrap(TextureConst.WRAP_REPEAT);
                //console.log("getTexAt(), tex: "+tex);
                return tex;
            }
        }
    }
}
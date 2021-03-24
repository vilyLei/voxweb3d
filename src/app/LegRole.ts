
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as Vector3T from "../vox/math/Vector3D";
import * as Color4T from "../vox/material/Color4";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as RendererStateT from "../vox/render/RendererState";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";

import * as WlKTModuleT from "../app/calc/WlKTModule";
import * as PlaneT from "../vox/geom/Plane";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import Vector3D = Vector3T.vox.math.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import RendererState = RendererStateT.vox.render.RendererState;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

import WlKTModule = WlKTModuleT.app.calc.WlKTModule;
import Plane = PlaneT.vox.geom.Plane;

export namespace app
{
    /**
     * 
     */
    export class LegRole
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

        private m_targets:DisplayEntity[] = [];
        private m_modules:WlKTModule[] = []
        private m_srcModule:WlKTModule = null;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("LegRole::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/wood_01.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                let tex2:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex3:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initializeCross(600.0);
                this.m_rscene.addEntity(axis);

                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex0]);
                plane.setXYZ(0.0,-1.0,0.0);
                this.m_rscene.addEntity(plane);
                this.m_targets.push(plane);

                let srcModule:WlKTModule = null;
                let mdoule:WlKTModule = new WlKTModule();
                mdoule.initialize(this.m_rscene, [tex2]);
                mdoule.setRotation(Math.random() * 360);
                
                mdoule.setSpeedScale(3.0);
                //mdoule.setXYZ(Math.random() * 800 - 400.0,0, Math.random() * 800 - 400.0);
                this.m_modules.push(mdoule);
                this.m_srcModule = mdoule;
                srcModule = mdoule;
                
                let i:number = 0;
                let scale:number = 0.2 + Math.random() * 0.7;
                let total:number = 0;
                for(; i < total; ++i)
                {
                    mdoule = new WlKTModule();
                    mdoule.initializeFrom(srcModule);
                    mdoule.setScale(scale);
                    mdoule.setRotation(Math.random() * 360);
                    
                    mdoule.setXYZ(Math.random() * 800 - 400.0,0, Math.random() * 800 - 400.0);
                    scale = 1.0 - scale;
                    if(scale < 0.0)scale = 0.0;
                    mdoule.setSpeedScale(2.0 + scale + (Math.random() * 1.0 - 0.5));
                    //mdoule.setSpeedScale(1.8);
                    this.m_modules.push(mdoule);
                }
                this.update();
            }
        }
        private m_isChanged:boolean = true;
        private m_pv:Vector3D = new Vector3D();
        private m_rlpv:Vector3D = new Vector3D();
        private m_rltv:Vector3D = new Vector3D();
        private m_pnv:Vector3D = new Vector3D(0.0,1.0,0.0);
        private m_pdis:number = 0.0;
        private mouseDown(evt:any):void
        {
            if(this.m_srcModule != null)
            {
                this.m_rscene.getMouseXYWorldRay(this.m_rlpv, this.m_rltv);
                Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.m_pv);
                this.m_srcModule.moveToXZ(this.m_pv.x, this.m_pv.z);
            }
            /*
            if(this.m_srcModule != null)
            {
                if(this.m_srcModule.isAwake())
                {
                    this.m_srcModule.sleep();
                }
                else
                {
                    this.m_srcModule.wake();
                }
            }
            //*/
            /*
            let len:number = this.m_modules.length;
            let i:number = 0;
            for(; i < len; ++i)
            {
                //this.m_modules[i].run();
                //  this.m_modules[i].setRotation(Math.random() * 360);
                //  this.m_modules[i].setXYZ(Math.random() * 800 - 400.0,0, Math.random() * 800 - 400.0);
                if(this.m_modules[i].isAwake())
                {
                    this.m_modules[i].sleep();
                }
                else
                {
                    this.m_modules[i].wake();
                }
            }
            //*/
        }
        
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            this.m_timeoutId = setTimeout(this.update.bind(this),20);// 50 fps

            
            let len:number = this.m_modules.length;
            let i:number = 0;
            for(; i < len; ++i)
            {
                this.m_modules[i].run();
            }
        }
        run():void
        {

            this.m_statusDisp.update();
            this.m_texLoader.run();

            this.m_rscene.run();

            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}
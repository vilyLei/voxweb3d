
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as VtxBufConstT from "../vox/mesh/VtxBufConst";
import * as Box3DMeshT from "../vox/mesh/Box3DMesh";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as ImageTextureProxyT from "../vox/texture/ImageTextureProxy";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;
import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;

export namespace demo
{
    export class DemoFlexMesh
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_targets:DisplayEntity[] = [];
        private m_srcBox:Box3DEntity = null;
        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoFlexMesh::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                //skin_01
                // add common 3d display entity
                //      let plane:Plane3DEntity = new Plane3DEntity();
                //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                //      this.m_rscene.addEntity(plane);
                //      this.m_targets.push(plane);
                //      //this.m_disp = plane

                let box:Box3DEntity = new Box3DEntity();
                box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/skin_01.jpg")]);
                box.setScaleXYZ(2.0,2.0,2.0);
                //box.setRotationXYZ(-40,0,0);
                //  this.m_rscene.addEntity(box);
                //  this.updateBoxUV(box);
                //this.m_srcBox = box;
                this.createAMeshDisp(box);

                this.m_rscene.setAutoRunning(false);
                this.update();
            }
        }
        
        private updateBoxUV(box:Box3DEntity):void
        {
            box.scaleUVFaceAt(0, 0.5,0.5,0.5,0.5);
            box.scaleUVFaceAt(1, 0.0,0.0,0.5,0.5);
            box.scaleUVFaceAt(2, 0.5,0.0,0.5,0.5);
            box.scaleUVFaceAt(3, 0.0,0.5,0.5,0.5);
            box.scaleUVFaceAt(4, 0.5,0.0,0.5,0.5);
            box.scaleUVFaceAt(5, 0.0,0.5,0.5,0.5);
            box.reinitializeMesh();
        }
        private updateBoxMesh():boolean
        {
            if(this.m_srcBox == null)return false;
            this.updateBoxUV( this.m_srcBox );
            this.m_srcBox.updateMeshToGpu(this.m_rscene.getRenderProxy());
            return true;
        }
        private m_box:Box3DEntity = null;
        private m_boxMesh:Box3DMesh = null;
        private createAMeshDisp(entity:Box3DEntity):void
        {
            let mesh:Box3DMesh = new Box3DMesh();
            this.m_boxMesh = mesh;
            mesh.setBufSortFormat( entity.getMaterial().getBufSortFormat() );
            mesh.initializeWithYFace(
                new Vector3D(-60.0,-100.0,-60.0), new Vector3D(60.0,-100.0,60.0),
                new Vector3D(-100.0,100.0,-100.0), new Vector3D(100.0,100.0,100.0)
            );

            let box:Box3DEntity = new Box3DEntity();
            box.setMesh(mesh);
            box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/skin_01.jpg")]);
            this.m_pos0.setXYZ(Math.random() * 1.0 + 0.1,Math.random() * 1.0 + 0.1,Math.random() * 1.0 + 0.1);
            this.m_pos0.normalize();
            this.m_pos0.scaleBy(1.1);
            (box.getMaterial() as any).setRGB3f(this.m_pos0.x,this.m_pos0.y,this.m_pos0.z);
            this.updateBoxUV( box );
            this.m_rscene.addEntity(box);
            this.m_box = box;
        }
        private m_testFlag:boolean = true;
        private m_pos0:Vector3D = new Vector3D();
        private m_pos1:Vector3D = new Vector3D();
        private m_pos2:Vector3D = new Vector3D();
        private m_pos3:Vector3D = new Vector3D();
        private deformateDefault():void
        {
            if(this.m_testFlag)
            {
                this.m_boxMesh.initialize(new Vector3D(-60.0,-100.0,-60.0), new Vector3D(60.0,100.0,60.0));
            }
            else
            {
                this.m_boxMesh.initializeWithYFace(
                    new Vector3D(-60.0,-100.0,-60.0), new Vector3D(60.0,-100.0,60.0),
                    new Vector3D(-100.0,100.0,-100.0), new Vector3D(100.0,100.0,100.0)
                );
            }
        }
        private deformatePosAt(i:number):void
        {
            this.m_boxMesh.getPositionAt(i, this.m_pos0);
            this.m_pos0.x += 20.0;
            this.m_boxMesh.setPositionAt(i, this.m_pos0);
        }
        private deformateEdgeAt(i:number):void
        {
            this.m_boxMesh.getEdgeAt(i, this.m_pos0,this.m_pos1);
            this.m_pos0.x += 20.0;
            this.m_pos1.x += 20.0;
            this.m_boxMesh.setEdgeAt(i, this.m_pos0,this.m_pos1);
        }
        private deformateFaceAt(i:number):void
        {
            this.m_boxMesh.getFaceAt(i, this.m_pos0,this.m_pos1,this.m_pos2,this.m_pos3);
            this.m_pos0.x += 5.0;this.m_pos1.x += 5.0;
            this.m_pos2.x += 5.0;this.m_pos3.x += 5.0;
            this.m_boxMesh.setFaceAt(i, this.m_pos0,this.m_pos1,this.m_pos2,this.m_pos3);

        }
        private mouseDown(evt:any):void
        {
            let boo:boolean = this.updateBoxMesh();
            if(boo)return;
            let i:number = 4;
            let type:number = 2;

            switch(type)
            {
                case 0:
                    this.deformateDefault();
                break;
                case 1:
                    this.deformatePosAt(i);
                break;
                case 2:
                    this.deformateEdgeAt(i);
                break;
                case 3:
                    this.deformateFaceAt(i);
                break;
                default:
                break;
            }

            this.m_box.updateMeshToGpu(this.m_rscene.getRenderProxy());
            this.m_testFlag = !this.m_testFlag;
            
        }
        private m_updateId:number = 0;
        private m_currentDelta:number = 0;
        private m_previousDelta:number = 0;
        private m_fpsLimit:number = 70;

        private m_timeoutId:any = -1;
        private m_rotV:Vector3D = new Vector3D();
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
            this.m_timeoutId = setTimeout(this.update.bind(this),40);// 20 fps
            let pcontext:RendererInstanceContext = this.m_rcontext;
            this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
            
            this.m_rscene.update();
            this.m_statusDisp.render();

            if(this.m_srcBox != null)
            {
                this.m_srcBox.setRotationXYZ(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
                this.m_srcBox.update();
                this.m_rotV.x += 0.5;
                this.m_rotV.y += 1.0;
            }
        }
        run():void
        {
            this.m_currentDelta = Date.now();
            let delta:number = this.m_currentDelta - this.m_previousDelta;
            if (this.m_fpsLimit && delta < (1000 / this.m_fpsLimit)) {
                return;
            }
            this.m_previousDelta = this.m_currentDelta;

            this.m_statusDisp.update(false);

            this.m_rscene.runBegin();
            this.m_rscene.run();
            this.m_rscene.runEnd();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            //this.m_profileInstance.run();
        }
    }
}
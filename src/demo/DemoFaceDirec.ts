
import MathConst from "../vox/math/MathConst";
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import VtxBufConst from "../vox/mesh/VtxBufConst";
import Box3DMesh from "../vox/mesh/Box3DMesh";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import Plane from "../vox/geom/Plane";

//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;

//import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;

//import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
//import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
//import Plane = PlaneT.vox.geom.Plane;

export namespace demo
{
    export class DemoFaceDirec
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_targets:DisplayEntity[] = [];
        private m_crossTarget:DisplayEntity = null;

        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoFaceDirec::initialize()......");
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
                this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                
                
                let cross:Axis3DEntity = new Axis3DEntity();
                cross.initializeCross(60.0);
                this.m_rscene.addEntity(cross);
                // add common 3d display entity
                //      let plane:Plane3DEntity = new Plane3DEntity();
                //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                //      this.m_rscene.addEntity(plane);
                //      this.m_targets.push(plane);
                //      //this.m_disp = plane

                let box:Box3DEntity = new Box3DEntity();
                box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
                //this.m_rscene.addEntity(box);
                this.createAMeshDisp(box);

                this.m_rscene.setAutoRunning(false);
                this.update();               
            }
        }
        private m_nv:Vector3D = new Vector3D();
        private m_resultV:Vector3D = new Vector3D();
        private m_centerV:Vector3D = new Vector3D();
        private m_dstPosV:Vector3D = new Vector3D();
        private m_directV:Vector3D = new Vector3D();
        private m_posA:Vector3D = new Vector3D();
        private m_posB:Vector3D = new Vector3D();
        private m_posC:Vector3D = new Vector3D();

        private m_pos4:Vector3D = new Vector3D();
        private m_pos5:Vector3D = new Vector3D();
        private m_pos6:Vector3D = new Vector3D();
        private m_pos7:Vector3D = new Vector3D();
        /**
         * 1.以当前 face中心为原点，依据direcDstPos对实际的四个点做朝向计算,
         *   四个点所在的原先的相关轴和旋转之后的新的平面的交点为新的结果,
         *   这种旋转看起来更像是一种削切操作
         * 2.以当前 face对面的face中心为原点，依据direcDstPos对实际的四个点做朝向计算,
         *   这个计算过程中当前的face中心会发生偏移,
         *   四个点所在的原先的相关轴和旋转之后的新的平面的交点为新的结果,
         *   这种旋转看起来更像是一种斜拉变形操作
         */
        boxFaceDirecAt(direcDstPos:Vector3D):void
        {
            this.m_boxMesh.getFaceAt(1, this.m_pos0,this.m_pos1,this.m_pos2,this.m_pos3);
            this.m_boxMesh.getFaceAt(0, this.m_pos4,this.m_pos5,this.m_pos6,this.m_pos7);
            // 计算face1的法线
            this.m_posA.subVecsTo(this.m_pos0, this.m_pos1);
            this.m_posB.subVecsTo(this.m_pos1, this.m_pos2);
            //this.m_posA.subtractBy(this.m_pos1);
            //this.m_posB.copzFrom(this.m_pos1);
            //this.m_posB.subtractBy(this.m_pos2);
            Vector3D.Cross(this.m_posA, this.m_posB, this.m_directV);
            this.m_directV.normalize();
            console.log("this.m_directV: ",this.m_directV.toString());

            this.m_centerV.addVecsTo(this.m_pos0,this.m_pos1);
            this.m_centerV.addBy(this.m_pos2);
            this.m_centerV.addBy(this.m_pos3);
            this.m_centerV.scaleBy(0.25);

            this.m_dstPosV.copyFrom(this.m_directV);
            this.m_dstPosV.scaleBy(64.0);
            this.m_dstPosV.addBy(this.m_centerV);

            console.log("this.m_centerV: ",this.m_centerV);
            console.log("this.m_dstPosV: ",this.m_dstPosV);
            this.m_dstPosV.x -= 20.0;
            this.m_dstPosV.z += 20.0;
            this.m_directV.subVecsTo(this.m_dstPosV, this.m_centerV);
            this.m_directV.normalize();

            let planeDis:number = this.m_directV.dot(this.m_centerV);


            this.m_nv.subVecsTo(this.m_pos0,this.m_pos4);
            this.m_nv.normalize();
            Plane.IntersectionSLV2(this.m_directV,planeDis, this.m_pos4,this.m_nv, this.m_pos0);
            this.m_nv.subVecsTo(this.m_pos1,this.m_pos5);
            this.m_nv.normalize();
            Plane.IntersectionSLV2(this.m_directV,planeDis, this.m_pos5,this.m_nv, this.m_pos1);
            this.m_nv.subVecsTo(this.m_pos2,this.m_pos6);
            this.m_nv.normalize();
            Plane.IntersectionSLV2(this.m_directV,planeDis, this.m_pos6,this.m_nv, this.m_pos2);
            this.m_nv.subVecsTo(this.m_pos3,this.m_pos7);
            this.m_nv.normalize();
            Plane.IntersectionSLV2(this.m_directV,planeDis, this.m_pos7,this.m_nv, this.m_pos3);

            this.m_boxMesh.setFaceAt(1, this.m_pos0,this.m_pos1,this.m_pos2,this.m_pos3);
        }
        private m_box:Box3DEntity = null;
        private m_boxMesh:Box3DMesh = null;
        private createAMeshDisp(entity:Box3DEntity):void
        {
            let mesh:Box3DMesh = new Box3DMesh();
            this.m_boxMesh = mesh;
            mesh.setBufSortFormat( entity.getMaterial().getBufSortFormat() );
            //  mesh.initializeWithYFace(
            //      new Vector3D(-60.0,-100.0,-60.0), new Vector3D(60.0,-100.0,60.0),
            //      new Vector3D(-100.0,100.0,-100.0), new Vector3D(100.0,100.0,100.0)
            //  );
            mesh.initialize(
                new Vector3D(-100.0,-100.0,-100.0), new Vector3D(100.0,100.0,100.0)
            );

            let box:Box3DEntity = new Box3DEntity();
            box.setMesh(mesh);
            box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box);
            this.m_box = box;

            this.boxFaceDirecAt(null);
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
        private m_running:boolean = true;
        private m_camRunning:boolean = true;
        private mouseDown(evt:any):void
        {
            let i:number = 1;
            let type:number = 3;

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
            this.m_camRunning = !this.m_camRunning;
            
        }
        private m_updateId:number = 0;
        private m_currentDelta:number = 0;
        private m_previousDelta:number = 0;
        private m_fpsLimit:number = 70;

        private m_timeoutId:any = -1;

        private update():void
        {
            //  if(this.m_running)
            //  {
                if(this.m_timeoutId > -1)
                {
                    clearTimeout(this.m_timeoutId);
                }
                //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
                this.m_timeoutId = setTimeout(this.update.bind(this),50);// 20 fps
                let pcontext:RendererInstanceContext = this.m_rcontext;
                this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
                
                this.m_rscene.update();
                this.m_statusDisp.render();
            //  }
        }
        run():void
        {
            //  if(this.m_running)
            //  {
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
    
                if(this.m_camRunning)this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
                this.m_profileInstance.run();
            //}
        }
    }
}
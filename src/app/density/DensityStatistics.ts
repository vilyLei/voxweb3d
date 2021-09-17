
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import TextureProxy from "../../vox/texture/TextureProxy";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import BrokenLine3DEntity from "../../vox/entity/BrokenLine3DEntity";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import CameraViewRay from "../../vox/view/CameraViewRay";

export namespace app
{
    export namespace density
    {
        class Node
        {
            constructor(){}
            pos:Vector3D = null;
            index:number;
            r:number;
            c:number;
            idsMap:Map<number,number> = new Map();
            ids:number[] = [];
            idsTotal:number = 0;

            fr:BrokenLine3DEntity;
            setRGB3f(pr:number, pg:number,pb:number):void
            {
                (this.fr.getMaterial() as any).setRGB3f(pr,pg,pb);
            }
            setRed(pr:number):void
            {
                this.setRGB3f(pr,0.0,0.0);
            }
            setGray(p:number):void
            {
                this.setRGB3f(p,p,p);
            }
            setPurple(p:number):void
            {
                this.setRGB3f(p,0.0,p);
            }
        }
        class RCCalc
        {
            r:number;
            c:number;
            cn:number = 4;
            rn:number = 4;
            sizeX:number = 300.0;
            sizeY:number = 300.0;
            minX:number = 0.0;//-0.5 * sizeX;
            minY:number = 0.0;//-0.5 * sizeY;
            dX:number = 0.0;//sizeX/4.0;
            dY:number = 0.0;//sizeY/4.0;
            index:number = 0;
            
            constructor(){}
            initialize(pw:number,ph:number, prn:number,pcn:number):void
            {
                this.sizeX = pw;
                this.sizeY = ph;
                this.rn = prn;
                this.cn = pcn;

                this.minX = -0.5 * this.sizeX;
                this.minY = -0.5 * this.sizeY;
                this.dX = this.sizeX/4.0;
                this.dY = this.sizeY/4.0;
            }
            calcRCAndIndex(pos:Vector3D):void
            {
                this.r = Math.floor((pos.y - this.minX)/this.dY);
                this.c = Math.floor((pos.x - this.minY)/this.dX);
                //console.log("pr,pc: ",this.r,this.c);
                this.index = this.r * this.rn + this.c;
            }
        }
        class NodeSpace
        {
            private m_rsc:RendererScene = null;
            private m_posList:Vector3D[] = [];
            private m_nodes16:any[] = [
                new Node(),new Node(),new Node(),new Node(),
                new Node(),new Node(),new Node(),new Node(),
                new Node(),new Node(),new Node(),new Node(),
                new Node(),new Node(),new Node(),new Node()
            ];
            rc:RCCalc = new RCCalc();
            total:number = 1;
            constructor(){}
            initialize(rsc:RendererScene):void
            {
                this.m_rsc = rsc;
                this.buildSc();
            }
            getNodeByIndex(i:number):Node
            {
                return this.m_nodes16[i];
            }
            getNodeByRC(r:number, c:number):Node
            {
                return this.m_nodes16[r * this.rc.rn + c];
            }
            private buildSc():void
            {
                let fr:BrokenLine3DEntity;
                let srcFr:BrokenLine3DEntity = new BrokenLine3DEntity();
                srcFr.initializeRectXOY(Math.floor(this.rc.dX - 4), Math.floor(this.rc.dY - 4));
                    //this.m_rscene.addEntity(rectFrame);
                let minX:number = this.rc.minX + 0.5 * this.rc.dX;
                let minY:number = this.rc.minY + 0.5 * this.rc.dY;
                let index:number;
                for(let r:number = 0; r < this.rc.rn; r++)
                {
                    for(let c:number = 0; c < this.rc.cn; c++)
                    {
                        fr = new BrokenLine3DEntity();
                        fr.copyMeshFrom(srcFr);
                        fr.initializeRectXOY(10,10);
                        fr.setXYZ(c * this.rc.dX + minX, this.rc.dY * r + minY, 0.0);
                        //(fr.getMaterial() as any).setRGB3f(0.4,0.4,0.4);
                        this.m_rsc.addEntity(fr);
                        //index = r * this.rc.rn + c;
                        let node:Node = this.getNodeByRC(r,c);//[index];
                        node.fr = fr;
                        node.setGray(0.2);
                    }
                }
            }
            addPos(pos:Vector3D):void
            {
                this.m_posList.push(pos);
            }
            calcRCAndIndex(pos:Vector3D,i:number):void
            {
                this.rc.calcRCAndIndex(pos);
                let node:Node = this.m_nodes16[this.rc.index];
                node.ids.push(i);
                node.idsTotal++;
                if(node.idsTotal > 2)
                {
                    console.log("i: "+i+", node.idsTotal: "+node.idsTotal);
                    node.setPurple(node.idsTotal/this.total + 0.3);
                }
            }
            calcCentroid():void
            {
                let list:Vector3D[] = this.m_posList;
                let len:number = list.length;
                let i:number = 0;
                let center:Vector3D = new Vector3D();
                for(; i < len; ++i)
                {
                    center.addBy(list[i]);
                }
                center.scaleBy(1.0/len);
                let centroid:Vector3D = new Vector3D();
                let vecs:Vector3D[] = [];
                let vec:Vector3D = null;
                let dis:number;
                let k:number;
                console.log("len: "+len);
                for(i = 0; i < len; ++i)
                {
                    vec = new Vector3D();
                    vec.subVecsTo(list[i], center);
                    //k = 0.8 * 100000.0/(1.0 + vec.getLengthSquared());
                    k = 1000.0/(1.0 + vec.getLength());
                    vec.normalize();
                    vec.scaleBy(k);
                    //console.log("k: ",k);
                    //vecs.push(vec);
                    centroid.addBy(vec);
                }

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initializeCross(60.0);
                axis.setPosition(center);
                this.m_rsc.addEntity(axis);
                axis = new Axis3DEntity();
                axis.initializeCross(30.0);
                axis.setPosition(centroid);
                this.m_rsc.addEntity(axis);
            }
        }
        export class DensityStatistics
        {
            constructor(){}

            private m_rscene:RendererScene = null;
            private m_texLoader:ImageTextureLoader = null;
            private m_camTrack:CameraTrack = null;
            private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

            private m_viewRay:CameraViewRay = new CameraViewRay();

            initialize():void
            {
                console.log("DensityStatistics::initialize()......");
                if(this.m_rscene == null)
                {
                    RendererDevice.SHADERCODE_TRACE_ENABLED = false;
                    RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                    //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

                    let rparam:RendererParam = new RendererParam();
                    rparam.setCamPosition(0.0,0.0,800.0);
                    this.m_rscene = new RendererScene();
                    this.m_rscene.initialize(rparam,3);
                    this.m_rscene.updateCamera();

                    this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
                    this.m_viewRay.setPlaneParam(new Vector3D(0.0,1.0,0.0),0.0);

                    this.m_camTrack = new CameraTrack();
                    this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                    this.m_statusDisp.initialize();

                    this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                    this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
                    let texLoader:ImageTextureLoader = this.m_texLoader;
                    let tex0:TextureProxy = texLoader.getTexByUrl("static/assets/wood_01.jpg");

                    let axis:Axis3DEntity = new Axis3DEntity();
                    //axis.initializeCross(600.0);
                    axis.initialize(300.0);
                    //this.m_rscene.addEntity(axis);

                    //  axis = new Axis3DEntity();
                    //  axis.initializeCross(30.0);
                    //  axis.setXYZ(100.0,50.0,0.0);
                    //  this.m_rscene.addEntity(axis);

                    let rectFrame:BrokenLine3DEntity = new BrokenLine3DEntity();
                    rectFrame.initializeSquareXOY(300.0);
                    (rectFrame.getMaterial() as any).setRGB3f(0.4,0.4,0.4);
                    this.m_rscene.addEntity(rectFrame);

                    this.update();

                    this.initDensity();
                }
            }
            private initDensity():void
            {
                let srcAxis:Axis3DEntity = new Axis3DEntity();
                srcAxis.initializeCross(4.0);
                //this.m_rscene.addEntity(axis);
                //let axis:Axis3DEntity = new Axis3DEntity();
                let axis:Axis3DEntity;
                let pos:Vector3D;
                let total:number = 20.0;
                
                let space:NodeSpace = new NodeSpace();
                space.total = total;
                space.rc.initialize(300.0,300.0,4,4);
                space.initialize(this.m_rscene);
                for(let i:number = 0; i < total; ++i)
                {
                    pos = new Vector3D(Math.random() * 280 - 140, Math.random() * 280 - 140, 0.0);
                    space.addPos(pos);
                    axis = new Axis3DEntity();
                    axis.copyMeshFrom(srcAxis);
                    axis.copyMaterialFrom(srcAxis);
                    axis.setPosition(pos);
                    this.m_rscene.addEntity(axis);
                    space.calcRCAndIndex(pos, i);
                }
                space.calcCentroid();
            }
            private mouseDown(evt:any):void
            {

                this.m_viewRay.intersectPiane();

            }

            private m_timeoutId:any = -1;
            private update():void
            {
                if(this.m_timeoutId > -1)
                {
                    clearTimeout(this.m_timeoutId);
                }
                this.m_timeoutId = setTimeout(this.update.bind(this),50);// 50 fps
            }
            run():void
            {

                this.m_statusDisp.update();

                this.m_rscene.run();

                //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            }
        }
    }
}
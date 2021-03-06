import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";

import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;

import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    class DemoSRIns
    {
        private m_uid:number = 0;
        private static s_uid:number = 0;
        static RunFlag:boolean = true;
        camRotRadian:number = Math.random() * 80.0;
        constructor()
        {
            this.m_uid = DemoSRIns.s_uid++;
        }
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        private createDiv(px:number,py:number,pw:number,ph:number):any
        {
            let div:HTMLDivElement = document.createElement('div');
            div.style.width = pw + 'px';
            div.style.height = ph + 'px';
            document.body.appendChild(div);            
            div.style.display = 'bolck';
            div.style.left = px + 'px';
            div.style.top = py + 'px';
            div.style.position = 'absolute';
            return div;
        }
        private m_texUrls:string[] = [
            "static/assets/default.jpg",
            "static/assets/broken_iron.jpg"
        ];
        private initTexture():void
        {
            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
        }
        private getTexAt(i:number):TextureProxy
        {
            return this.getImageTexByUrl(this.m_texUrls[i]);
        }
        initialize(px:number,py:number,pw:number,ph:number):void
        {
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let div:HTMLElement = this.createDiv(px,py,pw,ph);
                let rparam:RendererParam = new RendererParam(div);
                rparam.autoSyncRenderBufferAndWindowSize = false;
                
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.initTexture();
                if(this.m_uid == 0)
                {
                    this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
                }
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());                
                this.m_camTrack.rotationOffsetAngleWorldY(this.camRotRadian);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initializeCross(600.0);
                this.m_rscene.addEntity(axis);

                let cylinder:Cylinder3DEntity = new Cylinder3DEntity();
                cylinder.initialize(100.0,200.0,15,[this.getTexAt(1)]);
                this.m_rscene.addEntity(cylinder);
            }
        }
        private mouseDown():void
        {
            DemoSRIns.RunFlag = !DemoSRIns.RunFlag;
            console.log("mouse down.");
        }
        run():void
        {
            this.m_texLoader.run();
            this.m_rscene.run();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
    export class DemoMultiRenderer
    {
        constructor(){}

        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_inited:boolean = true;
        private m_demoA:DemoSRIns = new DemoSRIns();
        private m_demoB:DemoSRIns = new DemoSRIns();
        private m_demoC:DemoSRIns = new DemoSRIns();
        private m_demoD:DemoSRIns = new DemoSRIns();

        initialize():void
        {
            console.log("DemoMultiRenderer::initialize()......");
            // multi renderer instances
            if(this.m_inited)
            {
                this.m_inited = true;

                this.m_demoA.initialize(50,100,200,100);
                this.m_demoB.initialize(50,206,200,100);
                this.m_demoC.initialize(256,100,200,100);
                this.m_demoD.initialize(256,206,200,100);

                this.m_statusDisp.initialize("rstatus",280);
            }
        }
        run():void
        {
            this.m_statusDisp.update();
            if(DemoSRIns.RunFlag)
            {
                this.m_demoA.run();
                this.m_demoB.run();
                this.m_demoC.run();
                this.m_demoD.run();
            }     
        }
    }
}
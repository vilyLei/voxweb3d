import * as RendererParamT from "../vox/scene/RendererParam";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as ImageTexResLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as PingpongBlurT from "../renderingtoy/mcase/PingpongBlur";

import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import ImageTextureLoader = ImageTexResLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import PingpongBlur = PingpongBlurT.renderingtoy.mcase.PingpongBlur;

export namespace demo
{
    export class DemoPingpongBlur
    {
        constructor(){}

        private m_cameraTrack:CameraTrack = null;
        private m_textureLoader:ImageTextureLoader = null;
        private m_renderer:RendererScene = null;
        private m_blurModule:PingpongBlur = null;
        private getImageTexByUrl(url:string):TextureProxy
        {
            return this.m_textureLoader.getImageTexByUrl(url);
        }
        private initializeRenderer():void
        {
            let rparam:RendererParam = new RendererParam();
            rparam.setCamPosition(500.0,500.0,500.0);

            this.m_renderer = new RendererScene();
            this.m_renderer.initialize(rparam,3);
            
            this.m_textureLoader = new ImageTextureLoader(this.m_renderer.textureBlock);            
            this.m_cameraTrack = new CameraTrack();
            this.m_cameraTrack.bindCamera(this.m_renderer.getCamera());

            this.m_blurModule = new PingpongBlur(this.m_renderer.getRenderer());
            this.m_blurModule.bindProcessId(0,1);
        }
        // 构建添加可用于渲染的资源
        private addEntity():void
        {
            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            let plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_renderer.addEntity(plane);

            let box:Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0,[tex1]);
            this.m_renderer.addEntity(box);
        }
        initialize():void
        {
            this.initializeRenderer();
            this.addEntity();
        }
        // 渲染器执行过程
        run():void
        {
            // 纹理源数据分帧加载/卸载
            this.m_textureLoader.run();
            // 更新渲染数据
            this.m_renderer.update();
            // blur 渲染过程
            this.m_blurModule.run();
            
            this.m_cameraTrack.rotationOffsetAngleWorldY(-0.2);
        }
        // 渲染器执行过程
        runNoBlur():void
        {
            // 纹理源数据分帧加载/卸载
            this.m_textureLoader.run();
            // 运行默认渲染过程
            this.m_renderer.run();
            
            this.m_cameraTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}
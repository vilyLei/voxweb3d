
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Line3DEntity from "../vox/entity/Line3DEntity";
import DashedLine3DEntity from "../vox/entity/DashedLine3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import FloatTextureProxy from "../vox/texture/FloatTextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import {VSTexturePosMaterial} from "./material/VSTexturePosMaterial";
import PathTrack from "../voxnav/path/PathTrack";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

export class DemoVSTexturePos {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private m_posTex: IRenderTexture = null;
    private m_texSize: number = 16;
    private m_texData: Float32Array = null;
    private cratePosTex(): void {

        //let texWidth:number = 16 * 16;
        let texSize: number = this.m_texSize;
        let posTex = this.m_rscene.textureBlock.createFloatTex2D(texSize, texSize, false);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        posTex.mipmapEnabled = false;
        posTex.minFilter = TextureConst.NEAREST;
        posTex.magFilter = TextureConst.NEAREST;
        //posTex.
        let fs: Float32Array = new Float32Array(texSize * texSize * 4);
        for (let r: number = 0; r < texSize; ++r) {
            for (let c: number = 0; c < texSize; ++c) {
            }
        }
        posTex.setDataFromBytes(fs, 0, texSize, texSize, 0,0,false);
        this.m_posTex = posTex;
        this.m_texData = fs;
    }
    setPosAt(i: number, pos: Vector3D): void {
        let r: number = Math.floor(i / this.m_texSize);
        let c: number = i - r * this.m_texSize;

        i *= 4;
        this.m_texData[i] = pos.x;
        this.m_texData[i + 1] = pos.y;
        this.m_texData[i + 2] = pos.z;
    }
    showData(): void {
        console.log(this.m_texData);
    }
    initialize(): void {
        console.log("DemoVSTexturePos::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/caustics_02.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            let curvePosList: Vector3D[] = [
                new Vector3D(100.0, 0.0, 40.0),
                new Vector3D(70.0, 0.0, 60.0),
                new Vector3D(-70.0, 0.0, 60.0),
                new Vector3D(-100.0, 0.0, 40.0),

                new Vector3D(-100.0, 0.0, -40.0),
                new Vector3D(-70.0, 0.0, -60.0),
                new Vector3D(70.0, 0.0, -60.0),
                new Vector3D(100.0, 0.0, -40.0),

                new Vector3D(100.0, 0.0, 40.0)
            ];
            let curveLine: DashedLine3DEntity = new DashedLine3DEntity();
            curveLine.initializeByPosition(curvePosList);
            this.m_rscene.addEntity(curveLine);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(310);
            this.m_rscene.addEntity(axis);

            let pos0: Vector3D = new Vector3D(100.0, 0.0, 0.0);
            let pos1: Vector3D = new Vector3D(150.0, 0.0, 0.0);
            let pos17: Vector3D = new Vector3D(200.0, 50.0, 0.0);
            axis = new Axis3DEntity();
            axis.initialize(80);
            axis.setPosition(pos17);
            this.m_rscene.addEntity(axis);

            this.cratePosTex();
            this.setPosAt(0, pos0);
            this.setPosAt(1, pos1);
            this.setPosAt(17, pos17);
            this.showData();
            let material: VSTexturePosMaterial = new VSTexturePosMaterial();
            material.setTexSize(this.m_texSize);
            material.setPosAt(17);
            // add common 3d display entity
            var plane: Plane3DEntity = new Plane3DEntity();
            plane.setMaterial(material);
            plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [this.m_posTex, tex0]);
            this.m_rscene.addEntity(plane);

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            //  let box:Box3DEntity = new Box3DEntity();
            //  box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
            //  this.m_rscene.addEntity(box);

        }
    }
    run(): void {
        
        // show fps status
        this.m_statusDisp.update();
        
        this.m_rscene.run();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoVSTexturePos;
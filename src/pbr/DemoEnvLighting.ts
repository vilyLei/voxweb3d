
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import Vector3D from "../vox/math/Vector3D";
import Color4 from "../vox/material/Color4";

import BinaryLoader from "../vox/assets/BinaryLoader";

import PBREnvLightingMaterial from "../pbr/material/PBREnvLightingMaterial";
import PBRTexLightingMaterial from "./material/PBRTexLightingMaterial";
import FloatCubeTextureProxy from "../vox/texture/FloatCubeTextureProxy";

class TextureLoader {

    protected m_rscene: RendererScene = null;
    texture: FloatCubeTextureProxy = null;
    constructor() {        
    }
    
    loadTextureWithUrl(url:string, rscene: RendererScene): void {
        //let url: string = "static/bytes/s.bin";
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = url;
        loader.load(url, this);
        this.m_rscene = rscene;

        this.texture = this.m_rscene.textureBlock.createFloatCubeTex(32, 32);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        //console.log("loaded... uuid: ", uuid, buffer.byteLength);
        this.parseTextureBuffer(buffer);
        this.m_rscene = null;
        this.texture = null;
    }
    loadError(status: number, uuid: string): void {
    }
    
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
        let tex: FloatCubeTextureProxy = this.texture;
        tex.toRGBFormat();
        for (let i: number = 0, len: number = 6; i < len; ++i) {
            subArr = fs32.slice(begin, begin + size);
            console.log("width,height: ", width, height, ", subArr.length: ", subArr.length);
            tex.setDataFromBytesToFaceAt(i, subArr, width, height, 0);
            begin += size;
        }
    }
}

class SpecularTextureLoader extends TextureLoader {

    constructor() {
        super();
    }
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;

        let tex: FloatCubeTextureProxy = this.texture;
        tex.toRGBFormat();
        tex.mipmapEnabled = false;
        
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * 3;
                subArr = fs32.slice(begin, begin + size);
                tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
}

export class DemoEnvLighting {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_CameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materials:PBREnvLightingMaterial[] = [];
    private m_texMaterials:PBRTexLightingMaterial[] = [];
    
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getTexByUrl(purl,wrapRepeat,mipmapEnabled);
    }
    initialize(): void {
        console.log("DemoEnvLighting::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
            //rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rscene.updateCamera();
            
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_CameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_CameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis);

            // add common 3d display entity
            //  let plane: Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //  this.m_rscene.addEntity(plane);

            this.initFloatCube();

            this.update();

        }
    }
    private initFloatCube(): void {

        let envMapUrl: string = "static/bytes/s.bin";

        //let loader:TextureLoader = new TextureLoader();
        let loader:SpecularTextureLoader = new SpecularTextureLoader();
        loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
        this.initLighting(null,loader.texture);
    }
    
    private initTexLighting(): void {

        let radius:number = 150.0;
        let rn:number = 3;
        let cn:number = 3;
        let roughness: number = 0.0;
        let metallic: number = 0.0;
        let disV3:Vector3D = new Vector3D(radius * 2.0 + 50.0, radius * 2.0 + 50.0, 0.0);
        let beginPos:Vector3D = new Vector3D(disV3.x * (cn - 1) * -0.5, disV3.y * (rn - 1) * -0.5, -100.0);
        let pos:Vector3D = new Vector3D();

        let nameList: string[] = ["gold", "rusted_iron", "grass", "plastic", "wall"];

        let texList: TextureProxy[] = this.getTexList("plastic");

        for(let i:number = 0; i < rn; ++i)
        {
            metallic = Math.max(rn - 1,0.001);
            metallic = i / metallic;
            for(let j:number = 0; j < cn; ++j)
            {
                roughness = Math.max(cn - 1,0.001);
                roughness = j / roughness;

                let sph: Sphere3DEntity = new Sphere3DEntity();
                let material:PBRTexLightingMaterial = this.makeTexMaterial(metallic, roughness, 1.0);
                //let material:PBREnvLightingMaterial = this.makeMaterial(metallic, roughness, 1.3);
                sph.setMaterial(material);
                sph.initialize(radius, 20, 20, this.getTexList(nameList[Math.round(Math.random() * 10000) % nameList.length]));

                pos.copyFrom( beginPos );
                pos.x += disV3.x * j;
                pos.y += disV3.y * i;
                //pos.z += disV3.z * j;
                sph.setPosition( pos );

                this.m_rscene.addEntity(sph);
            }
        }
    }
    private initLighting(d_envTex: FloatCubeTextureProxy,s_envTex: FloatCubeTextureProxy): void {

        let radius:number = 150.0;
        let rn:number = 3;
        let cn:number = 3;
        let roughness: number = 0.0;
        let metallic: number = 0.0;
        let disV3:Vector3D = new Vector3D(radius * 2.0 + 50.0, radius * 2.0 + 50.0, 0.0);
        let beginPos:Vector3D = new Vector3D(disV3.x * (cn - 1) * -0.5, disV3.y * (rn - 1) * -0.5, -100.0);
        let pos:Vector3D = new Vector3D();

        for(let i:number = 0; i < rn; ++i)
        {
            metallic = Math.max(rn - 1,0.001);
            metallic = i / metallic;
            //metallic = 1.0;
            for(let j:number = 0; j < cn; ++j)
            {
                roughness = Math.max(cn - 1,0.001);
                roughness = j / roughness;
                //roughness = 0.0;

                let sph: Sphere3DEntity = new Sphere3DEntity();
                //let material:PBREnvLightingMaterial = this.makeMaterial(0.0, 0.2, 1.0);
                let material:PBREnvLightingMaterial = this.makeMaterial(metallic, roughness, 1.3);
                sph.setMaterial(material);
                //sph.initialize(radius, 20, 20, [this.getImageTexByUrl("static/assets/noise.jpg")]);
                sph.initialize(radius, 20, 20, [s_envTex]);

                pos.copyFrom( beginPos );
                pos.x += disV3.x * j;
                pos.y += disV3.y * i;
                //pos.z += disV3.z * j;
                sph.setPosition( pos );

                this.m_rscene.addEntity(sph);
            }
        }
    }
    private getTexList(name: string = "rusted_iron"): TextureProxy[] {
        let list: TextureProxy[] = [
            
            this.getImageTexByUrl("static/assets/pbr/"+name+"/albedo.png"),
            this.getImageTexByUrl("static/assets/pbr/"+name+"/normal.png"),
            this.getImageTexByUrl("static/assets/pbr/"+name+"/metallic.png"),
            this.getImageTexByUrl("static/assets/pbr/"+name+"/roughness.png"),
            this.getImageTexByUrl("static/assets/pbr/"+name+"/ao.png"),
        ];
        return list;
    }
    
    private makeTexMaterial(metallic: number, roughness: number, ao: number): PBRTexLightingMaterial
    {
        let dis: number = 700.0;
        let disZ: number = 400.0;
        let posList:Vector3D[] = [
            new Vector3D(-dis,  dis, disZ),
            new Vector3D( dis,  dis, disZ),
            new Vector3D(-dis, -dis, disZ),
            new Vector3D( dis, -dis, disZ)
        ];
        let colorSize:number = 300.0;
        let colorList:Color4[] = [
            new Color4(colorSize, colorSize, colorSize),
            new Color4(colorSize, colorSize, colorSize),
            new Color4(colorSize, colorSize, colorSize),
            new Color4(colorSize, colorSize, colorSize)
        ];

        let material:PBRTexLightingMaterial = new PBRTexLightingMaterial();
        material.setMetallic( metallic );
        material.setRoughness( roughness );
        material.setAO( ao );

        material.setCamPos(this.m_rscene.getCamera().getPosition());

        this.m_texMaterials.push(material);

        for (let i: number = 0; i < 4; ++i)
        {
            let pos: Vector3D = posList[i];
            material.setPosAt(i, pos.x, pos.y, pos.z);
            let color: Color4 = colorList[i];
            material.setColorAt(i, color.r, color.g, color.b);
        }
        return material;
    }
    private makeMaterial(metallic: number, roughness: number, ao: number): PBREnvLightingMaterial
    {
        let dis: number = 700.0;
        let disZ: number = 400.0;
        let posList:Vector3D[] = [
            new Vector3D(-dis,  dis, disZ),
            new Vector3D( dis,  dis, disZ),
            new Vector3D(-dis, -dis, disZ),
            new Vector3D( dis, -dis, disZ)
        ];
        let colorSize:number = 300.0;
        let colorList:Color4[] = [
            new Color4(colorSize, colorSize, colorSize),
            new Color4(colorSize, colorSize, colorSize),
            new Color4(colorSize, colorSize, colorSize),
            new Color4(colorSize, colorSize, colorSize)
        ];

        let material:PBREnvLightingMaterial = new PBREnvLightingMaterial();
        material.setMetallic( metallic );
        material.setRoughness( roughness );
        material.setAO( ao );
        let f0:number = Math.random() * 0.9;
        //material.setF0(Math.random() * 0.9, Math.random() * 0.9, Math.random() * 0.9);
        //material.setF0(f0,f0,f0);
        material.setCamPos(this.m_rscene.getCamera().getPosition());

        this.m_materials.push(material);

        for (let i: number = 0; i < 4; ++i)
        {
            let pos: Vector3D = posList[i];
            material.setPosAt(i, pos.x, pos.y, pos.z);
            let color: Color4 = colorList[i];
            material.setColorAt(i, color.r, color.g, color.b);
        }
        return material;
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
    }
    mouseWheelListener(evt:any):void
    {
        //this.m_CameraZoomController.setMoevDistance(evt.wheelDeltaY * 0.5);
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }

    run(): void {
        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_CameraZoomController.run(null, 30.0);
        
        for(let i: number = 0, il: number = this.m_materials.length; i < il; ++i) {

            this.m_materials[i].setCamPos(this.m_rscene.getCamera().getPosition());
        }
        for(let i: number = 0, il: number = this.m_texMaterials.length; i < il; ++i) {

            this.m_texMaterials[i].setCamPos(this.m_rscene.getCamera().getPosition());
        }


        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        //this.m_profileInstance.run();
    }
}
export default DemoEnvLighting;
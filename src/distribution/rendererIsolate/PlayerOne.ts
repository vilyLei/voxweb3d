
import {Vector3D} from "./Vector3D";
import {Color4} from "./Color4";
import {Matrix4} from "./Matrix4";
import {EntityObject} from "./EntityObject";
import {Renderer} from "./Renderer";
import {Camera} from "./Camera";
import {CameraCtrl} from "./CameraCtrl";
import {RendererContext} from "./RendererContext";

import {Engine} from "./Engine";

import IShdBuilder from "./IShdBuilder";
import {IShdWrapper} from "./IShdWrapper";
import {ShaderCodeWrapper,MaterialBuilder} from "./MaterialBuilder";



class SphRole {
    entity: EntityObject;
    private static s_tex: any = null;
    private static s_sph: any = null;
    private m_pos: Vector3D = new Engine.Vector3D();
    constructor(){}

    initialize(renderer: Renderer, materialBuilder: MaterialBuilder): void {

        let scale: number = Math.random() * 0.5 + 0.6;
        let sph = new Engine.Sphere3DEntity();
        this.m_pos.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 600.0 - 30.0, Math.random() * 1000.0 - 500.0);
        sph.setPosition(this.m_pos);
        sph.setScaleXYZ(scale, scale, scale);

        let material: any = materialBuilder.create();
        this.entity = sph;
        if(SphRole.s_tex != null) {
            sph.copyMesh(SphRole.s_sph);
            if(material != null) {
                sph.setMaterial( material );
            }
            sph.initialize(100.0, 20,20, [SphRole.s_tex]);
            if(material == null) sph.getMaterial().setRGB3f(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
            renderer.addEntity(sph, 0);
        }
        else {
            SphRole.s_sph = sph;
            if(material != null) {
                sph.setMaterial( material );
            }
            let tex = new Engine.ImageTextureProxy(64, 64);
            let img: HTMLImageElement = new Image();
            img.onload = (evt: any): void => {
                console.log("PlayerOne::initialize() image loaded url: ",img.src);
                tex.setDataFromImage(img);
                sph.initialize(100.0,20,20, [tex]);
                if(material == null) sph.getMaterial().setRGB3f(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
                renderer.addEntity(sph, 0);
            }
            img.src = "static/assets/box_wood01.jpg";
        }
    }
}

class PlayerOne {

    private m_renderer: Renderer = null;
    private m_rcontext: RendererContext = null;

    private m_camTrack: CameraCtrl = null;
    private m_materialBuilder: MaterialBuilder = new MaterialBuilder();
    constructor() { }

    initialize(pmodule: any): void {

        if(pmodule != null && this.m_renderer == null) {

            console.log("PlayerOne::initialize()...");

            this.m_renderer = pmodule["mainModule"].getRenderer() as Renderer;
            this.m_rcontext = pmodule["mainModule"].getRendererContext() as RendererContext;
            //  Class c2 = Class.forName("ImageTextureProxy");

            Engine.Initialize( pmodule );

            
            this.m_camTrack = new CameraCtrl();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
            console.log("rcontext.getCamera(): ",this.m_rcontext.getCamera());
            console.log("camTrack: ",this.m_camTrack);

            this.initScene();
        }
    }
    
    private m_axis: EntityObject;
    private m_plane: EntityObject;
    
    private initScene(): void {

        this.createLightObjs(new Engine.Vector3D(0.0,100.0,0.0), 1.0);
        
        this.initObjs();
    }
    
    private createLightObjs(pos: Vector3D, scale: number): void {

        

        let tex = new Engine.ImageTextureProxy(64, 64);
        let img: HTMLImageElement = new Image();

        img.onload = (evt: any): void => {

            console.log("PlayerOne::createLightObjs() image loaded url: ",img.src);
            console.log("PlayerOne::createLightObjs() 0 this.m_materialBuilder: ",this.m_materialBuilder);
            tex.setDataFromImage(img);


            let plane = new Engine.Plane3DEntity();
            plane.setPosition(pos);
            plane.setScaleXYZ(scale, scale, scale);
            plane.setMaterial( this.m_materialBuilder.create() );
            //plane.initializeXOZSquare(700, [this.getImageTexByUrl("static/assets/default.jpg")]);
            plane.initializeXOZSquare(700, [tex]);
            this.m_renderer.addEntity(plane, 0);
            
            console.log("PlayerOne::createLightObjs() 1 this.m_materialBuilder: ",this.m_materialBuilder);

            let box = new Engine.Box3DEntity();
            box.setMaterial( this.m_materialBuilder.create() );
            box.initializeCube(200.0, [tex]);
            pos.y += 100.0;
            box.setPosition( pos );
            this.m_renderer.addEntity(box, 0);
        }
        img.src = "static/assets/default.jpg";
    }
    private initObjs(): void {

        let axis = new Engine.Axis3DEntity();
        axis.initialize(300.0);
        this.m_renderer.addEntity(axis, 0);
        this.m_axis = axis;

        let tex = new Engine.ImageTextureProxy(64, 64);
        let plane = new Engine.Plane3DEntity();
        this.m_plane = plane;

        let img: HTMLImageElement = new Image();
        img.onload = (evt: any): void => {
            console.log("PlayerOne::initialize() image loaded url: ",img.src);
            tex.setDataFromImage(img);
         
            
            plane.setMaterial( this.m_materialBuilder.create() );
            plane.initializeXOZSquare(1300.0, [tex]);
            this.m_renderer.addEntity(plane, 0);
        }
        img.src = "static/assets/yanj.jpg";
        for(let i: number = 0; i < 15; ++i) {

            let sphObj = new SphRole();
            sphObj.initialize(this.m_renderer, this.m_materialBuilder);
        }
    }

    private m_axisYAngle: number = 0;
    private m_planeYAngle: number = 0;

    run(): void {

        if(this.m_axis != null) {

            this.m_axisYAngle += 1.0;
            this.m_planeYAngle += 0.5;
            this.m_axis.setRotationXYZ(0.0, this.m_axisYAngle, 0.0);
            this.m_axis.update();
            this.m_plane.setRotationXYZ(0.0, this.m_planeYAngle, 0.0);
            this.m_plane.update();
        }

        if(this.m_camTrack != null) {

            this.m_materialBuilder.updateLightData( this.m_rcontext.getCamera().getViewInvMatrix() );
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();
        }
    }
}

export {PlayerOne};
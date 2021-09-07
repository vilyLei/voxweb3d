
import {Vector3D} from "./Vector3D";
import {Matrix4} from "./Matrix4";
import {EntityObject} from "./EntityObject";
import {Renderer} from "./Renderer";
import {Camera} from "./Camera";
import {CameraCtrl} from "./CameraCtrl";
import {RendererContext} from "./RendererContext";
import {Engine} from "./Engine";

class SphRole {
    entity: EntityObject;
    private static s_tex: any = null;
    private static s_sph: any = null;
    private m_pos: Vector3D = new Engine.Vector3D();
    constructor(){}

    initialize(renderer: Renderer): void {

        let scale: number = Math.random() * 0.5 + 0.6;
        let sph = new Engine.Sphere3DEntity();
        this.m_pos.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 600.0 - 30.0, Math.random() * 1000.0 - 500.0);
        sph.setPosition(this.m_pos);
        sph.setScaleXYZ(scale, scale, scale);
        this.entity = sph;
        if(SphRole.s_tex != null) {
            sph.copyMesh(SphRole.s_sph);
            sph.initialize(100.0, 20,20, [SphRole.s_tex]);
            sph.getMaterial().setRGB3f(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
            renderer.addEntity(sph, 0);
        }
        else {
            SphRole.s_sph = sph;
            let tex = new Engine.ImageTextureProxy(64, 64);
            let img: HTMLImageElement = new Image();
            img.onload = (evt: any): void => {
                console.log("PlayerOne::initialize() image loaded url: ",img.src);
                tex.setDataFromImage(img);
                sph.initialize(100.0,20,20, [tex]);
                sph.getMaterial().setRGB3f(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
                renderer.addEntity(sph, 0);
            }
            img.src = "static/assets/box_wood01.jpg";
        }
        //console.log("new Vector3D(): ", new Vector3D());
    }
}
class PlayerOne {

    private m_renderer: Renderer = null;
    private m_rcontext: RendererContext = null;

    private m_camTrack: CameraCtrl = null;
    constructor() { }

    initialize(pmodule: any): void {

        if(pmodule != null && this.m_renderer == null) {

            console.log("PlayerOne::initialize()...");

            this.m_renderer = pmodule["mainModule"].getRenderer() as Renderer;
            this.m_rcontext = pmodule["mainModule"].getRendererContext() as RendererContext;
            //  Class c2 = Class.forName("ImageTextureProxy");

            Engine.Initialize( pmodule );

            this.initScene();
            
            this.m_camTrack = new CameraCtrl();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
            console.log("rcontext.getCamera(): ",this.m_rcontext.getCamera());
            console.log("camTrack: ",this.m_camTrack);
        }
    }
    //box_wood01
    private m_axis: EntityObject;
    private m_plane: EntityObject;
    private initScene(): void {

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
            plane.initializeXOZSquare(1300.0, [tex]);
            this.m_renderer.addEntity(plane, 0);
        }
        img.src = "static/assets/yanj.jpg";
        for(let i: number = 0; i < 15; ++i) {

            let sphObj = new SphRole();
            sphObj.initialize(this.m_renderer);
        }
    }

    private m_axisYAngle: number = 0;
    private m_planeYAngle: number = 0;

    run(): void {

        if(this.m_axis != null) {
            if(this.m_camTrack != null) {
                this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
                this.m_rcontext.updateCamera();
            }

            this.m_axisYAngle += 1.0;
            this.m_planeYAngle += 0.5;
            this.m_axis.setRotationXYZ(0.0, this.m_axisYAngle, 0.0);
            this.m_axis.update();
            this.m_plane.setRotationXYZ(0.0, this.m_planeYAngle, 0.0);
            this.m_plane.update();
        }
    }
}

export {PlayerOne};
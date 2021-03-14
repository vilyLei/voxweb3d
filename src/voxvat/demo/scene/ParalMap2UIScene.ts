
import * as Vector3DT from "../../..//vox/math/Vector3D";
import * as EventBaseT from "../../../vox/event/EventBase";
import * as MouseEventT from "../../../vox/event/MouseEvent";
import * as Stage3DT from "../../../vox/display/Stage3D";
import * as RendererStateT from "../../../vox/render/RendererState";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as RendererSubSceneT from "../../../vox/scene/RendererSubScene";

import * as ColorButtonT from "../../../orthoui/button/BoundsButton";
import * as ColorRectImgButtonT from "../../../orthoui/button/ColorRectImgButton";
//import * as TextInfoLabelT from "../../../orthoui/label/TextInfoLabel"
import * as CameraSwingBoundsControllerT from "../../../orthoui/ctrl/CameraSwingBoundsController";
import * as CameraMoveControllerT from "../../../voxeditor/control/CameraMoveController";
import * as AxisDragObjectT from "./AxisDragObject";
import * as TexManagerT from "./TexManager";
import * as MaterialManagerT from "./MaterialManager";
import * as MaterialUISceneT from "./MaterialUIScene";

import Vector3D = Vector3DT.vox.math.Vector3D;
import EventBase = EventBaseT.vox.event.EventBase;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RendererSubScene = RendererSubSceneT.vox.scene.RendererSubScene;

import BoundsButton = ColorButtonT.orthoui.button.BoundsButton;
import ColorRectImgButton = ColorRectImgButtonT.orthoui.button.ColorRectImgButton;
//import TextInfoLabel = TextInfoLabelT.orthoui.label.TextInfoLabel;
import CameraSwingBoundsController = CameraSwingBoundsControllerT.orthoui.ctrl.CameraSwingBoundsController;
import CameraMoveController = CameraMoveControllerT.voxeditor.control.CameraMoveController;
import AxisDragObject = AxisDragObjectT.voxvat.demo.scene.AxisDragObject;
import TexManager = TexManagerT.voxvat.demo.scene.TexManager;
import MaterialManager = MaterialManagerT.voxvat.demo.scene.MaterialManager;
import MaterialUIScene = MaterialUISceneT.voxvat.demo.scene.MaterialUIScene;

export namespace voxvat
{
    export namespace demo
    {
        export namespace scene
        {
            export class ParalMap2UIScene
            {
                constructor()
                {
                }
                private m_rsc:RendererScene = null;
                private m_ruisc:RendererSubScene = null;
                private m_stage3D:Stage3D = null;
                private m_resetCamBtn:ColorRectImgButton = null;
                private m_cancelSelectBtn:ColorRectImgButton = null;
                private m_camOriginPos:Vector3D = new Vector3D();
                //private m_infoLabel:TextInfoLabel = new TextInfoLabel();
                private m_materialUISC:MaterialUIScene = null;
                // the controller is to be swinging with mouse drag
                private m_cmaSwingCtrl:CameraSwingBoundsController = new CameraSwingBoundsController();
                private m_camMoveCtrl:CameraMoveController = new CameraMoveController();
                private m_axisDragObj:AxisDragObject = null;
                private m_stageHotArea:BoundsButton = null;

                getStageHotArea():BoundsButton
                {
                    return this.m_stageHotArea;
                }
                setStageHotArea(hotArea:BoundsButton):void
                {
                    this.m_stageHotArea = hotArea;
                }
                getAxisDragObj():AxisDragObject
                {
                    return this.m_axisDragObj;
                }
                setAxisDragObj(ctrlObj:AxisDragObject):void
                {
                    this.m_axisDragObj = ctrlObj;
                }
                setMaterialUISC(uisc:MaterialUIScene):void
                {
                    this.m_materialUISC = uisc;
                }
                getMaterialUISC():MaterialUIScene
                {
                    return this.m_materialUISC;
                }
                initialize(rscene:RendererScene,uiscene:RendererSubScene):void
                {
                    this.m_rsc = rscene;
                    this.m_ruisc = uiscene;
                    this.m_stage3D = this.m_rsc.getStage3D() as Stage3D;

                    this.m_camMoveCtrl.initialize(this.m_rsc);
                    this.m_camMoveCtrl.setSpeed(10.0);
                    this.m_camMoveCtrl.lockYAxis();
                    this.m_cmaSwingCtrl.initialize(this.m_rsc, this.m_ruisc);
                    this.m_camOriginPos.copyFrom(this.m_rsc.getCamera().getPosition());
                    this.m_stage3D.addEventListener(EventBase.RESIZE,this,this.stageResizeListener);
                    this.m_stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                    //this.m_stage3D.addEventListener(MouseEvent.MOUSE_MOVE,this,this.stageMouseMove);
                    
                    this.m_stageHotArea = this.m_cmaSwingCtrl.getViewHotArea();

                    if(this.m_axisDragObj == null)
                    {
                        this.m_axisDragObj = new AxisDragObject();
                        //this.m_axisDragObj.initialize(this.m_rsc, 0, 500.0,8.0);
                        this.m_axisDragObj.initializeHasQuad(this.m_rsc, 1,500.0,8.0,196.0, 0.3);
                        this.m_axisDragObj.setVisible(false);
                    }
                    let devK:number = 1.0;//rscene.getDevicePixelRatio();
                    console.log("$$$$$ devK: "+devK);
                    let rcbt:ColorRectImgButton = new ColorRectImgButton();
                    rcbt.flipVerticalUV = true;
                    rcbt.outColor.setRGB3f(0.0,1.0,0.0);
                    rcbt.overColor.setRGB3f(0.0,1.0,1.0);
                    rcbt.downColor.setRGB3f(1.0,0.0,1.0);
                    rcbt.setRenderState( RendererState.BACK_TRANSPARENT_STATE );
                    rcbt.initialize(0.0,0.0,64.0,64.0,[TexManager.CreateTexByUrl("static/assets/bt_reset_01.png")]);
                    this.m_ruisc.addEntity(rcbt);
                    rcbt.setXYZ((this.m_stage3D.stageWidth - 64.0) * devK, 0.0,0.1);
                    rcbt.addEventListener(MouseEvent.MOUSE_UP,this,this.resetCameraListener);
                    this.m_resetCamBtn = rcbt;

                    rcbt = new ColorRectImgButton();
                    rcbt.flipVerticalUV = true;
                    rcbt.outColor.setRGB3f(0.0,1.0,0.0);
                    rcbt.overColor.setRGB3f(0.0,1.0,1.0);
                    rcbt.downColor.setRGB3f(1.0,0.0,1.0);
                    rcbt.setRenderState( RendererState.BACK_TRANSPARENT_STATE );
                    rcbt.initialize(0.0,0.0,64.0,64.0,[TexManager.CreateTexByUrl("static/assets/bt_cancel_01.png")]);
                    this.m_ruisc.addEntity(rcbt);
                    rcbt.setXYZ((this.m_stage3D.stageWidth - 128 - 2) * devK, 0.0,0.1);
                    rcbt.addEventListener(MouseEvent.MOUSE_UP,this,this.cancelSelectListener);
                    this.m_cancelSelectBtn = rcbt;
                    
                    this.m_materialUISC = new MaterialUIScene();
                    this.m_materialUISC.setStageHotArea(this.m_stageHotArea);
                    this.m_materialUISC.initialize(rscene,uiscene);
                }
                private stageResizeListener(evt:any):void
                {
                    this.m_cmaSwingCtrl.setBounds(this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
                    this.m_resetCamBtn.setXYZ(this.m_stage3D.stageWidth - 64.0, 0.0,0.1);
                    this.m_resetCamBtn.update();
                    this.m_cancelSelectBtn.setXYZ(this.m_stage3D.stageWidth - 128 - 2.0, 0.0,0.1);
                    this.m_cancelSelectBtn.update();
                    this.m_rsc.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
                    if(this.m_ruisc != null)
                    {
                        this.m_ruisc.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
                        this.m_ruisc.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                    }
                }
                private cancelSelectListener(evt:any):void
                {
                    this.m_axisDragObj.deselect();
                    MaterialManager.SetDispTarget(null);
                    if(this.m_materialUISC != null)
                    {
                        this.m_materialUISC.hideUI();
                    }
                }
                private resetCameraListener(evt:any):void
                {
                    this.m_rsc.getCamera().lookAtRH(this.m_camOriginPos,Vector3D.ZERO,Vector3D.Y_AXIS);
                    this.m_rsc.getCamera().setRotationXYZ(0.0,0.0,0.0);
                    
                }
                
                private m_mouseDownBoo:boolean = false;
                
                //  protected stageMouseMove(evt:any):void
                //  {
                //      //this.m_mouseDownBoo = true;
                //  }
                protected mouseDownListener(evt:any):void
                {
                    this.m_mouseDownBoo = true;
                }
                private pick3DNothing():void
                {
                    //console.log("ParalMap2UIScene::pick3DNothing().");
                }
                runCtrl():void
                {
                    if(this.m_mouseDownBoo)
                    {
                        if(this.m_rsc.getEvt3DController() != null && !this.m_rsc.getEvt3DController().isSelected())
                        {
                            this.pick3DNothing();
                        }
                        this.m_mouseDownBoo = false;
                    }
                    if(this.m_axisDragObj != null)
                    {
                        this.m_axisDragObj.run();
                    }
                }
                run():void
                {
                    if(this.m_materialUISC != null)
                    {
                        this.m_materialUISC.run();
                    }
                }                
                runEnd():void
                {
                    // swing camera
                    if(this.m_cmaSwingCtrl != null)this.m_cmaSwingCtrl.run();
                    if(this.m_camMoveCtrl != null)this.m_camMoveCtrl.run();
                }
            }
        }
    }
}
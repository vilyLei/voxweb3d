
import EventBase from "../../../vox/event/EventBase";
import MouseEvent from "../../../vox/event/MouseEvent";
import Stage3D from "../../../vox/display/Stage3D";
import RendererState from "../../../vox/render/RendererState";
import RendererScene from "../../../vox/scene/RendererScene";
import RendererSubScene from "../../../vox/scene/RendererSubScene";

import TextInfoLabel from "../../../orthoui/label/TextInfoLabel"
import BoundsButton from "../../../orthoui/button/BoundsButton";
import ColorTextImgButton from "../../../orthoui/button/ColorTextImgButton";

import * as MaterialManagerT from "./MaterialManager";
import MaterialManager = MaterialManagerT.voxvat.demo.scene.MaterialManager;

export namespace voxvat {
    export namespace demo {
        export namespace scene {
            export class MaterialUIScene {
                constructor() {
                }
                private m_rsc: RendererScene = null;
                private m_ruisc: RendererSubScene = null;
                private m_stage3D: Stage3D = null;
                private m_materialBts: ColorTextImgButton[] = [];
                private m_stageHotArea: BoundsButton = null;
                private m_infoLabel: TextInfoLabel = new TextInfoLabel();

                getStageHotArea(): BoundsButton {
                    return this.m_stageHotArea;
                }
                setStageHotArea(hotArea: BoundsButton): void {
                    this.m_stageHotArea = hotArea;
                }
                initialize(rscene: RendererScene, uiscene: RendererSubScene): void {
                    this.m_rsc = rscene;
                    this.m_ruisc = uiscene;
                    this.m_stage3D = this.m_rsc.getStage3D() as Stage3D;
                    MaterialManager.Initialize(rscene);
                    this.m_stage3D.addEventListener(EventBase.RESIZE, this, this.stageResizeListener);
                    let len: number = 3;
                    let materialBt0: ColorTextImgButton;
                    let devK: number = 1.0;//rscene.getDevicePixelRatio();
                    //console.log("XXXXXXXXXX devK: "+devK);
                    for (let i: number = 0; i < len; ++i) {
                        materialBt0 = new ColorTextImgButton();
                        materialBt0.index = i;
                        materialBt0.setText("Material" + i);
                        materialBt0.setAlpha(0.3, 1.0);
                        materialBt0.outColor.setRGB3f(0.0, 1.0, 0.0);
                        materialBt0.overColor.a = 0.6;
                        materialBt0.initialize(0.0, 0.0, 100.0, 40.0);
                        materialBt0.setVisible(false);
                        materialBt0.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
                        materialBt0.setXYZ((this.m_stage3D.stageWidth - materialBt0.getWidth()) * devK, (256.0 + 45.0 * i) * devK, 0.2);
                        this.m_ruisc.addEntity(materialBt0);
                        this.m_ruisc.addEntity(materialBt0.getTextDisp());
                        this.m_materialBts.push(materialBt0);
                        materialBt0.addEventListener(MouseEvent.MOUSE_UP, this, this.materialBtnMouseDown);
                    }

                    this.m_infoLabel.alignLeftTop();
                    this.m_infoLabel.initialize("点击鼠标左键,选中物体,切换Material.");
                    this.m_infoLabel.setXYZ(Math.floor(0.5 * (this.m_stage3D.stageWidth - this.m_infoLabel.getWidth())), this.m_stage3D.stageHeight - 40.0, 0.1);
                    this.m_ruisc.addEntity(this.m_infoLabel);
                    this.m_infoLabel.flash();
                }
                private materialBtnMouseDown(evt: any): void {
                    //console.log("evt.target.index: "+evt.target.index);
                    this.m_infoLabel.fadeout();
                    //  this.m_infoLabel.setVisible(false);
                    MaterialManager.SetDispMaterialAt(evt.target.index);
                }
                showUI(): void {
                    let len: number = this.m_materialBts.length;
                    for (let i: number = 0; i < len; ++i) {
                        this.m_materialBts[i].setVisible(true);
                    }
                }
                hideUI(): void {
                    let len: number = this.m_materialBts.length;
                    for (let i: number = 0; i < len; ++i) {
                        this.m_materialBts[i].setVisible(false);
                    }
                }
                private stageResizeListener(evt: any): void {
                    let len: number = this.m_materialBts.length;
                    for (let i: number = 0; i < len; ++i) {
                        this.m_materialBts[i].setXYZ(this.m_stage3D.stageWidth - this.m_materialBts[i].getWidth(), 256.0 + 45.0 * i, 0.2);
                    }
                    if (this.m_infoLabel != null) {
                        this.m_infoLabel.setXYZ(Math.floor(0.5 * (this.m_stage3D.stageWidth - this.m_infoLabel.getWidth())), this.m_stage3D.stageHeight - 40.0, 0.1);
                        this.m_infoLabel.update();
                    }
                }
                private cancelSelectListener(evt: any): void {
                }

                private m_mouseDownBoo: boolean = false;
                protected mouseDownListener(evt: any): void {
                    this.m_mouseDownBoo = true;
                }
                runCtrl(): void {

                }
                private m_infoAlphaTime: number = 0.0;
                run(): void {
                    if (this.m_infoLabel != null) {
                        //this.m_infoLabel.setAlpha(Math.abs(Math.sin(this.m_infoAlphaTime)));
                        //this.m_infoAlphaTime += 0.05;
                        this.m_infoLabel.run();
                    }
                }
                runEnd(): void {
                }
            }
        }
    }
}
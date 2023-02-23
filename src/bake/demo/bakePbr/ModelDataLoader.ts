
import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../../vox/view/CameraTrack";
import RendererScene from "../../../vox/scene/RendererScene";
import ProfileInstance from "../../../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";

import BinaryLoader from "../../../vox/assets/BinaryLoader";

import PBREnvLightingMaterial from "../../../pbr/material/PBREnvLightingMaterial";
import PBRBakingMaterial from "./PBRBakingMaterial";
import { IFloatCubeTexture } from "../../../vox/render/texture/IFloatCubeTexture";
import TextureConst from "../../../vox/texture/TextureConst";
import IMeshBase from "../../../vox/mesh/IMeshBase";
import Sphere3DMesh from "../../../vox/mesh/Sphere3DMesh";
import RendererState from "../../../vox/render/RendererState";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import DataMesh from "../../../vox/mesh/DataMesh";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import Matrix4 from "../../../vox/math/Matrix4";
import MaterialBase from "../../../vox/material/MaterialBase";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { BinaryTextureLoader } from "../../../cospace/modules/loaders/BinaryTextureLoader";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { FileIO } from "../../../app/slickRoad/io/FileIO";
import { HttpFileLoader } from "../../../cospace/modules/loaders/HttpFileLoader";
class ModelData {
    models: CoGeomDataType[] = [];
    transforms: Float32Array[] = [];
}
class ModelDataLoader {
    private m_modelLoader = new CoGeomModelLoader();
    private m_modelLoaderEnabled = true;
    private m_model: ModelData;
    private m_uv2Model: ModelData;
    private m_uvData: Float32Array;
    private m_listener: (model: ModelData, uv2Model: ModelData, uvData: Float32Array) => void;
    private m_loadingTotal = 0;
    constructor() { }

    setListener(listener: (model: ModelData, uv2Model: ModelData, uvData: Float32Array) => void): void {
        this.m_listener = listener;
    }
    loadData(modelUrl: string, uv2ModelUrl: string = "", uvDataUrl: string = ""): void {

        this.m_model = null;
        this.m_uv2Model = null;
        this.m_uvData = null;

        if (modelUrl != "") {
            this.m_loadingTotal++;
        }
        if (uv2ModelUrl != "") {
            this.m_loadingTotal++;
        }
        if (uvDataUrl != "") {
            this.m_loadingTotal++;
        }
        this.loadModel(modelUrl);
        this.loadUV2Model(uv2ModelUrl);
        this.loadUVData(uvDataUrl);
    }
    private loadUVData(url: string): void {
        if(url == "") return;
        let loader = new HttpFileLoader();
        loader.load(url, (buf: ArrayBuffer, url: string): void => {
            let uvData = new Float32Array(buf);
            // console.log("uvData: ", uvData);
            this.m_uvData = uvData;
            this.update();
        })
    }
    private m_modelUrl = "";
    private m_uv2ModelUrl = "";
    private loadModel(url: string): void {
        if(url == "") return;
        this.m_modelUrl = url;
        if (this.m_modelLoaderEnabled) {
            this.m_modelLoaderEnabled = false;
            this.m_modelLoader.setListener(
                (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {
                    if(this.m_model == null) {
                        this.m_model = new ModelData();
                    }
                    console.log("loadModel(), models: ", models);
                    for(let i = 0; i < models.length; ++i) {
                        if(models[i].vertices != null) {
                            this.m_model.models.push(models[i]);
                            if(transforms != null) {
                                this.m_model.transforms.push(transforms[i]);
                            }
                        }
                    }
                    // this.m_model.models = this.m_model.models.concat(models);
                    // if(transforms != null)this.m_model.transforms = this.m_model.transforms.concat(transforms);
                },
                (total): void => {
                    console.log("loaded mesh model all.");
                    this.update();
                    this.m_modelLoaderEnabled = true;
                    if (this.m_uv2ModelUrl != "") {
                        this.loadUV2Model(this.m_uv2ModelUrl);
                    }

                });

            this.m_modelLoader.load([url]);
            this.m_modelUrl = "";
        }
    }

    private loadUV2Model(url: string): void {
        console.log("loadUV2Model(), url: ", url);
        if(url == "") return;
        this.m_uv2ModelUrl = url;
        if (this.m_modelLoaderEnabled) {
            this.m_modelLoaderEnabled = false;
            this.m_modelLoader.setListener(
                (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {
                    if(this.m_uv2Model == null) {
                        this.m_uv2Model = new ModelData();
                    }
                    this.m_uv2Model.models = this.m_uv2Model.models.concat(models);
                    if(transforms != null)this.m_uv2Model.transforms = this.m_uv2Model.transforms.concat(transforms);
                },
                (total): void => {
                    console.log("loaded uv model all.");
                    this.update();
                    this.m_modelLoaderEnabled = true;
                    if (this.m_modelUrl != "") {
                        this.loadModel(this.m_modelUrl);
                    }
                });

            this.m_modelLoader.load([url]);
            this.m_uv2ModelUrl = "";
        }
    }
    private update(): void {
        console.log("XXXX this.m_loadingTotal: ", this.m_loadingTotal);
        if (this.m_loadingTotal > 0) {
            this.m_loadingTotal--;
            if(this.m_loadingTotal < 1) {
                this.m_listener(this.m_model, this.m_uv2Model, this.m_uvData);
            }
        }
    }

}
export { ModelData, ModelDataLoader };
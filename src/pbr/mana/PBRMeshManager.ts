import Vector3D from "../../vox/math/Vector3D";
import DecodeSegment from "../../large/parse/DecodeSegment";
import DecodeNode from "../../large/parse/DecodeNode";
import BufferLoader from "../../large/loader/BufferLoader";
import LoaderNode from "../../large/parse/LoaderNode";
import DRACODecoder from "../../large/parse/DRACODecoder";
import DecodeQueue from "../../large/parse/DecodeQueue";
import RcodMesh from "../../large/mesh/RcodMesh";

import ColorPBRMaterial from "../../pbr/material/ColorPBRMaterial";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererScene from "../../vox/scene/RendererScene";
import TextureProxy from "../../vox/texture/TextureProxy";

import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererState from "../../vox/render/RendererState";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import FloatCubeTextureProxy from "../../vox/texture/FloatCubeTextureProxy";

import BinaryLoader from "../../vox/assets/BinaryLoader";
import Color4 from "../../vox/material/Color4";
import DDSLoader from "../../vox/assets/DDSLoader";
import DecodeData from "../../large/parse/DecodeData";


class TextureLoader {

  protected m_rscene: RendererScene = null;
  texture: FloatCubeTextureProxy = null;
  constructor() {        
  }
  
  loadTextureWithUrl(url:string, rscene: RendererScene): void {
      //let url: string = "static/bytes/spe.mdf";
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
      //tex.toRGBFormatFloat32F();
      tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
      tex.magFilter = TextureConst.LINEAR;
      
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

export default class PBRMeshManager {
  decoder: DRACODecoder = null;
  rscene: RendererScene = null;
  texLoader: ImageTextureLoader = null;
  uid: number = -1;
  static s_uid: number = 0;
  constructor() {

  }
  offsetPos: Vector3D = new Vector3D();
  initialize(): void {
    if (this.decoder == null) {
      this.uid = PBRMeshManager.s_uid++;
      let durl: string = "./static/modules/decode/";
      this.decoder = new DRACODecoder(durl);
    }
  }
  run(): boolean {
    //  if(this.material != null) {
    //    //this.material.setCamPos( this.rscene.getCamera().getPosition() );
    //    //return true;
    //  }
    return this.createMesh();
  }
  getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
    let ptex: TextureProxy = this.texLoader.getImageTexByUrl(purl);
    ptex.mipmapEnabled = mipmapEnabled;
    if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
    return ptex;
  }
  centerPVList: Vector3D[] = [];

  centerV: Vector3D = new Vector3D();

  mesh: RcodMesh = null;
  entity: DisplayEntity = null;
  moduleScale: number = 1.0;
  lightBaseDis: number = 700.0;
  lightPosList:Vector3D[] = null;
  material:ColorPBRMaterial = null;
  private makeTexMaterial(metallic: number, roughness: number, ao: number): ColorPBRMaterial
  {
      let dis: number = 700.0;
      let disZ: number = 400.0;
      let posList:Vector3D[] = [
          new Vector3D(-dis,  dis, disZ),
          new Vector3D( dis,  dis, disZ),
          new Vector3D(-dis, -dis, disZ),
          new Vector3D( dis, -dis, disZ)
      ];
      for (let i: number = 0; i < 4; ++i)
      {
        let pv:Vector3D = posList[i];
        pv.setXYZ(Math.random() - 0.5,0.0,Math.random() - 0.5);
        pv.normalize();
        pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
        pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
      }
      this.lightPosList = posList;
      let colorSize:number = 10.0;
      let colorList:Color4[] = [
          new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
          new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
          new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
          new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize)
      ];
      for (let i: number = 0; i < 4; ++i)
      {
        colorList[i].normalizeRandom(colorSize);
      }
      let material:ColorPBRMaterial = new ColorPBRMaterial();
      material.setMetallic( metallic );
      material.setRoughness( roughness );
      material.setAO( ao );
      
      console.log("metallic: ",metallic);
      console.log("roughness: ",roughness);
      console.log("ao: ",ao);

      this.material = material;

      for (let i: number = 0; i < 4; ++i)
      {
          let pos: Vector3D = posList[i];
          material.setPosAt(i, pos.x, pos.y, pos.z);
          let color: Color4 = colorList[i];
          material.setLightColorAt(i, color.r, color.g, color.b);
      }
      colorSize = 2.0;
      material.setAlbedoColor(Math.random() * colorSize,Math.random() * colorSize,Math.random() * colorSize);
      colorSize = 0.8;
      material.setF0(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize);
      material.setScatterIntensity(Math.random() * 128.0 + 1.0);
      //material.setAmbientFactor(Math.random(),Math.random(),Math.random());
      material.setAmbientFactor(0.01,0.01,0.01);
      return material;
  }
  
  private loadDDS(): TextureProxy {
    //let ddsUrl: string = "static/bytes/env_iem.dds";
    //let ddsUrl: string = "static/bytes/env_pmrem.dds";
    //let ddsUrl: string = "static/bytes/forestIrradiance.dds";
    /*
    let bytesCubeTex:BytesCubeTextureProxy = this.m_rscene.textureBlock.createBytesCubeTex(32, 32);
    bytesCubeTex.mipmapEnabled = false;
    bytesCubeTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
    bytesCubeTex.magFilter = TextureConst.LINEAR;
    loader.texture = bytesCubeTex;
    //*/
    
    let floatCubeTex: FloatCubeTextureProxy = this.rscene.textureBlock.createFloatCubeTex(32, 32);
    floatCubeTex.mipmapEnabled = false;
    floatCubeTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
    floatCubeTex.magFilter = TextureConst.LINEAR;

    let ddsUrl: string = "static/bytes/forestReflection.dds";
    let loader: DDSLoader = new DDSLoader();
    loader.texture = floatCubeTex;
    loader.uuid = ddsUrl;
    loader.load(ddsUrl);
    return loader.texture;
}
  private initMaterial(): void {

    let rm: ColorPBRMaterial = this.makeTexMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
    ///*
    let envMapUrl: string = "static/bytes/spe.mdf";
    //let loader:TextureLoader = new TextureLoader();
    let loader:SpecularTextureLoader = new SpecularTextureLoader();
    loader.loadTextureWithUrl(envMapUrl, this.rscene);

    rm.setTextureList([loader.texture]);
    //*/
    /*
    rm.setTextureList([this.loadDDS()]);
    //*/
    /*
    let urls = [
        "static/assets/hw_morning/morning_ft.jpg",
        "static/assets/hw_morning/morning_bk.jpg",
        "static/assets/hw_morning/morning_up.jpg",
        "static/assets/hw_morning/morning_dn.jpg",
        "static/assets/hw_morning/morning_rt.jpg",
        "static/assets/hw_morning/morning_lf.jpg"
    ];
    
    let cubeTex0:TextureProxy = this.texLoader.getCubeTexAndLoadImg("static/assets/cubeMap",urls);  
    rm.setTextureList([cubeTex0]);
    //*/
  }
  private createMesh(): boolean {
    if (DecodeQueue.MeshDataEanbled) {
      if (DecodeQueue.dst_uid == this.uid) {
        // 通过源数据构建mesh
        let list: DecodeNode[] = DecodeQueue.GetResList();
        let gbuf: any = null;
        let mesh: RcodMesh = null;

        let scale: number = this.moduleScale;
        console.log("createMesh2 this.offsetPos: ", this.offsetPos, this.uid + ", list.length: " + list.length);

        gbuf = list[0].gbuf;
        mesh = new RcodMesh();
        ///*
        //  let pl:Plane3DEntity = new Plane3DEntity();
        //  pl.initialize(0,0,40,40,[tex0]);
        //    let rm: RcoTextureMaterial = new RcoTextureMaterial();
        //    rm.initializeByCodeBuf(true);
        //    rm.setTextureList([tex1]);

        let rm: ColorPBRMaterial = this.material;
        rm.initializeByCodeBuf(true);
        //rm = pl.getMaterial();
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(rm);
        //entity.setPosition(this.offsetPos);
        //console.log("rm.getBufSortFormat(): "+rm.getBufSortFormat());
        mesh.setBufSortFormat(rm.getBufSortFormat());
        mesh.vbWholeDataEnabled = false;
        mesh.initialize2(gbuf, list);
        entity.setMesh(mesh);
        entity.setScaleXYZ(scale, scale, scale);

        let pv: Vector3D = new Vector3D();
        pv.copyFrom(mesh.bounds.center);
        pv.scaleBy(-1.0);
        pv.addBy(this.offsetPos);
        entity.setPosition(pv);
        //entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        this.rscene.addEntity(entity);

        //console.log("mesh.bounds.center: ",mesh.bounds.center);
        this.centerV.copyFrom(mesh.bounds.center);
        DecodeQueue.MeshDataEanbled = false;
        DecodeQueue.LoadEnabled = true;
        this.mesh = mesh;
        this.entity = entity;
        return true;
      }
    }
    return false;
  }
  private m_meshDataUrl: string = "";
  loadMeshFile(furl: string): void {
    this.initMaterial();
    let loader: BufferLoader = new BufferLoader();
    loader.load(
      furl,
      (buffer: ArrayBuffer, param: string) => {

        console.log("loaded a file, bytelength: " + buffer.byteLength);
        console.log("loaded a file, param length: " + param.length);

        let ss: any = (param.split(','));
        let len: number = Math.floor(ss.length / 2);
        let ds: DecodeSegment;
        let segments: DecodeSegment[] = new Array(len);
        for (let i: number = 0; i < len; ++i) {
          ds = new DecodeSegment();
          ds.range = [parseInt(ss[i * 2]), parseInt(ss[i * 2 + 1])];
          segments[i] = ds;
        }

        //console.log("segments.length: " + segments.length);
        let v: Uint8Array = new Uint8Array(buffer);
        DecodeData.d(v, segments);
        
        let node: LoaderNode = new LoaderNode();
        node.uid = this.uid;
        node.dracoLoader = this.decoder;
        node.drcSrc = furl;
        node.segments = segments;
        node.buffer = buffer;

        DecodeQueue.AddLoaderNode(node);
      }
    );
  }
}
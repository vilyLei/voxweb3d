import Vector3D from "../../vox/math/Vector3D";
import DecodeSegment from "../../large/parse/DecodeSegment";
import DecodeNode from "../../large/parse/DecodeNode";
import BufferLoader from "../../large/loader/BufferLoader";
import LoaderNode from "../../large/parse/LoaderNode";
import DRACODecoder from "../../large/parse/DRACODecoder";
import DecodeQueue from "../../large/parse/DecodeQueue";
import RcodMesh from "../../large/mesh/RcodMesh";

import DefaultPBRMaterial from "../../pbr/material/DefaultPBRMaterial";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererScene from "../../vox/scene/RendererScene";
import TextureProxy from "../../vox/texture/TextureProxy";

import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import FloatCubeTextureProxy from "../../vox/texture/FloatCubeTextureProxy";

import BinaryLoader from "../../vox/assets/BinaryLoader";
import Color4 from "../../vox/material/Color4";
import DDSLoader from "../../vox/assets/DDSLoader";
import Sphere3DMesh from "../../vox/mesh/Sphere3DMesh";
import Box3DMesh from "../../vox/mesh/Box3DMesh";
import { VtxNormalType } from "../../vox/mesh/VtxBufConst";


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

export default class DefaultPBRCase {
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
      this.uid = DefaultPBRCase.s_uid++;
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
  material:DefaultPBRMaterial = null;

  private setPointLightParam(lightsTotal: number, material:DefaultPBRMaterial, colorSize:number = 10.0): void {

    let posList:Vector3D[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i)
    {
      let pv:Vector3D = posList[i] = new Vector3D();
      pv.setXYZ(Math.random() - 0.5,0.0,Math.random() - 0.5);
      pv.normalize();
      pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
      pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
    }
    this.lightPosList = posList;
    let colorList:Color4[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i)
    {
      colorList[i] = new Color4();
      colorList[i].normalizeRandom(colorSize);
    }

    
    for (let i: number = 0; i < lightsTotal; ++i)
    {
        let pos: Vector3D = posList[i];
        material.setPointLightPosAt(i, pos.x, pos.y, pos.z);
        let color: Color4 = colorList[i];
        material.setPointLightColorAt(i, color.r, color.g, color.b);
    }
  }
  private setParallelLightParam(lightsTotal: number, material:DefaultPBRMaterial, colorSize:number = 10.0): void {

    let posList:Vector3D[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i)
    {
      let pv:Vector3D = posList[i] = new Vector3D();
      pv.setXYZ(Math.random() - 0.5,0.0,Math.random() - 0.5);
      pv.normalize();
      pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
      pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
    }
    
    let colorList:Color4[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i)
    {
      colorList[i] = new Color4();
      colorList[i].normalizeRandom(colorSize);
    }

    
    for (let i: number = 0; i < lightsTotal; ++i)
    {
        let pos: Vector3D = posList[i];
        pos.normalize();
        material.setParallelLightDirecAt(i, pos.x, pos.y, pos.z);
        let color: Color4 = colorList[i];
        material.setParallelLightColorAt(i, color.r, color.g, color.b);
    }
  }
  private makeTexMaterial(metallic: number, roughness: number, ao: number): DefaultPBRMaterial
  {
      let pointLightsTotal: number = 4;
      let parallelLightsTotal: number = 2;

      let material:DefaultPBRMaterial = new DefaultPBRMaterial(pointLightsTotal, parallelLightsTotal);
      material.setMetallic( metallic );
      material.setRoughness( roughness );
      material.setAO( ao );
      
      console.log("metallic: ",metallic);
      console.log("roughness: ",roughness);
      console.log("ao: ",ao);

      this.setPointLightParam(pointLightsTotal, material, 5.0);
      this.setParallelLightParam(parallelLightsTotal, material, 1.0);

      this.material = material;

      let colorSize: number = 2.0;
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

    let rm: DefaultPBRMaterial = this.makeTexMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
    ///*
    let envMapUrl: string = "static/bytes/s.bin";
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
        
        let scale: number = this.moduleScale;
        console.log("createMesh2 this.offsetPos: ", this.offsetPos, this.uid + ", list.length: " + list.length);

        let rm: DefaultPBRMaterial = this.material;
        rm.initializeByCodeBuf(true);
        
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(rm);
        /*
        let mesh: RcodMesh = new RcodMesh();
        mesh.setBufSortFormat(rm.getBufSortFormat());
        mesh.vbWholeDataEnabled = false;
        mesh.initialize2(list[0].gbuf, list);
        //*/
        ///*
        let mesh:Sphere3DMesh = new Sphere3DMesh();
        mesh.setBufSortFormat(rm.getBufSortFormat());
        mesh.initialize(150.0,30,30,false);
        this.offsetPos.setXYZ(0,0,0);
        //*/
        /*
        let mesh: Box3DMesh = new Box3DMesh();
        mesh.normalType = VtxNormalType.GOURAND;
        mesh.setBufSortFormat(rm.getBufSortFormat());
        mesh.initialize(new Vector3D(-130,-130,-130), new Vector3D(130,130,130));
        this.offsetPos.setXYZ(0,0,0);
        //*/

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
        //this.mesh = mesh;
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
        DefaultPBRCase.p(v, segments);

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

  // 加密解密
  static p(d: Uint8Array, m: DecodeSegment[]) {
    let tr = 0;
    if (m.length > 0) {
      tr = gg(m[0].range[1], m[0].range[0]);
    }
    for (let i = 0; i < m.length; i++) {
      c(d, m[i].range[0], m[i].range[1], tr);
    }

    function c(d: Uint8Array, s: number, e: number, tt: number) {
      let m = Math.floor((e - s) / 2);
      // let b = pg(d, s, e, tt);
      for (let i = s; i < s + m; i++) {
        d[i] = d[i] ^ d[m + i];
        d[m + i] = d[i] ^ d[m + i];
        d[i] = d[i] ^ d[m + i];
      }
      for (let j = s; j + 1 < e; j += 2) {
        d[j + 1] = d[j] ^ d[j + 1];
        d[j] = d[j] ^ d[j + 1];
      }
    }

    function gg(p: number, t: number) {
      let i = p + t;
      let j = i + p;
      let k = j + t;
      return p + t + k;
    }
  }
}
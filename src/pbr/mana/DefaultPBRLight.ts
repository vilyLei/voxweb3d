import Vector3D from "../../vox/math/Vector3D";
import DefaultPBRMaterial from "../../pbr/material/DefaultPBRMaterial";
import Color4 from "../../vox/material/Color4";

export default class DefaultPBRLight {

  uid: number = -1;
  static s_uid: number = 0;
  private m_pointLightPosList: Vector3D[] = null;
  private m_pointLightColorList: Color4[] = null;
  private m_direcLightDirecList: Vector3D[] = null;
  private m_direcLightColorList: Color4[] = null;
  lightBaseDis: number = 700.0;
  constructor() {

  }
  getPointList(): Vector3D[] {
    return this.m_pointLightPosList;
  }
  getPointLightTotal(): number {
    return this.m_pointLightPosList.length;
  }
  getDirecLightTotal(): number {
    return this.m_direcLightDirecList.length;
  }
  setLightToMaterial(material: DefaultPBRMaterial): void {

    // point light
    let posList: Vector3D[] = this.m_pointLightPosList;
    let colorList: Color4[] = this.m_pointLightColorList;
    let lightsTotal: number = posList.length;

    for (let i: number = 0; i < lightsTotal; ++i) {
      let pos: Vector3D = posList[i];
      material.setPointLightPosAt(i, pos.x, pos.y, pos.z);
      let color: Color4 = colorList[i];
      material.setPointLightColorAt(i, color.r, color.g, color.b);
    }

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////

    posList = this.m_direcLightDirecList;
    colorList = this.m_direcLightColorList;
    lightsTotal = posList.length;

    for (let i: number = 0; i < lightsTotal; ++i) {
      let pos: Vector3D = posList[i];
      pos.normalize();
      material.setParallelLightDirecAt(i, pos.x, pos.y, pos.z);
      let color: Color4 = colorList[i];
      material.setParallelLightColorAt(i, color.r, color.g, color.b);
    }

  }
  private createPointLightParam(lightsTotal: number, colorSize: number = 10.0): void {

    let posList: Vector3D[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i) {
      let pv: Vector3D = posList[i] = new Vector3D();
      pv.setXYZ(Math.random() - 0.5, 0.0, Math.random() - 0.5);
      pv.normalize();
      pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
      pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
    }
    this.m_pointLightPosList = posList;

    let colorList: Color4[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i) {
      colorList[i] = new Color4();
      colorList[i].normalizeRandom(colorSize);
    }
    this.m_pointLightColorList = colorList;

  }
  private createDirecLightParam(lightsTotal: number, colorSize: number = 10.0): void {

    let direcList: Vector3D[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i) {
      let pv: Vector3D = direcList[i] = new Vector3D();
      pv.setXYZ(Math.random() - 0.5, 0.0, Math.random() - 0.5);
      pv.normalize();
      pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
      pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
    }
    this.m_direcLightDirecList = direcList;

    let colorList: Color4[] = new Array(lightsTotal);
    for (let i: number = 0; i < lightsTotal; ++i) {
      colorList[i] = new Color4();
      colorList[i].normalizeRandom(colorSize);
    }
    this.m_direcLightColorList = colorList;

  }
  create(pointLightsTotal: number = 4, parallelLightsTotal: number = 2): void {

    this.createPointLightParam(pointLightsTotal, 5.0);
    this.createDirecLightParam(parallelLightsTotal, 1.0);
  }
}
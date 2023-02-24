/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMeshBase from "../../vox/mesh/IMeshBase";
import ITestRay from "./ITestRay";

export default interface IDataMesh extends IMeshBase {

  setRayTester(rayTester: ITestRay): void;
  /**
   * the defualt value is true
   */
  autoBuilding: boolean;
  /**
    * 强制更新 vertex indices buffer 数据, 默认值为false
    */
  forceUpdateIVS: boolean;

  /**
   * the default value is 3
   */
  vsStride: number;
  /**
   * the default value is 2
   */
  uvsStride: number;
  /**
   * the default value is 3
   */
  nvsStride: number;
  /**
   * the default value is 3
   */
  cvsStride: number;

  /**
   * set vertex position data
   * @param vs vertex position buffer Float32Array
   */
  setVS(vs: Float32Array): IDataMesh;
  /**
   * set vertex uv data
   * @param uvs vertex uv buffer Float32Array
   */
  setUVS(uvs: Float32Array): IDataMesh;
  
	/**
	 * set second vertex uv data
	 * @param uvs vertex uv buffer Float32Array
	 */
	setUVS2(uvs: Float32Array): IDataMesh;
  /**
   * set vertex normal data
   * @param vs vertex normal buffer Float32Array
   */
  setNVS(nvs: Float32Array): IDataMesh;
  /**
   * set vertex tangent data
   * @param vs vertex tangent buffer Float32Array
   */
  setTVS(tvs: Float32Array): IDataMesh;
  /**
   * @returns vertex tangent buffer Float32Array
   */
  getTVS(): Float32Array;

  /**
   * set vertex bitangent data
   * @param vs vertex bitangent buffer Float32Array
   */
  setBTVS(btvs: Float32Array): IDataMesh
  /**
   * set vertex color(r,g,b) data
   * @param vs vertex color(r,g,b) buffer Float32Array
   */
  setCVS(cvs: Float32Array): IDataMesh
  /**
   * @returns vertex bitangent buffer Float32Array
   */
  getBTVS(): Float32Array;

  /**
   * @param ivs indices buffer data
   */
  setIVS(ivs: Uint16Array | Uint32Array): IDataMesh;

  /**
   * initialization vertex buffer data
   */
  initialize(): void;

}

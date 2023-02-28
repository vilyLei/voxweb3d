/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMeshBase from "../../vox/mesh/IMeshBase";
import ITestRay from "./ITestRay";

export default interface IDataMesh extends IMeshBase {

  /**
   * the defualt value is true
   */
  autoBuilding: boolean;

  setRayTester(rayTester: ITestRay): void;

  /**
   * set vertex position data
	 * @param stride the default value is 3
   * @param vs vertex position buffer Float32Array
   */
  setVS(vs: Float32Array, stride?: number): IDataMesh;
  /**
   * set vertex uv data
	 * @param stride the default value is 2
   * @param uvs vertex uv buffer Float32Array
   */
  setUVS(uvs: Float32Array, stride?: number): IDataMesh;
  
  /**
   * set vertex normal data
	 * @param stride the default value is 3
   * @param vs vertex normal buffer Float32Array
   */
  setNVS(nvs: Float32Array, stride?: number): IDataMesh;
  /**
   * set vertex color data
	 * @param stride the default value is 3
   * @param cs vertex tangent buffer Float32Array
   */
  setCVS(cvs: Float32Array, stride?: number): IDataMesh;
  /**
   * set vertex tangent data
	 * @param stride the default value is 3
   * @param tvs vertex tangent buffer Float32Array
   */
  setTVS(tvs: Float32Array, stride?: number): IDataMesh;
  
  /**
   * set second vertex position data
	 * @param stride the default value is 3
   * @param vs vertex position buffer Float32Array
   */
  setVS2(vs: Float32Array, stride?: number): IDataMesh;
	/**
	 * set second vertex uv data
	 * @param stride the default value is 2
	 * @param uvs vertex uv buffer Float32Array
	 */
	setUVS2(uvs: Float32Array, stride?: number): IDataMesh;
  /**
   * @returns vertex tangent buffer Float32Array
   */
  getTVS(): Float32Array;
  
  setIVS(ivs: Uint16Array | Uint32Array): IDataMesh;
  /**
   * @param ivs indices buffer data
   * @param index the default value is 0
   * @param wireframe the default value is false
   * @param shape the default value is true
   */
  setIVSAt(ivs: Uint16Array | Uint32Array, index?: number, wireframe?: boolean, shape?: boolean): IDataMesh;
  getIVSAt(index: number): Uint16Array | Uint32Array;
  /**
   * initialization vertex buffer data
   */
  initialize(): void;

}

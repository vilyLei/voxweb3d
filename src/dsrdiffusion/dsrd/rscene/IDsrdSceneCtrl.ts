interface IDsrdSceneCtrl {

	updateDataWithCurrRNode(): void;
	/**
	 * @param fov_angle_degree the default value is 45.0
	 * @param near the default value is 10.0
	 * @param far the default value is 5000.0
	 */
	setCamProjectParam(fov_angle_degree: number, near: number, far: number): void;
	setCameraWithF32Arr16(camvs16: number[]): void;
	setViewImageUrls(urls: string[]): void;

}
export { IDsrdSceneCtrl };

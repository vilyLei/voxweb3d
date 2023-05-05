/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface IIntersection{

}
enum Intersection {
	None = 0,
	Hit = 1,
	Contain = 2,
	parallel = 3,
	Inner = 4,
	Outer = 5,
	Positive = 6,
	Negative = 7
}
export {
	Intersection
}

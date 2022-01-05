/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

enum CampRoleStatus {
    Free = 1,
    Busy = 2
}
enum CampType {
    Free = 1,
    Red = 2,
    Blue = 3,
    Green = 4
}
enum CampFindMode {
    Default,
    XOZ

}

export { CampRoleStatus, CampType, CampFindMode };
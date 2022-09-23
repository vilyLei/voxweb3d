interface ICoMouseEvent {

	readonly MOUSE_DOWN: number;
	readonly MOUSE_UP: number;
	readonly MOUSE_RIGHT_UP: number;
	readonly MOUSE_RIGHT_DOWN: number;
	readonly MOUSE_MOVE: number;
	readonly MOUSE_WHEEL: number;
	readonly MOUSE_OVER: number;
	readonly MOUSE_OUT: number;
	readonly MOUSE_CLICK: number;
	readonly MOUSE_RIGHT_CLICK: number;
	readonly MOUSE_DOUBLE_CLICK: number;
	readonly MOUSE_CANCEL: number;
	readonly MOUSE_MULTI_DOWN: number;
	readonly MOUSE_MULTI_UP: number;
	readonly MOUSE_MULTI_MOVE: number;
	readonly MOUSE_BG_DOWN: number; //  mouse down do not hit any 3d object, only in stage
	readonly MOUSE_BG_UP: number; //  mouse up do not hit any 3d object, only in stage
	readonly MOUSE_BG_CLICK: number; //  mouse up do not hit any 3d object, only in stage

	readonly MOUSE_MIDDLE_UP: number;// = 5019;
	readonly MOUSE_MIDDLE_DOWN: number;// = 5020;
	readonly MOUSE_BG_RIGHT_DOWN: number;// = 5021;
	readonly MOUSE_BG_RIGHT_UP: number;// = 5022;
	readonly MOUSE_BG_MIDDLE_DOWN: number;// = 5023;
	readonly MOUSE_BG_MIDDLE_UP: number;// = 5024;
}

export { ICoMouseEvent };

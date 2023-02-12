
import { IMouseInteraction } from "./IMouseInteraction";
import { ICoKeyboardInteraction } from "./ICoKeyboardInteraction";

interface ICoUIInteraction {
    createMouseInteraction(): IMouseInteraction;
    createKeyboardInteraction(): ICoKeyboardInteraction;
}
export { ICoUIInteraction }

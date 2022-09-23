import { MouseInteraction } from "./MouseInteraction";
import { CoKeyboardInteraction } from "./CoKeyboardInteraction";

function createMouseInteraction(): MouseInteraction {
    return new MouseInteraction();
}

function createKeyboardInteraction(): CoKeyboardInteraction {
    return new CoKeyboardInteraction();
}
export {

    // MouseInteraction,
    // CoKeyboardInteraction,

    createKeyboardInteraction,
    createMouseInteraction
}

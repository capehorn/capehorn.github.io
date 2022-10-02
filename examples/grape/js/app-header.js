import { div, span, text } from "../../_libs/hyperapp-html.js";



/**
 * @param {State} state 
 */
export default function view(state) {
    return div({ class: "app-header" }, [
        span({ class: "logo" }, text("Grape - 3D playground"))
    ]);
}
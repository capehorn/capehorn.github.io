
import { dom, T, on } from "https://cdn.jsdelivr.net/gh/capehorn/domtonjs/index.js";

export function UICmdInfo( $, emitter, msgTimeout = 3000 ) {
    let timeoutId = null;
    const UI = [
            T `div`, ".cmd-info", [
                T `div`, [ showCmd ]
            ]
        ];

    function showCmd() {
        return $.name;
    }

    function clearCmdInfo() {
        $ = { name: "" };
        emitter.emit( showCmd );
    }

    emitter.on( "uiCmdInfo.showCmd", cmd => {
        if ( timeoutId == null ) {
            timeoutId = setTimeout( clearCmdInfo, msgTimeout );
        } else {
            clearTimeout( timeoutId );
            clearCmdInfo();
            timeoutId = setTimeout( clearCmdInfo, msgTimeout );
        }
        $ = cmd;
        emitter.emit( showCmd );
    });

    const fragment = dom( UI, emitter );
    return fragment;
}
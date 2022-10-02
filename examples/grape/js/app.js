
 import { app } from "../../_libs/hyperapp.js";
 import {
   main,
   h1,
   button,
   text,
   div,
 } from "../../_libs/hyperapp-html.js"
 import headerView from "./app-header.js";
 import treeView from "./tree-panel.js";
 import { nanoid } from "./utils.js";

/**
 * @typedef {Object} State
 * @prop {TreePanel} treePanel
 */

/**
 * @typedef {Object} TreePanel
 * @prop {NodeContextMenu} nodeContextMenu
 * @prop {Node[]} nodes
 */

/**
 * @typedef {Object} Node
 * @prop {string} id
 * @prop {string} name
 * @prop {string} parent
 * @prop {string[]} children
 */

/**
 * @typedef {Object} NodeContextMenu
 * @prop {string} nodeId
 */

const ID_SCENE = nanoid(12);
const ID_LIGHT = nanoid(12);
const ID_SPOT_LIGHT = nanoid(12);
const ID_TORUS = nanoid(12);
const ID_CUBE = nanoid(12);

const State = {
    treePanel: {
        showNodeContextMenu: false,
        nodes: [
            {
                name: "my 3D scene",
                id: ID_SCENE,
                parent: "",
                children: [ID_LIGHT, ID_TORUS, ID_CUBE],
                open: true,
            },
            {
                name: "light",
                id: ID_LIGHT,
                parent: ID_SCENE,
                children: [ID_SPOT_LIGHT],
                open: true,
            },
            {
                name: "spot-light",
                id: ID_SPOT_LIGHT,
                parent: ID_LIGHT,
                children: [],
                open: true,
            },
            {
                name: "torus",
                id: ID_TORUS,
                parent: ID_SCENE,
                children: [],
                open: true,
            },
            {
                name: "cube",
                id: ID_CUBE,
                parent: ID_SCENE,
                children: [],
                open: true,
            }

        ],
    }
};

 
 export default () => app({
   init: () => State,
   view: (state) => 
        div({}, [
            headerView(state),
            div({ class: "app-main" }, [
                div({ class: "app-left-panel"}, [ ...treeView(state) ]),
                div({ class: "app-display"}, div({}, text("3D here...")))
            ])
        ]),
    //  main([
    //     headerView(state),
    //     h1(text(state.count)),
    //     button({ onclick: Subtract }, text("-")),
    //     button({ onclick: Add }, text("+")),
    //  ]),
   node: document.getElementById("app"),
 });
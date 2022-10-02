import { div, span, text } from "../../_libs/hyperapp-html.js";
import { nanoid } from "./utils.js";


/**
 * @param {State} state 
 */
export default function view({treePanel}) {
    const nodeMap = new Map( treePanel.nodes.map( node => [ node.id, node ] ) );
    const root = treePanel.nodes.filter(node => node.parent === "")[0];

    const nodeContextMenuId = treePanel.nodeContextMenu == null ? null : treePanel.nodeContextMenu.nodeId;
    return [
        div({ }, text("Tree panel")),
        div({ class: "tree" }, [
            root != null && nodeView(root, nodeMap, nodeContextMenuId)
        ]),
    ];
}

function nodeView(node, nodeMap, nodeContextMenuId) {
    const { id, name, children } = node;
    return div({ class: "node" }, [
        div({ class: "node-header" }, [ 
            text(name), 
            circle(id)
        ]),
        id === nodeContextMenuId && nodeContextMenu(id, nodeMap),
        ...children.map(childNodeId => nodeView(nodeMap.get(childNodeId), nodeMap, nodeContextMenuId))//...node.children.map(child => nodeView(child, nodeContextMenuId))
    ]);
}

function nodeActionPanel() {
    return div({ class: "node-action-panel" }, [
        text("copy"),
        text("cut")
    ]);
}

const DuplicateNode = (state, props) => {
    const nodeId = props.nodeId;
    const nodeMap = props.nodeMap;
    state.treePanel.nodes = [...state.treePanel.nodes];

    const nodeToDuplicate = nodeMap.get(nodeId);
    const parentNodeId = nodeToDuplicate.parent;
    const duplicateNodeId = nanoid(12);
    const fnCloneNode = (id, cloneId, cloneParentId) => {
        const node = nodeMap.get(id);
        const cloneNode = JSON.parse(JSON.stringify(node));
        cloneNode.id = cloneId;
        cloneNode.children = [];
        cloneNode.parent = cloneParentId;
        node.children.forEach(childId => {
            const cloneChildId = nanoid(12);
            fnCloneNode(childId, cloneChildId, cloneId);
            cloneNode.children.push(cloneChildId);
        });
        state.treePanel.nodes.push(cloneNode);
        nodeMap.set(cloneNode.id, cloneNode);
    };

    fnCloneNode(nodeId, duplicateNodeId, parentNodeId);
    state.treePanel.nodes.filter(node => node.id === parentNodeId).forEach(n => n.children.push(duplicateNodeId));
    state.treePanel.nodeContextMenu = null;
    return {...state};
};

function nodeContextMenu(nodeId, nodeMap) {
    return div({ class: "node-ctx-menu" }, [
        span({ class: "button" }, text("Copy")),
        span({ class: "button", onclick: [ DuplicateNode, { nodeId, nodeMap } ] }, text("Dup")),
        span({ class: "button" }, text("Del")),
    ]);
}

const ToggleMenu = (state, nodeId) => {
    if (state.treePanel.nodeContextMenu == null) {
        state.treePanel.nodeContextMenu = { nodeId };
    } else if (state.treePanel.nodeContextMenu.nodeId != nodeId) {
        state.treePanel.nodeContextMenu = { nodeId };
    } else {
        state.treePanel.nodeContextMenu = null;
    }
    return {...state};
}

function circle(nodeId) {
    return div({ class: "circle", onclick: [ToggleMenu, nodeId] }, []);
}
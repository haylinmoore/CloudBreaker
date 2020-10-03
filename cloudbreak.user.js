// ==UserScript==
// @name         CloudBreaker
// @namespace    https://scratch.mit.edu
// @version      0.4
// @description  Edit cloud variables on Scratch
// @author       Hampton Moore
// @license      GPL-2
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @run-at document-start
// ==/UserScript==

const functionBind = Function.prototype.bind;

window.cloud = {
    enabled: false,
    vars: {},
}

window.cloud.edit = function (variName) {
    let currentVal = window.cloud.stage.variables[window.cloud.vars[variName]].value

    let val = prompt(`What should the value of ${variName} be? It's currently ${currentVal}`);

    window.ScratchVM.runtime.ioDevices.cloud.requestUpdateVariable(variName, val);
    window.ScratchVM.runtime.ioDevices.cloud.updateCloudVariable({ name: variName, value: val })
}

window.Function.prototype.bind = function (...args) {
    if (args[0] && args[0].hasOwnProperty("editingTarget") && args[0].hasOwnProperty("runtime")) {
        if (window.ScratchVM) return;

        window.ScratchVM = args[0];
        window.ScratchVM.on('targetsUpdate', init);
    }

    return functionBind.apply(this, args);
};

function registerVariable(vari) {
    console.log(`Registering Variable ${vari.name}`);
    window.cloud.vars[vari.name] = vari.id;
    let editButton = document.createElement("button");
    editButton.classList.add("button");
    editButton.classList.add("action-button");

    editButton.addEventListener("click", () => { window.cloud.edit(vari.name) });

    let editButtonText = document.createElement("span");
    editButtonText.innerText = "Edit " + vari.name;
    editButton.appendChild(editButtonText);

    document.querySelector(".subactions .action-buttons").appendChild(editButton)
}

function snagVariables() {
    let targetStage = window.ScratchVM.runtime.getTargetForStage();
    window.cloud.stage = targetStage;

    const varis = Object.values(targetStage.variables);

    for (let vari of varis) {
        if (vari.isCloud) {
            registerVariable(vari);
        }
    }
}

function init() {
    if (!window.ScratchVM.runtime.hasCloudData()) return;

    window.ScratchVM.removeListener('targetsUpdate', init);
    snagVariables();
}

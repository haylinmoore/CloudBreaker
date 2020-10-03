// ==UserScript==
// @name         CloudBreaker
// @namespace    https://scratch.mit.edu
// @version      0.3  
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
    con: null,
    vars: {},
    stage: null,
    user: null,
    project_id: null
}

window.cloud.edit = function (variName) {
    let currentVal = window.cloud.stage.variables[window.cloud.vars[variName]].value

    let val = prompt(`What should the value of ${variName} be? It's currently ${currentVal}`);

    window.cloud.send({ "method": "set", "user": window.cloud.user, "project_id": window.cloud.project_id, "name": variName, "value": val });
}

window.Function.prototype.bind = function (...args) {
    if (args[0] && args[0].hasOwnProperty("editingTarget") && args[0].hasOwnProperty("runtime")) {
        window.ScratchVM = args[0];
    }

    return functionBind.apply(this, args);
};

function setupWebsocket() {
    window.cloud.user = document.querySelector(".profile-name").textContent;
    window.cloud.project_id = window.location.href.replace(/[^0-9]/g, '').toString();
    window.cloud.con = new WebSocket("wss://clouddata.scratch.mit.edu/");

    window.cloud.send = function (msg) {
        window.cloud.con.send(JSON.stringify(msg) + "\n")
    }

    window.cloud.con.onopen = function (e) {
        window.cloud.send({ "method": "handshake", "user": window.cloud.user, "project_id": window.cloud.project_id });
    }
}

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
    if (targetStage == undefined) {
        setTimeout(snagVariables, 1000);
    } else {
        window.cloud.stage = targetStage;
        if (window.ScratchVM.runtime.hasCloudData()) {
            const varis = Object.values(targetStage.variables);

            for (let vari of varis) {
                if (vari.isCloud) {
                    registerVariable(vari);
                }
            }

            setupWebsocket();
        } else {
            console.log("No cloud variables smh");
        }
    }
}

setTimeout(snagVariables, 1000);
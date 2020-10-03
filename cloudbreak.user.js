// ==UserScript==
// @name         CloudBreaker
// @namespace    https://scratch.mit.edu
// @version      0.1
// @description  Edit cloud variables on Scratch
// @author       Hampton Moore
// @license      GPL-2
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var cloud = {
        con: new WebSocket("wss://clouddata.scratch.mit.edu/"),
        vars: {},
        user: document.querySelector(".profile-name").textContent,
        project_id: window.location.href.replace(/[^0-9]/g,'').toString()
    }

    cloud.send = function(msg){
        cloud.con.send(JSON.stringify(msg) + "\n")
    }

    cloud.con.onopen = function (e) {
        cloud.send({"method":"handshake","user":cloud.user,"project_id":cloud.project_id});
    }

    cloud.edit = function (variName) {
        let val = prompt(`What should the value of ${variName} be? It's currently ${cloud.vars[variName]}`);

        cloud.send({"method":"set","user":cloud.user,"project_id":cloud.project_id,"name":variName,"value":val});
    }

    cloud.con.onmessage = function (e) {
        let vari = JSON.parse(e.data.slice(0, -1));

        if (!cloud.vars.hasOwnProperty(vari.name)){
            cloud.vars[vari.name] = vari.value;
            console.log(`Added variable ${vari.name}`);
            let editButton = document.createElement("button");
            editButton.classList.add("button");
            editButton.classList.add("action-button");

            editButton.addEventListener("click", ()=>{cloud.edit(vari.name)});

            let editButtonText = document.createElement("span");
            editButtonText.innerText = "Edit " + vari.name;
            editButton.appendChild(editButtonText);

            document.querySelector(".subactions .action-buttons").appendChild(editButton)
        } else {
            cloud.vars[vari.name] = vari.value;
        }
    }
})();

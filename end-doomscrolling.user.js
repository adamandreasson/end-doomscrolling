// ==UserScript==
// @name         Configurable Doomscrolling Stopper
// @namespace    https://adamandreasson.se/
// @version      0.6
// @description  Prompts user to stop doomscrolling on configured websites/URLs with a 5-second timer
// @author       Grok 3
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
	"use strict";

	// Default configuration
	const DEFAULT_CONFIG = {
		sites: [{ pattern: "https://x.com/*", enabled: true }],
		threshold: 4000,
	};

	// Load or initialize configuration
	let config = GM_getValue("doomscrollConfig", DEFAULT_CONFIG);
	let lastDismissed = 0;
	let currentOverlay = null;

	// Check if current URL matches any configured patterns
	function matchesCurrentUrl() {
		const currentUrl = window.location.href;
		return config.sites.some((site) => {
			if (!site.enabled) return false;
			const regex = new RegExp("^" + site.pattern.replace(/\*/g, ".*") + "$");
			return regex.test(currentUrl);
		});
	}

	// Create the overlay prompt element
	function createOverlay() {
		const overlay = document.createElement("div");
		overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(80, 0, 0, 1);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 24px;
        `;
		overlay.innerHTML = `
            <div style="text-align: center;">
                <p>You appear to be doomscrolling.</p>
                <p>Are you sure you want to keep doomscrolling?</p>
                <button id="confirm-doomscrolling" style="padding: 10px 20px; font-size: 18px;" disabled>Yes (5)</button>
            </div>
        `;

		const button = overlay.querySelector("#confirm-doomscrolling");
		let countdown = 5;
		button.textContent = `Yes (${countdown})`;

		const timer = setInterval(() => {
			countdown--;
			if (countdown > 0) {
				button.textContent = `Yes (${countdown})`;
			} else {
				button.textContent = "Yes";
				button.disabled = false;
				clearInterval(timer);
			}
		}, 1000);

		button.addEventListener("click", () => {
			if (!button.disabled) {
				lastDismissed += config.threshold;
				if (currentOverlay) {
					currentOverlay.remove();
					currentOverlay = null;
				}
			}
		});

		return overlay;
	}

	// Handle scroll events
	function onScroll() {
		if (!matchesCurrentUrl()) return;

		const scrollY = window.scrollY || document.documentElement.scrollTop;
		if (scrollY > lastDismissed + config.threshold && !currentOverlay) {
			currentOverlay = createOverlay();
			document.body.appendChild(currentOverlay);
		} else if (scrollY <= lastDismissed + config.threshold && currentOverlay) {
			currentOverlay.remove();
			currentOverlay = null;
		}
	}

	// Configuration menu
	GM_registerMenuCommand("Configure Doomscrolling Settings", () => {
		const configWindow = window.open(
			"",
			"Doomscrolling Config",
			"width=400,height=500"
		);
		configWindow.document.body.innerHTML = `
            <h2>Doomscrolling Settings</h2>
            <label>Scroll Threshold (pixels): <input type="number" id="threshold" value="${config.threshold}"></label><br><br>
            <h3>Sites</h3>
            <div id="sitesList"></div>
            <button id="addSite">Add Site</button>
            <button id="saveConfig">Save</button>
        `;

		const sitesList = configWindow.document.getElementById("sitesList");
		function renderSites() {
			sitesList.innerHTML = "";
			config.sites.forEach((site, index) => {
				sitesList.innerHTML += `
                    <div>
                        <input type="checkbox" ${
													site.enabled ? "checked" : ""
												} id="enabled${index}">
                        <input type="text" value="${
													site.pattern
												}" id="pattern${index}">
                        <button onclick="this.parentElement.remove()">Delete</button>
                    </div>
                `;
			});
		}
		renderSites();

		configWindow.document
			.getElementById("addSite")
			.addEventListener("click", () => {
				config.sites.push({ pattern: "https://example.com/*", enabled: true });
				renderSites();
			});

		configWindow.document
			.getElementById("saveConfig")
			.addEventListener("click", () => {
				config.threshold =
					parseInt(configWindow.document.getElementById("threshold").value) ||
					DEFAULT_CONFIG.threshold;
				const newSites = [];
				sitesList.querySelectorAll("div").forEach((div) => {
					const index = Array.from(sitesList.children).indexOf(div);
					newSites.push({
						enabled: div.querySelector(`#enabled${index}`).checked,
						pattern: div.querySelector(`#pattern${index}`).value,
					});
				});
				config.sites = newSites;
				GM_setValue("doomscrollConfig", config);
				configWindow.close();
			});
	});

	// Initialize
	function initialize() {
		if (matchesCurrentUrl()) {
			window.addEventListener("scroll", onScroll);
			onScroll();
		}
	}

	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		initialize();
	} else {
		document.addEventListener("DOMContentLoaded", initialize);
	}
})();

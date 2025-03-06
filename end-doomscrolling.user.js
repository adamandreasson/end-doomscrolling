// ==UserScript==
// @name         Stop Doomscrolling on X.com
// @namespace    https://adamandreasson.se/
// @version      0.5
// @description  Prompts the user after scrolling every 4000 pixels on X.com with a 5-second timer on Yes button
// @author       Grok 3
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Configuration
	const THRESHOLD_INTERVAL = 4000; // Interval in pixels for triggering the prompt
	let lastDismissed = 0; // Tracks the last dismissed threshold
	let currentOverlay = null; // Reference to the current overlay element

	// Create the overlay prompt element
	function createOverlay() {
		const overlay = document.createElement("div");
		overlay.style.position = "fixed";
		overlay.style.top = "0";
		overlay.style.left = "0";
		overlay.style.width = "100vw";
		overlay.style.height = "100vh";
		overlay.style.backgroundColor = "rgba(80, 0, 0, 1)";
		overlay.style.zIndex = "10000";
		overlay.style.display = "flex";
		overlay.style.justifyContent = "center";
		overlay.style.alignItems = "center";
		overlay.style.color = "white";
		overlay.style.fontSize = "24px";
		overlay.innerHTML = `
            <div style="text-align: center;">
                <p>You appear to be doomscrolling.</p>
                <p>Are you sure you want to keep doomscrolling?</p>
                <button id="confirm-doomscrolling" style="padding: 10px 20px; font-size: 18px;" disabled>Yes (5)</button>
            </div>
        `;

		// Get the button reference
		const button = overlay.querySelector("#confirm-doomscrolling");

		// Start 5-second countdown
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

		// Add event listener to the button
		button.addEventListener("click", () => {
			if (!button.disabled) {
				lastDismissed += THRESHOLD_INTERVAL;
				if (currentOverlay) {
					currentOverlay.remove();
					currentOverlay = null;
				}
			}
		});

		return overlay;
	}

	// Handle scroll events to show/hide the overlay based on scroll position
	function onScroll() {
		const scrollY = window.scrollY || document.documentElement.scrollTop;
		if (scrollY > lastDismissed + THRESHOLD_INTERVAL && !currentOverlay) {
			currentOverlay = createOverlay();
			document.body.appendChild(currentOverlay);
		} else if (
			scrollY <= lastDismissed + THRESHOLD_INTERVAL &&
			currentOverlay
		) {
			currentOverlay.remove();
			currentOverlay = null;
		}
	}

	// Initialize the script
	function initialize() {
		window.addEventListener("scroll", onScroll);
		onScroll();
	}

	// Run initialization when DOM is ready
	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		initialize();
	} else {
		document.addEventListener("DOMContentLoaded", initialize);
	}
})();

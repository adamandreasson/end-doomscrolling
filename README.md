# end-doomscrolling

Reminders that you are in fact doom scrolling

This userscript helps you become aware of doomscrolling habits by displaying a prompt after scrolling a configured distance on specified websites. It includes a 5-second delay before you can confirm continuing, giving you a moment to reconsider.

## Features

- Configurable scroll distance threshold
- Customizable list of websites/URLs to monitor
- Wildcard support for URL patterns (e.g., `https://*.example.com/*`)
- Persistent settings saved via Tampermonkey
- 5-second confirmation delay

## Installation with Tampermonkey

1. **Install Tampermonkey**

   - Visit [Tampermonkey.net](https://www.tampermonkey.net/)
   - Click "Download" and follow the instructions for your browser (Chrome, Firefox, Edge, etc.)
   - Add the Tampermonkey extension to your browser

2. **Install the Userscript**
   - Open the script file (e.g., `end-doomscrolling.user.js`) in a text editor or view it raw on GitHub
   - Copy the entire script content
   - Open your browser and click the Tampermonkey icon in your toolbar
   - Select "Create a new script..." from the menu
   - Paste the copied script into the editor
   - Click "File" > "Save" (or Ctrl+S) in the Tampermonkey editor
   - The script is now installed and active

## Configuration

1. **Access the Settings**

   - Click the Tampermonkey icon in your browser toolbar
   - Find "Configurable Doomscrolling Stopper" in the menu
   - Click "Configure Doomscrolling Settings" to open the configuration window

2. **Customize Settings**

   - **Scroll Threshold**: Enter the number of pixels to scroll before triggering the prompt (default: 4000)
   - **Sites List**:
     - **Add Site**: Click "Add Site" to create a new entry
     - **Enable/Disable**: Check/uncheck the box next to each pattern to toggle it
     - **Edit Pattern**: Modify the URL pattern (e.g., `https://x.com/*`, `https://*.social/*`)
     - **Delete**: Click "Delete" to remove a site
   - Examples of valid patterns:
     - `https://x.com/*` (all pages on x.com)
     - `https://*.example.com/*` (all subdomains of example.com)
     - `https://news.site.com/articles/*` (specific path)

3. **Save Changes**
   - Click the "Save" button in the configuration window
   - The window will close, and your settings will be applied immediately

## Usage

- The script runs automatically on matching websites
- Scroll down the configured threshold distance to trigger the prompt
- Wait 5 seconds for the "Yes" button to enable, or reconsider your scrolling
- Click "Yes" to dismiss the prompt until you scroll another threshold distance

## Notes

- Requires Tampermonkey to function (other userscript managers like Greasemonkey may work but are untested)
- Settings persist across browser sessions
- Only activates on URLs matching your configured patterns

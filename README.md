# NodeBB Unresponsive Plugin

The NodeBB Unresponsive Plugin is a way to allow users to prevent NodeBB's responsive design from causing unexpected changes
in the UI when using NodeBB. The user's preference is stored using the browser's local storage, so it is specific to 
the device being used to access NodeBB.

##Changes
    0.4.0
     - Fix max notification height - Issue #4
     - Add configurable notification dropdown width - Issue #5
    0.3.2
     - Fix duplicate property name error in some browsers.
    0.3.1
     - Detect that the menu was already created under custom themes.
     - Fix settings popup z-index.
    0.3.0
     - Settings dialog.
     - Set max width and left margin when in desktop mode
     - Set max post width
     - Make the notifications dropdown bigger.
    0.2.0
     - Disable when the user selects a non-default skin, due to cross origin policies.
    0.1.2
     - Fix middle clicks missing initialization.
    0.1.1
     - Don't use non-standard `innerText`.
    0.1.0
     - User menus for switching between 'responsive' (default) and 'desktop' mode.

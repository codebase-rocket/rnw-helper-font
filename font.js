// Info: Contains Font Utility Functions for Both Browser and Native Platform
'use strict';

// A React Native Library that allows you to load fonts dynamically at runtime (TTF or OTF formats are supported)
import { loadFontFromFile } from '@vitrion/react-native-load-fonts';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// Exclusive Dependencies
var CONFIG; // (Managed by Main Entry Module & Loader)


/////////////////////////// Module-Loader START ////////////////////////////////
/********************************************************************
Load dependencies and configurations

@param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
@param {Set} config - Custom configuration in key-value pairs

Return None
*********************************************************************/
const loader = function(shared_libs, config){

  // Shared Dependencies (Must be loaded in memory already)
  Lib.Utils = shared_libs.Core.Utils;
  Lib.Client = shared_libs.Client;


  // Configuration (Managed my Main Entry Module)
  CONFIG = config;

};/////////////////////////// Module-Loader END ////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){ // Export Public Interfaces of this module

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return Font;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const Font = { // Public functions accessible by other modules


  /********************************************************************
  Determine the theme font based on the platform (Browser or Native).

  @param {Function} cb - Callback function to be called after all the fonts are generated.

  @param {Object} app_primary_font_data - The App Font-Set for the Primary font type containing font styles.
  @param {Object} app_secondary_font_data - The App Font-Set for the Secondary font type containing font styles.

  Return - None
  *********************************************************************/
  getThemeFont: function( cb, app_primary_font_data, app_secondary_font_data ){

    // Determine the theme font based on the platform (Browser or Native)
    if (Lib.Client.isBrowser()){ // Browser
      // Merge font of the App Font for the browser platform
      cb(_Font.generateBrowserFont(app_primary_font_data, app_secondary_font_data));
    }
    else {
      // Merge font of the App Font for the native platform
      _Font.generateNativeFont(cb, app_primary_font_data, app_secondary_font_data);
    }

  },


};/////////////////////////// Public Functions END /////////////////////////////



//////////////////////////// Private Functions START////////////////////////////
const _Font = {

  /********************************************************************
  Generates new-font-set for the primary and secondary font styles based on the provided font data.

  @param {Object} app_primary_font_data - The App Font-Set for the Primary font type containing font styles with their respective url.
  @param {Object} app_secondary_font_data - The App Font-Set for the Secondary font type containing font styles with their respective url.

  @returns {Set} new-font-set.  - Font set generated from primary and secondary font data.
  *********************************************************************/
  generateBrowserFont: function(app_primary_font_data, app_secondary_font_data){

    // New font set
    return {
      'Primary': _Font.appendFontsInBrowser('Primary',  app_primary_font_data), // Primary font-set
      'Secondary': _Font.appendFontsInBrowser('Secondary',  app_secondary_font_data) // Secondary font-set
    }

  },


  /********************************************************************
  Generate native font for both Primary and Secondary font types.

  @param {Function} cb - Callback function to be called after all the native fonts are generated.

  @param {Object} app_primary_font_data - The App Font-Set for the Primary font type containing font styles with their respective file paths.
  @param {Object} app_secondary_font_data - The App Font-Set for the Secondary font type containing font styles with their respective file paths.

  Return - None
  *********************************************************************/
  generateNativeFont: function(cb, app_primary_font_data, app_secondary_font_data){

    var new_font_data = {
      'Primary': {},
      'Secondary': {},
    };

    // Load native font for the Primary font type.
    _Font.appendFontsInNative(

      function(new_primary_font_set){ // Callback for primary font set

        new_font_data['Primary'] = new_primary_font_set;

        // Once the fonts for the Primary font type are loaded, load the fonts for the Secondary font type
        _Font.appendFontsInNative(

          function(new_secondary_font_set){ // Callback for secondary font set

            new_font_data['Secondary'] = new_secondary_font_set;

            // Newly constructed font set
            cb(new_font_data); // final callback

          },
          app_secondary_font_data, // Secondary font data
          // new_secondary_font_set // newly constructed font set
        );

      },
      app_primary_font_data // Primary font data

    );

  },


  /********************************************************************
  Append fonts in the browser.

  @param {Function} cb - Callback function to be called after all the fonts are appended.

  @param {Object} font_namespace - Font namespace used as prefix in app-font-name.
  @param {Object} app_font_data - The App Font-Set containing font styles with their respective URLs.

  @return {Set} new_font_set - Updated font set
  *********************************************************************/
  appendFontsInBrowser: function(font_namespace, app_font_data){


    // Check if app-font-data is available
    if (Lib.Utils.isEmpty(app_font_data)){
      return;
    }

     // Create an Element Node for the Style tag
     var style_node = document.createElement('style');

    // String to combine the font-face styles
    var font_face_styles = '';

    // new-font-set
    var new_font_set = {};

    // Get the font style (e.g. regular, bold, medium, etc.).
    Object.keys(app_font_data).forEach(function(app_font_style){

      // Check if the font style exists in the app-font-data
      if(app_font_style in app_font_data){

        // Generate the custom font name with the given namespace
        var app_font_style_name = font_namespace + '-' + app_font_style;

        // Add the font style and its corresponding app-font-style-name to the new-font-set
        new_font_set[app_font_style] = app_font_style_name;

        // Construct the font-face string for respective app-font-style
        font_face_styles += _Font.constructFontStyleString(app_font_style_name, app_font_data[app_font_style]['url']);

      }

    });


    // Create an Element Node for the Style tag
    var style_node = document.createElement('style');

    // Create a Text Node with the combined font-face styles
    let style_text_node = document.createTextNode(font_face_styles);

    // Append the Font-Face Style Node to the Style tag
    style_node.appendChild(style_text_node);

    // Add the Style Node to the HTML Head Element
    document.head.appendChild(style_node);

    // Return the new-font-set that contains app-font-name against respective app-font-style
    return new_font_set;

  },


  /********************************************************************
  Append Fonts in the native platform (iOS or Android).

  @param {Function} cb - Callback function to be called after all the fonts are appended.

  @param {Object} app_font_data - App font data containing name, path and url.
  @param {Object} result_chain_new_font_set - The Font-Set to be updated.
  @param {Number} count - Optional parameter indicating the current index in app font list

  Return- None
  *********************************************************************/
  appendFontsInNative: function(cb, app_font_data, result_chain_new_font_set = {}, count = 0){

    // Get the font style (ex - regular, bold, medium etc).
    const font_style = Object.keys(app_font_data)[count];

    // Install the font from the provided file path
    _Font.installFont(

      function(font_name){

        // Add the font-name to the new font-set in the respective font-style
        result_chain_new_font_set[font_style] = font_name;

        // Increment recursive counter
        count++;

        // Recursivly download next font until end of list is reached
        if (Object.keys(app_font_data).length > count){

          Font.appendFontsInNative(cb, app_font_data, result_chain_new_font_set, count);

        }
        else {
          // All fonts have been appended.
          cb(result_chain_new_font_set);
        }
      },
      app_font_data[font_style]
    )

  },


  /********************************************************************
  Construct font-face style string for a font.

  @param {Function} cb - Callback function to be called with font-name or font face-style-string.

  @param {String} app_font_url - The font URL to be used for downloading the font.

  @return {Function} cb - Callback (Optional)
  *********************************************************************/
  constructFontStyleString: function(app_font_style_name, app_font_style_url){

    // Check if the file url is not available, which means this font cannot be installed.
    if (Lib.Utils.isNullOrUndefined(app_font_style_url)){
      return null;
    }

    // Return the Font-Face Style string
    return `@font-face {
      font-family: '${app_font_style_name}';
      src: url('${app_font_style_url}');
    }`;
//window.location.origin +
// src: url('${app_font_style_url}');
  },


  /********************************************************************
  Load font in iOS or Android.

  @param {Function} cb - Callback function to be called after the font is loaded.

  @param {String} app_font_name - Font name (It will be available only when we load system linked font) .
  @param {String} app_font_path - The app font path from where font to be loaded.

  Return: None
  *********************************************************************/
  installFont: function(cb, app_font_style_data){

    // If the app font name is already available, it means this is a system linked font and does not require installation.
    if (app_font_style_data['preloaded']){
      return cb(app_font_style_data['name']);
    }

    // Check if the file path is not available, which means this font cannot be installed.
    if (Lib.Utils.isNullOrUndefined(app_font_style_data['path'])){
      return cb(null); // Execute the callback function with null.
    }


    // Load the Font from the provided app-font-path
    loadFontFromFile('', app_font_style_data['path'])
      .then(function(font_name){

        cb(font_name); // Execute the callback function after the font is loaded return font-name extracted from font file.

      })
      .catch(function(err){

        cb(null); // Execute the callback function

      });

  },


};///////////////////////////Private Functions END//////////////////////////////

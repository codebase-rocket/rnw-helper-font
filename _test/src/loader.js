// Info: Dependency Manager. Configuration Loader
'use strict';

// Initialize Lib and Config
var Lib = {};
var Config = {};


//////////////////////////// Module Exports START //////////////////////////////
module.exports = function(platform){

  // Helper Library of basic utility functions
  Lib.Utils = require('js-helper-utils');

  // App Platform
  Config['APP_PLATFORM'] = platform

  Lib.Color = require('./theme/colors/light.json');
  Lib.Dimention = require('./theme/dimension/dimension.json');;


  Lib.ThemeUtils = require('rnw-helper-theme')(Lib, Config);

  Lib.Theme = {};

   
  // Set App platform for this project (IOS, ANDROID, BROWSER)
  Config['APP_PLATFORM'] = platform;
  
  /* Return */
  return [Lib, Config];

};//////////////////////////// Module Exports END //////////////////////////////

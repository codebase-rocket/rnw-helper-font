// Info: Project Root
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// React (Private Scope)
import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';


/////////////////////////// Module-Loader START ////////////////////////////////
/********************************************************************
Load dependencies and Configurations

@param {Set} shared_libs - Reference to libraries already loaded in memory by other modules

Return - None
*********************************************************************/
const loader = function(shared_libs){

  // Shared Dependencies (Managed by Main Entry Module)
  Lib = shared_libs;


};/////////////////////////// Module-Loader END ////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs){

  // Load loader
  loader(shared_libs);

  // Export Public Interfaces of this module
  return Root;

};//////////////////////////// Module Exports END //////////////////////////////



//////////////////////////////// Component START ///////////////////////////////
const Root = function(){


  useEffect(()=>{

     // Get App theme
     Lib.ThemeUtils.getAppTheme(

      function (theme){

         // Merge updated theme with existing one
         Object.assign(Lib.Theme, theme); 

         if(theme){                 
            context.states.set_app_theme(theme);                             
         }

      },
      Lib.Color,
      null, 
      Lib.Dimention, 
      null, 
      // app_primary_font_data, 
      // app_secondary_font_data,
      
   );
  },[])


  return (
    <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text style = {{fontSize: 50}}> Client Info</Text>
      </View>
  );

};/////////////////////////////// Component END ////////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _Root = { // Private functions accessible within this modules only


};//////////////////////////Private Functions END///////////////////////////////

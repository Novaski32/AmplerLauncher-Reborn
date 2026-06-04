


(function () {
    var enabled = false
    ModAPI.addEventListener("key", function(ev){
        if(ev.key == 45){
          if(enabled){
                disable()
                enabled = false
          } else{
                update(); 
                enabled = true
          }
        }
    })
    var targets = ["diamond_block","diamond_ore","gold_block","gold_ore","iron_block","iron_ore","coal_block","coal_ore","emerald_ore","emerald_block","redstone_ore","redstone_block","lapis_ore","lapis_block","chest","furnace","lit_furnace","ender_chest"]; 
    var allblocks = Object.keys(ModAPI.blocks); 
    function update() {
      ModAPI.displayToChat({msg: "xray Enabled!"})
      allblocks.forEach(block=>{ 
        if (targets.includes(block)) { 
          ModAPI.blocks[block].forceRender = true;
          ModAPI.blocks[block].reload(); 
        } else if (ModAPI.blocks[block] && ("noRender" in ModAPI.blocks[block])) { 
          ModAPI.blocks[block].noRender = true;
          ModAPI.blocks[block].reload(); 
        }
      });
      ModAPI.reloadchunks()
    }
    function disable(){
      ModAPI.displayToChat({msg: "xray Disabled!"})
              allblocks.forEach(block=>{ 
 if (ModAPI.blocks[block] && ("noRender" in ModAPI.blocks[block])) { 
          ModAPI.blocks[block].noRender = false;
          ModAPI.blocks[block].reload(); 
        }
      });
    ModAPI.reloadchunks()
    }
  })();

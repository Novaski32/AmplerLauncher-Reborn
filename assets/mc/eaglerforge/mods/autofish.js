ModAPI.require("player"); 
var timer;
var fishRodId = ModAPI.items.fishing_rod.getID(); 
ModAPI.addEventListener("packetsoundeffect", (ev) => { 
  if (ev.soundName === "random.splash") { 
    rightClick(); 
  }
});
ModAPI.addEventListener("update", () => { 
  if ( 
    ModAPI.player.inventory.mainInventory[
      ModAPI.player.inventory.currentItem
    ] &&
    ModAPI.player.inventory.mainInventory[
      ModAPI.player.inventory.currentItem
    ].itemId === fishRodId
  ) {
    if (timer > 0) { 
      timer--; 
      return; 
    }
    if (ModAPI.player.fishEntity) { 
      return; 
    }

    rightClick(); 
  }
});
function rightClick() {
  if ( 
    !ModAPI.player.inventory.mainInventory[
      ModAPI.player.inventory.currentItem
    ] ||
    !ModAPI.player.inventory.mainInventory[
      ModAPI.player.inventory.currentItem
    ].itemId === fishRodId
  ) {
    return; 
  }
  ModAPI.rightClickMouse(); 
  timer = 15; 
}


ModAPI.require("player"); 
ModAPI.require("network"); 

ModAPI.addEventListener("update", ()=>{ 
  if (ModAPI.player.fallDistance > 2.0) { 
    ModAPI.network.sendPacketPlayer({isOnGround: true}); 
  }
});

ModAPI.require("player"); 
var GrappleHookMod = {
  oldXYZ: [0, 0, 0], 
  prev: "NONE", 
  scaleH: 0.25, 
  scaleV: 0.15, 
  lift: 0.4, 
  crouchToCancel: true 
};
ModAPI.addEventListener("update", () => { 
  if (!ModAPI.player.fishEntity) { 
    if (GrappleHookMod.prev === "GROUND" && (!GrappleHookMod.crouchToCancel || !ModAPI.player.isSneaking())) { 
      GrappleHookMod.prev = "NONE"; 
      var mx = GrappleHookMod.oldXYZ[0] - ModAPI.player.x; 
      var my = GrappleHookMod.oldXYZ[1] - ModAPI.player.y; 
      var mz = GrappleHookMod.oldXYZ[2] - ModAPI.player.z; 
      mx *= GrappleHookMod.scaleH; 
      my *= GrappleHookMod.scaleV; 
      mz *= GrappleHookMod.scaleH; 
      ModAPI.player.motionX += mx; 
      ModAPI.player.motionY += my + GrappleHookMod.lift;  
      ModAPI.player.motionZ += mz; 
      ModAPI.player.reload(); 
    } else {
      GrappleHookMod.prev = "NONE";
    }
  } else if (GrappleHookMod.prev === "NONE") { 
    GrappleHookMod.prev = "AIR";
  }
  if (
    ModAPI.player.fishEntity !== undefined && 
    GrappleHookMod.prev === "AIR" && 
    ModAPI.player.fishEntity.inGround 
  ) {
    GrappleHookMod.oldXYZ = [ 
      ModAPI.player.fishEntity.x,
      ModAPI.player.fishEntity.y,
      ModAPI.player.fishEntity.z,
    ];
    GrappleHookMod.prev = "GROUND";
  }
});

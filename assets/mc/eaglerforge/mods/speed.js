var newspeed = 10

var oldspeed = ModAPI.player.getSpeed()
ModAPI.addEventListener("update", function (){

    if(ModAPI.player.isMoving() == true){
        ModAPI.player.setSpeed({speed: newspeed})
    } else {
        ModAPI.player.setSpeed({speed: oldspeed})
    }
})

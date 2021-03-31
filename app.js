$(function(){
    const child_process = require('child_process');
    const fs = require('fs');
    const regedit = require('regedit');
    regedit.setExternalVBSLocation('resources/regedit/vbs')
    var DIR_FiveM = "";
    var IPServer = "192.168.1.2:30120";
    const Shell = require('node-powershell');

    //Get Directory FiveM
    regedit.list("HKCU\\SOFTWARE\\CitizenFX\\FiveM\\", function(err, result) {
        $.each(result, function(index, data) {
            if (data.values["Last Run Location"].value) {
                DIR_FiveM = data.values["Last Run Location"].value;
                if (fs.existsSync(DIR_FiveM)) {
                    $("#btn_start").prop("disabled", false).removeClass("red green").addClass("green").text("Start FiveM.");
                } else {
                    $("#btn_start").prop("disabled", true).removeClass("red green").addClass("red").text("You haven't installed FiveM.");
                }
                return;
            }
        });
    });

    $("#btn_start").on("click", function(){
        if (fs.existsSync(DIR_FiveM)) {
            $("#btn_start").prop("disabled", true);
            
            StartFiveM();

            setTimeout(function(){
                $("#btn_start").prop("disabled", false);
            }, 2000);
        }
    });

    function StartFiveM(){
        const ps = new Shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        
        ps.addCommand(`start fivem://connect/${IPServer}`);
        ps.invoke().then(output => {
            console.log(output);
        }).catch(err => {
            console.log(err);
        });

    }

});

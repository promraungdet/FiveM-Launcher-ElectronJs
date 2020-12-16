$(function(){
    const child_process = require('child_process');
    const fs = require('fs');
    const regedit = require('regedit');
    regedit.setExternalVBSLocation('resources/regedit/vbs')
    var DIR_FiveM = "";
    var IPServer = "192.168.1.2:30120"

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

    function cmd(cmd, args, cb) {

        var child = child_process.spawn(cmd, args, {
            encoding: 'utf8',
            shell: true
        });

        child.on('error', (error) => {
            console.log(error);
        });

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (data) => {
            data = data.toString();
            console.log(data);
        });

        child.stderr.setEncoding('utf8');
        child.stderr.on('data', (data) => {
            data = data.toString();
            console.log(data);
        });

        child.on('close', (code) => {
            switch (code) {
                case 0:
                    console.log('End.')
                    break;
            }
        });

        if (typeof cb === 'function')
            cb();

    }

    function StartFiveM(){
        var dir_replace = DIR_FiveM.replace("FiveM.app\\", "");
        cmd(`${dir_replace}FiveM.exe`, [`fivem://connect/${IPServer}`], null);
    }

});
var settings = require("./login.json");
var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    autorun: true,
    token: settings.inToken
});

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: settings.sqlhost,
    user: settings.sqluser,
    password: settings.sqlpassword,
    database: settings.sqldatabase,
    stringifyObjects: true
});

bot.on('ready', function() {
    connection.connect();
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent, server) {
    if (message.split(" ")[0] == settings.prefix + "register"){
        var register = true;
        var params = message.split(";");
        var name = params[0].split(" ").slice(1);
        name = name.join(" ");
        var sex = params[1].replace(" ", "");
        if (name.match(/([0-9])\w+/g)){
            bot.sendMessage({
                to: channelID,
                message: "\"" + name + "\"" + " is not a valid name"
            });
            register = false;
        }
        else if (name.length < 2){
            bot.sendMessage({
                to: channelID,
                message: "Your name cannot be shorter than 2 characters"
            });
            register = false;
        }
        else if (name.length > 64){
            bot.sendMessage({
                to: channelID,
                message: "Your name cannot be longer than 64 characters"
            });
            register = false;
        }
        if (sex === undefined){
            bot.sendMessage({
                to: channelID,
                message: "Please define a sex for your character"
            });
            register = false;
        }
        if (sex != "m" && sex != "f"){
            bot.sendMessage({
                to: channelID,
                message: "Please enter a valid sex: [m/f]"
            });
        }
        if (register){
            console.log("true");
            connection.query("SELECT id FROM citizens;", function(err, result){
                result = JSON.stringify(result);
                console.log(result);
                console.log(result.indexOf(userID));
                if (result.indexOf(userID) === -1){
                    connection.query("INSERT INTO citizens VALUES (" + connection.escape(name) + ", " + connection.escape(sex) + ", " + connection.escape(Date.now()) + ", " + "\"to be added\"" + ", " + connection.escape(userID) + ", " + "\"10\"" + ", " + "\"unemployed\"" + ", " + "\"alive\"" + ");", function(err, result){
                        console.log("done")
                        if(err){
                            bot.sendMessage({
                                to: channelID,
                                message: "an error has occured, please try again"
                            });
                            console.log(err);
                        }
                        else {
                            bot.sendMessage({
                                to: channelID,
                                message: JSON.stringify(result)
                            });
                        }
                        console.log(JSON.stringify(result));
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: "You have already registered a character"
                    });
                }
            });
        }
        console.log(name + " - " + sex);
    }
});

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

bot.on('message', function(user, userID, channelID, message, rawEvent, server, serverID) {
    if (!(channelID in bot.directMessages)) {
        if (message.split(" ")[0] === settings.prefix + "deport"){
            if (bot.servers[bot.serverFromChannel(channelID)].members[userID].roles.indexOf("196567540271546369") > -1){
                bot.sendMessage({
                    to: channelID,
                    message: "okay"
                });
                bot.ban({
                    channel: bot.serverFromChannel(channelID),
                    target: message.split(" ")[1]
                });
            }
            else {
                bot.sendMessage({
                    to: channelID,
                    message: "you don't have permission to do this"
                });
            }
        }
    }
});

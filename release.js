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
    if (!(channelID in bot.directMessages)) {
        if (message.split(" ")[0] === settings.prefix + "release"){
            if (bot.servers[bot.serverFromChannel(channelID)].members[userID].roles.indexOf("196738757779652608") > -1){
                connection.query("UPDATE citizens SET status = REPLACE(status, \"imprisoned\", \"alive\") WHERE id = " + connection.escape(message.split(" ")[1]) + ";")
                bot.sendMessage({
                    to: channelID,
                    message: "releasing user..."
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

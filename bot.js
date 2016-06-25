var loginDetails = require("./login.json");
var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    autorun: true,
    token: loginDetails.inToken
});

var prefix = "%";

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function(user, userID, channelID, message, server) {
    if (message === prefix + "hi") {
        bot.sendMessage({
            to: channelID,
            message: "hi"
        });
    }
});

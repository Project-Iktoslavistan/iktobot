var loginDetails = require("./login.json");
var request = require("request");
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
    else if (message.split(" ")[0] === prefix + "poll") {
        var formData = {
            title: "This is a test poll.",
            options: [
                "Option #1",
                "Option #2"
            ],
            multi: true
        }
        var options = {
            url: "http://strawpoll.me/api/v2/polls",
            headers: {
                "Content-Type": "application/json"
            },
            form: formData
        }
        request.post(options, function(err, httpResponse, body){
            console.log(httpResponse);
        });
        bot.sendMessage({
            to: channelID,
            message: "polling..."
        });
    }
});

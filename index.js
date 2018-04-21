const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = "!"

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if (server.queue[0])play(connection, message);
        else connection.disconnect();
    });
}

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function(){
    console.log("Megbaflak");
});

bot.on("message",function(message){
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()){
        case "play":
            if(!args[1]) {
                message.channel.sendMessage("HOL A LINK MI ?!?!");
                return;
            }

            if(!message.member.voiceChannel){
                message.channel.send("Ha nem vagy voice channelben, hogy a fenébe akarol zenét hallgatni MII ?!?!");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] ={
                queue: []
            }; 

            var server = servers[message.guild.id];

            server.queue.push(args[1])

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if(server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.channel.sendMessage("Szar vagy!:poop:");
    };

});
bot.login(process.env.BOT_TOKEN);

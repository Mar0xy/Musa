const { musa, urichk } = require('./../internal/config.js');
const { add, remove, queue } = require('./../internal/queuehandler.js');

async function command(msg, args) {
    if(args[0] === 'play') {
        switch (urichk(args[1])) {
            case 1:
                await add(msg.guild.id, args[1], msg)
                break;
            case 2:
                await add(msg.guild.id, args[1], msg)
                //msg.channel.send(`${args[1]} is a SoundCloud link.`)
                break;
            default:
                msg.channel.send('Sorry, you didn\'t provide a SoundCloud or YouTube link.')
        }
    }
    if(args[0] === 'skip') {
        var connection = musa.voice.connections.find(vc => vc.channel.id === msg.member.voice.channelID);
        if(connection){
            remove(msg, msg.guild.id, connection)
        } else {
            msg.channel.send('Sorry, you aren\'t in a VC with me.')
        }
    }
    if(args[0] === 'queue') {
        
    }
    console.log(args);
}

exports.command = command;
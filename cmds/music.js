const { musa, urichk, pembed, dapi, mstz } = require('./../internal/config');
const { add, remove, queue } = require('./../internal/queuehandler');

async function command(msg, args) {
    if(args[0] === 'play') {
        switch (urichk(args[1])) {
            case 1:
                await add(msg.guild.id, args[1], msg)
                break;
            case 2:
                await add(msg.guild.id, args[1], msg)
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
        var guild = queue.find(queues => queues.guid === msg.guild.id);
        if(guild) {
            if(!msg.guild.me.hasPermission([ "MANAGE_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS" ])) return msg.channel.send('I am missing certain permissions. Please make sure you didn\'t uncheck permissions when you added me.')
            var connection = msg.guild.voice.connection;
            var qclon = guild.queue.map((x) => x);
            qclon.splice(0, 1);
            if(qclon.length > 0) {
                const Pagination = new pembed.FieldsEmbed()
                    .setArray(qclon)
                    .setAuthorizedUsers([ msg.author.id ])
                    .setChannel(msg.channel)
                    .setElementsPerPage(5)
                    .setDisabledNavigationEmojis(['delete'])
                    .formatField(
                        '# - Song',
                        t =>
                            `**${qclon.indexOf(t) + 1}** - [**${t.name}**](${t.url}) requested by **${t.sender}**`
                    );
                Pagination.embed
                    .setTitle('Now Playing...')
                    .setDescription([
                        `[**${guild.queue[0].name}**](${guild.queue[0].url}) requested by **${guild.queue[0].sender}**\nTime: **${mstz(connection.dispatcher.streamTime)}/${mstz(guild.queue[0].time)}**`,
                    ])
                    .setColor(0xFE9257);
                Pagination.build();
            } else {
                if(!msg.guild.me.hasPermission([ "MANAGE_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS" ])) return msg.channel.send('I am missing certain permissions. Please make sure you didn\'t uncheck permissions when you added me.')
                var connection = msg.guild.voice.connection;
                const embed = new dapi.MessageEmbed()
                    .setColor(0xFE9257)
                    .setTitle('Now Playing...')
                    .setDescription([
                        `[**${guild.queue[0].name}**](${guild.queue[0].url}) requested by **${guild.queue[0].sender}**\nTime: **${mstz(connection.dispatcher.streamTime)}/${mstz(guild.queue[0].time)}**`,
                    ])
                msg.channel.send(embed);
            }
        } else {
            msg.channel.send('I am not playing in this guild so there is no queue.')
        }
    }
    if(args[0] === 'pause' && msg.member.hasPermission(["ADMINISTRATOR"]) || args[0] === 'resume' && msg.member.hasPermission(["ADMINISTRATOR"])) {
        var connection = musa.voice.connections.find(vc => vc.channel.id === msg.member.voice.channelID);
        if(connection){
            switch (args[0]) {
                case 'pause':
                    if(!connection.dispatcher.paused){
                        connection.dispatcher.pause();
                        msg.channel.send('Playback has been paused.')
                    } else {
                        msg.channel.send('Playback is already paused.')
                    }
                    break;
                case 'resume':
                    if(connection.dispatcher.paused){
                        connection.dispatcher.resume();
                        msg.channel.send('Playback has been resumed.')
                    } else {
                        msg.channel.send('Playback isn\'t paused.')
                    }
                    break;
                default:
                    console.log('An Error Occured.')
            }
        } else {
            msg.channel.send('Sorry, you aren\'t in a VC with me.')
        }
    }
    console.log(args);
}

exports.command = command;
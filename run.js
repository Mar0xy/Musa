const { token, prefix, musa } = require('./internal/config');
const { queue } = require('./internal/queuehandler');

musa.on('ready', () => {
    console.log(`Logged in as ${musa.user.tag}`)
    musa.user.setPresence({ activity: { name: `${musa.guilds.cache.size} Servers | Prefix: m?`, type: 'WATCHING' } })
    var staint = 1
    musa.setInterval(() => {
        if(staint === 0) {
            staint++
            musa.user.setPresence({ activity: { name: `${musa.guilds.cache.size} Servers | Prefix: m?`, type: 'WATCHING' } })
        } else {
            staint--
            musa.user.setPresence({ activity: { name: `${musa.users.cache.size} Users | Prefix: m?`, type: 'LISTENING' } })
        }
    }, 30000)
});

musa.on('voiceStateUpdate', (oldState, newState) => {
    if(newState.guild.me.voice.channel && newState.guild.me.voice.channel.members.size === 1){
        newState.guild.me.voice.channel.leave()
    }
    if(oldState.member.user.username === musa.user.username && !newState.member.voice.channel){
        var number = queue.map(function(guild) { return guild.guid; }).indexOf(oldState.guild.id);
        queue.splice(number, 1);
    }
});

function cmdcheck(cmd, msg, args) {
    try {
        const { command } = require(`./cmds/${cmd}`);
        return command(msg, args)
    } catch (e) {
        console.log(e);
        return false
    }
}

musa.on('message', (msg) => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(prefix) !== 0) return;
    if (msg.channel.type === "dm") return;
    if(!msg.guild.me.hasPermission([ "READ_MESSAGE_HISTORY", "EMBED_LINKS" ])) return msg.channel.send('I am missing certain permissions. Please make sure you didn\'t uncheck permissions when you added me.')

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch (cmd) {
        case 'music':
            cmdcheck(cmd, msg, args)
            break;
        case 'help':
            cmdcheck(cmd, msg, args)
            break;
        case 'info':
            cmdcheck(cmd, msg, args)
            break;
        default:
            msg.channel.send('That command doesn\'t exist.');
    }
})

musa.login(token);
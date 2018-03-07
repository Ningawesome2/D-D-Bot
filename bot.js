var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
var game = {}
const players = ['Phantasy146','smada','Logan\'s Login', 'omarmonkeyface']
const general = '410826556244623372'
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
				break;
            case('game'):
				args = args[0]
				try {
					var mon = args.slice(0,2);
					var day = args.slice(2,4);
					var year = args.slice(4,6);
				}
				catch(err){
					bot.sendMessage({
						to: channelID,
						message: 'Error. Remember to input date like: \'MMDDYY\''
					});
					break;
				}
				var deletion = false
				var warning = false
				let date = new Date()
				date.setMonth(parseInt(mon)-1)
				date.setDate(parseInt(day))
				date.setYear(parseInt(year) + 2000)
				date.setSeconds(0)
				date.setHours(19)
				date.setMinutes(0)
				game.time = date.getTime()
				players.forEach(player => {
					game[player] = null
				});
				bot.sendMessage({
					to: channelID,
					message: 'Game created for: ' + new Date(game.time)
				});
				break;
			case('view'):
				if (new Date(game.time) == "Invalid Date"){
					var mssage = "Game not created. Type !game to create one."
				}
				else {
					var mssage = "Game for " + new Date(game.time) + ". "
					players.forEach(player => {
						if(game[player] == true) {
							mssage += player + " has RSVP'D yes. "
						}
						else if (game[player] == false) {
							mssage += player + " has RSVP'D no. "
						}
						else if (game[player] == null){
							mssage += player + " has not RSVP'D. "
						}
					});
				}
				bot.sendMessage({
					to: channelID,
					message: mssage
				});
				break;
			case('rsvp'):
				args = args[0]
				if (args == "y"){
					game[user] = true
				}
				else if (args == "n"){
					game[user] = false
				}
				break;
			case 'cancel':
				game.time = undefined
				players.forEach(player => {
					game[player] = null
				});
				bot.sendMessage({
					to: channelID,
					message: 'Game deleted.'
				});
         }
     }
});
var warning;
setInterval(function(){
	let date = Date.now()
	if (date > game.time && !deletion){
		var deletion = true
		game.time = undefined
		players.forEach(player => {
			game[player] = null
		});
		bot.sendMessage({
			to: general,
			message: "It is time to play, @everyone."
		});
	}
	if ((date - game.time) <= 86400000 && !warning){
		warning = true
		bot.sendMessage({
			to: general,
			message: "We are playing in a day, @everyone."
		});
	}
}, 10000);
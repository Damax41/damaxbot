const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var dispatcher;

client.login(process.env.TOKEN);

client.on("ready", () => {
	console.log(`Le bot est connecté.`); 
	client.user.setActivity("42 || >>help");
});

client.on('guildMemberAdd', (member) => {
	const role = member.guild.roles.cache.get(`413823407709356034`);
	member.roles.add(role);
});

const handleReaction = (reaction, user, add) => {
	if (user.id === `411744198791004162`) {
		return
	}

	const { guild } = reaction.message;

	const role = guild.roles.cache.get(`413823407709356034`);
	const member = guild.membres.cache.find((member) => member.id === user.id);

	if (add) {
		member.roles.add(role);
	} else {
		member.roles.remove(role);
	}
};

client.on(`messageReactionAdd`, async (reaction, user) => {
	if (reaction.message.channel.id === `413713613186924554`) {
		handleReaction(reaction, user, true)
	}
});

client.on("message", async message => {

	if(message.author.bot) return;
  
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const channelLog = client.channels.cache.find(channel => channel.id === "514147891619692544");

	if(command === "help") {
		message.channel.send({embed: {
			color: 130,
			description: `**Liste des commandes :**\n\n\`>>help\`\n *Utilisation: >>help*\n\n\`>>ping\`\n *Utilisation: >>ping*\n\n\`>>say\`\n *Utilisation: >>say La chose à faire dire au bot !*\n\n\`>>poll\`\n *Utilisation : >>poll |Titre du sondage|Proposition 1|Proposition 2|Proposition 3|Proposition 4*\n\n\`>>kick\`\n *Utilisation: >>kick @lenomdumembre#0000 La raison du kick !*\n\n\`>>ban\`\n *Utilisation: >>ban @lenomdumembre#0000 La raison du ban !*\n\n\`>>nuke\`\n *Utilisation: >>nuke Un_nombre_entre_2_et_100*\n\n\`>>warn\`\n *Utilisation: >>warn | @lenomdumembre#0000 La raison du warn !*\n\n\`>>mpto\`\n *Utilisation: >>mpto | @lenomdumembre#0000 Le MP à envoyer*\n\n\`>>play\`\n *Utilisation: >>play URL_de_la_musique*\n\n\`>>pause\`\n *Utilisation: >>pause*\n\n\`>>resume\`\n *Utilisation: >>resume*\n\n\`>>connect\`\n *Utilisation: >>connect*\n\n\`>>disconnect\`\n *Utilisation: >>disconnect*\n\n\`>>report\`\n *Utilisation: >>report @lenomdumembre#0000 La raison du report*\n\n\`>>reportbug\`\n *Utilisation: >>reportbug L'explication du bug report*\n\n\`>>giverole\`\n *Utilisation: >>giverole @lenomdumembre#0000 Le nom du rôle à donner*\n\n\`>>removerole\`\n *Utilisation: >>removerole @lenomdumembre#0000 Le nom du rôle à enlever*`
		}});
	}
 
	if(command === "ping") {
		const m = await message.channel.send("Ping?");
		m.edit({embed: {
			color: 33280,
			description: `Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms.`
		}});
	}
  
	if(command === "say") {
		if(!message.member.hasPermission("ADMINISTRATOR") )
			return message.reply({embed: {
				color: 15700514,
				description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
			}});
		const sayMessage = args.join(" ");
		message.delete().catch(O_o=>{});
		message.channel.send({embed: {
			color: 33410,
			description: sayMessage
		}});
	}
  
	if(command === "kick") {
		if(!message.member.hasPermission("KICK_MEMBERS") )
			return message.reply({embed: {
				color: 15700514,
				description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
			}});

		let member = message.mentions.members.first();
		if(!member)
			return message.reply({embed: {
				color: 15700514,
				description: "Mentionnée un membre valide du serveur !"
			}});
		if(!member.kickable) 
			return message.reply({embed: {
				color: 15700514,
				description: "Je ne peux pas kick ce membre, il peut-être un rôle trop haut ou vous n'avez peut-être pas la permission pour."
			}});

		args.shift();
		let reason = args.join(' ');
		if(!reason) reason = "Aucune raison fournie !";
    
		await member.kick(reason)
			.catch(error => message.reply({embed: {
				color: 15700514,
				description: `Désolé ${message.author} je ne peux pas le kick car: ${error}`
			}}));
		channelLog.send({embed: {
			color: 13107200,
			description: `${member.user.tag} à été kick par ${message.author.tag} car: ${reason}`
		}});

	}
  
	if(command === "ban") {
		if(!message.member.hasPermission("BAN_MEMBERS") )
			return message.reply({embed: {
				color: 15700514,
				description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
			}});
    
		let member = message.mentions.members.first();
		if(!member)
			return message.reply({embed: {
				color: 15700514,
				description: "Mentionnée un membre valide du serveur !"
			}});
		if(!member.bannable) 
			return message.reply({embed: {
				color: 15700514,
				description: "Je ne peux pas ban ce membre, il peut-être un rôle trop haut ou vous n'avez peut-être pas la permission pour."
			}});

		args.shift();
		let reason = args.join(' ');
		if(!reason) reason = "Aucune raison fournie !";
    
		await member.ban(reason)
			.catch(error => message.reply({embed: {
				color: 15700514,
				description: `Désolé ${message.author} je ne peux pas le ban car: ${error}`
			}}));
		channelLog.send({embed: {
			color: 13107200,
			description: `${member.user.tag} à été ban par ${message.author.tag} car: ${reason}`
		}});
	}
  
	if(command === "nuke") {
		if(!message.member.hasPermission("MANAGE_MESSAGES") )
			return message.reply({embed: {
				color: 15700514,
				description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
			}});

		const deleteCount = parseInt(args[0], 10);
    
		if(!deleteCount || deleteCount < 1 || deleteCount > 99)
			return message.reply({embed: {
				color: 15700514,
				description: "Mettez un nombre entre 1 et 99 !"
			}});

		message.channel.bulkDelete(deleteCount + 1, true)
			.catch(error => message.reply({embed: {
				color: 15700514,
				description: `Je ne peux pas supprimé les messages car: ${error}`
			}}));
		channelLog.send({embed: {
			color: 13107200,
			description: `${message.author.tag} à supprimé ${deleteCount} messages du channel ${message.channel}.`
		}});
	}

	if(command === "poll") {
		message.delete();		
		if(!message.member.hasPermission("ADMINISTRATOR") )
		return message.reply({embed: {
			color: 15700514,
			description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
		}});
		let diffPropose = message.content.split("|");
		if(diffPropose.length < 4 || diffPropose.length > 6)
			return message.channel.send({embed: {
				color: 15700514,
				description: "Mettez un titre et entre 2 et 4 proposition !",
				footer: {
					icon_url: message.author.avatarURL,
					text: `Pour ${message.author.tag}`
				}
			}});

		else if(diffPropose.length === 4)
			return message.channel.send(`:loudspeaker: **${diffPropose[1]}**`, {embed: {
				color: 130,
				description: `\n:one: **${diffPropose[2]}**\n\n:two: **${diffPropose[3]}**`,
				footer: {
					text: `À vous de choisir !`
				}
			}}).then(message => {
				message.react("1⃣"),
				message.react("2⃣")
			});

		else if(diffPropose.length === 5)
			return message.channel.send(`:loudspeaker: **${diffPropose[1]}**`, {embed: {
				color: 130,
				description: `\n:one: **${diffPropose[2]}**\n\n:two: **${diffPropose[3]}**\n\n:three: **${diffPropose[4]}**`,
				footer: {
					text: `À vous de choisir !`
				}
			}}).then(message => {
				message.react("1⃣"),
				message.react("2⃣"),
				message.react("3⃣")
			});

		else if(diffPropose.length === 6)
			return message.channel.send(`:loudspeaker: **${diffPropose[1]}**`, {embed: {
				color: 130,
				description: `\n:one: **${diffPropose[2]}**\n\n:two: **${diffPropose[3]}**\n\n:three: **${diffPropose[4]}**\n\n:four: **${diffPropose[5]}**`,
				footer: {
					text: `À vous de choisir !`
				}
			}}).then(message => {
				message.react("1⃣"),
				message.react("2⃣"),
				message.react("3⃣"),
				message.react("4⃣")
			});
	}
	
	if(command === "mpto") {
		if(!message.member.hasPermission("ADMINISTRATOR") )
		return message.reply({embed: {
			color: 15700514,
			description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
		}});

		let member = message.mentions.members.first();
		args.shift();
		let texte = args.join(' ');
		message.delete();
		member.send(texte);
		message.channel.send({embed: {
			color: 33280,
			description: `L'envoi a bien été effectué.`
		}});
	}
	
	if(command === "warn") {
		if(!message.member.hasPermission("KICK_MEMBERS") )
		return message.reply({embed: {
			color: 15700514,
			description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
		}});

		let member = message.mentions.members.first();
		args.shift();
		let reason = args.join(" ");
		if(!reason) reason = "Aucune raison fournie !";
		member.send(`📢 WARN 📢 \n` + "Vous avez été warn car: " + reason);
		message.channel.send({embed: {
			color: 33280,
			description: `Le warn a bien été effectué.`
		}});
		channelLog.send({embed: {
			color: 13107200,
			description: `${member.user.tag} à été warn par ${message.author.tag} car: ${reason}`
		}});
	}
/*	
	if(command === "play") {
		let urlMusic = message.content.split(" ");
		
		if(urlMusic.length === 2) {
			if(message.member.voiceChannel) {
				message.member.voiceChannel.join().then(connection => {
					dispatcher = connection.playArbitraryInput(urlMusic[1]);
					
					dispatcher.on("end", e => {
						dispatcher = undefined;
						message.channel.send({embed: {
							color: 33280,
							description: `Fin du son`
						}});
					}).catch(console.log);
				});
			}
			else
				return message.reply({embed: {
				color: 15700514,
				description: "Allez dans un salon vocal !"
			}});
		}
		else
			return message.reply({embed: {
				color: 15700514,
				description: "Mettez des paramètre valide !"
			}});
	}
	
	if(command === "pause") {
		if(dispatcher !== undefined)
			dispatcher.pause();
	}
		
	if(command === "resume") {
		if(dispatcher !== undefined)
			dispatcher.resume();
	}
	
	if(command === "connect") {
		if(message.member.voiceChannel) {
			message.member.voiceChannel.join();
		}
		else
			return message.reply({embed: {
				color: 15700514,
				description: "Allez dans un salon vocal !"
			}});
	}
	
	if(command === "disconnect") {
		message.member.voiceChannel.leave();
	}
*/
	if(command === "report") {
		let member = message.mentions.members.first();
		if(!member)
			return message.reply({embed: {
				color: 15700514,
				description: "Mentionnée un membre valide du serveur !"
			}});

		args.shift();
		let reason = args.join(' ');
		if(!reason) reason = "Aucune raison fournie !";
    
		channelLog.send({embed: {
			color: 13107200,
			description: `${member.user.tag} à été report par ${message.author.tag} car: ${reason}`
		}});
	}
	
	if(command === "reportbug") {
		let reason = args.join(' ');
		if(!reason)
			return message.reply({embed: {
				color: 15700514,
				description: "Veillez donné une explication du bug !"
			}});
    
		channelLog.send({embed: {
			color: 15700514,
			description: `Un bug à été report par ${message.author.tag} et le bug est: ${reason}`
		}});
	}
	
	if(command === "giverole") {
		if(!message.member.hasPermission("ADMINISTRATOR") )
		return message.reply({embed: {
			color: 15700514,
			description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
		}});

  		let rMember = message.mentions.users.first();
 		if(!rMember) return message.reply("Je ne touve ce membre !");

 		args.shift();

  		const roleName = args.join(" ");
  		const { guild } = message;

  		const gRole = guild.roles.cache.find((role) => {
  			return role.name === roleName
  		});
  		if(!gRole) return message.reply(`Je ne trouve pas le rôle ***${roleName}***!`);

  		const member = guild.members.cache.get(rMember.id);
  		if(member.roles.cache.get(gRole.id)) {
  			message.reply(`<@${rMember.id}> à déjà le rôle ***${gRole.name}***`)
  			console.log(gRole)
  		} else {
  			member.roles.add(gRole);
  			message.reply(`Il a maintenant le rôle ***${roleName}***`);

  			try{
    			await rMember.send(`Bravo, tu as maintenant le rôle ***${gRole.name}***`)
  			} catch(e){
    			message.channel.send(`Bravo à <@${rMember.id}>, il a maintenant le rôle ***${gRole.name}***. J'ai essayé de lui envoyé un MP, mais c'est MP son bloqué.`)
  			}
  		}

	}

	if(command === "removerole") {
		if(!message.member.hasPermission("ADMINISTRATOR") )
		return message.reply({embed: {
			color: 15700514,
			description: "Désolé !\nVous n'avez pas la permission pour utiliser cette commande !"
		}});

  		let rMember = message.mentions.users.first();
 		if(!rMember) return message.reply("Je ne touve ce membre !");

 		args.shift();

  		const roleName = args.join(" ");
  		const { guild } = message;

  		const gRole = guild.roles.cache.find((role) => {
  			return role.name === roleName
  		});
  		if(!gRole) return message.reply(`Je ne trouve pas le rôle ***${roleName}***!`);

  		const member = guild.members.cache.get(rMember.id);
  		if(member.roles.cache.get(gRole.id)) {
  			member.roles.remove(gRole);
  			message.reply(`<@${rMember.id}> n'a plus le rôle ***${gRole.name}***`)

  			try{
    			await rMember.send(`Désolé, tu as perdu le rôle ***${gRole.name}***`)
  			} catch(e){
    			message.channel.send(`Ouille, <@${rMember.id}> n'a plus le rôle ***${gRole.name}***. J'ai essayé de lui envoyé un MP, mais c'est MP son bloqué.`)
  			}
  		} else {
  			message.reply(`<@${rMember.id}> n'a pas le rôle ***${roleName}***`);
  		}
  	}
});

//By Damax41 :)

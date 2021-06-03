const filter = (reaction, user) => reaction.emoji.name === settings.ReactionClose && !user.bot;


collector.on("collect", collected => {
	var bvn = new MessageEmbed()
		.setDescription(`Votre ticket a bien été cloturée.`)
		.setFooter(`Ticket bot`)
		.setColor("RANDOM")
		.setTitle(`Ticket cloturée.`)
	// channel_ticket.messages.fetch(bvn)

	channel_ticket.send(bvn)
	channel_ticket.delete({ timeout: 15000 });


	// channel_ticket.setTimeout(() => {
	//     channel_ticket.delete()
	//   }, 15000);
});


const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id == '531137738108305409' && !user.bot;


collector.on("collect", collected => {
	if (!collector.member.hasPermission("BAN_MEMBERS")) return message.channel.send(` :x: Tu n'as pas la permission`).then(msg => msg.delete({ timeout: 5000 }));

	const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

	if (message.member.hasPermission('ADMINISTRATOR') || channel.name === `ticket-${message.author.id}`) {


		channel.messages.fetch().then(async (messages) => {
			const output = messages.array().reverse().map(m => `${new Date(m.createdAt).toLocaleString('fr-fr')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

			let response;
			try {
				response = await sourcebin.create([
					{
						name: ' ',
						content: output,
						languageId: 'text',
					},
				], {
					title: `Chat transcript for ${channel.name}`,
					description: ' ',
				});
			}
			catch (e) {
				return message.channel.send('An error occurred, please try again!');
			}

			const embed = new MessageEmbed()
				.setDescription(`[\`📄 View\`](${response.url})`)
				.setColor('GREEN');
			channel_ticket.send('the transcript is complete. Please click the link below to view the transcript', embed);
		});
	}
})
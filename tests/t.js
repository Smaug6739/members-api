let prefix;
        if(message.channel.type === 'dm' || message.channel.type === 'group') {
          prefix = config.prefix;
        }
        else {
            prefix = await p.findOne({
                guildID: message.guild.id,
              });
              if(!prefix) prefix = config.prefix;
        }  

Setprefix : 

 let prefix = args[1];
        if(!prefix) return message.channel.send(`${config.emoji.error} \`ERREUR\` Veuillez indiquez le nouveau prefix !`);
        if(prefix.length >= 3) return message.channel.send(`${config.emoji.error} \`ERREUR\` Veuillez indiquez un prefix entre 1 et 3 charactères !`);
        
        
    const result = await Prefix.findOne({
        guildID: message.guild.id,
      });
  
      if (result) {
        result.prefix = prefix;
        result.save();
  
        return message.channel.send(`${config.emoji.succes} \`SUCCES\` Mon prefix à bien été modifié en **${prefix}**`)
  
      } else if (!result) {
        const data = new Prefix({
          guildID: message.guild.id,
          prefix: prefix,
        });
        data.save();
  
        return message.channel.send(`${config.emoji.succes} \`SUCCES\` Mon prefix à bien été modifié en **${prefix}**`)
  
      }
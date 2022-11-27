# discord-youtube-music-bot

Discord youtube music bot make for education!

## Getting Started
Note: You already need to have Node js (v16.13.1+) installed!
<pre>
# clone the repo
git clone https://github.com/LouisNmd/BotDiscord.git

# move to the cloned repo
cd BotDiscord

# install package
npm i && npm i -g ts-node

# create .env file
touch .env

# in .env file
TOKEN=XXXXXXXXXXXXXXX(discord token)
YOUTUBE_API=XXXXXXXXXXXXXXX(youtube api v3 token)

# start application
npm start
</pre>

To deploy, we're using this: https://github.com/olipo186/Git-Auto-Deploy

You only have to setup an ssh key using these:

https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=linux

https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

and then modify ~/.ssh/config:

IdentityFile ~/.ssh/BotDiscord

^^^ This should point to the private file you created on the previous step

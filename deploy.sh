#!/bin/bash
cd /home/gabgab/dev/BotDiscord/; sudo docker stop discord_bot && sudo docker rm discord_bot; sudo docker build --tag discord_bot . && sudo docker run --name discord_bot --restart unless-stopped -d discord_bot npm start

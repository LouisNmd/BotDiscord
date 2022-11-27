#!/bin/bash
cd /src/BotDiscord/; sudo docker stop bot_discord && sudo docker rm bot_discord; sudo docker build --tag bot_discord . && sudo docker run --name bot_discord --restart unless-stopped -d bot_discord npm start 

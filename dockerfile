FROM node

#VOLUME /Users/ingrid.taeuber/projects/programming/aether

WORKDIR  /usr/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

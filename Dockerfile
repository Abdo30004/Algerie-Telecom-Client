FROM node:20-alpine

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

RUN npm install

# Bundle app source

COPY . .

# Build the app
RUN npm run build

# Set the environment variable to production
ENV NODE_ENV=production

# Start the app
CMD [ "npm" , "start" ]




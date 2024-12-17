###################
# BUILD FOR LOCAL DEVELOPMENT
###################

#FROM node:20-alpine AS development
FROM node:20 AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install git to be able to install packages from git repositories
# RUN apk add --no-cache git

# Install app dependencies using the `npm ci` command instead of `npm install`
# RUN rm -rf package-lock.json
# RUN npm install
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY --chown=node:node . .

# Generate Prisma client
RUN npx prisma generate

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

# Regenerate Prisma client, as the prisma client is cleared when running `npm ci`
RUN npx prisma generate

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY .env.* ./

# check enviroment to set the right .env file
RUN if [ "$NODE_ENV" = "production" ]; then cp ./.env.production ./.env; else cp ./.env.development ./.env; fi

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# workdir
WORKDIR /dist

# EXPOSE PORT
EXPOSE 3000
CMD [ "node", "main.js" ]

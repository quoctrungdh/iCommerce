FROM node:12-alpine
# Env
ENV TZ Asia/Ho_Chi_Minh

# Set the timezone in docker
RUN apk update && apk add --no-cache tzdata \
   --update-cache \
   --repository https://alpine.global.ssl.fastly.net/alpine/edge/community \
   --repository https://alpine.global.ssl.fastly.net/alpine/edge/main \
   && cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime \
   && echo "Asia/Ho_Chi_Minh" > /etc/timezone \
   && apk del tzdata

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .
COPY yarn.lock .

# Install all Packages
RUN yarn

# Copy all other source code to work directory
ADD . /usr/src/app

# Start
CMD [ "npm", "start" ]
EXPOSE 8080
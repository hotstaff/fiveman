FROM node:10
WORKDIR /usr/src/app
COPY package.json ./
COPY gulpfile.js ./
COPY public/js/index.js ./public/js/
COPY public/js/leastsquare.js ./public/js/

RUN npm install -p --unsafe-perm
COPY . .

ARG PORT
ENV PORT ${PORT:-3002}
EXPOSE $PORT
CMD ["npm", "run", "test"]

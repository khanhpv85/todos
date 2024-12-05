FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install axios tailwindcss @tailwindcss/forms postcss autoprefixer
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]
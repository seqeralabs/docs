####################################################
#
#               FOR DEPLOYING PREVIEW
# docker run -i -t -p 3000:3000 -v ${PWD}:/app test
#
####################################################

FROM node:lts-alpine AS runtime
RUN apk add --no-cache git chromium
WORKDIR /app

# Clone the Seqera docs repo
RUN git clone --depth 1 ://github.com/seqeralabs/docs.git .

# Install dependencies
RUN npm run build

# Run the website DEV SERVER
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD npm start
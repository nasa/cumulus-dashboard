FROM node:14.19.1 as build
WORKDIR /cumulus-dashboard
COPY package.json package-lock.json ./
RUN npm install --no-optional

ARG APIROOT
ARG AUTH_METHOD
ARG AWS_REGION
ARG DAAC_NAME
ARG ENABLE_RECOVERY
ARG HIDE_PDR
ARG KIBANAROOT
ARG LABELS
ARG SERVED_BY_CUMULUS_API
ARG STAGE

COPY . ./

RUN bash -c "echo -e API ROOT IS : $APIROOT"

RUN \
 APIROOT=$APIROOT \
 AUTH_METHOD=$AUTH_METHOD \
 AWS_REGION=$AWS_REGION \
 DAAC_NAME=$DAAC_NAME \
 ENABLE_RECOVERY=$ENABLE_RECOVERY \
 HIDE_PDR=$HIDE_PDR \
 KIBANAROOT=$KIBANAROOT \
 LABELS=$LABELS \
 SERVED_BY_CUMULUS_API=$SERVED_BY_CUMULUS_API \
 STAGE=$STAGE \
 npm run build

FROM nginx:alpine as app
STOPSIGNAL SIGQUIT

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/run-nginx.sh /usr/local/sbin/run-nginx.sh

CMD ["/usr/local/sbin/run-nginx.sh"]

COPY --from=build /cumulus-dashboard/dist/ /usr/share/nginx/html/

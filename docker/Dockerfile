FROM nginx:alpine

STOPSIGNAL SIGQUIT

COPY nginx.conf /etc/nginx/nginx.conf
COPY run-nginx.sh /usr/local/sbin/run-nginx.sh

CMD ["/usr/local/sbin/run-nginx.sh"]

COPY html/ /usr/share/nginx/html/

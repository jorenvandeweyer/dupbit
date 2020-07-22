case $1 in
    'prod'|'production')
        mkdir -p /etc/nginx/conf.d/
        cp nginx.conf /etc/nginx/conf.d/dupbit.server.conf
    ;;
    'dev'|'development'|*)
        mkdir -p /etc/nginx/conf.d/
        cp nginx.conf /etc/nginx/conf.d/dupbit.server.conf
    ;;
esac

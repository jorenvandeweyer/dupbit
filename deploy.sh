case $1 in
    'install')
        mkdir -p /etc/nginx/conf.d/
        cp nginx.conf /etc/nginx/conf.d/dupbit.server.conf
    ;;
esac

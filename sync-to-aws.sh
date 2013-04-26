rsync --verbose  --progress --stats --compress --rsh=/usr/bin/ssh --recursive --times --perms --links --delete --exclude "*bak" --exclude "*~" ~/www/greenglass/* ubuntu@aws:~/www/greenglass/

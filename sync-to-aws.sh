rsync --verbose  --progress --stats --compress --rsh=/usr/bin/ssh --recursive --times --perms --links --delete --exclude "www/fullsize" --exclude "www/images" --exclude "www/terrariums.json" --exclude "*bak" --exclude "*~" --exclude "fullsize/*" --exclude "thumbnails/*" --exclude "dropbox/*" --exclude "node_modules" ~/www/sites/greenglass/* ubuntu@aws:~/www/greenglass/











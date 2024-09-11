git reset --hard
git clean -fd
git fetch && git pull
npm ci
pm2 restart

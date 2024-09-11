git reset --hard
git clean -fd
git fetch && git pull
npm ci
npm run build
pm2 kill
pm2 start
echo 'Скрипт обновления завершен'
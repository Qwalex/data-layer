git reset --hard
git clean -fd
git fetch && git pull
npm ci
npm run build
pm2 restart data-layer

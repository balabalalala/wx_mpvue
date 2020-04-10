cd ../tt-wx-app
rm -rf dist
npm run build
cd ../wxapp-mpvue
npm run prod
cp src/common/sitemap.json ../tt-wx-app/dist
echo "copy sitemap.json completed"
echo 
echo "\033[32mhi $USER, production build completed!!!\033[0m"
echo 

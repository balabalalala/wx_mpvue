cd ../tt-wx-app
rm -rf dist
npm run build-dev
cd ../wxapp-mpvue
npm run dev
echo 
echo "\033[32mhi $USER, development build completed!!!\033[0m"
echo 

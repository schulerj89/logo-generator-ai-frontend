echo "Pulling the latest changes from the repository..."
git pull

echo "Stopping the current pm2 process..."
pm2 stop nextjs-app

echo "Installing the dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Restarting the pm2 process..."
pm2 restart nextjs-app

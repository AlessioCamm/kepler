#!/usr/bin/env bash
set -e

PI="kepler"
PI_PATH="/home/alessio/apps/kepler"

echo "🔨 Build backend..."
(cd backend && npm run build)

echo "🔨 Build frontend..."
(cd frontend && npm run build)

echo "📤 Deploy backend..."
rsync -avz --delete \
  backend/dist \
  backend/package.json \
  backend/package-lock.json \
  "${PI}:${PI_PATH}/backend/"

echo "📤 Deploy frontend..."
rsync -avz --delete \
  frontend/dist/ \
  "${PI}:${PI_PATH}/backend/public/"

echo "📦 Install prod deps..."
ssh "${PI}" "cd ${PI_PATH}/backend && npm install --omit=dev"

echo "🔄 Restart service..."
ssh "${PI}" "sudo systemctl restart kepler-backend"

echo "✅ Deployed."

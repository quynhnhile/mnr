#!/bin/sh

# Print environment variables for debugging
echo "DATABASE_URL: $DATABASE_URL"

# Run Prisma migrations
npx prisma migrate dev

# Start the application
exec "$@"

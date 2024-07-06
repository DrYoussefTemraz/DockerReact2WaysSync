# Use the latest Node.js runtime as a parent image
FROM node:18

# Set build arguments for UID and GID
ARG UID
ARG GID

# Add a group and user based on the passed arguments, falling back to defaults
RUN groupadd -g $GID appgroup || groupadd appgroup \
    && useradd -u $UID -g $GID -m -s /bin/bash appuser || useradd -m -s /bin/bash appuser

# Set the working directory in the container
WORKDIR /app

# Ensure the working directory is owned by the app user
RUN chown -R appuser:appgroup /app

# Switch to the app user
USER appuser

# Copy package.json and package-lock.json to the working directory
COPY --chown=appuser:appgroup package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY --chown=appuser:appgroup . .

# Expose the port on which the app will run
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

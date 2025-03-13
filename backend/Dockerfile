FROM python:3.10-alpine

# Install system dependencies needed for Python packages
RUN apk update && apk add --no-cache \
    postgresql-dev \
    gcc \
    python3-dev \
    musl-dev \
    bash \
    curl \
    git \
    vim \
    netcat-openbsd

# Python won't try to write .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
# Python won't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entrypoint script first and set permissions
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Copy the project files
COPY . .

# Use entrypoint script
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
# backend/Dockerfile

# Use official Python base image
FROM python:alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the Django project
COPY . .

# Expose port 8000 for Django
EXPOSE 8000

# Run the Gunicorn (production WSGI server)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

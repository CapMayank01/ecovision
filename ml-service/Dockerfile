# Use official lightweight Python image
FROM python:3.9-slim

# Set working directory inside the container
WORKDIR /code

# Copy the requirements file and install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application code and model assets
COPY . /code

# Expose port 7860 (Hugging Face default port for Spaces)
EXPOSE 7860

# Run FastAPI app with Uvicorn on host 0.0.0.0 and port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

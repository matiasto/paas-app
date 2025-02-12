# PaaS App
Authors: Lotte, Preeti, Robin, Matias

Test

Status: draft

This project aims to provide a platform where researchers can upload and compare their image recognition models. The platform will provide a RESTful API for uploading and comparing models. The platform will also offer a web interface for users to interact with the platform.

### Getting Started
- Clone the repository
- Go to the model_container directory
```bash
    cd model_container/
```
- Build the docker image
```bash
    docker build -t my-flask-model .
```
- Run the docker container
```bash
    docker run -d -p 8001:8001 --name flask_model_container my-flask-model
```
- Check if the container is running by going to http://localhost:8001/
- Should return: "Up and Running"
- Run the front-end app by opening the index.html file in the public directory

### Documentation
- [Architecture](docs/architecture.md)
- [Technical Decisions](docs/technical_decisions.md)


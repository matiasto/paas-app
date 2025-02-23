# PaaS App
Authors: Lotte, Preeti, Robin, Matias


This project aims to provide a app where researchers can upload and compare their image recognition models.
## Comming soon
- The app will provide a RESTful API for uploading and comparing models. 
- The app will provide a way to download and share models.

### Getting Started
- Clone the repository 
```
git clone https://github.com/matiasto/paas-app.git
```

#### Run a model container
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

#### Run the app
- open the file "public/index.html"
- Login / Sign up
- Upload image
- Try out execution with the dummy

### Documentation
- [Architecture](docs/architecture.md)
- [Technical Decisions](docs/technical_decisions.md)


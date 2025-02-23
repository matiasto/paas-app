# Share your Model!

In this documentation we provide you with the starting steps to share your models with us. 

## Step 1. 

Get the template. 
Clone our github repository from https://github.com/matiasto/paas-app 

```
git clone https://github.com/matiasto/paas-app.git

```

## Step 2. Locate the container setup

In the folder model_container you will find our example setup for our model execution.

The Dockerfile provides the instructions to set up a container with a webserver this application can talk to. 
It tells the system to run flask-app.py on start up and installs all the dependencies necessairy for the template and your libraries for your pipeline. 

## Step 3. Edit requirements.txt

Please copy all your requirements your scripts need to analyze an image into the requirements.txt files. 
Ideally with a version number to make shure the dependencis are integratable.
```
# Example 
Flask==3.1.0
```

## Step 4. Customize process_image

The template will take an uploaded image and 2 arguments, save the image temporarily and execute a script as a subprocess. 
```
subprocess.run(["python3", "analyze_image.py", argNr, image_path, slice_id], check=True)
# imiteate the shell execution: python analyze_image.py [argument_nr] [image_path] [slice_id]
```

This offers the ability to integrate your own scipts and execute them as you like. Feel free to adept this to your liking. 

Direct integrations withour a subprocess are also possible. 

## Step 5 Import your scipts

Copy all your needed scripts and other needed files into the "model_container" folder. This should include your model and the logic on how to load it.

## Step 5. Be shure to save and return your output

The template expects the final output image to be under the path \"output_image/final.png\" and it gets sent back to the GUI.  

## Step 6. Build

Build your docker-image using the command:
```
docker build -t [image_name] .
```
And test it by running it:
```
docker run -d -p [container_port]:[local_system_port] --name [model_container_name] [image_name]
```

## Step 7. Test your model.

Add your model to the models object in public/js/main.js. 
Open the public/index.html file and you should be able to use your files with your new setup!.


## Step 8. Share your model

Now we would like you to send either the docker image or the whole model_container with us to integrate it.
MediScanAI would love to integrate your contribution. 
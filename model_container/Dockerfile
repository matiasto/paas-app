FROM python:3.13-slim

WORKDIR /app

COPY requirements_template.txt .
RUN pip install -r requirements_template.txt

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["python", "flask-app.py"]


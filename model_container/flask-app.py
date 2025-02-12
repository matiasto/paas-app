from flask import Flask, request, jsonify
from flask_cors import CORS  # only if you need cross-origin requests

from my_script import do_something


# Enabling CORS if you're calling from a different origin
app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    result = {
        "output": do_something(data["text"])
    }
    return jsonify(result)

@app.route("/", methods=['GET'])
def home():
    return "Up and Running"

@app.route('/message', methods=['GET'])
def funny_message():
    message = "Hi Robin, when are we going to get ramen and beer?"
    return jsonify({"funny_message": message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)


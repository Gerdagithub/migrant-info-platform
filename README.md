# DCIP
Digital Citizenship Integration Platform

## Running Backend
### Initial setup:
```bash
cd migrant-info-platform/backend
python -m venv venv
.\venv\Scripts\activate
pip install django djangorestframework  # If not installed
pip install django-cors-headers         # If not installed
```

### Start:
```bash
cd migrant-info-platform/backend
python manage.py migrate
python manage.py runserver
```

The admin page can be reached at *http://127.0.0.1:8000/admin*.


## Running chatbot server
### Initial setup:
```bash
cd migrant-info-platform/backend/chatbot_service
conda init
source ~/.bashrc
conda create -n chatbot python=3.9
conda activate chatbot
pip install -r requirements.txt
conda install -c pytorch -c nvidia pytorch=2.7.0 cudatoolkit=11.8 faiss-gpu=1.11.0
conda install ipykernel
python -m ipykernel install --user --name chatbot --display-name "Python (chatbot)"
```

### Start:
```bash
cd migrant-info-platform/backend/chatbot_service
conda activate chatbot
uvicorn main:app --reload --port 5000
```

## Run ngrok:
### Initial setup:
1. Log in to [ngrok dashboard](https://dashboard.ngrok.com), and copy your auth token (e.g., `2Xy3Z...9AbC`).
2. Run the following commands to download and set up ngrok:
```
cd migrant-info-platform/backend/chatbot_service
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
./ngrok http 5000
./ngrok config add-authtoken <your token>
./ngrok http 5000
```

### Start:
Start ngrok to expose your local server:
```
cd migrant-info-platform/backend/chatbot_service
~/ngrok http 5000
```

### Access the Chatbot Service:
Once ngrok is running, you will be able to access the chatbot AI logic via a public link. 

1. In your Django chatbot app, update the link used by the chatbot to send queries and receive responses.
2. Copy the public link provided in the _Forwarding_ section of the ngrok interface.

**Example:**

```
Forwarding                    https://f97a-83-171-44-52.ngrok-free.app -> http://localhost:5000
```

The chatbot AI logic can now be accessed through _https://f97a-83-171-44-52.ngrok-free.app_.

## Running Frontend
### Initial setup:
```bash
cd migrant-info-platform/frontend
npm install
npm install axios
npm install bootstrap
```

### Start:
```bash
npm start
```

The home page can be reached at *http://localhost:3000*

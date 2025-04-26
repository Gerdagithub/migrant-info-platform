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
1. Log in at https://dashboard.ngrok.com, copy your auth token (e.g. 2Xy3Z...9AbC).
2. Run:
```
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
./ngrok http 5000
./ngrok config add-authtoken 2w2yyYMQcE1dLLsu6oehTgiVcKM_7NEFMzaC5qchBpJ7zTDhm
./ngrok http 5000
```

### Start:
```
~/ngrok http 5000
```
This lets to reach chatbot service (AI logic) via public link. You will need to change the link in Django chatbot app which is used by chatbot to send queries and get responses. Just copy and paste the link from ngrok interface _Forwarding_ section.
For example:
_Forwarding                    https://f97a-83-171-44-52.ngrok-free.app -> http://localhost:5000  _
The chatbot AI logic is accessible through _https://f97a-83-171-44-52.ngrok-free.app_

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

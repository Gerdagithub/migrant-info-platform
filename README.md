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

#### In another terminal run:
```
~/ngrok http 5000
```
This lets to reach chatbot service (AI logic) via public link


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

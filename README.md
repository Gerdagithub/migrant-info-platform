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

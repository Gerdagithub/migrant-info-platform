# DCIP
Digital Citizenship Integration Platform


To run backend run these commands:

Preparation:
*cd migrant-info-platform/backend*
*python -m venv venv*
*.\venv\Scripts\activate*
*pip install django djangorestframework* // If not installed

Start:
cd backend
.\venv\Scripts\activate  # if using a virtual environment
python manage.py migrate
python manage.py runserver

go to *http://127.0.0.1:8000*

To run frontend run these commands:
Preparation:
*cd frontend*
*npm install*

Start:
*npm start*

go to *http://localhost:3000*
# categories/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('<str:category_slug>/', views.category_detail, name='category_detail'),
]

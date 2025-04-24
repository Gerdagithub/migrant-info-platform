# categories/urls.py
from django.urls import path
from . import views
from .views import CategoryDetailView

urlpatterns = [
    # path('<str:category_slug>/', CategoryDetailView.as_view(), name='CategoryPage'),
    path('<str:slug>/', CategoryDetailView.as_view(), name='category-detail'),
]

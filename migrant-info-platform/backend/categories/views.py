# categories/views.py
from django.shortcuts import render

from django.shortcuts import render, get_object_or_404
from .models import Category

def category_detail(request, category_slug):
    category = get_object_or_404(Category, name__iexact=category_slug)
    return render(request, 'categories/category_detail.html', {'category': category})

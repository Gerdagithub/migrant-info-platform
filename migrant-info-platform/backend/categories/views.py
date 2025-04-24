# categories/views.py
# from django.shortcuts import render

from django.shortcuts import render, get_object_or_404
from .models import Category

# def category_detail(request, category_slug):
#     category = get_object_or_404(Category, name__iexact=category_slug)
#     return render(request, 'categories/category_detail.html', {'category': category})

from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category
from .serializers import CategoryDetailSerializer
from django.shortcuts import get_object_or_404

class CategoryDetailView(APIView):
    def get(self, request, slug):
        category = get_object_or_404(Category, slug=slug)
        serializer = CategoryDetailSerializer(category)
        return Response(serializer.data)

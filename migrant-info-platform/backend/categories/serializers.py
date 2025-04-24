from rest_framework import serializers
from .models import Category, FAQCategory, FAQItem

class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ['question', 'answer']

class FAQCategorySerializer(serializers.ModelSerializer):
    faqs = FAQItemSerializer(many=True, read_only=True)

    class Meta:
        model = FAQCategory
        fields = ['faq_title', 'description', 'faqs']

class CategoryDetailSerializer(serializers.ModelSerializer):
    faq_categories = FAQCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['name', 'slug', 'description', 'faq_categories']

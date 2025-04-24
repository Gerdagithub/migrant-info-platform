# categories/admin.py
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, FAQCategory, FAQItem

# Inline FAQ items inside each FAQCategory
class FAQItemInline(admin.TabularInline):
    model = FAQItem
    extra = 1

# Admin for FAQCategory (will show related questions inline)
class FAQCategoryAdmin(admin.ModelAdmin):
    inlines = [FAQItemInline]
    list_display = ('faq_title',)

# Registering all models
admin.site.register(Category)
admin.site.register(FAQCategory, FAQCategoryAdmin)
admin.site.register(FAQItem)  # Optional to manage FAQItems separately

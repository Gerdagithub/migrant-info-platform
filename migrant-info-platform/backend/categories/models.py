# categories/models.py
from django.db import models

from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)  # NEW FIELD
    description = models.TextField()

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name



class FAQCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="faq_categories")
    faq_title = models.CharField(max_length=100)  # e.g., "Filing taxes", "Tax residency"
    description = models.TextField(blank=True)  # Optional category summary
    
    class Meta:
        verbose_name = "FAQ Category"
        verbose_name_plural = "FAQ Categories"

    def __str__(self):
        return self.faq_title


class FAQItem(models.Model):
    faq_category = models.ForeignKey(FAQCategory, related_name='faqs', on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.TextField()  # You can use RichText if using CKEditor
    # order = models.PositiveIntegerField(default=0)  # Optional: to control order manually

    class Meta:
        verbose_name = "FAQ Item"
        verbose_name_plural = "FAQ Items"

    def __str__(self):
        return self.question

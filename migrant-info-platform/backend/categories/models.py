from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = RichTextField()

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]           # required by SortableAdminMixin

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class FAQCategory(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="faq_categories"
    )
    faq_title   = models.CharField(max_length=100)
    description = RichTextField(blank=True)
    order       = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        verbose_name = "FAQ Category"
        verbose_name_plural = "FAQ Categories"
        ordering = ["order"]         # must be the first field here

    def __str__(self):
        return self.faq_title


class FAQItem(models.Model):
    faq_category = models.ForeignKey(
        FAQCategory,
        related_name="faqs",
        on_delete=models.CASCADE
    )
    question = models.TextField(max_length=255)
    answer   = RichTextField()

    class Meta:
        verbose_name = "FAQ Item"
        verbose_name_plural = "FAQ Items"

    @property
    def category(self):
        return self.faq_category.category

    def __str__(self):
        return self.question

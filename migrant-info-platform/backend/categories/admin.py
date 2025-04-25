from django.contrib import admin
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

from .models import Category, FAQCategory, FAQItem

class FAQItemInline(admin.TabularInline):
    model = FAQItem
    extra = 1

class FAQCategoryInline(SortableInlineAdminMixin, admin.TabularInline):
    model = FAQCategory
    fields = ("faq_title", "description", "order")
    extra = 1
    sortable_field_name = "order"


@admin.register(Category)
class CategoryAdmin(SortableAdminMixin, admin.ModelAdmin):
    ordering = ["name"]            # must match Category.Meta.ordering
    prepopulated_fields = {"slug": ("name",)}
    inlines = [FAQCategoryInline]


@admin.register(FAQCategory)
class FAQCategoryAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display  = ("faq_title", "category", "order")
    list_filter   = ("category",)
    ordering      = ["order"]      
    sortable_fields = ("order",)    # makes “order” column clickable
    inlines       = [FAQItemInline]


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display   = ("question", "faq_category", "category")
    readonly_fields = ("category",)
    fields = (
        "category",     
        "faq_category",
        "question",
        "answer",
    )

    def category(self, obj):
        return obj.faq_category.category
    category.short_description = "Main Category"
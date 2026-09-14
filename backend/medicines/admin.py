from django.contrib import admin

from .models import (
    CatalogDataset,
    CatalogImportBatch,
    CatalogProduct,
    CatalogSourceRecord,
    ChatInteraction,
    EvidenceRecord,
    TrustedSource,
)

# Register your models here.



class TrustedSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'source_id', 'jurisdiction', 'access_method', 'enabled')
    search_fields = ('name', 'source_id')
    list_filter = ('enabled', 'jurisdiction', 'access_method')

admin.site.register(TrustedSource, TrustedSourceAdmin)
class EvidenceRecordAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'source', 'record_id', 'evidence_type', 'active', 'next_review_at')
    search_fields = ('product_name', 'record_id', 'ingredient', 'manufacturer')
    list_filter = ('source', 'evidence_type', 'active', 'next_review_at')
admin.site.register(EvidenceRecord, EvidenceRecordAdmin)


@admin.register(CatalogDataset)
class CatalogDatasetAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "license")
    search_fields = ("name", "code")


@admin.register(CatalogImportBatch)
class CatalogImportBatchAdmin(admin.ModelAdmin):
    list_display = (
        "filename", "dataset", "status", "started_at", "completed_at",
        "rows_received", "rows_accepted", "rows_rejected",
    )
    search_fields = ("filename", "checksum", "dataset__code")
    list_filter = ("dataset", "status")
    list_select_related = ("dataset",)
    readonly_fields = (
        "dataset", "dataset_version", "filename", "checksum", "status",
        "started_at", "completed_at", "rows_received", "rows_accepted",
        "rows_rejected",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CatalogProduct)
class CatalogProductAdmin(admin.ModelAdmin):
    list_display = (
        "brand_name", "generic_name", "strength_text", "dosage_form", "manufacturer",
    )
    search_fields = ("brand_name", "generic_name", "manufacturer")
    list_filter = ("medicine_type", "dosage_form")
    readonly_fields = (
        "brand_name", "generic_name", "strength_text", "dosage_form",
        "manufacturer", "medicine_type", "normalized_brand_name",
        "created_at", "updated_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CatalogSourceRecord)
class CatalogSourceRecordAdmin(admin.ModelAdmin):
    list_display = (
        "import_batch", "row_number", "product", "source_record_id",
        "reconciliation_status",
    )
    search_fields = (
        "source_record_id", "source_slug", "product__brand_name",
        "product__generic_name", "import_batch__filename",
    )
    list_filter = ("reconciliation_status", "import_batch__dataset")
    list_select_related = ("import_batch", "product")
    readonly_fields = (
        "import_batch", "product", "row_number", "source_record_id",
        "source_slug", "raw_row", "reconciliation_status",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ChatInteraction)
class ChatInteractionAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "user_identifier",
        "short_question",
        "short_answer",
        "client_ip",
    )
    search_fields = (
        "question",
        "answer_snippet",
        "user__username",
        "user__email",
        "user__profile__email",
        "user__profile__display_name",
        "client_ip",
    )
    list_filter = ("created_at",)
    readonly_fields = ("created_at", "user", "question", "answer_snippet", "client_ip")
    ordering = ("-created_at",)

    def user_identifier(self, obj):
        profile = getattr(obj.user, "profile", None)
        return profile.email if (profile and profile.email) else (obj.user.email or obj.user.username)

    user_identifier.short_description = "User / Email"

    def short_question(self, obj):
        return obj.question[:70] + ("..." if len(obj.question) > 70 else "")

    short_question.short_description = "Question / Query"

    def short_answer(self, obj):
        return obj.answer_snippet[:70] + ("..." if len(obj.answer_snippet) > 70 else "")

    short_answer.short_description = "AI Response Preview"


















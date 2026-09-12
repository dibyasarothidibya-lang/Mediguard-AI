from django.contrib import admin

from .models import EvidenceRecord, TrustedSource

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


















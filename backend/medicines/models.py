from urllib.parse import urlsplit

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

ALLOWED_SOURCE_HOSTS = {
    "dgda": {"info.dgda.gov.bd"},
    "openfda": {"api.fda.gov"},
    "dailymed": {"dailymed.nlm.nih.gov"},
    "who_alerts": {"www.who.int"},
    "who_listings": {"extranet.who.int"},
    "who_eml": {"www.who.int"},
    "ema": {"www.ema.europa.eu"},
}


class TrustedSource(models.Model):
    ACCESS_METHOD_CHOICES = [
        ("live_api", "Live API"),
        ("downloaded_snapshot", "Downloaded snapshot"),
        ("reviewed_import", "Reviewed import"),
    ]

    source_id = models.SlugField(max_length=50, unique=True)
    name = models.CharField(max_length=150)
    jurisdiction = models.CharField(max_length=30)
    enabled = models.BooleanField(default=False)
    access_method = models.CharField(max_length=30, choices=ACCESS_METHOD_CHOICES)

    def __str__(self):
        return self.name


class EvidenceRecord(models.Model):
    EVIDENCE_TYPE_CHOICES = [
        ("label", "Medicine label"),
        ("registration", "Registration"),
        ("alert", "Product alert"),
        ("product_listing", "Product listing"),
        ("essential_medicine", "Essential medicine"),
    ]
    source_id: int | None
    source = models.ForeignKey(
        TrustedSource,
        on_delete=models.PROTECT,
        related_name="evidence_records",
    )
    record_id = models.CharField(max_length=255)
    product_name = models.CharField(max_length=500)
    evidence_type = models.CharField(max_length=30, choices=EVIDENCE_TYPE_CHOICES)
    ingredient = models.CharField(max_length=500, blank=True)
    strength = models.CharField(max_length=150, blank=True)
    dosage_form = models.CharField(max_length=150, blank=True)
    manufacturer = models.CharField(max_length=500, blank=True)
    batch = models.CharField(max_length=255, blank=True)
    affected_market = models.CharField(max_length=500, blank=True)
    listing_status = models.CharField(max_length=150, blank=True)
    source_version = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    official_url = models.URLField(max_length=2048)
    source_date = models.DateField(null=True, blank=True)
    retrieved_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    next_review_at = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=False)
    def clean(self):
        super().clean()
        errors = {}
        now = timezone.now()
        allowed_hosts = None
        if not self.source_id:
            errors['source'] = "Select a trusted source."
        else:
            try:
                allowed_hosts = ALLOWED_SOURCE_HOSTS.get(self.source.source_id)
                if allowed_hosts is None:
                    errors['source'] = "No approved hostnames are configured for this source."
            except TrustedSource.DoesNotExist:
                errors['source'] = "The selected source does not exist."

        if self.retrieved_at and self.retrieved_at > now:
            errors['retrieved_at'] = "Retrieval time cannot be in the future."

        if self.reviewed_at and self.reviewed_at > now:
            errors['reviewed_at'] = "Review time cannot be in the future."

        if self.next_review_at and not self.reviewed_at:
            errors['reviewed_at'] = "Review time is missing."

        if self.next_review_at and self.reviewed_at and self.next_review_at <= self.reviewed_at:
            errors['next_review_at'] = "Next-review time must be after review time."

        if not self.record_id or not self.record_id.strip():
            errors['record_id'] = "An original source record ID is required."

        if not self.product_name or not self.product_name.strip():
            errors['product_name'] = "A product name is required."

        if not self.content or not self.content.strip():
            errors['content'] = "Evidence content is required."

        if not self.official_url:
            errors['official_url'] = "Enter a valid official HTTPS URL."
        else:
            if any(c.isspace() or c in '\\' or ord(c) < 32 or ord(c) == 127 for c in self.official_url):
                errors['official_url'] = "Enter a valid official HTTPS URL."
            else:
                try:
                    parsed = urlsplit(self.official_url)
                    if (
                        parsed.scheme != 'https'
                        or not parsed.hostname
                        or parsed.username is not None
                        or parsed.password is not None
                        or parsed.port not in (None, 443)
                    ):
                        errors['official_url'] = "Enter a valid official HTTPS URL."
                    elif allowed_hosts and parsed.hostname not in allowed_hosts:
                        errors['official_url'] = "This URL does not belong to the selected source."
                except ValueError:
                    errors['official_url'] = "Enter a valid official HTTPS URL."

        if errors:
            raise ValidationError(errors)



    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["source", "record_id"],
                name="unique_evidence_source_record",
            ),
        ]

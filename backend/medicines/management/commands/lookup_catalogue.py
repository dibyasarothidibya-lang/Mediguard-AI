"""Inspect representative imported medicines without calling Gemini or openFDA."""

import json
from dataclasses import asdict
from django.core.management.base import BaseCommand, CommandError
from medicines.services.catalogue_lookup_service import lookup_catalogue


class Command(BaseCommand):
    help = "Read catalogue candidates by brand name; no external requests or database writes."

    def add_arguments(self, parser):
        parser.add_argument("--name", action="append", required=True, help="Brand name; repeat for up to five names.")
        parser.add_argument("--strength", default="")
        parser.add_argument("--form", dest="dosage_form", default="")
        parser.add_argument("--manufacturer", default="")

    def handle(self, *args, **options):
        names = options["name"]
        if len(names) > 5:
            raise CommandError("Check at most five names per command.")
        if len(names) > 1 and any(options[key] for key in ("strength", "dosage_form", "manufacturer")):
            raise CommandError("Use detail filters with one medicine name at a time.")
        for name in names:
            result = lookup_catalogue(name, **{key: options[key] for key in ("strength", "dosage_form", "manufacturer")})
            self.stdout.write(json.dumps(asdict(result), ensure_ascii=False, indent=2))

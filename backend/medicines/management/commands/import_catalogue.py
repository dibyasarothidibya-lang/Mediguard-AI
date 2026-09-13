"""Preview or apply the first reviewed catalogue import."""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import DatabaseError

from medicines.services.catalogue_import_service import CatalogueCSVError
from medicines.services.catalogue_persistence_service import (
    CatalogueImportError, persist_catalogue, prepare_catalogue,
)


class Command(BaseCommand):
    help = "Preview the catalogue import; add --apply and --reviewed-report to save it."

    def add_arguments(self, parser):
        parser.add_argument("--data-dir", required=True, type=Path)
        parser.add_argument("--apply", action="store_true", help="Write the reviewed CSV pair to PostgreSQL.")
        parser.add_argument("--reviewed-report", type=Path, help="Previously reviewed check_catalogue JSON report.")

    def handle(self, *args, **options):
        if options["apply"] and options.get("reviewed_report") is None:
            raise CommandError("--apply requires --reviewed-report from check_catalogue.")
        try:
            prepared = prepare_catalogue(options["data_dir"])
            report_path = options.get("reviewed_report")
            if report_path is not None:
                reviewed = json.loads(report_path.expanduser().read_text(encoding="utf-8"))
                if not isinstance(reviewed, dict) or reviewed.get("audit_version") != 1:
                    raise CatalogueImportError("Unrecognized reviewed report format.")
                datasets = reviewed.get("datasets", {})
                for code, summary in zip(("kaggle", "mendeley"), prepared.summaries):
                    entry = datasets.get(code, {}) if isinstance(datasets, dict) else {}
                    if not isinstance(entry, dict) or entry.get("sha256") != summary["sha256"]:
                        raise CatalogueImportError("CSV fingerprints differ from the reviewed report. Run and review check_catalogue again.")
            result = persist_catalogue(prepared) if options["apply"] else {"state": "preview", **prepared.summary()}
        except (CatalogueImportError, CatalogueCSVError) as exc:
            raise CommandError(str(exc)) from exc
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            raise CommandError(f"Could not read catalogue inputs or report: {exc}") from exc
        except DatabaseError:
            # Database exceptions may include row contents or connection details.
            raise CommandError("Database operation failed. The import transaction was rolled back; no partial import was saved.") from None
        self.stdout.write(f"Catalogue import: {result['state']}")
        for key, value in result.items():
            if key != "state":
                self.stdout.write(f"  {key}: {value:,}")
        if result["state"] == "preview":
            self.stdout.write("No database records were written. This is a file-based preview, not a database integrity check.")
        elif result["state"] == "already_imported":
            self.stdout.write("Existing source rows, links, and product fields match. No duplicate batches or products were added.")
        else:
            self.stdout.write("Both datasets committed together. Ambiguous source rows are preserved without forced links.")
        self.stdout.write("The openFDA/Gemini chat pipeline was not changed.")

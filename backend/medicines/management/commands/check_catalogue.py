"""Inspect catalogue data without importing products or calling chat services."""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from medicines.services.catalogue_audit_service import build_catalogue_report
from medicines.services.catalogue_import_service import CatalogueCSVError


class Command(BaseCommand):
    help = "Dry-run field checks, duplicate detection, and Kaggle/Mendeley reconciliation."

    def add_arguments(self, parser):
        parser.add_argument(
            "--data-dir", required=True, type=Path,
            help="Raw directory containing kaggle/medicine.csv and mendeley/MENDLY.csv.",
        )
        parser.add_argument(
            "--report", type=Path,
            help="Optional new JSON report path outside the raw directory; never overwrites a file.",
        )

    def handle(self, *args, **options):
        data_dir = options["data_dir"].expanduser().resolve()
        report_path = options.get("report")
        if report_path is not None:
            report_path = report_path.expanduser().resolve()
            if report_path == data_dir or report_path.is_relative_to(data_dir):
                raise CommandError("Save the report outside the raw data directory.")
            if report_path.suffix.lower() != ".json":
                raise CommandError("The report filename must end in .json.")
            if report_path.exists():
                raise CommandError("Report already exists. Choose a new report filename.")
        try:
            report = build_catalogue_report(data_dir)
        except CatalogueCSVError as exc:
            raise CommandError(str(exc)) from exc
        except FileNotFoundError as exc:
            raise CommandError(f"Missing catalogue file: {exc.filename}") from exc
        except UnicodeError as exc:
            raise CommandError("Catalogue files must use UTF-8 encoding.") from exc
        except OSError as exc:
            raise CommandError(f"Could not read catalogue files: {exc}") from exc

        if report_path is not None:
            payload = json.dumps(report, ensure_ascii=False, indent=2)
            try:
                report_path.parent.mkdir(parents=True, exist_ok=True)
                with report_path.open("x", encoding="utf-8", newline="\n") as output:
                    output.write(payload + "\n")
            except OSError as exc:
                raise CommandError(f"Could not save report: {exc}") from exc

        for code, dataset in report["datasets"].items():
            self.stdout.write(f"{code.title()}: {dataset['filename']}")
            self.stdout.write(
                f"  Read: {dataset['rows_read']:,} | Accepted: {dataset['rows_accepted']:,} "
                f"| Rejected: {dataset['rows_rejected']:,}"
            )
            if dataset["rows_read"] == 0:
                self.stdout.write(self.style.WARNING("  This file contains no data rows."))
            for rejection in dataset["rejections"][:10]:
                self.stdout.write(self.style.WARNING(
                    f"  Rejected row {rejection['row_number']}: {'; '.join(rejection['errors'])}"
                ))
            for category, groups in dataset["duplicates"].items():
                self.stdout.write(f"  {category}: {len(groups):,} groups")
                if category in ("repeated_product_keys", "conflicting_source_ids", "conflicting_slugs"):
                    for group in groups[:10]:
                        numbers = ", ".join(str(number) for number in group["row_numbers"][:10])
                        suffix = " ..." if len(group["row_numbers"]) > 10 else ""
                        self.stdout.write(f"    Rows: {numbers}{suffix}")
                    if len(groups) > 10:
                        self.stdout.write("    Showing the first 10 groups only.")
        reconciliation = report["reconciliation"]
        self.stdout.write("Mendeley -> Kaggle (field-valid rows only):")
        for status, count in reconciliation["counts"].items():
            self.stdout.write(f"  {status}: {count:,}")
        correspondence = reconciliation["mendeley_rows_with_exact_six_field_correspondence"]
        self.stdout.write(f"  Rows with exact six-field correspondence: {correspondence:,}")
        review_rows = (row for row in reconciliation["details"] if row["status"] in ("ambiguous", "unmatched"))
        for index, row in enumerate(review_rows):
            if index == 10:
                self.stdout.write("  Showing the first 10 reconciliation issues only.")
                break
            self.stdout.write(
                f"  Mendeley row {row['mendeley_row_number']}: {row['status']} - {row['reason']}"
            )
        if report_path is not None:
            self.stdout.write(f"Full report: {report_path}")
        self.stdout.write("Dry run complete. No database records or original CSV files were changed.")
        self.stdout.write("Matches are catalogue candidates; no products were merged or verified.")

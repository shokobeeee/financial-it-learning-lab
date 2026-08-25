#!/usr/bin/env python3
"""Repository invariants for Financial IT Learning Lab.

Keep this script dependency-free so it can run on every pull request.
It protects the current baseline; stricter checks should be added as review issue #6 is resolved.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def text(path: str) -> str:
    p = ROOT / path
    if not p.is_file():
        fail(f"missing file: {path}")
        return ""
    return p.read_text(encoding="utf-8")


def expect(condition: bool, message: str) -> None:
    if not condition:
        fail(message)


def check_required_files() -> None:
    required = [
        "index.html",
        "README.md",
        "PACKAGE_STANDARD.md",
        "CURRICULUM.md",
        "REFERENCES.md",
        ".github/workflows/pages.yml",
        ".github/workflows/qa.yml",
        ".github/pull_request_template.md",
        "docs/DEVELOPMENT_WORKFLOW.md",
        "linux/index.html",
        "sql/index.html",
        "cobol/index.html",
        "jcl/index.html",
        "cloud/index.html",
        "aws/index.html",
        "gcp/index.html",
        "azure/index.html",
        "financial-war-room/index.html",
    ]
    for path in required:
        expect((ROOT / path).is_file(), f"required file missing: {path}")


def numeric_lab_ids(module: str) -> set[int]:
    body = "\n".join(
        p.read_text(encoding="utf-8") for p in sorted((ROOT / module).glob("labs-*.js"))
    )
    return {int(x) for x in re.findall(r'"id"\s*:\s*(\d+)', body)}


def check_counts() -> None:
    expected20 = set(range(1, 21))
    for module in ("sql", "cobol", "jcl"):
        ids = numeric_lab_ids(module)
        expect(ids == expected20, f"{module}: Lab ids must be exactly 1..20; got {sorted(ids)}")

    zero_base = text("cloud/zero-base.js")
    provider = text("assets/js/cloud-provider-aligned.js")
    expect(len(re.findall(r"(?m)^T\(", zero_base)) == 20, "Cloud Fundamentals canonical zero-base topics must be 20")
    expect(len(re.findall(r"(?m)^T\(", provider)) == 20, "Cloud provider aligned topics must be 20")

    scenarios = "\n".join(
        p.read_text(encoding="utf-8") for p in sorted((ROOT / "financial-war-room").glob("scenarios-*.js"))
    )
    ids = {int(x) for x in re.findall(r'\{"id":(\d+),"title":', scenarios)}
    expect(ids == set(range(1, 13)), f"Financial War Room case ids must be exactly 1..12; got {sorted(ids)}")


def check_progress_contract() -> None:
    home = text("assets/js/home-v3.js")
    expected = {
        "linux": "linux_lab",
        "sql": "sql_db_lab",
        "cobol": "cobol_lab",
        "jcl": "jcl_batch_lab",
        "cloud": "cloud_lab",
        "aws": "aws_lab",
        "gcp": "gcp_lab",
        "azure": "azure_lab",
    }
    for module, prefix in expected.items():
        expect(prefix in home, f"home progress contract missing prefix for {module}: {prefix}")
    expect("financial_warroom_" in home, "home progress contract missing Financial War Room results")


def check_wiring() -> None:
    required_markers = {
        "linux/index.html": ["integration-bridge.js"],
        "sql/index.html": ["module-package.js", "context-system.js"],
        "cobol/index.html": ["module-package.js", "context-system.js", "integration-context.js"],
        "jcl/index.html": ["module-package.js", "context-system.js", "integration-context.js"],
        "cloud/index.html": ["zero-base.js", "cloud-lab-engine.js", "module-package.js", "context-system.js", "cloud-atlas.js"],
        "aws/index.html": ["cloud-provider-aligned.js", "cloud-lab-engine.js", "cloud-provider-guide.js", "context-system.js", "cloud-atlas.js"],
        "gcp/index.html": ["cloud-provider-aligned.js", "cloud-lab-engine.js", "cloud-provider-guide.js", "context-system.js", "cloud-atlas.js"],
        "azure/index.html": ["cloud-provider-aligned.js", "cloud-lab-engine.js", "cloud-provider-guide.js", "context-system.js", "cloud-atlas.js"],
        "financial-war-room/index.html": ["module-package.js", "context-system.js", "integration-context.js", "warroom-v16.js"],
    }
    for path, markers in required_markers.items():
        body = text(path)
        for marker in markers:
            expect(marker in body, f"{path}: expected wiring marker missing: {marker}")


def check_context_invariants() -> None:
    package = text("PACKAGE_STANDARD.md")
    for marker in ("Concept → Product", "Evidence Diversity", "Wrong Layer Coach", "Start from Zero"):
        expect(marker in package, f"PACKAGE_STANDARD missing invariant: {marker}")

    atlas = text("assets/js/cloud-atlas.js")
    expect("Availability Zone / Failure Domain" in atlas, "Cloud Map must separate Availability Zone as a failure-domain concept")
    expect("Compute管理 / Orchestration" in atlas, "Cloud Map must retain Compute management/orchestration as a separate axis")
    expect("mappingMode:'examples'" in atlas, "Cloud Map must mark SaaS provider rows as examples, not equivalents")
    for forbidden in (
        "aws:'Availability Zone / Auto Scaling'",
        "gcp:'Zone / Managed Instance Group'",
        "azure:'Availability Zone / VM Scale Sets'",
    ):
        expect(forbidden not in atlas, f"Cloud Map reintroduced mixed classification: {forbidden}")

    context = text("assets/js/context-system.js")
    expect("≒ conceptual mapping" in context, "Context system must state conceptual mapping is not equality")


def check_workflow_hygiene() -> None:
    workflows = {p.name for p in (ROOT / ".github/workflows").glob("*.yml")}
    workflows |= {p.name for p in (ROOT / ".github/workflows").glob("*.yaml")}
    allowed = {"pages.yml", "qa.yml"}
    extras = sorted(workflows - allowed)
    expect(not extras, f"temporary/unexpected workflows must not remain on main: {extras}")


class LocalRefParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = "href" if tag in {"a", "link"} else "src" if tag in {"script", "img", "source"} else None
        if not attr:
            return
        values = dict(attrs)
        value = values.get(attr)
        if value:
            self.refs.append(value)


def check_entrypoint_links() -> None:
    entrypoints = [
        "index.html",
        "linux/index.html",
        "sql/index.html",
        "cobol/index.html",
        "jcl/index.html",
        "cloud/index.html",
        "aws/index.html",
        "gcp/index.html",
        "azure/index.html",
        "financial-war-room/index.html",
    ]
    for rel in entrypoints:
        file = ROOT / rel
        parser = LocalRefParser()
        parser.feed(file.read_text(encoding="utf-8"))
        for ref in parser.refs:
            if ref.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "#")):
                continue
            clean = ref.split("#", 1)[0].split("?", 1)[0]
            if not clean:
                continue
            target = (file.parent / clean).resolve()
            try:
                target.relative_to(ROOT.resolve())
            except ValueError:
                fail(f"{rel}: local reference escapes repository: {ref}")
                continue
            expect(target.exists(), f"{rel}: broken local reference: {ref}")


def main() -> int:
    checks = [
        check_required_files,
        check_counts,
        check_progress_contract,
        check_wiring,
        check_context_invariants,
        check_workflow_hygiene,
        check_entrypoint_links,
    ]
    for check in checks:
        check()

    if ERRORS:
        print("Repository QA FAILED")
        for item in ERRORS:
            print(f" - {item}")
        return 1

    print("Repository QA PASSED")
    print(" - required files")
    print(" - Lab/Case counts")
    print(" - progress contract")
    print(" - module wiring")
    print(" - Context/Cloud Map invariants")
    print(" - workflow hygiene")
    print(" - entrypoint local links")
    return 0


if __name__ == "__main__":
    sys.exit(main())

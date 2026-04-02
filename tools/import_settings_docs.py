import re
import html as htmllib
from urllib.request import Request, urlopen
from urllib.parse import quote, unquote
from pathlib import Path
from typing import Dict, Optional, Tuple

BASE = "https://docs.nucular.tech"
FETCH = BASE + "/lib/exe/fetch.php?media="

PAGES = {
    "bluetooth": {"en": "en:bluetooth", "ru": "ru:bluetooth"},
    "cad-models": {"en": "en:cadmodels", "ru": "ru:cadmodels"},
    "onboard-computer": {"en": "en:display:start", "ru": "ru:display:start"},
    "ulight": {"en": "en:ulight", "ru": "ru:ulight"},
    "usb2can": {"en": "en:usb2can", "ru": "ru:usb2can"},
    "firmware": {"en": "en:firmware", "ru": "ru:firmware"},
    "motor-information": {"en": "en:motor_information", "ru": "ru:motor_information"},
    "connection-schematic": {"en": "en:controller:schematic", "ru": "ru:controller:schematic"},
    "controller-setup": {"en": "en:controller:setup", "ru": "ru:controller:setup"},
    "controller-config-files": {"en": "en:controller:config-files", "ru": "ru:controller:config-files"},
    "controller-diagnostics": {"en": "en:controller:diagnostics", "ru": "ru:controller:diagnostics"},
    "controller-examples": {"en": "en:controller:examples", "ru": "ru:controller:examples"},
    "controller-light-fan-pwm": {"en": "en:controller:light-fan-pwm", "ru": "ru:controller:light-fan-pwm"},
}

UA = {"User-Agent": "Mozilla/5.0"}


def get(url: str, timeout: int = 60) -> bytes:
    return urlopen(Request(url, headers=UA), timeout=timeout).read()


def safe_name(name: str) -> str:
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-")
    return name or "file"


def extract_media(value: str) -> Optional[str]:
    value = htmllib.unescape(value)
    m = re.search(r"media=([^&]+)", value)
    if not m:
        return None
    return unquote(m.group(1))


def download_media(media: str, dest_path: Path) -> int:
    url = FETCH + quote(media, safe="")
    data = get(url)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    dest_path.write_bytes(data)
    return len(data)


def rewrite_images(slug: str, lang: str, html: str, out_root: Path) -> Tuple[str, int]:
    images_dir = out_root / slug / lang / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    seen: Dict[str, str] = {}

    def repl(m: re.Match) -> str:
        prefix, src, suffix = m.group(1), m.group(2), m.group(3)
        media = extract_media(src)
        if not media:
            return m.group(0)
        if media in seen:
            return prefix + seen[media] + suffix
        base_name = safe_name(media.split(":")[-1])
        local = f"/docs/settings-pages/{slug}/{lang}/images/{base_name}"
        dest = images_dir / base_name
        if not dest.exists():
            try:
                download_media(media, dest)
            except Exception:
                return m.group(0)
        seen[media] = local
        return prefix + local + suffix

    rewritten = re.sub(r'(<img[^>]+src=")([^"]+)(")', repl, html, flags=re.I)
    return rewritten, len(seen)


def rewrite_download_links(slug: str, lang: str, html: str, out_root: Path) -> str:
    downloads_dir = out_root / slug / lang / "downloads"
    downloads_dir.mkdir(parents=True, exist_ok=True)

    def repl(m: re.Match) -> str:
        prefix, href, suffix = m.group(1), m.group(2), m.group(3)
        if "fetch.php" not in href or "media=" not in href:
            return m.group(0)
        media = extract_media(href)
        if not media:
            return m.group(0)
        base_name = safe_name(media.split(":")[-1])
        local = f"/docs/settings-pages/{slug}/{lang}/downloads/{base_name}"
        dest = downloads_dir / base_name
        if not dest.exists():
            try:
                download_media(media, dest)
            except Exception:
                return m.group(0)
        return prefix + local + suffix

    return re.sub(r'(<a[^>]+href=")([^"]+)(")', repl, html, flags=re.I)


def generate(slug: str, lang: str, page_id: str, out_root: Path) -> None:
    url = f"{BASE}/doku.php?id={quote(page_id, safe=':')}&do=export_xhtmlbody"
    raw = get(url).decode("utf-8", "ignore")

    html_with_images, img_count = rewrite_images(slug, lang, raw, out_root)
    html_with_downloads = rewrite_download_links(slug, lang, html_with_images, out_root)
    cleaned = re.sub(r'\s+class="sectionedit\d+"', "", html_with_downloads)

    target = out_root / slug / lang / "content.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(cleaned, encoding="utf-8")
    print("generated", slug, lang, "images", img_count, "len", len(cleaned))


def main() -> None:
    out_root = Path("frontend/public/docs/settings-pages")
    out_root.mkdir(parents=True, exist_ok=True)
    for slug, langs in PAGES.items():
        for lang, page_id in langs.items():
            try:
                generate(slug, lang, page_id, out_root)
            except Exception as e:
                print("failed", slug, lang, page_id, type(e).__name__, str(e))


if __name__ == "__main__":
    main()

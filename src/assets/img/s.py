from pathlib import Path
from PIL import Image

WEBP_QUALITY = 78   # 75–80 is a good range for web
WEBP_METHOD = 6     # max compression effort

def convert_and_replace(path: Path):
    webp_path = path.with_suffix(".webp")

    with Image.open(path) as img:
        img.save(
            webp_path,
            format="WEBP",
            quality=WEBP_QUALITY,
            method=WEBP_METHOD
        )

    # Replace only if WebP is smaller
    if webp_path.stat().st_size < path.stat().st_size:
        path.unlink()
    else:
        webp_path.unlink()

def main():
    for file in Path(".").iterdir():
        if file.is_file() and file.suffix.lower() == ".png":
            convert_and_replace(file)

if __name__ == "__main__":
    main()


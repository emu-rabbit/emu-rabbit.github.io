"""從本機私有原圖輸出首屏 WebP；原圖不可加入 repo。需要 Pillow。"""
import argparse
from pathlib import Path

from PIL import Image

CROP = (177.78594374027836, 583.6034228454605, 3567.532029172684, 2726.797722022078)
WIDTHS = (480, 640, 960, 1240, 1600, 2500)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    output = Path(__file__).resolve().parents[1] / "public/assets"
    with Image.open(args.source) as image:
        if image.size != (4032, 3024) or image.getexif().get(274, 1) != 1:
            raise ValueError("需要已核驗的 4032×3024、orientation=1 原圖")
        ratio = (CROP[2] - CROP[0]) / (CROP[3] - CROP[1])
        for width in (*WIDTHS, 48):
            height = round(width / ratio)
            if width > CROP[2] - CROP[0] or height > CROP[3] - CROP[1]:
                raise ValueError("禁止上採樣")
            resized = image.resize((width, height), Image.Resampling.LANCZOS, box=CROP)
            name = "tiny" if width == 48 else str(width)
            target = output / f"window-portrait-{name}.webp"
            # 保留來源 sRGB ICC；不傳遞 EXIF 或 XMP，也不做任何影像增強。
            resized.save(target, "WEBP", quality=84, method=6,
                         icc_profile=image.info.get("icc_profile", b""))
            print(f"{target.name}: {width}×{height}, {target.stat().st_size} bytes")


if __name__ == "__main__":
    main()

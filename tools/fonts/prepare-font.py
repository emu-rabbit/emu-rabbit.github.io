from __future__ import annotations

import argparse
import re
from pathlib import Path

from fontTools.ttLib import TTFont


NAME_IDS = {
    1: "family",
    2: "subfamily",
    3: "unique",
    4: "full",
    6: "postscript",
    16: "family",
    17: "subfamily",
    18: "full",
}


def encode_name(record, value: str) -> bytes:
    try:
        return value.encode(record.getEncoding())
    except (UnicodeEncodeError, LookupError):
        if record.isUnicode():
            return value.encode("utf_16_be")
        return value.encode("latin_1", errors="replace")


def normalize_postscript_name(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9-]", "", value.replace(" ", ""))
    return normalized[:63]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--family", required=True)
    parser.add_argument("--subfamily", default="Regular")
    parser.add_argument("--full-name", required=True)
    parser.add_argument("--postscript-name", required=True)
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)

    values = {
        "family": args.family,
        "subfamily": args.subfamily,
        "full": args.full_name,
        "postscript": normalize_postscript_name(args.postscript_name),
        "unique": f"{args.full_name}; subset for emu-rabbit.github.io",
    }

    font = TTFont(args.input)
    name_table = font["name"]

    for record in name_table.names:
        key = NAME_IDS.get(record.nameID)
        if key is not None:
            record.string = encode_name(record, values[key])

    for platform_id, plat_enc_id, lang_id in ((3, 1, 0x409), (1, 0, 0)):
        for name_id, key in NAME_IDS.items():
            name_table.setName(values[key], name_id, platform_id, plat_enc_id, lang_id)

    font.save(args.output)


if __name__ == "__main__":
    main()

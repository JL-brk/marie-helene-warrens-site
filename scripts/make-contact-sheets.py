from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

root = Path(__file__).resolve().parents[1] / "assets" / "drive-images"
files = sorted(root.glob("*.webp"), key=lambda path: path.name.lower())
out_dir = root / "contact-sheets"
out_dir.mkdir(exist_ok=True)

cols, rows = 4, 5
tile_w, tile_h = 300, 240
label_h = 28
font = ImageFont.load_default(size=16)

for sheet_index in range((len(files) + cols * rows - 1) // (cols * rows)):
    batch = files[sheet_index * cols * rows : (sheet_index + 1) * cols * rows]
    canvas = Image.new("RGB", (cols * tile_w, rows * (tile_h + label_h)), "white")
    draw = ImageDraw.Draw(canvas)

    for index, file in enumerate(batch):
        with Image.open(file) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            image.thumbnail((tile_w - 12, tile_h - 12), Image.Resampling.LANCZOS)
            x = (index % cols) * tile_w + (tile_w - image.width) // 2
            y = (index // cols) * (tile_h + label_h) + (tile_h - image.height) // 2
            canvas.paste(image, (x, y))

        label_y = (index // cols) * (tile_h + label_h) + tile_h + 3
        draw.text(((index % cols) * tile_w + 10, label_y), file.name, fill="#071b33", font=font)

    canvas.save(out_dir / f"photos-{sheet_index + 1}.jpg", quality=88)

print(f"Created {sheet_index + 1} contact sheets in {out_dir}")

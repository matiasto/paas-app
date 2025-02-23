import sys
from PIL import Image, ImageFilter
import os

if len(sys.argv) != 4:
    print("Usage: python analyze_image.py <argNr> <image_path> <slice_id>")
    sys.exit(1)

argNr = sys.argv[1]
image_path = sys.argv[2]
slice_id = sys.argv[3]

# Load the image
image = Image.open(image_path)

# Example processing (apply contour filter)
processed_image = image.filter(ImageFilter.CONTOUR)

# Save the processed image in the output folder
output_path = os.path.join("output_image", os.path.basename(image_path))
processed_image.save(output_path)

print(f"Processed image saved at {output_path}")
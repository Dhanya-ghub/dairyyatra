import os
import numpy as np
from PIL import Image

LOGOS_DIR = r"D:\Dairy Yatra Web\Dairy Yatra\src\assets\logos"
PUBLIC_LOGOS_DIR = r"D:\Dairy Yatra Web\Dairy Yatra\public\logos"

def make_transparent(input_path, output_path, threshold=240, feather=15):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = np.array(img)
        
        r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
        
        # Calculate brightness / whiteness
        # A pixel is considered white if R, G, B are all above threshold
        whiteness = np.minimum(np.minimum(r, g), b)
        
        # Alpha mapping:
        # > threshold: fully transparent (0)
        # < threshold - feather: fully opaque (255)
        # between: smooth linear transition
        
        alpha = np.ones_like(whiteness, dtype=np.float32) * 255.0
        
        # Where whiteness >= threshold -> 0
        mask_white = whiteness >= threshold
        alpha[mask_white] = 0.0
        
        # Where whiteness is between (threshold - feather) and threshold -> ramp down
        mask_blend = (whiteness >= (threshold - feather)) & (whiteness < threshold)
        ramp = 1.0 - (whiteness[mask_blend] - (threshold - feather)) / float(feather)
        alpha[mask_blend] = ramp * 255.0
        
        data[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
        
        result = Image.fromarray(data)
        
        # Auto crop excess transparent borders
        bbox = result.getbbox()
        if bbox:
            result = result.crop(bbox)
            
        result.save(output_path, "PNG", optimize=True)
        print(f"Successfully converted: {os.path.basename(output_path)}")
    except Exception as e:
        print(f"Error converting {input_path}: {e}")

# Process all logos
files_to_process = [
    ("baif.jpg", "baif.png", 235, 20),
    ("coe_baramati.jpg", "coe_baramati.png", 230, 25),
    ("gokul.jpg", "gokul.png", 235, 20),
    ("banas.jpg", "banas.png", 235, 20),
    ("nrcc.webp", "nrcc.png", 235, 20),
    ("nddb.jpg", "nddb.png", 235, 20),
    ("akshayakalpa.webp", "akshayakalpa.png", 235, 20),
    ("prabhat.png", "prabhat.png", 235, 20),
]

for src_name, dst_name, thresh, feat in files_to_process:
    src_file = os.path.join(LOGOS_DIR, src_name)
    dst_file = os.path.join(LOGOS_DIR, dst_name)
    pub_file = os.path.join(PUBLIC_LOGOS_DIR, dst_name)
    
    if os.path.exists(src_file):
        make_transparent(src_file, dst_file, threshold=thresh, feather=feat)
        if os.path.exists(dst_file):
            import shutil
            shutil.copy(dst_file, pub_file)
    else:
        print(f"File not found: {src_file}")

print("All logos processed!")

#!/usr/bin/env python
def generate_base64(img_src):
    from PIL import Image
    from io import BytesIO
    import base64

    img = Image.open(img_src)
    img.thumbnail((16, 16))
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    return str(base64.b64encode(buffer.getvalue()), "utf-8")

# read all images and write a csv with base64 strings
import glob
import pandas as pd

images = pd.DataFrame({'src':glob.glob("./mp_photos/cropped/small/*.jpg")})
images["id"] = images["src"].apply(lambda x: int(x.split("-")[-1].split(".")[0]))
images["base64"] = list(map(generate_base64, images["src"].tolist()))

images[["id", "base64"]].to_csv("mp_base64.csv", index=False)

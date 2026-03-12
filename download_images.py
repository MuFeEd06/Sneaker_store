"""
Claxxic India — Shoe Image Downloader
======================================
Run this script on your computer:
    python download_images.py

It will create all the folders and download images into:
    shoes/nike/
    shoes/adidas/
    shoes/newbalance/
    ... etc.

Requirements:
    pip install requests
"""

import os
import time
import requests

# ── Folder-safe filenames match exactly what's in products.json ──────────────

SHOES = [
    # Nike
    ("shoes/nike",         "nike-air-jordan-1-high.jpg",   "https://images.unsplash.com/photo-1556906781-9a412961a28d?w=600&q=80"),
    ("shoes/nike",         "nike-dunk-low.jpg",             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"),
    ("shoes/nike",         "nike-air-max-90.jpg",           "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80"),
    ("shoes/nike",         "nike-air-force-1.jpg",          "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80"),
    ("shoes/nike",         "nike-react-infinity.jpg",       "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"),
    ("shoes/nike",         "nike-zoomx-vaporfly.jpg",       "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"),

    # Adidas
    ("shoes/adidas",       "adidas-yeezy-350.jpg",          "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80"),
    ("shoes/adidas",       "adidas-superstar.jpg",          "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=600&q=80"),
    ("shoes/adidas",       "adidas-stan-smith.jpg",         "https://images.unsplash.com/photo-1585232351009-aa87416fca95?w=600&q=80"),
    ("shoes/adidas",       "adidas-ultraboost-22.jpg",      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"),
    ("shoes/adidas",       "adidas-forum-low.jpg",          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"),
    ("shoes/adidas",       "adidas-nmd-r1.jpg",             "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"),

    # New Balance
    ("shoes/newbalance",   "nb-550-white.jpg",              "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"),
    ("shoes/newbalance",   "nb-990v5.jpg",                  "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80"),
    ("shoes/newbalance",   "nb-574.jpg",                    "https://images.unsplash.com/photo-1600185652960-9a68caaae6a8?w=600&q=80"),
    ("shoes/newbalance",   "nb-2002r.jpg",                  "https://images.unsplash.com/photo-1556048219-bb6978360b84?w=600&q=80"),

    # Vans
    ("shoes/vans",         "vans-old-skool.jpg",            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"),
    ("shoes/vans",         "vans-sk8-hi.jpg",               "https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600&q=80"),
    ("shoes/vans",         "vans-authentic.jpg",            "https://images.unsplash.com/photo-1465479423260-c4afc24172c6?w=600&q=80"),
    ("shoes/vans",         "vans-slip-on.jpg",              "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80"),

    # Converse
    ("shoes/converse",     "converse-chuck70-hi.jpg",       "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"),
    ("shoes/converse",     "converse-all-star-low.jpg",     "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"),
    ("shoes/converse",     "converse-run-star.jpg",         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"),

    # Puma
    ("shoes/puma",         "puma-rs-x.jpg",                 "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"),
    ("shoes/puma",         "puma-suede.jpg",                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"),
    ("shoes/puma",         "puma-mayze.jpg",                "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80"),
    ("shoes/puma",         "puma-clyde.jpg",                "https://images.unsplash.com/photo-1556906781-9a412961a28d?w=600&q=80"),

    # Reebok
    ("shoes/reebok",       "reebok-classic.jpg",            "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80"),
    ("shoes/reebok",       "reebok-club-c.jpg",             "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=600&q=80"),
    ("shoes/reebok",       "reebok-freestyle.jpg",          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"),

    # Asics
    ("shoes/asics",        "asics-gel-lyte-3.jpg",          "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80"),
    ("shoes/asics",        "asics-gel-nimbus.jpg",          "https://images.unsplash.com/photo-1600185652960-9a68caaae6a8?w=600&q=80"),
    ("shoes/asics",        "asics-gel-kayano.jpg",          "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"),
    ("shoes/asics",        "asics-gt-2000.jpg",             "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"),

    # Skechers
    ("shoes/skechers",     "skechers-dlites.jpg",           "https://images.unsplash.com/photo-1556048219-bb6978360b84?w=600&q=80"),
    ("shoes/skechers",     "skechers-gowalk.jpg",           "https://images.unsplash.com/photo-1465479423260-c4afc24172c6?w=600&q=80"),
    ("shoes/skechers",     "skechers-max-cushioning.jpg",   "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"),

    # On
    ("shoes/on",           "on-cloud-5.jpg",                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"),
    ("shoes/on",           "on-cloudmonster.jpg",           "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80"),
    ("shoes/on",           "on-cloudswift.jpg",             "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80"),

    # Onitsuka
    ("shoes/onitsuka",     "onitsuka-mexico-66.jpg",        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"),
    ("shoes/onitsuka",     "onitsuka-serrano.jpg",          "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=600&q=80"),

    # Lacoste
    ("shoes/lacoste",      "lacoste-lerond.jpg",            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80"),
    ("shoes/lacoste",      "lacoste-gripshot.jpg",          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"),

    # Brooks
    ("shoes/brooks",       "brooks-ghost-15.jpg",           "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80"),
    ("shoes/brooks",       "brooks-adrenaline.jpg",         "https://images.unsplash.com/photo-1600185652960-9a68caaae6a8?w=600&q=80"),

    # Timberland
    ("shoes/timberland",   "timb-6inch.jpg",                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"),
    ("shoes/timberland",   "timb-euro-sprint.jpg",          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80"),

    # Alo
    ("shoes/alo",          "alo-pursuit.jpg",               "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80"),
    ("shoes/alo",          "alo-runner.jpg",                "https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600&q=80"),

    # Brik
    ("shoes/brik",         "brik-classic-low.jpg",          "https://images.unsplash.com/photo-1465479423260-c4afc24172c6?w=600&q=80"),
    ("shoes/brik",         "brik-street-high.jpg",          "https://images.unsplash.com/photo-1556048219-bb6978360b84?w=600&q=80"),

    # Under Armour
    ("shoes/ua",           "ua-charged-assert.jpg",         "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"),
    ("shoes/ua",           "ua-hovr-phantom.jpg",           "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"),

    # Louis Vuitton
    ("shoes/lv",           "lv-trainer.jpg",                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"),
    ("shoes/lv",           "lv-archlight.jpg",              "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80"),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def download_all():
    total = len(SHOES)
    success = 0
    failed = []

    print(f"\n🚀 Downloading {total} shoe images...\n")

    for i, (folder, filename, url) in enumerate(SHOES, 1):
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, filename)

        if os.path.exists(filepath):
            print(f"  [{i:02d}/{total}] ✓ Already exists — {filepath}")
            success += 1
            continue

        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            with open(filepath, "wb") as f:
                f.write(resp.content)
            print(f"  [{i:02d}/{total}] ✅ Downloaded — {filepath}")
            success += 1
        except Exception as e:
            print(f"  [{i:02d}/{total}] ❌ Failed — {filename}: {e}")
            failed.append((folder, filename, url))

        time.sleep(0.15)  # Be polite to the server

    print(f"\n{'='*50}")
    print(f"✅ Success: {success}/{total}")

    if failed:
        print(f"❌ Failed: {len(failed)}")
        print("\nFailed files (you can retry manually):")
        for folder, filename, url in failed:
            print(f"  {folder}/{filename}")
            print(f"  URL: {url}\n")
    else:
        print("🎉 All images downloaded successfully!")

    print(f"\n📁 Copy the 'shoes/' folder into your website root directory.")
    print("   Your folder structure should look like:")
    print("   your-website/")
    print("   ├── index.html")
    print("   ├── products.json")
    print("   ├── script.js")
    print("   ├── style.css")
    print("   └── shoes/")
    print("       ├── nike/")
    print("       ├── adidas/")
    print("       └── ...")

if __name__ == "__main__":
    download_all()

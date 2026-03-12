/* =================================================
   BRAND DEFINITIONS — local logo files
   Save logos to: logo/brands/<filename>.png
================================================= */
const BRANDS = [
    { name: "Nike",          slug: "Nike",          color: "#FF6B35", logo: "logo/brands/nike.png" },
    { name: "Adidas",        slug: "Adidas",        color: "#00B4D8", logo: "logo/brands/adidas.png" },
    { name: "New Balance",   slug: "New Balance",   color: "#4CAF50", logo: "logo/brands/newbalance.png" },
    { name: "Vans",          slug: "Vans",          color: "#FF3CAC", logo: "logo/brands/vans.png" },
    { name: "Converse",      slug: "Converse",      color: "#F72585", logo: "logo/brands/converse.png" },
    { name: "Puma",          slug: "Puma",          color: "#FFD60A", logo: "logo/brands/puma.png" },
    { name: "Reebok",        slug: "Reebok",        color: "#7B2FBE", logo: "logo/brands/reebok.png" },
    { name: "Asics",         slug: "Asics",         color: "#E63946", logo: "logo/brands/asics.png" },
    { name: "Sketchers",     slug: "Sketchers",     color: "#2EC4B6", logo: "logo/brands/sketchers.png" },
    { name: "On",            slug: "On",            color: "#F4A261", logo: "logo/brands/on.png" },
    { name: "Onitsuka",      slug: "Onitsuka",      color: "#C77DFF", logo: "logo/brands/onitsuka.png" },
    { name: "Lacoste",       slug: "Lacoste",       color: "#52B788", logo: "logo/brands/lacoste.png" },
    { name: "Brooks",        slug: "Brooks",        color: "#FF6B6B", logo: "logo/brands/brooks.png" },
    { name: "Timb",          slug: "Timb",          color: "#D4A373", logo: "logo/brands/timb.png" },
    { name: "Brik",          slug: "Brik",          color: "#ADB5BD", logo: "logo/brands/brik.png" },
    { name: "Alo",           slug: "Alo",           color: "#9BF5C8", logo: "logo/brands/alo.png" },
    { name: "Louis Vuitton", slug: "Louis Vuitton", color: "#C9A84C", logo: "logo/brands/louisvuitton.png" },
];

function getBrandConfig(name) {
    return BRANDS.find(b => b.slug.toLowerCase() === name.toLowerCase())
        || { initials: name.slice(0,2).toUpperCase(), color: "#7CFFB2" };
}


/* =================================================
   CART SYSTEM — localStorage persistence
================================================= */

const WHATSAPP_NUMBER = "918606466821"; // ← change to your number

function getCart() {
    return JSON.parse(localStorage.getItem("claxxic_cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("claxxic_cart", JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll("#cart-count").forEach(el => el.textContent = total);
}

function addToCartWithSize() {
    const size = document.getElementById("size-select").value;
    if (!size) { showToast("Please select a size first"); return; }

    const id    = parseInt(localStorage.getItem("productId"));
    const name  = document.getElementById("product-name")?.innerText || "";
    const price = document.getElementById("product-price")?.innerText || "₹0";
    const image = document.getElementById("product-img")?.src || "";
    const brand = name.split(" ")[0];

    // Parse numeric price from "₹18,500"
    const numericPrice = parseInt(price.replace(/[^0-9]/g, "")) || 0;

    const cart = getCart();
    const existing = cart.find(i => i.id === id && i.size === size);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, brand, price: numericPrice, image, size, qty: 1 });
    }

    saveCart(cart);
    showToast(`Added to cart — ${size}`);
}

/* ── TOAST ── */
function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ── FORMAT PRICE ── */
function formatPrice(num) {
    return "₹" + num.toLocaleString("en-IN");
}

/* =================================================
   CART PAGE RENDERING
================================================= */
function renderCartPage() {
    const listEl      = document.getElementById("cart-items-list");
    const emptyEl     = document.getElementById("cart-empty");
    const layoutEl    = document.getElementById("cart-layout");
    const subtitleEl  = document.getElementById("cart-subtitle");

    if (!listEl) return; // Not on cart page

    const cart = getCart();
    updateCartBadge();

    if (cart.length === 0) {
        emptyEl.style.display  = "block";
        layoutEl.style.display = "none";
        if (subtitleEl) subtitleEl.textContent = "";
        return;
    }

    emptyEl.style.display  = "none";
    layoutEl.style.display = "grid";

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    if (subtitleEl) subtitleEl.textContent = `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`;

    listEl.innerHTML = "";
    cart.forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "cart-item fade-in";
        row.innerHTML = `
            <img class="cart-item-img"
                 src="${item.image}"
                 alt="${item.name}"
                 onerror="this.src='https://placehold.co/90x90/111/7CFFB2?text=👟'">

            <div class="cart-item-details">
                <span class="cart-item-brand">${item.brand}</span>
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-size">Size: <span>${item.size}</span></span>
                <span class="cart-item-price">${formatPrice(item.price)}</span>
            </div>

            <div class="cart-item-controls">
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${idx})">Remove</button>
            </div>
        `;
        listEl.appendChild(row);
    });

    updateSummary(cart);
    initScrollAnimation();
}

function changeQty(idx, delta) {
    const cart = getCart();
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(cart);
    renderCartPage();
}

function removeItem(idx) {
    const cart = getCart();
    const removed = cart.splice(idx, 1)[0];
    saveCart(cart);
    showToast(`${removed.name} removed`);
    renderCartPage();
}

function updateSummary(cart) {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

    const countEl    = document.getElementById("summary-count");
    const subtotalEl = document.getElementById("summary-subtotal");
    const totalEl    = document.getElementById("summary-total");
    const waBtn      = document.getElementById("whatsapp-checkout");

    if (countEl)    countEl.textContent    = totalItems;
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl)    totalEl.textContent    = formatPrice(subtotal);

    // Build WhatsApp message
    if (waBtn) {
        let msg = "🛒 *New Order — Claxxic India*\n\n";
        cart.forEach((item, i) => {
            msg += `${i + 1}. *${item.name}*\n`;
            msg += `   Size: ${item.size} | Qty: ${item.qty} | ${formatPrice(item.price * item.qty)}\n\n`;
        });
        msg += `━━━━━━━━━━━━━\n`;
        msg += `*Total: ${formatPrice(subtotal)}*\n`;
        msg += `\nPlease confirm my order! 🙏`;
        waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }
}


/* =================================================
   THREE.JS 3D SNEAKER SCENE (HOMEPAGE ONLY)
================================================= */
const container = document.getElementById("sneaker-container");

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, precision: "mediump" });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let sneaker;
    const loader = new THREE.GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load("sneaker.glb",
        gltf => { sneaker = gltf.scene; sneaker.scale.set(3, 3, 3); scene.add(sneaker); },
        undefined,
        err => console.error("Model loading error:", err)
    );

    camera.position.set(0, 0.8, 12);
    let introAnimation = true, introProgress = 0, floatTime = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener("mousemove", e => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) - 0.5;
        mouseY = ((e.clientY - rect.top) / rect.height) - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (sneaker) {
            if (introAnimation) {
                introProgress += 0.02;
                camera.position.z = 12 - introProgress * 8;
                sneaker.rotation.y += 0.006;
                if (camera.position.z <= 4) { camera.position.z = 4; introAnimation = false; }
            } else {
                sneaker.rotation.y += 0.001 + mouseX * 0.02;
                sneaker.rotation.x = -mouseY * 0.2;
                floatTime += 0.03;
                sneaker.position.y = Math.sin(floatTime) * 0.15;
            }
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}


function getBrandConfig(name) {
    return BRANDS.find(b => b.slug.toLowerCase() === name.toLowerCase())
        || { logo: null, color: "#7CFFB2", name };
}

/* =================================================
   BRAND TILES (HOMEPAGE)
================================================= */
function renderBrandTiles() {
    const grid = document.getElementById("brand-tiles-grid");
    if (!grid) return;
    grid.innerHTML = "";

    BRANDS.forEach((brand, i) => {
        const tile = document.createElement("a");
        tile.className = "brand-tile fade-in";
        tile.href = `brand.html?brand=${encodeURIComponent(brand.slug)}`;
        tile.style.transitionDelay = `${i * 0.04}s`;

        const initials = brand.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

        tile.innerHTML = `
            <div class="brand-tile-icon" style="border:1px solid ${brand.color}44;">
                <img src="${brand.logo}"
                     alt="${brand.name}"
                     class="brand-logo-img"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span class="brand-logo-fallback"
                      style="display:none; color:${brand.color}; font-weight:900; font-size:1.1rem;">
                    ${initials}
                </span>
            </div>
            <span class="brand-tile-name">${brand.name}</span>
            <span class="brand-tile-arrow" style="color:${brand.color}55">→</span>
        `;
        grid.appendChild(tile);
    });

    initScrollAnimation();
}


/* =================================================
   PRODUCT UTILITIES
================================================= */
async function fetchProducts() {
    const res = await fetch("products.json");
    return await res.json();
}

/* =================================================
   RATING SYSTEM
   Deterministic per product ID so rating stays
   consistent across page visits
================================================= */
function getRating(id) {
    // Seeded pseudo-random so same product always gets same rating
    const seed  = (id * 9301 + 49297) % 233280;
    const rand  = seed / 233280;
    // Score between 3.5 and 5.0, one decimal place
    const score = Math.round((3.5 + rand * 1.5) * 10) / 10;
    // Review count between 18 and 420
    const count = 18 + Math.floor(((id * 6271 + 28411) % 233280) / 233280 * 402);
    return { score, count };
}

function buildStars(score, size = "sm") {
    const full  = Math.floor(score);
    const half  = score % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const cls   = `star star-${size}`;
    let html = "";
    for (let i = 0; i < full;  i++) html += `<span class="${cls} star-full">★</span>`;
    if (half)                        html += `<span class="${cls} star-half">★</span>`;
    for (let i = 0; i < empty; i++) html += `<span class="${cls} star-empty">★</span>`;
    return html;
}

function buildProductCard(shoe) {
    const { score, count } = getRating(shoe.id);
    return `
    <div class="card fade-in">
        <img src="${shoe.image}" alt="${shoe.name}"
             onerror="this.src='https://placehold.co/280x180/111/7CFFB2?text=No+Image'">
        <div class="card-info">
            <p class="brand-label">${shoe.brand}</p>
            <h3>${shoe.name}</h3>
            <div class="card-rating">
                <div class="stars">${buildStars(score, "sm")}</div>
                <span class="card-rating-score">${score} (${count})</span>
            </div>
            <span class="price">${formatPrice(shoe.price)}</span>
            <button onclick="openProduct(${shoe.id})">View Product</button>
        </div>
    </div>`;
}


/* =================================================
   TRENDING PRODUCTS (HOMEPAGE)
================================================= */
async function renderTrendingShoes() {
    const grid = document.getElementById("main-product-grid");
    if (!grid) return;

    try {
        const products = await fetchProducts();
        const trending = products.filter(p => p.tag === "trending");
        grid.innerHTML = "";
        trending.forEach(shoe => { grid.innerHTML += buildProductCard(shoe); });
        initScrollAnimation();
    } catch (err) {
        console.error("Failed to load trending shoes:", err);
    }
}


/* =================================================
   BRAND PAGE
================================================= */
async function renderBrandPage() {
    const monogramEl   = document.getElementById("brand-monogram");
    const titleEl      = document.getElementById("brand-title");
    const countEl      = document.getElementById("brand-count");
    const sectionTitle = document.getElementById("brand-section-title");
    const grid         = document.getElementById("brand-product-grid");
    if (!grid) return;

    const params    = new URLSearchParams(window.location.search);
    const brandName = params.get("brand") || "";
    const brandCfg  = getBrandConfig(brandName);

    document.title = `${brandName} — Claxxic India`;

    // Show SVG icon in hero
    if (monogramEl) {
        const initials = brandName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
        monogramEl.style.background = "#111";
        monogramEl.style.border     = `1px solid ${brandCfg.color}44`;
        monogramEl.style.padding    = "14px";
        monogramEl.innerHTML = brandCfg.logo
            ? `<img src="${brandCfg.logo}" alt="${brandName}"
                    style="width:100%;height:100%;object-fit:contain;"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
               <span style="display:none;font-weight:900;color:${brandCfg.color};font-size:1.4rem;">${initials}</span>`
            : `<span style="font-weight:900;color:${brandCfg.color};font-size:1.4rem;">${initials}</span>`;
    }
    if (titleEl)       titleEl.textContent      = brandName;
    if (sectionTitle)  sectionTitle.textContent = `All ${brandName} Styles`;

    try {
        const products = await fetchProducts();
        const filtered = products.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());

        if (countEl) countEl.textContent = filtered.length;

        grid.innerHTML = "";
        if (filtered.length === 0) {
            grid.innerHTML = `<p style="color:#bbb;text-align:center;grid-column:1/-1;padding:60px;">
                No products found for ${brandName}.
            </p>`;
            return;
        }
        filtered.forEach(shoe => { grid.innerHTML += buildProductCard(shoe); });
        initScrollAnimation();
    } catch (err) {
        console.error("Failed to load brand products:", err);
    }
}


/* =================================================
   PRODUCT DESCRIPTION GENERATOR
   Deterministic per product ID — same shoe always
   gets the same description across visits
================================================= */

const DESC_TEMPLATES = {

    comfort: [
        "engineered with responsive foam cushioning that absorbs impact and returns energy with every step",
        "built on a plush midsole that cradles your foot in cloud-like comfort all day long",
        "featuring a padded collar and cushioned insole that keep fatigue at bay during long wear",
        "designed with multi-zone cushioning that adapts to your stride for a personalised fit",
        "equipped with a contoured footbed that provides arch support and all-day softness",
        "constructed with a lightweight foam base that delivers a barely-there feel without sacrificing support",
        "lined with breathable mesh padding that wicks moisture and keeps your feet fresh for hours",
        "built for maximum underfoot comfort with a dual-density midsole that softens every landing",
    ],

    material: [
        "crafted from premium full-grain leather upper that ages beautifully and resists daily wear",
        "made with engineered mesh that offers superior breathability while keeping its structure",
        "constructed from high-abrasion rubber on the outsole for lasting grip on any surface",
        "featuring a reinforced toe cap and heel counter built to handle the demands of daily use",
        "assembled with vulcanised rubber and canvas that deliver timeless durability",
        "built with a seamless knit upper that moves with your foot and resists tearing",
        "using premium suede panels and tonal stitching that speak to quality in every detail",
        "finished with a textured rubber outsole that bites into surfaces for confident traction",
    ],

    style: [
        "its clean silhouette and tonal colourway make it an effortless match for any outfit",
        "the bold profile and contrasting sole unit command attention on the street and off it",
        "a minimalist design language keeps it versatile enough to pair with casual or smart looks",
        "retro-inspired lines and modern proportions give it a timeless appeal that never goes out of style",
        "the sleek low-profile shape transitions seamlessly from the gym to the streets",
        "subtle branding and a refined palette keep the aesthetic understated yet distinctive",
        "oversized panels and a chunky outsole lean into the premium streetwear aesthetic",
        "clean toe box and tonal eyelets give the silhouette a polished, put-together finish",
    ],
};

// Seeded pick — deterministic so same product = same description
function seededPick(arr, seed) {
    return arr[seed % arr.length];
}

function getProductDescription(shoe) {
    const id = shoe.id;

    // Three different seeds for three different template pools
    const s1 = (id * 7919)  % 233280;
    const s2 = (id * 6271 + 1000) % 233280;
    const s3 = (id * 9301 + 49297) % 233280;

    const comfort  = seededPick(DESC_TEMPLATES.comfort,  s1);
    const material = seededPick(DESC_TEMPLATES.material, s2);
    const style    = seededPick(DESC_TEMPLATES.style,    s3);

    // Combine into two natural sentences
    const sentence1 = `The ${shoe.name} is ${comfort}, while ${material}.`;
    const sentence2 = `${style.charAt(0).toUpperCase() + style.slice(1)} — making it a standout addition to any rotation.`;

    return `${sentence1} ${sentence2}`;
}


/* =================================================
   PRODUCT DETAIL PAGE
================================================= */
async function loadProductPage() {
    const nameEl  = document.getElementById("product-name");
    const priceEl = document.getElementById("product-price");
    const imgEl   = document.getElementById("product-img");
    if (!nameEl || !priceEl || !imgEl) return;

    const id = parseInt(localStorage.getItem("productId"));
    try {
        const products = await fetchProducts();
        const shoe = products.find(p => p.id === id);
        if (!shoe) { nameEl.innerText = "Product not found"; return; }

        nameEl.innerText  = shoe.name;
        priceEl.innerText = formatPrice(shoe.price);
        imgEl.src         = shoe.image;
        imgEl.onerror     = () => imgEl.src = "https://placehold.co/400x300/111/7CFFB2?text=No+Image";

        // Update page title
        document.title = `${shoe.name} — Claxxic India`;

        // Inject rating
        const { score, count } = getRating(shoe.id);
        const starsEl  = document.getElementById("rating-stars");
        const scoreEl  = document.getElementById("rating-score");
        const countEl  = document.getElementById("rating-count");
        if (starsEl) starsEl.innerHTML = buildStars(score, "lg");
        if (scoreEl) scoreEl.textContent = score.toFixed(1);
        if (countEl) countEl.textContent = `(${count.toLocaleString()} reviews)`;

        // Inject description
        const descEl = document.querySelector(".description");
        if (descEl) descEl.textContent = getProductDescription(shoe);

        const sizeSelect = document.getElementById("size-select");
        if (sizeSelect && shoe.sizes) {
            sizeSelect.innerHTML = `<option value="">Select Size</option>`;
            shoe.sizes.forEach(s => { sizeSelect.innerHTML += `<option>${s}</option>`; });
        }

        // Render similar products
        renderSimilarProducts(shoe, products);

    } catch (err) {
        console.error("Failed to load product:", err);
        if (nameEl) nameEl.innerText = "Error loading product";
    }
}

/* =================================================
   SIMILAR PRODUCTS
   Logic: same brand first, then fill with similar
   price range (±₹2000), excluding current product,
   max 4 cards total
================================================= */
function renderSimilarProducts(current, allProducts) {
    const section    = document.getElementById("similar-section");
    const grid       = document.getElementById("similar-grid");
    const subtitleEl = document.getElementById("similar-subtitle");
    if (!section || !grid) return;

    const PRICE_RANGE = 2000;
    const MAX = 8;

    // 1. Same brand, exclude current
    const sameBrand = allProducts.filter(p =>
        p.id !== current.id &&
        p.brand.toLowerCase() === current.brand.toLowerCase()
    );

    // 2. Similar price range, exclude current & already picked
    const sameBrandIds = new Set(sameBrand.map(p => p.id));
    const similarPrice = allProducts.filter(p =>
        p.id !== current.id &&
        !sameBrandIds.has(p.id) &&
        Math.abs(p.price - current.price) <= PRICE_RANGE
    );

    // 3. If still not enough, grab any other products as fallback
    const pickedIds = new Set([current.id, ...sameBrand.map(p => p.id), ...similarPrice.map(p => p.id)]);
    const fallback  = allProducts.filter(p => !pickedIds.has(p.id));

    // 4. Shuffle each group so it feels fresh every visit
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    // Fill up to MAX: same brand → price similar → fallback
    const picked = [
        ...shuffle(sameBrand),
        ...shuffle(similarPrice),
        ...shuffle(fallback)
    ].slice(0, MAX);

    if (picked.length === 0) return; // nothing to show

    // Subtitle tells the user why these were picked
    const brandCount = picked.filter(p => p.brand === current.brand).length;
    if (subtitleEl) {
        if (brandCount === picked.length) {
            subtitleEl.textContent = `More from ${current.brand}`;
        } else if (brandCount === 0) {
            subtitleEl.textContent = `Similar price range`;
        } else {
            subtitleEl.textContent = `More from ${current.brand} & similar picks`;
        }
    }

    grid.innerHTML = "";
    picked.forEach(shoe => { grid.innerHTML += buildProductCard(shoe); });

    section.style.display = "block";
    initScrollAnimation();
}


/* =================================================
   SCROLL ANIMATION
================================================= */
function initScrollAnimation() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
    });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

function openProduct(id) {
    localStorage.setItem("productId", id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Small delay so scroll feels intentional before page reload
    setTimeout(() => { window.location.href = "product.html"; }, 150);
}


/* =================================================
   PAGE INITIALIZATION
================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimation();
    updateCartBadge(); // always sync cart count in header

    const onHome    = !!document.getElementById("brand-tiles-grid");
    const onBrand   = !!document.getElementById("brand-product-grid");
    const onProduct = !!document.getElementById("product-name");
    const onCart    = !!document.getElementById("cart-items-list");

    if (onHome)    { renderBrandTiles(); renderTrendingShoes(); }
    if (onBrand)   renderBrandPage();
    if (onProduct) loadProductPage();
    if (onCart)    renderCartPage();
});

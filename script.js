/* =================================================
   CART SYSTEM
================================================= */

let cartCount = 0;

// Increase cart counter
function addToCart() {

    cartCount++;

    const cartUI = document.getElementById("cart-count");

    if (cartUI) {
        cartUI.innerText = cartCount;
    }

}

function addToCartWithSize(){

const size = document.getElementById("size-select").value;

if(size === ""){
alert("Please select a size first");
return;
}

addToCart();

alert("Added to cart (Size: " + size + ")");

}


/* =================================================
   THREE.JS 3D SNEAKER SCENE (HOMEPAGE ONLY)
================================================= */

// Detect if sneaker container exists
const container = document.getElementById("sneaker-container");

if (container) {

    // Create scene
    const scene = new THREE.Scene();

    /* ---------------- CAMERA ---------------- */

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    /* ---------------- RENDERER ---------------- */

   const renderer = new THREE.WebGLRenderer({
    alpha: true, 
    antialias: true,
    precision: "mediump" // Better for mobile performance
});
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    /* ---------------- LIGHTING ---------------- */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);

    scene.add(directionalLight);

    /* ---------------- LOAD MODEL ---------------- */

    let sneaker;

    const loader = new THREE.GLTFLoader();

    loader.load(

        "sneaker.glb",

        function (gltf) {

            sneaker = gltf.scene;

            sneaker.scale.set(3, 3, 3);

            scene.add(sneaker);

        },

        undefined,

        function (error) {
            console.error("Model loading error:", error);
        }

    );

    /* ---------------- CAMERA POSITION ---------------- */

    camera.position.set(0, 0.8, 12);

    /* ---------------- INTRO ANIMATION ---------------- */

    let introAnimation = true;
    let introProgress = 0;
    let floatTime = 0;

    /* ---------------- MOUSE CONTROL ---------------- */

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (event) => {

        const rect = container.getBoundingClientRect();

        mouseX = ((event.clientX - rect.left) / rect.width) - 0.5;
        mouseY = ((event.clientY - rect.top) / rect.height) - 0.5;

    });

    /* ---------------- ANIMATION LOOP ---------------- */

    function animate() {

        requestAnimationFrame(animate);

        if (sneaker) {

            /* Intro zoom animation */

            if (introAnimation) {

                introProgress += 0.02;

                camera.position.z = 12 - introProgress * 8;

                sneaker.rotation.y += 0.006;

                if (camera.position.z <= 4) {

                    camera.position.z = 4;
                    introAnimation = false;

                }

            }

            /* Floating + mouse animation */

            else {

                sneaker.rotation.y += 0.001;

                sneaker.rotation.y += mouseX * 0.02;
                sneaker.rotation.x = -mouseY * 0.2;

                floatTime += 0.03;

                sneaker.position.y = Math.sin(floatTime) * 0.15;

            }

        }

        renderer.render(scene, camera);

    }

    animate();

    /* ---------------- RESPONSIVE ---------------- */

    window.addEventListener("resize", () => {

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);

    });

}



/* =================================================
   TRENDING SHOES DATA
================================================= */

const trendingShoes = [

    { name: "Air Jordan 1 High", price: "₹18,500", image: "trending/shoe1.png" },
    { name: "Adidas Yeezy 350", price: "₹22,000", image: "trending/shoe2.png" },
    { name: "Nike Dunk Low", price: "₹12,000", image: "trending/shoe3.png" },
    { name: "New Balance 550", price: "₹14,500", image: "trending/shoe4.png" },
    { name: "Vans Old Skool", price: "₹5,500", image: "trending/shoe5.png" },
    { name: "Asics Gel-Lyte", price: "₹9,000", image: "trending/shoe6.png" },
    { name: "Puma RS-X", price: "₹8,500", image: "trending/shoe7.png" },
    { name: "Converse Chuck 70", price: "₹6,000", image: "trending/shoe8.png" }

];



/* =================================================
   RENDER TRENDING PRODUCTS
================================================= */

function renderTrendingShoes() {

    const grid = document.getElementById("main-product-grid");

    if (!grid) return;

    grid.innerHTML = "";

    trendingShoes.forEach(shoe => {

        const card = `
        <div class="card fade-in">

            <img src="${shoe.image}" alt="${shoe.name}">

            <div class="card-info">

                <h3>${shoe.name}</h3>

                <p class="price">${shoe.price}</p>

                <button class="buy-btn"
                onclick="openProduct('${shoe.name}','${shoe.price}','${shoe.image}')">
                View Product
                </button>

            </div>

        </div>
        `;

        grid.innerHTML += card;

    });

    initScrollAnimation();

}



/* =================================================
   OPEN PRODUCT PAGE
================================================= */

function openProduct(name, price, image) {

    localStorage.setItem("productName", name);
    localStorage.setItem("productPrice", price);
    localStorage.setItem("productImage", image);

    window.location.href = "product.html";

}



/* =================================================
   LOAD PRODUCT DATA (PRODUCT PAGE)
================================================= */

function loadProductPage() {

    const name = localStorage.getItem("productName");
    const price = localStorage.getItem("productPrice");
    const image = localStorage.getItem("productImage");

    const nameEl = document.getElementById("product-name");
    const priceEl = document.getElementById("product-price");
    const imgEl = document.getElementById("product-img");

    if (nameEl && priceEl && imgEl) {

        nameEl.innerText = name;
        priceEl.innerText = price;
        imgEl.src = image;

    }

}



/* =================================================
   SCROLL ANIMATION
================================================= */

function initScrollAnimation() {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

}



/* =================================================
   PAGE INITIALIZATION
================================================= */

document.addEventListener("DOMContentLoaded", () => {

    renderTrendingShoes();

    loadProductPage();

});
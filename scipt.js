const menuItemsData = [
    {
        name: "Burger Spesial",
        price: 25000,
        image: "burger.jpg"
    },
    {
        name: "Pizza Mantap",
        price: 60000,
        image: "pizza.jpg"
    },
    {
        name: "Salad Segar",
        price: 18000,
        image: "salad.jpg"
    },
    {
        name: "Spaghetti Bolognese",
        price: 35000,
        image: "spaghetti.jpg"
    },
    {
        name: "Es Krim Coklat",
        price: 15000,
        image: "ice-cream.jpg"
    }
];

const menuItemsContainer = document.querySelector(".menu-items");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const clearCartButton = document.getElementById("clear-cart");
const customerNameInput = document.getElementById("customer-name");
const tableNumberInput = document.getElementById("table-number");
const sendToWaButton = document.getElementById("send-to-wa");

let cart = [];

// Menampilkan item menu
function renderMenuItems() {
    menuItemsData.forEach(item => {
        const menuItemDiv = document.createElement("div");
        menuItemDiv.classList.add("menu-item");
        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Rp ${item.price.toLocaleString()}</p>
            <button class="btn btn-primary add-to-cart" data-name="${item.name}">Tambah</button>
        `;
        menuItemsContainer.appendChild(menuItemDiv);
    });

    // Event listener untuk tombol "Tambah"
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.dataset.name;
            addToCart(itemName);

            // Menambahkan class 'clicked' untuk animasi pulsate
            button.classList.add("clicked");
            setTimeout(() => {
                button.classList.remove("clicked");
            }, 500); // Menghapus class 'clicked' setelah 500ms
        });
    });
}

// Menambahkan item ke keranjang
function addToCart(itemName) {
    const item = menuItemsData.find(item => item.name === itemName);
    if (item) {
        const existingItem = cart.find(cartItem => cartItem.name === itemName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        updateCart();
    }
}

// Menghapus item dari keranjang (satu per satu)
function removeFromCart(itemIndex) {
    cart.splice(itemIndex, 1);
    updateCart();
}

// Mengupdate tampilan keranjang dan total harga
function updateCart() {
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;

        const cartItemRow = document.createElement("tr");
        cartItemRow.innerHTML = `
            <td> ${item.name}</td>
            <td>${item.quantity}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>Rp ${subtotal.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-danger remove-from-cart" data-index="${index}">Hapus</button>
            </td>
        `; // Hapus tag <img> dari sini

        // Menambahkan animasi (contoh: fadeIn dan slide dari kiri)
        cartItemRow.style.opacity = 0;
        cartItemRow.style.transform = 'translateX(-20px)';
        cartItemsContainer.appendChild(cartItemRow);

        // Animasi dengan sedikit delay
        setTimeout(() => {
            cartItemRow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cartItemRow.style.opacity = 1;
            cartItemRow.style.transform = 'translateX(0)';
        }, 50 * index); // Delay berdasarkan index item
    });

    totalPriceElement.textContent = totalPrice.toLocaleString();

    // Event listener untuk tombol "Hapus" pada keranjang
    const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");
    removeFromCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemIndex = parseInt(button.dataset.index);
            removeFromCart(itemIndex);
        });
    });
}

// Mengosongkan keranjang
clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
});

// Mengirim data ke WhatsApp
sendToWaButton.addEventListener("click", () => {
    const customerName = customerNameInput.value;
    const tableNumber = tableNumberInput.value;

    if (!customerName || !tableNumber) {
        alert("Harap isi nama pembeli dan nomor meja!");
        return;
    }

    let message = `Pesanan Meja ${tableNumber} a/n ${customerName}:\n`;
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}) x Rp ${item.price.toLocaleString()}\n`;
    });
    message += `Total: Rp ${totalPriceElement.textContent}`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/6285702570795?text=${encodedMessage}`; // Ganti nomor WA di sini
    window.open(waLink, "_blank");
});

// Inisialisasi
renderMenuItems();
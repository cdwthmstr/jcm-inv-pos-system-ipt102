// ===== SIMPLE NAVIGATION FIX =====
(function () {
    "use strict";

    console.log("🔧 Navigation Fix Loading...");

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavigation);
    } else {
        initNavigation();
    }

    function initNavigation() {
        console.log("✅ Initializing Navigation...");

        const navItems = document.querySelectorAll(".nav-item");
        const pages = document.querySelectorAll(".page");

        console.log(
            `Found ${navItems.length} nav items and ${pages.length} pages`,
        );

        if (navItems.length === 0 || pages.length === 0) {
            console.error("❌ Navigation elements not found!");
            return;
        }

        navItems.forEach(function (navItem, index) {
            const pageId = navItem.getAttribute("data-page");
            console.log(`Setting up nav item ${index}: ${pageId}`);

            navItem.addEventListener("click", function (e) {
                e.preventDefault();
                console.log(`🎯 Clicked: ${pageId}`);

                navItems.forEach(function (item) {
                    item.classList.remove("active");
                });

                pages.forEach(function (page) {
                    page.classList.add("hidden");
                });

                navItem.classList.add("active");

                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.remove("hidden");
                    console.log(`✅ Showing page: ${pageId}`);
                } else {
                    console.error(`❌ Page not found: ${pageId}`);
                }
            });
        });

        console.log("✅ Navigation initialized successfully!");
    }
})();

// ===== THEME SETUP =====
const html = document.documentElement;
html.setAttribute("data-theme", "dark");

// ===== DATA MANAGEMENT =====
let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
let cart = [];

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    console.log("💾 Data saved to localStorage");
}

// ===== NOTIFICATION CONTAINER SETUP =====
let notificationContainer = null;

function initNotificationContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement("div");
        notificationContainer.className = "notification-container";
        document.body.appendChild(notificationContainer);
    }
    return notificationContainer;
}

// ===== SUCCESS MESSAGE WITH STACKING =====
function showSuccessMessage(message) {
    const container = initNotificationContainer();

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;

    // Add to container (stacks automatically)
    container.appendChild(successDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        successDiv.classList.add("fade-out");
        setTimeout(() => {
            if (container.contains(successDiv)) {
                container.removeChild(successDiv);
            }

            // Clean up container if empty
            if (container.children.length === 0) {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
                notificationContainer = null;
            }
        }, 300); // Wait for fade-out animation
    }, 3000);
}

// ===== DASHBOARD FUNCTIONS =====
function updateDashboardStats() {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // TODAY'S SALES
    const todaySales = sales.filter((sale) => sale.date === today);
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayTransactions = todaySales.length;

    // MONTHLY SALES
    const monthlySales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
            saleDate.getMonth() === currentMonth &&
            saleDate.getFullYear() === currentYear
        );
    });
    const monthlyTotal = monthlySales.reduce(
        (sum, sale) => sum + sale.total,
        0,
    );

    // YEARLY SALES
    const yearlySales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate.getFullYear() === currentYear;
    });
    const yearlyTotal = yearlySales.reduce((sum, sale) => sum + sale.total, 0);

    // OTHER STATS
    const lowStockProducts = products.filter((product) => product.stock <= 5);
    const pendingDeliveries = deliveries.filter(
        (del) => del.status === "Pending",
    );

    // UPDATE UI
    const statCards = document.querySelectorAll(".stat-card .stat-value");
    if (statCards.length >= 6) {
        statCards[0].textContent = `₱${todayTotal.toFixed(2)}`; // Today's Sales
        statCards[1].textContent = todayTransactions; // Transactions
        statCards[2].textContent = `₱${monthlyTotal.toFixed(2)}`; // Monthly Sales
        statCards[3].textContent = `₱${yearlyTotal.toFixed(2)}`; // Yearly Sales
        statCards[4].textContent = lowStockProducts.length; // Low Stock
        statCards[5].textContent = pendingDeliveries.length; // Pending Deliveries
    }
}

function updateDashboard() {
    updateDashboardStats();
    console.log("📊 Dashboard updated");
}

// ===== PRODUCTS FUNCTIONS =====
function updateProductsTable() {
    const tbody = document.querySelector("#products tbody");
    if (tbody) {
        tbody.innerHTML = products
            .map(
                (product) => `
            <tr>
                <td>#${String(product.id).padStart(3, "0")}</td>
                <td>${product.name}</td>
                <td>${product.sku || ""}</td>
                <td>${product.category || "Uncategorized"}</td>
                <td>₱${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `,
            )
            .join("");
    }
}

function updateProductGrid() {
    const productsGrid = document.querySelector(".products-grid");
    if (productsGrid) {
        productsGrid.innerHTML = products
            .map(
                (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="https://via.placeholder.com/100" alt="${product.name}" />
                <h4>${product.name}</h4>
                <p>₱${product.price.toFixed(2)}</p>
                <p class="stock-info">Stock: ${product.stock}</p>
                <button class="add-to-cart" data-product-id="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
                    ${product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        `,
            )
            .join("");

        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll(".add-to-cart").forEach((btn) => {
            btn.addEventListener("click", function () {
                const productId = parseInt(
                    this.getAttribute("data-product-id"),
                );
                addToCart(productId);
            });
        });

        // Initialize stock display
        updateProductGridStockDisplay();
    }
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) {
        alert("Product not found!");
        return;
    }

    if (product.stock <= 0) {
        alert("Product is out of stock!");
        return;
    }

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        // Calculate total quantity in cart for this product
        const totalInCart = existingItem.quantity;

        if (totalInCart < product.stock) {
            existingItem.quantity++;
            showSuccessMessage(`Added another ${product.name} to cart!`);
        } else {
            alert(`Only ${product.stock} available in stock!`);
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            maxStock: product.stock,
        });
        showSuccessMessage(`${product.name} added to cart!`);
    }

    updateCart();
    updateProductGridStockDisplay(); // Update the visual stock display
}

function updateCart() {
    const cartItems = document.querySelector(".cart-items");
    const totalElement = document.querySelector(".total span:last-child");

    if (!cartItems || !totalElement) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        totalElement.textContent = "₱0.00";
        return;
    }

    cartItems.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" class="btn-remove">×</button>
            </div>
        </div>
    `,
        )
        .join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    totalElement.textContent = `₱${total.toFixed(2)}`;
}

function changeQuantity(productId, change) {
    const cartItem = cart.find((item) => item.id === productId);
    if (!cartItem) return;

    const newQuantity = cartItem.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > cartItem.maxStock) {
        alert(`Only ${cartItem.maxStock} available in stock!`);
        return;
    }

    cartItem.quantity = newQuantity;
    updateCart();
    updateProductGridStockDisplay(); // Update display when quantity changes
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    updateCart();
    updateProductGridStockDisplay(); // Update display when item removed
    showSuccessMessage("Item removed from cart");
}

function clearCart() {
    cart = [];
    updateCart();
    updateProductGridStockDisplay(); // ✅ NEW: Reset stock display when cart cleared
    showSuccessMessage("Cart cleared");
}

// ===== UPDATE PRODUCT GRID STOCK DISPLAY =====
function updateProductGridStockDisplay() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
        const productId = parseInt(card.getAttribute("data-product-id"));
        const product = products.find((p) => p.id === productId);

        if (!product) return;

        // Calculate how many are in cart
        const cartItem = cart.find((item) => item.id === productId);
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        const availableStock = product.stock - quantityInCart;

        // Update the stock display
        const stockInfo = card.querySelector(".stock-info");
        const addButton = card.querySelector(".add-to-cart");

        if (stockInfo) {
            stockInfo.textContent = `Stock: ${availableStock}`;

            // Color coding based on stock level
            if (availableStock <= 0) {
                stockInfo.style.color = "#e74c3c"; // RED
                stockInfo.textContent = "Out of Stock";
            } else if (availableStock <= 3) {
                stockInfo.style.color = "#f39c12"; // YELLOW/ORANGE
            } else {
                stockInfo.style.color = "var(--secondary-text)"; // Normal
            }
        }

        // Update button state
        if (addButton) {
            if (availableStock <= 0) {
                addButton.disabled = true;
                addButton.textContent = "Out of Stock";
            } else {
                addButton.disabled = false;
                addButton.textContent = "Add to Cart";
            }
        }
    });
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    // Deduct stock from products
    cart.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });

    // Save sale
    const sale = {
        id: sales.length > 0 ? Math.max(...sales.map((s) => s.id)) + 1 : 1,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    sales.push(sale);

    // Save and update
    saveData();
    clearCart();
    updateProductGrid();
    updateProductsTable();
    updateDashboard();

    showSuccessMessage(`Sale completed! Total: ₱${sale.total.toFixed(2)}`);
}

// ===== PRODUCT MODAL FUNCTIONS =====
let editingProductId = null;

function openProductModal() {
    const modal = document.querySelector("#products .modal");
    const form = modal.querySelector("form");

    editingProductId = null;
    form.reset();
    modal.querySelector(".modal-header h3").textContent = "Add Product";

    modal.classList.add("active");
}

window.editProduct = function (productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    editingProductId = productId;

    const modal = document.querySelector("#products .modal");
    const form = modal.querySelector("form");

    modal.querySelector(".modal-header h3").textContent = "Edit Product";

    form.name.value = product.name;
    form.description.value = product.description || "";
    form.price.value = product.price;
    form.stock_quantity.value = product.stock;
    form.category.value = product.category || "";
    form.sku.value = product.sku || "";

    modal.classList.add("active");
};

window.deleteProduct = function (productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter((p) => p.id !== productId);
        saveData();
        updateProductsTable();
        updateProductGrid();
        updateDashboard();
        showSuccessMessage("Product deleted successfully!");
    }
};

// ===== DELIVERIES FUNCTIONS =====
function updateDeliveriesTable() {
    const tbody = document.querySelector("#deliveries tbody");
    if (tbody) {
        tbody.innerHTML = deliveries
            .map((delivery) => {
                // ✅ FORMAT TIMESTAMP
                let lastUpdatedText = "N/A";
                if (delivery.lastUpdated) {
                    const date = new Date(delivery.lastUpdated);
                    lastUpdatedText = date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                }

                return `
                    <tr>
                        <td>#${String(delivery.id).padStart(3, "0")}</td>
                        <td>${delivery.supplier}</td>
                        <td>${delivery.date}</td>
                        <td>${delivery.items ? delivery.items.length : 0} items</td>
                        <td><span class="status ${delivery.status.toLowerCase()}">${delivery.status}</span></td>
                        <td style="font-size: 0.75rem; color: var(--secondary-text);">${lastUpdatedText}</td>
                        <td>
                            <button class="btn-edit" onclick="editDelivery(${delivery.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="deleteDelivery(${delivery.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }
}

function populateProductsInDelivery() {
    const productSelect = document.getElementById("productSelect");
    if (productSelect) {
        productSelect.innerHTML =
            '<option value="">Select Product</option>' +
            products
                .map(
                    (product) =>
                        `<option value="${product.id}">${product.name}</option>`,
                )
                .join("");
    }
}

let currentDeliveryItems = [];
let editingDeliveryId = null; // ✅ Track if editing

window.deleteDelivery = function (deliveryId) {
    if (confirm("Are you sure you want to delete this delivery?")) {
        deliveries = deliveries.filter((del) => del.id !== deliveryId);
        saveData();
        updateDeliveriesTable();
        updateDashboard();
        renderNewCalendar();
        showSuccessMessage("Delivery deleted successfully!");
    }
};

// ✅ NEW FUNCTION: Open Add Delivery Modal with pre-filled date
function openAddDeliveryModal(prefillDate = null) {
    const deliveryModal = document.getElementById("deliveryModal");
    if (!deliveryModal) return;

    editingDeliveryId = null; // ✅ RESET to ADD MODE

    // Reset form
    const form = deliveryModal.querySelector("form");
    if (form) form.reset();

    deliveryModal.querySelector(".modal-header h3").textContent =
        "Add New Delivery";

    // ✅ DYNAMICALLY SET BUTTON TEXT
    const submitBtn = deliveryModal.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = "Add Delivery";

    // ✅ PRE-FILL DATE if provided
    if (prefillDate) {
        document.getElementById("deliveryDate").value = prefillDate;
    }

    populateProductsInDelivery();
    currentDeliveryItems = [];
    renderAddedProducts();
    deliveryModal.classList.add("active");
}

window.editDelivery = function (deliveryId) {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery) return;

    editingDeliveryId = deliveryId; // ✅ SET EDITING MODE

    const modal = document.getElementById("deliveryModal");
    populateProductsInDelivery();

    // ✅ UPDATE MODAL TITLE
    modal.querySelector(".modal-header h3").textContent = "Edit Delivery";

    // ✅ DYNAMICALLY SET BUTTON TEXT
    const submitBtn = modal.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = "Update Delivery";

    document.getElementById("supplierName").value = delivery.supplier;
    document.getElementById("deliveryDate").value = delivery.date;
    document.getElementById("deliveryNotes").value = delivery.notes || "";
    document.getElementById("deliveryStatus").value = delivery.status;

    currentDeliveryItems = delivery.items || [];
    renderAddedProducts();

    modal.classList.add("active");
};

function renderAddedProducts() {
    const container = document.getElementById("addedProducts");
    if (!container) return;

    container.innerHTML = currentDeliveryItems
        .map(
            (item, index) => `
        <div class="added-product-item">
            <span>${item.name} - ${item.quantity} ${item.unit}</span>
            <button onclick="removeDeliveryItem(${index})">Remove</button>
        </div>
    `,
        )
        .join("");
}

window.removeDeliveryItem = function (index) {
    currentDeliveryItems.splice(index, 1);
    renderAddedProducts();
};

// ===== CALENDAR FUNCTIONS =====
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// ===== CLICKABLE CALENDAR DAYS WITH HOVER TOOLTIPS =====
function renderNewCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const currentMonthElement = document.getElementById("currentMonth");
    if (!calendarGrid || !currentMonthElement) return;

    calendarGrid.innerHTML = "";

    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayHeaders.forEach((day) => {
        const headerDiv = document.createElement("div");
        headerDiv.className = "calendar-day-header";
        headerDiv.textContent = day;
        calendarGrid.appendChild(headerDiv);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "calendar-day empty";
        calendarGrid.appendChild(emptyDiv);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        dayDiv.textContent = day;

        if (
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth() &&
            day === today.getDate()
        ) {
            dayDiv.classList.add("today");
        }

        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayDeliveries = deliveries.filter((del) => del.date === dateKey);

        if (dayDeliveries.length > 0) {
            // HAS DELIVERY - Click to EDIT
            dayDiv.classList.add("has-event");
            const delivery = dayDeliveries[0];

            // Remove old status classes
            dayDiv.classList.remove(
                "has-pending",
                "has-completed",
                "has-problem",
            );

            // Add correct status class
            if (delivery.status === "Pending") {
                dayDiv.classList.add("has-pending");
            } else if (
                delivery.status === "Completed" ||
                delivery.status === "Received"
            ) {
                dayDiv.classList.add("has-completed");
            } else if (delivery.status === "Problem") {
                dayDiv.classList.add("has-problem");
            }

            // CREATE TOOLTIP
            const tooltip = document.createElement("div");
            tooltip.className = "calendar-tooltip";
            tooltip.innerHTML = `
                <strong>${delivery.supplier}</strong><br>
                <span style="color: var(--secondary-text); font-size: 0.8rem;">${delivery.status}</span><br>
                ${delivery.notes ? `<em style="font-size: 0.75rem;">${delivery.notes}</em>` : ""}
            `;
            dayDiv.appendChild(tooltip);

            // CLICK TO EDIT EXISTING DELIVERY
            dayDiv.style.cursor = "pointer";
            dayDiv.addEventListener("click", () => {
                editDelivery(delivery.id);
            });
        } else {
            // NO DELIVERY - Click to ADD NEW with pre-filled date
            dayDiv.style.cursor = "pointer";
            dayDiv.addEventListener("click", () => {
                openAddDeliveryModal(dateKey); // NEW FUNCTION
            });
        }

        calendarGrid.appendChild(dayDiv);
    }

    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderNewCalendar();
}

// ===== DELIVERY FILTER FUNCTIONALITY =====
let currentFilter = "all";

function filterDeliveriesByStatus(status) {
    currentFilter = status;

    // Update active state ng buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    const activeBtn = document.querySelector(
        `.filter-btn[data-filter="${status}"]`,
    );
    if (activeBtn) {
        activeBtn.classList.add("active");
    }

    // Filter the table rows
    const tbody = document.querySelector("#deliveries tbody");
    if (!tbody) return;

    const today = new Date().toISOString().split("T")[0];

    tbody.innerHTML = deliveries
        .filter((delivery) => {
            if (status === "all") return true;
            if (status === "sent") return delivery.date === today; // CURRENT DATE logic
            return delivery.status.toLowerCase() === status;
        })
        .map(
            (delivery) => `
            <tr>
                <td>#${String(delivery.id).padStart(3, "0")}</td>
                <td>${delivery.supplier}</td>
                <td>${delivery.date}</td>
                <td>${delivery.items ? delivery.items.length : 0} items</td>
                <td><span class="status ${delivery.status.toLowerCase()}">${delivery.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="editDelivery(${delivery.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteDelivery(${delivery.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `,
        )
        .join("");

    if (tbody.innerHTML === "") {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--secondary-text); padding: 2rem;">
                    No deliveries found for this filter
                </td>
            </tr>
        `;
    }
}

// ===== MAIN INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Main App Loading...");

    // Mobile menu
    const mobileMenuToggles = document.querySelectorAll(".mobile-menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    mobileMenuToggles.forEach((toggle) => {
        if (toggle && sidebar) {
            toggle.addEventListener("click", () =>
                sidebar.classList.toggle("active"),
            );
        }
    });

    // Product Modal - Add Product Button
    const addProductBtn = document.querySelector(
        ".products-header .btn-primary",
    );
    if (addProductBtn) {
        addProductBtn.addEventListener("click", function (e) {
            e.preventDefault();
            openProductModal();
        });
    }

    // Product Modal - Form Submission
    const productModal = document.querySelector("#products .modal");
    if (productModal) {
        const form = productModal.querySelector("form");

        // Close button
        const closeBtn = productModal.querySelector(".modal-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                productModal.classList.remove("active");
                editingProductId = null;
            });
        }

        // Cancel button
        const cancelBtn = productModal.querySelector(".btn-danger");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", function () {
                productModal.classList.remove("active");
                editingProductId = null;
            });
        }

        // Form submission
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const productData = {
                    name: e.target.name.value.trim(),
                    description: e.target.description.value.trim(),
                    price: parseFloat(e.target.price.value),
                    stock: parseInt(e.target.stock_quantity.value),
                    stock_quantity: parseInt(e.target.stock_quantity.value),
                    category: e.target.category.value.trim(),
                    sku: e.target.sku.value.trim(),
                };

                if (
                    !productData.name ||
                    !productData.price ||
                    isNaN(productData.stock)
                ) {
                    alert("Name, price, and stock are required!");
                    return;
                }

                if (editingProductId) {
                    // Edit existing product
                    const productIndex = products.findIndex(
                        (p) => p.id === editingProductId,
                    );
                    if (productIndex !== -1) {
                        products[productIndex] = {
                            ...products[productIndex],
                            ...productData,
                        };
                        showSuccessMessage("Product updated successfully!");
                    }
                    editingProductId = null;
                } else {
                    // Add new product
                    const newProduct = {
                        id:
                            products.length > 0
                                ? Math.max(...products.map((p) => p.id)) + 1
                                : 1,
                        ...productData,
                    };
                    products.push(newProduct);
                    showSuccessMessage("Product added successfully!");
                }

                saveData();
                updateProductsTable();
                updateProductGrid();
                updateDashboard();
                productModal.classList.remove("active");
            });
        }
    }

    // Cart functionality
    const clearBtn = document.querySelector(".cart-section .btn-danger");
    if (clearBtn) {
        clearBtn.addEventListener("click", clearCart);
    }

    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }

    // Delivery Modal
    const deliveryModal = document.getElementById("deliveryModal");
    const addDeliveryBtn = document.querySelector(
        ".deliveries-header .btn-primary",
    );

    if (addDeliveryBtn) {
        addDeliveryBtn.addEventListener("click", function (e) {
            e.preventDefault();
            openAddDeliveryModal(); // ✅ USE NEW FUNCTION (no pre-fill date)
        });
    }

    if (deliveryModal) {
        const closeBtn = document.getElementById("closeDeliveryModal");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                deliveryModal.classList.remove("active");
            });
        }

        const cancelBtn = document.getElementById("cancelDeliveryBtn");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                deliveryModal.classList.remove("active");
            });
        }

        const addProductBtn = document.getElementById("addProductBtn");
        if (addProductBtn) {
            addProductBtn.addEventListener("click", function () {
                const productId = parseInt(
                    document.getElementById("productSelect").value,
                );
                const quantity = parseInt(
                    document.getElementById("productQuantity").value,
                );
                const unit = document.getElementById("productUnit").value;

                if (!productId || !quantity) {
                    alert("Please select a product and enter quantity");
                    return;
                }

                const product = products.find((p) => p.id === productId);
                if (!product) return;

                currentDeliveryItems.push({
                    productId: productId,
                    name: product.name,
                    quantity: quantity,
                    unit: unit,
                });

                renderAddedProducts();
                document.getElementById("productSelect").value = "";
                document.getElementById("productQuantity").value = "";
            });
        }

        const form = deliveryModal.querySelector("form");
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                const deliveryData = {
                    supplier: document
                        .getElementById("supplierName")
                        .value.trim(),
                    date: document.getElementById("deliveryDate").value,
                    notes: document
                        .getElementById("deliveryNotes")
                        .value.trim(),
                    status: document.getElementById("deliveryStatus").value,
                    items: currentDeliveryItems,
                    lastUpdated: new Date().toISOString(),
                };

                if (!deliveryData.supplier || !deliveryData.date) {
                    alert("Supplier name and date are required!");
                    return;
                }

                if (editingDeliveryId) {
                    // Edit existing delivery
                    const deliveryIndex = deliveries.findIndex(
                        (d) => d.id === editingDeliveryId,
                    );
                    if (deliveryIndex !== -1) {
                        deliveries[deliveryIndex] = {
                            ...deliveries[deliveryIndex],
                            ...deliveryData,
                        };
                        showSuccessMessage("Delivery updated successfully!");
                    }
                    editingDeliveryId = null;
                } else {
                    // Add new delivery
                    const newDelivery = {
                        id:
                            deliveries.length > 0
                                ? Math.max(...deliveries.map((d) => d.id)) + 1
                                : 1,
                        ...deliveryData,
                    };
                    deliveries.push(newDelivery);
                    showSuccessMessage("Delivery added successfully!");
                }

                saveData();
                updateDeliveriesTable();
                updateDashboard();
                renderNewCalendar();
                deliveryModal.classList.remove("active");
            });
        }
    }

    // Calendar navigation
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");

    if (prevBtn) prevBtn.addEventListener("click", () => navigateMonth(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => navigateMonth(1));

    // ===== REMOVE OR COMMENT OUT THIS SECTION =====
    /*
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        filterDeliveriesByStatus(filter);
    });
});

// Initialize with "all" filter
filterDeliveriesByStatus('all');
*/

    // Initialize all displays
    updateDashboard();
    updateProductsTable();
    updateProductGrid();
    updateDeliveriesTable();

    setTimeout(() => {
        renderNewCalendar();
    }, 100);

    console.log("✅ App initialized!");
});

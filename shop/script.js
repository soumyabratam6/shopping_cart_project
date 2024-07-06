// Utility function to get the logged-in user from local storage
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger .open");
  const closeButton = document.querySelector(".links-container .close");
  const linksContainer = document.querySelector(".links-container");
  const navLinks = document.querySelectorAll(".nav_active_class");

  const toggleMenu = () => {
    linksContainer.classList.toggle("active");
  };

  hamburger.addEventListener("click", toggleMenu);
  closeButton.addEventListener("click", toggleMenu);
  /* navication active add... */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      link.classList.add("active");
      linksContainer.classList.remove("active");
    });
  });
  // Set the initial active link based on the current URL
  const currentPath = window.location.pathname;
  navLinks.forEach((link) => {
    if (link.href.includes(`${currentPath}`)) {
      link.classList.add("active");
    }
  });
  const productsContainer = document.getElementById("products-container");
  const searchInput = document.getElementById("search-input");
  const categoryButtons = document.querySelectorAll(".shop_filter_btn");
  const applyFilterBtn = document.getElementById("apply-filter-btn");
  const ratingRange = document.getElementById("rating-range");
  const checkboxes = document.querySelectorAll(".checkbox");
  const user = getLoggedInUser();
  if (!user) {
    alert("User does not exit");
    alert("You need to log in first....");
    window.location.href = "../profile/login.html";
    return;
  }
  let products = [];
  let filteredProducts = [];

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      products = await response.json();
      filteredProducts = products;
      displayProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const displayProducts = (products) => {
    //console.log(products);
    productsContainer.innerHTML = products
      .map(
        (product) => `
            <div class="product-card" data-id="${product.id}" data-name="${
          product.title
        }" data-price="${product.price}" data-image="${product.image}">
                <div class="img_container"><img src="${product.image}" alt="${
          product.title
        }"></div>
                <p class="mini_para">${product.category}</p>
                <p class="product_name">${truncateTitle(product.title)}</p>
                <div class="product-rating">
                    ${renderStars(product.rating.rate)}
                </div>
                <div class="cost_cart_btn">
                    <p class="cost">$${product.price}</p>
                    <button class="add_to_cart">
                        <img src="asset/card.png"/>
                    </button>
                </div>
            </div>
        `
      )
      .join("");
    // Add event listener to add_to_cart buttons
    const addToCartButtons = document.querySelectorAll(".add_to_cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productCard = event.target.closest(".product-card");
        const product = {
          id: productCard.dataset.id,
          name: productCard.dataset.name,
          price: parseFloat(productCard.dataset.price),
          image: productCard.dataset.image,
        };
        addToCart(product);
      });
    });
  };
  const truncateTitle = (title) => {
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  };
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star">&#9733;</span>'; // filled star
    }

    if (halfStar) {
      starsHTML += '<span class="star">&#9734;</span>'; // half-filled star
    }

    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
      starsHTML += '<span class="star">&#9734;</span>'; // empty star
    }

    return starsHTML;
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
  };

  const filterProducts = () => {
    let filtered = [...products];
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = document.querySelector(
      ".shop_filter_btn.active_shope"
    ).dataset.category;
    const selectedRating = parseInt(ratingRange.value);
    const selectedPriceRanges = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (selectedRating > 0) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= selectedRating
      );
    }
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedPriceRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return max
            ? product.price >= min && product.price <= max
            : product.price >= min;
        });
      });
    }

    filteredProducts = filtered;
    displayProducts(filtered);
  };

  searchInput.addEventListener("input", filterProducts);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active_shope"));
      button.classList.add("active_shope");

      filterProducts();
    });
  });

  applyFilterBtn.addEventListener("click", filterProducts);

  fetchProducts();
});

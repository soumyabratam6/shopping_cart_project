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
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/category/men's clothing"
      );
      const products = await response.json();
      //console.log(products);
      displayProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const WomenfetchProducts = async () => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/category/women's clothing"
      );
      const products = await response.json();
      //console.log(products);
      womendisplayProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  //title truncate
  const truncateTitle = (title) => {
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  };
  const womendisplayProducts = (products) => {
    const cardContainer = document.querySelector(".card_container.women");
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card");
      productCard.innerHTML = `
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
            `;
      cardContainer.appendChild(productCard);
    });
  };

  const displayProducts = (products) => {
    const cardContainer = document.querySelector(".card_container.men");
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card");
      productCard.innerHTML = `
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
            `;
      cardContainer.appendChild(productCard);
    });
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

  fetchProducts();
  WomenfetchProducts();
});

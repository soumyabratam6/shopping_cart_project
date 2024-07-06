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
  const user = getLoggedInUser();
  if (!user) {
    alert("User does not exit");
    alert("You need to log in first....");
    window.location.href = "../profile/login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //title truncate
  const truncateTitle = (title) => {
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  };
  //console.log(cart);
  // Function to render cart items
  const renderCart = () => {
    const cartContainer = document.querySelector(".cart_html");
    const subTotalContainer = document.querySelector(".sub_total");
    cartContainer.innerHTML = "";
    let subTotal = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("card");

      cartItem.innerHTML = `
                 <div class="img_container"><img src="${item.image}" alt="${item.title}"></div>
                <p class="product_name">${truncateTitle(item.name)}</p>
                <p class="cost">$${item.price}</p>
                <div class="cost_cart_btn">
                    <button class="add_to_cart cart_item_remove" data-index="${index}">
                          remove
                    </button>
                </div>
            
            `;

      cartContainer.appendChild(cartItem);
      subTotal += item.price;
    });

    subTotalContainer.innerText = `Subtotal: $${subTotal.toFixed(2)}`;

    // Add event listener to remove buttons
    const removeButtons = document.querySelectorAll(".cart_item_remove");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  };

  // Function to add item to cart
  const addToCart = (item) => {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };
  // Render cart on page load
  renderCart();

  const checkoutButton = document.querySelector(".checkout");
  checkoutButton.addEventListener("click", () => {
    // Razorpay integration
    const options = {
      key: "rzp_test_1aUURfMPqi6R5p",
      amount: cart.reduce((total, item) => total + item.price, 0) * 100, // in paise
      currency: "INR",
      name: "SOUMYABRATA",
      description: "Test Transaction",
      handler: function (response) {
        alert(
          "Payment successful. Transaction ID: " + response.razorpay_payment_id
        );
        localStorage.removeItem("cart");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2000);
        renderCart();
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      image: "asset/SOUMYA_PIC.jpg",
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  });
});

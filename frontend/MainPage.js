// Burger Menu
const burger = document.querySelector(".burger");
const nav = document.querySelector("nav ul");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!burger.contains(e.target) && !nav.contains(e.target)) {
    burger.classList.remove("active");
    nav.classList.remove("active");
  }
});

//DropDownMenu
const userIcon = document.getElementById("userIcon");
const dropdown = document.getElementById("loginDropdown");

// Elements inside dropdown to modify dynamically
const signUpLink = dropdown.querySelector('a[href*="Register"]');
const loginLink = dropdown.querySelector('a[href*="Login"]');

let loggedIn = localStorage.getItem("token");
function updateUserDropdown() {
  loggedIn = localStorage.getItem("token");

  if (loggedIn) {
    // თუ დალოგინებულია
    loginLink.textContent = "Logout";
  } else {
    // თუ არ არის დალოგინებული
    loginLink.textContent = "Login";
  }
}
updateUserDropdown();
userIcon.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", (e) => {
  if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

// Login/Logout ღილაკის ლოგიკა
loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  loggedIn = localStorage.getItem("token");
  console.log(loginLink.textContent);
  if (loginLink.textContent === "Login") {
    // ლოგაუთის პროცესი
    window.location.href = "./Login/Login.html";
  } else if (loginLink.textContent === "Logout") {
    localStorage.removeItem("token");
    updateUserDropdown();
  }
});

// Booking ღილაკის ლოგიკა (book now button)
const bookNowButtons = document.querySelectorAll(".book");

bookNowButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const loggedIn = localStorage.getItem("token");

    if (loggedIn) {
      // პირდაპირ ბუქინგ გვერდზე გადაყვანა
      window.location.href = "./Booking/Booking.html"; // გამოგიყვანე Booking გვერდზე (შენი გზა ჩასვი)
    } else {
      // ლოგინ გვერდზე გადაყვანა
      window.location.href = "./Login/Login.html";
    }
  });
});

// SwitchPhotos
const photoDiv = document.getElementById("photoDiv");
const images = [
  "https://images.pexels.com/photos/1796736/pexels-photo-1796736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.unsplash.com/photo-1508264165352-258db2ebd59b?auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
];
let currentImage = 0;

const updatePhoto = () => {
  photoDiv.style.backgroundImage = `url('${images[currentImage]}')`;
};

document.getElementById("prevBtn").addEventListener("click", () => {
  currentImage = (currentImage - 1 + images.length) % images.length;
  updatePhoto();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentImage = (currentImage + 1) % images.length;
  updatePhoto();
});

updatePhoto();

// Resort Cards
const resortCards = document.querySelectorAll(".resort-card");
let activeCard = null;

const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

resortCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card === activeCard) {
      card.classList.remove("active");
      overlay.classList.remove("active");
      activeCard = null;
    } else {
      if (activeCard) {
        activeCard.classList.remove("active");
      }
      card.classList.add("active");
      overlay.classList.add("active");
      activeCard = card;
    }
  });
});

overlay.addEventListener("click", () => {
  if (activeCard) {
    activeCard.classList.remove("active");
    overlay.classList.remove("active");
    activeCard = null;
  }
});

// Travel destinations
const destinations = [
  {
    name: "Santorini, Greece",
    image:
      "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Stunning white-washed buildings and breathtaking sunsets over the Aegean Sea",
  },
  {
    name: "Machu Picchu, Peru",
    image:
      "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Ancient Incan citadel set high in the Andes Mountains",
  },
  {
    name: "Maldives",
    image:
      "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Crystal clear waters and overwater bungalows in paradise",
  },
  {
    name: "Tokyo, Japan",
    image:
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Vibrant city blending ultra-modern and traditional culture",
  },
  {
    name: "Venice, Italy",
    image:
      "https://images.pexels.com/photos/1796736/pexels-photo-1796736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Romantic canals and historic architecture in the floating city",
  },
  {
    name: "Great Barrier Reef, Australia",
    image:
      "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "World's largest coral reef system teeming with marine life",
  },
  {
    name: "Safari in Tanzania",
    image:
      "https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Experience the great migration in the Serengeti",
  },
  {
    name: "Northern Lights in Iceland",
    image:
      "https://images.pexels.com/photos/1933316/pexels-photo-1933316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Magical aurora borealis dancing across the arctic sky",
  },
  {
    name: "Kazbegi, Georgia",
    image:
      "https://images.pexels.com/photos/4215113/pexels-photo-4215113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Stunning mountain views with the iconic Gergeti Trinity Church",
  },
  {
    name: "Bali, Indonesia",
    image:
      "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Tropical paradise with ancient temples and rice terraces",
  },
  {
    name: "Tbilisi Old Town, Georgia",
    image:
      "https://images.pexels.com/photos/5766927/pexels-photo-5766927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Charming historic district with colorful houses and sulfur baths",
  },
  {
    name: "Petra, Jordan",
    image:
      "https://images.pexels.com/photos/1631665/pexels-photo-1631665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Ancient city carved into rose-colored rock faces",
  },
  {
    name: "Batumi, Georgia",
    image:
      "https://images.pexels.com/photos/5563472/pexels-photo-5563472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Modern seaside city with unique architecture and beautiful beaches",
  },
];

// Card generation
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateCard");
  const cardContainer = document.getElementById("cardContainer");
  let currentCard = null;

  generateBtn.addEventListener("click", () => {
    if (currentCard) {
      currentCard.style.opacity = "0";
      currentCard.style.transform = "translateY(20px)";
      setTimeout(() => currentCard.remove(), 500);
    }

    const randomDestination =
      destinations[Math.floor(Math.random() * destinations.length)];

    const card = document.createElement("div");
    card.className = "travel-card";

    card.innerHTML = `
      <div class="travel-card-inner">
        <img src="${randomDestination.image}" alt="${randomDestination.name}">
        <div class="travel-card-content">
          <h3>${randomDestination.name}</h3>
          <p>${randomDestination.description}</p>
        </div>
      </div>
    `;

    setTimeout(
      () => {
        cardContainer.innerHTML = "";
        cardContainer.appendChild(card);
        currentCard = card;
      },
      currentCard ? 500 : 0
    );
  });
});

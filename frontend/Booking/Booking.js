const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../Login/Login.html";
}

const userProfile = document.getElementById("userProfile");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const createTourForm = document.getElementById("createTourForm");
const myToursList = document.getElementById("myToursList");
const otherToursList = document.getElementById("otherToursList");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const API_URL = "https://travelproject-6pb9.onrender.com";
const TOUR_URL = `${API_URL}/tour`;
const USER_URL = `${API_URL}/user`;

let currentUser = null;

async function fetchUserProfile() {
  try {
    const res = await fetch(`${USER_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!data.success) throw new Error("Unauthorized");

    currentUser = data.user;
    userName.textContent = data.user.name;
    userEmail.textContent = data.user.email;
    return currentUser;
  } catch (err) {
    console.error(err);
    alert("Session expired. Please log in again.");
    window.location.href = "../Login/Login.html";
  }
}

async function fetchTours() {
  try {
    const res = await fetch(TOUR_URL);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch tours", err);
    return [];
  }
}

async function createTour(tourData) {
  try {
    const payload = {
      ...tourData,
      creator: currentUser._id,
      fullName: currentUser.name,
      email: currentUser.email,
      phone: "555123123",
    };

    const res = await fetch(TOUR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Tour created successfully!");
      createTourForm.reset();
      loadTours();
    } else {
      alert(data.message || "Failed to create tour");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}

async function joinTour(tourId) {
  try {
    const res = await fetch(`${TOUR_URL}/${tourId}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: currentUser._id,
        fullName: currentUser.name,
        email: currentUser.email,
        phone: "555123123",
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Successfully joined tour!");
      loadTours();
    } else {
      alert(data.message || "Could not join tour");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}

async function deleteTour(tourId) {
  try {
    const res = await fetch(`${TOUR_URL}/${tourId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Tour deleted successfully!");
      loadTours();
    } else {
      alert(data.message || "Could not delete tour");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while deleting the tour.");
  }
}

function createTourCard(tour, isMyTour = false) {
  const card = document.createElement("div");
  card.className = "tour-card";

  const participants = Array.isArray(tour.user) ? tour.user : [];
  const alreadyJoined = participants.some((u) => u._id === currentUser._id);
  const isCreator =
    tour.creator?._id === currentUser._id || tour.creator === currentUser._id;

  // Default travel images array
  const travelImages = [
    "https://images.unsplash.com/photo-1488085061387-422e29b40080",
  ];
  const randomImage = travelImages[0];

  card.innerHTML = `
    <div class="tour-image">
      <img src="${randomImage}" alt="Travel destination" />
    </div>
    <div class="tour-content">
      <h3>${tour.fullName || "Unnamed Tour"}</h3>
      <p><strong>Destination:</strong> ${tour.destination}</p>
      <p><strong>Date:</strong> ${new Date(tour.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${tour.time || "N/A"}</p>
      <p><strong>Directions:</strong> ${tour.directions}</p>
      <p><strong>Participants:</strong> ${participants.length}</p>
      ${
        participants.length > 0
          ? `
        <p><strong>Joined Users:</strong></p>
        <ul>${participants
          .map((p) => `<li>${p.fullName || p.email}</li>`)
          .join("")}</ul>`
          : ""
      }
      <div class="tour-meta">
        ${
          isCreator
            ? `
          <button class="delete-btn" data-tour-id="${tour._id}">
            Delete Tour
          </button>
        `
            : ""
        }
        <button class="join-btn" ${alreadyJoined ? "disabled" : ""}>
          ${alreadyJoined ? "Already Joined" : "Join Tour"}
        </button>
      </div>
    </div>
  `;

  // Add event listeners after creating the elements
  const joinBtn = card.querySelector(".join-btn");
  if (!alreadyJoined) {
    joinBtn.addEventListener("click", () => joinTour(tour._id));
  }

  // Add delete button event listener if it exists
  const deleteBtn = card.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => deleteTour(tour._id));
  }

  return card;
}

async function loadTours() {
  await fetchUserProfile();
  const tours = await fetchTours();

  const myCreatedToursList = document.getElementById("myCreatedToursList");
  const myJoinedToursList = document.getElementById("myJoinedToursList");
  const otherToursList = document.getElementById("otherToursList");

  myCreatedToursList.innerHTML = "";
  myJoinedToursList.innerHTML = "";
  otherToursList.innerHTML = "";

  const myCreatedTours = tours.filter(
    (t) => t.creator?._id === currentUser._id || t.creator === currentUser._id
  );

  const myJoinedTours = tours.filter(
    (t) =>
      Array.isArray(t.user) && t.user.some((u) => u._id === currentUser._id)
  );

  const otherTours = tours.filter(
    (t) =>
      t.creator?._id !== currentUser._id &&
      t.creator !== currentUser._id &&
      (!Array.isArray(t.user) || !t.user.some((u) => u._id === currentUser._id))
  );

  // Show my created tours
  if (myCreatedTours.length === 0) {
    myCreatedToursList.innerHTML = "<p>You haven’t created any tours yet.</p>";
  } else {
    myCreatedTours.forEach((t) =>
      myCreatedToursList.appendChild(createTourCard(t, true))
    );
  }

  // Show joined tours
  if (myJoinedTours.length === 0) {
    myJoinedToursList.innerHTML = "<p>You haven’t joined any tours yet.</p>";
  } else {
    myJoinedTours.forEach((t) =>
      myJoinedToursList.appendChild(createTourCard(t, false))
    );
  }

  // Show other tours
  if (otherTours.length === 0) {
    otherToursList.innerHTML = "<p>No other tours available.</p>";
  } else {
    otherTours.forEach((t) =>
      otherToursList.appendChild(createTourCard(t, false))
    );
  }
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    const tabId = btn.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});

// Form submission
createTourForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(createTourForm);
  const tourData = {
    fullName: formData.get("tourName"),
    destination: formData.get("destination"),
    directions: formData.get("description"),
    date: formData.get("date"),
    time: formData.get("time") || "12:00",
  };
  await createTour(tourData);
});

// Start app
loadTours();

//Logout functionality
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../Login/Login.html";
  });
}

const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "../index.html"; // საჭიროებისამებრ შეცვალე გზა
  });
}

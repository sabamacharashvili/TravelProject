const form = document.querySelector("#loginForm");

if (form) {
  form.addEventListener("submit", handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const response = await fetch("https://travelproject-6pb9.onrender.com/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      if (result.token) {
        localStorage.setItem("token", result.token);
        alert("Successfully authorized!");
        window.location.href = "../index.html";
      } else {
        alert("Token missing from response.");
      }
    } else {
      alert(result.message || "Authorization failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(
      error.message === "Failed to fetch"
        ? "Unable to connect to the server. Please check if the server is running."
        : error.message || "An error occurred"
    );
  }
}

// ✅ უკან გადასასვლელი ღილაკის ფუნქცია
function goHome() {
  window.location.href = "../index.html";
}

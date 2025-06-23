const form = document.querySelector("#registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
  };

  


  if (!data.username || !data.email || !data.password || !data.confirmPassword) {
    alert("Fill all fields");
    return;
  }

 
  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("https://travelproject-6pb9.onrender.com/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    
    if (res.ok) {
      alert(result.message);
      // Redirect to login page after successful registration
      window.location.href = "../Login/Login.html";
    } else {
      alert(result.message || "Registration failed");
    }
  } catch (err) {
    console.error("error:", err);
    alert("An error occurred");
  }
});

const signin = async (user) => {
  localStorage.setItem("login", true);
  try {
    let response = await fetch("/auth/signin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  localStorage.setItem("login", false);
  try {
    let response = await fetch("/auth/signout/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { signin, signout };

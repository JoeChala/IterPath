import { useState } from "react";

function StudentLoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginStudent = async () => {

    const res = await fetch("http://localhost:5000/auth/students/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({email,password})
    });

    const data = await res.json();

    if(data.success){
      alert("Login successful");
      window.location.href = "/dashboard";
    }else{
      alert(data.message);
    }
  };

  return (
    <div>

      <h2>Enter Registered Email</h2>
      <input
        type="text"
        placeholder="Enter mail ID"
        onChange={(e) => setEmail(e.target.value)}
      />

      <h2>Enter Password</h2>
      <input
        type="text"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginStudent}>Login</button>

      <br /><br /><br />

      <h2>New Student?</h2>
      <button onClick={() => window.location.href="/register"}>
        Register Now
      </button>

    </div>
  );
}

export default StudentLoginForm;
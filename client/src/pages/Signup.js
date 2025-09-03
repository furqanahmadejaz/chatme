import { useState } from "react";
import useSignup from "../hooks/useSignup";
import { Link } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {signup, isLoading, error} = useSignup()

    const handleSubmit = async(e) =>{
        e.preventDefault()

        await signup(username,email, password)
    }

    
    return (
      <form className="user-form" onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label>Email: </label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label>Password: </label>
        <input
          type="text"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button disabled={isLoading}>Signup</button>
        <Link to="/login" className="redirect-link">Already have an account? Log in</Link>
        {error && <div className="error">{error} </div>}
      </form>
    );
}
 
export default Signup;
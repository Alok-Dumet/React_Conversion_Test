//Import useState to LATER if needed, implement live error checking
//For now not needed, but it's good practice apparently
// import {useState} from "react";

//basically the new querySelector
import {useRef} from "react";

//Import useNavigate for seamless page transitioning on events
import {useNavigate,} from "react-router-dom";

//Import Link tag for seamless links on click of a link
import { Link } from 'react-router-dom';

export default function Login(){
	//document.querySelctoring username, password, and error basically
	let usernameRef = useRef();
	let passwordRef = useRef();
	let errorRef = useRef();

	//navigating seamlesslessly
	let navigate = useNavigate();

	async function handleSubmit(event) {
		//prevent reloading page
		event.preventDefault();

		//Gets the values of the input boxes for the username and password input tags
		let form = {username: usernameRef.current.value.trim(), password: passwordRef.current.value};
	  
		const res = await fetch('/api/v1/login', {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: new URLSearchParams(form) //sends info the same way a POST would. Like baz=foo&bar=hello
		});
	  
		const result = await res.json();

		//on succesful login, we'll take the redirect response and navigate to the home page
		if(!result.error) {
			navigate('/');
		}
		else if(result.error){
			errorRef.current.textContent = result.error;
			errorRef.current.style.display = "block";
		}
	  }

	//HTML part
	return(
		<div className="login">
			<h1>Login Below!</h1>
			<form onSubmit={handleSubmit}>
				<ul>
					<li>
						Username:<input ref={usernameRef} type="text"/>
					</li>
					<li>
						Password:<input ref={passwordRef} type="password"/>
					</li>
				</ul>
				<input type="submit" value="Login"/>
				</form>
				<h2>
					Don't Have an Account? <Link to="/register">Register</Link>
				</h2>
				<div ref={errorRef}></div>
		</div>
	);
}

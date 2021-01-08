import firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";
import firebaseConfig from "../../firebaseConfig";
import Hero from "../Hero/Hero";
import "./Login.css";

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const Login = () => {
	const [newUser, setNewUser] = useState(false);
	const [user, setUser] = useState({
		isSignedIn: false,
		name: "",
		nameErrMsg: "",
		email: "",
		emailErrMsg: "",
		password: "",
		passwordErrMsg: "",
		error: "",
		success: "",
	});

	//google provider
	const provider = new firebase.auth.GoogleAuthProvider();
	const fbProvider = new firebase.auth.FacebookAuthProvider();

	//handling signing with google account
	const signedInWithGoogle = () => {
		firebase
			.auth()
			.signInWithPopup(provider)
			.then((res) => {
				const newUserInfo = { ...user };
				newUserInfo.isSignedIn = true;
				setUser(newUserInfo);
				// console.log(res.user);
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	//handling singing with facebook account
	const signeInWithFb = () => {
		firebase
			.auth()
			.signInWithPopup(fbProvider)
			.then((res) => {
				const newUserInfo = { ...user };
				newUserInfo.isSignedIn = true;
				setUser(newUserInfo);
				// console.log(res.user);
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	// handle input filed blur event lsitener
	const handleFieldBlur = (e) => {
		let emailErr, passwordErr, nameErr;
		let isFormValid = true;

		//validate name filed
		if (e.target.name === "name") {
			if (!e.target.value) {
				nameErr = "Field can't be empty";
				isFormValid = false;
				console.log("empty");
			} else if (e.target.value.length < 3) {
				nameErr = "Must be at least 3 character";
				isFormValid = false;
				console.log("<3");
			} else {
				nameErr = "";
				isFormValid = true;
				console.log("valid");
			}
		}
		//validate email
		else if (e.target.name === "email") {
			if (!e.target.value) {
				emailErr = "Field can't be empty";
				isFormValid = false;
			} else if (!/\S+@\S+\.\S+/.test(e.target.value)) {
				emailErr = "Enter valid Email";
				isFormValid = false;
			} else {
				isFormValid = true;
				emailErr = "";
			}
		}
		//validate password
		else if (e.target.name === "password") {
			if (!e.target.value) {
				passwordErr = "Field can't be empty";
				isFormValid = false;
			} else if (e.target.value.length < 8) {
				passwordErr = "Must be at least 8 character";
				isFormValid = false;
			} else if (e.target.value.search(/[a-z]/i) < 0) {
				passwordErr = "Must contain at least one character";
				isFormValid = false;
			} else if (e.target.value.search(/[0-9]/) < 0) {
				passwordErr = "Must contain at least one digit";
				isFormValid = false;
			} else {
				passwordErr = "";
				isFormValid = true;
			}
		}

		//final form validation
		if (isFormValid) {
			const newUserInfo = { ...user };
			newUserInfo[e.target.name] = e.target.value;
			newUserInfo.emailErrMsg = emailErr;
			newUserInfo.passwordErrMsg = passwordErr;
			newUserInfo.nameErrMsg = nameErr;
			setUser(newUserInfo);
		} else if (!isFormValid) {
			if (e.target.name === "name") {
				const newUserInfo = { ...user };
				newUserInfo.nameErrMsg = nameErr;
				setUser(newUserInfo);
			} else if (e.target.name === "email") {
				const newUserInfo = { ...user };
				newUserInfo.emailErrMsg = emailErr;
				setUser(newUserInfo);
			} else if (e.target.name === "password") {
				const newUserInfo = { ...user };
				newUserInfo.passwordErrMsg = passwordErr;
				setUser(newUserInfo);
			}
		}
	};

	//handle form submit button
	const handleSubmit = (e) => {
		e.preventDefault();
		if (newUser && user.email && user.password) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(user.email, user.password)
				.then((res) => {
					// console.log(res.user);
					const newUserInfo = { ...user };
					newUserInfo.isSignedIn = true;
					setUser(newUserInfo);
					updateName(user.name);
					alert("You've successfully signed up");
					// console.log(res.user);
				})
				.catch((error) => {
					console.log(error.message);
					alert(error.message);
				});
			e.target.reset();
		} else if (!newUser && user.email && user.password) {
			firebase
				.auth()
				.signInWithEmailAndPassword(user.email, user.password)
				.then((res) => {
					alert("You've successfully signed in ");
					const newUserInfo = { ...user };
					newUserInfo.isSignedIn = true;
					setUser(newUserInfo);
				})
				.catch((error) => {
					console.log(error.message);
					alert(error.message);
				});
		}
	};

	//handle singout button
	const handleSignOut = () => {
		console.log("sign out");
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				const newUserInfo = { ...user };
				newUserInfo.isSignedIn = false;
				newUserInfo.email = "";
				newUserInfo.password = "";

				setUser(newUserInfo);
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	//update display name
	const updateName = (name) => {
		const user = firebase.auth().currentUser;

		user.updateProfile({
			displayName: name,
		});
	};

	//render either login page or dashboard

	if (user.isSignedIn) {
		return <Hero user={user} handleSignOut={handleSignOut}></Hero>;
	} else {
		return (
			<div className="login_page">
				<div className="login_container">
					<form onSubmit={handleSubmit}>
						{newUser && (
							<div className="form-group">
								<label htmlFor="Name">Name</label>
								<span>
									<input
										onBlur={handleFieldBlur}
										type="text"
										placeholder="Name"
										name="name"
									/>
								</span>
								{user.nameErrMsg && <i>{user.nameErrMsg}</i>}
							</div>
						)}
						<div className="form-group">
							<label htmlFor="email">Email</label>
							<span>
								<input
									onBlur={handleFieldBlur}
									name="email"
									type="text"
									placeholder="Email"
								/>
							</span>
							{user.emailErrMsg && <i>{user.emailErrMsg}</i>}
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<span>
								<input
									name="password"
									onBlur={handleFieldBlur}
									type="password"
									placeholder="Password"
								/>
							</span>
							{user.passwordErrMsg ? <i>{user.passwordErrMsg} </i> : ""}
						</div>
						<input
							className="signUpBtn"
							type="submit"
							value={newUser ? "Sign Up" : "Sign In"}
						/>
						<div className="signUp_signIn">
							<p>
								{newUser
									? "Sing in your account . "
									: "Don't have an account ? "}
								<span onClick={() => setNewUser(!newUser)}>
									{newUser ? "Sign in" : "Sign Up"}
								</span>
							</p>

							<p>
								Sign in with <span onClick={signedInWithGoogle}>Google</span>
							</p>
							<p>
								Sign in with <span onClick={signeInWithFb}>Facebook</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		);
	}
};

export default Login;

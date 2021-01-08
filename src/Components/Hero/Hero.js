import React from "react";
import "./Hero.css";
const Hero = ({ handleSignOut, user }) => {
	return (
		<div className="hero">
			<div className="nav">
				<div className="nav_brand">
					<h2> {user.name} </h2>
				</div>
				<div className="nav_list">
					<button onClick={handleSignOut}>Log Out</button>
				</div>
			</div>
		</div>
	);
};

export default Hero;

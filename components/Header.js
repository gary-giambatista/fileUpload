import React from "react";
import styles from "../styles/Header.module.css";

export default function Header() {
	return (
		<div className={styles.container}>
			<h1 className={styles.titleText}> File Uploader</h1>
		</div>
	);
}

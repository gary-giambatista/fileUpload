import React from "react";
import { supabase } from "../library/supabaseClient.js";
import styles from "../styles/FileUploader.module.css";

export default function FileUploader() {
	//Upload file function
	async function uploadFile(event) {
		let file;

		if (event.target.files) {
			file = event.target.files[0];
		}
		// console.log(event.target.files[0]);
		const { data, error } = await supabase.storage
			.from("files")
			.upload("public" + file?.name, file);

		if (data) {
			console.log(data);
		} else if (error) {
			console.log(error);
		}
	}

	return (
		<div className={styles.componentContainer}>
			<h3 className={styles.pageTitle}> Upload a file here: </h3>
			<input
				type="file"
				className={styles.uploadInput}
				onChange={(event) => {
					uploadFile(event);
				}}
			/>
		</div>
	);
}

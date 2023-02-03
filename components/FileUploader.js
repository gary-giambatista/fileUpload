import React, { useEffect, useState } from "react";
import { supabase } from "../library/supabaseClient.js";
import styles from "../styles/FileUploader.module.css";

export default function FileUploader() {
	//File to be uploaded from client
	const [userFile, setUserFile] = useState();
	//Array of files uploaded to database bucket "files/public" on Supabase
	const [files, setFiles] = useState([]);

	//Upload file function
	async function uploadFile(event) {
		let file;
		if (event.target.files) {
			file = event.target.files[0];
		}

		const { data, error } = await supabase.storage
			.from("files")
			.upload("public/" + file?.name, file);

		//Alert SUCCESS message
		if (data) {
			setUserFile(data.path);
			alert(`Your file ${data.path} has been uploaded!`);
			//Alert ERROR message
		} else if (error) {
			console.log(error);
			alert(`There was an error. ${error.message}`);
		}
	}

	//Fetch already uploaded files and save in state as files[{}]
	useEffect(() => {
		//Get all files from bucket "files/public" on Supabase
		async function getFiles() {
			const { data, error } = await supabase.storage
				.from("files")
				.list("public", {
					limit: 100,
					offset: 0,
					sortBy: { column: "name", order: "asc" },
				});
			if (data) {
				// console.log(JSON.stringify(data));
				setFiles(data);
			} else if (error) {
				console.log(error);
			}
		}
		return () => {
			getFiles();
		};
	}, [userFile]);

	async function downloadFile(fileName) {
		const { data, error } = await supabase.storage
			.from("files")
			.getPublicUrl(`public/${fileName}`);

		if (data) {
			console.log(JSON.stringify(data));
			// setFiles(data);
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
			{/* Conditionally Render files from the database bucket "files/public"*/}
			{files.length > 0 ? (
				<div className={styles.filesContainer}>
					<h3 className={styles.filesTitle}>Current Files in Storage: </h3>
					{files.map((file) => {
						return (
							<div key={file.id} className={styles.fileNamesContainer}>
								<div className={styles.fileNames}>- {file.name}</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className={styles.filesContainer}>
					<h3 className={styles.filesTitle}>Current Files in Storage: </h3>
					<div className={styles.fileNames}> No files Uploaded</div>
				</div>
			)}
		</div>
	);
}

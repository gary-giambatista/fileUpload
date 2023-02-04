import React, { useEffect, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { supabase } from "../library/supabaseClient.js";
import styles from "../styles/FileUploader.module.css";

export default function FileUploader() {
	//File to be uploaded from client
	const [userFile, setUserFile] = useState();
	//Array of files uploaded to database bucket "files/public" on Supabase
	const [files, setFiles] = useState([]);
	//download file URL for downloading files
	const [downloadUrl, setDownloadUrl] = useState("");

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

	//instatiate userFile as null to trigger getFiles above
	useEffect(() => {
		setUserFile(null);
	}, []);

	//fetch URL for download
	async function getFileDownloadUrl(fileName) {
		const { data, error } = await supabase.storage
			.from("files")
			.getPublicUrl(`public/${fileName}`, {
				download: true,
			});

		if (data) {
			// console.log(JSON.stringify(data));
			setDownloadUrl(data.publicUrl);
		} else if (error) {
			console.log(error);
		}
	}
	//execute download & reset state
	function downloadFile() {
		const downloadWindow = window.open(downloadUrl);
		window.close(downloadWindow);
		setDownloadUrl("");
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
								{/* Download Icon */}
								<HiOutlineDownload
									onClick={() => getFileDownloadUrl(file.name)}
									size={20}
									title="Download"
									color="#305973"
									className={styles.downloadIcon}
								/>
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
			{/* Confirm DOWNLOAD */}
			{downloadUrl.length > 0 ? (
				<div className={styles.confirmButtonGroup}>
					<button
						onClick={() => downloadFile()}
						className={styles.confirmButton}
					>
						Confirm Download
					</button>
					<button
						onClick={() => setDownloadUrl("")}
						className={styles.cancelButton}
					>
						Cancel Download
					</button>
				</div>
			) : null}
		</div>
	);
}

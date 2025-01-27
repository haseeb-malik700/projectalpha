import React, { useState } from "react";
import axios from "axios";

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      // Replace with your backend URL
      const res = await axios.post("http://127.0.0.1:8000/review-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data); // Adjust based on backend response format
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.prompt}>How can I help you with your resume today?</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
      {response && (
        <div style={styles.response}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  prompt: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fileInput: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  response: {
    marginTop: "20px",
    textAlign: "left",
  },
};

export default ResumeUploader;

import React, { useState } from "react";
import axios from "axios";

const ResumeUploader = () => {
  const [text, setText] = useState(""); // Store resume text
  const [response, setResponse] = useState(""); // Store backend response
  const [loading, setLoading] = useState(false); // Loading state
  const apiUrl = process.env.REACT_APP_API_URL;
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Please enter some resume text.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/gemini`, { text });
      // Ensure the response accesses the `text` key in the returned object
      if (res.data && res.data.text) {
        setResponse(res.data.text);
      } else {
        setResponse("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error sending text to backend:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.prompt}>How can I help you with your resume today?</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          placeholder="Paste your resume text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="10"
          cols="50"
          style={styles.textarea}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {response && (
        <div style={styles.response}>
          <h3>Formatted CV:</h3>
          <pre style={styles.pre}>{response}</pre>
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
  textarea: {
    width: "100%",
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
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
  pre: {
    background: "#f8f9fa",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    whiteSpace: "pre-wrap", // Ensures line breaks wrap properly
    fontFamily: "Courier New, monospace",
  },
};

export default ResumeUploader;

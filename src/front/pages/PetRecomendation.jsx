import React, { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PetRecomendation = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello! Please describe your personality, daily routine, and living space, and the AI assistant will recommend the best pet and breed for you."
        }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userText = inputMessage;
        setMessages((prev) => [...prev, { sender: "user", text: userText }]);
        setInputMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/pet-recommendation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userText })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => [...prev, { sender: "ai", text: data.recommendation || data.reply || "Recommendation generated successfully." }]);
            } else {
                setMessages((prev) => [...prev, { sender: "ai", text: "An error occurred while communicating with the AI service." }]);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { sender: "ai", text: "Network error connecting to the backend service." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center">AI Pet Recommendation Chat</h2>

                <div className="chat-box border rounded p-3 mb-3" style={{ height: "400px", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                            <div className={`p-3 rounded ${msg.sender === "user" ? "bg-primary text-white" : "bg-white border text-dark"}`} style={{ maxWidth: "75%" }}>
                                <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex justify-content-start mb-3">
                            <div className="p-3 rounded bg-white border text-dark">
                                <p className="mb-0"><em>AI is evaluating the best match...</em></p>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Describe your personality, activity level, home type..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};
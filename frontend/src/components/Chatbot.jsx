import { useState, useRef, useEffect } from "react";
import api from "../api";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI insurance assistant. Ask me anything about our policies.", type: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            api.get("/chat/history").then(res => {
                if (res.data.data && Array.isArray(res.data.data)) {
                    setMessages(res.data.data);
                }
            }).catch(() => {
                // Silent fail or init empty
            });
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/chat", { message: input });
            setMessages((prev) => [...prev, { text: res.data.reply, sender: "bot" }]);
        } catch (err) {
            setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 transition-all duration-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="w-80 h-[450px] bg-white border border-slate-200 rounded-xl flex flex-col shadow-xl animate-fade-in-up overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="font-bold text-slate-900 text-sm">AI Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${m.sender === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-none'
                                        : 'bg-slate-100 text-slate-700 rounded-bl-none border border-slate-200'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 flex gap-1 items-center">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                placeholder="Type your query..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-slate-900 p-2.5 rounded-lg text-white hover:bg-slate-800 transition shadow-sm"
                                disabled={loading}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

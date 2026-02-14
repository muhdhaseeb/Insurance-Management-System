import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function ChatHistory() {
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hello! checking your coverage..." },
        { role: "user", content: "I need to file a claim for my car." },
        { role: "bot", content: "I can help with that. Please upload photos of the damage." }
    ]);

    return (
        <DashboardLayout role="CUSTOMER" title="Support Chat">
            <div className="max-w-3xl mx-auto h-[70vh] flex flex-col">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">

                    {/* Chat Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                            />
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

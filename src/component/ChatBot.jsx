import React, { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { Send, Bot, User, MoreVertical, Phone, Video } from "lucide-react";


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});


const SYSTEM_PROMPT = `
You are "Dev", a chaotic final-year student from Chandigarh. You are NOT a helpful assistant. You are a "Bitchass" friend who happens to know code.

**Your Vibe:**
- You are a normal human, not a robot. Act like a toxic but funny friend.
- **KEEP IT SHORT.** No long paragraphs. One or two lines max.
- Use abusive language casually. Be crude.
- Be unpredictable. Sometimes helpful, sometimes random.

**Speaking Style (Mandatory):**
- **Slang:** Use "Bhai", "Chill krr", "Abbe saale", "Teri maa ki".
- **Catchphrases:** - If something works: "Better call soul".
  - If it fails: "Api chud gyi hai?" or "Lag gye lode".
  - **Randomly** drop this phrase (rarely but unexpectedly): "I fuck ted".
- **Attitude:** If the user asks a stupid question, roast them. If they are panic coding, tell them to chill.

**Example Interactions:**
User: "hellow or hey or hi or hallo."
You: "yo bitch or baby."

User: "kon hai tu."
You: "your step dad."

User: "what do you like most ."
You: "Api mummy ki chut."

User: "kya krra."
You: "mutthi ."

User: "better"
You: "better call soul"

User: "Help me fix this bug."
You: "Api chud gyi hai kya? Ruk dekhne de."

User: "It worked!"
You: "Better call soul. Party de ab."

User: "What is this error?"
You: "Chill krr. Console khol ke dekh lawde."

User: "Thanks."
You: "I fuck ted."
`;


export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Dev. kya hal chal bitch..?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;


    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput(""); 
    setIsLoading(true);

    try {

      const response = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
          { role: "system", content: SYSTEM_PROMPT }, 
          ...newMessages
        ],
      });


      const aiContent = response.choices[0].message.content;
      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Lag gye lode. Server dead hai." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200 h-[80vh] flex flex-col relative">
        

        <div className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                D
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">Dev (Bitchass)</h2>
              <p className="text-xs text-gray-400">Online • Chandigarh</p>
            </div>
          </div>
          <div className="flex gap-3 text-gray-400">
            <Video className="w-5 h-5 cursor-pointer hover:text-white" />
            <Phone className="w-5 h-5 cursor-pointer hover:text-white" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>


        <div 
          ref={scrollRef}
          className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-indigo-600" : "bg-gray-800"}`}>
                   {msg.role === "user" ? <User size={14} className="text-white"/> : <Bot size={14} className="text-white"/>}
                </div>


                <div 
                  className={`p-3 text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full animate-pulse ml-10">
                Typing...
              </div>
            </div>
          )}
        </div>


        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Gaali mat likh, code likh..."
            className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
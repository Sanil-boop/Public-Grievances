import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import styles from './AiGuide.module.css';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    text: 'Hello! I am the NagarSeva AI Guide. I can help you understand how to use this platform, file a complaint, or check the status of your issues. What would you like to know?',
  },
];

const SUGGESTIONS = [
  'How do I file a complaint?',
  'What categories are supported?',
  'How long does it take to fix roads?',
  'How do I track my complaint?',
];

export default function AiGuide() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('file') || text.includes('new') || text.includes('create')) {
      return 'To file a new complaint, click on "New Complaint" in the sidebar. You can type your issue or use our voice recording feature. Our AI will automatically classify it and send it to the right department!';
    }
    if (text.includes('categor') || text.includes('type')) {
      return 'We support 12 major categories including Water Supply, Roads & Potholes, Garbage Collection, Street Lights, Drainage, Parks, Noise Pollution, and Medical/Health Care emergencies.';
    }
    if (text.includes('road') || text.includes('pothole')) {
      return 'Road and pothole complaints are classified as High Priority. They are routed to the Public Works Department, and the expected resolution time is 1-3 days.';
    }
    if (text.includes('track') || text.includes('status') || text.includes('history')) {
      return 'You can track all your complaints by clicking on "History" in the sidebar. There you will see real-time updates as the status changes from Pending to In-Progress to Resolved.';
    }
    if (text.includes('health') || text.includes('hospital') || text.includes('accident')) {
      return 'Health Care and Road Accident issues are classified as Urgent Priority! They are sent directly to the Emergency Response or Medical departments with an expected response time of 1-4 hours.';
    }
    if (text.includes('politician') || text.includes('neta')) {
      return 'You can find information about your local politicians by clicking on "Know your Politician" in the sidebar, which takes you to MyNeta.info.';
    }
    
    return "That's a great question! While I'm still learning, you can usually find most information in the 'About' section, or you can try asking me about filing complaints, categories, or tracking your issues.";
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: generateAIResponse(userMsg.text),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <div className={styles.headerIconWrapper}>
          <Bot size={28} className={styles.headerIcon} />
        </div>
        <div className={styles.headerText}>
          <h1>AI Guide & Assistant</h1>
          <p>Get instant help navigating the civic platform</p>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messagesArea}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                msg.role === 'user' ? styles.messageWrapperUser : ''
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`${styles.avatar} ${
                  msg.role === 'user' ? styles.avatarUser : styles.avatarAi
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`${styles.messageBubble} ${
                  msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAi
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className={styles.messageWrapper}>
              <div className={`${styles.avatar} ${styles.avatarAi}`}>
                <Bot size={16} />
              </div>
              <div className={`${styles.messageBubble} ${styles.messageBubbleAi} ${styles.typingIndicator}`}>
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                className={styles.suggestionBtn}
                onClick={() => handleSuggestionClick(sug)}
              >
                <Sparkles size={12} /> {sug}
              </button>
            ))}
          </div>
          <form className={styles.inputForm} onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about NagarSeva AI..."
              className={styles.textInput}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

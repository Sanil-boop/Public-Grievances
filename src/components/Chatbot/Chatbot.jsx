import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import styles from './Chatbot.module.css';

const PREDEFINED_RESPONSES = [
  { keywords: ['status', 'track', 'where is my complaint', 'complaint status'], reply: 'You can track the live status of your complaints in the "History" tab on your dashboard. Each complaint shows real-time updates from the assigned department.' },
  { keywords: ['pothole', 'road', 'street', 'highway', 'footpath'], reply: 'Pothole and road issues are routed to the Public Works Department (PWD). We escalate them if not resolved within 72 hours. You can upload a photo for faster resolution!' },
  { keywords: ['garbage', 'trash', 'waste', 'dump', 'kachra', 'safai'], reply: 'Solid waste management falls under the Health & Sanitation department. You can upload a photo of the garbage dump to file a complaint instantly.' },
  { keywords: ['water', 'pani', 'pipeline', 'supply', 'leakage', 'tap', 'nala'], reply: 'Water-related complaints are handled by the Water Supply Department. For pipeline bursts or contamination, use the SOS emergency button for faster response.' },
  { keywords: ['electricity', 'bijli', 'power', 'light', 'pole', 'transformer', 'wire'], reply: 'Electricity issues are forwarded to the Power Distribution department. For exposed wires or downed poles, please use the SOS emergency button — these are life-threatening!' },
  { keywords: ['drainage', 'sewer', 'gutter', 'naali', 'flooding', 'waterlogging'], reply: 'Drainage and sewage issues are managed by the Drainage Department. During monsoon season, these get auto-escalated due to flood risk.' },
  { keywords: ['noise', 'loud', 'speaker', 'dj', 'construction noise', 'shor'], reply: 'Noise complaints are routed to the local Police and Environment Department. Provide the time and location for quicker action.' },
  { keywords: ['corporator', 'politician', 'mla', 'who is', 'neta', 'representative'], reply: 'You can look up your local corporator using the "Know your Politician" button at the top of the app! It links to MyNeta.info for transparent data.' },
  { keywords: ['file', 'new complaint', 'register', 'submit', 'report', 'darj'], reply: 'To file a new complaint, click "File Complaint" on the Dashboard or use the sidebar. Our AI will automatically classify and route it to the right department!' },
  { keywords: ['emergency', 'sos', 'urgent', 'help', 'bachao', 'jaan'], reply: '🚨 For emergencies, use the SOS button in the header. It immediately alerts emergency services. For life-threatening situations, also call 112.' },
  { keywords: ['heatmap', 'hotspot', 'area', 'zone', 'prediction'], reply: 'Check the Predictive Heatmap page from the sidebar to see complaint hotspots across zones. It also shows AI predictions for upcoming surges.' },
  { keywords: ['whatsapp', 'chat', 'bot', 'message'], reply: 'You can file complaints via WhatsApp-style chat! Head to "WhatsApp Mode" from the Dashboard or sidebar.' },
  { keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening'], reply: 'Namaste! 🙏 I am your NagarSeva AI Assistant. How can I help you today? You can ask me about complaints, tracking, or city services.' },
  { keywords: ['thank', 'thanks', 'dhanyavaad', 'shukriya'], reply: 'You\'re welcome! 😊 Happy to help. Remember, an active citizen makes a better city! 🏙️' },
  { keywords: ['offline', 'no internet', 'draft'], reply: 'NagarSeva AI supports offline drafts! When you\'re offline, your complaints are saved locally and synced when you reconnect. Check the "Offline Drafts" panel on your Dashboard.' },
];

const QUICK_REPLIES = [
  { label: '📋 Track Complaint', text: 'How do I track my complaint status?' },
  { label: '📝 File New', text: 'How do I file a new complaint?' },
  { label: '🚨 Emergency', text: 'I have an emergency, what should I do?' },
  { label: '❓ FAQs', text: 'What kind of issues can I report?' },
];

function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Namaste! 🙏 I am your NagarSeva AI Assistant. How can I help you today?', isBot: true, time: formatTime(new Date()) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping, scrollToBottom]);

  const processMessage = useCallback((userText) => {
    const lowerText = userText.toLowerCase();
    let botReply = "I'm sorry, I didn't quite catch that. Try asking about:\n• Complaint tracking\n• Filing new complaints\n• Water, electricity, or road issues\n• Emergency services\n• Heatmap predictions";

    for (const item of PREDEFINED_RESPONSES) {
      if (item.keywords.some(kw => lowerText.includes(kw))) {
        botReply = item.reply;
        break;
      }
    }

    return botReply;
  }, []);

  const handleSend = useCallback((text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const now = new Date();
    setMessages(prev => [...prev, { text: messageText, isBot: false, time: formatTime(now) }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = processMessage(messageText);
      setIsTyping(false);
      setMessages(prev => [...prev, { text: botReply, isBot: true, time: formatTime(new Date()) }]);
    }, 1200);
  }, [input, processMessage]);

  const handleQuickReply = useCallback((quickReply) => {
    handleSend(quickReply.text);
  }, [handleSend]);

  return (
    <>
      <button
        className={`${styles.fab} ${isOpen ? styles.fabHidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare size={24} />
        <span className={styles.fabPulse} />
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerAvatar}>🤖</div>
              <div className={styles.headerInfo}>
                <span className={styles.headerTitle}>NagarSeva AI</span>
                <span className={styles.headerStatus}>
                  <span className={styles.statusDot} /> Online
                </span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.messageWrapper} ${msg.isBot ? styles.messageBot : styles.messageUser}`}>
                <div className={styles.messageBubble}>
                  {msg.text}
                </div>
                <span className={styles.messageTime}>{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageWrapper} ${styles.messageBot}`}>
                <div className={`${styles.messageBubble} ${styles.typingBubble}`}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className={styles.quickReplies}>
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.label}
                className={styles.quickReplyBtn}
                onClick={() => handleQuickReply(qr)}
              >
                {qr.label}
              </button>
            ))}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className={styles.input}
            />
            <button className={styles.sendBtn} onClick={() => handleSend()} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

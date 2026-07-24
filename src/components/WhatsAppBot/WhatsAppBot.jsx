import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, MapPin, Send, CheckCircle } from 'lucide-react';
import { classifyComplaint } from '../../nlp/classifier';
import styles from './WhatsAppBot.module.css';

const WELCOME_MESSAGES = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: 'Namaste! 🙏 Welcome to NagarSeva AI WhatsApp Service.',
    type: 'text',
    timestamp: new Date(),
  },
  {
    id: 'welcome-2',
    sender: 'bot',
    text: "You can file a civic complaint right here. Just describe your issue, and I'll handle the rest!",
    type: 'text',
    timestamp: new Date(),
  },
  {
    id: 'welcome-3',
    sender: 'bot',
    text: 'Type your complaint, attach a photo 📸, or share your location 📍',
    type: 'text',
    timestamp: new Date(),
  },
];

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const bubbleVariants = {
  initial: { opacity: 0, y: 14, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function WhatsAppBot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(WELCOME_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, { ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date() }]);
  };

  const simulateBotReply = (replyMessages) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      replyMessages.forEach((msg, i) => {
        setTimeout(() => addMessage(msg), i * 400);
      });
    }, 1500);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    addMessage({ sender: 'user', text, type: 'text' });

    if (awaitingConfirmation && /^yes$/i.test(text)) {
      setAwaitingConfirmation(false);
      simulateBotReply([
        {
          sender: 'bot',
          text: `Complaint filed successfully! Your tracking ID is CMP-${Date.now().toString().slice(-6)}. You'll receive updates right here.`,
          type: 'success',
        },
      ]);
      return;
    }

    if (awaitingConfirmation) {
      setAwaitingConfirmation(false);
      simulateBotReply([
        { sender: 'bot', text: 'No worries! Feel free to describe another complaint whenever you\'re ready.', type: 'text' },
      ]);
      return;
    }

    const result = classifyComplaint(text);

    simulateBotReply([
      {
        sender: 'bot',
        text: 'I\'ve analyzed your complaint. Here\'s what I found:',
        type: 'text',
      },
      {
        sender: 'bot',
        text: '',
        type: 'classification',
        classification: result,
      },
      {
        sender: 'bot',
        text: 'Should I file this complaint? Reply YES to confirm.',
        type: 'text',
      },
    ]);
    setAwaitingConfirmation(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      addMessage({ sender: 'user', text: '📸 Photo attached', type: 'image', image: ev.target.result });
      simulateBotReply([
        { sender: 'bot', text: 'Got it! I can see the photo. Please describe the issue so I can classify it properly.', type: 'text' },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLocation = () => {
    addMessage({ sender: 'user', text: 'Current Location 📍', type: 'location' });
    simulateBotReply([
      { sender: 'bot', text: 'Location received! I\'ll tag this to your area. Now describe the complaint.', type: 'text' },
    ]);
  };

  const renderBubbleContent = (msg) => {
    switch (msg.type) {
      case 'image':
        return (
          <>
            {msg.text && <div>{msg.text}</div>}
            {msg.image && <img src={msg.image} alt="Attached" className={styles.imagePreview} />}
          </>
        );

      case 'location':
        return (
          <div className={styles.locationTag}>
            <MapPin size={16} />
            {msg.text}
          </div>
        );

      case 'classification': {
        const c = msg.classification;
        if (!c) return null;
        return (
          <div className={styles.classificationCard}>
            <div className={styles.classificationHeader}>🔍 AI Classification</div>
            <div className={styles.classRow}>
              <span className={styles.classLabel}>Category</span>
              <span className={styles.classValue}>{c.topCategoryName}</span>
            </div>
            <div className={styles.classRow}>
              <span className={styles.classLabel}>Department</span>
              <span className={styles.classValue}>{c.department?.name || c.department?.department || '—'}</span>
            </div>
            <div className={styles.classRow}>
              <span className={styles.classLabel}>Confidence</span>
              <span className={styles.classValue}>{(c.topConfidence * 100).toFixed(1)}%</span>
            </div>
            <div className={styles.confidenceBar}>
              <div className={styles.confidenceFill} style={{ width: `${c.topConfidence * 100}%` }} />
            </div>
          </div>
        );
      }

      case 'success':
        return (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircle size={18} />
            </div>
            <div className={styles.successText}>{msg.text}</div>
          </div>
        );

      default:
        return <span>{msg.text}</span>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.avatar}>🤖</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>NagarSeva Bot</div>
          <div className={styles.headerStatus}>
            <span className={styles.onlineDot} />
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesArea}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`${styles.messageRow} ${msg.sender === 'bot' ? styles.messageRowBot : styles.messageRowUser}`}
              variants={bubbleVariants}
              initial="initial"
              animate="animate"
              layout
            >
              <div className={`${styles.bubble} ${msg.sender === 'bot' ? styles.bubbleBot : styles.bubbleUser}`}>
                {renderBubbleContent(msg)}
                <div className={styles.timestamp}>{formatTime(msg.timestamp)}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className={`${styles.messageRow} ${styles.messageRowBot}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={`${styles.bubble} ${styles.bubbleBot}`}>
              <div className={styles.typingIndicator}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className={styles.inputBar}>
        <button className={styles.iconButton} onClick={() => fileInputRef.current?.click()} aria-label="Attach photo">
          <Camera size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handlePhotoUpload}
        />
        <button className={styles.iconButton} onClick={handleLocation} aria-label="Share location">
          <MapPin size={20} />
        </button>
        <input
          className={styles.textInput}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className={styles.sendButton} onClick={handleSend} aria-label="Send message">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

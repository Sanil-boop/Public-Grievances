import React, { useState } from 'react';
import { PieChart, Vote } from 'lucide-react';
import styles from './PollWidget.module.css';

const MOCK_POLL = {
  id: 1,
  question: 'Where should we allocate the remaining ₹50 Lakh Ward Budget?',
  options: [
    { id: 'opt1', text: 'Road Repairs', votes: 124 },
    { id: 'opt2', text: 'New Streetlights', votes: 85 },
    { id: 'opt3', text: 'Public Park Upgrades', votes: 201 },
    { id: 'opt4', text: 'Drainage Clearance', votes: 156 }
  ]
};

export default function PollWidget() {
  const [hasVoted, setHasVoted] = useState(false);
  const [pollData, setPollData] = useState(MOCK_POLL);
  const [selectedOption, setSelectedOption] = useState(null);

  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = () => {
    if (!selectedOption || hasVoted) return;

    setPollData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
    setHasVoted(true);
  };

  return (
    <div className={styles.pollCard}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Vote size={20} />
        </div>
        <h3>Community Poll</h3>
      </div>
      
      <p className={styles.question}>{pollData.question}</p>
      
      <div className={styles.optionsList}>
        {pollData.options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div 
              key={opt.id} 
              className={`${styles.option} ${hasVoted ? styles.optionVoted : ''} ${selectedOption === opt.id ? styles.optionSelected : ''}`}
              onClick={() => !hasVoted && setSelectedOption(opt.id)}
            >
              <div className={styles.optionContent}>
                <span className={styles.optionText}>{opt.text}</span>
                {hasVoted && <span className={styles.optionPercent}>{percentage}%</span>}
              </div>
              {hasVoted && (
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${percentage}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {!hasVoted ? (
        <button 
          className={styles.voteBtn} 
          disabled={!selectedOption}
          onClick={handleVote}
        >
          Submit Vote
        </button>
      ) : (
        <div className={styles.thankYou}>
          <PieChart size={16} /> Thank you for participating!
        </div>
      )}
    </div>
  );
}

// src/components/AIBlocks.js
import React from "react";
import './AIBlocks.css'; // Dedicated CSS for AIBlocks

// Helper function to format peak hours
const formatPeakHours = (peakHours) => {
  if (!peakHours || peakHours.length === 0) {
    return "No consistent peak focus time detected yet.";
  }
  const sortedHours = peakHours.sort((a, b) => b.minutes - a.minutes);
  const topHour = sortedHours[0];
  const nextHours = sortedHours.slice(1, 3); // Get next two for a range if desired

  let description = `Your highest focus is often around ${topHour.hour}:00 - ${topHour.hour + 1}:00.`;
  if (nextHours.length > 0) {
    const hoursText = nextHours.map(h => `${h.hour}:00`).join(', ');
    description += ` Other strong periods include ${hoursText}.`;
  }
  description += " Consider scheduling important tasks during these times.";
  return description;
};

// Helper function for energy pattern
const formatEnergyPattern = (energyPattern, recommendedBreak) => {
    if (!energyPattern || energyPattern.message === "no data") {
        return `We need more session data to analyze your energy pattern. Keep studying!`;
    }
    const median = energyPattern.median || recommendedBreak; // Use recommendedBreak if median is 0 or undefined
    const suggestion = energyPattern.suggestion || `Try taking a ${recommendedBreak}-minute break every ${median} minutes to maintain optimal focus.`;
    return `You tend to focus for about ${median} minutes per session. ${suggestion}`;
};


export default function AIBlocks({ peakHours, energyPattern, recommendedBreak }) {
  // Define insight blocks based on the data received as props
  const blocks = [
    {
      title: "Focus Optimization",
      // Use the helper function to create a dynamic description for peak hours
      desc: formatPeakHours(peakHours),
      button: "Adjust Schedule",
      icon: "💡",
    },
    {
      title: "Energy Pattern Analysis",
      // Use the helper function for dynamic energy pattern description
      desc: formatEnergyPattern(energyPattern, recommendedBreak),
      button: "Learn More",
      icon: "⚡",
    },
    {
      title: "Recommended Break",
      desc: `Based on your focus patterns, a ${recommendedBreak}-minute break is recommended after each study session to recharge effectively.`,
      button: "Customize Settings",
      icon: "☕",
    },
    {
      title: "Study Habit Insight",
      // This block could combine other insights or prompt for more data.
      // For now, a placeholder if other complex AI insights are not ready.
      desc: "We're constantly learning from your study habits to provide more personalized recommendations. Keep logging your sessions!",
      button: "View All Insights",
      icon: "🧠",
    },
  ];

  return (
    <div className="ai-blocks-grid"> {/* Use a CSS class for grid layout */}
      {blocks.map((b, index) => (
        <div key={index} className="ai-block-card"> {/* Use CSS classes for styling */}
          <div className="ai-block-header">
            <div className="ai-block-icon">{b.icon}</div>
            <h4 className="ai-block-title">{b.title}</h4>
          </div>
          <p className="ai-block-description">{b.desc}</p>
          {b.button && (
            <button className="ai-block-button">
              {b.button}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
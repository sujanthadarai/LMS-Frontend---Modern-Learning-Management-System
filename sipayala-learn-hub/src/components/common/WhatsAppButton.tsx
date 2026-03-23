import React, { useState, useEffect } from 'react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "9816107823";
  const message = "Hello! I need help with your LMS platform.";
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Fade in after 1.5s, stop pulse after 6s
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 1500);
    const t2 = setTimeout(() => setPulse(false), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <style>{`
        @keyframes wa-fade-up {
          from { opacity: 0; transform: translateY(20px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes wa-ring {
          0%,100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(37,211,102,0.55); }
          40%      { transform: scale(1.06); box-shadow: 0 0 0 14px rgba(37,211,102,0);  }
        }
        @keyframes wa-dot {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        .wa-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 20px 13px 16px;
          background: #25D366;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(37,211,102,0.40), 0 2px 8px rgba(0,0,0,0.12);
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.22s ease,
                      background 0.18s ease;
          opacity: 0;
          animation: wa-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
          animation-delay: 0s;
          white-space: nowrap;
          user-select: none;
        }
        .wa-btn.pulse {
          animation: wa-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards,
                     wa-ring 2.2s ease-in-out 0.6s 3;
        }
        .wa-btn:hover {
          transform: translateY(-3px) scale(1.03);
          background: #20b558;
          box-shadow: 0 10px 32px rgba(37,211,102,0.50), 0 4px 12px rgba(0,0,0,0.14);
        }
        .wa-btn:active {
          transform: scale(0.97);
        }
        .wa-icon-wrap {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-online-dot {
          width: 7px;
          height: 7px;
          background: #fff;
          border-radius: 50%;
          flex-shrink: 0;
          animation: wa-dot 1.8s ease-in-out infinite;
        }
        .wa-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.2;
        }
        .wa-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .wa-sublabel {
          font-size: 10px;
          font-weight: 500;
          opacity: 0.82;
          letter-spacing: 0.01em;
        }

        /* Collapsed icon-only on mobile */
        @media (max-width: 480px) {
          .wa-btn {
            padding: 14px;
            border-radius: 50%;
            bottom: 20px;
            right: 20px;
          }
          .wa-text-wrap,
          .wa-online-dot {
            display: none;
          }
          .wa-icon-wrap {
            background: transparent;
            width: 26px;
            height: 26px;
          }
        }
      `}</style>

      {visible && (
        <button
          className={`wa-btn${pulse ? ' pulse' : ''}`}
          onClick={handleClick}
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <div className="wa-icon-wrap">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
              <path d="M19.077,4.928C17.191,3.041,14.683,2,12.006,2c-5.514,0-10,4.486-10,10c0,1.786,0.471,3.537,1.364,5.066L2,22l5.059-1.314C8.558,21.523,10.267,22,12.006,22c5.514,0,10-4.486,10-10C22.006,7.318,19.095,4.928,19.077,4.928z M12.006,20.273c-1.565,0-3.102-0.421-4.435-1.215l-0.318-0.19l-3.101,0.805l0.828-3.008l-0.207-0.33c-0.874-1.388-1.336-3.002-1.336-4.673c0-4.62,3.759-8.379,8.379-8.379c2.238,0,4.341,0.873,5.921,2.456c1.579,1.579,2.448,3.673,2.448,5.906C20.386,16.514,16.627,20.273,12.006,20.273z M16.289,13.263c-0.225-0.113-1.327-0.655-1.533-0.73c-0.206-0.075-0.356-0.113-0.506,0.113c-0.15,0.225-0.581,0.73-0.712,0.88c-0.131,0.15-0.262,0.169-0.487,0.056c-0.225-0.113-0.951-0.351-1.812-1.118c-0.67-0.597-1.122-1.335-1.254-1.56c-0.131-0.225-0.014-0.347,0.099-0.459c0.101-0.101,0.225-0.263,0.337-0.394c0.112-0.131,0.15-0.225,0.225-0.375c0.075-0.15,0.037-0.281-0.019-0.394c-0.056-0.113-0.506-1.217-0.693-1.666c-0.182-0.435-0.367-0.376-0.506-0.383c-0.131-0.007-0.281-0.007-0.431-0.007c-0.15,0-0.394,0.056-0.6,0.281c-0.206,0.225-0.788,0.77-0.788,1.879c0,1.109,0.807,2.18,0.92,2.331c0.113,0.15,1.577,2.409,3.822,3.378c0.534,0.231,0.951,0.369,1.276,0.473c0.536,0.171,1.024,0.147,1.41,0.089c0.43-0.064,1.327-0.542,1.514-1.066c0.187-0.524,0.187-0.973,0.131-1.066C16.577,13.47,16.444,13.376,16.289,13.263z"/>
            </svg>
          </div>
          <div className="wa-text-wrap">
            <span className="wa-label">Chat with us</span>
            <span className="wa-sublabel">Usually replies instantly</span>
          </div>
        </button>
      )}
    </>
  );
};

export default WhatsAppButton;

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal, Code2, Cpu, Zap } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";

// Python code for the laptop screen
const PYTHON_CODE = `# Career Success Predictor - ML Project
class CareerPredictor:
    def __init__(self):
        self.model = None
        self.features = ['skills_score', 'project_completion']
    
    def train_model(self):
        # Random Forest Classifier
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10
        )
        print("✅ Model trained successfully!")
        return self.model
    
    def predict_success(self, student_data):
        # Predict placement success
        probability = 0.95
        return {
            'will_succeed': True,
            'confidence': probability
        }

# Initialize predictor
predictor = CareerPredictor()
predictor.train_model()

# Test prediction
student = {
    'skills_score': 0.85,
    'project_completion': 0.9
}
result = predictor.predict_success(student)
print(f"🎯 Success Rate: {result['confidence']:.1%}")`;

interface Laptop3DProps {
  isInView: boolean;
}

export default function Laptop3D({ isInView }: Laptop3DProps) {
  const laptopContainerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const topLidRef = useRef<HTMLDivElement>(null);

  const [isLaptopOpen, setIsLaptopOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [isLaptopAnimating, setIsLaptopAnimating] = useState(true);
  const [codeProgress, setCodeProgress] = useState({ line: 0, col: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Laptop functions
  const openLaptop = useCallback(() => {
    setIsLaptopOpen(true);
    setIsTyping(true);
  }, []);

  const closeLaptop = useCallback(() => {
    setIsLaptopOpen(false);
    setIsTyping(false);
    setCodeProgress({ line: 0, col: 0 });
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!hasAnimatedIn) return;
    e.preventDefault();
    setIsDragging(true);
    setMouseStart({ x: e.clientX, y: e.clientY });
    document.body.classList.add('cursor-grabbing');
  }, [hasAnimatedIn]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !hasAnimatedIn) return;
    
    const deltaX = e.clientX - mouseStart.x;
    const deltaY = e.clientY - mouseStart.y;
    const sensitivity = 0.4;
    
    setRotation({
      x: Math.max(-90, Math.min(90, rotation.x + deltaY * sensitivity)),
      y: rotation.y - deltaX * sensitivity
    });
    setMouseStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, mouseStart, rotation, hasAnimatedIn]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.classList.remove('cursor-grabbing');
    }
  }, [isDragging]);

  // Initialize event listeners
  useEffect(() => {
    if (isDragging && hasAnimatedIn) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.classList.remove('cursor-grabbing');
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, hasAnimatedIn]);

  // Code typing animation
  useEffect(() => {
    if (isLaptopOpen && isTyping && hasAnimatedIn) {
      const lines = PYTHON_CODE.split('\n');
      
      const typeNextChar = () => {
        setCodeProgress(prev => {
          if (prev.line >= lines.length) {
            setIsTyping(false);
            return prev;
          }
          if (prev.col >= lines[prev.line].length) {
            return { line: prev.line + 1, col: 0 };
          }
          return { line: prev.line, col: prev.col + 1 };
        });
      };
      
      const typingSpeed = 15;
      const interval = setInterval(typeNextChar, typingSpeed);
      return () => clearInterval(interval);
    }
  }, [isLaptopOpen, isTyping, hasAnimatedIn]);

  // Blinking cursor effect
  useEffect(() => {
    if (isLaptopOpen && hasAnimatedIn) {
      const interval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLaptopOpen, hasAnimatedIn]);

  // Initialize animations
  useEffect(() => {
    if (isInView && !hasAnimatedIn) {
      setTimeout(() => setRotation({ x: -12, y: 22 }), 300);
      setTimeout(() => setHasAnimatedIn(true), 1200);
      setTimeout(() => {
        setIsLaptopAnimating(true);
        openLaptop();
        setTimeout(() => setIsLaptopAnimating(false), 700);
      }, 1200);
    }
  }, [isInView, hasAnimatedIn, openLaptop]);

  // Styles
  const laptopStyle = {
    transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transformOrigin: '50% 50% 4.42234375em',
    transformStyle: 'preserve-3d' as const,
    transition: isDragging ? 'none' : hasAnimatedIn ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };

  const topLidStyle = {
    transform: isLaptopOpen ? 'rotateX(-48deg)' : 'rotateX(-138deg)',
    transformOrigin: '0 12.5em',
    transition: isLaptopAnimating 
      ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const shadowStyle = {
    transform: `rotateX(${Math.max(-90, Math.min(0, rotation.x * 0.7))}deg) rotateY(${rotation.y * 0.7}deg)`,
    opacity: 0.2 - Math.abs(rotation.y) * 0.002,
    filter: 'blur(12px)',
    transition: isDragging ? 'none' : hasAnimatedIn ? 'transform 0.2s ease' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };

  // Render code with typing animation
  const renderCodeWithTyping = () => {
    const lines = PYTHON_CODE.split('\n');
    
    return lines.slice(0, 15).map((line, lineIndex) => {
      const isCurrentLine = lineIndex === codeProgress.line;
      const visibleLength = isCurrentLine && isTyping ? codeProgress.col : line.length;
      const visibleText = line.substring(0, visibleLength);
      
      const getLineStyle = (text: string): string => {
        const trimmed = text.trim();
        if (trimmed.startsWith('#')) return "text-gray-500 italic";
        if (trimmed.startsWith('class ') || trimmed.startsWith('def ')) return "text-blue-400 font-medium";
        if (trimmed.includes('print')) return "text-green-400";
        if (trimmed.includes('return')) return "text-yellow-400";
        return "text-gray-300";
      };

      return (
        <div key={lineIndex} className="flex">
          <span className="text-gray-600 text-[11px] w-6 text-right pr-2 select-none font-mono">
            {lineIndex + 1}
          </span>
          <div className={`text-[11px] font-mono leading-5 ${getLineStyle(line)}`}>
            {visibleText}
            {isCurrentLine && isTyping && visibleLength < line.length && cursorVisible && (
              <span className="inline-block w-[2px] h-4 bg-green-400 ml-0.5 animate-pulse" />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative flex flex-col items-center justify-center"
    >
      {/* 3D Laptop Container */}
      <div 
        ref={laptopContainerRef}
        className="relative w-full max-w-md h-[280px] md:h-[320px] lg:h-[360px] flex items-center justify-center"
      >
        {/* Dynamic Shadow */}
        <div 
          className="absolute -bottom-4 w-[85%] h-20 bg-gradient-to-t from-black/30 via-black/15 to-transparent blur-2xl rounded-full"
          style={shadowStyle}
        />
        <div 
          className="absolute -bottom-2 w-[90%] h-12 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent blur-xl rounded-xl"
          style={{
            ...shadowStyle,
            opacity: 0.15,
            filter: 'blur(20px)'
          }}
        />

        {/* 3D Laptop */}
        <div
          ref={laptopRef}
          className={`relative w-[20em] max-w-[85%] h-[26em] ${!hasAnimatedIn ? 'cursor-default' : (isDragging ? 'cursor-grabbing' : 'cursor-grab')} select-none`}
          style={laptopStyle}
          onMouseDown={handleMouseDown}
        >
          {/* Top Lid */}
          <div 
            ref={topLidRef}
            className="absolute w-full h-[13em] origin-bottom"
            style={topLidStyle}
          >
            {/* Top Outside */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[10px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-30" />
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                <div className="text-[6px] text-gray-500 font-semibold tracking-widest">SIPALAYA</div>
              </div>
            </div>
            
            {/* Screen */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-gray-900 rounded-[8px] shadow-2xl overflow-hidden">
              {/* Bezel */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gray-900">
                <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-gray-800 rounded-b-lg" />
              </div>
              
              {/* Screen Content */}
              <div className="absolute top-3 left-0 right-0 bottom-0 bg-gray-950">
                {/* VS Code Header */}
                <div className="h-7 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center px-4 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/90"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/90"></div>
                  </div>
                  <div className="ml-4 text-[10px] text-gray-300 font-mono flex-1">
                    <span className="text-green-400">sipalaya/</span>
                    <span className="text-amber-300">ml_project.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-gray-400" />
                    <Terminal className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
                
                {/* Code Editor */}
                <div className="absolute top-7 left-0 right-0 bottom-0 flex">
                  <div className="w-8 bg-gray-900/80 border-r border-gray-800 pt-3 text-right pr-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="text-[10px] text-gray-500 font-mono">{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex-1 pt-3 pl-3 overflow-auto">
                    {renderCodeWithTyping()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Base */}
          <div className="absolute top-[13em] w-full h-[13em] origin-top">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-300 rounded-[10px] overflow-hidden">
              <div className="absolute inset-2 bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg">
                {/* Keyboard placeholder */}
                <div className="absolute inset-3 grid grid-cols-10 gap-1">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="h-2 bg-gray-200 rounded-sm" />
                  ))}
                </div>
                {/* Trackpad */}
                <div className="absolute bottom-4 left-1/3 right-1/3 h-4 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.8 }}
        className="mt-6 flex flex-col items-center gap-3"
      >
        <div className="flex gap-2">
          <Button
            onClick={openLaptop}
            variant={isLaptopOpen ? "default" : "outline"}
            size="sm"
            className="h-8 px-4 text-xs"
            disabled={!hasAnimatedIn}
          >
            <Terminal className="w-3 h-3 mr-1" />
            {isLaptopOpen ? 'Running' : 'Start Coding'}
          </Button>
          <Button
            onClick={closeLaptop}
            variant={!isLaptopOpen ? "default" : "outline"}
            size="sm"
            className="h-8 px-4 text-xs"
            disabled={!hasAnimatedIn}
          >
            <Code2 className="w-3 h-3 mr-1" />
            Close
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Interactive
          </span>
          <span>•</span>
          <span>Drag to rotate</span>
          <span>•</span>
          <span>Live typing</span>
        </div>
      </motion.div>

      {/* Professional Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Professional Development Environment • Python ML Project
        </p>
      </motion.div>
    </motion.div>
  );
}
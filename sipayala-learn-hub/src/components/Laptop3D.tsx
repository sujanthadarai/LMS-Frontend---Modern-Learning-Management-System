import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal, Code2, Cpu, Zap } from "lucide-react";

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
        probability = 0.95  # Example confidence
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

// Model Component
function Model({ isLaptopOpen, isRotating, setIsRotating }: any) {
  const groupRef = useRef<any>();
  
  // Load the GLB model - with error handling
  let gltf: any = null;
  try {
    gltf = useGLTF('/models/asus_rog_flow_x16.glb');
  } catch (error) {
    console.error('Error loading 3D model:', error);
  }
  
  // Auto-rotate animation
  useFrame(() => {
    if (isRotating && groupRef.current && gltf) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // If model fails to load, show a fallback
  if (!gltf) {
    return (
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 0.2, 2]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <Html position={[0, 0.5, 1]}>
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            Failed to load 3D model
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group 
      ref={groupRef}
      position={[0, -1, 0]}
      scale={[1.5, 1.5, 1.5]}
    >
      <primitive object={gltf.scene} />
      
      {/* Laptop Screen HTML Overlay */}
      {isLaptopOpen && (
        <Html
          position={[0, 0.4, -0.15]}
          transform
          distanceFactor={2}
          rotation={[0, 0, 0]}
          scale={0.12}
        >
          <div className="w-[800px] h-[500px] bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            {/* VS Code Title Bar */}
            <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center px-4 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-xs text-gray-300 font-mono">
                <span className="text-green-400">sipalaya/</span>
                <span className="text-yellow-300">ml_project.py</span>
              </div>
              <div className="ml-auto flex gap-2">
                <Cpu className="w-3 h-3 text-blue-400" />
                <Terminal className="w-3 h-3 text-gray-400" />
              </div>
            </div>
            
            {/* Code Editor */}
            <div className="flex h-[calc(100%-2rem)]">
              {/* Line Numbers */}
              <div className="w-12 bg-gray-800/50 text-right pr-2 py-2 text-xs text-gray-500 font-mono border-r border-gray-700">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              
              {/* Code Content */}
              <div className="flex-1 p-2 overflow-auto">
                {PYTHON_CODE.split('\n').map((line, i) => {
                  const getLineColor = () => {
                    if (line.includes('#')) return 'text-gray-500';
                    if (line.includes('class') || line.includes('def')) return 'text-blue-400';
                    if (line.includes('print')) return 'text-green-400';
                    if (line.includes('return')) return 'text-yellow-400';
                    return 'text-gray-300';
                  };
                  
                  return (
                    <div key={i} className="flex">
                      <span className="text-gray-600 w-8 text-xs">{i + 1}</span>
                      <span className={`text-xs font-mono ${getLineColor()}`}>
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="h-6 bg-gray-800 border-t border-gray-700 px-4 flex items-center text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Python 3.11
              </span>
              <span className="mx-4">|</span>
              <span>UTF-8</span>
              <span className="mx-4">|</span>
              <span className="text-blue-400">Ready</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Missing useFrame import
import { useFrame } from "@react-three/fiber";

// Loading Fallback
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading 3D Model...</p>
      </div>
    </div>
  );
}

// Main Laptop3D Component
interface Laptop3DProps {
  isInView: boolean;
}

export default function Laptop3D({ isInView }: Laptop3DProps) {
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsLaptopOpen(true);
        setHasAnimated(true);
      }, 1000);
      
      const rotateTimer = setTimeout(() => {
        setIsRotating(false);
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(rotateTimer);
      };
    }
  }, [isInView, hasAnimated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center"
    >
      <Canvas
        camera={{ position: [2, 1, 5], fov: 45 }}
        className="rounded-xl"
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />
          <Environment preset="city" />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
          />
          
          <Model 
            isLaptopOpen={isLaptopOpen} 
            isRotating={isRotating}
            setIsRotating={setIsRotating}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading Overlay */}
      <Suspense fallback={<LoadingFallback />}>
        <div style={{ display: 'none' }}></div>
      </Suspense>
      
      {/* Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLaptopOpen(!isLaptopOpen)}
          className="text-xs"
        >
          <Terminal className="w-3 h-3 mr-1" />
          {isLaptopOpen ? 'Close' : 'Open'} Laptop
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsRotating(!isRotating)}
          className="text-xs"
        >
          <Zap className="w-3 h-3 mr-1" />
          {isRotating ? 'Stop' : 'Start'} Rotating
        </Button>
      </motion.div>
      
      {/* Info Overlay */}
      <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-foreground">ASUS ROG Flow X16</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Interactive 3D Model</span>
        </div>
      </div>
    </motion.div>
  );
}
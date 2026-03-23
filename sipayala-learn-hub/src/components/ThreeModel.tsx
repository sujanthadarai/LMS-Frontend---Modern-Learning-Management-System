import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Custom Sipalaya Python code to display on screen
const PYTHON_CODE = `# Sipalaya AI - Career Success Predictor
# ╔═══════════════════════════════════════════╗
# ║     Sipalaya Tech Institute - Nepal       ║
# ║     AI-Powered Career Assistant v2.0       ║
# ╚═══════════════════════════════════════════╝

import torch
import sipalaya_ai
from sipalaya_models import CareerPredictor
from sipalaya_analytics import StudentSuccess

class SipalayaCareerAssistant:
    """
    ███████╗██╗██████╗  █████╗ ██╗      █████╗ ██╗   ██╗ █████╗ 
    ██╔════╝██║██╔══██╗██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔══██╗
    ███████╗██║██████╔╝███████║██║     ███████║ ╚████╔╝ ███████║
    ╚════██║██║██╔═══╝ ██╔══██║██║     ██╔══██║  ╚██╔╝  ██╔══██║
    ███████║██║██║     ██║  ██║███████╗██║  ██║   ██║   ██║  ██║
    ╚══════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
    """
    
    def __init__(self, student_name="Sipalaya Student"):
        self.student_name = student_name
        self.model = CareerPredictor.from_pretrained("sipalaya/career-v2")
        self.success_rate = 0
        self.sipalaya_batch = "2024 AI/ML"
        
    def analyze_student_potential(self, skills, projects, attendance):
        """Analyze student potential using Sipalaya's proprietary algorithm"""
        
        # Sipalaya's unique success metrics
        sipalaya_score = (
            skills * 0.4 +
            projects * 0.35 +
            attendance * 0.25
        ) * 100
        
        # Get prediction from trained model
        prediction = self.model.predict({
            'skills_score': skills,
            'projects_completed': projects,
            'attendance_rate': attendance,
            'institute': 'Sipalaya'
        })
        
        return {
            'student': self.student_name,
            'sipalaya_score': f"{sipalaya_score:.1f}%",
            'success_probability': f"{prediction * 100:.1f}%",
            'recommended_stack': ['Python', 'PyTorch', 'Django', 'React'],
            'batch': self.sipalaya_batch
        }

# Initialize Sipalaya AI
sipalaya_ai = SipalayaCareerAssistant("Ram Sharma")

# Analyze student performance
result = sipalaya_ai.analyze_student_potential(
    skills=0.92,
    projects=0.88,
    attendance=0.95
)

print("🎯 Sipalaya Success Analysis:")
print(f"🏫 Institute: Sipalaya Tech Institute")
print(f"👨‍🎓 Student: {result['student']}")
print(f"📊 Sipalaya Score: {result['sipalaya_score']}")
print(f"🚀 Success Probability: {result['success_probability']}")
print(f"💻 Recommended: {', '.join(result['recommended_stack'])}")
print("⭐ Sipalaya - Shaping Nepal's Tech Future!")

# Generate success roadmap
roadmap = sipalaya_ai.model.generate_roadmap(
    target_role="AI Engineer",
    duration_months=6,
    institute="Sipalaya"
)

print("🗺️ Your 6-Month Success Roadmap:")
for i, milestone in enumerate(roadmap, 1):
    print(f"  {i}. {milestone}")
`;

const ThreeModel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const screenRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      40,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    camera.position.set(0, 1.6, 10);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0.2;
    controls.maxDistance = 15;
    controls.minDistance = 6;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // Create canvas for code display with Sipalaya branding
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark theme background with Sipalaya gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.5, '#1a1a3a');
      gradient.addColorStop(1, '#0a0a1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add Sipalaya watermark
      ctx.globalAlpha = 0.1;
      ctx.font = 'bold 120px "Arial Black", sans-serif';
      ctx.fillStyle = '#4f9eff';
      ctx.fillText('SIPALAYA', 400, 800);
      ctx.globalAlpha = 1;
      
      const lines = PYTHON_CODE.split('\n');
      const fontSize = 24;
      ctx.font = `${fontSize}px "Courier New", monospace`;
      
      lines.forEach((line, index) => {
        const y = 45 + index * 30;
        
        // Enhanced syntax highlighting with Sipalaya colors
        if (line.includes('Sipalaya') || line.includes('sipalaya')) {
          ctx.fillStyle = '#ff9900'; // Sipalaya orange
          ctx.font = `bold ${fontSize}px "Courier New", monospace`;
        } else if (line.trim().startsWith('#')) {
          ctx.fillStyle = '#6a9955'; // Comments green
          ctx.font = `${fontSize}px "Courier New", monospace`;
        } else if (line.includes('import ') || line.includes('from ')) {
          ctx.fillStyle = '#c586c0'; // Imports purple
          ctx.font = `${fontSize}px "Courier New", monospace`;
        } else if (line.includes('class ') || line.includes('def ')) {
          ctx.fillStyle = '#569cd6'; // Keywords blue
          ctx.font = `bold ${fontSize}px "Courier New", monospace`;
        } else if (line.includes('return') || line.includes('print')) {
          ctx.fillStyle = '#dcdcaa'; // Functions yellow
          ctx.font = `${fontSize}px "Courier New", monospace`;
        } else if (line.includes('"') || line.includes("'")) {
          ctx.fillStyle = '#ce9178'; // Strings orange
          ctx.font = `${fontSize}px "Courier New", monospace`;
        } else if (line.includes('╔') || line.includes('║') || line.includes('╚')) {
          ctx.fillStyle = '#4f9eff'; // Box drawing characters
          ctx.font = `${fontSize}px "Courier New", monospace`;
        } else {
          ctx.fillStyle = '#d4d4d4'; // Default text
          ctx.font = `${fontSize}px "Courier New", monospace`;
        }
        
        ctx.fillText(line, 45, y);
      });
      
      // Add line numbers with Sipalaya color
      ctx.fillStyle = '#ff9900';
      ctx.globalAlpha = 0.5;
      ctx.font = '20px "Courier New", monospace';
      lines.forEach((_, index) => {
        ctx.fillText((index + 1).toString().padStart(3, ' '), 10, 45 + index * 30);
      });
      ctx.globalAlpha = 1;
      
      // Add Sipalaya logo ASCII at the top
      ctx.fillStyle = '#4f9eff';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('SIPALAYA AI', 1200, 60);
    }

    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(2, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x88aaff, 0.8);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffaa88, 0.5);
    backLight.position.set(0, 2, -5);
    scene.add(backLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      '/models/laptop.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Get model dimensions
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const targetHeight = 1.9;
        const scale = targetHeight / size.y;
        model.scale.setScalar(scale);
        
        model.position.set(
          -center.x * scale,
          -center.y * scale + 0.8,
          -center.z * scale
        );
        
        // Find screen and apply texture
        model.traverse((node) => {
          if (node.isMesh) {
            const nodeName = node.name.toLowerCase();
            
            if (nodeName.includes('screen') || nodeName.includes('display') || nodeName.includes('lcd')) {
              if (Array.isArray(node.material)) {
                node.material = node.material.map(mat => {
                  const newMat = mat.clone();
                  newMat.map = screenTexture;
                  newMat.emissive = new THREE.Color(0x1a4f8a);
                  newMat.emissiveIntensity = 0.4;
                  return newMat;
                });
              } else {
                const newMat = node.material.clone();
                newMat.map = screenTexture;
                newMat.emissive = new THREE.Color(0x1a4f8a);
                newMat.emissiveIntensity = 0.4;
                node.material = newMat;
              }
              screenRef.current = node;
            }
            
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach(mat => {
                  mat.roughness = 0.3;
                  mat.metalness = 0.6;
                });
              } else {
                node.material.roughness = 0.3;
                node.material.metalness = 0.6;
              }
            }
          }
        });

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[450px] md:h-[550px] lg:h-[650px]"
      style={{ 
        background: 'transparent',
        cursor: 'grab'
      }}
    />
  );
};

export default ThreeModel;
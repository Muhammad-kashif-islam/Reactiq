import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFrown } from 'react-icons/fi';

export function NotFoundPagee() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full  overflow-hidden transition-all duration-300 ">
        <div className="p-8 text-center">
          <div className="inline-block mb-6 animate-bounce">
            <FiFrown className="text-6xl text-black" />
          </div>
          
          <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className=" p-4 text-center">
          <p className="text-sm text-indigo-800">
            Need help? <a href="#" className="font-medium hover:underline">Contact support</a>
          </p>
        </div>
      </div>
      <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-indigo-200 opacity-20 -z-10"></div>
      <div className="fixed bottom-20 right-10 w-48 h-48 rounded-full bg-blue-200 opacity-20 -z-10"></div>
      <div className="fixed top-1/3 right-1/4 w-16 h-16 rounded-full bg-purple-200 opacity-30 -z-10"></div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
import {  FiHome } from 'react-icons/fi';

export default function NotFoundPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    rocks: [],
    stars: [],
    earthPosition: 95,
    rocketPosition: 50,
    score: 0,
    keys: { left: false, right: false }
  });

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Initialize stars
    for (let i = 0; i < 100; i++) {
      gameStateRef.current.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 1 + 0.5
      });
    }

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') gameStateRef.current.keys.left = true;
      if (e.key === 'ArrowRight') gameStateRef.current.keys.right = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') gameStateRef.current.keys.left = false;
      if (e.key === 'ArrowRight') gameStateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const draw = () => {
      const state = gameStateRef.current;
      
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      ctx.fillStyle = '#ffffff';
      state.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw Earth at the bottom
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height * state.earthPosition / 100, 40, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * state.earthPosition / 100, 0,
        canvas.width / 2, canvas.height * state.earthPosition / 100, 40
      );
      gradient.addColorStop(0, '#22d3ee');
      gradient.addColorStop(0.7, '#0891b2');
      gradient.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw continents
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 15, canvas.height * state.earthPosition / 100 - 10, 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 20, canvas.height * state.earthPosition / 100 + 15, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 25, canvas.height * state.earthPosition / 100 + 20, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw clouds on Earth
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 20, canvas.height * state.earthPosition / 100 - 10, 6, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2 + 15, canvas.height * state.earthPosition / 100 + 5, 8, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2 - 10, canvas.height * state.earthPosition / 100 + 15, 5, 0, Math.PI * 2);
      ctx.fill();

      // Update rocket position based on keys
      if (state.keys.left) state.rocketPosition = Math.max(state.rocketPosition - 3, 5);
      if (state.keys.right) state.rocketPosition = Math.min(state.rocketPosition + 3, 95);

      // Draw rocket with improved design
      ctx.save();
      ctx.translate(canvas.width * state.rocketPosition / 100, canvas.height / 2);
      
      // Rocket body
      const rocketGradient = ctx.createLinearGradient(0, -20, 0, 20);
      rocketGradient.addColorStop(0, '#cbd5e1');
      rocketGradient.addColorStop(1, '#94a3b8');
      ctx.fillStyle = rocketGradient;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(12, 20);
      ctx.lineTo(-12, 20);
      ctx.closePath();
      ctx.fill();
      
      // Rocket details
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(12, 20);
      ctx.lineTo(-12, 20);
      ctx.closePath();
      ctx.stroke();
      
      // Rocket window
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Rocket flames
      const flameGradient = ctx.createLinearGradient(0, 20, 0, 35);
      flameGradient.addColorStop(0, '#f97316');
      flameGradient.addColorStop(1, '#f59e0b');
      
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.moveTo(-8, 20);
      ctx.lineTo(0, 30 + Math.random() * 5); // Animated flame
      ctx.lineTo(8, 20);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      // Draw and update rocks with improved design
      state.rocks.forEach(rock => {
        // Draw rock with more detail
        ctx.fillStyle = rock.color;
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rock.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add rock details
        ctx.fillStyle = rock.detailColor;
        ctx.beginPath();
        ctx.arc(rock.x - 3, rock.y - 2, rock.size / 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(rock.x + 4, rock.y + 3, rock.size / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Move rocks
        rock.y += rock.speed;
        if (rock.y > canvas.height) {
          rock.y = -20;
          rock.x = Math.random() * canvas.width;
        }
        
        // Collision detection
        const dx = rock.x - (canvas.width * state.rocketPosition / 100);
        const dy = rock.y - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < rock.size + 15) {
          setGameOver(true);
          setScore(state.score);
        }
      });

      // Add new rocks occasionally
      if (Math.random() < 0.03) {
        const rockColors = ['#9ca3af', '#6b7280', '#4b5563', '#374151'];
        const detailColors = ['#d1d5db', '#e5e7eb', '#f3f4f6'];
        
        state.rocks.push({
          x: Math.random() * canvas.width,
          y: -20,
          size: Math.random() * 8 + 7,
          speed: Math.random() * 2 + 1,
          color: rockColors[Math.floor(Math.random() * rockColors.length)],
          detailColor: detailColors[Math.floor(Math.random() * detailColors.length)]
        });
      }

      // Remove rocks that are off screen to improve performance
      state.rocks = state.rocks.filter(rock => rock.y < canvas.height + 50);
      
      // Move Earth closer (making it appear the rocket is moving downward)
      if (state.earthPosition > 60) {
        state.earthPosition -= 0.05;
      }
      
      // Increase score
      if (state.earthPosition > 60) {
        state.score += 1;
        setScore(state.score);
      } else {
        // Rocket has reached Earth!
        setGameOver(true);
        setScore(state.score + 500); // Bonus for reaching Earth
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    // Reset game state
    gameStateRef.current = {
      rocks: [],
      stars: [],
      earthPosition: 95,
      rocketPosition: 50,
      score: 0,
      keys: { left: false, right: false }
    };
    
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-white overflow-hidden">
      {!gameStarted ? (
        <div className="text-center max-w-md z-10">
          <h1 className="text-6xl font-bold text-yellow-300 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Lost in Space</h2>
          <p className="text-gray-300 mb-6">
            Oh no! Your page drifted off into the cosmos. Navigate your rocket back to Earth!
          </p>
          <div className="mb-8">
            <div className="inline-block animate-bounce mb-4">
              <svg className="w-24 h-24 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 mb-4"
          >
            Start Space Rescue
          </button>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <FiHome className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center z-10">
          <div className="mb-4 flex justify-between items-center w-full max-w-md">
            <div className="text-xl font-bold text-yellow-300">Score: {score}</div>
            {gameOver && (
              <button
                onClick={startGame}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors duration-300"
              >
                Play Again
              </button>
            )}
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <FiHome className="mr-2" />
              Home
            </Link>
          </div>
          
          <canvas
            ref={canvasRef}
            width={500}
            height={600}
            className="border-2 border-indigo-700 rounded-lg bg-black"
          />
          
          <div className="mt-4 text-gray-300">
            {gameOver ? (
              score > 0 ? (
                <p className="text-xl">Congratulations! You scored {score} points!</p>
              ) : (
                <p className="text-xl">Mission failed! Try again!</p>
              )
            ) : (
              <p>Use ← → arrow keys to navigate and avoid asteroids!</p>
            )}
          </div>
        </div>
      )}
      
      {/* Animated stars in background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
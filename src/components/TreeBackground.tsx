'use client'

import { useEffect, useState } from 'react'

interface Branch {
  id: number
  x1: number
  y1: number
  x2: number
  y2: number
  delay: number
  opacity: number
}

export default function TreeBackground() {
  const [branches, setBranches] = useState<Branch[]>([])

  useEffect(() => {
    const generateBranches = () => {
      const newBranches: Branch[] = []
      const centerX = 50
      
      // Main trunk
      newBranches.push({
        id: 0,
        x1: centerX,
        y1: 100,
        x2: centerX,
        y2: 30,
        delay: 0,
        opacity: 0.15,
      })

      // Generate organic branching pattern
      const generateSubBranches = (
        startX: number,
        startY: number,
        angle: number,
        length: number,
        depth: number,
        baseDelay: number
      ) => {
        if (depth > 5 || length < 2) return

        const endX = startX + Math.cos(angle) * length
        const endY = startY - Math.sin(angle) * length

        if (endX < 0 || endX > 100 || endY < 0 || endY > 100) return

        newBranches.push({
          id: newBranches.length,
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          delay: baseDelay + depth * 0.2,
          opacity: Math.max(0.03, 0.12 - depth * 0.02),
        })

        // Create sub-branches with natural variation
        const branchCount = Math.random() > 0.5 ? 2 : 3
        const angleSpread = Math.PI / (3 + depth)
        
        for (let i = 0; i < branchCount; i++) {
          const newAngle = angle + (i - (branchCount - 1) / 2) * angleSpread + (Math.random() - 0.5) * 0.3
          const newLength = length * (0.6 + Math.random() * 0.3)
          generateSubBranches(endX, endY, newAngle, newLength, depth + 1, baseDelay + 0.1)
        }
      }

      // Generate main branches from trunk
      const trunkPoints = [
        { y: 70, spread: 0.8 },
        { y: 50, spread: 0.9 },
        { y: 35, spread: 1 },
      ]

      trunkPoints.forEach((point, idx) => {
        // Left branch
        generateSubBranches(
          centerX,
          point.y,
          Math.PI / 2 + (0.4 + Math.random() * 0.4) * point.spread,
          15 + Math.random() * 10,
          0,
          idx * 0.3
        )
        // Right branch
        generateSubBranches(
          centerX,
          point.y,
          Math.PI / 2 - (0.4 + Math.random() * 0.4) * point.spread,
          15 + Math.random() * 10,
          0,
          idx * 0.3
        )
      })

      setBranches(newBranches)
    }

    generateBranches()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="branchGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
        </defs>
        {branches.map((branch) => (
          <line
            key={branch.id}
            x1={`${branch.x1}%`}
            y1={`${branch.y1}%`}
            x2={`${branch.x2}%`}
            y2={`${branch.y2}%`}
            stroke="url(#branchGradient)"
            strokeWidth="0.15"
            opacity={branch.opacity}
            className="tree-branch"
            style={{
              animationDelay: `${branch.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

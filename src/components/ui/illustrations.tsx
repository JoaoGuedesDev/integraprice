import React from 'react'

interface IllustrationProps {
  className?: string
  width?: number
  height?: number
}

export const HeroIllustration: React.FC<IllustrationProps> = ({ 
  className = "", 
  width = 400, 
  height = 300 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="heroGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    
    {/* Background elements */}
    <circle cx="350" cy="50" r="30" fill="url(#heroGradient1)" opacity="0.1" />
    <circle cx="50" cy="250" r="25" fill="url(#heroGradient2)" opacity="0.1" />
    <rect x="320" y="200" width="40" height="40" rx="8" fill="url(#heroGradient3)" opacity="0.1" />
    
    {/* Main illustration - Dashboard/Analytics */}
    <rect x="50" y="50" width="300" height="200" rx="12" fill="url(#heroGradient1)" opacity="0.1" stroke="url(#heroGradient1)" strokeWidth="2" />
    
    {/* Chart bars */}
    <rect x="80" y="180" width="20" height="40" rx="4" fill="url(#heroGradient1)" />
    <rect x="110" y="160" width="20" height="60" rx="4" fill="url(#heroGradient2)" />
    <rect x="140" y="140" width="20" height="80" rx="4" fill="url(#heroGradient3)" />
    <rect x="170" y="120" width="20" height="100" rx="4" fill="url(#heroGradient1)" />
    <rect x="200" y="100" width="20" height="120" rx="4" fill="url(#heroGradient2)" />
    
    {/* Trend line */}
    <path d="M80 200 L110 180 L140 160 L170 140 L200 120 L230 100" stroke="url(#heroGradient1)" strokeWidth="3" strokeLinecap="round" fill="none" />
    
    {/* Data points */}
    <circle cx="80" cy="200" r="4" fill="url(#heroGradient1)" />
    <circle cx="110" cy="180" r="4" fill="url(#heroGradient2)" />
    <circle cx="140" cy="160" r="4" fill="url(#heroGradient3)" />
    <circle cx="170" cy="140" r="4" fill="url(#heroGradient1)" />
    <circle cx="200" cy="120" r="4" fill="url(#heroGradient2)" />
    
    {/* Header elements */}
    <rect x="70" y="70" width="60" height="8" rx="4" fill="url(#heroGradient1)" opacity="0.3" />
    <rect x="140" y="70" width="40" height="8" rx="4" fill="url(#heroGradient2)" opacity="0.3" />
    
    {/* Side panel */}
    <rect x="250" y="80" width="80" height="120" rx="8" fill="url(#heroGradient1)" opacity="0.05" stroke="url(#heroGradient1)" strokeWidth="1" />
    <rect x="260" y="90" width="60" height="6" rx="3" fill="url(#heroGradient1)" opacity="0.4" />
    <rect x="260" y="105" width="40" height="6" rx="3" fill="url(#heroGradient2)" opacity="0.4" />
    <rect x="260" y="120" width="50" height="6" rx="3" fill="url(#heroGradient3)" opacity="0.4" />
    
    {/* Floating elements */}
    <circle cx="300" cy="40" r="3" fill="url(#heroGradient1)" opacity="0.6">
      <animate attributeName="cy" values="40;35;40" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="60" cy="40" r="2" fill="url(#heroGradient2)" opacity="0.6">
      <animate attributeName="cy" values="40;45;40" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
)

export const CalculatorIllustration: React.FC<IllustrationProps> = ({ 
  className = "", 
  width = 200, 
  height = 200 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="calcGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="calcGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Calculator body */}
    <rect x="40" y="30" width="120" height="140" rx="12" fill="url(#calcGradient1)" opacity="0.1" stroke="url(#calcGradient1)" strokeWidth="2" />
    
    {/* Display */}
    <rect x="50" y="45" width="100" height="25" rx="6" fill="url(#calcGradient1)" opacity="0.2" />
    <text x="140" y="62" textAnchor="end" fill="url(#calcGradient1)" fontSize="12" fontFamily="monospace">$99.99</text>
    
    {/* Buttons */}
    <circle cx="65" cy="90" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="85" cy="90" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="105" cy="90" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="125" cy="90" r="8" fill="url(#calcGradient1)" opacity="0.4" />
    
    <circle cx="65" cy="110" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="85" cy="110" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="105" cy="110" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="125" cy="110" r="8" fill="url(#calcGradient1)" opacity="0.4" />
    
    <circle cx="65" cy="130" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="85" cy="130" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="105" cy="130" r="8" fill="url(#calcGradient2)" opacity="0.3" />
    <circle cx="125" cy="130" r="8" fill="url(#calcGradient1)" opacity="0.4" />
    
    <rect x="60" y="145" width="70" height="15" rx="7" fill="url(#calcGradient1)" opacity="0.4" />
    
    {/* Floating numbers */}
    <text x="20" y="50" fill="url(#calcGradient1)" fontSize="14" opacity="0.4">%</text>
    <text x="170" y="80" fill="url(#calcGradient2)" fontSize="12" opacity="0.4">+</text>
    <text x="25" y="120" fill="url(#calcGradient1)" fontSize="16" opacity="0.4">$</text>
    <text x="175" y="150" fill="url(#calcGradient2)" fontSize="14" opacity="0.4">=</text>
  </svg>
)

export const AnalyticsIllustration: React.FC<IllustrationProps> = ({ 
  className = "", 
  width = 300, 
  height = 200 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 300 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="analyticsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="analyticsGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="analyticsGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    
    {/* Pie chart */}
    <circle cx="80" cy="100" r="50" fill="url(#analyticsGrad1)" opacity="0.1" stroke="url(#analyticsGrad1)" strokeWidth="2" />
    <path d="M 80 50 A 50 50 0 0 1 115 75 L 80 100 Z" fill="url(#analyticsGrad1)" opacity="0.6" />
    <path d="M 115 75 A 50 50 0 0 1 105 135 L 80 100 Z" fill="url(#analyticsGrad2)" opacity="0.6" />
    <path d="M 105 135 A 50 50 0 1 1 80 50 L 80 100 Z" fill="url(#analyticsGrad3)" opacity="0.6" />
    
    {/* Bar chart */}
    <rect x="180" y="140" width="15" height="40" rx="2" fill="url(#analyticsGrad1)" />
    <rect x="200" y="120" width="15" height="60" rx="2" fill="url(#analyticsGrad2)" />
    <rect x="220" y="100" width="15" height="80" rx="2" fill="url(#analyticsGrad3)" />
    <rect x="240" y="80" width="15" height="100" rx="2" fill="url(#analyticsGrad1)" />
    <rect x="260" y="60" width="15" height="120" rx="2" fill="url(#analyticsGrad2)" />
    
    {/* Trend line */}
    <path d="M180 160 L200 140 L220 120 L240 100 L260 80 L280 60" stroke="url(#analyticsGrad3)" strokeWidth="3" strokeLinecap="round" fill="none" />
    
    {/* Data points */}
    <circle cx="180" cy="160" r="3" fill="url(#analyticsGrad3)" />
    <circle cx="200" cy="140" r="3" fill="url(#analyticsGrad3)" />
    <circle cx="220" cy="120" r="3" fill="url(#analyticsGrad3)" />
    <circle cx="240" cy="100" r="3" fill="url(#analyticsGrad3)" />
    <circle cx="260" cy="80" r="3" fill="url(#analyticsGrad3)" />
    
    {/* Labels */}
    <text x="40" y="30" fill="url(#analyticsGrad1)" fontSize="12" opacity="0.7">Custos</text>
    <text x="40" y="45" fill="url(#analyticsGrad2)" fontSize="12" opacity="0.7">Margem</text>
    <text x="40" y="60" fill="url(#analyticsGrad3)" fontSize="12" opacity="0.7">Lucro</text>
    
    {/* Percentage indicators */}
    <text x="150" y="70" fill="url(#analyticsGrad1)" fontSize="16" fontWeight="bold">45%</text>
    <text x="150" y="110" fill="url(#analyticsGrad2)" fontSize="16" fontWeight="bold">30%</text>
    <text x="150" y="150" fill="url(#analyticsGrad3)" fontSize="16" fontWeight="bold">25%</text>
  </svg>
)

export const SuccessIllustration: React.FC<IllustrationProps> = ({ 
  className = "", 
  width = 150, 
  height = 150 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Success circle */}
    <circle cx="75" cy="75" r="60" fill="url(#successGrad)" opacity="0.1" stroke="url(#successGrad)" strokeWidth="3" />
    
    {/* Checkmark */}
    <path d="M50 75 L65 90 L100 55" stroke="url(#successGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Celebration elements */}
    <circle cx="30" cy="30" r="3" fill="url(#successGrad)" opacity="0.6">
      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="120" cy="40" r="2" fill="url(#successGrad)" opacity="0.6">
      <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="130" cy="110" r="3" fill="url(#successGrad)" opacity="0.6">
      <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="20" cy="120" r="2" fill="url(#successGrad)" opacity="0.6">
      <animate attributeName="r" values="2;4;2" dur="1.8s" repeatCount="indefinite" />
    </circle>
  </svg>
)

export const LoadingIllustration: React.FC<IllustrationProps> = ({ 
  className = "", 
  width = 100, 
  height = 100 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    
    {/* Animated circles */}
    <circle cx="20" cy="50" r="8" fill="url(#loadingGrad)">
      <animate attributeName="cy" values="50;30;50" dur="1s" repeatCount="indefinite" begin="0s" />
    </circle>
    <circle cx="40" cy="50" r="8" fill="url(#loadingGrad)">
      <animate attributeName="cy" values="50;30;50" dur="1s" repeatCount="indefinite" begin="0.2s" />
    </circle>
    <circle cx="60" cy="50" r="8" fill="url(#loadingGrad)">
      <animate attributeName="cy" values="50;30;50" dur="1s" repeatCount="indefinite" begin="0.4s" />
    </circle>
    <circle cx="80" cy="50" r="8" fill="url(#loadingGrad)">
      <animate attributeName="cy" values="50;30;50" dur="1s" repeatCount="indefinite" begin="0.6s" />
    </circle>
  </svg>
)
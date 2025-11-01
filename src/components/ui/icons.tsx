import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export const LogoIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path
      d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z"
      fill="url(#logoGradient)"
      fillOpacity="0.1"
      stroke="url(#logoGradient)"
      strokeWidth="2"
    />
    <path
      d="M7 9L12 12L17 9"
      stroke="url(#logoGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="15" r="1" fill="url(#logoGradient)" />
    <circle cx="12" cy="15" r="1" fill="url(#logoGradient)" />
    <circle cx="16" cy="15" r="1" fill="url(#logoGradient)" />
  </svg>
)

export const PricingIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="pricingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#pricingGradient)" fillOpacity="0.1" stroke="url(#pricingGradient)" strokeWidth="2" />
    <path d="M12 6V18M9 9H15M9 15H15" stroke="url(#pricingGradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const AnalyticsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <path d="M3 3V21H21" stroke="url(#analyticsGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12L12 7L16 11L21 6" stroke="url(#analyticsGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="12" r="2" fill="url(#analyticsGradient)" />
    <circle cx="12" cy="7" r="2" fill="url(#analyticsGradient)" />
    <circle cx="16" cy="11" r="2" fill="url(#analyticsGradient)" />
    <circle cx="21" cy="6" r="2" fill="url(#analyticsGradient)" />
  </svg>
)

export const BusinessIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="businessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#businessGradient)" fillOpacity="0.1" stroke="url(#businessGradient)" strokeWidth="2" />
    <path d="M7 8H17M7 12H17M7 16H13" stroke="url(#businessGradient)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="16" r="2" fill="url(#businessGradient)" />
  </svg>
)

export const SuccessIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#successGradient)" fillOpacity="0.1" stroke="url(#successGradient)" strokeWidth="2" />
    <path d="M9 12L11 14L15 10" stroke="url(#successGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const WarningIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" fill="url(#warningGradient)" fillOpacity="0.1" stroke="url(#warningGradient)" strokeWidth="2" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="url(#warningGradient)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="url(#warningGradient)" />
  </svg>
)

export const ErrorIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#errorGradient)" fillOpacity="0.1" stroke="url(#errorGradient)" strokeWidth="2" />
    <line x1="15" y1="9" x2="9" y2="15" stroke="url(#errorGradient)" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="9" x2="15" y2="15" stroke="url(#errorGradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const LoadingIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-spin ${className}`}
  >
    <defs>
      <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#loadingGradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite" />
      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite" />
    </circle>
  </svg>
)

export const FloatingElements: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Floating geometric shapes */}
    <div className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse-slow" />
    <div className="absolute top-40 right-20 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce-in" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-40 left-20 w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }} />
    <div className="absolute bottom-20 right-10 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-bounce-in" style={{ animationDelay: '3s' }} />
    
    {/* Floating lines */}
    <svg className="absolute top-0 left-0 w-full h-full opacity-10">
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path
        d="M0,100 Q150,50 300,100 T600,100"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        fill="none"
        className="animate-pulse-slow"
      />
      <path
        d="M100,200 Q250,150 400,200 T700,200"
        stroke="url(#lineGradient2)"
        strokeWidth="2"
        fill="none"
        className="animate-pulse-slow"
        style={{ animationDelay: '1s' }}
      />
    </svg>
  </div>
)
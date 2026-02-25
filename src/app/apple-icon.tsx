import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="30 20 140 140" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 100 Q 40 100 40 90 Q 40 75 55 75 Q 58 60 72 60 Q 85 60 88 75 Q 105 73 110 90 Q 110 100 100 100"/>
            <path d="M 100 100 Q 110 100 110 90"/>
            <path d="M 110 90 Q 110 75 125 75 Q 140 75 145 90 Q 155 90 160 100 Q 160 110 150 110 L 50 110 Q 40 110 40 100"/>
          </g>
          <g fill="#22d3ee">
            <circle cx="60" cy="50" r="3"/>
            <line x1="60" y1="50" x2="60" y2="60" stroke="#22d3ee" strokeWidth="2"/>
            <circle cx="80" cy="42" r="3"/>
            <line x1="80" y1="42" x2="80" y2="60" stroke="#22d3ee" strokeWidth="2"/>
            <circle cx="100" cy="38" r="3"/>
            <line x1="100" y1="38" x2="100" y2="60" stroke="#22d3ee" strokeWidth="2"/>
            <circle cx="120" cy="42" r="3"/>
            <line x1="120" y1="42" x2="120" y2="75" stroke="#22d3ee" strokeWidth="2"/>
            <circle cx="140" cy="50" r="3"/>
            <line x1="140" y1="50" x2="140" y2="75" stroke="#22d3ee" strokeWidth="2"/>
            <circle cx="155" cy="60" r="3"/>
            <line x1="155" y1="60" x2="155" y2="90" stroke="#22d3ee" strokeWidth="2"/>
          </g>
        </svg>
      </div>
    ),
    { ...size }
  )
}

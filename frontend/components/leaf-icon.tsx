export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12C20 7.58 16.42 4 12 4C11.34 4 10.69 4.09 10.07 4.25C10.69 5.57 11 7.03 11 8.5C11 13.5 7.5 16 3 16C3 19.87 6.13 23 10 23C14.42 23 18 19.42 18 15C18 13.57 17.69 12.21 17.14 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 8.5C11 7.03 10.69 5.57 10.07 4.25C8.75 4.69 7.57 5.5 6.64 6.64"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

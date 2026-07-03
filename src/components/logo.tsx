export function Logo({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const onDark = variant === "dark";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="20" cy="20" r="19" fill="#046A38" stroke="#FCD116" strokeWidth="2" />
        <path
          d="M20 8l2.3 6.9h7.3l-5.9 4.3 2.3 6.9-5.9-4.3-5.9 4.3 2.3-6.9-5.9-4.3h7.3L20 8z"
          fill="#FCD116"
        />
        <text
          x="20"
          y="34.5"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fill="#ffffff"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          KUC
        </text>
      </svg>
      <span className="leading-tight">
        <span
          className={`block text-[15px] font-bold tracking-tight ${
            onDark ? "text-white" : "text-brand-green-dark"
          }`}
        >
          TEIN-KUC
        </span>
        <span
          className={`block text-[11px] font-medium -mt-0.5 ${
            onDark ? "text-brand-gold" : "text-brand-red"
          }`}
        >
          &amp; NDC
        </span>
      </span>
    </div>
  );
}

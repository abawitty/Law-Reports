type LogoImages = {
  teinKucLogoUrl?: string;
  ndcLogoUrl?: string;
};

export function Logo({
  className = "",
  variant = "light",
  images,
}: {
  className?: string;
  variant?: "light" | "dark";
  images?: LogoImages;
}) {
  const onDark = variant === "dark";

  if (images?.teinKucLogoUrl) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-white p-1 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images.teinKucLogoUrl}
            alt="TEIN-KUC logo"
            className="h-9 w-9 object-contain"
          />
          {images.ndcLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images.ndcLogoUrl} alt="NDC logo" className="h-9 w-9 object-contain" />
          )}
        </span>
        <span
          className={`text-[15px] font-bold tracking-tight ${
            onDark ? "text-white" : "text-brand-green-dark"
          }`}
        >
          TEIN-KUC
        </span>
      </div>
    );
  }

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
        <circle cx="20" cy="20" r="19" fill="#046A38" stroke="#FFFFFF" strokeWidth="2" />
        <path
          d="M20 8l2.3 6.9h7.3l-5.9 4.3 2.3 6.9-5.9-4.3-5.9 4.3 2.3-6.9-5.9-4.3h7.3L20 8z"
          fill="#FFFFFF"
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
      <span
        className={`text-[15px] font-bold tracking-tight ${
          onDark ? "text-white" : "text-brand-green-dark"
        }`}
      >
        TEIN-KUC
      </span>
    </div>
  );
}

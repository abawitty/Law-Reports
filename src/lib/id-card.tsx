const PLACEHOLDER_PHOTO_BG = "#e5e7eb";

export type IdCardData = {
  fullName: string;
  membershipNumber: string;
  faculty: string;
  constituency: string;
  photoDataUri: string | null;
  logoDataUri: string | null;
};

const field = (label: string, value: string) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span
      style={{
        fontSize: 15,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.65)",
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>{value || "—"}</span>
  </div>
);

export function IdCard(data: IdCardData) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1050,
        height: 660,
        background: "linear-gradient(135deg, #024a27 0%, #046a38 55%, #035c30 100%)",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "36px 44px 0 44px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 18 }}>
          {data.logoDataUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logoDataUri}
              alt=""
              width={64}
              height={64}
              style={{ borderRadius: 999, background: "#ffffff", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                color: "#046a38",
              }}
            >
              TK
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#ffffff", letterSpacing: 1 }}>
              TEIN-KUC
            </span>
            <span style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
              Tertiary Education Institutions Network
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 2,
              textAlign: "right",
            }}
          >
            MEMBERSHIP
          </span>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 2,
              textAlign: "right",
            }}
          >
            IDENTITY CARD
          </span>
        </div>
      </div>

      {/* Chip */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: 78,
          height: 54,
          margin: "28px 0 0 44px",
          borderRadius: 8,
          background: "linear-gradient(135deg, #e8c65a, #c9a63a)",
          padding: "8px 10px",
        }}
      >
        <div style={{ display: "flex", width: "100%", height: 2, background: "rgba(0,0,0,0.25)" }} />
        <div style={{ display: "flex", width: "100%", height: 2, background: "rgba(0,0,0,0.25)" }} />
        <div style={{ display: "flex", width: "100%", height: 2, background: "rgba(0,0,0,0.25)" }} />
      </div>

      {/* Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "26px 44px 0 44px",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {field("Name", data.fullName.toUpperCase())}
          {field("Membership No.", data.membershipNumber)}
          {field("Faculty", data.faculty)}
          {field("Constituency", data.constituency)}
          {field("Chapter", "Kings University College")}
        </div>

        <div
          style={{
            display: "flex",
            width: 220,
            height: 260,
            borderRadius: 14,
            border: "4px solid rgba(255,255,255,0.85)",
            background: PLACEHOLDER_PHOTO_BG,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.photoDataUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photoDataUri}
              alt=""
              width={220}
              height={260}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 16, color: "#9ca3af" }}>No Photo</span>
          )}
        </div>
      </div>

      {/* Footer stripe */}
      <div style={{ display: "flex", flexDirection: "row", width: "100%", height: 22, marginTop: 24 }}>
        <div style={{ display: "flex", flex: 1, background: "#ce1126" }} />
        <div style={{ display: "flex", flex: 1, background: "#ffffff" }} />
        <div style={{ display: "flex", flex: 1, background: "#046a38" }} />
        <div style={{ display: "flex", flex: 1, background: "#000000" }} />
      </div>
    </div>
  );
}

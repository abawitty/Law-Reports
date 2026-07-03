// Default copy for every editable page, used when no admin edit exists yet
// in the database. Shapes here are the source of truth for what the admin
// content editor renders and what each public page expects.

export type TitleBody = { title: string; body: string };
export type RoleName = { role: string; name: string };
export type LeadershipContact = { role: string; email: string; phone: string };

export type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPanelTitle: string;
  heroPanelItems: string[];
  sectionHeading: string;
  sectionDescription: string;
  highlights: TitleBody[];
  purposeTitle: string;
  purposeBody: string;
  voiceTitle: string;
  voiceBody: string;
  involvedTitle: string;
  involvedBody: string;
};

export type AboutContent = {
  heroTitle: string;
  heroDescription: string;
  historyParagraphs: string[];
  executives: RoleName[];
  presidentName: string;
  presidentBioParagraphs: string[];
};

export type MembershipContent = {
  heroTitle: string;
  heroDescription: string;
  newMemberTitle: string;
  newMemberBody: string;
  existingMemberTitle: string;
  existingMemberBody: string;
  features: TitleBody[];
  typesIntro: string;
  membershipTypes: TitleBody[];
  constitutionIntro: string;
};

export type IdeologyContent = {
  heroTitle: string;
  heroDescription: string;
  historyParagraphs: string[];
  philosophyIntro: string;
  philosophyCards: TitleBody[];
  manifestoText: string;
};

export type ResourcesContent = {
  heroTitle: string;
  heroDescription: string;
  sltfIntro: string;
  sltfSteps: TitleBody[];
  sltfNote: string;
  ghanaCardIntro: string;
  ghanaCardCards: TitleBody[];
  ghanaCardNote: string;
  academicIntro: string;
  academicItems: string[];
};

export type ContactContent = {
  heroTitle: string;
  heroDescription: string;
  leadershipContacts: LeadershipContact[];
  leadershipNote: string;
  officeAddress: string;
  officeEmail: string;
  officeHours: string;
  memberNote: string;
};

export const HOME_DEFAULTS: HomeContent = {
  heroEyebrow: "Welcome to",
  heroTitle: "TEIN-KUC & NDC",
  heroDescription:
    "The official portal of the Tertiary Education Institutions Network at Kings University College, in partnership with the NDC — connecting students to student loans, Ghana Card support, membership services, and a transparent voice in decision-making.",
  heroPanelTitle: "Latest Highlights",
  heroPanelItems: [
    "SLTF application window guidance now available in Resources.",
    "Members can now register and log in to the member portal.",
    "Online elections are conducted securely through member accounts.",
  ],
  sectionHeading: "What You Can Do Here",
  sectionDescription:
    "This portal exists to keep every TEIN-KUC member informed and involved — from accessing student loans to having a real say in how the association is run.",
  highlights: [
    {
      title: "Student Loan (SLTF) Guidance",
      body: "Step-by-step help applying for the Students Loan Trust Fund, from eligibility to disbursement.",
    },
    {
      title: "Ghana Card Support",
      body: "Guidance for students without a Ghana Card — where to register, what to bring, and how to track your application.",
    },
    {
      title: "Online Elections",
      body: "Registered members vote securely for executive positions during scheduled online elections.",
    },
    {
      title: "Queries & Suggestions",
      body: "Logged-in members can submit requests, questions, or suggestions directly to the executives.",
    },
  ],
  purposeTitle: "Our Purpose",
  purposeBody:
    "To keep members informed, represented, and supported — with clear information on student loans and the Ghana Card, and a transparent system for decisions like online elections.",
  voiceTitle: "Your Voice",
  voiceBody:
    "Members can log in anytime to view their data, vote in elections, and submit requests, queries, or suggestions to the executive team.",
  involvedTitle: "Get Involved",
  involvedBody:
    "Register for membership today to unlock the member dashboard and participate fully in TEIN-KUC & NDC activities.",
};

export const ABOUT_DEFAULTS: AboutContent = {
  heroTitle: "Who We Are",
  heroDescription:
    "The history of TEIN-KUC, our current executive team, and the President's profile.",
  historyParagraphs: [
    "The Tertiary Education Institutions Network (TEIN) is the student wing of the National Democratic Congress (NDC), established to organise and represent students within Ghana's tertiary institutions. The TEIN-KUC chapter serves students of Kings University College, championing student welfare, access to education, and civic participation.",
    "Since its founding on campus, TEIN-KUC has worked to bridge the gap between students and the resources they need — from information on the Students Loan Trust Fund (SLTF) to support for students without a Ghana Card — while fostering leadership and democratic values among members.",
  ],
  executives: [
    { role: "President", name: "Addo Benjamin Armah" },
    { role: "Vice President", name: "To Be Announced" },
    { role: "General Secretary", name: "To Be Announced" },
    { role: "Financial Secretary", name: "To Be Announced" },
    { role: "Organiser", name: "To Be Announced" },
    { role: "Women's Commissioner", name: "To Be Announced" },
  ],
  presidentName: "Addo Benjamin Armah",
  presidentBioParagraphs: [
    "Addo Benjamin Armah leads TEIN-KUC & NDC as President, bringing a background in law, student governance, and organisational leadership to the role. He holds a Bachelor of Laws (LLB) from Kings University College and is currently pursuing a Master of Laws (LLM) in International Law, Security & Diplomacy at the University of Gold Coast.",
    "Within Kings University College's own student government, he currently serves as Legal Affairs Commissioner & Chief Legal Counsel to the SRC — chairing the Legal Affairs Commission, representing the Executive, Parliamentary, and Judicial Councils at judicial hearings, and providing legal defence services to students before the Disciplinary Board. He previously served as Vice President of the Law Students' Union, where he spearheaded the LSU website and the Dr. Attakora Legal Tree to widen student access to legal resources, and coached the LSU delegation to the Sarah F. Kpodo International Moot Court Competition.",
    "His leadership extends beyond campus: he is President of the University Student Chamber Ghana and Chairman of the University Student Chamber's West African Committee, representing Ghanaian students in national and international forums and coordinating the annual West African Student Leadership Summit. He also serves as Company Secretary & Administrator for several organisations, and as President of the Adom Community League, a community development and advocacy group in the Greater Accra Region.",
    "Addo brings this record of legal advocacy, constitutional governance, and community organising to TEIN-KUC & NDC — with a particular focus on strengthening students' access to information, due process, and a transparent voice in decisions that affect them.",
  ],
};

export const MEMBERSHIP_DEFAULTS: MembershipContent = {
  heroTitle: "Join & Access the Member Portal",
  heroDescription:
    "Register your details once, then log in anytime to vote in elections, view your data, and reach the executives directly.",
  newMemberTitle: "New Member",
  newMemberBody:
    "Register with your student details to create your account in the member database.",
  existingMemberTitle: "Existing Member",
  existingMemberBody:
    "Log in to the member database to view your profile, vote, and submit requests.",
  features: [
    { title: "Your Data", body: "View and keep your membership details up to date." },
    {
      title: "Online Elections",
      body: "Vote securely in scheduled elections for TEIN-KUC executives.",
    },
    {
      title: "Requests & Suggestions",
      body: "Submit queries or suggestions and track responses from leadership.",
    },
  ],
  typesIntro:
    "TEIN-KUC's constitution recognises four types of membership, set out in Article 3.",
  membershipTypes: [
    {
      title: "Full Membership",
      body: "Open to every student at Kings University College, regardless of ethnicity, origin, religion, or background. Each full member has one vote at TEIN-KUC elections and General Assemblies, must not belong to any other political party, and must remain in good standing.",
    },
    {
      title: "Associate Membership",
      body: "For individuals and groups who are not NDC members but support TEIN-KUC's objectives or provide financial, moral, or in-kind support — as well as full members who graduate and wish to stay involved. Associate members have speaking rights at General Assemblies but no voting rights.",
    },
    {
      title: "Honorary Membership",
      body: "Conferred by the Executive Council, subject to Executive Committee approval, on NDC members who have remarkably advanced the cause of TEIN-KUC. Honorary members have speaking rights at General Assemblies but no voting rights.",
    },
    {
      title: "Patron",
      body: "There are three Patrons at a time — the Regional TEIN Coordinator and the Constituency Youth Organiser by default, plus one university lecturer or administrator. Patrons play an advisory role and hold Honorary Membership.",
    },
  ],
  constitutionIntro:
    "The full TEIN-KUC Constitution — covering membership, executive structure, elections, finance, and discipline — is available to read or download below.",
};

export const IDEOLOGY_DEFAULTS: IdeologyContent = {
  heroTitle: "What We Stand For",
  heroDescription: "NDC history, our governance philosophy, and manifesto links.",
  historyParagraphs: [
    "The National Democratic Congress (NDC) was founded on 28 July 1992 by former Head of State Jerry John Rawlings, as Ghana transitioned from military rule under the Provisional National Defence Council (PNDC) to multi-party democracy. The party traces its roots to the 4 June 1979 Uprising and the 31 December 1981 Revolution, events that set the tone for transparency, accountability, probity, and social justice in Ghanaian governance.",
    "The NDC went on to win the 1992 and 1996 elections under Rawlings, and has since alternated in and out of government as one of Ghana's two dominant political parties. As the student wing of the NDC, TEIN carries the party's founding values onto campus, translating them into practical support for students.",
    "TEIN-KUC continues this tradition locally, mobilising students around shared interests: affordable education, access to student loans, national identification, and a stronger student voice in institutional decisions.",
  ],
  philosophyIntro:
    "As a social democratic party, the NDC believes in the gradual development of society on the basis of freedom, equality, and solidarity — participatory democracy, responsible governance, and social welfare policies that address inequality and promote equitable development. Internationally, the NDC is a member of the Progressive Alliance and the Socialist International. Its colours are red, white, green, and black, and its motto is \"Unity, Stability, and Development\" — the same principle TEIN-KUC applies to student governance on campus.",
  philosophyCards: [
    {
      title: "Transparency",
      body: "Decisions affecting members — including elections — are conducted openly and recorded.",
    },
    {
      title: "Accountability",
      body: "Executives are answerable to members and to the queries and suggestions members submit.",
    },
    {
      title: "Inclusion",
      body: "Every registered member has an equal voice and an equal vote.",
    },
    {
      title: "Service",
      body: "Our first duty is connecting students with the information and support they need to succeed.",
    },
  ],
  manifestoText:
    "The NDC's national manifesto and policy documents are published on the party's official website, ndc.org.gh. TEIN-KUC & NDC's own chapter manifesto and policy priorities will be linked here once published by the executive team. Members can request the latest documents via the Contact page.",
};

export const RESOURCES_DEFAULTS: ResourcesContent = {
  heroTitle: "Information & Support",
  heroDescription:
    "Practical guidance on student loans, the Ghana Card, and academic support — especially for students who don't yet have these in place.",
  sltfIntro:
    "The Students Loan Trust Fund (SLTF) provides loans to eligible tertiary students in Ghana to help cover fees and living costs. Here's a general guide — always confirm current details on the official SLTF portal.",
  sltfSteps: [
    {
      title: "Check eligibility",
      body: "You must be a Ghanaian citizen, admitted to or enrolled in an accredited tertiary institution, and have a valid Ghana Card and SSNIT number.",
    },
    {
      title: "Gather documents",
      body: "Ghana Card, SSNIT number, admission or continuing-student letter, guarantor details, and passport photographs.",
    },
    {
      title: "Apply online",
      body: "Create an account on the SLTF portal, complete the application form, and upload the required documents before the deadline.",
    },
    {
      title: "Guarantor & obligor process",
      body: "Provide a qualifying guarantor (SSNIT contributor or approved alternative) to co-sign your loan obligation.",
    },
    {
      title: "Track disbursement",
      body: "Monitor your application status online; approved loans are disbursed directly to your institution and, where applicable, to you.",
    },
  ],
  sltfNote:
    "Need one-on-one help with your SLTF application? Log in to your member account and submit a request under My Dashboard → Requests, and an executive will assist you.",
  ghanaCardIntro:
    "The Ghana Card is the national ID required for the SLTF, SSNIT registration, and many other services. If you don't have one yet, here's how to get started.",
  ghanaCardCards: [
    {
      title: "Where to register",
      body: "Visit a National Identification Authority (NIA) registration centre, or watch for NIA registration exercises organised on or near campus — TEIN-KUC will announce these when scheduled.",
    },
    {
      title: "What to bring",
      body: "An existing form of ID (passport, voter's ID, or old NHIS card) if available, and two guarantors who already have Ghana Cards if you have no prior ID.",
    },
    {
      title: "Registration steps",
      body: "Pre-register online where available, visit the centre for biometric capture (photo, fingerprints, signature), and keep your acknowledgement slip safe.",
    },
    {
      title: "Tracking your card",
      body: "Use your acknowledgement/tracking number on the NIA self-service platform to check production and collection status.",
    },
  ],
  ghanaCardNote:
    "Students without a Ghana Card can log in and submit a request for TEIN-KUC to help coordinate a group registration or point you to the nearest active centre.",
  academicIntro:
    "TEIN-KUC connects members with academic resources and peer support throughout the semester.",
  academicItems: [
    "Peer study groups and tutorial sessions organised by course reps.",
    "Guidance on registration, add/drop periods, and exam procedures.",
    "Referrals to the college's counselling and academic affairs office.",
    "A channel to raise academic concerns through your member dashboard.",
  ],
};

export const CONTACT_DEFAULTS: ContactContent = {
  heroTitle: "Get in Touch",
  heroDescription: "Reach TEIN-KUC & NDC leadership directly, or send a general message below.",
  leadershipContacts: [
    { role: "President", email: "president@teinkuc.org", phone: "+233 20 000 0001" },
    { role: "Vice President", email: "vp@teinkuc.org", phone: "+233 20 000 0002" },
    { role: "General Secretary", email: "secretary@teinkuc.org", phone: "+233 20 000 0003" },
    { role: "Organiser", email: "organiser@teinkuc.org", phone: "+233 20 000 0004" },
  ],
  leadershipNote: "Contact details shown are placeholders and will be updated by the executive office.",
  officeAddress: "Kings University College, Ghana",
  officeEmail: "info@teinkuc.org",
  officeHours: "Monday – Friday, 9:00am – 4:00pm",
  memberNote:
    "For member-specific requests, queries, or suggestions, please log in to your member dashboard so the right executive can follow up with you directly.",
};

export const PAGE_DEFAULTS = {
  home: HOME_DEFAULTS,
  about: ABOUT_DEFAULTS,
  membership: MEMBERSHIP_DEFAULTS,
  ideology: IDEOLOGY_DEFAULTS,
  resources: RESOURCES_DEFAULTS,
  contact: CONTACT_DEFAULTS,
} as const;

export type PageSlug = keyof typeof PAGE_DEFAULTS;
export const PAGE_SLUGS: PageSlug[] = [
  "home",
  "about",
  "membership",
  "ideology",
  "resources",
  "contact",
];

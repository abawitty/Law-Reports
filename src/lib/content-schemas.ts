import { z } from "zod";

const titleBody = z.object({ title: z.string(), body: z.string() });
const roleName = z.object({ role: z.string(), name: z.string() });
const leadershipContact = z.object({ role: z.string(), email: z.string(), phone: z.string() });

export const homeContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroDescription: z.string(),
  heroPanelTitle: z.string(),
  heroPanelItems: z.array(z.string()),
  sectionHeading: z.string(),
  sectionDescription: z.string(),
  highlights: z.array(titleBody),
  purposeTitle: z.string(),
  purposeBody: z.string(),
  voiceTitle: z.string(),
  voiceBody: z.string(),
  involvedTitle: z.string(),
  involvedBody: z.string(),
});

export const aboutContentSchema = z.object({
  heroTitle: z.string(),
  heroDescription: z.string(),
  historyParagraphs: z.array(z.string()),
  executives: z.array(roleName),
  presidentName: z.string(),
  presidentBioParagraphs: z.array(z.string()),
});

export const ideologyContentSchema = z.object({
  heroTitle: z.string(),
  heroDescription: z.string(),
  historyParagraphs: z.array(z.string()),
  philosophyIntro: z.string(),
  philosophyCards: z.array(titleBody),
  manifestoText: z.string(),
});

export const resourcesContentSchema = z.object({
  heroTitle: z.string(),
  heroDescription: z.string(),
  sltfIntro: z.string(),
  sltfSteps: z.array(titleBody),
  sltfNote: z.string(),
  ghanaCardIntro: z.string(),
  ghanaCardCards: z.array(titleBody),
  ghanaCardNote: z.string(),
  academicIntro: z.string(),
  academicItems: z.array(z.string()),
});

export const contactContentSchema = z.object({
  heroTitle: z.string(),
  heroDescription: z.string(),
  leadershipContacts: z.array(leadershipContact),
  leadershipNote: z.string(),
  officeAddress: z.string(),
  officeEmail: z.string(),
  officeHours: z.string(),
  memberNote: z.string(),
});

export const CONTENT_SCHEMAS = {
  home: homeContentSchema,
  about: aboutContentSchema,
  ideology: ideologyContentSchema,
  resources: resourcesContentSchema,
  contact: contactContentSchema,
} as const;

import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

export const server = {
  application: defineAction({
    accept: "form",
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string().min(10).max(10),
      country: z.string(),
      howDidYouHear: z.string(),
      position: z.string(),
      linkedin: z.string().url().optional(),
      resume: z.instanceof(File),
      experience: z.number().int().positive().optional(),
      comments: z.string().optional(),
    }),
    handler: async (input) => {
      const {
        firstName,
        lastName,
        email,
        phone,
        country,
        howDidYouHear,
        linkedin,
        experience,
        comments,
        position,
        resume,
      } = input;
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: "no-reply@skyramedia.com",
          to: "marketing@criticalsa.com",
          subject: `Job application: ${firstName} ${lastName}`,
          text: `From: ${firstName} ${lastName} (${email})\nPhone: ${phone}\nLocation: ${country}\nWhere did you here about us?: ${howDidYouHear}\nPosition: ${position}\nLinkedin: ${linkedin}\nExperience: ${experience}\n\nMessage:\n${comments}`,
          attachments: [
            {
              filename: "resume.pdf",
              content: Buffer.from(await resume.arrayBuffer()),
            },
          ],
        });
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, something went wrong. Please try again later.",
        });
      }
    },
  }),
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      company: z.string(),
      email: z.string().email(),
      phone: z.string().min(10).max(10).optional(),
      message: z.string().optional(),
    }),
    handler: async ({ name, company, email, phone, message }) => {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: "no-reply@skyramedia.com",
          to: "marketing@criticalsa.com",
          subject: `${name} from ${company}`,
          text: `From: ${name} (${email})\nCompany: ${company}\nPhone: ${phone}\n\nMessage:\n${message}`,
        });
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, something went wrong. Please try again later.",
        });
      }
    },
  }),
};

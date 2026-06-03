import React from "react";

import { ServerIcon } from "@heroicons/react/20/solid";
import { DifferentLogo } from "@/components/elysian/logos/customers/different";
import { Claude37Logo } from "@/components/elysian/logos/claudie";
import { ComposioLogo } from "@/components/elysian/logos/composio";
import { CursorLogo } from "@/components/elysian/logos/cursor";
import { DiscordLogo } from "@/components/elysian/logos/discord";
import { DiscordLogo2 } from "@/components/elysian/logos/discord-2";
// Import integration logos
import { AhrefLogo } from "@/components/elysian/logos/integrations/ahref";
import { AirtableLogo } from "@/components/elysian/logos/integrations/airtable";
import { AnthropicLogo } from "@/components/elysian/logos/integrations/anthropic";
import { AsanaLogo } from "@/components/elysian/logos/integrations/asana";
import { CalendlyLogo } from "@/components/elysian/logos/integrations/calendy";
import { CohereLogo } from "@/components/elysian/logos/integrations/cohere";
import { DropboxLogo } from "@/components/elysian/logos/integrations/dropbox";
import { FigmaLogo } from "@/components/elysian/logos/integrations/figma";
import { GmailLogo } from "@/components/elysian/logos/integrations/gmail";
import { GoogleCalendarLogo } from "@/components/elysian/logos/integrations/google-calendar";
import { GoogleDriveLogo } from "@/components/elysian/logos/integrations/google-drive";
import { GoogleSheetsLogo } from "@/components/elysian/logos/integrations/google-sheets";
import { GumloopLogo } from "@/components/elysian/logos/integrations/gumloop";
import { HubspotLogo } from "@/components/elysian/logos/integrations/hubspot";
import { IntercomLogo } from "@/components/elysian/logos/integrations/intercom";
import { JiraLogo } from "@/components/elysian/logos/integrations/jira";
import { MailchimpLogo } from "@/components/elysian/logos/integrations/mailchimp";
import { MicrosoftTeamsLogo } from "@/components/elysian/logos/integrations/microsoft-teams";
import { MixpanelLogo } from "@/components/elysian/logos/integrations/mixpanel";
import { NotionLogo } from "@/components/elysian/logos/integrations/notion";
import { OneDriveLogo } from "@/components/elysian/logos/integrations/one-drive";
import { PineconeLogo } from "@/components/elysian/logos/integrations/pinecone";
import { SlackLogo } from "@/components/elysian/logos/integrations/slack";
import { ZapierLogo } from "@/components/elysian/logos/integrations/zapier";

// Map logo components by key
export const logoMap = {
  ahref: AhrefLogo,
  airtable: AirtableLogo,
  anthropic: AnthropicLogo,
  asana: AsanaLogo,
  cohere: CohereLogo,
  dropbox: DropboxLogo,
  figma: FigmaLogo,
  gmail: GmailLogo,
  googleCalendar: GoogleCalendarLogo,
  googleDrive: GoogleDriveLogo,
  googleSheets: GoogleSheetsLogo,
  hubspot: HubspotLogo,
  intercom: IntercomLogo,
  jira: JiraLogo,
  mailchimp: MailchimpLogo,
  microsoftTeams: MicrosoftTeamsLogo,
  mixpanel: MixpanelLogo,
  notion: NotionLogo,
  oneDrive: OneDriveLogo,
  pinecone: PineconeLogo,
  zapier: ZapierLogo,
  gumloop: GumloopLogo,
  composio: ComposioLogo,
  claude: Claude37Logo,
  cursor: CursorLogo,
  server: ServerIcon,
  slack: SlackLogo,
  discord: DiscordLogo2,
  calendly: CalendlyLogo,
  different: DifferentLogo,
};

/**
 * Helper function to get logo component by key
 * @param logoKey - The key for the logo in the logoMap
 * @returns The logo component or NotionLogo as fallback
 */
export const getLogoComponent = (logoKey: string) => {
  return (logoMap as Record<string, any>)[logoKey] || logoMap.server;
};

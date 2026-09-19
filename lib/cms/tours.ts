// Spotlight tours. Steps point at real elements (mostly data-tour attributes); a step whose
// element isn't on the current screen is skipped, so one tour fits every page of its kind.

export type TourStep = { element?: string; title: string; description: string };

export const tours = {
  shell: [
    { title: "Welcome to the Margins CMS", description: "A one-minute look around. Use Next, or the arrow keys. Press Esc to leave at any time — you can replay this from the Overview page." },
    { element: '[data-tour="nav-content"]', title: "Content — the things themselves", description: "Projects, posts, jobs, FAQs and partners. Each one is written once here and the website reuses it wherever it is needed — you never edit the same project in two places." },
    { element: '[data-tour="nav-pages"]', title: "Pages — how each page is put together", description: "The wording, pictures and SEO of Home, About, Contact and the rest. Pages don't hold copies of projects or posts: Home simply picks which projects to show." },
    { element: '[data-tour="nav-shared"]', title: "Shared — used by several pages", description: "Company statements, contact details, social links and small lists such as unit types. Change them once and every page updates." },
    { element: '[data-tour="nav-inbox"]', title: "Inbox — what visitors send you", description: "Contact messages, calculator requests, job applications with CVs, and newsletter sign-ups." },
    { element: '[data-tour="nav-help"]', title: "Guide", description: "Step-by-step instructions for every common task. Every screen also has a “Tour this page” button, and every field has a small ? you can hover." },
    { element: '[data-tour="account"]', title: "Your account", description: "Click your name to change your password. The icon beside it signs you out." },
  ],
  list: [
    { element: '[data-tour="page-header"]', title: "A list of items", description: "Everything of this kind, whether it is live or not. The description under the title says where the website uses it." },
    { element: '[data-tour="page-actions"]', title: "Create a new one", description: "New items start as a draft, so nothing appears on the website until you publish it." },
    { element: '[data-tour="filters"]', title: "Filters", description: "Narrow the list by type or status. The link in your browser changes too, so you can bookmark a filtered view." },
    { element: "table", title: "Open an item to edit it", description: "Click a title to edit. The coloured badge shows whether it is a Draft, Scheduled, Published or Archived — hover it for the meaning." },
  ],
  entity: [
    { element: '[role="tablist"]', title: "Tabs", description: "Long forms are split into tabs. All tabs belong to the same item and are saved together with one button." },
    { element: "fieldset", title: "English and Arabic, side by side", description: "Every piece of text has both languages next to each other. You can save a draft half-finished, but both languages are required to publish." },
    { element: "#slug", title: "The web address", description: "Click into it and it fills itself from the English title. It is shared by both languages and locks once the page has been live, so old links never break." },
    { element: "#status", title: "Draft, Published, Archived", description: "Draft is only visible here. Published puts it on the website. Archived takes it off again without deleting it." },
    { element: '[data-tour="save-bar"]', title: "Save", description: "One Save for the whole item. If something is missing, the field is marked in red — check the other tabs too. Delete is on the left; archiving is usually the safer choice." },
  ],
  section: [
    { element: '[data-tour="section-tabs"]', title: "A page is made of fixed parts", description: "Each tab is one part of the page. Pick a part to edit it. SEO is always the last tab." },
    { element: '[data-tour="section-form"]', title: "Edit this part", description: "Text is entered in English and Arabic. Hover the small ? beside any label to see what the field is and where it shows on the website." },
    { element: '[data-tour="save-section"]', title: "Each part saves on its own", description: "Save before switching tabs — unsaved changes in this part are not carried over." },
    { element: '[data-tour="picker"]', title: "Picking existing content", description: "Some parts choose from content that already exists instead of typing it again — for example which projects Home shows, or which post the Media Center pins first. This has its own Save button." },
    { element: '[data-tour="view-site"]', title: "See it live", description: "Opens the real page in a new tab." },
  ],
  simpleList: [
    { element: '[data-tour="add"]', title: "Add an item", description: "Opens a small form. Fill in English and Arabic, then Save." },
    { element: '[data-tour="list"]', title: "Order matters", description: "Use the arrows to move an item up or down. The order here is exactly the order on the website. The pencil edits, the bin deletes." },
  ],
  inbox: [
    { element: '[data-tour="page-header"]', title: "Messages from the website", description: "Nothing here is editable content — it is what visitors sent." },
    { element: '[data-tour="filters"]', title: "Views", description: "Switch between what still needs attention and what has been dealt with." },
    { element: "table", title: "Work through the list", description: "Unread items are in bold. Open one to read it; archive it when you are done. Only admins can delete, because these hold personal data." },
  ],
} satisfies Record<string, TourStep[]>;

export type TourKey = keyof typeof tours;

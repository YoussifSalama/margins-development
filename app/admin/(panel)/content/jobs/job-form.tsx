"use client";

import EntityForm, { SlugField } from "@/components/cms/entity-form";
import { SectionCard } from "@/components/cms/page-shell";
import { BilingualField, DateField, Field, NumberField, SelectField } from "@/components/cms/fields";
import { BilingualListField } from "@/components/cms/list-fields";
import SeoFields from "@/components/cms/seo-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobInput, type JobInput } from "@/lib/schemas/job";
import { deleteJob, saveJob } from "@/server/jobs/actions";

export default function JobForm({ id, values, slugLocked = false }: { id?: string; values: JobInput; slugLocked?: boolean }) {
  return (
    <EntityForm<JobInput> noun="Job" basePath="/admin/content/jobs" id={id} schema={jobInput} values={values} save={saveJob} remove={deleteJob}>
      <Tabs defaultValue="details" className="gap-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex flex-col gap-6">
          <SectionCard title="Listing">
            <BilingualField name="title" label="Job title" />
            <SlugField source="title.en" locked={slugLocked} prefix="/careers/" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <SelectField name="status" label="Status" options={[{ value: "draft", label: "Draft" }, { value: "open", label: "Open" }, { value: "closed", label: "Closed" }]} />
              <NumberField name="openings" label="Openings" />
              <DateField name="postedAt" label="Posted" hint="Empty = today when opened." />
              <DateField name="deadline" label="Deadline" />
            </div>
          </SectionCard>
          <SectionCard title="Facts" hint="Labels are what visitors read. The structured values feed Google's job listing markup.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <SelectField
                name="employmentType"
                label="Employment type"
                options={[
                  { value: "full_time", label: "Full time" }, { value: "part_time", label: "Part time" },
                  { value: "contract", label: "Contract" }, { value: "internship", label: "Internship" },
                ]}
              />
              <NumberField name="salaryMin" label="Salary min (monthly)" nullable />
              <NumberField name="salaryMax" label="Salary max (monthly)" nullable />
              <Field name="currency" label="Currency" />
            </div>
            <BilingualField name="jobTypeLabel" label="Job type label" hint='e.g. "Full time (Hybrid)"' />
            <BilingualField name="salaryLabel" label="Salary label" hint='e.g. "EGP 30k – 50k (Monthly)"' />
            <BilingualField name="experience" label="Experience" hint='e.g. "3+ Years Experience"' />
            <BilingualField name="location" label="Location" />
          </SectionCard>
        </TabsContent>

        <TabsContent value="description" className="flex flex-col gap-6">
          <SectionCard title="Description">
            <BilingualField name="summary" label="Summary" multiline hint="Shown on the careers list." />
            <BilingualField name="intro" label="Intro" multiline rows={4} hint="Opening paragraph of the job page." />
            <BilingualListField name="responsibilities" label="What you will do" rows={7} />
            <BilingualListField name="requirements" label="Requirements" rows={7} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="seo">
          <SeoFields fallback="the job title and summary" />
        </TabsContent>
      </Tabs>
    </EntityForm>
  );
}

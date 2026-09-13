"use client";

import { useState } from "react";
import JobRow from "@/components/JobRow";
import type { Role } from "@/lib/careers";

const PAGE_SIZE = 4;

export default function JobList({ roles }: { roles: Role[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(roles.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageRoles = roles.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="border-t border-white/10">
        {pageRoles.map((role, i) => (
          <JobRow
            key={role.slug}
            index={start + i + 1}
            slug={role.slug}
            title={role.title}
            openings={role.openings}
            summary={role.summary}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page}
              className={`flex size-10 items-center justify-center rounded-full text-sm transition-colors ${
                p === page ? "bg-accent text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { buildDestinations, getCalculatorSetup } from "@/server/calculator/data";
import { computeEstimate, formatEGPCompact, getGrossYieldPct } from "@/lib/calculator";
import { SectionCard } from "./page-shell";
import StatusBadge from "./status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// What visitors will see, computed with the very same function the website calculator runs
// (lib/calculator.ts → computeEstimate) from the very same data — so this table is the
// answer to "where does that number come from?".
export default async function CalculatorPreview() {
  const [setup, destinations] = await Promise.all([getCalculatorSetup(), buildDestinations("en", false)]);
  const years = setup.defaultHorizon;

  return (
    <SectionCard
      title="Preview — what visitors will see"
      hint={`Every figure is calculated live from the unit prices on each project and the assumptions above, for the pre-selected ${years}-year horizon. Save a change and this table updates.`}
    >
      {destinations.length === 0 && <p className="text-sm text-muted-foreground">Pick at least one destination above.</p>}

      {destinations.map((destination) => {
        const live = destination.status === "published" && destination.unitTypes.length > 0;
        return (
          <div key={destination.id} className="flex flex-col gap-3 rounded-lg border bg-background p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/admin/content/projects/${destination.id}`} className="font-semibold hover:underline">{destination.name}</Link>
              <StatusBadge status={destination.status} />
              {!live && (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                  Not shown on the website yet — {destination.status !== "published" ? "publish the project" : "add a price and a rent to at least one unit"}
                </span>
              )}
              <span className="ms-auto text-xs text-muted-foreground">
                {destination.occupancyPct}% occupancy · {destination.appreciationPct}% appreciation · delivery month {destination.deliveryMonth} · rent from month {destination.rentalStartMonth}
              </span>
            </div>

            {destination.unitTypes.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Avg price</TableHead>
                    <TableHead>Gross yield</TableHead>
                    <TableHead>Net rental yield</TableHead>
                    <TableHead>Avg annual return</TableHead>
                    <TableHead>Value after {years}y</TableHead>
                    <TableHead>ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destination.unitTypes.map((unit) => {
                    const estimate = computeEstimate(destination, unit, years);
                    return (
                      <TableRow key={unit.key} className="tabular-nums">
                        <TableCell className="font-medium">{unit.name}</TableCell>
                        <TableCell className="text-muted-foreground">{unit.sizeRange || "—"}</TableCell>
                        <TableCell>{formatEGPCompact(unit.avgPrice, 2)}</TableCell>
                        <TableCell>{getGrossYieldPct(destination, unit).toFixed(1)}%</TableCell>
                        <TableCell>{estimate.netRentalYieldPct.toFixed(1)}%</TableCell>
                        <TableCell>{estimate.avgAnnualReturnPct.toFixed(1)}%</TableCell>
                        <TableCell>{formatEGPCompact(estimate.projectedValue, 2)}</TableCell>
                        <TableCell>{estimate.roiPct.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            {destination.skippedUnits > 0 && (
              <p className="text-xs text-muted-foreground">
                {destination.skippedUnits} unit{destination.skippedUnits === 1 ? "" : "s"} of this project left out: no price or no rent yet (Project → Units & calculator).
              </p>
            )}
          </div>
        );
      })}

      <details className="rounded-lg border bg-background p-4 text-sm">
        <summary className="cursor-pointer font-medium">How each figure is calculated</summary>
        <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 text-muted-foreground md:grid-cols-2">
          {[
            ["Gross yield", "yearly rent × occupancy ÷ price"],
            ["Net yearly rent", "yearly rent × occupancy − yearly running costs"],
            ["Rental years", "(horizon in months − month rent starts) ÷ 12 — no rent is counted before it starts"],
            ["Cumulative net rent", "net yearly rent × rental years"],
            ["Projected value", "price × (1 + appreciation) ^ horizon years"],
            ["Capital appreciation", "projected value − price"],
            ["Total gross return", "cumulative net rent + capital appreciation"],
            ["ROI", "total gross return ÷ price"],
            ["Average annual return", "((price + total return) ÷ price) ^ (1 ÷ years) − 1"],
            ["Net rental yield", "cumulative net rent ÷ price ÷ rental years"],
          ].map(([name, formula]) => (
            <div key={name}>
              <dt className="font-medium text-foreground">{name}</dt>
              <dd>{formula}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">Occupancy, appreciation and the two months come from the setup above unless the project overrides them. Price, rent and running costs come from the project&apos;s unit.</p>
      </details>
    </SectionCard>
  );
}

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui-kit";

const chartData = [
  { product: "Кредит для бизнеса 1", transactionsSum: 6643586088 },
  { product: "Кредит для бизнеса 2", transactionsSum: 1630923494 },
  { product: "Кредит для физлиц 1", transactionsSum: 778457300 },
  { product: "Кредит для физлиц 2", transactionsSum: 629776401 },
  { product: "Кредит для физлиц 3", transactionsSum: 401081057 },
];

const chart2Data = [
  { product: "Кредит для бизнеса 1", count: 624 },
  { product: "Кредит для бизнеса 2", count: 675 },
  { product: "Кредит для физлиц 1", count: 408 },
  { product: "Кредит для физлиц 2", count: 370 },
  { product: "Кредит для физлиц 3", count: 422 },
];

const chartConfig = {
  transactionsSum: {
    label: "Сумма транзакций",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const chart2Config = {
  count: {
    label: "Количество клиентов",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="container space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Отчет по кредитным продуктам
        </h2>
        {/* EXPORT */}
      </div>
      <div className="grid gap-4">
        <Chart />
        <Chart2 />
      </div>
    </div>
  );
}

function Chart() {
  return (
    <div className="border rounded">
      <h3 className="text-2xl font-semibold tracking-tight text-center py-2 px-4">
        Сумму транзакций по типу кредита
      </h3>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full ">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="product"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="transactionsSum"
            fill="var(--color-transactionsSum)"
            radius={4}
          />
          {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function Chart2() {
  return (
    <div className="border rounded">
      <h3 className="text-2xl font-semibold tracking-tight text-center py-2 px-4">
        Распределение типов кредитных продуктов по клиентам (по количеству)
      </h3>
      <ChartContainer config={chart2Config} className="min-h-[200px] w-full ">
        <BarChart data={chart2Data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="product"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

import { FC, useEffect, useMemo, useRef } from 'react';
import Chart, { Plugin, ScriptableContext } from 'chart.js/auto';
import annotationPlugin, { type AnnotationOptions } from 'chartjs-plugin-annotation';

type Dataset = {
    data: number[];
    color: string;
    label: string;
    fill?: boolean;
    minMax?: boolean;
};

interface LineChartProps {
    startLine?: number;
    xColor?: string;
    yColor?: string;
    legend?: boolean;
    yAxis?: boolean;
    xAxis?: boolean;
    yFormatter?: (val: number) => string;
    tension?: number;
    data: {
        labels: string[];
        datasets: Dataset[];
    };
}

const hoverLinePlugin: Plugin<'line'> = {
    id: 'hoverLine',
    afterEvent(chart, args) {
        if (args.event.type === 'mouseout') chart.draw();
    },
    afterDraw(chart) {
        const { ctx, tooltip, chartArea } = chart;

        const activeElements = tooltip?.getActiveElements?.();
        if (!activeElements || activeElements.length === 0) return;

        const x = activeElements[0].element.x;

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    },
};

const minMaxPlugin: Plugin<'line'> = {
    id: 'minMaxPlugin',
    beforeDatasetDraw(chart, _, options: { show: boolean; formatter?: (v: number) => string }) {
        if (!options.show) return;
        const { ctx, data } = chart;

        data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);

            if (!dataset.data.length) return;

            const values = dataset.data as number[];
            const min = Math.min(...values);
            const max = Math.max(...values);

            const minIndex = values.lastIndexOf(min);
            const maxIndex = values.lastIndexOf(max);

            const minPoint = meta.data[minIndex];
            const maxPoint = meta.data[maxIndex];

            ctx.save();
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';

            const color = (dataset.borderColor as string) ?? 'black';

            // Draw min label below the point
            if (minPoint) {
                const text = options.formatter?.(min) ?? min.toString();
                const width = ctx.measureText(text).width / 2;

                let x = minPoint.x;
                if (x - width <= 0) x = width;
                else if (x + width >= chart.chartArea.right) x = chart.chartArea.right - width;
                ctx.fillStyle = color;
                ctx.fillText(text, x, minPoint.y + 13);
            }

            // Draw max label above the point
            if (maxPoint && min != max) {
                const text = options.formatter?.(max) ?? max.toString();
                const width = ctx.measureText(text).width / 2;
                let x = maxPoint.x;
                if (x - width <= 0) x = width;
                else if (x + width >= chart.chartArea.right) x = chart.chartArea.right - width;
                ctx.fillStyle = color;
                ctx.fillText(text, x, maxPoint.y - 8);
            }

            ctx.clip();
            ctx.restore();
        });
    },
};

const borderColorGetter = (ctx: ScriptableContext<'line'>) => {
    const border = ctx.dataset.borderColor as string;
    // If it's already OKLCH or RGB with CSS var, just add opacity
    if (border.startsWith('oklch')) {
        return border.replace(')', ' / 0.07)'); // oklch(... / 0.2)
    }
    if (border.startsWith('rgb')) {
        return border.replace(')', ', 0.07)'); // rgb(r,g,b,0.2)
    }
    if (border.startsWith('#')) return `${border}25`;
    return border; // fallback
};

Chart.register(annotationPlugin, hoverLinePlugin, minMaxPlugin);

export const LineChart: FC<LineChartProps> = ({
    data,
    startLine,
    xColor,
    yColor,
    legend = true,
    tension = 0.3,
    yFormatter,
    xAxis = true,
    yAxis = true,
}) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart<'line', number[], string>>();

    const defaultData = useMemo(() => data.datasets[0], [data]);
    const min = useMemo(
        () =>
            !defaultData?.minMax || defaultData.data.length === 0 ? undefined : Math.min(...(defaultData.data ?? [])),
        [defaultData],
    );
    const max = useMemo(
        () =>
            !defaultData?.minMax || defaultData.data.length === 0 ? undefined : Math.max(...(defaultData.data ?? [])),
        [defaultData],
    );
    const suggestedMin = useMemo(
        () => (min != null ? min - 1 : startLine != null ? startLine - 1 : undefined),
        [min, startLine],
    );
    const suggestedMax = useMemo(
        () => (max != null ? max + 1 : startLine != null ? startLine - 1 : undefined),
        [max, startLine],
    );

    useEffect(() => {
        if (!chartRef.current) return;
        const scale = chartRef.current.options.scales?.['y'];
        if (scale && scale.ticks) scale.ticks.color = yColor;
        if (scale) {
            scale.suggestedMin = suggestedMin;
            scale.suggestedMax = suggestedMax;
        }
    }, [chartRef.current]);

    useEffect(() => {
        if (!chartRef.current) return;
        const scale = chartRef.current.options.scales?.['x'];
        if (scale && scale.ticks) scale.ticks.color = xColor;

        const legend = chartRef.current.options.plugins?.legend;
        if (legend && legend.labels) legend.labels.color = xColor;
    }, [chartRef.current, xColor, legend]);

    useEffect(() => {
        if (!chartRef.current) return;
        const anotation = chartRef.current.options.plugins?.annotation?.annotations as Record<
            string,
            AnnotationOptions | undefined
        >;
        if (!anotation) return;
        anotation['startLine'] =
            startLine == null
                ? undefined
                : ({
                      type: 'line',
                      yMin: startLine,
                      yMax: startLine,
                      borderColor: 'gray',
                      borderDash: [6, 6],
                      borderWidth: 0.5,
                  } as AnnotationOptions);

        chartRef.current.update();
    }, [chartRef.current, startLine]);

    useEffect(() => {
        if (!chartRef.current) return;

        chartRef.current.data.labels = data.labels;

        // Update each dataset
        data.datasets.forEach(({ color, label, data, fill, minMax }, i) => {
            if (!chartRef.current) return;

            const minMaxPlug = (chartRef.current.options.plugins as any | undefined)?.minMaxPlugin;
            if (minMaxPlug) minMaxPlug.show = minMax;

            if (!chartRef.current.data.datasets[i]) {
                // Add if missing
                chartRef.current.data.datasets[i] = {
                    label,
                    data,
                    borderColor: color,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill,
                    backgroundColor: !fill ? undefined : borderColorGetter,
                };
            } else {
                chartRef.current.data.datasets[i].data = data;
                chartRef.current.data.datasets[i].borderColor = color;
                chartRef.current.data.datasets[i].fill = fill;
                if (fill) chartRef.current.data.datasets[i].backgroundColor = borderColorGetter;
            }
        });

        chartRef.current.data.datasets.length = data.datasets.length;
        chartRef.current.update();
    }, [chartRef.current, data]);

    useEffect(() => {
        chartRef.current = new Chart(ref.current!.getContext('2d')!, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(({ label, data, color, fill }) => ({
                    label,
                    data,
                    borderWidth: 2,
                    pointRadius: 0,
                    borderColor: color,
                    pointHoverRadius: 0,
                    fill,
                    tension,
                    backgroundColor: !fill ? undefined : borderColorGetter,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    // @ts-ignore
                    minMaxPlugin: { show: false, formatter: yFormatter },
                    legend: {
                        display: legend,
                        align: 'start',
                        labels: {
                            color: xColor,
                            usePointStyle: true,
                            pointStyle: 'rect',
                            boxHeight: 5,
                            boxWidth: 5,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                    },
                    annotation: {
                        annotations: {
                            startPriceLine:
                                startLine == null
                                    ? undefined
                                    : {
                                          type: 'line',
                                          yMin: startLine,
                                          yMax: startLine,
                                          borderColor: 'gray',
                                          borderDash: [6, 6],
                                          borderWidth: 0.5,
                                      },
                        },
                    },
                },
                scales: {
                    y: {
                        display: yAxis,
                        position: 'right',
                        ticks: {
                            color: yColor,
                            callback: (value) => {
                                return typeof value === 'string'
                                    ? value
                                    : yFormatter
                                      ? yFormatter(value)
                                      : Number.isInteger(value)
                                        ? value
                                        : '';
                            },
                        },
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        display: xAxis,
                        ticks: {
                            maxTicksLimit: 5,
                            color: xColor,
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        });
        return () => {
            chartRef.current?.destroy();
        };
    }, []);

    return (
        <div className="relative flex min-h-[10rem] w-full flex-1 flex-col">
            <canvas ref={ref} className="absolute left-0 top-0 h-full w-full"></canvas>
        </div>
    );
};

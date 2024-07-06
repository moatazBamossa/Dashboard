import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "tailwind.config.jsflex tailwind.config.jsaspect-video tailwind.config.jsjustify-center tailwind.config.jstext-xs [&_.recharts-cartesian-axis-tick_text]:tailwind.config.jsfill-muted-foreground [&_.recharts-cartesian-grid_line]:tailwind.config.jsstroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:tailwind.config.jsstroke-border [&_.recharts-dot[stroke='#fff']]:tailwind.config.jsstroke-transparent [&_.recharts-layer]:tailwind.config.jsoutline-none [&_.recharts-polar-grid_[stroke='#ccc']]:tailwind.config.jsstroke-border [&_.recharts-radial-bar-background-sector]:tailwind.config.jsfill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:tailwind.config.jsfill-muted [&_.recharts-reference-line-line]:tailwind.config.jsstroke-border [&_.recharts-sector[stroke='#fff']]:tailwind.config.jsstroke-transparent [&_.recharts-sector]:tailwind.config.jsoutline-none [&_.recharts-surface]:tailwind.config.jsoutline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
        ),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("tailwind.config.jsfont-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("tailwind.config.jsfont-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "tailwind.config.jsgrid tailwind.config.jsmin-w-[8rem] tailwind.config.jsitems-start tailwind.config.jsgap-1.5 tailwind.config.jsrounded-lg tailwind.config.jsborder tailwind.config.jsborder-border/50 tailwind.config.jsbg-background tailwind.config.jspx-2.5 tailwind.config.jspy-1.5 tailwind.config.jstext-xs tailwind.config.jsshadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="tailwind.config.jsgrid tailwind.config.jsgap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "tailwind.config.jsflex tailwind.config.jsw-full tailwind.config.jsitems-stretch tailwind.config.jsgap-2 [&>svg]:tailwind.config.jsh-2.5 [&>svg]:tailwind.config.jsw-2.5 [&>svg]:tailwind.config.jstext-muted-foreground",
                  indicator === "dot" && "tailwind.config.jsitems-center"
                )}
              >
                {formatter && item.value && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "tailwind.config.jsshrink-0 tailwind.config.jsrounded-[2px] tailwind.config.jsborder-[--color-border] tailwind.config.jsbg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "tailwind.config.jsflex tailwind.config.jsflex-1 tailwind.config.jsjustify-between tailwind.config.jsleading-none",
                        nestLabel ? "tailwind.config.jsitems-end" : "tailwind.config.jsitems-center"
                      )}
                    >
                      <div className="tailwind.config.jsgrid tailwind.config.jsgap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="tailwind.config.jstext-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="tailwind.config.jsfont-mono tailwind.config.jsfont-medium tailwind.config.jstabular-nums tailwind.config.jstext-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "tailwind.config.jsflex tailwind.config.jsitems-center tailwind.config.jsjustify-center tailwind.config.jsgap-4",
          verticalAlign === "top" ? "tailwind.config.jspb-3" : "tailwind.config.jspt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "tailwind.config.jsflex tailwind.config.jsitems-center tailwind.config.jsgap-1.5 [&>svg]:tailwind.config.jsh-3 [&>svg]:tailwind.config.jsw-3 [&>svg]:tailwind.config.jstext-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="tailwind.config.jsh-2 tailwind.config.jsw-2 tailwind.config.jsshrink-0 tailwind.config.jsrounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

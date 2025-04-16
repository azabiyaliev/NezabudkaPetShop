import React, { useLayoutEffect } from 'react';
import { OrderStats } from '../../../types';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface Props {
  stats: OrderStats;
}

const ColumnChart: React.FC<Props> = ({stats}) => {

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv")

    root.setThemes([
      am5themes_Animated.new(root),
    ]);

    root.interfaceColors.set("primaryButton", am5.color("#FFB347"));
    root.interfaceColors.set("primaryButtonHover", am5.color("#FFA07A"));

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        panX: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft:0,
        layout: root.verticalLayout
      })
    );

    const data = [
      {category: 'Доставка', value1: stats.pickUpStatistic, value2: stats.deliveryStatistic},
      {category: 'Оплата', value1: stats.paymentByCard, value2: stats.paymentByCash},
      {category: 'Использование бонусов', value1: stats.bonusUsage},
      {category: 'Заказы', value1: stats.canceledOrderCount, value2: stats.totalOrders},
    ];

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.2,
        })
      })
    );
    yAxis.data.setAll(data);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30
    });
    xRenderer.labels.template.setAll({
      rotation: -15,
      centerY: am5.p50,
      centerX: am5.p50,
    });
    xRenderer.grid.template.setAll({
      strokeOpacity: 0.1
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xRenderer,
        categoryField: "category"
      })
    );
    xAxis.data.setAll(data);

    const series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Положительная статистика",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value1',
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{name}: {valueY}"
        }),
        interpolationDuration: 2000,
        interpolationEasing: am5.ease.inOut(am5.ease.elastic),
      })
    );
    series1.data.setAll(data);

    const series2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Отрицательная статистика",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value2',
        categoryXField: "category",
        interpolationDuration: 2000,
        interpolationEasing: am5.ease.inOut(am5.ease.elastic),
        tooltip: am5.Tooltip.new(root, {
          labelText: "{name}: {valueY}"
        })
      })
    );
    series2.data.setAll(data);

    [series1, series2].forEach(series => {
      series.columns.template.setAll({
        cursorOverStyle: "pointer",
        fillOpacity: 0.8,
        strokeOpacity: 1,
        strokeWidth: 2,
        width: am5.percent(70)
      });

      series.columns.template.adapters.add("fill", (fill) => {
        if (fill) {
          return am5.Color.brighten(fill, -0.2);
        }
        return am5.color("#000000");
      });

      series.columns.template.events.on("pointerover", (ev) => {
        ev.target.animate({
          key: "fillOpacity",
          to: 1,
          duration: 200
        });
      });

      series.columns.template.events.on("pointerout", (ev) => {
        ev.target.animate({
          key: "fillOpacity",
          to: 0.8,
          duration: 200
        });
      });
    });

    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));
    legend.data.setAll(chart.series.values);

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
  );
};

export default ColumnChart;
import tigerFactory, { TigerTokenAuthProvider } from "@gooddata/sdk-backend-tiger";
import { bucketMeasures, idRef, insightBucket } from "@gooddata/sdk-model";
import { DataViewFacade } from "@gooddata/sdk-ui";
import range from "lodash/range";
import zip from "lodash/zip";
import chroma from "chroma-js";

const WORKSPACE = "faa_custom";
const INSIGHT_REF = idRef("2315fb88-e81e-45b4-a6d4-59e63f02610c", "insight");

const MIN_X_DATA = 0.5;
const MAX_X_DATA = 3.5;

const MIN_Y_DATA = 0.5;
const MAX_Y_DATA = 3;

const MIN_Y = 0;
const MAX_Y = 4;

const MIN_Z_DATA = 0.5;
const MAX_Z_DATA = 3.5;

const MIN_RADIUS = 0.05;
const MAX_RADIUS = 0.2;

const backend = tigerFactory({
    hostname: "https://demo-cicd.cloud.gooddata.com",
}).withAuthentication(
    new TigerTokenAuthProvider("amFuLnNvdWJ1c3RhOkhhY2thdG9uOkpyamNnSUM5eW95TU1JQ2V3bnErU0M3YXAxSU10WEhi")
);

const main = async () => {
    const insight = await backend.workspace(WORKSPACE).insights().getInsight(INSIGHT_REF);

    const measuresBucket = insightBucket(insight, "measures");
    const measures = bucketMeasures(measuresBucket);
    const [flightCount, distance, delay] = measures;

    const execution = backend.workspace(WORKSPACE).execution().forInsight(insight);
    const executionResult = await execution.execute();
    const data = await executionResult.readAll();

    const dataView = DataViewFacade.for(data);

    const flightCountSlice = dataView.data().series().firstForMeasure(flightCount);

    const distanceSlice = dataView.data().series().firstForMeasure(distance);

    const delaySlice = dataView.data().series().firstForMeasure(delay);

    const flightCountNormalize = normalizer(
        MIN_Y_DATA,
        MAX_Y_DATA,
        Math.min(...flightCountSlice.rawData()),
        Math.max(...flightCountSlice.rawData())
    );

    const distanceNormalize = normalizer(
        MIN_RADIUS,
        MAX_RADIUS,
        Math.min(...distanceSlice.rawData()),
        Math.max(...distanceSlice.rawData())
    );

    const delayNormalize = normalizer(
        0,
        1,
        Math.min(...delaySlice.rawData()),
        Math.max(...delaySlice.rawData())
    );

    const colorRange = chroma.scale(["yellow", "red"]);

    const zipped = zip(flightCountSlice.dataPoints(), distanceSlice.dataPoints(), delaySlice.dataPoints());

    const dayNormalize = normalizer(MIN_X_DATA, MAX_X_DATA, 0, 6);
    const yearNormalize = normalizer(MIN_Z_DATA, MAX_Z_DATA, 2000, 2005);

    const xs = new Set();
    const zs = new Set();

    const mapped = zipped.map(([cnt, dist, del], index) => {
        const [yearRaw, dayRaw] = cnt.sliceDesc.sliceTitles();
        const xRaw = Number.parseInt(dayRaw, 10);
        const x = dayNormalize(xRaw);
        xs.add(x);
        const yRaw = cnt.rawValue;
        const y = flightCountNormalize(yRaw);
        const zRaw = Number.parseInt(yearRaw, 10);
        const z = yearNormalize(zRaw);
        zs.add(z);
        const size = distanceNormalize(dist.rawValue);
        const color = colorRange(delayNormalize(del.rawValue));
        const hash = `${x}_${y}_${z}_${size}_${color}`;
        return {
            x,
            xRaw,
            y,
            yTooltip: y + 0.25,
            yRaw: cnt.formattedValue(),
            z,
            zRaw,
            size,
            sizeRaw: dist.formattedValue(),
            color,
            colorRaw: del.formattedValue(),
            hash,
            tooltipId: `tool_${index}`,
        };
    });

    console.log("KOKOT", dataView.result().dimensions);

    window.setTimeout(() => {
        window.AFRAME.scenes[0].emit("replaceExecutionData", mapped);
        window.AFRAME.scenes[0].emit("setAxes", {
            xAxis: {
                title: dataView.result().dimensions[1].headers[1].attributeHeader.name,
                ticks: Array.from(xs),
            },
            yAxis: {
                title: flightCountSlice.descriptor.measureTitle(),
                ticks: range(MIN_Y, MAX_Y, 0.5),
            },
            zAxis: {
                title: dataView.result().dimensions[1].headers[0].attributeHeader.name,
                ticks: Array.from(zs),
            },
        });

        document.querySelectorAll("a-sphere").forEach((el, index) => {
            const tooltipId = mapped[index].tooltipId;
            el.addEventListener("mouseenter", () => {
                document.querySelector(`#${tooltipId}`).setAttribute("visible", true);
            });
            el.addEventListener("mouseleave", () => {
                document.querySelector(`#${tooltipId}`).setAttribute("visible", false);
            });
        });
    }, 500);
};

function normalizer(targetMin, targetMax, dataMin, dataMax) {
    const targetSpan = Math.abs(targetMax - targetMin);
    const dataSpan = Math.abs(dataMax - dataMin);

    return (value) => {
        const ratio = (value - dataMin) / dataSpan;
        return ratio * targetSpan + targetMin;
    };
}

// document.querySelector("a-scene").addEventListener("loaded", function () {
//   main();
// });

main();

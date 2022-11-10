import range from "lodash/range";

const yAxisTicks = range(0, 4, 1);

window.AFRAME.registerState({
    // Initial state of our application. We have the current environment and the active menu.
    initialState: {
        executionData: [],
        xAxisTitle: "",
        xAxisTicks: [],
        yAxisTitle: "",
        yAxisTicks: [],
        zAxisTitle: "",
        zAxisTicks: [],
        active: false,
        activeX: -1,
        activeXRaw: -1,
        activeY: -1,
        activeYRaw: -1,
        activeZ: -1,
        activeZRaw: -1,
    },
    handlers: {
        replaceExecutionData: (state, action) => {
            console.log("REPLACING", state, action);
            state.executionData.splice(0, state.executionData.length);
            state.executionData.push(...action);
        },
        setAxes: (state, action) => {
            console.log("REPLACING AXES", state, action, JSON.stringify(state.yAxis));

            state.xAxisTicks.splice(0, state.xAxisTicks.length);
            state.xAxisTicks.push(...action.xAxis.ticks);
            state.xAxisTitle = action.xAxis.title;

            state.yAxisTicks.splice(0, state.yAxisTicks.length);
            state.yAxisTicks.push(...action.yAxis.ticks);
            state.yAxisTitle = action.yAxis.title;

            state.zAxisTicks.splice(0, state.zAxisTicks.length);
            state.zAxisTicks.push(...action.zAxis.ticks);
            state.zAxisTitle = action.zAxis.title;
        },
        setActive: (state, action) => {
            state.active = true;
            state.activeX = action.x;
            state.activeXRaw = action.xRaw;
            state.activeY = action.y;
            state.activeYRaw = action.yRaw;
            state.activeZ = action.z;
            state.activeZRaw = action.zRaw;
        },
        resetActive: (state) => {
            state.active = false;
            state.activeX = -1;
            state.activeXRaw = -1;
            state.activeY = -1;
            state.activeYRaw = -1;
            state.activeZ = -1;
            state.activeZRaw = -1;
        },
    },
    computeState: function (newState, payload) {
        if (payload === "setAxes") {
            newState.xAxisTitleRich = `text: ${newState.xAxisTitle}; color: #000;font-size: 0.3`;
            newState.yAxisTitleRich = `text: ${newState.yAxisTitle}; color: #000;font-size: 0.3`;
            newState.zAxisTitleRich = `text: ${newState.zAxisTitle}; color: #000;font-size: 0.3`;
        }
        if (payload === "setActive") {
            newState.tooltipText = `text: Flight count: ${newState.activeYRaw}; font-size: 0.1; color: black;transparent: false; backgroundColor: grey`;
            newState.tooltipPosition = `${newState.activeX} ${newState.activeY + 0.5} ${newState.activeZ}`;
        }
        if (payload === "resetActive") {
            newState.tooltipText = "";
            newState.tooltipPosition = "";
        }
    },
});

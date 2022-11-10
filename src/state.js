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
    },
    computeState: function (newState, payload) {
        newState.xAxisTitleRich = `text: ${newState.xAxisTitle}; color: #000;font-size: 0.3`;
        newState.yAxisTitleRich = `text: ${newState.yAxisTitle}; color: #000;font-size: 0.3`;
        newState.zAxisTitleRich = `text: ${newState.zAxisTitle}; color: #000;font-size: 0.3`;
    },
});

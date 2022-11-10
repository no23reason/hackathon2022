import range from "lodash/range";

window.AFRAME.registerState({
  // Initial state of our application. We have the current environment and the active menu.
  initialState: {
    executionData: [],
    xAxis: { title: "", ticks: [] },
    yAxis: { title: "", ticks: [1] },
    zAxis: { title: "", ticks: [] }
  },
  handlers: {
    replaceExecutionData: (state, action) => {
      console.log("REPLACING", state, action);
      state.executionData.splice(0, state.executionData.length);
      state.executionData.push(...action);
    },
    setAxes: (state, action) => {
      console.log("REPLACING AXES", state, action, JSON.stringify(state.yAxis));

      // state.xAxis.ticks.length = 0;
      // state.xAxis.ticks.push(...action.xAxis.ticks);
      // state.xAxis.title = action.xAxis.title;

      // state.yAxis.ticks.length = 0;
      // state.yAxis.ticks.push(...action.yAxis.ticks);
      // state.yAxis.title = action.yAxis.title;

      // console.log("KURVA", state.yAxis, JSON.stringify(state.yAxis));

      // state.zAxis.ticks.length = 0;
      // state.zAxis.ticks.push(...action.zAxis.ticks);
      // state.zAxis.title = action.zAxis.title;
    }
  }
});

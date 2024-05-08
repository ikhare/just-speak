// import { internal } from "../_generated/api";

// const prevoutput = "prevoutput"; // sentinel value that's replaced by the previous step's output

// const workflow = [
//   {
//     action: internal.transcript.transcribe,
//     args: { recId: "recId", runId: "asdf" }, // input variable
//     retries: 3,
//   },
//   {
//     mutation: internal.transcript.storeTranscript,
//     args: { transcription: prevoutput, recId: "recId", runId: "asdf"},
//   },
//   {
//     action: internal.intelligence.categorizeTranscript,
//     args: { recId: "recId" },
//     retries: 3,
//   },
//   {
//     branch: function (prevoutput) {
      
//     }
//   }
// ];

// // How should we handle branching?
// // - We could have a function just start a new workflow, that gives us the most flexibility, is no longer workflow, but a chain
// // - We could create new syntax for branching, but seems strangely like just building a new language
// // - Or we could have a pure function that returns a new workflow to run.


import { evalScript } from "./evaluator";
import bsv from "../../bsv.2.0.10/bsv.bundle";

function parse(script, format) {
  if (format === "hex") return bsv.Script.fromHex(script.toString());
  else if (format === "asm") return bsv.Script.fromAsmString(script.toString());
  else throw new Error("Unknown format: " + format);
}

export function bitcoinScriptEval(script, format, context = {}) {
  context = cloneContext(context);
  context.script = parse(script, format, context);
  return evalScript(context);
}

function cloneContext(context) {
  context = JSON.parse(JSON.stringify(context));
  context.stack = context.stack?.map((obj) => Buffer.from(obj));
  context.altStack = context.altStack?.map((obj) => Buffer.from(obj));
  return context;
}

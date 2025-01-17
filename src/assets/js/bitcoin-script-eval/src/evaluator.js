import { opCodeFunctions } from "./opCodeFunctions";

export function evalScript(context) {
  context.done = false;
  context.ended = false;
  context.step = context.step || 0;

  context.stack = context.stack || [];
  context.altStack = context.altStack || [];
  context.opReturn = context.opReturn || [];

  for (let i = 0; i < context.script.chunks.length; i++) {
    context.step++;
    const step = context.script.chunks[i];

    if (context.endedWithOpReturn) {
      context.opReturn.push(...getOpReturn(context, i));
      break;
    }
    if (context.interrupted) break;

    if (context.skipUntil && context.skipUntil.length)
      if (!context.skipUntil.includes(step.opCodeNum)) continue;

    evaluateStep(step, context);
  }

  context.ended = true;
  context.done = !context.interrupted;

  return context;
}

async function evaluateStep(step, context) {
  if (step.buf) return evaluateBuf(step, context);
  else return evaluateOpCode(step, context);
}

function evaluateBuf(step, context) {
  context.stack.push(step.buf);
}

async function evaluateOpCode(step, context) {
  try {
    const opcode = opCodeFunctions[step.opCodeNum];
    opcode.eval(context);
  } catch (error) {
    context.interrupted = true;
    context.endMessage = error.message;
  }
}

function getOpReturn(context, fromStep) {
  const restOfScript = context.script.chunks.slice(fromStep);
  const results = [];
  for (let i = 0; i < restOfScript.length; i++) {
    const step = restOfScript[i];
    if (step.buf) results.push(step.buf);
    else results.push(Buffer.from(step.opCodeNum.toString(16), "hex"));
  }
  return results;
}

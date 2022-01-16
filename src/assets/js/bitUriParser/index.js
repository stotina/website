import * as parser from "./bitUriParser";
import * as browserPaymail from "./paymail/resolve-in-browser";

const defailtOptions = browserPaymail.defaultOptions;

export const bitUriParser = {
  ...parser,
  paymailResolving: { browser: browserPaymail },
  parse: (bitcoinUriString, o = defailtOptions) =>
    parser.parse(bitcoinUriString, { ...defailtOptions, ...o }),
};

import Parse, {
  ParseAddress,
  AREA,
  Utils,
} from './parse';

if (window) {
  window.AddressParse = Parse;
}

Parse.Utils = Utils;
Parse.AREA = AREA;
Parse.ParseAddress = ParseAddress;

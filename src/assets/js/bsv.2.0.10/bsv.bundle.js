/*! For license information please see bsv.bundle.js.LICENSE.txt */
/* eslint-disable */
!(function(t, e) {
"object" == typeof exports && "object" == typeof module
? (module.exports = e())
: "function" == typeof define && define.amd
? define([], e)
: "object" == typeof exports
? (exports.bsvjs = e())
: (t.bsvjs = e());
})(self, function() {
return (() => {
var t = {
3671: (t, e, r) => {
"use strict";
r.r(e),
r.d(e, {
Ach: () => Wt,
Address: () => at,
Aes: () => jt,
Aescbc: () => Yt,
Base58: () => k,
Base58Check: () => U,
Bip32: () => ft,
Bip39: () => dt,
Block: () => Mt,
BlockHeader: () => vt,
Bn: () => b,
Br: () => w,
Bsm: () => yt,
Bw: () => _,
Cbc: () => zt,
Constants: () => V,
Ecdsa: () => mt,
Ecies: () => Qt,
Hash: () => L,
Interp: () => Ct,
KeyPair: () => pt,
OpCode: () => z,
Point: () => J,
PrivKey: () => et,
PubKey: () => X,
Random: () => $,
Script: () => st,
Sig: () => it,
SigOperations: () => Lt,
Struct: () => O,
Tx: () => Nt,
TxBuilder: () => Kt,
TxIn: () => Pt,
TxOut: () => Rt,
TxOutMap: () => Ht,
TxVerifier: () => Dt,
VarInt: () => Bt,
Workers: () => T,
WorkersResult: () => N,
cmp: () => R,
deps: () => $t,
en: () => ut,
getConstants: () => j,
jp: () => lt,
version: () => te,
});
var i = r(4297),
n = r.n(i),
s = r(3550),
o = r.n(s),
a = r(7191),
h = r.n(a),
f = r(4666),
u = r.n(f),
c = r(3715),
d = r.n(c),
l = r(5632),
p = r(8764).Buffer;
function b(t, e, ...r) {
if (!(this instanceof b)) return new b(t, e, ...r);
o().call(this, t, e, ...r);
}
function m(t) {
const e = p.alloc(t.length);
for (let r = 0; r < t.length; r++) e[r] = t[t.length - 1 - r];
return e;
}
function g(t) {
(b.prototype["_" + t] = b.prototype[t]),
(b.prototype[t] = function(e) {
return (
"string" == typeof e
? (e = new b(e))
: "number" == typeof e && (e = new b(e.toString())),
this["_" + t](e)
);
});
}
Object.keys(o()).forEach(function(t) {
b[t] = o()[t];
}),
(b.prototype = Object.create(o().prototype)),
(b.prototype.constructor = b),
(b.prototype.fromHex = function(t, e) {
return this.fromBuffer(p.from(t, "hex"), e);
}),
(b.prototype.toHex = function(t) {
return this.toBuffer(t).toString("hex");
}),
(b.prototype.toJSON = function() {
return this.toString();
}),
(b.prototype.fromJSON = function(t) {
return b(t).copy(this), this;
}),
(b.prototype.fromNumber = function(t) {
return b(t).copy(this), this;
}),
(b.prototype.toNumber = function() {
return parseInt(this.toString(10), 10);
}),
(b.prototype.fromString = function(t, e) {
return b(t, e).copy(this), this;
}),
(b.fromBuffer = function(t, e = { endian: "big" }) {
return (
"little" === e.endian && (t = m(t)),
new b(t.toString("hex"), 16)
);
}),
(b.prototype.fromBuffer = function(t, e) {
return b.fromBuffer(t, e).copy(this), this;
}),
(b.prototype.toBuffer = function(
t = { size: void 0, endian: "big" }
) {
let e;
if (t.size) {
const r = this.toString(16, 2),
i = r.length / 2;
if (((e = p.from(r, "hex")), i === t.size));
else if (i > t.size) e = e.slice(i - e.length, e.length);
else if (i < t.size) {
const r = p.alloc(t.size);
for (let t = 0; t < e.length; t++)
r[r.length - 1 - t] = e[e.length - 1 - t];
for (let e = 0; e < t.size - i; e++) r[e] = 0;
e = r;
}
} else {
const t = this.toString(16, 2);
e = p.from(t, "hex");
}
"little" === t.endian && (e = m(e));
const r = p.from([0]);
return 0 === p.compare(e, r) ? p.from([]) : e;
}),
(b.prototype.toFastBuffer = b.prototype.toBuffer),
(b.fromFastBuffer = b.fromBuffer),
(b.prototype.fromFastBuffer = b.prototype.fromBuffer),
(b.prototype.fromSm = function(t, e = { endian: "big" }) {
return (
0 === t.length && this.fromBuffer(p.from([0])),
"little" === e.endian && (t = m(t)),
128 & t[0]
? ((t[0] = 127 & t[0]),
this.fromBuffer(t),
this.neg().copy(this))
: this.fromBuffer(t),
this
);
}),
(b.prototype.toSm = function(t = { endian: "big" }) {
const e = t.endian;
let r;
return (
-1 === this.cmp(0)
? ((r = this.neg().toBuffer()),
128 & r[0]
? (r = p.concat([p.from([128]), r]))
: (r[0] = 128 | r[0]))
: ((r = this.toBuffer()),
128 & r[0] && (r = p.concat([p.from([0]), r]))),
(1 === r.length) & (0 === r[0]) && (r = p.from([])),
"little" === e && (r = m(r)),
r
);
}),
(b.prototype.fromBits = function(t, e = { strict: !1 }) {
let r = p.alloc(4);
if (
(r.writeUInt32BE(t, 0),
(t = r.readInt32BE(0)),
e.strict && 8388608 & t)
)
throw new Error("negative bit set");
const i = t >> 24,
n = 8388607 & t;
if (((r = p.alloc(4)), r.writeInt32BE(n), i <= 3))
r = r.slice(1, i + 1);
else {
const t = p.alloc(i - 3);
t.fill(0), (r = p.concat([r, t]));
}
return (
this.fromBuffer(r),
8388608 & t &&
b(0)
.sub(this)
.copy(this),
this
);
}),
(b.prototype.toBits = function() {
let t;
t = this.lt(0) ? this.neg().toBuffer() : this.toBuffer();
let e,
r = t.length;
if (r > 3)
e = p.concat([p.from([0]), t.slice(0, 3)]).readUInt32BE(0);
else if (r <= 3) {
const i = p.alloc(3 - r + 1);
i.fill(0), (e = p.concat([i, t.slice(0, r)]).readUInt32BE(0));
}
8388608 & e && ((e >>= 8), r++), this.lt(0) && (e |= 8388608);
const i = (r << 24) | e;
return (t = p.alloc(4)), t.writeInt32BE(i, 0), t.readUInt32BE(0);
}),
(b.prototype.fromScriptNumBuffer = function(t, e, r) {
if ((void 0 === r && (r = 4), t.length > r))
throw new Error("script number overflow");
if (
e &&
t.length > 0 &&
0 == (127 & t[t.length - 1]) &&
(t.length <= 1 || 0 == (128 & t[t.length - 2]))
)
throw new Error("non-minimally encoded script number");
return this.fromSm(t, { endian: "little" });
}),
(b.prototype.toScriptNumBuffer = function(t) {
return this.toSm({ endian: "little" });
}),
(b.prototype.neg = function() {
const t = o().prototype.neg.call(this),
e = Object.create(b.prototype);
return t.copy(e), e;
}),
(b.prototype.add = function(t) {
const e = o().prototype.add.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.sub = function(t) {
const e = o().prototype.sub.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.mul = function(t) {
const e = o().prototype.mul.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.mod = function(t) {
const e = o().prototype.mod.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.umod = function(t) {
const e = o().prototype.umod.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.invm = function(t) {
const e = o().prototype.invm.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.div = function(t) {
const e = o().prototype.div.call(this, t);
return (t = Object.create(b.prototype)), e.copy(t), t;
}),
(b.prototype.ushln = function(t) {
const e = o().prototype.ushln.call(this, t),
r = Object.create(b.prototype);
return e.copy(r), r;
}),
(b.prototype.ushrn = function(t) {
const e = o().prototype.ushrn.call(this, t),
r = Object.create(b.prototype);
return e.copy(r), r;
}),
(b.prototype.cmp = function(t) {
return o().prototype.cmp.call(this, t);
}),
(b.prototype.eq = function(t) {
return 0 === this.cmp(t);
}),
(b.prototype.neq = function(t) {
return 0 !== this.cmp(t);
}),
(b.prototype.gt = function(t) {
return this.cmp(t) > 0;
}),
(b.prototype.geq = function(t) {
return this.cmp(t) >= 0;
}),
(b.prototype.lt = function(t) {
return this.cmp(t) < 0;
}),
(b.prototype.leq = function(t) {
return this.cmp(t) <= 0;
}),
g("add"),
g("sub"),
g("mul"),
g("mod"),
g("invm"),
g("div"),
g("cmp"),
g("gt"),
g("geq"),
g("lt"),
g("leq");
var y = r(8764).Buffer;
class w {
constructor(t) {
this.fromObject({ buf: t });
}
fromObject(t) {
return (
(this.buf = t.buf || this.buf || void 0),
(this.pos = t.pos || this.pos || 0),
this
);
}
eof() {
return this.pos >= this.buf.length;
}
read(t = this.buf.length) {
const e = this.buf.slice(this.pos, this.pos + t);
return (this.pos = this.pos + t), e;
}
readReverse(t = this.buf.length) {
const e = this.buf.slice(this.pos, this.pos + t);
this.pos = this.pos + t;
const r = y.alloc(e.length);
for (let t = 0; t < r.length; t++) r[t] = e[e.length - 1 - t];
return r;
}
readUInt8() {
const t = this.buf.readUInt8(this.pos);
return (this.pos = this.pos + 1), t;
}
readInt8() {
const t = this.buf.readInt8(this.pos);
return (this.pos = this.pos + 1), t;
}
readUInt16BE() {
const t = this.buf.readUInt16BE(this.pos);
return (this.pos = this.pos + 2), t;
}
readInt16BE() {
const t = this.buf.readInt16BE(this.pos);
return (this.pos = this.pos + 2), t;
}
readUInt16LE() {
const t = this.buf.readUInt16LE(this.pos);
return (this.pos = this.pos + 2), t;
}
readInt16LE() {
const t = this.buf.readInt16LE(this.pos);
return (this.pos = this.pos + 2), t;
}
readUInt32BE() {
const t = this.buf.readUInt32BE(this.pos);
return (this.pos = this.pos + 4), t;
}
readInt32BE() {
const t = this.buf.readInt32BE(this.pos);
return (this.pos = this.pos + 4), t;
}
readUInt32LE() {
const t = this.buf.readUInt32LE(this.pos);
return (this.pos = this.pos + 4), t;
}
readInt32LE() {
const t = this.buf.readInt32LE(this.pos);
return (this.pos = this.pos + 4), t;
}
readUInt64BEBn() {
const t = this.buf.slice(this.pos, this.pos + 8),
e = new b().fromBuffer(t);
return (this.pos = this.pos + 8), e;
}
readUInt64LEBn() {
const t = this.readReverse(8);
return new b().fromBuffer(t);
}
readVarIntNum() {
const t = this.readUInt8();
let e, r;
switch (t) {
case 253:
return this.readUInt16LE();
case 254:
return this.readUInt32LE();
case 255:
if (
((e = this.readUInt64LEBn()),
(r = e.toNumber()),
r <= Math.pow(2, 53))
)
return r;
throw new Error(
"number too large to retain precision - use readVarIntBn"
);
default:
return t;
}
}
readVarIntBuf() {
switch (this.buf.readUInt8(this.pos)) {
case 253:
return this.read(3);
case 254:
return this.read(5);
case 255:
return this.read(9);
default:
return this.read(1);
}
}
readVarIntBn() {
const t = this.readUInt8();
switch (t) {
case 253:
return new b(this.readUInt16LE());
case 254:
return new b(this.readUInt32LE());
case 255:
return this.readUInt64LEBn();
default:
return new b(t);
}
}
}
var v = r(8764).Buffer;
class _ {
constructor(t) {
this.fromObject({ bufs: t });
}
fromObject(t) {
return (this.bufs = t.bufs || this.bufs || []), this;
}
getLength() {
let t = 0;
for (const e in this.bufs) t += this.bufs[e].length;
return t;
}
toBuffer() {
return v.concat(this.bufs);
}
write(t) {
return this.bufs.push(t), this;
}
writeReverse(t) {
const e = v.alloc(t.length);
for (let r = 0; r < e.length; r++) e[r] = t[t.length - 1 - r];
return this.bufs.push(e), this;
}
writeUInt8(t) {
const e = v.alloc(1);
return e.writeUInt8(t, 0), this.write(e), this;
}
writeInt8(t) {
const e = v.alloc(1);
return e.writeInt8(t, 0), this.write(e), this;
}
writeUInt16BE(t) {
const e = v.alloc(2);
return e.writeUInt16BE(t, 0), this.write(e), this;
}
writeInt16BE(t) {
const e = v.alloc(2);
return e.writeInt16BE(t, 0), this.write(e), this;
}
writeUInt16LE(t) {
const e = v.alloc(2);
return e.writeUInt16LE(t, 0), this.write(e), this;
}
writeInt16LE(t) {
const e = v.alloc(2);
return e.writeInt16LE(t, 0), this.write(e), this;
}
writeUInt32BE(t) {
const e = v.alloc(4);
return e.writeUInt32BE(t, 0), this.write(e), this;
}
writeInt32BE(t) {
const e = v.alloc(4);
return e.writeInt32BE(t, 0), this.write(e), this;
}
writeUInt32LE(t) {
const e = v.alloc(4);
return e.writeUInt32LE(t, 0), this.write(e), this;
}
writeInt32LE(t) {
const e = v.alloc(4);
return e.writeInt32LE(t, 0), this.write(e), this;
}
writeUInt64BEBn(t) {
const e = t.toBuffer({ size: 8 });
return this.write(e), this;
}
writeUInt64LEBn(t) {
const e = t.toBuffer({ size: 8 });
return this.writeReverse(e), this;
}
writeVarIntNum(t) {
const e = _.varIntBufNum(t);
return this.write(e), this;
}
writeVarIntBn(t) {
const e = _.varIntBufBn(t);
return this.write(e), this;
}
static varIntBufNum(t) {
let e;
return (
t < 253
? ((e = v.alloc(1)), e.writeUInt8(t, 0))
: t < 65536
? ((e = v.alloc(3)),
e.writeUInt8(253, 0),
e.writeUInt16LE(t, 1))
: t < 4294967296
? ((e = v.alloc(5)),
e.writeUInt8(254, 0),
e.writeUInt32LE(t, 1))
: ((e = v.alloc(9)),
e.writeUInt8(255, 0),
e.writeInt32LE(-1 & t, 1),
e.writeUInt32LE(Math.floor(t / 4294967296), 5)),
e
);
}
static varIntBufBn(t) {
let e;
const r = t.toNumber();
if (r < 253) (e = v.alloc(1)), e.writeUInt8(r, 0);
else if (r < 65536)
(e = v.alloc(3)), e.writeUInt8(253, 0), e.writeUInt16LE(r, 1);
else if (r < 4294967296)
(e = v.alloc(5)), e.writeUInt8(254, 0), e.writeUInt32LE(r, 1);
else {
const r = new _();
r.writeUInt8(255), r.writeUInt64LEBn(t), (e = r.toBuffer());
}
return e;
}
}
var S = r(1484),
E = r.n(S),
I = r(8764).Buffer;
class O {
constructor(t) {
this.fromObject(t);
}
fromObject(t) {
if (!t) return this;
for (const e of Object.keys(t))
void 0 !== t[e] && (this[e] = t[e]);
return this;
}
static fromObject(t) {
return new this().fromObject(t);
}
fromBr(t) {
if (!(t instanceof w))
throw new Error("br must be a buffer reader");
throw new Error("not implemented");
}
static fromBr(t) {
return new this().fromBr(t);
}
asyncFromBr(t) {
if (!(t instanceof w))
throw new Error("br must be a buffer reader");
throw new Error("not implemented");
}
static asyncFromBr(t) {
return new this().asyncFromBr(t);
}
toBw(t) {
throw new Error("not implemented");
}
asyncToBw(t) {
throw new Error("not implemented");
}
*genFromBuffers() {
throw new Error("not implemented");
}
*expect(t, e) {
let r = e;
const i = new _();
let n = 0;
for (e && (i.write(e), (n += e.length)); n < t; ) {
const e = t - n;
(r = yield e), r && (i.write(r), (n += r.length));
}
r = i.toBuffer();
const s = n - t,
o = r.slice(r.length - s, r.length);
return (
(r = r.slice(0, r.length - s)), { buf: r, remainderbuf: o }
);
}
fromBuffer(t, ...e) {
if (!I.isBuffer(t)) throw new Error("buf must be a buffer");
const r = new w(t);
return this.fromBr(r, ...e);
}
static fromBuffer(...t) {
return new this().fromBuffer(...t);
}
asyncFromBuffer(t, ...e) {
if (!I.isBuffer(t)) throw new Error("buf must be a buffer");
const r = new w(t);
return this.asyncFromBr(r, ...e);
}
static asyncFromBuffer(t, ...e) {
return new this().asyncFromBuffer(t, ...e);
}
fromFastBuffer(t, ...e) {
return 0 === t.length ? this : this.fromBuffer(t, ...e);
}
static fromFastBuffer(...t) {
return new this().fromFastBuffer(...t);
}
toBuffer(...t) {
return this.toBw(...t).toBuffer();
}
asyncToBuffer(...t) {
return this.asyncToBw(...t).then((t) => t.toBuffer());
}
toFastBuffer(...t) {
return 0 === Object.keys(this).length
? I.alloc(0)
: this.toBuffer(...t);
}
fromHex(t, ...e) {
if (!E()(t)) throw new Error("invalid hex string");
const r = I.from(t, "hex");
return this.fromBuffer(r, ...e);
}
static fromHex(t, ...e) {
return new this().fromHex(t, ...e);
}
asyncFromHex(t, ...e) {
if (!E()(t)) throw new Error("invalid hex string");
const r = I.from(t, "hex");
return this.asyncFromBuffer(r, ...e);
}
static asyncFromHex(t, ...e) {
return new this().asyncFromHex(t, ...e);
}
fromFastHex(t, ...e) {
if (!E()(t)) throw new Error("invalid hex string");
const r = I.from(t, "hex");
return this.fromFastBuffer(r, ...e);
}
static fromFastHex(t, ...e) {
return new this().fromFastHex(t, ...e);
}
toHex(...t) {
return this.toBuffer(...t).toString("hex");
}
asyncToHex(...t) {
return this.asyncToBuffer(...t).then((t) => t.toString("hex"));
}
toFastHex(...t) {
return this.toFastBuffer(...t).toString("hex");
}
fromString(t, ...e) {
if ("string" != typeof t) throw new Error("str must be a string");
return this.fromHex(t, ...e);
}
static fromString(t, ...e) {
return new this().fromString(t, ...e);
}
asyncFromString(t, ...e) {
if ("string" != typeof t) throw new Error("str must be a string");
return this.asyncFromHex(t, ...e);
}
static asyncFromString(t, ...e) {
return new this().asyncFromString(t, ...e);
}
toString(...t) {
return this.toHex(...t);
}
asyncToString(...t) {
return this.asyncToHex(...t);
}
fromJSON(t) {
throw new Error("not implemented");
}
static fromJSON(t, ...e) {
return new this().fromJSON(t, ...e);
}
asyncFromJSON(t, ...e) {
throw new Error("not implemented");
}
static asyncFromJSON(t, ...e) {
return new this().asyncFromJSON(t, ...e);
}
toJSON() {
var t = {};
for (var e in this)
if (Array.isArray(this[e])) {
const i = [];
for (var r in this[e])
"function" == typeof this[e][r].toJSON
? i.push(this[e][r].toJSON())
: i.push(JSON.stringify(this[e][r]));
t[e] = i;
} else if (null === this[e]) t[e] = this[e];
else if (
"object" == typeof this[e] &&
"function" == typeof this[e].toJSON
)
t[e] = this[e].toJSON();
else if (
"boolean" == typeof this[e] ||
"number" == typeof this[e] ||
"string" == typeof this[e]
)
t[e] = this[e];
else if (I.isBuffer(this[e])) t[e] = this[e].toString("hex");
else if (this[e] instanceof Map) t[e] = JSON.stringify(this[e]);
else if ("object" == typeof this[e])
throw new Error("not implemented");
return t;
}
asyncToJSON() {
throw new Error("not implemented");
}
clone() {
return this.cloneByJSON();
}
cloneByBuffer() {
return new this.constructor().fromBuffer(this.toBuffer());
}
cloneByFastBuffer() {
return new this.constructor().fromFastBuffer(this.toFastBuffer());
}
cloneByHex() {
return new this.constructor().fromHex(this.toHex());
}
cloneByString() {
return new this.constructor().fromString(this.toString());
}
cloneByJSON() {
return new this.constructor().fromJSON(this.toJSON());
}
}
var B = r(8764).Buffer;
class k extends O {
constructor(t) {
super({ buf: t });
}
fromHex(t) {
return this.fromBuffer(B.from(t, "hex"));
}
toHex() {
return this.toBuffer().toString("hex");
}
static encode(t) {
if (!B.isBuffer(t)) throw new Error("Input should be a buffer");
return h().encode(t);
}
static decode(t) {
if ("string" != typeof t)
throw new Error("Input should be a string");
return B.from(h().decode(t));
}
fromBuffer(t) {
return (this.buf = t), this;
}
fromString(t) {
const e = k.decode(t);
return (this.buf = e), this;
}
toBuffer() {
return this.buf;
}
toString() {
return k.encode(this.buf);
}
}
var P = r(8764).Buffer;
const R = (t, e) => {
if (!P.isBuffer(t) || !P.isBuffer(e))
throw new Error("buf1 and buf2 must be buffers");
if (t.length !== e.length) return !1;
let r = 0;
for (let i = 0; i < t.length; i++) r |= t[i] ^ e[i];
return 0 === r;
};
var A = r(8764).Buffer;
class N extends O {
constructor(t, e, r) {
super({ resbuf: t, isError: e, id: r });
}
fromResult(t, e) {
return (
t.toFastBuffer
? (this.resbuf = t.toFastBuffer())
: A.isBuffer(t)
? (this.resbuf = t)
: (this.resbuf = A.from(JSON.stringify(t))),
(this.isError = !1),
(this.id = e),
this
);
}
static fromResult(t, e) {
return new this().fromResult(t, e);
}
fromError(t, e) {
return (
(this.resbuf = A.from(JSON.stringify(t.message))),
(this.isError = !0),
(this.id = e),
this
);
}
toBw(t) {
return (
t || (t = new _()),
t.writeVarIntNum(this.resbuf.length),
t.write(this.resbuf),
t.writeUInt8(Number(this.isError)),
t.writeVarIntNum(this.id),
t
);
}
fromBr(t) {
const e = t.readVarIntNum();
return (
(this.resbuf = t.read(e)),
(this.isError = Boolean(t.readUInt8())),
(this.id = t.readVarIntNum()),
this
);
}
}
var x = r(4155);
let M;
class T {
constructor(t = [], e = 0, r = [], i = new Map()) {
(this.nativeWorkers = t),
(this.lastid = e),
(this.incompconsteRes = r),
(this.promisemap = i);
}
asyncObjectMethod(t, e, r, i = this.lastid + 1) {
if (!r) throw new Error("must specify args");
const n = t[e](...r);
return new N().fromResult(n, i);
}
static asyncObjectMethod(t, e, r, i) {
return M || (M = new T()), M.asyncObjectMethod(t, e, r, i);
}
asyncClassMethod(t, e, r, i = this.lastid + 1) {
if (!r) throw new Error("must specify args");
const n = t[e](...r);
return new N().fromResult(n, i);
}
static asyncClassMethod(t, e, r, i) {
return M || (M = new T()), M.asyncClassMethod(t, e, r, i);
}
static endGlobalWorkers() {
M && !x.browser && (M = void 0);
}
}
var C = r(8764).Buffer;
class L {}
(L.sha1 = function(t) {
if (!C.isBuffer(t))
throw new Error("sha1 hash must be of a buffer");
const e = new (0, d().sha1)().update(t).digest();
return C.from(e);
}),
(L.sha1.blockSize = 512),
(L.asyncSha1 = async function(t) {
const e = [t];
return (await T.asyncClassMethod(L, "sha1", e)).resbuf;
}),
(L.sha256 = function(t) {
if (!C.isBuffer(t))
throw new Error("sha256 hash must be of a buffer");
const e = new (0, d().sha256)().update(t).digest();
return C.from(e);
}),
(L.sha256.blockSize = 512),
(L.asyncSha256 = async function(t) {
const e = [t];
return (await T.asyncClassMethod(L, "sha256", e)).resbuf;
}),
(L.sha256Sha256 = function(t) {
try {
return L.sha256(L.sha256(t));
} catch (t) {
throw new Error("sha256Sha256 hash must be of a buffer: " + t);
}
}),
(L.asyncSha256Sha256 = async function(t) {
const e = [t];
return (await T.asyncClassMethod(L, "sha256Sha256", e)).resbuf;
}),
(L.ripemd160 = function(t) {
if (!C.isBuffer(t))
throw new Error("ripemd160 hash must be of a buffer");
const e = new (0, d().ripemd160)().update(t).digest();
return C.from(e);
}),
(L.asyncRipemd160 = async function(t) {
const e = [t];
return (await T.asyncClassMethod(L, "ripemd160", e)).resbuf;
}),
(L.sha256Ripemd160 = function(t) {
try {
return L.ripemd160(L.sha256(t));
} catch (t) {
throw new Error(
"sha256Ripemd160 hash must be of a buffer: " + t
);
}
}),
(L.asyncSha256Ripemd160 = async function(t) {
const e = [t];
return (await T.asyncClassMethod(L, "sha256Ripemd160", e)).resbuf;
}),
(L.sha512 = function(t) {
if (!C.isBuffer(t))
throw new Error("sha512 hash must be of a buffer");
const e = new (0, d().sha512)().update(t).digest();
return C.from(e);
}),
(L.asyncSha512 = async function(t) {
const e = [t];
return (await T.asyncClassMethod(L, "sha512", e)).resbuf;
}),
(L.sha512.blockSize = 1024),
(L.hmac = function(t, e, r) {
if ("sha1" !== t && "sha256" !== t && "sha512" !== t)
throw new Error("invalid choice of hash function");
const i = L[t];
if (!C.isBuffer(e) || !C.isBuffer(r))
throw new Error("data and key must be buffers");
const n = i.blockSize / 8;
if ((r.length > n && (r = i(r)), r.length < n)) {
const t = C.alloc(n);
t.fill(0, r.length), r.copy(t), (r = t);
}
const s = C.alloc(n),
o = C.alloc(n);
for (let t = 0; t < n; t++)
(s[t] = 92 ^ r[t]), (o[t] = 54 ^ r[t]);
return i(C.concat([s, i(C.concat([o, e]))]));
}),
(L.sha1Hmac = function(t, e) {
return L.hmac("sha1", t, e);
}),
(L.asyncSha1Hmac = async function(t, e) {
const r = [t, e];
return (await T.asyncClassMethod(L, "sha1Hmac", r)).resbuf;
}),
(L.sha1Hmac.bitsize = 160),
(L.sha256Hmac = function(t, e) {
return L.hmac("sha256", t, e);
}),
(L.asyncSha256Hmac = async function(t, e) {
const r = [t, e];
return (await T.asyncClassMethod(L, "sha256Hmac", r)).resbuf;
}),
(L.sha256Hmac.bitsize = 256),
(L.sha512Hmac = function(t, e) {
return L.hmac("sha512", t, e);
}),
(L.asyncSha512Hmac = async function(t, e) {
const r = [t, e];
return (await T.asyncClassMethod(L, "sha512Hmac", r)).resbuf;
}),
(L.sha512Hmac.bitsize = 512);
var H = r(8764).Buffer;
class U extends O {
constructor(t) {
super({ buf: t });
}
fromHex(t) {
return this.fromBuffer(H.from(t, "hex"));
}
toHex() {
return this.toBuffer().toString("hex");
}
static decode(t) {
if ("string" != typeof t)
throw new Error("Input must be a string");
const e = k.decode(t);
if (e.length < 4) throw new Error("Input string too short");
const r = e.slice(0, -4),
i = e.slice(-4),
n = L.sha256Sha256(r).slice(0, 4);
if (!R(i, n)) throw new Error("Checksum mismatch");
return r;
}
static encode(t) {
if (!H.isBuffer(t)) throw new Error("Input must be a buffer");
const e = H.alloc(t.length + 4),
r = L.sha256Sha256(t);
return t.copy(e), r.copy(e, t.length), k.encode(e);
}
fromBuffer(t) {
return (this.buf = t), this;
}
fromString(t) {
const e = U.decode(t);
return (this.buf = e), this;
}
toBuffer() {
return this.buf;
}
toString() {
return U.encode(this.buf);
}
}
var F = r(4155);
class K {
constructor(t) {
(this.keyDefined = (e) => e in t), (this.getValue = (e) => t[e]);
}
get(t) {
if (this.keyDefined(t)) return this.getValue(t);
throw new Error(`Unknown configuration: ${t}`);
}
}
const D = new (class {
constructor() {
this.variables = {};
}
build() {
return new K(this.variables);
}
addValue(t, e) {
if (void 0 === e)
throw new Error(
`Failed to add "${t}" property. The value cannot be undefined`
);
if (t in this.variables)
throw new Error(`"${t}" already has a value defined.`);
return (this.variables[t] = e), this;
}
addValueWithDefault(t, e, r) {
if (void 0 === r)
throw new Error(
`Failed to add "${t}" property. Default value cannot be undefined`
);
return this.addValue(t, void 0 === e ? r : e);
}
})()
.addValue("NETWORK", F.env.NETWORK || "mainnet")
.build(),
V = {
Mainnet: {
MaxSize: 33554432,
Port: 8333,
Address: { pubKeyHash: 0, payToScriptHash: 5 },
Bip32: { pubKey: 76067358, privKey: 76066276 },
Block: { maxNBits: 486604799, magicNum: 3823236072 },
Msg: { magicNum: 3823236072, versionBytesNum: 70015 },
PrivKey: { versionByteNum: 128 },
TxBuilder: { dust: 546, feePerKbNum: 500 },
Workers: { timeout: 6e4 },
},
};
if (
((V.Testnet = Object.assign({}, V.Mainnet, {
Port: 18333,
Address: { pubKeyHash: 111, payToScriptHash: 196 },
Bip32: { pubKey: 70617039, privKey: 70615956 },
Block: { maxNBits: 486604799, magicNum: 4108710900 },
Msg: { magicNum: 4108710900, versionBytesNum: 70015 },
PrivKey: { versionByteNum: 239 },
})),
(V.Regtest = Object.assign({}, V.Mainnet, {
Port: 18444,
Address: { pubKeyHash: 111, payToScriptHash: 196 },
Bip32: { pubKey: 70617039, privKey: 70615956 },
Block: { maxNBits: 545259519, magicNum: 3669344250 },
Msg: { magicNum: 3669344250, versionBytesNum: 70015 },
PrivKey: { versionByteNum: 239 },
})),
(V.STN = Object.assign({}, V.Mainnet, {
Port: 9333,
Address: { pubKeyHash: 111, payToScriptHash: 196 },
Bip32: { pubKey: 70617039, privKey: 70615956 },
Block: { maxNBits: 486604799, magicNum: 4224632057 },
Msg: { magicNum: 4224632057, versionBytesNum: 70015 },
PrivKey: { versionByteNum: 239 },
})),
"testnet" === D.get("NETWORK"))
)
V.Default = Object.assign({}, V.Testnet);
else if ("mainnet" === D.get("NETWORK"))
V.Default = Object.assign({}, V.Mainnet);
else if ("regtest" === D.get("NETWORK"))
V.Default = Object.assign({}, V.Regtest);
else {
if ("stn" !== D.get("NETWORK"))
throw new Error(
`must set network in environment variable - mainnet, testnet, regtest or stn?, received ${D.get(
"NETWORK"
)}`
);
V.Default = Object.assign({}, V.STN);
}
const j = (t) =>
V.Mainnet.Msg.magicNum === t
? V.Mainnet
: V.Testnet.Msg.magicNum === t
? V.Testnet
: V.Regtest.Msg.magicNum === t
? V.Regtest
: V.STN.Msg.magicNum === t
? V.STN
: V.Default,
q = {
OP_FALSE: 0,
OP_0: 0,
OP_PUSHDATA1: 76,
OP_PUSHDATA2: 77,
OP_PUSHDATA4: 78,
OP_1NEGATE: 79,
OP_RESERVED: 80,
OP_TRUE: 81,
OP_1: 81,
OP_2: 82,
OP_3: 83,
OP_4: 84,
OP_5: 85,
OP_6: 86,
OP_7: 87,
OP_8: 88,
OP_9: 89,
OP_10: 90,
OP_11: 91,
OP_12: 92,
OP_13: 93,
OP_14: 94,
OP_15: 95,
OP_16: 96,
OP_NOP: 97,
OP_VER: 98,
OP_IF: 99,
OP_NOTIF: 100,
OP_VERIF: 101,
OP_VERNOTIF: 102,
OP_ELSE: 103,
OP_ENDIF: 104,
OP_VERIFY: 105,
OP_RETURN: 106,
OP_TOALTSTACK: 107,
OP_FROMALTSTACK: 108,
OP_2DROP: 109,
OP_2DUP: 110,
OP_3DUP: 111,
OP_2OVER: 112,
OP_2ROT: 113,
OP_2SWAP: 114,
OP_IFDUP: 115,
OP_DEPTH: 116,
OP_DROP: 117,
OP_DUP: 118,
OP_NIP: 119,
OP_OVER: 120,
OP_PICK: 121,
OP_ROLL: 122,
OP_ROT: 123,
OP_SWAP: 124,
OP_TUCK: 125,
OP_CAT: 126,
OP_SUBSTR: 127,
OP_SPLIT: 127,
OP_LEFT: 128,
OP_NUM2BIN: 128,
OP_RIGHT: 129,
OP_BIN2NUM: 129,
OP_SIZE: 130,
OP_INVERT: 131,
OP_AND: 132,
OP_OR: 133,
OP_XOR: 134,
OP_EQUAL: 135,
OP_EQUALVERIFY: 136,
OP_RESERVED1: 137,
OP_RESERVED2: 138,
OP_1ADD: 139,
OP_1SUB: 140,
OP_2MUL: 141,
OP_2DIV: 142,
OP_NEGATE: 143,
OP_ABS: 144,
OP_NOT: 145,
OP_0NOTEQUAL: 146,
OP_ADD: 147,
OP_SUB: 148,
OP_MUL: 149,
OP_DIV: 150,
OP_MOD: 151,
OP_LSHIFT: 152,
OP_RSHIFT: 153,
OP_BOOLAND: 154,
OP_BOOLOR: 155,
OP_NUMEQUAL: 156,
OP_NUMEQUALVERIFY: 157,
OP_NUMNOTEQUAL: 158,
OP_LESSTHAN: 159,
OP_GREATERTHAN: 160,
OP_LESSTHANOREQUAL: 161,
OP_GREATERTHANOREQUAL: 162,
OP_MIN: 163,
OP_MAX: 164,
OP_WITHIN: 165,
OP_RIPEMD160: 166,
OP_SHA1: 167,
OP_SHA256: 168,
OP_HASH160: 169,
OP_HASH256: 170,
OP_CODESEPARATOR: 171,
OP_CHECKSIG: 172,
OP_CHECKSIGVERIFY: 173,
OP_CHECKMULTISIG: 174,
OP_CHECKMULTISIGVERIFY: 175,
OP_NOP1: 176,
OP_NOP2: 177,
OP_CHECKLOCKTIMEVERIFY: 177,
OP_NOP3: 178,
OP_CHECKSEQUENCEVERIFY: 178,
OP_NOP4: 179,
OP_NOP5: 180,
OP_NOP6: 181,
OP_NOP7: 182,
OP_NOP8: 183,
OP_NOP9: 184,
OP_NOP10: 185,
OP_SMALLDATA: 249,
OP_SMALLINTEGER: 250,
OP_PUBKEYS: 251,
OP_PUBKEYHASH: 253,
OP_PUBKEY: 254,
OP_INVALIDOPCODE: 255,
};
class z extends O {
constructor(t) {
super({ num: t });
}
fromNumber(t) {
return (this.num = t), this;
}
static fromNumber(t) {
return new this().fromNumber(t);
}
toNumber() {
return this.num;
}
fromString(t) {
const e = q[t];
if (void 0 === e) throw new Error("Invalid opCodeStr");
return (this.num = e), this;
}
static fromString(t) {
return new this().fromString(t);
}
toString() {
const t = z.str[this.num];
if (void 0 === t) {
if (this.num > 0 && this.num < z.OP_PUSHDATA1)
return this.num.toString();
throw new Error("OpCode does not have a string representation");
}
return t;
}
}
z.str = {};
for (const t in q)
(z[t] = q[t]),
Object.prototype.hasOwnProperty.call(q, t) && (z.str[q[t]] = t);
const G = u().curves.secp256k1,
Y = G.curve.point().constructor;
class J extends Y {
constructor(t, e, r) {
super(G.curve, t, e, r);
}
static fromX(t, e) {
const r = G.curve.pointFromX(e, t);
return Object.create(J.prototype).copyFrom(r);
}
copyFrom(t) {
if (!(t instanceof Y))
throw new Error("point should be an external point");
return (
Object.keys(t).forEach(
function(e) {
this[e] = t[e];
}.bind(this)
),
this
);
}
add(t) {
return (
(t = Y.prototype.add.call(this, t)),
Object.create(J.prototype).copyFrom(t)
);
}
mul(t) {
if (!t.lt(J.getN())) throw new Error("point mul out of range");
const e = Y.prototype.mul.call(this, t);
return Object.create(J.prototype).copyFrom(e);
}
mulAdd(t, e, r) {
const i = Y.prototype.mulAdd.call(this, t, e, r);
return (e = Object.create(J.prototype)).copyFrom(i);
}
getX() {
const t = Y.prototype.getX.call(this),
e = Object.create(b.prototype);
return t.copy(e), e;
}
getY() {
const t = Y.prototype.getY.call(this),
e = Object.create(b.prototype);
return t.copy(e), e;
}
fromX(t, e) {
const r = J.fromX(t, e);
return this.copyFrom(r);
}
toJSON() {
return { x: this.getX().toString(), y: this.getY().toString() };
}
fromJSON(t) {
const e = new b().fromString(t.x),
r = new b().fromString(t.y),
i = new J(e, r);
return this.copyFrom(i);
}
toString() {
return JSON.stringify(this.toJSON());
}
fromString(t) {
const e = JSON.parse(t),
r = new J().fromJSON(e);
return this.copyFrom(r);
}
static getG() {
const t = G.curve.g;
return Object.create(J.prototype).copyFrom(t);
}
static getN() {
return new b(G.curve.n.toArray());
}
validate() {
if (
0 !==
J.fromX(this.getY().isOdd(), this.getX())
.getY()
.cmp(this.getY())
)
throw new Error("Invalid y value of public key");
if (
!(
this.getX().gt(-1) &&
this.getX().lt(J.getN()) &&
this.getY().gt(-1) &&
this.getY().lt(J.getN())
)
)
throw new Error("Point does not lie on the curve");
return this;
}
}
var W = r(8764).Buffer;
class X extends O {
constructor(t, e) {
super({ point: t, compressed: e });
}
fromJSON(t) {
return this.fromFastHex(t), this;
}
toJSON() {
return this.toFastHex();
}
fromPrivKey(t) {
return (
this.fromObject({
point: J.getG().mul(t.bn),
compressed: t.compressed,
}),
this
);
}
static fromPrivKey(t) {
return new this().fromPrivKey(t);
}
async asyncFromPrivKey(t) {
const e = await T.asyncObjectMethod(this, "fromPrivKey", [t]);
return this.fromFastBuffer(e.resbuf);
}
static asyncFromPrivKey(t) {
return new this().asyncFromPrivKey(t);
}
fromBuffer(t, e) {
return this.fromDer(t, e);
}
async asyncFromBuffer(t, e) {
const r = [t, e],
i = await T.asyncObjectMethod(this, "fromBuffer", r);
return this.fromFastBuffer(i.resbuf);
}
fromFastBuffer(t) {
if (0 === t.length) return this;
const e = Boolean(t[0]);
return (
(t = t.slice(1)), this.fromDer(t), (this.compressed = e), this
);
}
fromDer(t, e) {
if (
((e = void 0 === e),
4 !== t[0] && (e || (6 !== t[0] && 7 !== t[0])))
)
if (3 === t[0]) {
const e = new b(t.slice(1));
this.fromX(!0, e), (this.compressed = !0);
} else {
if (2 !== t[0]) throw new Error("Invalid DER format pubKey");
{
const e = new b(t.slice(1));
this.fromX(!1, e), (this.compressed = !0);
}
}
else {
const e = t.slice(1, 33),
r = t.slice(33, 65);
if (32 !== e.length || 32 !== r.length || 65 !== t.length)
throw new Error("LEngth of x and y must be 32 bytes");
const i = new b(e),
n = new b(r);
(this.point = new J(i, n)), (this.compressed = !1);
}
return this;
}
static fromDer(t, e) {
return new this().fromDer(t, e);
}
fromString(t) {
return this.fromDer(W.from(t, "hex")), this;
}
fromX(t, e) {
if ("boolean" != typeof t)
throw new Error(
"Must specify whether y is odd or not (true or false)"
);
return (this.point = J.fromX(t, e)), this;
}
static fromX(t, e) {
return new this().fromX(t, e);
}
toBuffer() {
const t = void 0 === this.compressed || this.compressed;
return this.toDer(t);
}
toFastBuffer() {
if (!this.point) return W.alloc(0);
const t = new _(),
e = void 0 === this.compressed || Boolean(this.compressed);
return (
t.writeUInt8(Number(e)), t.write(this.toDer(!1)), t.toBuffer()
);
}
toDer(t) {
if ("boolean" != typeof (t = void 0 === t ? this.compressed : t))
throw new Error(
"Must specify whether the public key is compressed or not (true or false)"
);
const e = this.point.getX(),
r = this.point.getY(),
i = e.toBuffer({ size: 32 }),
n = r.toBuffer({ size: 32 });
let s;
return t
? ((s = n[n.length - 1] % 2 ? W.from([3]) : W.from([2])),
W.concat([s, i]))
: ((s = W.from([4])), W.concat([s, i, n]));
}
toString() {
const t = void 0 === this.compressed || this.compressed;
return this.toDer(t).toString("hex");
}
static isCompressedOrUncompressed(t) {
if (t.length < 33) return !1;
if (4 === t[0]) {
if (65 !== t.length) return !1;
} else {
if (2 !== t[0] && 3 !== t[0]) return !1;
if (33 !== t.length) return !1;
}
return !0;
}
validate() {
if (this.point.isInfinity())
throw new Error("point: Point cannot be equal to Infinity");
if (this.point.eq(new J(new b(0), new b(0))))
throw new Error("point: Point cannot be equal to 0, 0");
return this.point.validate(), this;
}
}
var Q = r(1798),
Z = r.n(Q);
class $ {}
$.getRandomBuffer = function(t) {
return Z()(t);
};
var tt = r(8764).Buffer;
class et extends O {
constructor(t, e, r = null) {
super({ bn: t, compressed: e }),
(r = r || V.Default.PrivKey),
(this.Constants = r);
}
fromJSON(t) {
return this.fromHex(t), this;
}
toJSON() {
return this.toHex();
}
fromRandom() {
let t, e, r;
do {
(t = $.getRandomBuffer(32)),
(e = new b().fromBuffer(t)),
(r = e.lt(J.getN()));
} while (!r);
return this.fromObject({ bn: e, compressed: !0 }), this;
}
static fromRandom() {
return new this().fromRandom();
}
toBuffer() {
let t = this.compressed;
void 0 === t && (t = !0);
const e = this.bn.toBuffer({ size: 32 });
let r;
return (
(r = t
? tt.concat([
tt.from([this.Constants.versionByteNum]),
e,
tt.from([1]),
])
: tt.concat([tt.from([this.Constants.versionByteNum]), e])),
r
);
}
fromBuffer(t) {
if (34 === t.length && 1 === t[33]) this.compressed = !0;
else {
if (33 !== t.length)
throw new Error(
"Length of privKey buffer must be 33 (uncompressed pubKey) or 34 (compressed pubKey)"
);
this.compressed = !1;
}
if (t[0] !== this.Constants.versionByteNum)
throw new Error("Invalid versionByteNum byte");
return this.fromBn(new b().fromBuffer(t.slice(1, 33)));
}
toBn() {
return this.bn;
}
fromBn(t) {
return (this.bn = t), this;
}
static fromBn(t) {
return new this().fromBn(t);
}
validate() {
if (!this.bn.lt(J.getN()))
throw new Error("Number must be less than N");
if ("boolean" != typeof this.compressed)
throw new Error(
"Must specify whether the corresponding public key is compressed or not (true or false)"
);
return this;
}
toWif() {
return U.encode(this.toBuffer());
}
fromWif(t) {
return this.fromBuffer(U.decode(t));
}
static fromWif(t) {
return new this().fromWif(t);
}
toString() {
return this.toWif();
}
fromString(t) {
return this.fromWif(t);
}
}
(et.Mainnet = class extends et {
constructor(t, e) {
super(t, e, V.Mainnet.PrivKey);
}
}),
(et.Testnet = class extends et {
constructor(t, e) {
super(t, e, V.Testnet.PrivKey);
}
});
var rt = r(8764).Buffer;
class it extends O {
constructor(t, e, r, i, n) {
super({ r: t, s: e, nHashType: r, recovery: i, compressed: n });
}
fromBuffer(t) {
try {
return this.fromDer(t, !0);
} catch (t) {}
try {
return this.fromCompact(t);
} catch (t) {}
return this.fromTxFormat(t);
}
toBuffer() {
return void 0 !== this.nHashType
? this.toTxFormat()
: void 0 !== this.recovery
? this.toCompact()
: this.toDer();
}
fromCompact(t) {
let e = !0,
r = t.slice(0, 1)[0] - 27 - 4;
if (
(r < 0 && ((e = !1), (r += 4)),
0 !== r && 1 !== r && 2 !== r && 3 !== r)
)
throw new Error("i must be 0, 1, 2, or 3");
(this.compressed = e), (this.recovery = r);
const i = t.slice(1);
return this.fromRS(i), this;
}
static fromCompact(t) {
return new this().fromCompact(t);
}
fromRS(t) {
const e = t.slice(0, 32),
r = t.slice(32, 64);
if (32 !== e.length) throw new Error("r must be 32 bytes");
if (32 !== r.length || t.length > 64)
throw new Error("s must be 32 bytes");
return (
(this.r = new b().fromBuffer(e)),
(this.s = new b().fromBuffer(r)),
this
);
}
static fromRS(t) {
return new this().fromRS(t);
}
fromDer(t, e) {
const r = it.parseDer(t, e);
return (this.r = r.r), (this.s = r.s), this;
}
static fromDer(t, e) {
return new this().fromDer(t, e);
}
fromTxFormat(t) {
if (0 === t.length)
return (
(this.r = new b(1)),
(this.s = new b(1)),
(this.nHashType = 1),
this
);
const e = t.readUInt8(t.length - 1),
r = t.slice(0, t.length - 1);
return this.fromDer(r, !1), (this.nHashType = e), this;
}
static fromTxFormat(t) {
return new this().fromTxFormat(t);
}
fromString(t) {
return this.fromHex(t);
}
static parseDer(t, e) {
if ((void 0 === e && (e = !0), !rt.isBuffer(t)))
throw new Error("DER formatted signature should be a buffer");
const r = t[0];
if (48 !== r) throw new Error("Header byte should be 0x30");
let i = t[1];
const n = t.slice(2).length;
if (e && i !== n)
throw new Error("LEngth byte should length of what follows");
i = i < n ? i : n;
const s = t[2];
if (2 !== s) throw new Error("Integer byte for r should be 0x02");
const o = t[3],
a = t.slice(4, 4 + o),
h = new b().fromBuffer(a),
f = 0 === t[4];
if (o !== a.length) throw new Error("LEngth of r incorrect");
const u = t[4 + o + 0];
if (2 !== u) throw new Error("Integer byte for s should be 0x02");
const c = t[4 + o + 1],
d = t.slice(4 + o + 2, 4 + o + 2 + c),
l = new b().fromBuffer(d),
p = 0 === t[4 + o + 2 + 2];
if (c !== d.length) throw new Error("LEngth of s incorrect");
if (i !== 4 + o + 2 + c - 2)
throw new Error("LEngth of signature incorrect");
return {
header: r,
length: i,
rheader: s,
rlength: o,
rneg: f,
rbuf: a,
r: h,
sheader: u,
slength: c,
sneg: p,
sbuf: d,
s: l,
};
}
static IsTxDer(t) {
if (t.length < 9) return !1;
if (t.length > 73) return !1;
if (48 !== t[0]) return !1;
if (t[1] !== t.length - 3) return !1;
const e = t[3];
if (5 + e >= t.length) return !1;
const r = t[5 + e];
if (e + r + 7 !== t.length) return !1;
const i = t.slice(4);
if (2 !== t[2]) return !1;
if (0 === e) return !1;
if (128 & i[0]) return !1;
if (e > 1 && 0 === i[0] && !(128 & i[1])) return !1;
const n = t.slice(6 + e);
return !(
2 !== t[6 + e - 2] ||
0 === r ||
128 & n[0] ||
(r > 1 && 0 === n[0] && !(128 & n[1]))
);
}
hasLowS() {
return (
!this.s.lt(1) &&
!this.s.gt(
b.fromBuffer(
rt.from(
"7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0",
"hex"
)
)
)
);
}
hasDefinedHashType() {
return !(
this.nHashType < it.SIGHASH_ALL ||
this.nHashType > it.SIGHASH_SINGLE
);
}
toCompact(t, e) {
if (
((t = "number" == typeof t ? t : this.recovery),
(e = "boolean" == typeof e ? e : this.compressed),
0 !== t && 1 !== t && 2 !== t && 3 !== t)
)
throw new Error("recovery must be equal to 0, 1, 2, or 3");
let r = t + 27 + 4;
!1 === e && (r -= 4);
const i = rt.from([r]),
n = this.r.toBuffer({ size: 32 }),
s = this.s.toBuffer({ size: 32 });
return rt.concat([i, n, s]);
}
toRS() {
return rt.concat([
this.r.toBuffer({ size: 32 }),
this.s.toBuffer({ size: 32 }),
]);
}
toDer() {
const t = this.r.toBuffer(),
e = this.s.toBuffer(),
r = 128 & t[0],
i = 128 & e[0],
n = r ? rt.concat([rt.from([0]), t]) : t,
s = i ? rt.concat([rt.from([0]), e]) : e,
o = 2 + n.length + 2 + s.length,
a = n.length,
h = s.length;
return rt.concat([rt.from([48, o, 2, a]), n, rt.from([2, h]), s]);
}
toTxFormat() {
const t = this.toDer(),
e = rt.alloc(1);
return e.writeUInt8(this.nHashType, 0), rt.concat([t, e]);
}
toString() {
return this.toHex();
}
}
(it.SIGHASH_ALL = 1),
(it.SIGHASH_NONE = 2),
(it.SIGHASH_SINGLE = 3),
(it.SIGHASH_FORKID = 64),
(it.SIGHASH_ANYONECANPAY = 128);
var nt = r(8764).Buffer;
class st extends O {
constructor(t = []) {
super({ chunks: t });
}
fromJSON(t) {
return this.fromString(t);
}
toJSON() {
return this.toString();
}
fromBuffer(t) {
this.chunks = [];
const e = new w(t);
for (; !e.eof(); ) {
const t = e.readUInt8();
let r = 0,
i = nt.from([]);
if (t > 0 && t < z.OP_PUSHDATA1)
(r = t),
this.chunks.push({ buf: e.read(r), len: r, opCodeNum: t });
else if (t === z.OP_PUSHDATA1) {
try {
(r = e.readUInt8()), (i = e.read(r));
} catch (t) {
e.read();
}
this.chunks.push({ buf: i, len: r, opCodeNum: t });
} else if (t === z.OP_PUSHDATA2) {
try {
(r = e.readUInt16LE()), (i = e.read(r));
} catch (t) {
e.read();
}
this.chunks.push({ buf: i, len: r, opCodeNum: t });
} else if (t === z.OP_PUSHDATA4) {
try {
(r = e.readUInt32LE()), (i = e.read(r));
} catch (t) {
e.read();
}
this.chunks.push({ buf: i, len: r, opCodeNum: t });
} else this.chunks.push({ opCodeNum: t });
}
return this;
}
toBuffer() {
const t = new _();
for (let e = 0; e < this.chunks.length; e++) {
const r = this.chunks[e],
i = r.opCodeNum;
t.writeUInt8(i),
r.buf &&
(i < z.OP_PUSHDATA1
? t.write(r.buf)
: i === z.OP_PUSHDATA1
? (t.writeUInt8(r.len), t.write(r.buf))
: i === z.OP_PUSHDATA2
? (t.writeUInt16LE(r.len), t.write(r.buf))
: i === z.OP_PUSHDATA4 &&
(t.writeUInt32LE(r.len), t.write(r.buf)));
}
return t.toBuffer();
}
fromString(t) {
if (((this.chunks = []), "" === t || void 0 === t)) return this;
const e = t.split(" ");
let r = 0;
for (; r < e.length; ) {
const t = e[r];
let i;
try {
i = new z().fromString(t).toNumber();
} catch (t) {}
if (void 0 === i)
if (((i = parseInt(t, 10)), i > 0 && i < z.OP_PUSHDATA1))
this.chunks.push({
buf: nt.from(e[r + 1].slice(2), "hex"),
len: i,
opCodeNum: i,
}),
(r += 2);
else {
if (0 !== i) throw new Error("Invalid script");
this.chunks.push({ opCodeNum: 0 }), (r += 1);
}
else if (
i === z.OP_PUSHDATA1 ||
i === z.OP_PUSHDATA2 ||
i === z.OP_PUSHDATA4
) {
if ("0x" !== e[r + 2].slice(0, 2))
throw new Error("Pushdata data must start with 0x");
this.chunks.push({
buf: nt.from(e[r + 2].slice(2), "hex"),
len: parseInt(e[r + 1], 10),
opCodeNum: i,
}),
(r += 3);
} else this.chunks.push({ opCodeNum: i }), (r += 1);
}
return this;
}
toString() {
let t = "";
for (let e = 0; e < this.chunks.length; e++) {
const r = this.chunks[e],
i = r.opCodeNum;
r.buf
? ((i !== z.OP_PUSHDATA1 &&
i !== z.OP_PUSHDATA2 &&
i !== z.OP_PUSHDATA4) ||
(t = t + " " + new z(i).toString()),
(t = t + " " + r.len),
(t = t + " 0x" + r.buf.toString("hex")))
: (t =
void 0 !== z.str[i]
? t + " " + new z(i).toString()
: t + " 0x" + i.toString(16));
}
return t.substr(1);
}
fromBitcoindString(t) {
const e = new _(),
r = t.split(" ");
let i;
for (i = 0; i < r.length; i++) {
const t = r[i];
if ("" !== t)
if ("0" === t[0] && "x" === t[1]) {
const r = t.slice(2);
e.write(nt.from(r, "hex"));
} else if ("'" === t[0]) {
const r = t.slice(1, t.length - 1),
i = nt.from(r),
n = new st().writeBuffer(i).toBuffer();
e.write(n);
} else if (void 0 !== z["OP_" + t]) {
const r = z["OP_" + t];
e.writeUInt8(r);
} else if ("number" == typeof z[t]) {
const r = z[t];
e.writeUInt8(r);
} else {
if (isNaN(parseInt(t, 10)))
throw new Error(
"Could not determine type of script value"
);
{
const r = new b(t),
i = new st().writeBn(r).toBuffer();
e.write(i);
}
}
}
const n = e.toBuffer();
return this.fromBuffer(n);
}
static fromBitcoindString(t) {
return new this().fromBitcoindString(t);
}
toBitcoindString() {
let t = "";
for (let e = 0; e < this.chunks.length; e++) {
const r = this.chunks[e];
t = r.buf
? t + " 0x" + new st([r]).toBuffer().toString("hex")
: void 0 !== z.str[r.opCodeNum]
? t + " " + new z(r.opCodeNum).toString().slice(3)
: t + " 0x" + r.opCodeNum.toString(16);
}
return t.substr(1);
}
fromAsmString(t) {
this.chunks = [];
const e = t.split(" ");
let r = 0;
for (; r < e.length; ) {
const t = e[r];
let i, n;
try {
(i = z.fromString(t)), (n = i.toNumber());
} catch (t) {
(i = void 0), (n = void 0);
}
if ("0" === t)
(n = 0), this.chunks.push({ opCodeNum: n }), (r += 1);
else if ("-1" === t)
(n = z.OP_1NEGATE),
this.chunks.push({ opCodeNum: n }),
(r += 1);
else if (void 0 === i) {
const t = e[r],
i = nt.from(t, "hex");
if (i.toString("hex") !== t)
throw new Error("invalid hex string in script");
const s = i.length;
s >= 0 && s < z.OP_PUSHDATA1
? (n = s)
: s < Math.pow(2, 8)
? (n = z.OP_PUSHDATA1)
: s < Math.pow(2, 16)
? (n = z.OP_PUSHDATA2)
: s < Math.pow(2, 32) && (n = z.OP_PUSHDATA4),
this.chunks.push({ buf: i, len: i.length, opCodeNum: n }),
(r += 1);
} else this.chunks.push({ opCodeNum: n }), (r += 1);
}
return this;
}
static fromAsmString(t) {
return new this().fromAsmString(t);
}
toAsmString() {
for (var t = "", e = 0; e < this.chunks.length; e++) {
var r = this.chunks[e];
t += this._chunkToString(r);
}
return t.substr(1);
}
_chunkToString(t, e) {
var r = t.opCodeNum,
i = "";
if (t.buf) t.len > 0 && (i = i + " " + t.buf.toString("hex"));
else if (void 0 !== z.str[r])
0 === r
? (i += " 0")
: 79 === r
? (i += " -1")
: (i = i + " " + new z(r).toString());
else {
var n = r.toString(16);
n.length % 2 != 0 && (n = "0" + n), (i = i + " " + n);
}
return i;
}
fromOpReturnData(t) {
return this.writeOpCode(z.OP_RETURN), this.writeBuffer(t), this;
}
static fromOpReturnData(t) {
return new this().fromOpReturnData(t);
}
fromSafeData(t) {
return (
this.writeOpCode(z.OP_FALSE),
this.writeOpCode(z.OP_RETURN),
this.writeBuffer(t),
this
);
}
static fromSafeData(t) {
return new this().fromSafeData(t);
}
fromSafeDataArray(t) {
this.writeOpCode(z.OP_FALSE), this.writeOpCode(z.OP_RETURN);
for (const e in t) {
const r = t[e];
this.writeBuffer(r);
}
return this;
}
static fromSafeDataArray(t) {
return new this().fromSafeDataArray(t);
}
getData() {
if (this.isSafeDataOut())
return this.chunks.slice(2).map((t) => t.buf);
if (this.isOpReturn())
return this.chunks.slice(1).map((t) => t.buf);
throw new Error("Unrecognized script type to get data from");
}
fromPubKeyHash(t) {
if (20 !== t.length)
throw new Error("hashBuf must be a 20 byte buffer");
return (
this.writeOpCode(z.OP_DUP),
this.writeOpCode(z.OP_HASH160),
this.writeBuffer(t),
this.writeOpCode(z.OP_EQUALVERIFY),
this.writeOpCode(z.OP_CHECKSIG),
this
);
}
static fromPubKeyHash(t) {
return new this().fromPubKeyHash(t);
}
static sortPubKeys(t) {
return t.slice().sort((t, e) => {
const r = t.toBuffer(),
i = e.toBuffer(),
n = Math.max(r.length, i.length);
for (let t = 0; t <= n; t++) {
if (void 0 === r[t]) return -1;
if (void 0 === i[t]) return 1;
if (r[t] < i[t]) return -1;
if (r[t] > i[t]) return 1;
}
});
}
fromPubKeys(t, e, r = !0) {
if ("number" != typeof t) throw new Error("m must be a number");
!0 === r && (e = st.sortPubKeys(e)),
this.writeOpCode(t + z.OP_1 - 1);
for (const t in e) this.writeBuffer(e[t].toBuffer());
return (
this.writeOpCode(e.length + z.OP_1 - 1),
this.writeOpCode(z.OP_CHECKMULTISIG),
this
);
}
static fromPubKeys(t, e, r) {
return new this().fromPubKeys(t, e, r);
}
removeCodeseparators() {
const t = [];
for (let e = 0; e < this.chunks.length; e++)
this.chunks[e].opCodeNum !== z.OP_CODESEPARATOR &&
t.push(this.chunks[e]);
return (this.chunks = t), this;
}
isPushOnly() {
for (let t = 0; t < this.chunks.length; t++)
if (this.chunks[t].opCodeNum > z.OP_16) return !1;
return !0;
}
isNonSpendable() {
const t = this.chunks[0].opCodeNum === z.OP_FALSE,
e = this.chunks[1] && this.chunks[1].opCodeNum === z.OP_RETURN;
return !!t && !!e;
}
isOpReturn() {
return (
this.chunks[0].opCodeNum === z.OP_RETURN &&
this.chunks.filter((t) => nt.isBuffer(t.buf)).length ===
this.chunks.slice(1).length
);
}
isSafeDataOut() {
if (this.chunks.length < 2) return !1;
if (this.chunks[0].opCodeNum !== z.OP_FALSE) return !1;
var t = this.chunks.slice(1);
return new st(t).isOpReturn();
}
isPubKeyHashOut() {
return !!(
this.chunks[0] &&
this.chunks[0].opCodeNum === z.OP_DUP &&
this.chunks[1] &&
this.chunks[1].opCodeNum === z.OP_HASH160 &&
this.chunks[2].buf &&
this.chunks[3] &&
this.chunks[3].opCodeNum === z.OP_EQUALVERIFY &&
this.chunks[4] &&
this.chunks[4].opCodeNum === z.OP_CHECKSIG
);
}
isPubKeyHashIn() {
return !(
2 !== this.chunks.length ||
(!this.chunks[0].buf && this.chunks[0].opCodeNum !== z.OP_0) ||
(!this.chunks[1].buf && this.chunks[0].opCodeNum !== z.OP_0)
);
}
isScriptHashOut() {
const t = this.toBuffer();
return (
23 === t.length &&
t[0] === z.OP_HASH160 &&
20 === t[1] &&
t[22] === z.OP_EQUAL
);
}
isScriptHashIn() {
if (!this.isPushOnly()) return !1;
try {
new st().fromBuffer(this.chunks[this.chunks.length - 1].buf);
} catch (t) {
return !1;
}
return !0;
}
isMultiSigOut() {
const t = this.chunks[0].opCodeNum - z.OP_1 + 1;
if (!(t >= 1 && t <= 16)) return !1;
if (
!this.chunks.slice(1, this.chunks.length - 2).every((t) => {
try {
const e = t.buf;
return new X().fromDer(e).validate(), !0;
} catch (t) {
return !1;
}
})
)
return !1;
const e =
this.chunks[this.chunks.length - 2].opCodeNum - z.OP_1 + 1;
return (
e >= t &&
e <= 16 &&
this.chunks[1 + e + 1].opCodeNum === z.OP_CHECKMULTISIG
);
}
isMultiSigIn() {
if (this.chunks[0].opCodeNum !== z.OP_0) return !1;
const t = this.chunks.slice(1);
return (
!(t.length < 1) &&
t.every((t) => nt.isBuffer(t.buf) && it.IsTxDer(t.buf))
);
}
findAndDelete(t) {
const e = t.toBuffer();
for (let t = 0; t < this.chunks.length; t++) {
const r = new st([this.chunks[t]]).toBuffer();
R(e, r) && this.chunks.splice(t, 1);
}
return this;
}
writeScript(t) {
return (this.chunks = this.chunks.concat(t.chunks)), this;
}
static writeScript(t) {
return new this().writeScript(t);
}
writeString(t) {
const e = new st().fromString(t);
return (this.chunks = this.chunks.concat(e.chunks)), this;
}
static writeString(t) {
return new this().writeString(t);
}
writeOpCode(t) {
return this.chunks.push({ opCodeNum: t }), this;
}
static writeOpCode(t) {
return new this().writeOpCode(t);
}
setChunkOpCode(t, e) {
return (this.chunks[t] = { opCodeNum: e }), this;
}
writeBn(t) {
if (t.cmp(0) === z.OP_0) this.chunks.push({ opCodeNum: z.OP_0 });
else if (0 === t.cmp(-1))
this.chunks.push({ opCodeNum: z.OP_1NEGATE });
else if (t.cmp(1) >= 0 && t.cmp(16) <= 0)
this.chunks.push({ opCodeNum: t.toNumber() + z.OP_1 - 1 });
else {
const e = t.toSm({ endian: "little" });
this.writeBuffer(e);
}
return this;
}
static writeBn(t) {
return new this().writeBn(t);
}
writeNumber(t) {
return this.writeBn(new b().fromNumber(t)), this;
}
static writeNumber(t) {
return new this().writeNumber(t);
}
setChunkBn(t, e) {
return (this.chunks[t] = new st().writeBn(e).chunks[0]), this;
}
writeBuffer(t) {
let e;
const r = t.length;
if (t.length > 0 && t.length < z.OP_PUSHDATA1) e = t.length;
else if (0 === t.length) e = z.OP_0;
else if (t.length < Math.pow(2, 8)) e = z.OP_PUSHDATA1;
else if (t.length < Math.pow(2, 16)) e = z.OP_PUSHDATA2;
else {
if (!(t.length < Math.pow(2, 32)))
throw new Error("You can't push that much data");
e = z.OP_PUSHDATA4;
}
return this.chunks.push({ buf: t, len: r, opCodeNum: e }), this;
}
static writeBuffer(t) {
return new this().writeBuffer(t);
}
setChunkBuffer(t, e) {
return (this.chunks[t] = new st().writeBuffer(e).chunks[0]), this;
}
checkMinimalPush(t) {
const e = this.chunks[t],
r = e.buf,
i = e.opCodeNum;
return !(
r &&
(0 === r.length
? i !== z.OP_0
: 1 === r.length && r[0] >= 1 && r[0] <= 16
? i !== z.OP_1 + (r[0] - 1)
: 1 === r.length && 129 === r[0]
? i !== z.OP_1NEGATE
: r.length <= 75
? i !== r.length
: r.length <= 255
? i !== z.OP_PUSHDATA1
: r.length <= 65535 && i !== z.OP_PUSHDATA2)
);
}
}
var ot = r(8764).Buffer;
class at extends O {
constructor(t, e, r = null) {
super({ versionByteNum: t, hashBuf: e }),
(r = r || V.Default.Address),
(this.Constants = r);
}
fromBuffer(t) {
if (21 !== t.length)
throw new Error("address buffers must be exactly 21 bytes");
if (t[0] !== this.Constants.pubKeyHash)
throw new Error("address: invalid versionByteNum byte");
return (
(this.versionByteNum = t[0]), (this.hashBuf = t.slice(1)), this
);
}
fromPubKeyHashBuf(t) {
return (
(this.hashBuf = t),
(this.versionByteNum = this.Constants.pubKeyHash),
this
);
}
static fromPubKeyHashBuf(t) {
return new this().fromPubKeyHashBuf(t);
}
fromPubKey(t) {
const e = L.sha256Ripemd160(t.toBuffer());
return this.fromPubKeyHashBuf(e);
}
static fromPubKey(t) {
return new this().fromPubKey(t);
}
async asyncFromPubKey(t) {
const e = [t],
r = await T.asyncObjectMethod(this, "fromPubKey", e);
return this.fromFastBuffer(r.resbuf);
}
static asyncFromPubKey(t) {
return new this().asyncFromPubKey(t);
}
fromPrivKey(t) {
const e = new X().fromPrivKey(t),
r = L.sha256Ripemd160(e.toBuffer());
return this.fromPubKeyHashBuf(r);
}
static fromPrivKey(t) {
return new this().fromPrivKey(t);
}
async asyncFromPrivKey(t) {
const e = [t],
r = await T.asyncObjectMethod(this, "fromPrivKey", e);
return this.fromFastBuffer(r.resbuf);
}
static asyncFromPrivKey(t) {
return new this().fromPrivKey(t);
}
fromRandom() {
const t = new et().fromRandom();
return this.fromPrivKey(t);
}
static fromRandom() {
return new this().fromRandom();
}
async asyncFromRandom() {
const t = await T.asyncObjectMethod(this, "fromRandom", []);
return this.fromFastBuffer(t.resbuf);
}
static asyncFromRandom() {
return new this().fromRandom();
}
fromString(t) {
const e = U.decode(t);
return this.fromBuffer(e);
}
async asyncFromString(t) {
const e = [t],
r = await T.asyncObjectMethod(this, "fromString", e);
return this.fromFastBuffer(r.resbuf);
}
static asyncFromString(t) {
return new this().asyncFromString(t);
}
static isValid(t) {
let e;
try {
e = new at().fromString(t);
} catch (t) {
return !1;
}
return e.isValid();
}
isValid() {
try {
return this.validate(), !0;
} catch (t) {
return !1;
}
}
toTxOutScript() {
const t = new st();
return (
t.writeOpCode(z.OP_DUP),
t.writeOpCode(z.OP_HASH160),
t.writeBuffer(this.hashBuf),
t.writeOpCode(z.OP_EQUALVERIFY),
t.writeOpCode(z.OP_CHECKSIG),
t
);
}
fromTxInScript(t) {
const e = L.sha256Ripemd160(
t.chunks[1].buf || ot.from("00".repeat(32), "hex")
);
return this.fromPubKeyHashBuf(e);
}
static fromTxInScript(t) {
return new this().fromTxInScript(t);
}
fromTxOutScript(t) {
return this.fromPubKeyHashBuf(t.chunks[2].buf);
}
static fromTxOutScript(t) {
return new this().fromTxOutScript(t);
}
toBuffer() {
const t = ot.from([this.versionByteNum]);
return ot.concat([t, this.hashBuf]);
}
toJSON() {
const t = {};
return (
this.hashBuf && (t.hashBuf = this.hashBuf.toString("hex")),
void 0 !== this.versionByteNum &&
(t.versionByteNum = this.versionByteNum),
t
);
}
fromJSON(t) {
return (
t.hashBuf && (this.hashBuf = ot.from(t.hashBuf, "hex")),
void 0 !== t.versionByteNum &&
(this.versionByteNum = t.versionByteNum),
this
);
}
toString() {
return U.encode(this.toBuffer());
}
async asyncToString() {
const t = await T.asyncObjectMethod(this, "toString", []);
return JSON.parse(t.resbuf.toString());
}
validate() {
if (!ot.isBuffer(this.hashBuf) || 20 !== this.hashBuf.length)
throw new Error("hashBuf must be a buffer of 20 bytes");
if (this.versionByteNum !== this.Constants.pubKeyHash)
throw new Error("invalid versionByteNum");
return this;
}
}
(at.Mainnet = class extends at {
constructor(t, e) {
super(t, e, V.Mainnet.Address);
}
}),
(at.Testnet = class extends at {
constructor(t, e) {
super(t, e, V.Testnet.Address);
}
});
var ht = r(8764).Buffer;
class ft extends O {
constructor(t, e, r, i, n, s, o, a = null, h = et) {
super({
versionBytesNum: t,
depth: e,
parentFingerPrint: r,
childIndex: i,
chainCode: n,
privKey: s,
pubKey: o,
}),
(a = a || V.Default.Bip32),
(this.Constants = a),
(this.PrivKey = h);
}
fromRandom() {
return (
(this.versionBytesNum = this.Constants.privKey),
(this.depth = 0),
(this.parentFingerPrint = ht.from([0, 0, 0, 0])),
(this.childIndex = 0),
(this.chainCode = $.getRandomBuffer(32)),
(this.privKey = new this.PrivKey().fromRandom()),
(this.pubKey = new X().fromPrivKey(this.privKey)),
this
);
}
static fromRandom() {
return new this().fromRandom();
}
fromString(t) {
return this.fromBuffer(U.decode(t));
}
async asyncFromString(t) {
const e = [t],
r = await T.asyncObjectMethod(this, "fromString", e);
return this.fromFastBuffer(r.resbuf);
}
fromSeed(t) {
if (!ht.isBuffer(t)) throw new Error("bytes must be a buffer");
if (t.length < 16)
throw new Error("Need more than 128 bits of entropy");
if (t.length > 64)
throw new Error("More than 512 bits of entropy is nonstandard");
const e = L.sha512Hmac(t, ht.from("Bitcoin seed"));
return (
(this.depth = 0),
(this.parentFingerPrint = ht.from([0, 0, 0, 0])),
(this.childIndex = 0),
(this.chainCode = e.slice(32, 64)),
(this.versionBytesNum = this.Constants.privKey),
(this.privKey = new this.PrivKey().fromBn(
b().fromBuffer(e.slice(0, 32))
)),
(this.pubKey = new X().fromPrivKey(this.privKey)),
this
);
}
static fromSeed(t) {
return new this().fromSeed(t);
}
async asyncFromSeed(t) {
const e = await T.asyncObjectMethod(this, "fromSeed", [t]);
return this.fromFastBuffer(e.resbuf);
}
static asyncFromSeed(t) {
return new this().asyncFromSeed(t);
}
fromBuffer(t) {
if (78 !== t.length)
throw new Error("incorrect bip32 data length");
(this.versionBytesNum = t.slice(0, 4).readUInt32BE(0)),
(this.depth = t.slice(4, 5).readUInt8(0)),
(this.parentFingerPrint = t.slice(5, 9)),
(this.childIndex = t.slice(9, 13).readUInt32BE(0)),
(this.chainCode = t.slice(13, 45));
const e = t.slice(45, 78),
r = this.versionBytesNum === this.Constants.privKey,
i = this.versionBytesNum === this.Constants.pubKey;
if (r && 0 === e[0])
(this.privKey = new this.PrivKey().fromBn(
b().fromBuffer(e.slice(1, 33))
)),
(this.pubKey = new X().fromPrivKey(this.privKey));
else {
if (!i || (2 !== e[0] && 3 !== e[0]))
throw new Error("Invalid key");
this.pubKey = new X().fromDer(e);
}
return this;
}
fromFastBuffer(t) {
if (0 === t.length) return this;
if (78 !== t.length && 111 !== t.length)
throw new Error(
"incorrect bip32 fastBuffer data length: " + t.length
);
(this.versionBytesNum = t.slice(0, 4).readUInt32BE(0)),
(this.depth = t.slice(4, 5).readUInt8(0)),
(this.parentFingerPrint = t.slice(5, 9)),
(this.childIndex = t.slice(9, 13).readUInt32BE(0)),
(this.chainCode = t.slice(13, 45));
const e = t.slice(45, t.length),
r = this.versionBytesNum === this.Constants.privKey,
i = this.versionBytesNum === this.Constants.pubKey;
if (r && 0 === e[0] && 78 === t.length)
(this.privKey = new this.PrivKey().fromBn(
b().fromBuffer(e.slice(1, 33))
)),
(this.pubKey = new X().fromPrivKey(this.privKey));
else {
if (!i || 111 !== t.length) throw new Error("Invalid key");
(this.pubKey = new X().fromFastBuffer(e)),
(this.pubKey.compressed = !0);
}
return this;
}
derive(t) {
const e = t.split("/");
if ("m" === t) return this;
let r = this;
for (const t in e) {
const i = e[t];
if ("0" === t) {
if ("m" !== i) throw new Error("invalid path");
continue;
}
if (
parseInt(i.replace("'", ""), 10).toString() !==
i.replace("'", "")
)
throw new Error("invalid path");
const n = i.length > 1 && "'" === i[i.length - 1];
let s =
2147483647 & parseInt(n ? i.slice(0, i.length - 1) : i, 10);
n && (s += 2147483648), (r = r.deriveChild(s));
}
return r;
}
async asyncDerive(t) {
const e = await T.asyncObjectMethod(this, "derive", [t]);
return new this.constructor().fromFastBuffer(e.resbuf);
}
deriveChild(t) {
if ("number" != typeof t) throw new Error("i must be a number");
let e = [];
e.push((t >> 24) & 255),
e.push((t >> 16) & 255),
e.push((t >> 8) & 255),
e.push(255 & t),
(e = ht.from(e));
const r = 0 != (2147483648 & t),
i = this.versionBytesNum === this.Constants.privKey;
if (r && (!this.privKey || !i))
throw new Error(
"Cannot do private key derivation without private key"
);
let n = null;
if (this.privKey) {
let t = null;
t = r
? ht.concat([
ht.from([0]),
this.privKey.bn.toBuffer({ size: 32 }),
e,
])
: ht.concat([this.pubKey.toBuffer({ size: 32 }), e]);
const i = L.sha512Hmac(t, this.chainCode),
s = b().fromBuffer(i.slice(0, 32), { size: 32 }),
o = i.slice(32, 64),
a = s.add(this.privKey.bn).mod(J.getN());
(n = new this.constructor()),
(n.chainCode = o),
(n.privKey = new this.PrivKey().fromBn(a)),
(n.pubKey = new X().fromPrivKey(n.privKey));
} else {
const t = ht.concat([this.pubKey.toBuffer(), e]),
r = L.sha512Hmac(t, this.chainCode),
i = b().fromBuffer(r.slice(0, 32)),
s = r.slice(32, 64),
o = J.getG().mul(i),
a = this.pubKey.point,
h = o.add(a),
f = new X();
(f.point = h),
(n = new this.constructor()),
(n.chainCode = s),
(n.pubKey = f);
}
n.childIndex = t;
const s = L.sha256Ripemd160(this.pubKey.toBuffer());
return (
(n.parentFingerPrint = s.slice(0, 4)),
(n.versionBytesNum = this.versionBytesNum),
(n.depth = this.depth + 1),
n
);
}
toPublic() {
const t = new this.constructor().fromObject(this);
return (
(t.versionBytesNum = this.Constants.pubKey),
(t.privKey = void 0),
t
);
}
toBuffer() {
const t = this.versionBytesNum === this.Constants.privKey,
e = this.versionBytesNum === this.Constants.pubKey;
if (t)
return new _()
.writeUInt32BE(this.versionBytesNum)
.writeUInt8(this.depth)
.write(this.parentFingerPrint)
.writeUInt32BE(this.childIndex)
.write(this.chainCode)
.writeUInt8(0)
.write(this.privKey.bn.toBuffer({ size: 32 }))
.toBuffer();
if (e) {
if (!1 === this.pubKey.compressed)
throw new Error(
"cannot convert bip32 to buffer if pubKey is not compressed"
);
return new _()
.writeUInt32BE(this.versionBytesNum)
.writeUInt8(this.depth)
.write(this.parentFingerPrint)
.writeUInt32BE(this.childIndex)
.write(this.chainCode)
.write(this.pubKey.toBuffer())
.toBuffer();
}
throw new Error("bip32: invalid versionBytesNum byte");
}
toFastBuffer() {
if (!this.versionBytesNum) return ht.alloc(0);
const t = this.versionBytesNum === this.Constants.privKey,
e = this.versionBytesNum === this.Constants.pubKey;
if (t)
return new _()
.writeUInt32BE(this.versionBytesNum)
.writeUInt8(this.depth)
.write(this.parentFingerPrint)
.writeUInt32BE(this.childIndex)
.write(this.chainCode)
.writeUInt8(0)
.write(this.privKey.bn.toBuffer({ size: 32 }))
.toBuffer();
if (e)
return new _()
.writeUInt32BE(this.versionBytesNum)
.writeUInt8(this.depth)
.write(this.parentFingerPrint)
.writeUInt32BE(this.childIndex)
.write(this.chainCode)
.write(this.pubKey.toFastBuffer())
.toBuffer();
throw new Error("bip32: invalid versionBytesNum byte");
}
toString() {
return U.encode(this.toBuffer());
}
async asyncToString() {
const t = await T.asyncObjectMethod(this, "toString", []);
return JSON.parse(t.resbuf.toString());
}
toJSON() {
return this.toFastHex();
}
fromJSON(t) {
return this.fromFastHex(t);
}
isPrivate() {
return this.versionBytesNum === this.Constants.privKey;
}
}
(ft.Mainnet = class extends ft {
constructor(t, e, r, i, n, s, o) {
super(t, e, r, i, n, s, o, V.Mainnet.Bip32, et.Mainnet);
}
}),
(ft.Testnet = class extends ft {
constructor(t, e, r, i, n, s, o) {
super(t, e, r, i, n, s, o, V.Testnet.Bip32, et.Testnet);
}
});
const ut = [
"abandon",
"ability",
"able",
"about",
"above",
"absent",
"absorb",
"abstract",
"absurd",
"abuse",
"access",
"accident",
"account",
"accuse",
"achieve",
"acid",
"acoustic",
"acquire",
"across",
"act",
"action",
"actor",
"actress",
"actual",
"adapt",
"add",
"addict",
"address",
"adjust",
"admit",
"adult",
"advance",
"advice",
"aerobic",
"affair",
"afford",
"afraid",
"again",
"age",
"agent",
"agree",
"ahead",
"aim",
"air",
"airport",
"aisle",
"alarm",
"album",
"alcohol",
"alert",
"alien",
"all",
"alley",
"allow",
"almost",
"alone",
"alpha",
"already",
"also",
"alter",
"always",
"amateur",
"amazing",
"among",
"amount",
"amused",
"analyst",
"anchor",
"ancient",
"anger",
"angle",
"angry",
"animal",
"ankle",
"announce",
"annual",
"another",
"answer",
"antenna",
"antique",
"anxiety",
"any",
"apart",
"apology",
"appear",
"apple",
"approve",
"april",
"arch",
"arctic",
"area",
"arena",
"argue",
"arm",
"armed",
"armor",
"army",
"around",
"arrange",
"arrest",
"arrive",
"arrow",
"art",
"artefact",
"artist",
"artwork",
"ask",
"aspect",
"assault",
"asset",
"assist",
"assume",
"asthma",
"athlete",
"atom",
"attack",
"attend",
"attitude",
"attract",
"auction",
"audit",
"august",
"aunt",
"author",
"auto",
"autumn",
"average",
"avocado",
"avoid",
"awake",
"aware",
"away",
"awesome",
"awful",
"awkward",
"axis",
"baby",
"bachelor",
"bacon",
"badge",
"bag",
"balance",
"balcony",
"ball",
"bamboo",
"banana",
"banner",
"bar",
"barely",
"bargain",
"barrel",
"base",
"basic",
"basket",
"battle",
"beach",
"bean",
"beauty",
"because",
"become",
"beef",
"before",
"begin",
"behave",
"behind",
"believe",
"below",
"belt",
"bench",
"benefit",
"best",
"betray",
"better",
"between",
"beyond",
"bicycle",
"bid",
"bike",
"bind",
"biology",
"bird",
"birth",
"bitter",
"black",
"blade",
"blame",
"blanket",
"blast",
"bleak",
"bless",
"blind",
"blood",
"blossom",
"blouse",
"blue",
"blur",
"blush",
"board",
"boat",
"body",
"boil",
"bomb",
"bone",
"bonus",
"book",
"boost",
"border",
"boring",
"borrow",
"boss",
"bottom",
"bounce",
"box",
"boy",
"bracket",
"brain",
"brand",
"brass",
"brave",
"bread",
"breeze",
"brick",
"bridge",
"brief",
"bright",
"bring",
"brisk",
"broccoli",
"broken",
"bronze",
"broom",
"brother",
"brown",
"brush",
"bubble",
"buddy",
"budget",
"buffalo",
"build",
"bulb",
"bulk",
"bullet",
"bundle",
"bunker",
"burden",
"burger",
"burst",
"bus",
"business",
"busy",
"butter",
"buyer",
"buzz",
"cabbage",
"cabin",
"cable",
"cactus",
"cage",
"cake",
"call",
"calm",
"camera",
"camp",
"can",
"canal",
"cancel",
"candy",
"cannon",
"canoe",
"canvas",
"canyon",
"capable",
"capital",
"captain",
"car",
"carbon",
"card",
"cargo",
"carpet",
"carry",
"cart",
"case",
"cash",
"casino",
"castle",
"casual",
"cat",
"catalog",
"catch",
"category",
"cattle",
"caught",
"cause",
"caution",
"cave",
"ceiling",
"celery",
"cement",
"census",
"century",
"cereal",
"certain",
"chair",
"chalk",
"champion",
"change",
"chaos",
"chapter",
"charge",
"chase",
"chat",
"cheap",
"check",
"cheese",
"chef",
"cherry",
"chest",
"chicken",
"chief",
"child",
"chimney",
"choice",
"choose",
"chronic",
"chuckle",
"chunk",
"churn",
"cigar",
"cinnamon",
"circle",
"citizen",
"city",
"civil",
"claim",
"clap",
"clarify",
"claw",
"clay",
"clean",
"clerk",
"clever",
"click",
"client",
"cliff",
"climb",
"clinic",
"clip",
"clock",
"clog",
"close",
"cloth",
"cloud",
"clown",
"club",
"clump",
"cluster",
"clutch",
"coach",
"coast",
"coconut",
"code",
"coffee",
"coil",
"coin",
"collect",
"color",
"column",
"combine",
"come",
"comfort",
"comic",
"common",
"company",
"concert",
"conduct",
"confirm",
"congress",
"connect",
"consider",
"control",
"convince",
"cook",
"cool",
"copper",
"copy",
"coral",
"core",
"corn",
"correct",
"cost",
"cotton",
"couch",
"country",
"couple",
"course",
"cousin",
"cover",
"coyote",
"crack",
"cradle",
"craft",
"cram",
"crane",
"crash",
"crater",
"crawl",
"crazy",
"cream",
"credit",
"creek",
"crew",
"cricket",
"crime",
"crisp",
"critic",
"crop",
"cross",
"crouch",
"crowd",
"crucial",
"cruel",
"cruise",
"crumble",
"crunch",
"crush",
"cry",
"crystal",
"cube",
"culture",
"cup",
"cupboard",
"curious",
"current",
"curtain",
"curve",
"cushion",
"custom",
"cute",
"cycle",
"dad",
"damage",
"damp",
"dance",
"danger",
"daring",
"dash",
"daughter",
"dawn",
"day",
"deal",
"debate",
"debris",
"decade",
"december",
"decide",
"decline",
"decorate",
"decrease",
"deer",
"defense",
"define",
"defy",
"degree",
"delay",
"deliver",
"demand",
"demise",
"denial",
"dentist",
"deny",
"depart",
"depend",
"deposit",
"depth",
"deputy",
"derive",
"describe",
"desert",
"design",
"desk",
"despair",
"destroy",
"detail",
"detect",
"develop",
"device",
"devote",
"diagram",
"dial",
"diamond",
"diary",
"dice",
"diesel",
"diet",
"differ",
"digital",
"dignity",
"dilemma",
"dinner",
"dinosaur",
"direct",
"dirt",
"disagree",
"discover",
"disease",
"dish",
"dismiss",
"disorder",
"display",
"distance",
"divert",
"divide",
"divorce",
"dizzy",
"doctor",
"document",
"dog",
"doll",
"dolphin",
"domain",
"donate",
"donkey",
"donor",
"door",
"dose",
"double",
"dove",
"draft",
"dragon",
"drama",
"drastic",
"draw",
"dream",
"dress",
"drift",
"drill",
"drink",
"drip",
"drive",
"drop",
"drum",
"dry",
"duck",
"dumb",
"dune",
"during",
"dust",
"dutch",
"duty",
"dwarf",
"dynamic",
"eager",
"eagle",
"early",
"earn",
"earth",
"easily",
"east",
"easy",
"echo",
"ecology",
"economy",
"edge",
"edit",
"educate",
"effort",
"egg",
"eight",
"either",
"elbow",
"elder",
"electric",
"elegant",
"element",
"elephant",
"elevator",
"elite",
"else",
"embark",
"embody",
"embrace",
"emerge",
"emotion",
"employ",
"empower",
"empty",
"enable",
"enact",
"end",
"endless",
"endorse",
"enemy",
"energy",
"enforce",
"engage",
"engine",
"enhance",
"enjoy",
"enlist",
"enough",
"enrich",
"enroll",
"ensure",
"enter",
"entire",
"entry",
"envelope",
"episode",
"equal",
"equip",
"era",
"erase",
"erode",
"erosion",
"error",
"erupt",
"escape",
"essay",
"essence",
"estate",
"eternal",
"ethics",
"evidence",
"evil",
"evoke",
"evolve",
"exact",
"example",
"excess",
"exchange",
"excite",
"exclude",
"excuse",
"execute",
"exercise",
"exhaust",
"exhibit",
"exile",
"exist",
"exit",
"exotic",
"expand",
"expect",
"expire",
"explain",
"expose",
"express",
"extend",
"extra",
"eye",
"eyebrow",
"fabric",
"face",
"faculty",
"fade",
"faint",
"faith",
"fall",
"false",
"fame",
"family",
"famous",
"fan",
"fancy",
"fantasy",
"farm",
"fashion",
"fat",
"fatal",
"father",
"fatigue",
"fault",
"favorite",
"feature",
"february",
"federal",
"fee",
"feed",
"feel",
"female",
"fence",
"festival",
"fetch",
"fever",
"few",
"fiber",
"fiction",
"field",
"figure",
"file",
"film",
"filter",
"final",
"find",
"fine",
"finger",
"finish",
"fire",
"firm",
"first",
"fiscal",
"fish",
"fit",
"fitness",
"fix",
"flag",
"flame",
"flash",
"flat",
"flavor",
"flee",
"flight",
"flip",
"float",
"flock",
"floor",
"flower",
"fluid",
"flush",
"fly",
"foam",
"focus",
"fog",
"foil",
"fold",
"follow",
"food",
"foot",
"force",
"forest",
"forget",
"fork",
"fortune",
"forum",
"forward",
"fossil",
"foster",
"found",
"fox",
"fragile",
"frame",
"frequent",
"fresh",
"friend",
"fringe",
"frog",
"front",
"frost",
"frown",
"frozen",
"fruit",
"fuel",
"fun",
"funny",
"furnace",
"fury",
"future",
"gadget",
"gain",
"galaxy",
"gallery",
"game",
"gap",
"garage",
"garbage",
"garden",
"garlic",
"garment",
"gas",
"gasp",
"gate",
"gather",
"gauge",
"gaze",
"general",
"genius",
"genre",
"gentle",
"genuine",
"gesture",
"ghost",
"giant",
"gift",
"giggle",
"ginger",
"giraffe",
"girl",
"give",
"glad",
"glance",
"glare",
"glass",
"glide",
"glimpse",
"globe",
"gloom",
"glory",
"glove",
"glow",
"glue",
"goat",
"goddess",
"gold",
"good",
"goose",
"gorilla",
"gospel",
"gossip",
"govern",
"gown",
"grab",
"grace",
"grain",
"grant",
"grape",
"grass",
"gravity",
"great",
"green",
"grid",
"grief",
"grit",
"grocery",
"group",
"grow",
"grunt",
"guard",
"guess",
"guide",
"guilt",
"guitar",
"gun",
"gym",
"habit",
"hair",
"half",
"hammer",
"hamster",
"hand",
"happy",
"harbor",
"hard",
"harsh",
"harvest",
"hat",
"have",
"hawk",
"hazard",
"head",
"health",
"heart",
"heavy",
"hedgehog",
"height",
"hello",
"helmet",
"help",
"hen",
"hero",
"hidden",
"high",
"hill",
"hint",
"hip",
"hire",
"history",
"hobby",
"hockey",
"hold",
"hole",
"holiday",
"hollow",
"home",
"honey",
"hood",
"hope",
"horn",
"horror",
"horse",
"hospital",
"host",
"hotel",
"hour",
"hover",
"hub",
"huge",
"human",
"humble",
"humor",
"hundred",
"hungry",
"hunt",
"hurdle",
"hurry",
"hurt",
"husband",
"hybrid",
"ice",
"icon",
"idea",
"identify",
"idle",
"ignore",
"ill",
"illegal",
"illness",
"image",
"imitate",
"immense",
"immune",
"impact",
"impose",
"improve",
"impulse",
"inch",
"include",
"income",
"increase",
"index",
"indicate",
"indoor",
"industry",
"infant",
"inflict",
"inform",
"inhale",
"inherit",
"initial",
"inject",
"injury",
"inmate",
"inner",
"innocent",
"input",
"inquiry",
"insane",
"insect",
"inside",
"inspire",
"install",
"intact",
"interest",
"into",
"invest",
"invite",
"involve",
"iron",
"island",
"isolate",
"issue",
"item",
"ivory",
"jacket",
"jaguar",
"jar",
"jazz",
"jealous",
"jeans",
"jelly",
"jewel",
"job",
"join",
"joke",
"journey",
"joy",
"judge",
"juice",
"jump",
"jungle",
"junior",
"junk",
"just",
"kangaroo",
"keen",
"keep",
"ketchup",
"key",
"kick",
"kid",
"kidney",
"kind",
"kingdom",
"kiss",
"kit",
"kitchen",
"kite",
"kitten",
"kiwi",
"knee",
"knife",
"knock",
"know",
"lab",
"label",
"labor",
"ladder",
"lady",
"lake",
"lamp",
"language",
"laptop",
"large",
"later",
"latin",
"laugh",
"laundry",
"lava",
"law",
"lawn",
"lawsuit",
"layer",
"lazy",
"leader",
"leaf",
"learn",
"leave",
"lecture",
"left",
"leg",
"legal",
"legend",
"leisure",
"lemon",
"lend",
"length",
"lens",
"leopard",
"lesson",
"letter",
"level",
"liar",
"liberty",
"library",
"license",
"life",
"lift",
"light",
"like",
"limb",
"limit",
"link",
"lion",
"liquid",
"list",
"little",
"live",
"lizard",
"load",
"loan",
"lobster",
"local",
"lock",
"logic",
"lonely",
"long",
"loop",
"lottery",
"loud",
"lounge",
"love",
"loyal",
"lucky",
"luggage",
"lumber",
"lunar",
"lunch",
"luxury",
"lyrics",
"machine",
"mad",
"magic",
"magnet",
"maid",
"mail",
"main",
"major",
"make",
"mammal",
"man",
"manage",
"mandate",
"mango",
"mansion",
"manual",
"maple",
"marble",
"march",
"margin",
"marine",
"market",
"marriage",
"mask",
"mass",
"master",
"match",
"material",
"math",
"matrix",
"matter",
"maximum",
"maze",
"meadow",
"mean",
"measure",
"meat",
"mechanic",
"medal",
"media",
"melody",
"melt",
"member",
"memory",
"mention",
"menu",
"mercy",
"merge",
"merit",
"merry",
"mesh",
"message",
"metal",
"method",
"middle",
"midnight",
"milk",
"million",
"mimic",
"mind",
"minimum",
"minor",
"minute",
"miracle",
"mirror",
"misery",
"miss",
"mistake",
"mix",
"mixed",
"mixture",
"mobile",
"model",
"modify",
"mom",
"moment",
"monitor",
"monkey",
"monster",
"month",
"moon",
"moral",
"more",
"morning",
"mosquito",
"mother",
"motion",
"motor",
"mountain",
"mouse",
"move",
"movie",
"much",
"muffin",
"mule",
"multiply",
"muscle",
"museum",
"mushroom",
"music",
"must",
"mutual",
"myself",
"mystery",
"myth",
"naive",
"name",
"napkin",
"narrow",
"nasty",
"nation",
"nature",
"near",
"neck",
"need",
"negative",
"neglect",
"neither",
"nephew",
"nerve",
"nest",
"net",
"network",
"neutral",
"never",
"news",
"next",
"nice",
"night",
"noble",
"noise",
"nominee",
"noodle",
"normal",
"north",
"nose",
"notable",
"note",
"nothing",
"notice",
"novel",
"now",
"nuclear",
"number",
"nurse",
"nut",
"oak",
"obey",
"object",
"oblige",
"obscure",
"observe",
"obtain",
"obvious",
"occur",
"ocean",
"october",
"odor",
"off",
"offer",
"office",
"often",
"oil",
"okay",
"old",
"olive",
"olympic",
"omit",
"once",
"one",
"onion",
"online",
"only",
"open",
"opera",
"opinion",
"oppose",
"option",
"orange",
"orbit",
"orchard",
"order",
"ordinary",
"organ",
"orient",
"original",
"orphan",
"ostrich",
"other",
"outdoor",
"outer",
"output",
"outside",
"oval",
"oven",
"over",
"own",
"owner",
"oxygen",
"oyster",
"ozone",
"pact",
"paddle",
"page",
"pair",
"palace",
"palm",
"panda",
"panel",
"panic",
"panther",
"paper",
"parade",
"parent",
"park",
"parrot",
"party",
"pass",
"patch",
"path",
"patient",
"patrol",
"pattern",
"pause",
"pave",
"payment",
"peace",
"peanut",
"pear",
"peasant",
"pelican",
"pen",
"penalty",
"pencil",
"people",
"pepper",
"perfect",
"permit",
"person",
"pet",
"phone",
"photo",
"phrase",
"physical",
"piano",
"picnic",
"picture",
"piece",
"pig",
"pigeon",
"pill",
"pilot",
"pink",
"pioneer",
"pipe",
"pistol",
"pitch",
"pizza",
"place",
"planet",
"plastic",
"plate",
"play",
"please",
"pledge",
"pluck",
"plug",
"plunge",
"poem",
"poet",
"point",
"polar",
"pole",
"police",
"pond",
"pony",
"pool",
"popular",
"portion",
"position",
"possible",
"post",
"potato",
"pottery",
"poverty",
"powder",
"power",
"practice",
"praise",
"predict",
"prefer",
"prepare",
"present",
"pretty",
"prevent",
"price",
"pride",
"primary",
"print",
"priority",
"prison",
"private",
"prize",
"problem",
"process",
"produce",
"profit",
"program",
"project",
"promote",
"proof",
"property",
"prosper",
"protect",
"proud",
"provide",
"public",
"pudding",
"pull",
"pulp",
"pulse",
"pumpkin",
"punch",
"pupil",
"puppy",
"purchase",
"purity",
"purpose",
"purse",
"push",
"put",
"puzzle",
"pyramid",
"quality",
"quantum",
"quarter",
"question",
"quick",
"quit",
"quiz",
"quote",
"rabbit",
"raccoon",
"race",
"rack",
"radar",
"radio",
"rail",
"rain",
"raise",
"rally",
"ramp",
"ranch",
"random",
"range",
"rapid",
"rare",
"rate",
"rather",
"raven",
"raw",
"razor",
"ready",
"real",
"reason",
"rebel",
"rebuild",
"recall",
"receive",
"recipe",
"record",
"recycle",
"reduce",
"reflect",
"reform",
"refuse",
"region",
"regret",
"regular",
"reject",
"relax",
"release",
"relief",
"rely",
"remain",
"remember",
"remind",
"remove",
"render",
"renew",
"rent",
"reopen",
"repair",
"repeat",
"replace",
"report",
"require",
"rescue",
"resemble",
"resist",
"resource",
"response",
"result",
"retire",
"retreat",
"return",
"reunion",
"reveal",
"review",
"reward",
"rhythm",
"rib",
"ribbon",
"rice",
"rich",
"ride",
"ridge",
"rifle",
"right",
"rigid",
"ring",
"riot",
"ripple",
"risk",
"ritual",
"rival",
"river",
"road",
"roast",
"robot",
"robust",
"rocket",
"romance",
"roof",
"rookie",
"room",
"rose",
"rotate",
"rough",
"round",
"route",
"royal",
"rubber",
"rude",
"rug",
"rule",
"run",
"runway",
"rural",
"sad",
"saddle",
"sadness",
"safe",
"sail",
"salad",
"salmon",
"salon",
"salt",
"salute",
"same",
"sample",
"sand",
"satisfy",
"satoshi",
"sauce",
"sausage",
"save",
"say",
"scale",
"scan",
"scare",
"scatter",
"scene",
"scheme",
"school",
"science",
"scissors",
"scorpion",
"scout",
"scrap",
"screen",
"script",
"scrub",
"sea",
"search",
"season",
"seat",
"second",
"secret",
"section",
"security",
"seed",
"seek",
"segment",
"select",
"sell",
"seminar",
"senior",
"sense",
"sentence",
"series",
"service",
"session",
"settle",
"setup",
"seven",
"shadow",
"shaft",
"shallow",
"share",
"shed",
"shell",
"sheriff",
"shield",
"shift",
"shine",
"ship",
"shiver",
"shock",
"shoe",
"shoot",
"shop",
"short",
"shoulder",
"shove",
"shrimp",
"shrug",
"shuffle",
"shy",
"sibling",
"sick",
"side",
"siege",
"sight",
"sign",
"silent",
"silk",
"silly",
"silver",
"similar",
"simple",
"since",
"sing",
"siren",
"sister",
"situate",
"six",
"size",
"skate",
"sketch",
"ski",
"skill",
"skin",
"skirt",
"skull",
"slab",
"slam",
"sleep",
"slender",
"slice",
"slide",
"slight",
"slim",
"slogan",
"slot",
"slow",
"slush",
"small",
"smart",
"smile",
"smoke",
"smooth",
"snack",
"snake",
"snap",
"sniff",
"snow",
"soap",
"soccer",
"social",
"sock",
"soda",
"soft",
"solar",
"soldier",
"solid",
"solution",
"solve",
"someone",
"song",
"soon",
"sorry",
"sort",
"soul",
"sound",
"soup",
"source",
"south",
"space",
"spare",
"spatial",
"spawn",
"speak",
"special",
"speed",
"spell",
"spend",
"sphere",
"spice",
"spider",
"spike",
"spin",
"spirit",
"split",
"spoil",
"sponsor",
"spoon",
"sport",
"spot",
"spray",
"spread",
"spring",
"spy",
"square",
"squeeze",
"squirrel",
"stable",
"stadium",
"staff",
"stage",
"stairs",
"stamp",
"stand",
"start",
"state",
"stay",
"steak",
"steel",
"stem",
"step",
"stereo",
"stick",
"still",
"sting",
"stock",
"stomach",
"stone",
"stool",
"story",
"stove",
"strategy",
"street",
"strike",
"strong",
"struggle",
"student",
"stuff",
"stumble",
"style",
"subject",
"submit",
"subway",
"success",
"such",
"sudden",
"suffer",
"sugar",
"suggest",
"suit",
"summer",
"sun",
"sunny",
"sunset",
"super",
"supply",
"supreme",
"sure",
"surface",
"surge",
"surprise",
"surround",
"survey",
"suspect",
"sustain",
"swallow",
"swamp",
"swap",
"swarm",
"swear",
"sweet",
"swift",
"swim",
"swing",
"switch",
"sword",
"symbol",
"symptom",
"syrup",
"system",
"table",
"tackle",
"tag",
"tail",
"talent",
"talk",
"tank",
"tape",
"target",
"task",
"taste",
"tattoo",
"taxi",
"teach",
"team",
"tell",
"ten",
"tenant",
"tennis",
"tent",
"term",
"test",
"text",
"thank",
"that",
"theme",
"then",
"theory",
"there",
"they",
"thing",
"this",
"thought",
"three",
"thrive",
"throw",
"thumb",
"thunder",
"ticket",
"tide",
"tiger",
"tilt",
"timber",
"time",
"tiny",
"tip",
"tired",
"tissue",
"title",
"toast",
"tobacco",
"today",
"toddler",
"toe",
"together",
"toilet",
"token",
"tomato",
"tomorrow",
"tone",
"tongue",
"tonight",
"tool",
"tooth",
"top",
"topic",
"topple",
"torch",
"tornado",
"tortoise",
"toss",
"total",
"tourist",
"toward",
"tower",
"town",
"toy",
"track",
"trade",
"traffic",
"tragic",
"train",
"transfer",
"trap",
"trash",
"travel",
"tray",
"treat",
"tree",
"trend",
"trial",
"tribe",
"trick",
"trigger",
"trim",
"trip",
"trophy",
"trouble",
"truck",
"true",
"truly",
"trumpet",
"trust",
"truth",
"try",
"tube",
"tuition",
"tumble",
"tuna",
"tunnel",
"turkey",
"turn",
"turtle",
"twelve",
"twenty",
"twice",
"twin",
"twist",
"two",
"type",
"typical",
"ugly",
"umbrella",
"unable",
"unaware",
"uncle",
"uncover",
"under",
"undo",
"unfair",
"unfold",
"unhappy",
"uniform",
"unique",
"unit",
"universe",
"unknown",
"unlock",
"until",
"unusual",
"unveil",
"update",
"upgrade",
"uphold",
"upon",
"upper",
"upset",
"urban",
"urge",
"usage",
"use",
"used",
"useful",
"useless",
"usual",
"utility",
"vacant",
"vacuum",
"vague",
"valid",
"valley",
"valve",
"van",
"vanish",
"vapor",
"various",
"vast",
"vault",
"vehicle",
"velvet",
"vendor",
"venture",
"venue",
"verb",
"verify",
"version",
"very",
"vessel",
"veteran",
"viable",
"vibrant",
"vicious",
"victory",
"video",
"view",
"village",
"vintage",
"violin",
"virtual",
"virus",
"visa",
"visit",
"visual",
"vital",
"vivid",
"vocal",
"voice",
"void",
"volcano",
"volume",
"vote",
"voyage",
"wage",
"wagon",
"wait",
"walk",
"wall",
"walnut",
"want",
"warfare",
"warm",
"warrior",
"wash",
"wasp",
"waste",
"water",
"wave",
"way",
"wealth",
"weapon",
"wear",
"weasel",
"weather",
"web",
"wedding",
"weekend",
"weird",
"welcome",
"west",
"wet",
"whale",
"what",
"wheat",
"wheel",
"when",
"where",
"whip",
"whisper",
"wide",
"width",
"wife",
"wild",
"will",
"win",
"window",
"wine",
"wing",
"wink",
"winner",
"winter",
"wire",
"wisdom",
"wise",
"wish",
"witness",
"wolf",
"woman",
"wonder",
"wood",
"wool",
"word",
"work",
"world",
"worry",
"worth",
"wrap",
"wreck",
"wrestle",
"wrist",
"write",
"wrong",
"yard",
"year",
"yellow",
"you",
"young",
"youth",
"zebra",
"zero",
"zone",
"zoo",
];
ut.space = " ";
var ct = r(8764).Buffer;
class dt extends O {
constructor(t, e, r = ut) {
super({ mnemonic: t, seed: e }), (this.Wordlist = r);
}
toBw(t) {
if ((t || (t = new _()), this.mnemonic)) {
const e = ct.from(this.mnemonic);
t.writeVarIntNum(e.length), t.write(e);
} else t.writeVarIntNum(0);
return (
this.seed
? (t.writeVarIntNum(this.seed.length), t.write(this.seed))
: t.writeVarIntNum(0),
t
);
}
fromBr(t) {
const e = t.readVarIntNum();
e > 0 && (this.mnemonic = t.read(e).toString());
const r = t.readVarIntNum();
return r > 0 && (this.seed = t.read(r)), this;
}
fromRandom(t) {
if ((t || (t = 128), t % 32 != 0))
throw new Error("bits must be multiple of 32");
if (t < 128) throw new Error("bits must be at least 128");
const e = $.getRandomBuffer(t / 8);
return this.entropy2Mnemonic(e), this.mnemonic2Seed(), this;
}
static fromRandom(t) {
return new this().fromRandom(t);
}
async asyncFromRandom(t) {
t || (t = 128);
const e = $.getRandomBuffer(t / 8);
let r = await T.asyncObjectMethod(this, "entropy2Mnemonic", [e]);
const i = new dt().fromFastBuffer(r.resbuf);
return (
(r = await T.asyncObjectMethod(i, "mnemonic2Seed", [])),
this.fromFastBuffer(r.resbuf)
);
}
static asyncFromRandom(t) {
return new this().asyncFromRandom(t);
}
fromEntropy(t) {
return this.entropy2Mnemonic(t), this;
}
static fromEntropy(t) {
return new this().fromEntropy(t);
}
async asyncFromEntropy(t) {
const e = await T.asyncObjectMethod(this, "fromEntropy", [t]);
return this.fromFastBuffer(e.resbuf);
}
static asyncFromEntropy(t) {
return new this().asyncFromEntropy(t);
}
fromString(t) {
return (this.mnemonic = t), this;
}
toString() {
return this.mnemonic;
}
toSeed(t) {
return this.mnemonic2Seed(t), this.seed;
}
async asyncToSeed(t) {
void 0 === t && (t = "");
const e = [t];
return (await T.asyncObjectMethod(this, "toSeed", e)).resbuf;
}
entropy2Mnemonic(t) {
if (!ct.isBuffer(t) || t.length < 16)
throw new Error(
"Entropy is less than 128 bits. It must be 128 bits or more."
);
const e = L.sha256(t);
let r = "";
const i = 8 * t.length;
for (let e = 0; e < t.length; e++)
r += ("00000000" + t[e].toString(2)).slice(-8);
let n = e[0].toString(2);
if (
((n = ("00000000" + n).slice(-8).slice(0, i / 32)),
(r += n),
r.length % 11 != 0)
)
throw new Error(
"internal error - entropy not an even multiple of 11 bits - " +
r.length
);
let s = "";
for (let t = 0; t < r.length / 11; t++) {
"" !== s && (s += this.Wordlist.space);
const e = parseInt(r.slice(11 * t, 11 * (t + 1)), 2);
s += this.Wordlist[e];
}
return (this.mnemonic = s), this;
}
check() {
const t = this.mnemonic.split(this.Wordlist.space);
let e = "";
for (let r = 0; r < t.length; r++) {
const i = this.Wordlist.indexOf(t[r]);
if (i < 0) return !1;
e += ("00000000000" + i.toString(2)).slice(-11);
}
if (e.length % 11 != 0)
throw new Error(
"internal error - entropy not an even multiple of 11 bits - " +
e.length
);
const r = e.length / 33,
i = e.slice(-r),
n = e.slice(0, e.length - r),
s = ct.alloc(n.length / 8);
for (let t = 0; t < n.length / 8; t++)
s.writeUInt8(parseInt(e.slice(8 * t, 8 * (t + 1)), 2), t);
let o = L.sha256(s)[0].toString(2);
return (o = ("00000000" + o).slice(-8).slice(0, r)), o === i;
}
mnemonic2Seed(t = "") {
let e = this.mnemonic;
if (!this.check())
throw new Error(
"Mnemonic does not pass the check - was the mnemonic typed incorrectly? Are there extra spaces?"
);
if ("string" != typeof t)
throw new Error("passphrase must be a string or undefined");
(e = e.normalize("NFKD")), (t = t.normalize("NFKD"));
const r = ct.from(e),
i = ct.concat([ct.from("mnemonic"), ct.from(t)]);
return (this.seed = l.pbkdf2Sync(r, i, 2048, 64, "sha512")), this;
}
isValid(t = "") {
let e;
try {
e = !!this.mnemonic2Seed(t);
} catch (t) {
e = !1;
}
return e;
}
static isValid(t, e = "") {
return new dt(t).isValid(e);
}
}
const lt = [
"あいこくしん",
"あいさつ",
"あいだ",
"あおぞら",
"あかちゃん",
"あきる",
"あけがた",
"あける",
"あこがれる",
"あさい",
"あさひ",
"あしあと",
"あじわう",
"あずかる",
"あずき",
"あそぶ",
"あたえる",
"あたためる",
"あたりまえ",
"あたる",
"あつい",
"あつかう",
"あっしゅく",
"あつまり",
"あつめる",
"あてな",
"あてはまる",
"あひる",
"あぶら",
"あぶる",
"あふれる",
"あまい",
"あまど",
"あまやかす",
"あまり",
"あみもの",
"あめりか",
"あやまる",
"あゆむ",
"あらいぐま",
"あらし",
"あらすじ",
"あらためる",
"あらゆる",
"あらわす",
"ありがとう",
"あわせる",
"あわてる",
"あんい",
"あんがい",
"あんこ",
"あんぜん",
"あんてい",
"あんない",
"あんまり",
"いいだす",
"いおん",
"いがい",
"いがく",
"いきおい",
"いきなり",
"いきもの",
"いきる",
"いくじ",
"いくぶん",
"いけばな",
"いけん",
"いこう",
"いこく",
"いこつ",
"いさましい",
"いさん",
"いしき",
"いじゅう",
"いじょう",
"いじわる",
"いずみ",
"いずれ",
"いせい",
"いせえび",
"いせかい",
"いせき",
"いぜん",
"いそうろう",
"いそがしい",
"いだい",
"いだく",
"いたずら",
"いたみ",
"いたりあ",
"いちおう",
"いちじ",
"いちど",
"いちば",
"いちぶ",
"いちりゅう",
"いつか",
"いっしゅん",
"いっせい",
"いっそう",
"いったん",
"いっち",
"いってい",
"いっぽう",
"いてざ",
"いてん",
"いどう",
"いとこ",
"いない",
"いなか",
"いねむり",
"いのち",
"いのる",
"いはつ",
"いばる",
"いはん",
"いびき",
"いひん",
"いふく",
"いへん",
"いほう",
"いみん",
"いもうと",
"いもたれ",
"いもり",
"いやがる",
"いやす",
"いよかん",
"いよく",
"いらい",
"いらすと",
"いりぐち",
"いりょう",
"いれい",
"いれもの",
"いれる",
"いろえんぴつ",
"いわい",
"いわう",
"いわかん",
"いわば",
"いわゆる",
"いんげんまめ",
"いんさつ",
"いんしょう",
"いんよう",
"うえき",
"うえる",
"うおざ",
"うがい",
"うかぶ",
"うかべる",
"うきわ",
"うくらいな",
"うくれれ",
"うけたまわる",
"うけつけ",
"うけとる",
"うけもつ",
"うける",
"うごかす",
"うごく",
"うこん",
"うさぎ",
"うしなう",
"うしろがみ",
"うすい",
"うすぎ",
"うすぐらい",
"うすめる",
"うせつ",
"うちあわせ",
"うちがわ",
"うちき",
"うちゅう",
"うっかり",
"うつくしい",
"うったえる",
"うつる",
"うどん",
"うなぎ",
"うなじ",
"うなずく",
"うなる",
"うねる",
"うのう",
"うぶげ",
"うぶごえ",
"うまれる",
"うめる",
"うもう",
"うやまう",
"うよく",
"うらがえす",
"うらぐち",
"うらない",
"うりあげ",
"うりきれ",
"うるさい",
"うれしい",
"うれゆき",
"うれる",
"うろこ",
"うわき",
"うわさ",
"うんこう",
"うんちん",
"うんてん",
"うんどう",
"えいえん",
"えいが",
"えいきょう",
"えいご",
"えいせい",
"えいぶん",
"えいよう",
"えいわ",
"えおり",
"えがお",
"えがく",
"えきたい",
"えくせる",
"えしゃく",
"えすて",
"えつらん",
"えのぐ",
"えほうまき",
"えほん",
"えまき",
"えもじ",
"えもの",
"えらい",
"えらぶ",
"えりあ",
"えんえん",
"えんかい",
"えんぎ",
"えんげき",
"えんしゅう",
"えんぜつ",
"えんそく",
"えんちょう",
"えんとつ",
"おいかける",
"おいこす",
"おいしい",
"おいつく",
"おうえん",
"おうさま",
"おうじ",
"おうせつ",
"おうたい",
"おうふく",
"おうべい",
"おうよう",
"おえる",
"おおい",
"おおう",
"おおどおり",
"おおや",
"おおよそ",
"おかえり",
"おかず",
"おがむ",
"おかわり",
"おぎなう",
"おきる",
"おくさま",
"おくじょう",
"おくりがな",
"おくる",
"おくれる",
"おこす",
"おこなう",
"おこる",
"おさえる",
"おさない",
"おさめる",
"おしいれ",
"おしえる",
"おじぎ",
"おじさん",
"おしゃれ",
"おそらく",
"おそわる",
"おたがい",
"おたく",
"おだやか",
"おちつく",
"おっと",
"おつり",
"おでかけ",
"おとしもの",
"おとなしい",
"おどり",
"おどろかす",
"おばさん",
"おまいり",
"おめでとう",
"おもいで",
"おもう",
"おもたい",
"おもちゃ",
"おやつ",
"おやゆび",
"およぼす",
"おらんだ",
"おろす",
"おんがく",
"おんけい",
"おんしゃ",
"おんせん",
"おんだん",
"おんちゅう",
"おんどけい",
"かあつ",
"かいが",
"がいき",
"がいけん",
"がいこう",
"かいさつ",
"かいしゃ",
"かいすいよく",
"かいぜん",
"かいぞうど",
"かいつう",
"かいてん",
"かいとう",
"かいふく",
"がいへき",
"かいほう",
"かいよう",
"がいらい",
"かいわ",
"かえる",
"かおり",
"かかえる",
"かがく",
"かがし",
"かがみ",
"かくご",
"かくとく",
"かざる",
"がぞう",
"かたい",
"かたち",
"がちょう",
"がっきゅう",
"がっこう",
"がっさん",
"がっしょう",
"かなざわし",
"かのう",
"がはく",
"かぶか",
"かほう",
"かほご",
"かまう",
"かまぼこ",
"かめれおん",
"かゆい",
"かようび",
"からい",
"かるい",
"かろう",
"かわく",
"かわら",
"がんか",
"かんけい",
"かんこう",
"かんしゃ",
"かんそう",
"かんたん",
"かんち",
"がんばる",
"きあい",
"きあつ",
"きいろ",
"ぎいん",
"きうい",
"きうん",
"きえる",
"きおう",
"きおく",
"きおち",
"きおん",
"きかい",
"きかく",
"きかんしゃ",
"ききて",
"きくばり",
"きくらげ",
"きけんせい",
"きこう",
"きこえる",
"きこく",
"きさい",
"きさく",
"きさま",
"きさらぎ",
"ぎじかがく",
"ぎしき",
"ぎじたいけん",
"ぎじにってい",
"ぎじゅつしゃ",
"きすう",
"きせい",
"きせき",
"きせつ",
"きそう",
"きぞく",
"きぞん",
"きたえる",
"きちょう",
"きつえん",
"ぎっちり",
"きつつき",
"きつね",
"きてい",
"きどう",
"きどく",
"きない",
"きなが",
"きなこ",
"きぬごし",
"きねん",
"きのう",
"きのした",
"きはく",
"きびしい",
"きひん",
"きふく",
"きぶん",
"きぼう",
"きほん",
"きまる",
"きみつ",
"きむずかしい",
"きめる",
"きもだめし",
"きもち",
"きもの",
"きゃく",
"きやく",
"ぎゅうにく",
"きよう",
"きょうりゅう",
"きらい",
"きらく",
"きりん",
"きれい",
"きれつ",
"きろく",
"ぎろん",
"きわめる",
"ぎんいろ",
"きんかくじ",
"きんじょ",
"きんようび",
"ぐあい",
"くいず",
"くうかん",
"くうき",
"くうぐん",
"くうこう",
"ぐうせい",
"くうそう",
"ぐうたら",
"くうふく",
"くうぼ",
"くかん",
"くきょう",
"くげん",
"ぐこう",
"くさい",
"くさき",
"くさばな",
"くさる",
"くしゃみ",
"くしょう",
"くすのき",
"くすりゆび",
"くせげ",
"くせん",
"ぐたいてき",
"くださる",
"くたびれる",
"くちこみ",
"くちさき",
"くつした",
"ぐっすり",
"くつろぐ",
"くとうてん",
"くどく",
"くなん",
"くねくね",
"くのう",
"くふう",
"くみあわせ",
"くみたてる",
"くめる",
"くやくしょ",
"くらす",
"くらべる",
"くるま",
"くれる",
"くろう",
"くわしい",
"ぐんかん",
"ぐんしょく",
"ぐんたい",
"ぐんて",
"けあな",
"けいかく",
"けいけん",
"けいこ",
"けいさつ",
"げいじゅつ",
"けいたい",
"げいのうじん",
"けいれき",
"けいろ",
"けおとす",
"けおりもの",
"げきか",
"げきげん",
"げきだん",
"げきちん",
"げきとつ",
"げきは",
"げきやく",
"げこう",
"げこくじょう",
"げざい",
"けさき",
"げざん",
"けしき",
"けしごむ",
"けしょう",
"げすと",
"けたば",
"けちゃっぷ",
"けちらす",
"けつあつ",
"けつい",
"けつえき",
"けっこん",
"けつじょ",
"けっせき",
"けってい",
"けつまつ",
"げつようび",
"げつれい",
"けつろん",
"げどく",
"けとばす",
"けとる",
"けなげ",
"けなす",
"けなみ",
"けぬき",
"げねつ",
"けねん",
"けはい",
"げひん",
"けぶかい",
"げぼく",
"けまり",
"けみかる",
"けむし",
"けむり",
"けもの",
"けらい",
"けろけろ",
"けわしい",
"けんい",
"けんえつ",
"けんお",
"けんか",
"げんき",
"けんげん",
"けんこう",
"けんさく",
"けんしゅう",
"けんすう",
"げんそう",
"けんちく",
"けんてい",
"けんとう",
"けんない",
"けんにん",
"げんぶつ",
"けんま",
"けんみん",
"けんめい",
"けんらん",
"けんり",
"こあくま",
"こいぬ",
"こいびと",
"ごうい",
"こうえん",
"こうおん",
"こうかん",
"ごうきゅう",
"ごうけい",
"こうこう",
"こうさい",
"こうじ",
"こうすい",
"ごうせい",
"こうそく",
"こうたい",
"こうちゃ",
"こうつう",
"こうてい",
"こうどう",
"こうない",
"こうはい",
"ごうほう",
"ごうまん",
"こうもく",
"こうりつ",
"こえる",
"こおり",
"ごかい",
"ごがつ",
"ごかん",
"こくご",
"こくさい",
"こくとう",
"こくない",
"こくはく",
"こぐま",
"こけい",
"こける",
"ここのか",
"こころ",
"こさめ",
"こしつ",
"こすう",
"こせい",
"こせき",
"こぜん",
"こそだて",
"こたい",
"こたえる",
"こたつ",
"こちょう",
"こっか",
"こつこつ",
"こつばん",
"こつぶ",
"こてい",
"こてん",
"ことがら",
"ことし",
"ことば",
"ことり",
"こなごな",
"こねこね",
"このまま",
"このみ",
"このよ",
"ごはん",
"こひつじ",
"こふう",
"こふん",
"こぼれる",
"ごまあぶら",
"こまかい",
"ごますり",
"こまつな",
"こまる",
"こむぎこ",
"こもじ",
"こもち",
"こもの",
"こもん",
"こやく",
"こやま",
"こゆう",
"こゆび",
"こよい",
"こよう",
"こりる",
"これくしょん",
"ころっけ",
"こわもて",
"こわれる",
"こんいん",
"こんかい",
"こんき",
"こんしゅう",
"こんすい",
"こんだて",
"こんとん",
"こんなん",
"こんびに",
"こんぽん",
"こんまけ",
"こんや",
"こんれい",
"こんわく",
"ざいえき",
"さいかい",
"さいきん",
"ざいげん",
"ざいこ",
"さいしょ",
"さいせい",
"ざいたく",
"ざいちゅう",
"さいてき",
"ざいりょう",
"さうな",
"さかいし",
"さがす",
"さかな",
"さかみち",
"さがる",
"さぎょう",
"さくし",
"さくひん",
"さくら",
"さこく",
"さこつ",
"さずかる",
"ざせき",
"さたん",
"さつえい",
"ざつおん",
"ざっか",
"ざつがく",
"さっきょく",
"ざっし",
"さつじん",
"ざっそう",
"さつたば",
"さつまいも",
"さてい",
"さといも",
"さとう",
"さとおや",
"さとし",
"さとる",
"さのう",
"さばく",
"さびしい",
"さべつ",
"さほう",
"さほど",
"さます",
"さみしい",
"さみだれ",
"さむけ",
"さめる",
"さやえんどう",
"さゆう",
"さよう",
"さよく",
"さらだ",
"ざるそば",
"さわやか",
"さわる",
"さんいん",
"さんか",
"さんきゃく",
"さんこう",
"さんさい",
"ざんしょ",
"さんすう",
"さんせい",
"さんそ",
"さんち",
"さんま",
"さんみ",
"さんらん",
"しあい",
"しあげ",
"しあさって",
"しあわせ",
"しいく",
"しいん",
"しうち",
"しえい",
"しおけ",
"しかい",
"しかく",
"じかん",
"しごと",
"しすう",
"じだい",
"したうけ",
"したぎ",
"したて",
"したみ",
"しちょう",
"しちりん",
"しっかり",
"しつじ",
"しつもん",
"してい",
"してき",
"してつ",
"じてん",
"じどう",
"しなぎれ",
"しなもの",
"しなん",
"しねま",
"しねん",
"しのぐ",
"しのぶ",
"しはい",
"しばかり",
"しはつ",
"しはらい",
"しはん",
"しひょう",
"しふく",
"じぶん",
"しへい",
"しほう",
"しほん",
"しまう",
"しまる",
"しみん",
"しむける",
"じむしょ",
"しめい",
"しめる",
"しもん",
"しゃいん",
"しゃうん",
"しゃおん",
"じゃがいも",
"しやくしょ",
"しゃくほう",
"しゃけん",
"しゃこ",
"しゃざい",
"しゃしん",
"しゃせん",
"しゃそう",
"しゃたい",
"しゃちょう",
"しゃっきん",
"じゃま",
"しゃりん",
"しゃれい",
"じゆう",
"じゅうしょ",
"しゅくはく",
"じゅしん",
"しゅっせき",
"しゅみ",
"しゅらば",
"じゅんばん",
"しょうかい",
"しょくたく",
"しょっけん",
"しょどう",
"しょもつ",
"しらせる",
"しらべる",
"しんか",
"しんこう",
"じんじゃ",
"しんせいじ",
"しんちく",
"しんりん",
"すあげ",
"すあし",
"すあな",
"ずあん",
"すいえい",
"すいか",
"すいとう",
"ずいぶん",
"すいようび",
"すうがく",
"すうじつ",
"すうせん",
"すおどり",
"すきま",
"すくう",
"すくない",
"すける",
"すごい",
"すこし",
"ずさん",
"すずしい",
"すすむ",
"すすめる",
"すっかり",
"ずっしり",
"ずっと",
"すてき",
"すてる",
"すねる",
"すのこ",
"すはだ",
"すばらしい",
"ずひょう",
"ずぶぬれ",
"すぶり",
"すふれ",
"すべて",
"すべる",
"ずほう",
"すぼん",
"すまい",
"すめし",
"すもう",
"すやき",
"すらすら",
"するめ",
"すれちがう",
"すろっと",
"すわる",
"すんぜん",
"すんぽう",
"せあぶら",
"せいかつ",
"せいげん",
"せいじ",
"せいよう",
"せおう",
"せかいかん",
"せきにん",
"せきむ",
"せきゆ",
"せきらんうん",
"せけん",
"せこう",
"せすじ",
"せたい",
"せたけ",
"せっかく",
"せっきゃく",
"ぜっく",
"せっけん",
"せっこつ",
"せっさたくま",
"せつぞく",
"せつだん",
"せつでん",
"せっぱん",
"せつび",
"せつぶん",
"せつめい",
"せつりつ",
"せなか",
"せのび",
"せはば",
"せびろ",
"せぼね",
"せまい",
"せまる",
"せめる",
"せもたれ",
"せりふ",
"ぜんあく",
"せんい",
"せんえい",
"せんか",
"せんきょ",
"せんく",
"せんげん",
"ぜんご",
"せんさい",
"せんしゅ",
"せんすい",
"せんせい",
"せんぞ",
"せんたく",
"せんちょう",
"せんてい",
"せんとう",
"せんぬき",
"せんねん",
"せんぱい",
"ぜんぶ",
"ぜんぽう",
"せんむ",
"せんめんじょ",
"せんもん",
"せんやく",
"せんゆう",
"せんよう",
"ぜんら",
"ぜんりゃく",
"せんれい",
"せんろ",
"そあく",
"そいとげる",
"そいね",
"そうがんきょう",
"そうき",
"そうご",
"そうしん",
"そうだん",
"そうなん",
"そうび",
"そうめん",
"そうり",
"そえもの",
"そえん",
"そがい",
"そげき",
"そこう",
"そこそこ",
"そざい",
"そしな",
"そせい",
"そせん",
"そそぐ",
"そだてる",
"そつう",
"そつえん",
"そっかん",
"そつぎょう",
"そっけつ",
"そっこう",
"そっせん",
"そっと",
"そとがわ",
"そとづら",
"そなえる",
"そなた",
"そふぼ",
"そぼく",
"そぼろ",
"そまつ",
"そまる",
"そむく",
"そむりえ",
"そめる",
"そもそも",
"そよかぜ",
"そらまめ",
"そろう",
"そんかい",
"そんけい",
"そんざい",
"そんしつ",
"そんぞく",
"そんちょう",
"ぞんび",
"ぞんぶん",
"そんみん",
"たあい",
"たいいん",
"たいうん",
"たいえき",
"たいおう",
"だいがく",
"たいき",
"たいぐう",
"たいけん",
"たいこ",
"たいざい",
"だいじょうぶ",
"だいすき",
"たいせつ",
"たいそう",
"だいたい",
"たいちょう",
"たいてい",
"だいどころ",
"たいない",
"たいねつ",
"たいのう",
"たいはん",
"だいひょう",
"たいふう",
"たいへん",
"たいほ",
"たいまつばな",
"たいみんぐ",
"たいむ",
"たいめん",
"たいやき",
"たいよう",
"たいら",
"たいりょく",
"たいる",
"たいわん",
"たうえ",
"たえる",
"たおす",
"たおる",
"たおれる",
"たかい",
"たかね",
"たきび",
"たくさん",
"たこく",
"たこやき",
"たさい",
"たしざん",
"だじゃれ",
"たすける",
"たずさわる",
"たそがれ",
"たたかう",
"たたく",
"ただしい",
"たたみ",
"たちばな",
"だっかい",
"だっきゃく",
"だっこ",
"だっしゅつ",
"だったい",
"たてる",
"たとえる",
"たなばた",
"たにん",
"たぬき",
"たのしみ",
"たはつ",
"たぶん",
"たべる",
"たぼう",
"たまご",
"たまる",
"だむる",
"ためいき",
"ためす",
"ためる",
"たもつ",
"たやすい",
"たよる",
"たらす",
"たりきほんがん",
"たりょう",
"たりる",
"たると",
"たれる",
"たれんと",
"たろっと",
"たわむれる",
"だんあつ",
"たんい",
"たんおん",
"たんか",
"たんき",
"たんけん",
"たんご",
"たんさん",
"たんじょうび",
"だんせい",
"たんそく",
"たんたい",
"だんち",
"たんてい",
"たんとう",
"だんな",
"たんにん",
"だんねつ",
"たんのう",
"たんぴん",
"だんぼう",
"たんまつ",
"たんめい",
"だんれつ",
"だんろ",
"だんわ",
"ちあい",
"ちあん",
"ちいき",
"ちいさい",
"ちえん",
"ちかい",
"ちから",
"ちきゅう",
"ちきん",
"ちけいず",
"ちけん",
"ちこく",
"ちさい",
"ちしき",
"ちしりょう",
"ちせい",
"ちそう",
"ちたい",
"ちたん",
"ちちおや",
"ちつじょ",
"ちてき",
"ちてん",
"ちぬき",
"ちぬり",
"ちのう",
"ちひょう",
"ちへいせん",
"ちほう",
"ちまた",
"ちみつ",
"ちみどろ",
"ちめいど",
"ちゃんこなべ",
"ちゅうい",
"ちゆりょく",
"ちょうし",
"ちょさくけん",
"ちらし",
"ちらみ",
"ちりがみ",
"ちりょう",
"ちるど",
"ちわわ",
"ちんたい",
"ちんもく",
"ついか",
"ついたち",
"つうか",
"つうじょう",
"つうはん",
"つうわ",
"つかう",
"つかれる",
"つくね",
"つくる",
"つけね",
"つける",
"つごう",
"つたえる",
"つづく",
"つつじ",
"つつむ",
"つとめる",
"つながる",
"つなみ",
"つねづね",
"つのる",
"つぶす",
"つまらない",
"つまる",
"つみき",
"つめたい",
"つもり",
"つもる",
"つよい",
"つるぼ",
"つるみく",
"つわもの",
"つわり",
"てあし",
"てあて",
"てあみ",
"ていおん",
"ていか",
"ていき",
"ていけい",
"ていこく",
"ていさつ",
"ていし",
"ていせい",
"ていたい",
"ていど",
"ていねい",
"ていひょう",
"ていへん",
"ていぼう",
"てうち",
"ておくれ",
"てきとう",
"てくび",
"でこぼこ",
"てさぎょう",
"てさげ",
"てすり",
"てそう",
"てちがい",
"てちょう",
"てつがく",
"てつづき",
"でっぱ",
"てつぼう",
"てつや",
"でぬかえ",
"てぬき",
"てぬぐい",
"てのひら",
"てはい",
"てぶくろ",
"てふだ",
"てほどき",
"てほん",
"てまえ",
"てまきずし",
"てみじか",
"てみやげ",
"てらす",
"てれび",
"てわけ",
"てわたし",
"でんあつ",
"てんいん",
"てんかい",
"てんき",
"てんぐ",
"てんけん",
"てんごく",
"てんさい",
"てんし",
"てんすう",
"でんち",
"てんてき",
"てんとう",
"てんない",
"てんぷら",
"てんぼうだい",
"てんめつ",
"てんらんかい",
"でんりょく",
"でんわ",
"どあい",
"といれ",
"どうかん",
"とうきゅう",
"どうぐ",
"とうし",
"とうむぎ",
"とおい",
"とおか",
"とおく",
"とおす",
"とおる",
"とかい",
"とかす",
"ときおり",
"ときどき",
"とくい",
"とくしゅう",
"とくてん",
"とくに",
"とくべつ",
"とけい",
"とける",
"とこや",
"とさか",
"としょかん",
"とそう",
"とたん",
"とちゅう",
"とっきゅう",
"とっくん",
"とつぜん",
"とつにゅう",
"とどける",
"ととのえる",
"とない",
"となえる",
"となり",
"とのさま",
"とばす",
"どぶがわ",
"とほう",
"とまる",
"とめる",
"ともだち",
"ともる",
"どようび",
"とらえる",
"とんかつ",
"どんぶり",
"ないかく",
"ないこう",
"ないしょ",
"ないす",
"ないせん",
"ないそう",
"なおす",
"ながい",
"なくす",
"なげる",
"なこうど",
"なさけ",
"なたでここ",
"なっとう",
"なつやすみ",
"ななおし",
"なにごと",
"なにもの",
"なにわ",
"なのか",
"なふだ",
"なまいき",
"なまえ",
"なまみ",
"なみだ",
"なめらか",
"なめる",
"なやむ",
"ならう",
"ならび",
"ならぶ",
"なれる",
"なわとび",
"なわばり",
"にあう",
"にいがた",
"にうけ",
"におい",
"にかい",
"にがて",
"にきび",
"にくしみ",
"にくまん",
"にげる",
"にさんかたんそ",
"にしき",
"にせもの",
"にちじょう",
"にちようび",
"にっか",
"にっき",
"にっけい",
"にっこう",
"にっさん",
"にっしょく",
"にっすう",
"にっせき",
"にってい",
"になう",
"にほん",
"にまめ",
"にもつ",
"にやり",
"にゅういん",
"にりんしゃ",
"にわとり",
"にんい",
"にんか",
"にんき",
"にんげん",
"にんしき",
"にんずう",
"にんそう",
"にんたい",
"にんち",
"にんてい",
"にんにく",
"にんぷ",
"にんまり",
"にんむ",
"にんめい",
"にんよう",
"ぬいくぎ",
"ぬかす",
"ぬぐいとる",
"ぬぐう",
"ぬくもり",
"ぬすむ",
"ぬまえび",
"ぬめり",
"ぬらす",
"ぬんちゃく",
"ねあげ",
"ねいき",
"ねいる",
"ねいろ",
"ねぐせ",
"ねくたい",
"ねくら",
"ねこぜ",
"ねこむ",
"ねさげ",
"ねすごす",
"ねそべる",
"ねだん",
"ねつい",
"ねっしん",
"ねつぞう",
"ねったいぎょ",
"ねぶそく",
"ねふだ",
"ねぼう",
"ねほりはほり",
"ねまき",
"ねまわし",
"ねみみ",
"ねむい",
"ねむたい",
"ねもと",
"ねらう",
"ねわざ",
"ねんいり",
"ねんおし",
"ねんかん",
"ねんきん",
"ねんぐ",
"ねんざ",
"ねんし",
"ねんちゃく",
"ねんど",
"ねんぴ",
"ねんぶつ",
"ねんまつ",
"ねんりょう",
"ねんれい",
"のいず",
"のおづま",
"のがす",
"のきなみ",
"のこぎり",
"のこす",
"のこる",
"のせる",
"のぞく",
"のぞむ",
"のたまう",
"のちほど",
"のっく",
"のばす",
"のはら",
"のべる",
"のぼる",
"のみもの",
"のやま",
"のらいぬ",
"のらねこ",
"のりもの",
"のりゆき",
"のれん",
"のんき",
"ばあい",
"はあく",
"ばあさん",
"ばいか",
"ばいく",
"はいけん",
"はいご",
"はいしん",
"はいすい",
"はいせん",
"はいそう",
"はいち",
"ばいばい",
"はいれつ",
"はえる",
"はおる",
"はかい",
"ばかり",
"はかる",
"はくしゅ",
"はけん",
"はこぶ",
"はさみ",
"はさん",
"はしご",
"ばしょ",
"はしる",
"はせる",
"ぱそこん",
"はそん",
"はたん",
"はちみつ",
"はつおん",
"はっかく",
"はづき",
"はっきり",
"はっくつ",
"はっけん",
"はっこう",
"はっさん",
"はっしん",
"はったつ",
"はっちゅう",
"はってん",
"はっぴょう",
"はっぽう",
"はなす",
"はなび",
"はにかむ",
"はぶらし",
"はみがき",
"はむかう",
"はめつ",
"はやい",
"はやし",
"はらう",
"はろうぃん",
"はわい",
"はんい",
"はんえい",
"はんおん",
"はんかく",
"はんきょう",
"ばんぐみ",
"はんこ",
"はんしゃ",
"はんすう",
"はんだん",
"ぱんち",
"ぱんつ",
"はんてい",
"はんとし",
"はんのう",
"はんぱ",
"はんぶん",
"はんぺん",
"はんぼうき",
"はんめい",
"はんらん",
"はんろん",
"ひいき",
"ひうん",
"ひえる",
"ひかく",
"ひかり",
"ひかる",
"ひかん",
"ひくい",
"ひけつ",
"ひこうき",
"ひこく",
"ひさい",
"ひさしぶり",
"ひさん",
"びじゅつかん",
"ひしょ",
"ひそか",
"ひそむ",
"ひたむき",
"ひだり",
"ひたる",
"ひつぎ",
"ひっこし",
"ひっし",
"ひつじゅひん",
"ひっす",
"ひつぜん",
"ぴったり",
"ぴっちり",
"ひつよう",
"ひてい",
"ひとごみ",
"ひなまつり",
"ひなん",
"ひねる",
"ひはん",
"ひびく",
"ひひょう",
"ひほう",
"ひまわり",
"ひまん",
"ひみつ",
"ひめい",
"ひめじし",
"ひやけ",
"ひやす",
"ひよう",
"びょうき",
"ひらがな",
"ひらく",
"ひりつ",
"ひりょう",
"ひるま",
"ひるやすみ",
"ひれい",
"ひろい",
"ひろう",
"ひろき",
"ひろゆき",
"ひんかく",
"ひんけつ",
"ひんこん",
"ひんしゅ",
"ひんそう",
"ぴんち",
"ひんぱん",
"びんぼう",
"ふあん",
"ふいうち",
"ふうけい",
"ふうせん",
"ぷうたろう",
"ふうとう",
"ふうふ",
"ふえる",
"ふおん",
"ふかい",
"ふきん",
"ふくざつ",
"ふくぶくろ",
"ふこう",
"ふさい",
"ふしぎ",
"ふじみ",
"ふすま",
"ふせい",
"ふせぐ",
"ふそく",
"ぶたにく",
"ふたん",
"ふちょう",
"ふつう",
"ふつか",
"ふっかつ",
"ふっき",
"ふっこく",
"ぶどう",
"ふとる",
"ふとん",
"ふのう",
"ふはい",
"ふひょう",
"ふへん",
"ふまん",
"ふみん",
"ふめつ",
"ふめん",
"ふよう",
"ふりこ",
"ふりる",
"ふるい",
"ふんいき",
"ぶんがく",
"ぶんぐ",
"ふんしつ",
"ぶんせき",
"ふんそう",
"ぶんぽう",
"へいあん",
"へいおん",
"へいがい",
"へいき",
"へいげん",
"へいこう",
"へいさ",
"へいしゃ",
"へいせつ",
"へいそ",
"へいたく",
"へいてん",
"へいねつ",
"へいわ",
"へきが",
"へこむ",
"べにいろ",
"べにしょうが",
"へらす",
"へんかん",
"べんきょう",
"べんごし",
"へんさい",
"へんたい",
"べんり",
"ほあん",
"ほいく",
"ぼうぎょ",
"ほうこく",
"ほうそう",
"ほうほう",
"ほうもん",
"ほうりつ",
"ほえる",
"ほおん",
"ほかん",
"ほきょう",
"ぼきん",
"ほくろ",
"ほけつ",
"ほけん",
"ほこう",
"ほこる",
"ほしい",
"ほしつ",
"ほしゅ",
"ほしょう",
"ほせい",
"ほそい",
"ほそく",
"ほたて",
"ほたる",
"ぽちぶくろ",
"ほっきょく",
"ほっさ",
"ほったん",
"ほとんど",
"ほめる",
"ほんい",
"ほんき",
"ほんけ",
"ほんしつ",
"ほんやく",
"まいにち",
"まかい",
"まかせる",
"まがる",
"まける",
"まこと",
"まさつ",
"まじめ",
"ますく",
"まぜる",
"まつり",
"まとめ",
"まなぶ",
"まぬけ",
"まねく",
"まほう",
"まもる",
"まゆげ",
"まよう",
"まろやか",
"まわす",
"まわり",
"まわる",
"まんが",
"まんきつ",
"まんぞく",
"まんなか",
"みいら",
"みうち",
"みえる",
"みがく",
"みかた",
"みかん",
"みけん",
"みこん",
"みじかい",
"みすい",
"みすえる",
"みせる",
"みっか",
"みつかる",
"みつける",
"みてい",
"みとめる",
"みなと",
"みなみかさい",
"みねらる",
"みのう",
"みのがす",
"みほん",
"みもと",
"みやげ",
"みらい",
"みりょく",
"みわく",
"みんか",
"みんぞく",
"むいか",
"むえき",
"むえん",
"むかい",
"むかう",
"むかえ",
"むかし",
"むぎちゃ",
"むける",
"むげん",
"むさぼる",
"むしあつい",
"むしば",
"むじゅん",
"むしろ",
"むすう",
"むすこ",
"むすぶ",
"むすめ",
"むせる",
"むせん",
"むちゅう",
"むなしい",
"むのう",
"むやみ",
"むよう",
"むらさき",
"むりょう",
"むろん",
"めいあん",
"めいうん",
"めいえん",
"めいかく",
"めいきょく",
"めいさい",
"めいし",
"めいそう",
"めいぶつ",
"めいれい",
"めいわく",
"めぐまれる",
"めざす",
"めした",
"めずらしい",
"めだつ",
"めまい",
"めやす",
"めんきょ",
"めんせき",
"めんどう",
"もうしあげる",
"もうどうけん",
"もえる",
"もくし",
"もくてき",
"もくようび",
"もちろん",
"もどる",
"もらう",
"もんく",
"もんだい",
"やおや",
"やける",
"やさい",
"やさしい",
"やすい",
"やすたろう",
"やすみ",
"やせる",
"やそう",
"やたい",
"やちん",
"やっと",
"やっぱり",
"やぶる",
"やめる",
"ややこしい",
"やよい",
"やわらかい",
"ゆうき",
"ゆうびんきょく",
"ゆうべ",
"ゆうめい",
"ゆけつ",
"ゆしゅつ",
"ゆせん",
"ゆそう",
"ゆたか",
"ゆちゃく",
"ゆでる",
"ゆにゅう",
"ゆびわ",
"ゆらい",
"ゆれる",
"ようい",
"ようか",
"ようきゅう",
"ようじ",
"ようす",
"ようちえん",
"よかぜ",
"よかん",
"よきん",
"よくせい",
"よくぼう",
"よけい",
"よごれる",
"よさん",
"よしゅう",
"よそう",
"よそく",
"よっか",
"よてい",
"よどがわく",
"よねつ",
"よやく",
"よゆう",
"よろこぶ",
"よろしい",
"らいう",
"らくがき",
"らくご",
"らくさつ",
"らくだ",
"らしんばん",
"らせん",
"らぞく",
"らたい",
"らっか",
"られつ",
"りえき",
"りかい",
"りきさく",
"りきせつ",
"りくぐん",
"りくつ",
"りけん",
"りこう",
"りせい",
"りそう",
"りそく",
"りてん",
"りねん",
"りゆう",
"りゅうがく",
"りよう",
"りょうり",
"りょかん",
"りょくちゃ",
"りょこう",
"りりく",
"りれき",
"りろん",
"りんご",
"るいけい",
"るいさい",
"るいじ",
"るいせき",
"るすばん",
"るりがわら",
"れいかん",
"れいぎ",
"れいせい",
"れいぞうこ",
"れいとう",
"れいぼう",
"れきし",
"れきだい",
"れんあい",
"れんけい",
"れんこん",
"れんさい",
"れんしゅう",
"れんぞく",
"れんらく",
"ろうか",
"ろうご",
"ろうじん",
"ろうそく",
"ろくが",
"ろこつ",
"ろじうら",
"ろしゅつ",
"ろせん",
"ろてん",
"ろめん",
"ろれつ",
"ろんぎ",
"ろんぱ",
"ろんぶん",
"ろんり",
"わかす",
"わかめ",
"わかやま",
"わかれる",
"わしつ",
"わじまし",
"わすれもの",
"わらう",
"われる",
];
lt.space = "　";
class pt extends O {
constructor(t, e, r = et) {
super({ privKey: t, pubKey: e }), (this.PrivKey = r);
}
fromJSON(t) {
return (
t.privKey && (this.privKey = this.PrivKey.fromJSON(t.privKey)),
t.pubKey && (this.pubKey = X.fromJSON(t.pubKey)),
this
);
}
fromBr(t) {
const e = t.readUInt8();
e > 0 &&
(this.privKey = new this.PrivKey().fromFastBuffer(t.read(e)));
const r = t.readUInt8();
return (
r > 0 && (this.pubKey = new X().fromFastBuffer(t.read(r))), this
);
}
toBw(t) {
if ((t || (t = new _()), this.privKey)) {
const e = this.privKey.toFastBuffer();
t.writeUInt8(e.length), t.write(e);
} else t.writeUInt8(0);
if (this.pubKey) {
const e = this.pubKey.toFastBuffer();
t.writeUInt8(e.length), t.write(e);
} else t.writeUInt8(0);
return t;
}
fromString(t) {
return this.fromJSON(JSON.parse(t));
}
toString() {
return JSON.stringify(this.toJSON());
}
toPublic() {
const t = new pt().fromObject(this);
return (t.privKey = void 0), t;
}
fromPrivKey(t) {
return (
(this.privKey = t), (this.pubKey = new X().fromPrivKey(t)), this
);
}
static fromPrivKey(t) {
return new this().fromPrivKey(t);
}
async asyncFromPrivKey(t) {
return (
(this.privKey = t),
(this.pubKey = await new X().asyncFromPrivKey(t)),
this
);
}
static asyncFromPrivKey(t) {
return new this().asyncFromPrivKey(t);
}
fromRandom() {
return (
(this.privKey = new this.PrivKey().fromRandom()),
(this.pubKey = new X().fromPrivKey(this.privKey)),
this
);
}
static fromRandom() {
return new this().fromRandom();
}
async asyncFromRandom() {
return (
(this.privKey = new this.PrivKey().fromRandom()),
this.asyncFromPrivKey(this.privKey)
);
}
static asyncFromRandom() {
return new this().asyncFromRandom();
}
}
(pt.Mainnet = class extends pt {
constructor(t, e) {
super(t, e, et.Mainnet);
}
}),
(pt.Testnet = class extends pt {
constructor(t, e) {
super(t, e, et.Testnet);
}
});
var bt = r(8764).Buffer;
class mt extends O {
constructor(t, e, r, i, n, s) {
super({
sig: t,
keyPair: e,
hashBuf: r,
k: i,
endian: n,
verified: s,
});
}
toJSON() {
return {
sig: this.sig ? this.sig.toString() : void 0,
keyPair: this.keyPair
? this.keyPair.toBuffer().toString("hex")
: void 0,
hashBuf: this.hashBuf ? this.hashBuf.toString("hex") : void 0,
k: this.k ? this.k.toString() : void 0,
endian: this.endian,
verified: this.verified,
};
}
fromJSON(t) {
return (
(this.sig = t.sig ? new it().fromString(t.sig) : void 0),
(this.keyPair = t.keyPair
? new pt().fromBuffer(bt.from(t.keyPair, "hex"))
: void 0),
(this.hashBuf = t.hashBuf ? bt.from(t.hashBuf, "hex") : void 0),
(this.k = t.k ? new b().fromString(t.k) : void 0),
(this.endian = t.endian),
(this.verified = t.verified),
this
);
}
toBuffer() {
const t = JSON.stringify(this.toJSON());
return bt.from(t);
}
fromBuffer(t) {
const e = JSON.parse(t.toString());
return this.fromJSON(e);
}
calcrecovery() {
for (let t = 0; t < 4; t++) {
let e;
this.sig.recovery = t;
try {
e = this.sig2PubKey();
} catch (t) {
continue;
}
if (e.point.eq(this.keyPair.pubKey.point)) {
const t = this.keyPair.pubKey.compressed;
return (
(this.sig.compressed =
void 0 === this.keyPair.pubKey.compressed || t),
this
);
}
}
throw ((this.sig.recovery = void 0),
new Error("Unable to find valid recovery factor"));
}
async asyncCalcrecovery() {
const t = await T.asyncObjectMethod(this, "calcrecovery", []);
return this.fromFastBuffer(t.resbuf);
}
static calcrecovery(t, e, r) {
return new mt()
.fromObject({
sig: t,
keyPair: new pt().fromObject({ pubKey: e }),
hashBuf: r,
})
.calcrecovery().sig;
}
static async asyncCalcrecovery(t, e, r) {
const i = await T.asyncClassMethod(mt, "calcrecovery", [t, e, r]);
return new it().fromFastBuffer(i.resbuf);
}
fromString(t) {
const e = JSON.parse(t);
return (
e.hashBuf && (this.hashBuf = bt.from(e.hashBuf, "hex")),
e.keyPair && (this.keyPair = new pt().fromString(e.keyPair)),
e.sig && (this.sig = new it().fromString(e.sig)),
e.k && (this.k = new b(e.k, 10)),
this
);
}
randomK() {
const t = J.getN();
let e;
do {
e = new b().fromBuffer($.getRandomBuffer(32));
} while (!e.lt(t) || !e.gt(0));
return (this.k = e), this;
}
deterministicK(t) {
let e = bt.alloc(32);
e.fill(1);
let r = bt.alloc(32);
r.fill(0);
const i = this.keyPair.privKey.bn.toBuffer({ size: 32 });
(r = L.sha256Hmac(
bt.concat([e, bt.from([0]), i, this.hashBuf]),
r
)),
(e = L.sha256Hmac(e, r)),
(r = L.sha256Hmac(
bt.concat([e, bt.from([1]), i, this.hashBuf]),
r
)),
(e = L.sha256Hmac(e, r)),
(e = L.sha256Hmac(e, r));
let n = new b().fromBuffer(e);
const s = J.getN();
void 0 === t && (t = 0);
for (let i = 0; i < t || !n.lt(s) || !n.gt(0); i++)
(r = L.sha256Hmac(bt.concat([e, bt.from([0])]), r)),
(e = L.sha256Hmac(e, r)),
(e = L.sha256Hmac(e, r)),
(n = new b().fromBuffer(e));
return (this.k = n), this;
}
sig2PubKey() {
const t = this.sig.recovery;
if (0 !== t && 1 !== t && 2 !== t && 3 !== t)
throw new Error("i must be equal to 0, 1, 2, or 3");
const e = new b().fromBuffer(this.hashBuf),
r = this.sig.r,
i = this.sig.s,
n = 1 & t,
s = t >> 1,
o = J.getN(),
a = J.getG(),
h = s ? r.add(o) : r,
f = J.fromX(n, h);
let u = "";
try {
f.mul(o);
} catch (t) {
u = t.message;
}
if ("point mul out of range" !== u)
throw new Error("nR is not a valid curve point");
const c = e.neg().umod(o),
d = r.invm(o),
l = f
.mul(i)
.add(a.mul(c))
.mul(d),
p = new X(l);
return (p.compressed = this.sig.compressed), p.validate(), p;
}
async asyncSig2PubKey() {
const t = await T.asyncObjectMethod(this, "sig2PubKey", []);
return X.fromFastBuffer(t.resbuf);
}
static sig2PubKey(t, e) {
return new mt().fromObject({ sig: t, hashBuf: e }).sig2PubKey();
}
static async asyncSig2PubKey(t, e) {
const r = new mt().fromObject({ sig: t, hashBuf: e });
return await r.asyncSig2PubKey();
}
verifyStr(t = !0) {
if (!bt.isBuffer(this.hashBuf) || 32 !== this.hashBuf.length)
return "hashBuf must be a 32 byte buffer";
try {
this.keyPair.pubKey.validate();
} catch (i) {
return "Invalid pubKey: " + i;
}
const e = this.sig.r,
r = this.sig.s;
if (!(e.gt(0) && e.lt(J.getN()) && r.gt(0) && r.lt(J.getN())))
return "r and s not in range";
if (t && !this.sig.hasLowS())
return "s is too high and does not satisfy low s contraint - see bip 62";
const i = new b().fromBuffer(
this.hashBuf,
this.endian ? { endian: this.endian } : void 0
),
n = J.getN(),
s = r.invm(n),
o = s.mul(i).mod(n),
a = s.mul(e).mod(n),
h = J.getG().mulAdd(o, this.keyPair.pubKey.point, a);
return h.isInfinity()
? "p is infinity"
: 0 !==
h
.getX()
.mod(n)
.cmp(e) && "Invalid signature";
}
sign() {
const t =
"little" === this.endian
? new w(this.hashBuf).readReverse()
: this.hashBuf,
e = this.keyPair.privKey,
r = e.bn;
if (!t || !e || !r) throw new Error("invalid parameters");
if (!bt.isBuffer(t) || 32 !== t.length)
throw new Error("hashBuf must be a 32 byte buffer");
const i = J.getN(),
n = J.getG(),
s = new b().fromBuffer(t);
let o,
a,
h,
f,
u = 0;
do {
(!this.k || u > 0) && this.deterministicK(u),
u++,
(o = this.k),
(a = n.mul(o)),
(h = a.getX().mod(i)),
(f = o
.invm(i)
.mul(s.add(r.mul(h)))
.mod(i));
} while (h.cmp(0) <= 0 || f.cmp(0) <= 0);
return (
f.gt(
new b().fromBuffer(
bt.from(
"7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0",
"hex"
)
)
) && (f = J.getN().sub(f)),
(this.sig = it.fromObject({
r: h,
s: f,
compressed: this.keyPair.pubKey.compressed,
})),
this
);
}
async asyncSign() {
const t = await T.asyncObjectMethod(this, "sign", []);
return this.fromFastBuffer(t.resbuf);
}
signRandomK() {
return this.randomK(), this.sign();
}
toString() {
const t = {};
return (
this.hashBuf && (t.hashBuf = this.hashBuf.toString("hex")),
this.keyPair && (t.keyPair = this.keyPair.toString()),
this.sig && (t.sig = this.sig.toString()),
this.k && (t.k = this.k.toString()),
JSON.stringify(t)
);
}
verify(t = !0) {
return (
this.verifyStr(t) ? (this.verified = !1) : (this.verified = !0),
this
);
}
async asyncVerify(t = !0) {
const e = await T.asyncObjectMethod(this, "verify", [t]);
return this.fromFastBuffer(e.resbuf);
}
static sign(t, e, r) {
return new mt()
.fromObject({ hashBuf: t, endian: r, keyPair: e })
.sign().sig;
}
static async asyncSign(t, e, r) {
const i = new mt().fromObject({
hashBuf: t,
endian: r,
keyPair: e,
});
return await i.asyncSign(), i.sig;
}
static verify(t, e, r, i, n = !0) {
return new mt()
.fromObject({
hashBuf: t,
endian: i,
sig: e,
keyPair: new pt().fromObject({ pubKey: r }),
})
.verify(n).verified;
}
static async asyncVerify(t, e, r, i, n = !0) {
const s = new mt().fromObject({
hashBuf: t,
endian: i,
sig: e,
keyPair: new pt().fromObject({ pubKey: r }),
});
return await s.asyncVerify(n), s.verified;
}
}
var gt = r(8764).Buffer;
class yt extends O {
constructor(t, e, r, i, n) {
super({
messageBuf: t,
keyPair: e,
sig: r,
address: i,
verified: n,
});
}
static magicHash(t) {
if (!gt.isBuffer(t))
throw new Error("messageBuf must be a buffer");
const e = new _();
e.writeVarIntNum(yt.magicBytes.length),
e.write(yt.magicBytes),
e.writeVarIntNum(t.length),
e.write(t);
const r = e.toBuffer();
return L.sha256Sha256(r);
}
static async asyncMagicHash(t) {
const e = [t];
return (await T.asyncClassMethod(yt, "magicHash", e)).resbuf;
}
static sign(t, e) {
const r = new yt(t, e);
return r.sign(), r.sig.toCompact().toString("base64");
}
static async asyncSign(t, e) {
const r = [t, e],
i = await T.asyncClassMethod(yt, "sign", r);
return JSON.parse(i.resbuf.toString());
}
static verify(t, e, r) {
const i = gt.from(e, "base64"),
n = new yt();
return (
(n.messageBuf = t),
(n.sig = new it().fromCompact(i)),
(n.address = r),
n.verify().verified
);
}
static async asyncVerify(t, e, r) {
const i = [t, e, r],
n = await T.asyncClassMethod(yt, "verify", i);
return JSON.parse(n.resbuf.toString());
}
sign() {
const t = yt.magicHash(this.messageBuf),
e = new mt().fromObject({ hashBuf: t, keyPair: this.keyPair });
return e.sign(), e.calcrecovery(), (this.sig = e.sig), this;
}
verify() {
const t = yt.magicHash(this.messageBuf),
e = new mt();
if (
((e.hashBuf = t),
(e.sig = this.sig),
(e.keyPair = new pt()),
(e.keyPair.pubKey = e.sig2PubKey()),
!e.verify())
)
return (this.verified = !1), this;
const r = new at().fromPubKey(
e.keyPair.pubKey,
void 0,
this.sig.compressed
);
return (
R(r.hashBuf, this.address.hashBuf)
? (this.verified = !0)
: (this.verified = !1),
this
);
}
}
yt.magicBytes = gt.from("Bitcoin Signed Message:\n");
var wt = r(8764).Buffer;
class vt extends O {
constructor(t, e, r, i, n, s) {
super({
versionBytesNum: t,
prevBlockHashBuf: e,
merkleRootBuf: r,
time: i,
bits: n,
nonce: s,
});
}
fromJSON(t) {
return (
this.fromObject({
versionBytesNum: t.versionBytesNum,
prevBlockHashBuf: wt.from(t.prevBlockHashBuf, "hex"),
merkleRootBuf: wt.from(t.merkleRootBuf, "hex"),
time: t.time,
bits: t.bits,
nonce: t.nonce,
}),
this
);
}
toJSON() {
return {
versionBytesNum: this.versionBytesNum,
prevBlockHashBuf: this.prevBlockHashBuf.toString("hex"),
merkleRootBuf: this.merkleRootBuf.toString("hex"),
time: this.time,
bits: this.bits,
nonce: this.nonce,
};
}
fromBr(t) {
return (
(this.versionBytesNum = t.readUInt32LE()),
(this.prevBlockHashBuf = t.read(32)),
(this.merkleRootBuf = t.read(32)),
(this.time = t.readUInt32LE()),
(this.bits = t.readUInt32LE()),
(this.nonce = t.readUInt32LE()),
this
);
}
toBw(t) {
return (
t || (t = new _()),
t.writeUInt32LE(this.versionBytesNum),
t.write(this.prevBlockHashBuf),
t.write(this.merkleRootBuf),
t.writeUInt32LE(this.time),
t.writeUInt32LE(this.bits),
t.writeUInt32LE(this.nonce),
t
);
}
}
var _t = r(8764).Buffer;
class St extends O {
constructor(t, e, r, i) {
super({ hashBuf: t, buf: e, merkle1: r, merkle2: i });
}
hash() {
if (this.hashBuf) return this.hashBuf;
if (this.buf) return L.sha256Sha256(this.buf);
const t = this.merkle1.hash(),
e = this.merkle2.hash();
return (this.buf = _t.concat([t, e])), L.sha256Sha256(this.buf);
}
fromBuffers(t) {
if (t.length < 1) throw new Error("buffers must have a length");
t = t.slice();
const e = Math.log2(t.length);
if (!Number.isInteger(e)) {
const i = t[t.length - 1];
var r = Math.pow(2, Math.ceil(e));
for (let e = t.length; e < r; e++) t.push(i);
}
const i = t.slice(0, t.length / 2),
n = t.slice(t.length / 2);
return this.fromBufferArrays(i, n), this;
}
static fromBuffers(t) {
return new this().fromBuffers(t);
}
fromBufferArrays(t, e) {
if (1 === t.length)
return (
(this.merkle1 = new St(void 0, t[0])),
(this.merkle2 = new St(void 0, e[0])),
this
);
const r = t.slice(0, t.length / 2),
i = t.slice(t.length / 2);
this.merkle1 = new St().fromBufferArrays(r, i);
const n = e.slice(0, e.length / 2),
s = e.slice(e.length / 2);
return (this.merkle2 = new St().fromBufferArrays(n, s)), this;
}
static fromBufferArrays(t, e) {
return new this().fromBufferArrays(t, e);
}
leavesNum() {
if (this.merkle1)
return this.merkle1.leavesNum() + this.merkle2.leavesNum();
if (this.buf) return 1;
throw new Error("invalid number of leaves");
}
}
var Et = r(8764).Buffer;
class It extends O {
constructor(t, e, r) {
super(),
this.fromObject({
prevoutsHashBuf: t,
sequenceHashBuf: e,
outputsHashBuf: r,
});
}
fromBuffer(t) {
return this.fromJSON(JSON.parse(t.toString()));
}
toBuffer() {
return Et.from(JSON.stringify(this.toJSON()));
}
fromJSON(t) {
return (
(this.prevoutsHashBuf = t.prevoutsHashBuf
? Et.from(t.prevoutsHashBuf, "hex")
: void 0),
(this.sequenceHashBuf = t.sequenceHashBuf
? Et.from(t.sequenceHashBuf, "hex")
: void 0),
(this.outputsHashBuf = t.outputsHashBuf
? Et.from(t.outputsHashBuf, "hex")
: void 0),
this
);
}
toJSON() {
return {
prevoutsHashBuf: this.prevoutsHashBuf
? this.prevoutsHashBuf.toString("hex")
: void 0,
sequenceHashBuf: this.sequenceHashBuf
? this.sequenceHashBuf.toString("hex")
: void 0,
outputsHashBuf: this.outputsHashBuf
? this.outputsHashBuf.toString("hex")
: void 0,
};
}
}
var Ot = r(8764).Buffer;
class Bt extends O {
constructor(t) {
super({ buf: t });
}
fromJSON(t) {
return this.fromObject({ buf: Ot.from(t, "hex") }), this;
}
toJSON() {
return this.buf.toString("hex");
}
fromBuffer(t) {
return (this.buf = t), this;
}
fromBr(t) {
return (this.buf = t.readVarIntBuf()), this;
}
fromBn(t) {
return (this.buf = new _().writeVarIntBn(t).toBuffer()), this;
}
static fromBn(t) {
return new this().fromBn(t);
}
fromNumber(t) {
return (this.buf = new _().writeVarIntNum(t).toBuffer()), this;
}
static fromNumber(t) {
return new this().fromNumber(t);
}
toBuffer() {
return this.buf;
}
toBn() {
return new w(this.buf).readVarIntBn();
}
toNumber() {
return new w(this.buf).readVarIntNum();
}
}
var kt = r(8764).Buffer;
class Pt extends O {
constructor(t, e, r, i, n = 4294967295) {
super({
txHashBuf: t,
txOutNum: e,
scriptVi: r,
script: i,
nSequence: n,
});
}
setScript(t) {
return (
(this.scriptVi = Bt.fromNumber(t.toBuffer().length)),
(this.script = t),
this
);
}
fromProperties(t, e, r, i) {
return (
this.fromObject({ txHashBuf: t, txOutNum: e, nSequence: i }),
this.setScript(r),
this
);
}
static fromProperties(t, e, r, i) {
return new this().fromProperties(t, e, r, i);
}
fromJSON(t) {
return (
this.fromObject({
txHashBuf:
void 0 !== t.txHashBuf
? kt.from(t.txHashBuf, "hex")
: void 0,
txOutNum: t.txOutNum,
scriptVi:
void 0 !== t.scriptVi ? Bt.fromJSON(t.scriptVi) : void 0,
script: void 0 !== t.script ? st.fromJSON(t.script) : void 0,
nSequence: t.nSequence,
}),
this
);
}
toJSON() {
return {
txHashBuf:
void 0 !== this.txHashBuf
? this.txHashBuf.toString("hex")
: void 0,
txOutNum: this.txOutNum,
scriptVi:
void 0 !== this.scriptVi ? this.scriptVi.toJSON() : void 0,
script: void 0 !== this.script ? this.script.toJSON() : void 0,
nSequence: this.nSequence,
};
}
fromBr(t) {
return (
(this.txHashBuf = t.read(32)),
(this.txOutNum = t.readUInt32LE()),
(this.scriptVi = Bt.fromBuffer(t.readVarIntBuf())),
(this.script = st.fromBuffer(t.read(this.scriptVi.toNumber()))),
(this.nSequence = t.readUInt32LE()),
this
);
}
toBw(t) {
return (
t || (t = new _()),
t.write(this.txHashBuf),
t.writeUInt32LE(this.txOutNum),
t.write(this.scriptVi.buf),
t.write(this.script.toBuffer()),
t.writeUInt32LE(this.nSequence),
t
);
}
fromPubKeyHashTxOut(t, e, r, i) {
const n = new st();
if (!r.script.isPubKeyHashOut())
throw new Error("txOut must be of type pubKeyHash");
return (
n.writeOpCode(z.OP_0),
i ? n.writeBuffer(i.toBuffer()) : n.writeOpCode(z.OP_0),
(this.txHashBuf = t),
(this.txOutNum = e),
this.setScript(n),
this
);
}
hasNullInput() {
return (
"0000000000000000000000000000000000000000000000000000000000000000" ===
this.txHashBuf.toString("hex") && 4294967295 === this.txOutNum
);
}
setNullInput() {
(this.txHashBuf = kt.alloc(32)),
this.txHashBuf.fill(0),
(this.txOutNum = 4294967295);
}
}
(Pt.LOCKTIME_VERIFY_SEQUENCE = 1),
(Pt.SEQUENCE_FINAL = 4294967295),
(Pt.SEQUENCE_LOCKTIME_DISABLE_FLAG = 1 << 31),
(Pt.SEQUENCE_LOCKTIME_TYPE_FLAG = 1 << 22),
(Pt.SEQUENCE_LOCKTIME_MASK = 65535),
(Pt.SEQUENCE_LOCKTIME_GRANULARITY = 9);
class Rt extends O {
constructor(t, e, r) {
super({ valueBn: t, scriptVi: e, script: r });
}
setScript(t) {
return (
(this.scriptVi = Bt.fromNumber(t.toBuffer().length)),
(this.script = t),
this
);
}
fromProperties(t, e) {
return this.fromObject({ valueBn: t }), this.setScript(e), this;
}
static fromProperties(t, e) {
return new this().fromProperties(t, e);
}
fromJSON(t) {
return (
this.fromObject({
valueBn: new b().fromJSON(t.valueBn),
scriptVi: new Bt().fromJSON(t.scriptVi),
script: new st().fromJSON(t.script),
}),
this
);
}
toJSON() {
return {
valueBn: this.valueBn.toJSON(),
scriptVi: this.scriptVi.toJSON(),
script: this.script.toJSON(),
};
}
fromBr(t) {
return (
(this.valueBn = t.readUInt64LEBn()),
(this.scriptVi = Bt.fromNumber(t.readVarIntNum())),
(this.script = new st().fromBuffer(
t.read(this.scriptVi.toNumber())
)),
this
);
}
toBw(t) {
return (
t || (t = new _()),
t.writeUInt64LEBn(this.valueBn),
t.write(this.scriptVi.buf),
t.write(this.script.toBuffer()),
t
);
}
}
var At = r(8764).Buffer;
class Nt extends O {
constructor(
t = 1,
e = Bt.fromNumber(0),
r = [],
i = Bt.fromNumber(0),
n = [],
s = 0
) {
super({
versionBytesNum: t,
txInsVi: e,
txIns: r,
txOutsVi: i,
txOuts: n,
nLockTime: s,
});
}
fromJSON(t) {
const e = [];
t.txIns.forEach(function(t) {
e.push(new Pt().fromJSON(t));
});
const r = [];
return (
t.txOuts.forEach(function(t) {
r.push(new Rt().fromJSON(t));
}),
this.fromObject({
versionBytesNum: t.versionBytesNum,
txInsVi: new Bt().fromJSON(t.txInsVi),
txIns: e,
txOutsVi: new Bt().fromJSON(t.txOutsVi),
txOuts: r,
nLockTime: t.nLockTime,
}),
this
);
}
toJSON() {
const t = [];
this.txIns.forEach(function(e) {
t.push(e.toJSON());
});
const e = [];
return (
this.txOuts.forEach(function(t) {
e.push(t.toJSON());
}),
{
versionBytesNum: this.versionBytesNum,
txInsVi: this.txInsVi.toJSON(),
txIns: t,
txOutsVi: this.txOutsVi.toJSON(),
txOuts: e,
nLockTime: this.nLockTime,
}
);
}
fromBr(t) {
(this.versionBytesNum = t.readUInt32LE()),
(this.txInsVi = new Bt(t.readVarIntBuf()));
const e = this.txInsVi.toNumber();
this.txIns = [];
for (let r = 0; r < e; r++) this.txIns.push(new Pt().fromBr(t));
this.txOutsVi = new Bt(t.readVarIntBuf());
const r = this.txOutsVi.toNumber();
this.txOuts = [];
for (let e = 0; e < r; e++) this.txOuts.push(new Rt().fromBr(t));
return (this.nLockTime = t.readUInt32LE()), this;
}
toBw(t) {
t || (t = new _()),
t.writeUInt32LE(this.versionBytesNum),
t.write(this.txInsVi.buf);
for (let e = 0; e < this.txIns.length; e++) this.txIns[e].toBw(t);
t.write(this.txOutsVi.buf);
for (let e = 0; e < this.txOuts.length; e++)
this.txOuts[e].toBw(t);
return t.writeUInt32LE(this.nLockTime), t;
}
hashPrevouts() {
const t = new _();
for (const e in this.txIns) {
const r = this.txIns[e];
t.write(r.txHashBuf), t.writeUInt32LE(r.txOutNum);
}
return L.sha256Sha256(t.toBuffer());
}
hashSequence() {
const t = new _();
for (const e in this.txIns) {
const r = this.txIns[e];
t.writeUInt32LE(r.nSequence);
}
return L.sha256Sha256(t.toBuffer());
}
hashOutputs() {
const t = new _();
for (const e in this.txOuts) {
const r = this.txOuts[e];
t.write(r.toBuffer());
}
return L.sha256Sha256(t.toBuffer());
}
sighash(t, e, r, i, n = 0, s = new It()) {
const o = this.sighashPreimage(t, e, r, i, n, s);
return 0 ===
o.compare(
At.from(
"0000000000000000000000000000000000000000000000000000000000000001",
"hex"
)
)
? o
: new w(L.sha256Sha256(o)).readReverse();
}
async asyncSighash(t, e, r, i, n = 0, s = {}) {
return (
await T.asyncObjectMethod(this, "sighash", [t, e, r, i, n, s])
).resbuf;
}
sighashPreimage(t, e, r, i, n = 0, s = new It()) {
if (
t & it.SIGHASH_FORKID &&
n & Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
let n = At.alloc(32, 0),
o = At.alloc(32, 0),
a = At.alloc(32, 0);
t & it.SIGHASH_ANYONECANPAY ||
(n = s.prevoutsHashBuf
? s.prevoutsHashBuf
: (s.prevoutsHashBuf = this.hashPrevouts())),
t & it.SIGHASH_ANYONECANPAY ||
(31 & t) === it.SIGHASH_SINGLE ||
(31 & t) === it.SIGHASH_NONE ||
(o = s.sequenceHashBuf
? s.sequenceHashBuf
: (s.sequenceHashBuf = this.hashSequence())),
(31 & t) !== it.SIGHASH_SINGLE && (31 & t) !== it.SIGHASH_NONE
? (a = s.outputsHashBuf
? s.outputsHashBuf
: (s.outputsHashBuf = this.hashOutputs()))
: (31 & t) === it.SIGHASH_SINGLE &&
e < this.txOuts.length &&
(a = L.sha256Sha256(this.txOuts[e].toBuffer()));
const h = new _();
return (
h.writeUInt32LE(this.versionBytesNum),
h.write(n),
h.write(o),
h.write(this.txIns[e].txHashBuf),
h.writeUInt32LE(this.txIns[e].txOutNum),
h.writeVarIntNum(r.toBuffer().length),
h.write(r.toBuffer()),
h.writeUInt64LEBn(i),
h.writeUInt32LE(this.txIns[e].nSequence),
h.write(a),
h.writeUInt32LE(this.nLockTime),
h.writeUInt32LE(t >>> 0),
h.toBuffer()
);
}
const o = this.cloneByBuffer();
(r = new st().fromBuffer(r.toBuffer())).removeCodeseparators();
for (let t = 0; t < o.txIns.length; t++)
o.txIns[t] = Pt.fromBuffer(o.txIns[t].toBuffer()).setScript(
new st()
);
if (
((o.txIns[e] = Pt.fromBuffer(o.txIns[e].toBuffer()).setScript(
r
)),
(31 & t) === it.SIGHASH_NONE)
) {
(o.txOuts.length = 0), (o.txOutsVi = Bt.fromNumber(0));
for (let t = 0; t < o.txIns.length; t++)
t !== e && (o.txIns[t].nSequence = 0);
} else if ((31 & t) === it.SIGHASH_SINGLE) {
if (e > o.txOuts.length - 1)
return At.from(
"0000000000000000000000000000000000000000000000000000000000000001",
"hex"
);
(o.txOuts.length = e + 1), (o.txOutsVi = Bt.fromNumber(e + 1));
for (let t = 0; t < o.txOuts.length; t++)
t < e &&
(o.txOuts[t] = Rt.fromProperties(
new b().fromBuffer(At.from("ffffffffffffffff", "hex")),
new st()
));
for (let t = 0; t < o.txIns.length; t++)
t !== e && (o.txIns[t].nSequence = 0);
}
return (
t & it.SIGHASH_ANYONECANPAY &&
((o.txIns[0] = o.txIns[e]),
(o.txIns.length = 1),
(o.txInsVi = Bt.fromNumber(1))),
new _()
.write(o.toBuffer())
.writeInt32LE(t)
.toBuffer()
);
}
async asyncSighashPreimage(t, e, r, i, n = 0, s = {}) {
return (
await T.asyncObjectMethod(this, "sighashPreimage", [
t,
e,
r,
i,
n,
s,
])
).resbuf;
}
sign(
t,
e = it.SIGHASH_ALL | it.SIGHASH_FORKID,
r,
i,
n,
s = Nt.SCRIPT_ENABLE_SIGHASH_FORKID,
o = {}
) {
const a = this.sighash(e, r, i, n, s, o);
return mt.sign(a, t, "little").fromObject({ nHashType: e });
}
async asyncSign(
t,
e = it.SIGHASH_ALL | it.SIGHASH_FORKID,
r,
i,
n,
s = Nt.SCRIPT_ENABLE_SIGHASH_FORKID,
o = {}
) {
const a = await T.asyncObjectMethod(this, "sign", [
t,
e,
r,
i,
n,
s,
o,
]);
return new it().fromFastBuffer(a.resbuf);
}
verify(
t,
e,
r,
i,
n = !1,
s,
o = Nt.SCRIPT_ENABLE_SIGHASH_FORKID,
a = {}
) {
const h = this.sighash(t.nHashType, r, i, s, o, a);
return mt.verify(h, t, e, "little", n);
}
async asyncVerify(
t,
e,
r,
i,
n = !1,
s,
o = Nt.SCRIPT_ENABLE_SIGHASH_FORKID,
a = {}
) {
const h = await T.asyncObjectMethod(this, "verify", [
t,
e,
r,
i,
n,
s,
o,
a,
]);
return JSON.parse(h.resbuf.toString());
}
hash() {
return L.sha256Sha256(this.toBuffer());
}
async asyncHash() {
return (await T.asyncObjectMethod(this, "hash", [])).resbuf;
}
id() {
return new w(this.hash()).readReverse().toString("hex");
}
async asyncId() {
const t = await T.asyncObjectMethod(this, "id", []);
return JSON.parse(t.resbuf.toString());
}
addTxIn(t, e, r, i) {
let n;
return (
(n =
t instanceof Pt
? t
: new Pt()
.fromObject({ txHashBuf: t, txOutNum: e, nSequence: i })
.setScript(r)),
this.txIns.push(n),
(this.txInsVi = Bt.fromNumber(this.txInsVi.toNumber() + 1)),
this
);
}
addTxOut(t, e) {
let r;
return (
(r =
t instanceof Rt
? t
: new Rt().fromObject({ valueBn: t }).setScript(e)),
this.txOuts.push(r),
(this.txOutsVi = Bt.fromNumber(this.txOutsVi.toNumber() + 1)),
this
);
}
isCoinbase() {
return 1 === this.txIns.length && this.txIns[0].hasNullInput();
}
sort() {
return (
this.txIns.sort(
(t, e) =>
new w(t.txHashBuf)
.readReverse()
.compare(new w(e.txHashBuf).readReverse()) ||
t.txOutNum - e.txOutNum
),
this.txOuts.sort(
(t, e) =>
t.valueBn.sub(e.valueBn).toNumber() ||
t.script.toBuffer().compare(e.script.toBuffer())
),
this
);
}
}
(Nt.MAX_MONEY = 21e14), (Nt.SCRIPT_ENABLE_SIGHASH_FORKID = 65536);
var xt = r(8764).Buffer;
class Mt extends O {
constructor(t, e, r) {
super({ blockHeader: t, txsVi: e, txs: r });
}
fromJSON(t) {
const e = [];
return (
t.txs.forEach(function(t) {
e.push(new Nt().fromJSON(t));
}),
this.fromObject({
blockHeader: new vt().fromJSON(t.blockHeader),
txsVi: new Bt().fromJSON(t.txsVi),
txs: e,
}),
this
);
}
toJSON() {
const t = [];
return (
this.txs.forEach(function(e) {
t.push(e.toJSON());
}),
{
blockHeader: this.blockHeader.toJSON(),
txsVi: this.txsVi.toJSON(),
txs: t,
}
);
}
fromBr(t) {
(this.blockHeader = new vt().fromBr(t)),
(this.txsVi = new Bt(t.readVarIntBuf()));
const e = this.txsVi.toNumber();
this.txs = [];
for (let r = 0; r < e; r++) this.txs.push(new Nt().fromBr(t));
return this;
}
toBw(t) {
t || (t = new _()),
t.write(this.blockHeader.toBuffer()),
t.write(this.txsVi.buf);
const e = this.txsVi.toNumber();
for (let r = 0; r < e; r++) this.txs[r].toBw(t);
return t;
}
hash() {
return L.sha256Sha256(this.blockHeader.toBuffer());
}
async asyncHash() {
return (await T.asyncObjectMethod(this, "hash", [])).resbuf;
}
id() {
return new w(this.hash()).readReverse().toString("hex");
}
async asyncId() {
const t = await T.asyncObjectMethod(this, "id", []);
return JSON.parse(t.resbuf.toString());
}
verifyMerkleRoot() {
const t = this.txs.map((t) => t.toBuffer()),
e = St.fromBuffers(t).hash();
return xt.compare(e, this.blockHeader.merkleRootBuf);
}
static iterateTxs(t) {
const e = new w(t),
r = new vt().fromBr(e),
i = new Bt(e.readVarIntBuf()),
n = i.toNumber();
return {
blockHeader: r,
txsVi: i,
txsNum: n,
*[Symbol.iterator]() {
for (let t = 0; t < n; t++) yield new Nt().fromBr(e);
},
};
}
}
Mt.MAX_BLOCK_SIZE = 1e6;
var Tt = r(8764).Buffer;
class Ct extends O {
constructor(
t,
e,
r,
i = [],
n = [],
s = 0,
o = 0,
a = 0,
h = [],
f = "",
u = Ct.defaultFlags,
c = new b(0)
) {
super({
script: t,
tx: e,
nIn: r,
stack: i,
altStack: n,
pc: s,
pBeginCodeHash: o,
nOpCount: a,
ifStack: h,
errStr: f,
flags: u,
valueBn: c,
});
}
initialize() {
return (
(this.script = new st()),
(this.stack = []),
(this.altStack = []),
(this.pc = 0),
(this.pBeginCodeHash = 0),
(this.nOpCount = 0),
(this.ifStack = []),
(this.errStr = ""),
(this.flags = Ct.defaultFlags),
this
);
}
fromJSON(t) {
return (
this.fromJSONNoTx(t),
(this.tx = t.tx ? new Nt().fromJSON(t.tx) : void 0),
this
);
}
fromJSONNoTx(t) {
return (
this.fromObject({
script:
void 0 !== t.script ? new st().fromJSON(t.script) : void 0,
nIn: t.nIn,
}),
(this.stack = []),
t.stack.forEach(
function(t) {
this.stack.push(Tt.from(t, "hex"));
}.bind(this)
),
(this.altStack = []),
t.altStack.forEach(
function(t) {
this.altStack.push(Tt.from(t, "hex"));
}.bind(this)
),
this.fromObject({
pc: t.pc,
pBeginCodeHash: t.pBeginCodeHash,
nOpCount: t.nOpCount,
ifStack: t.ifStack,
errStr: t.errStr,
flags: t.flags,
}),
this
);
}
fromBr(t) {
let e = t.readVarIntNum(),
r = t.read(e);
this.fromJSONNoTx(JSON.parse(r.toString()));
let i = t.readVarIntNum();
if (i > 0) {
let e = t.read(i);
this.tx = new Nt().fromFastBuffer(e);
}
return this;
}
toJSON() {
let t = this.toJSONNoTx();
return (t.tx = this.tx ? this.tx.toJSON() : void 0), t;
}
toJSONNoTx() {
let t = [];
this.stack.forEach(function(e) {
t.push(e.toString("hex"));
});
let e = [];
return (
this.altStack.forEach(function(t) {
e.push(t.toString("hex"));
}),
{
script: this.script ? this.script.toJSON() : void 0,
nIn: this.nIn,
stack: t,
altStack: e,
pc: this.pc,
pBeginCodeHash: this.pBeginCodeHash,
nOpCount: this.nOpCount,
ifStack: this.ifStack,
errStr: this.errStr,
flags: this.flags,
}
);
}
toBw(t) {
t || (t = new _());
let e = Tt.from(JSON.stringify(this.toJSONNoTx()));
if ((t.writeVarIntNum(e.length), t.write(e), this.tx)) {
let e = this.tx.toFastBuffer();
t.writeVarIntNum(e.length), t.write(e);
} else t.writeVarIntNum(0);
return t;
}
static getFlags(t) {
let e = 0;
return (
-1 !== t.indexOf("NONE") && (e |= Ct.SCRIPT_VERIFY_NONE),
-1 !== t.indexOf("P2SH") && (e |= Ct.SCRIPT_VERIFY_P2SH),
-1 !== t.indexOf("STRICTENC") &&
(e |= Ct.SCRIPT_VERIFY_STRICTENC),
-1 !== t.indexOf("DERSIG") && (e |= Ct.SCRIPT_VERIFY_DERSIG),
-1 !== t.indexOf("LOW_S") && (e |= Ct.SCRIPT_VERIFY_LOW_S),
-1 !== t.indexOf("NULLDUMMY") &&
(e |= Ct.SCRIPT_VERIFY_NULLDUMMY),
-1 !== t.indexOf("SIGPUSHONLY") &&
(e |= Ct.SCRIPT_VERIFY_SIGPUSHONLY),
-1 !== t.indexOf("MINIMALDATA") &&
(e |= Ct.SCRIPT_VERIFY_MINIMALDATA),
-1 !== t.indexOf("DISCOURAGE_UPGRADABLE_NOPS") &&
(e |= Ct.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS),
-1 !== t.indexOf("CLEANSTACK") &&
(e |= Ct.SCRIPT_VERIFY_CLEANSTACK),
-1 !== t.indexOf("CHECKLOCKTIMEVERIFY") &&
(e |= Ct.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY),
-1 !== t.indexOf("CHECKSEQUENCEVERIFY") &&
(e |= Ct.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY),
-1 !== t.indexOf("SIGHASH_FORKID") &&
(e |= Ct.SCRIPT_ENABLE_SIGHASH_FORKID),
e
);
}
static castToBool(t) {
for (let e = 0; e < t.length; e++)
if (0 !== t[e]) return e !== t.length - 1 || 128 !== t[e];
return !1;
}
checkSigEncoding(t) {
if (0 === t.length) return !0;
if (
0 !=
(this.flags &
(Ct.SCRIPT_VERIFY_DERSIG |
Ct.SCRIPT_VERIFY_LOW_S |
Ct.SCRIPT_VERIFY_STRICTENC)) &&
!it.IsTxDer(t)
)
return (this.errStr = "SCRIPT_ERR_SIG_DER"), !1;
if (0 != (this.flags & Ct.SCRIPT_VERIFY_LOW_S)) {
if (!new it().fromTxFormat(t).hasLowS())
return (this.errStr = "SCRIPT_ERR_SIG_DER"), !1;
} else if (
0 != (this.flags & Ct.SCRIPT_VERIFY_STRICTENC) &&
!new it().fromTxFormat(t).hasDefinedHashType()
)
return (this.errStr = "SCRIPT_ERR_SIG_HASHTYPE"), !1;
return !0;
}
checkPubKeyEncoding(t) {
return !(
0 != (this.flags & Ct.SCRIPT_VERIFY_STRICTENC) &&
!X.isCompressedOrUncompressed(t) &&
((this.errStr = "SCRIPT_ERR_PUBKEYTYPE"), 1)
);
}
checkLockTime(t) {
return (
((this.tx.nLockTime < Ct.LOCKTIME_THRESHOLD &&
t < Ct.LOCKTIME_THRESHOLD) ||
(this.tx.nLockTime >= Ct.LOCKTIME_THRESHOLD &&
t >= Ct.LOCKTIME_THRESHOLD)) &&
!(t > this.tx.nLockTime) &&
Pt.SEQUENCE_FINAL !== this.tx.txIns[this.nIn].nSequence
);
}
checkSequence(t) {
let e = this.tx.txIns[this.nIn].nSequence;
if (this.tx.versionBytesNum < 2) return !1;
if (e & Pt.SEQUENCE_LOCKTIME_DISABLE_FLAG) return !1;
let r =
Pt.SEQUENCE_LOCKTIME_TYPE_FLAG | Pt.SEQUENCE_LOCKTIME_MASK,
i = e & r,
n = t & r;
return (
((i < Pt.SEQUENCE_LOCKTIME_TYPE_FLAG &&
n < Pt.SEQUENCE_LOCKTIME_TYPE_FLAG) ||
(i >= Pt.SEQUENCE_LOCKTIME_TYPE_FLAG &&
n >= Pt.SEQUENCE_LOCKTIME_TYPE_FLAG)) &&
!(n > i)
);
}
*eval() {
this.script.toBuffer().length > 1e4 &&
((this.errStr = "SCRIPT_ERR_SCRIPT_SIZE"), yield !1);
try {
for (; this.pc < this.script.chunks.length; ) {
let t = this.step();
t ? yield t : yield !1;
}
this.stack.length + this.altStack.length > 1e3 &&
((this.errStr = "SCRIPT_ERR_STACK_SIZE"), yield !1);
} catch (t) {
(this.errStr = "SCRIPT_ERR_UNKNOWN_ERROR: " + t), yield !1;
}
this.ifStack.length > 0 &&
((this.errStr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL"), yield !1),
yield !0;
}
step() {
let t = 0 != (this.flags & Ct.SCRIPT_VERIFY_MINIMALDATA),
e = !(this.ifStack.indexOf(!1) + 1),
r = this.script.chunks[this.pc];
this.pc++;
let i = r.opCodeNum;
if (void 0 === i)
return (this.errStr = "SCRIPT_ERR_BAD_OPCODE"), !1;
if (r.buf && r.buf.length > Ct.MAX_SCRIPT_ELEMENT_SIZE)
return (this.errStr = "SCRIPT_ERR_PUSH_SIZE"), !1;
if (i > z.OP_16 && ++this.nOpCount > 201)
return (this.errStr = "SCRIPT_ERR_OP_COUNT"), !1;
if (
i === z.OP_LEFT ||
i === z.OP_RIGHT ||
i === z.OP_2MUL ||
i === z.OP_2DIV
)
return (this.errStr = "SCRIPT_ERR_DISABLED_OPCODE"), !1;
if (e && i >= 0 && i <= z.OP_PUSHDATA4) {
if (t && !this.script.checkMinimalPush(this.pc - 1))
return (this.errStr = "SCRIPT_ERR_MINIMALDATA"), !1;
if (r.buf) {
if (r.len !== r.buf.length)
throw new Error(
"LEngth of push value not equal to length of data"
);
this.stack.push(r.buf);
} else this.stack.push(Ct.false);
} else if (e || (z.OP_IF <= i && i <= z.OP_ENDIF))
switch (i) {
case z.OP_1NEGATE:
case z.OP_1:
case z.OP_2:
case z.OP_3:
case z.OP_4:
case z.OP_5:
case z.OP_6:
case z.OP_7:
case z.OP_8:
case z.OP_9:
case z.OP_10:
case z.OP_11:
case z.OP_12:
case z.OP_13:
case z.OP_14:
case z.OP_15:
case z.OP_16:
{
let t = new b(i - (z.OP_1 - 1)).toScriptNumBuffer();
this.stack.push(t);
}
break;
case z.OP_NOP:
break;
case z.OP_CHECKLOCKTIMEVERIFY:
{
if (
!(this.flags & Ct.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY)
) {
if (
this.flags &
Ct.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS
)
return (
(this.errStr =
"SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS"),
!1
);
break;
}
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let e = this.stack[this.stack.length - 1],
r = new b().fromScriptNumBuffer(e, t, 5).toNumber();
if (r < 0)
return (
(this.errStr = "SCRIPT_ERR_NEGATIVE_LOCKTIME"), !1
);
if (!this.checkLockTime(r))
return (
(this.errStr = "SCRIPT_ERR_UNSATISFIED_LOCKTIME"), !1
);
}
break;
case z.OP_CHECKSEQUENCEVERIFY:
{
if (
!(this.flags & Ct.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY)
) {
if (
this.flags &
Ct.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS
)
return (
(this.errStr =
"SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS"),
!1
);
break;
}
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let e = this.stack[this.stack.length - 1],
r = new b().fromScriptNumBuffer(e, t, 5).toNumber();
if (r < 0)
return (
(this.errStr = "SCRIPT_ERR_NEGATIVE_LOCKTIME"), !1
);
if (0 != (r & Pt.SEQUENCE_LOCKTIME_DISABLE_FLAG)) break;
if (!this.checkSequence(r))
return (
(this.errStr = "SCRIPT_ERR_UNSATISFIED_LOCKTIME"), !1
);
}
break;
case z.OP_NOP1:
case z.OP_NOP3:
case z.OP_NOP4:
case z.OP_NOP5:
case z.OP_NOP6:
case z.OP_NOP7:
case z.OP_NOP8:
case z.OP_NOP9:
case z.OP_NOP10:
if (
this.flags & Ct.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS
)
return (
(this.errStr = "SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS"),
!1
);
break;
case z.OP_IF:
case z.OP_NOTIF:
{
let t = !1;
if (e) {
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL"),
!1
);
let e = this.stack.pop();
(t = Ct.castToBool(e)), i === z.OP_NOTIF && (t = !t);
}
this.ifStack.push(t);
}
break;
case z.OP_ELSE:
if (0 === this.ifStack.length)
return (
(this.errStr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL"), !1
);
this.ifStack[this.ifStack.length - 1] = !this.ifStack[
this.ifStack.length - 1
];
break;
case z.OP_ENDIF:
if (0 === this.ifStack.length)
return (
(this.errStr = "SCRIPT_ERR_UNBALANCED_CONDITIONAL"), !1
);
this.ifStack.pop();
break;
case z.OP_VERIFY:
{
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 1];
if (!Ct.castToBool(t))
return (this.errStr = "SCRIPT_ERR_VERIFY"), !1;
this.stack.pop();
}
break;
case z.OP_RETURN:
return (this.errStr = "SCRIPT_ERR_OP_RETURN"), !1;
case z.OP_TOALTSTACK:
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.altStack.push(this.stack.pop());
break;
case z.OP_FROMALTSTACK:
if (this.altStack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_ALTSTACK_OPERATION"),
!1
);
this.stack.push(this.altStack.pop());
break;
case z.OP_2DROP:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.stack.pop(), this.stack.pop();
break;
case z.OP_2DUP:
{
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 2],
e = this.stack[this.stack.length - 1];
this.stack.push(t), this.stack.push(e);
}
break;
case z.OP_3DUP:
{
if (this.stack.length < 3)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 3],
e = this.stack[this.stack.length - 2],
r = this.stack[this.stack.length - 1];
this.stack.push(t),
this.stack.push(e),
this.stack.push(r);
}
break;
case z.OP_2OVER:
{
if (this.stack.length < 4)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 4],
e = this.stack[this.stack.length - 3];
this.stack.push(t), this.stack.push(e);
}
break;
case z.OP_2ROT:
{
if (this.stack.length < 6)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack.splice(this.stack.length - 6, 2);
this.stack.push(t[0]), this.stack.push(t[1]);
}
break;
case z.OP_2SWAP:
{
if (this.stack.length < 4)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack.splice(this.stack.length - 4, 2);
this.stack.push(t[0]), this.stack.push(t[1]);
}
break;
case z.OP_IFDUP:
{
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 1];
Ct.castToBool(t) && this.stack.push(t);
}
break;
case z.OP_DEPTH:
{
let t = new b(this.stack.length).toScriptNumBuffer();
this.stack.push(t);
}
break;
case z.OP_DROP:
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.stack.pop();
break;
case z.OP_DUP:
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.stack.push(this.stack[this.stack.length - 1]);
break;
case z.OP_NIP:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.stack.splice(this.stack.length - 2, 1);
break;
case z.OP_OVER:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.stack.push(this.stack[this.stack.length - 2]);
break;
case z.OP_PICK:
case z.OP_ROLL:
{
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let e = this.stack[this.stack.length - 1],
r = new b().fromScriptNumBuffer(e, t).toNumber();
if ((this.stack.pop(), r < 0 || r >= this.stack.length))
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
(e = this.stack[this.stack.length - r - 1]),
i === z.OP_ROLL &&
this.stack.splice(this.stack.length - r - 1, 1),
this.stack.push(e);
}
break;
case z.OP_ROT:
{
if (this.stack.length < 3)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 3],
e = this.stack[this.stack.length - 2],
r = this.stack[this.stack.length - 1];
(this.stack[this.stack.length - 3] = e),
(this.stack[this.stack.length - 2] = r),
(this.stack[this.stack.length - 1] = t);
}
break;
case z.OP_SWAP:
{
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 2],
e = this.stack[this.stack.length - 1];
(this.stack[this.stack.length - 2] = e),
(this.stack[this.stack.length - 1] = t);
}
break;
case z.OP_TUCK:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
this.stack.splice(
this.stack.length - 2,
0,
this.stack[this.stack.length - 1]
);
break;
case z.OP_SIZE:
{
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = new b(this.stack[this.stack.length - 1].length);
this.stack.push(t.toScriptNumBuffer());
}
break;
case z.OP_OR:
case z.OP_AND:
case z.OP_XOR:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
let r = this.stack[this.stack.length - 2],
n = this.stack[this.stack.length - 1];
if (r.length != n.length)
return (
(this.errStr = "SCRIPT_ERR_INVALID_OPERAND_SIZE"), !1
);
switch (i) {
case z.OP_AND:
for (let t = 0; t < r.length; t++) r[t] &= n[t];
break;
case z.OP_OR:
for (let t = 0; t < r.length; t++) r[t] |= n[t];
break;
case z.OP_XOR:
for (let t = 0; t < r.length; t++) r[t] ^= n[t];
}
this.stack.pop();
break;
case z.OP_INVERT:
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
let s = this.stack[this.stack.length - 1];
for (let t = 0; t < s.length; t++) s[t] = ~s[t];
break;
case z.OP_LSHIFT:
case z.OP_RSHIFT: {
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
let e = this.stack[this.stack.length - 2],
r = new b(e),
n = new b()
.fromScriptNumBuffer(
this.stack[this.stack.length - 1],
t
)
.toNumber();
if (n < 0)
return (
(this.errStr = "SCRIPT_ERR_INVALID_NUMBER_RANGE"), !1
);
switch ((this.stack.pop(), this.stack.pop(), i)) {
case z.OP_LSHIFT:
r = r.ushln(n);
break;
case z.OP_RSHIFT:
r = r.ushrn(n);
}
let s = r.toBuffer().slice(-e.length);
s.length < e.length &&
(s = Tt.concat([Tt.alloc(e.length - s.length), s])),
this.stack.push(s);
break;
}
case z.OP_EQUAL:
case z.OP_EQUALVERIFY:
{
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t = this.stack[this.stack.length - 2],
e = this.stack[this.stack.length - 1],
r = R(t, e);
if (
(this.stack.pop(),
this.stack.pop(),
this.stack.push(r ? Ct.true : Ct.false),
i === z.OP_EQUALVERIFY)
) {
if (!r)
return (this.errStr = "SCRIPT_ERR_EQUALVERIFY"), !1;
this.stack.pop();
}
}
break;
case z.OP_1ADD:
case z.OP_1SUB:
case z.OP_NEGATE:
case z.OP_ABS:
case z.OP_NOT:
case z.OP_0NOTEQUAL:
{
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let e = this.stack[this.stack.length - 1],
r = new b().fromScriptNumBuffer(e, t);
switch (i) {
case z.OP_1ADD:
r = r.add(1);
break;
case z.OP_1SUB:
r = r.sub(1);
break;
case z.OP_NEGATE:
r = r.neg();
break;
case z.OP_ABS:
r.lt(0) && (r = r.neg());
break;
case z.OP_NOT:
r = new b(r.eq(0) + 0);
break;
case z.OP_0NOTEQUAL:
r = new b(r.neq(0) + 0);
}
this.stack.pop(), this.stack.push(r.toScriptNumBuffer());
}
break;
case z.OP_ADD:
case z.OP_SUB:
case z.OP_MUL:
case z.OP_DIV:
case z.OP_MOD:
case z.OP_BOOLAND:
case z.OP_BOOLOR:
case z.OP_NUMEQUAL:
case z.OP_NUMEQUALVERIFY:
case z.OP_NUMNOTEQUAL:
case z.OP_LESSTHAN:
case z.OP_GREATERTHAN:
case z.OP_LESSTHANOREQUAL:
case z.OP_GREATERTHANOREQUAL:
case z.OP_MIN:
case z.OP_MAX:
{
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let e = new b().fromScriptNumBuffer(
this.stack[this.stack.length - 2],
t
),
r = new b().fromScriptNumBuffer(
this.stack[this.stack.length - 1],
t
),
n = new b(0);
switch (i) {
case z.OP_ADD:
n = e.add(r);
break;
case z.OP_SUB:
n = e.sub(r);
break;
case z.OP_MUL:
n = e.mul(r);
break;
case z.OP_DIV:
if (0 == r)
return (this.errStr = "SCRIPT_ERR_DIV_BY_ZERO"), !1;
n = e.div(r);
break;
case z.OP_MOD:
if (0 == r)
return (this.errStr = "SCRIPT_ERR_DIV_BY_ZERO"), !1;
n = e.mod(r);
break;
case z.OP_BOOLAND:
n = new b((e.neq(0) && r.neq(0)) + 0);
break;
case z.OP_BOOLOR:
n = new b((e.neq(0) || r.neq(0)) + 0);
break;
case z.OP_NUMEQUAL:
case z.OP_NUMEQUALVERIFY:
n = new b(e.eq(r) + 0);
break;
case z.OP_NUMNOTEQUAL:
n = new b(e.neq(r) + 0);
break;
case z.OP_LESSTHAN:
n = new b(e.lt(r) + 0);
break;
case z.OP_GREATERTHAN:
n = new b(e.gt(r) + 0);
break;
case z.OP_LESSTHANOREQUAL:
n = new b(e.leq(r) + 0);
break;
case z.OP_GREATERTHANOREQUAL:
n = new b(e.geq(r) + 0);
break;
case z.OP_MIN:
n = e.lt(r) ? e : r;
break;
case z.OP_MAX:
n = e.gt(r) ? e : r;
}
if (
(this.stack.pop(),
this.stack.pop(),
this.stack.push(n.toScriptNumBuffer()),
i === z.OP_NUMEQUALVERIFY)
) {
if (!Ct.castToBool(this.stack[this.stack.length - 1]))
return (
(this.errStr = "SCRIPT_ERR_NUMEQUALVERIFY"), !1
);
this.stack.pop();
}
}
break;
case z.OP_WITHIN:
{
if (this.stack.length < 3)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let e = new b().fromScriptNumBuffer(
this.stack[this.stack.length - 3],
t
),
r = new b().fromScriptNumBuffer(
this.stack[this.stack.length - 2],
t
),
i = new b().fromScriptNumBuffer(
this.stack[this.stack.length - 1],
t
),
n = r.leq(e) && e.lt(i);
this.stack.pop(),
this.stack.pop(),
this.stack.pop(),
this.stack.push(n ? Ct.true : Ct.false);
}
break;
case z.OP_RIPEMD160:
case z.OP_SHA1:
case z.OP_SHA256:
case z.OP_HASH160:
case z.OP_HASH256:
{
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t,
e = this.stack[this.stack.length - 1];
i === z.OP_RIPEMD160
? (t = L.ripemd160(e))
: i === z.OP_SHA1
? (t = L.sha1(e))
: i === z.OP_SHA256
? (t = L.sha256(e))
: i === z.OP_HASH160
? (t = L.sha256Ripemd160(e))
: i === z.OP_HASH256 && (t = L.sha256Sha256(e)),
this.stack.pop(),
this.stack.push(t);
}
break;
case z.OP_CODESEPARATOR:
this.pBeginCodeHash = this.pc;
break;
case z.OP_CHECKSIG:
case z.OP_CHECKSIGVERIFY:
{
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let t,
e = this.stack[this.stack.length - 2],
r = this.stack[this.stack.length - 1],
n = new st().fromObject({
chunks: this.script.chunks.slice(this.pBeginCodeHash),
});
if (
(e.length > 0 ? e.readUInt8(e.length - 1) : 0) &
it.SIGHASH_FORKID
) {
if (!(this.flags & Ct.SCRIPT_ENABLE_SIGHASH_FORKID))
return (
(this.errStr = "SCRIPT_ERR_ILLEGAL_FORKID"), !1
);
} else n.findAndDelete(new st().writeBuffer(e));
if (
!this.checkSigEncoding(e) ||
!this.checkPubKeyEncoding(r)
)
return !1;
try {
let i = new it().fromTxFormat(e),
s = new X().fromBuffer(r, !1);
t = this.tx.verify(
i,
s,
this.nIn,
n,
Boolean(this.flags & Ct.SCRIPT_VERIFY_LOW_S),
this.valueBn,
this.flags
);
} catch (e) {
t = !1;
}
if (
(this.stack.pop(),
this.stack.pop(),
this.stack.push(t ? Ct.true : Ct.false),
i === z.OP_CHECKSIGVERIFY)
) {
if (!t)
return (
(this.errStr = "SCRIPT_ERR_CHECKSIGVERIFY"), !1
);
this.stack.pop();
}
}
break;
case z.OP_CHECKMULTISIG:
case z.OP_CHECKMULTISIGVERIFY:
{
let e = 1;
if (this.stack.length < e)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let r = new b()
.fromScriptNumBuffer(
this.stack[this.stack.length - e],
t
)
.toNumber();
if (r < 0 || r > 20)
return (this.errStr = "SCRIPT_ERR_PUBKEY_COUNT"), !1;
if (((this.nOpCount += r), this.nOpCount > 201))
return (this.errStr = "SCRIPT_ERR_OP_COUNT"), !1;
let n = ++e;
if (((e += r), this.stack.length < e))
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let s = new b()
.fromScriptNumBuffer(
this.stack[this.stack.length - e],
t
)
.toNumber();
if (s < 0 || s > r)
return (this.errStr = "SCRIPT_ERR_SIG_COUNT"), !1;
let o = ++e;
if (((e += s), this.stack.length < e))
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
let a = new st().fromObject({
chunks: this.script.chunks.slice(this.pBeginCodeHash),
});
for (let t = 0; t < s; t++) {
let e = this.stack[this.stack.length - o - t];
if (
(e.length > 0 ? e.readUInt8(e.length - 1) : 0) &
it.SIGHASH_FORKID
) {
if (!(this.flags & Ct.SCRIPT_ENABLE_SIGHASH_FORKID))
return (
(this.errStr = "SCRIPT_ERR_ILLEGAL_FORKID"), !1
);
} else a.findAndDelete(new st().writeBuffer(e));
}
let h = !0;
for (; h && s > 0; ) {
let t,
e = this.stack[this.stack.length - o],
i = this.stack[this.stack.length - n];
if (
!this.checkSigEncoding(e) ||
!this.checkPubKeyEncoding(i)
)
return !1;
try {
let r = new it().fromTxFormat(e),
n = new X().fromBuffer(i, !1);
t = this.tx.verify(
r,
n,
this.nIn,
a,
Boolean(this.flags & Ct.SCRIPT_VERIFY_LOW_S),
this.valueBn,
this.flags
);
} catch (e) {
t = !1;
}
t && (o++, s--), n++, r--, s > r && (h = !1);
}
for (; e-- > 1; ) this.stack.pop();
if (this.stack.length < 1)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"),
!1
);
if (
this.flags & Ct.SCRIPT_VERIFY_NULLDUMMY &&
this.stack[this.stack.length - 1].length
)
return (this.errStr = "SCRIPT_ERR_SIG_NULLDUMMY"), !1;
if (
(this.stack.pop(),
this.stack.push(h ? Ct.true : Ct.false),
i === z.OP_CHECKMULTISIGVERIFY)
) {
if (!h)
return (
(this.errStr = "SCRIPT_ERR_CHECKMULTISIGVERIFY"), !1
);
this.stack.pop();
}
}
break;
case z.OP_CAT:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
let o = this.stack[this.stack.length - 2],
a = this.stack[this.stack.length - 1];
(this.stack[this.stack.length - 2] = Tt.concat([o, a])),
this.stack.pop();
break;
case z.OP_SPLIT:
if (this.stack.length < 2)
return (
(this.errStr = "SCRIPT_ERR_INVALID_STACK_OPERATION"), !1
);
let h = this.stack[this.stack.length - 2],
f = new b().fromScriptNumBuffer(
this.stack[this.stack.length - 1],
t
);
if (f.lt(0) || f.gt(h.length))
return (
(this.errStr = "SCRIPT_ERR_INVALID_SPLIT_RANGE"), !1
);
let u = h.slice(0, f),
c = h.slice(f);
this.stack.pop(),
this.stack.pop(),
this.stack.push(u),
this.stack.push(c);
break;
default:
return (this.errStr = "SCRIPT_ERR_BAD_OPCODE"), !1;
}
return !0;
}
verify(t, e, r, i, n, s) {
let o = this.results(t, e, r, i, n, s);
for (let t of o) if (!t) return !1;
return !0;
}
*results(t, e, r, i, n, s) {
let o;
this.fromObject({
script: t,
tx: r,
nIn: i,
flags: n,
valueBn: s,
}),
0 == (n & Ct.SCRIPT_VERIFY_SIGPUSHONLY) ||
t.isPushOnly() ||
((this.errStr = this.errStr || "SCRIPT_ERR_SIG_PUSHONLY"),
yield !1),
yield* this.eval(),
n & Ct.SCRIPT_VERIFY_P2SH && (o = this.stack.slice());
let a = this.stack;
this.initialize(),
this.fromObject({
script: e,
stack: a,
tx: r,
nIn: i,
flags: n,
valueBn: s,
}),
yield* this.eval(),
0 === this.stack.length &&
((this.errStr = this.errStr || "SCRIPT_ERR_EVAL_FALSE"),
yield !1);
let h = this.stack[this.stack.length - 1];
if (
(Ct.castToBool(h) ||
((this.errStr = this.errStr || "SCRIPT_ERR_EVAL_FALSE"),
yield !1),
n & Ct.SCRIPT_VERIFY_P2SH && e.isScriptHashOut())
) {
t.isPushOnly() ||
((this.errStr = this.errStr || "SCRIPT_ERR_SIG_PUSHONLY"),
yield !1);
let e = a;
if (((a = o), (o = e), 0 === a.length))
throw new Error("internal error - stack copy empty");
let h = a[a.length - 1],
f = new st().fromBuffer(h);
a.pop(),
this.initialize(),
this.fromObject({
script: f,
stack: a,
tx: r,
nIn: i,
flags: n,
valueBn: s,
}),
yield* this.eval(),
0 === a.length &&
((this.errStr = this.errStr || "SCRIPT_ERR_EVAL_FALSE"),
yield !1),
Ct.castToBool(a[a.length - 1])
? yield !0
: ((this.errStr = this.errStr || "SCRIPT_ERR_EVAL_FALSE"),
yield !1);
}
if (0 != (n & Ct.SCRIPT_VERIFY_CLEANSTACK)) {
if (!(n & Ct.SCRIPT_VERIFY_P2SH))
throw new Error("cannot use CLEANSTACK without P2SH");
1 !== a.length &&
((this.errStr = this.errStr || "SCRIPT_ERR_CLEANSTACK"),
yield !1);
}
yield !0;
}
getDebugObject() {
let t = this.pc - 1;
return {
errStr: this.errStr,
scriptStr: this.script
? this.script.toString()
: "no script found",
pc: t,
stack: this.stack.map((t) => t.toString("hex")),
altStack: this.altStack.map((t) => t.toString("hex")),
opCodeStr: this.script
? z.fromNumber(this.script.chunks[t].opCodeNum).toString()
: "no script found",
};
}
getDebugString() {
return JSON.stringify(this.getDebugObject(), null, 2);
}
}
(Ct.true = Tt.from([1])),
(Ct.false = Tt.from([])),
(Ct.MAX_SCRIPT_ELEMENT_SIZE = 520),
(Ct.LOCKTIME_THRESHOLD = 5e8),
(Ct.SCRIPT_VERIFY_NONE = 0),
(Ct.SCRIPT_VERIFY_P2SH = 1),
(Ct.SCRIPT_VERIFY_STRICTENC = 2),
(Ct.SCRIPT_VERIFY_DERSIG = 4),
(Ct.SCRIPT_VERIFY_LOW_S = 8),
(Ct.SCRIPT_VERIFY_NULLDUMMY = 16),
(Ct.SCRIPT_VERIFY_SIGPUSHONLY = 32),
(Ct.SCRIPT_VERIFY_MINIMALDATA = 64),
(Ct.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 128),
(Ct.SCRIPT_VERIFY_CLEANSTACK = 256),
(Ct.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY = 512),
(Ct.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY = 1024),
(Ct.SCRIPT_ENABLE_SIGHASH_FORKID = 65536),
(Ct.defaultFlags =
Ct.SCRIPT_VERIFY_P2SH | Ct.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY);
class Lt extends O {
constructor(t = new Map()) {
super({ map: t });
}
toJSON() {
const t = {};
return (
this.map.forEach((e, r) => {
t[r] = e.map((t) => ({
nScriptChunk: t.nScriptChunk,
type: t.type,
addressStr: t.addressStr,
nHashType: t.nHashType,
log: t.log,
}));
}),
t
);
}
fromJSON(t) {
return (
Object.keys(t).forEach((e) => {
this.map.set(
e,
t[e].map((t) => ({
nScriptChunk: t.nScriptChunk,
type: t.type,
addressStr: t.addressStr,
nHashType: t.nHashType,
log: t.log,
}))
);
}),
this
);
}
setOne(
t,
e,
r,
i = "sig",
n,
s = it.SIGHASH_ALL | it.SIGHASH_FORKID
) {
const o = t.toString("hex") + ":" + e,
a = { nScriptChunk: r, type: i, addressStr: n, nHashType: s };
return this.map.set(o, [a]), this;
}
setMany(t, e, r) {
const i = t.toString("hex") + ":" + e;
return (
(r = r.map((t) => ({
type: t.type || "sig",
nHashType: t.nHashType || it.SIGHASH_ALL | it.SIGHASH_FORKID,
...t,
}))),
this.map.set(i, r),
this
);
}
addOne(
t,
e,
r,
i = "sig",
n,
s = it.SIGHASH_ALL | it.SIGHASH_FORKID
) {
const o = this.get(t, e) || [];
return (
o.push({
nScriptChunk: r,
type: i,
addressStr: n,
nHashType: s,
}),
this.setMany(t, e, o),
this
);
}
get(t, e) {
const r = t.toString("hex") + ":" + e;
return this.map.get(r) || [];
}
}
class Ht extends O {
constructor(t = new Map()) {
super({ map: t });
}
toJSON() {
const t = {};
return (
this.map.forEach((e, r) => {
t[r] = e.toHex();
}),
t
);
}
fromJSON(t) {
return (
Object.keys(t).forEach((e) => {
this.map.set(e, Rt.fromHex(t[e]));
}),
this
);
}
set(t, e, r) {
const i = t.toString("hex") + ":" + e;
return this.map.set(i, r), this;
}
get(t, e) {
const r = t.toString("hex") + ":" + e;
return this.map.get(r);
}
setTx(t) {
const e = t.hash().toString("hex");
return (
t.txOuts.forEach((t, r) => {
const i = e + ":" + r;
this.map.set(i, t);
}),
this
);
}
}
var Ut = r(8764).Buffer;
const Ft = V.Default.TxBuilder;
class Kt extends O {
constructor(
t = new Nt(),
e = [],
r = [],
i = new Ht(),
n = new Lt(),
s,
o,
a,
h = Ft.feePerKbNum,
f = 0,
u = 1,
c = 1,
d = Ft.dust,
l = !1,
p = new It()
) {
super({
tx: t,
txIns: e,
txOuts: r,
uTxOutMap: i,
sigOperations: n,
changeScript: s,
changeAmountBn: o,
feeAmountBn: a,
feePerKbNum: h,
nLockTime: f,
versionBytesNum: u,
sigsPerInput: c,
dust: d,
dustChangeToFees: l,
hashCache: p,
});
}
toJSON() {
const t = {};
return (
(t.tx = this.tx.toHex()),
(t.txIns = this.txIns.map((t) => t.toHex())),
(t.txOuts = this.txOuts.map((t) => t.toHex())),
(t.uTxOutMap = this.uTxOutMap.toJSON()),
(t.sigOperations = this.sigOperations.toJSON()),
(t.changeScript = this.changeScript
? this.changeScript.toHex()
: void 0),
(t.changeAmountBn = this.changeAmountBn
? this.changeAmountBn.toNumber()
: void 0),
(t.feeAmountBn = this.feeAmountBn
? this.feeAmountBn.toNumber()
: void 0),
(t.feePerKbNum = this.feePerKbNum),
(t.sigsPerInput = this.sigsPerInput),
(t.dust = this.dust),
(t.dustChangeToFees = this.dustChangeToFees),
(t.hashCache = this.hashCache.toJSON()),
t
);
}
fromJSON(t) {
return (
(this.tx = new Nt().fromHex(t.tx)),
(this.txIns = t.txIns.map((t) => Pt.fromHex(t))),
(this.txOuts = t.txOuts.map((t) => Rt.fromHex(t))),
(this.uTxOutMap = new Ht().fromJSON(t.uTxOutMap)),
(this.sigOperations = new Lt().fromJSON(t.sigOperations)),
(this.changeScript = t.changeScript
? new st().fromHex(t.changeScript)
: void 0),
(this.changeAmountBn = t.changeAmountBn
? new b(t.changeAmountBn)
: void 0),
(this.feeAmountBn = t.feeAmountBn
? new b(t.feeAmountBn)
: void 0),
(this.feePerKbNum = t.feePerKbNum || this.feePerKbNum),
(this.sigsPerInput = t.sigsPerInput || this.sigsPerInput),
(this.dust = t.dust || this.dust),
(this.dustChangeToFees =
t.dustChangeToFees || this.dustChangeToFees),
(this.hashCache = It.fromJSON(t.hashCache)),
this
);
}
setFeePerKbNum(t) {
if ("number" != typeof t || t < 0)
throw new Error("cannot set a fee of zero or less");
return (this.feePerKbNum = t), this;
}
setChangeAddress(t) {
return (this.changeScript = t.toTxOutScript()), this;
}
setChangeScript(t) {
return (this.changeScript = t), this;
}
setNLocktime(t) {
return (this.nLockTime = t), this;
}
setVersion(t) {
return (this.versionBytesNum = t), this;
}
setDust(t = Ft.dust) {
return (this.dust = t), this;
}
sendDustChangeToFees(t = !1) {
return (this.dustChangeToFees = t), this;
}
importPartiallySignedTx(
t,
e = this.uTxOutMap,
r = this.sigOperations
) {
return (
(this.tx = t),
(this.uTxOutMap = e),
(this.sigOperations = r),
this
);
}
inputFromScript(t, e, r, i, n) {
if (
!(
Ut.isBuffer(t) &&
"number" == typeof e &&
r instanceof Rt &&
i instanceof st
)
)
throw new Error(
"invalid one of: txHashBuf, txOutNum, txOut, script"
);
return (
this.txIns.push(Pt.fromProperties(t, e, i, n)),
this.uTxOutMap.set(t, e, r),
this
);
}
addSigOperation(t, e, r, i, n, s) {
return this.sigOperations.addOne(t, e, r, i, n, s), this;
}
inputFromPubKeyHash(t, e, r, i, n, s) {
if (!(Ut.isBuffer(t) && "number" == typeof e && r instanceof Rt))
throw new Error("invalid one of: txHashBuf, txOutNum, txOut");
this.txIns.push(
new Pt()
.fromObject({ nSequence: n })
.fromPubKeyHashTxOut(t, e, r, i)
),
this.uTxOutMap.set(t, e, r);
const o = at.fromTxOutScript(r.script).toString();
return (
this.addSigOperation(t, e, 0, "sig", o, s),
this.addSigOperation(t, e, 1, "pubKey", o),
this
);
}
outputToAddress(t, e) {
if (!(e instanceof at && t instanceof b))
throw new Error(
"addr must be an Address, and valueBn must be a Bn"
);
const r = new st().fromPubKeyHash(e.hashBuf);
return this.outputToScript(t, r), this;
}
outputToScript(t, e) {
if (!(e instanceof st && t instanceof b))
throw new Error(
"script must be a Script, and valueBn must be a Bn"
);
const r = Rt.fromProperties(t, e);
return this.txOuts.push(r), this;
}
buildOutputs() {
let t = new b(0);
return (
this.txOuts.forEach((e) => {
if (e.valueBn.lt(this.dust) && !e.script.isNonSpendable())
throw new Error("cannot create output lesser than dust");
(t = t.add(e.valueBn)), this.tx.addTxOut(e);
}),
t
);
}
buildInputs(t, e = 0) {
let r = new b(0);
for (const i of this.txIns) {
const n = this.uTxOutMap.get(i.txHashBuf, i.txOutNum);
if (((r = r.add(n.valueBn)), this.tx.addTxIn(i), r.geq(t))) {
if (e <= 0) break;
e--;
}
}
if (r.lt(t))
throw new Error(
"not enough funds for outputs: inAmountBn " +
r.toNumber() +
" outAmountBn " +
t.toNumber()
);
return r;
}
estimateSize() {
let t = this.tx.toBuffer().length;
return (
this.tx.txIns.forEach((e) => {
const { txHashBuf: r, txOutNum: i } = e;
this.sigOperations.get(r, i).forEach((r) => {
const { nScriptChunk: i, type: n } = r,
s = new st([e.script.chunks[i]]).toBuffer().length;
if (((t -= s), "sig" === n)) t += 72;
else {
if ("pubKey" !== r.type)
throw new Error("unsupported sig operations type");
t += 35;
}
});
}),
(t += 1),
Math.round(t)
);
}
estimateFee(t = new b(0)) {
return new b(
Math.ceil((this.estimateSize() / 1e3) * this.feePerKbNum)
).add(t);
}
build(t = { useAllInputs: !1 }) {
let e;
if (this.txIns.length <= 0)
throw Error(
"tx-builder number of inputs must be greater than 0"
);
if (!this.changeScript)
throw new Error(
"must specify change script to use build method"
);
for (
let r = t.useAllInputs ? this.txIns.length - 1 : 0;
r < this.txIns.length;
r++
) {
this.tx = new Nt();
const t = this.buildOutputs(),
i = Rt.fromProperties(new b(0), this.changeScript);
let n;
this.tx.addTxOut(i);
try {
n = this.buildInputs(t, r);
} catch (t) {
throw t.message.includes("not enough funds for outputs")
? new Error(
"unable to gather enough inputs for outputs and fee"
)
: t;
}
if (
((this.changeAmountBn = n.sub(t)),
(i.valueBn = this.changeAmountBn),
(e = this.estimateFee()),
this.changeAmountBn.geq(e) &&
this.changeAmountBn.sub(e).gt(this.dust))
)
break;
}
if (this.changeAmountBn.geq(e)) {
if (
((this.feeAmountBn = e),
(this.changeAmountBn = this.changeAmountBn.sub(
this.feeAmountBn
)),
(this.tx.txOuts[
this.tx.txOuts.length - 1
].valueBn = this.changeAmountBn),
this.changeAmountBn.lt(this.dust))
) {
if (!this.dustChangeToFees)
throw new Error(
"unable to create change amount greater than dust"
);
this.tx.txOuts.pop(),
(this.tx.txOutsVi = Bt.fromNumber(
this.tx.txOutsVi.toNumber() - 1
)),
(this.feeAmountBn = this.feeAmountBn.add(
this.changeAmountBn
)),
(this.changeAmountBn = new b(0));
}
if (
((this.tx.nLockTime = this.nLockTime),
(this.tx.versionBytesNum = this.versionBytesNum),
0 === this.tx.txOuts.length)
)
throw new Error(
"outputs length is zero - unable to create any outputs greater than dust"
);
return this;
}
throw new Error(
"unable to gather enough inputs for outputs and fee"
);
}
sort() {
return this.tx.sort(), this;
}
static allSigsPresent(t, e) {
let r = 0;
for (let t = 1; t < e.chunks.length - 1; t++)
e.chunks[t].buf && r++;
return r === t;
}
static removeBlankSigs(t) {
t = new st(t.chunks.slice());
for (let e = 1; e < t.chunks.length - 1; e++)
t.chunks[e].buf || t.chunks.splice(e, 1);
return t;
}
fillSig(t, e, r) {
const i = this.tx.txIns[t];
return (
(i.script.chunks[e] = new st().writeBuffer(
r.toTxFormat()
).chunks[0]),
(i.scriptVi = Bt.fromNumber(i.script.toBuffer().length)),
this
);
}
getSig(
t,
e = it.SIGHASH_ALL | it.SIGHASH_FORKID,
r,
i,
n = Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
let s;
if (
e & it.SIGHASH_FORKID &&
n & Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
const t = this.tx.txIns[r].txHashBuf,
e = this.tx.txIns[r].txOutNum,
i = this.uTxOutMap.get(t, e);
if (!i)
throw new Error("for SIGHASH_FORKID must provide UTXOs");
s = i.valueBn;
}
return this.tx.sign(t, e, r, i, s, n, this.hashCache);
}
asyncGetSig(
t,
e = it.SIGHASH_ALL | it.SIGHASH_FORKID,
r,
i,
n = Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
let s;
if (
e & it.SIGHASH_FORKID &&
n & Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
const t = this.tx.txIns[r].txHashBuf,
e = this.tx.txIns[r].txOutNum,
i = this.uTxOutMap.get(t, e);
if (!i)
throw new Error("for SIGHASH_FORKID must provide UTXOs");
s = i.valueBn;
}
return this.tx.asyncSign(t, e, r, i, s, n, this.hashCache);
}
signTxIn(
t,
e,
r,
i,
n = it.SIGHASH_ALL | it.SIGHASH_FORKID,
s = Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
const o = this.tx.txIns[t],
a = o.script;
if ((void 0 === i && a.isPubKeyHashIn() && (i = 0), void 0 === i))
throw new Error(
"cannot sign unknown script type for input " + t
);
const h = o.txHashBuf,
f = o.txOutNum;
r || (r = this.uTxOutMap.get(h, f));
const u = r.script,
c = this.getSig(e, n, t, u, s, this.hashCache);
return this.fillSig(t, i, c), this;
}
async asyncSignTxIn(
t,
e,
r,
i,
n = it.SIGHASH_ALL | it.SIGHASH_FORKID,
s = Nt.SCRIPT_ENABLE_SIGHASH_FORKID
) {
const o = this.tx.txIns[t],
a = o.script;
if ((void 0 === i && a.isPubKeyHashIn() && (i = 0), void 0 === i))
throw new Error(
"cannot sign unknown script type for input " + t
);
const h = o.txHashBuf,
f = o.txOutNum;
r || (r = this.uTxOutMap.get(h, f));
const u = r.script,
c = await this.asyncGetSig(e, n, t, u, s, this.hashCache);
return this.fillSig(t, i, c), this;
}
signWithKeyPairs(t) {
const e = {};
for (const r of t) e[at.fromPubKey(r.pubKey).toString()] = r;
for (const t in this.tx.txIns) {
const r = this.tx.txIns[t],
i = this.sigOperations.get(r.txHashBuf, r.txOutNum);
for (const n of i) {
const {
nScriptChunk: i,
type: s,
addressStr: o,
nHashType: a,
} = n,
h = e[o];
if (!h) {
n.log = `cannot find keyPair for addressStr ${o}`;
continue;
}
const f = this.uTxOutMap.get(r.txHashBuf, r.txOutNum);
if ("sig" === s)
this.signTxIn(t, h, f, i, a),
(n.log = "successfully inserted signature");
else {
if ("pubKey" !== s) {
n.log = `cannot perform operation of type ${s}`;
continue;
}
(r.script.chunks[i] = new st().writeBuffer(
h.pubKey.toBuffer()
).chunks[0]),
r.setScript(r.script),
(n.log = "successfully inserted public key");
}
}
}
return this;
}
}
class Dt extends O {
constructor(t, e, r, i) {
super({ tx: t, txOutMap: e, errStr: r, interp: i });
}
verify(t = Ct.SCRIPT_ENABLE_SIGHASH_FORKID) {
return !this.checkStr() && !this.verifyStr(t);
}
async asyncVerify(t) {
const e = await this.asyncVerifyStr(t);
return !this.checkStr() && !e;
}
static verify(t, e, r) {
return new Dt(t, e).verify(r);
}
static asyncVerify(t, e, r) {
return new Dt(t, e).asyncVerify(r);
}
checkStr() {
if (
0 === this.tx.txIns.length ||
0 === this.tx.txInsVi.toNumber()
)
return (this.errStr = "transaction txIns empty"), this.errStr;
if (
0 === this.tx.txOuts.length ||
0 === this.tx.txOutsVi.toNumber()
)
return (this.errStr = "transaction txOuts empty"), this.errStr;
if (this.tx.toBuffer().length > Mt.MAX_BLOCK_SIZE)
return (
(this.errStr = "transaction over the maximum block size"),
this.errStr
);
let t = new b(0);
for (let e = 0; e < this.tx.txOuts.length; e++) {
const r = this.tx.txOuts[e];
if (r.valueBn.lt(0))
return (
(this.errStr = "transaction txOut " + e + " negative"),
this.errStr
);
if (r.valueBn.gt(Nt.MAX_MONEY))
return (
(this.errStr =
"transaction txOut " + e + " greater than MAX_MONEY"),
this.errStr
);
if (((t = t.add(r.valueBn)), t.gt(Nt.MAX_MONEY)))
return (
(this.errStr =
"transaction txOut " +
e +
" total output greater than MAX_MONEY"),
this.errStr
);
}
const e = {};
for (let t = 0; t < this.tx.txIns.length; t++) {
const r = this.tx.txIns[t],
i = r.txHashBuf.toString("hex") + ":" + r.txOutNum;
if (void 0 !== e[i])
return (
(this.errStr =
"transaction input " + t + " duplicate input"),
this.errStr
);
e[i] = !0;
}
if (this.tx.isCoinbase()) {
const t = this.tx.txIns[0].script.toBuffer();
if (t.length < 2 || t.length > 100)
return (
(this.errStr = "coinbase trasaction script size invalid"),
this.errStr
);
} else
for (let t = 0; t < this.tx.txIns.length; t++)
if (this.tx.txIns[t].hasNullInput())
return (
(this.errStr =
"transaction input " + t + " has null input"),
this.errStr
);
return !1;
}
verifyStr(t) {
for (let e = 0; e < this.tx.txIns.length; e++)
if (!this.verifyNIn(e, t))
return (
(this.errStr = "input " + e + " failed script verify"),
this.errStr
);
return !1;
}
async asyncVerifyStr(t) {
for (let e = 0; e < this.tx.txIns.length; e++)
if (!(await this.asyncVerifyNIn(e, t)))
return (
(this.errStr = "input " + e + " failed script verify"),
this.errStr
);
return !1;
}
verifyNIn(t, e) {
const r = this.tx.txIns[t],
i = r.script,
n = this.txOutMap.get(r.txHashBuf, r.txOutNum);
if (!n)
return console.log("output " + r.txOutNum + " not found"), !1;
const s = n.script,
o = n.valueBn;
return (
(this.interp = new Ct()),
this.interp.verify(i, s, this.tx, t, e, o)
);
}
async asyncVerifyNIn(t, e) {
const r = this.tx.txIns[t],
i = r.script,
n = this.txOutMap.get(r.txHashBuf, r.txOutNum);
if (!n)
return console.log("output " + r.txOutNum + " not found"), !1;
const s = n.script,
o = n.valueBn;
this.interp = new Ct();
const a = await T.asyncObjectMethod(this.interp, "verify", [
i,
s,
this.tx,
t,
e,
o,
]);
return JSON.parse(a.resbuf.toString());
}
getDebugObject() {
return {
errStr: this.errStr,
interpFailure: this.interp
? this.interp.getDebugObject()
: void 0,
};
}
getDebugString() {
return JSON.stringify(this.getDebugObject(), null, 2);
}
}
var Vt = r(8764).Buffer;
class jt {}
(jt.encrypt = function(t, e) {
const r = jt.buf2Words(e),
i = jt.buf2Words(t),
s = new (n())(r).encrypt(i);
return jt.words2Buf(s);
}),
(jt.decrypt = function(t, e) {
const r = jt.buf2Words(t),
i = jt.buf2Words(e),
s = new (n())(i).decrypt(r);
return jt.words2Buf(s);
}),
(jt.buf2Words = function(t) {
if (t.length % 4)
throw new Error("buf length must be a multiple of 4");
const e = [];
for (let r = 0; r < t.length / 4; r++)
e.push(t.readUInt32BE(4 * r));
return e;
}),
(jt.words2Buf = function(t) {
const e = Vt.alloc(4 * t.length);
for (let r = 0; r < t.length; r++) e.writeUInt32BE(t[r], 4 * r);
return e;
});
var qt = r(8764).Buffer;
class zt {}
(zt.buf2BlocksBuf = function(t, e) {
const r = e / 8,
i = [];
for (let n = 0; n <= t.length / r; n++) {
let s = t.slice(n * r, n * r + r);
s.length < e && (s = zt.pkcs7Pad(s, e)), i.push(s);
}
return i;
}),
(zt.blockBufs2Buf = function(t) {
let e = t[t.length - 1];
return (
(e = zt.pkcs7Unpad(e)), (t[t.length - 1] = e), qt.concat(t)
);
}),
(zt.encrypt = function(t, e, r, i) {
const n = 8 * e.length,
s = zt.buf2BlocksBuf(t, n),
o = zt.encryptBlocks(s, e, r, i);
return qt.concat(o);
}),
(zt.decrypt = function(t, e, r, i) {
const n = e.length,
s = [];
for (let e = 0; e < t.length / n; e++)
s.push(t.slice(e * n, e * n + n));
const o = zt.decryptBlocks(s, e, r, i);
return zt.blockBufs2Buf(o);
}),
(zt.encryptBlock = function(t, e, r, i) {
const n = zt.xorBufs(t, e);
return r.encrypt(n, i);
}),
(zt.decryptBlock = function(t, e, r, i) {
const n = r.decrypt(t, i);
return zt.xorBufs(n, e);
}),
(zt.encryptBlocks = function(t, e, r, i) {
const n = [];
for (let s = 0; s < t.length; s++) {
const o = t[s],
a = zt.encryptBlock(o, e, r, i);
n.push(a), (e = a);
}
return n;
}),
(zt.decryptBlocks = function(t, e, r, i) {
const n = [];
for (let s = 0; s < t.length; s++) {
const o = t[s],
a = zt.decryptBlock(o, e, r, i);
n.push(a), (e = o);
}
return n;
}),
(zt.pkcs7Pad = function(t, e) {
const r = e / 8 - t.length,
i = qt.alloc(r);
return i.fill(r), qt.concat([t, i]);
}),
(zt.pkcs7Unpad = function(t) {
const e = t[t.length - 1],
r = t.slice(t.length - e, t.length),
i = qt.alloc(e);
if ((i.fill(e), !R(r, i))) throw new Error("invalid padding");
return t.slice(0, t.length - e);
}),
(zt.xorBufs = function(t, e) {
if (t.length !== e.length)
throw new Error("bufs must have the same length");
const r = qt.alloc(t.length);
for (let i = 0; i < t.length; i++) r[i] = t[i] ^ e[i];
return r;
});
var Gt = r(8764).Buffer;
class Yt {}
(Yt.encrypt = function(t, e, r, i = !0) {
r = r || $.getRandomBuffer(16);
const n = zt.encrypt(t, r, jt, e);
return i ? Gt.concat([r, n]) : n;
}),
(Yt.decrypt = function(t, e, r = !1) {
if (r) {
const i = t;
return zt.decrypt(i, r, jt, e);
}
{
const r = t.slice(0, 16),
i = t.slice(16);
return zt.decrypt(i, r, jt, e);
}
});
var Jt = r(8764).Buffer;
class Wt {}
(Wt.encrypt = function(t, e, r) {
const i = Yt.encrypt(t, e, r),
n = L.sha256Hmac(i, e);
return Jt.concat([n, i]);
}),
(Wt.asyncEncrypt = async function(t, e, r) {
r || (r = $.getRandomBuffer(16));
const i = [t, e, r];
return (await T.asyncClassMethod(Wt, "encrypt", i)).resbuf;
}),
(Wt.decrypt = function(t, e) {
if (t.length < 64)
throw new Error(
"The encrypted data must be at least 256+128+128 bits, which is the length of the Hmac plus the iv plus the smallest encrypted data size"
);
const r = t.slice(0, 32);
t = t.slice(32, t.length);
const i = L.sha256Hmac(t, e);
if (!R(r, i))
throw new Error(
"Message authentication failed - Hmacs are not equivalent"
);
return Yt.decrypt(t, e);
}),
(Wt.asyncDecrypt = async function(t, e) {
const r = [t, e];
return (await T.asyncClassMethod(Wt, "decrypt", r)).resbuf;
});
var Xt = r(8764).Buffer;
class Qt {}
(Qt.ivkEkM = function(t, e) {
const r = t.bn,
i = e.point.mul(r),
n = new X(i).toBuffer(),
s = L.sha512(n);
return {
iv: s.slice(0, 16),
kE: s.slice(16, 32),
kM: s.slice(32, 64),
};
}),
(Qt.electrumEncrypt = function(t, e, r, i = !1) {
if (!Xt.isBuffer(t))
throw new Error("messageBuf must be a buffer");
let n;
null === r && (r = pt.fromRandom()),
i || (n = r.pubKey.toDer(!0));
const { iv: s, kE: o, kM: a } = Qt.ivkEkM(r.privKey, e),
h = Yt.encrypt(t, o, s, !1),
f = Xt.from("BIE1");
let u;
u = n ? Xt.concat([f, n, h]) : Xt.concat([f, h]);
const c = L.sha256Hmac(u, a);
return Xt.concat([u, c]);
}),
(Qt.electrumDecrypt = function(t, e, r = null) {
if (!Xt.isBuffer(t)) throw new Error("encBuf must be a buffer");
if (!t.slice(0, 4).equals(Xt.from("BIE1")))
throw new Error("Invalid Magic");
let i = 4;
if (null === r) {
const e = t.slice(4, 37);
(r = X.fromDer(e)), (i = 37);
}
const { iv: n, kE: s, kM: o } = Qt.ivkEkM(e, r),
a = t.slice(i, t.length - 32),
h = t.slice(t.length - 32, t.length),
f = L.sha256Hmac(t.slice(0, t.length - 32), o);
if (!h.equals(f)) throw new Error("Invalid checksum");
return Yt.decrypt(a, s, n);
}),
(Qt.bitcoreEncrypt = function(t, e, r, i) {
r || (r = pt.fromRandom());
const n = r.privKey.bn,
s = r.pubKey.toDer(!0),
o = e.point
.mul(n)
.getX()
.toBuffer({ size: 32 }),
a = L.sha512(o),
h = a.slice(0, 32),
f = a.slice(32, 64),
u = Yt.encrypt(t, h, i),
c = L.sha256Hmac(u, f);
return Xt.concat([s, u, c]);
}),
(Qt.asyncBitcoreEncrypt = async function(t, e, r, i) {
r || (r = await pt.asyncFromRandom()),
i || (i = $.getRandomBuffer(16));
const n = [t, e, r, i];
return (await T.asyncClassMethod(Qt, "bitcoreEncrypt", n)).resbuf;
}),
(Qt.bitcoreDecrypt = function(t, e) {
const r = e.bn,
i = X.fromDer(t.slice(0, 33)).point.mul(r);
if (i.eq(new J())) throw new Error("P equals 0");
const n = i.getX().toBuffer({ size: 32 }),
s = L.sha512(n),
o = s.slice(0, 32),
a = s.slice(32, 64),
h = t.slice(33, t.length - 32),
f = t.slice(t.length - 32, t.length),
u = L.sha256Hmac(h, a);
if (!R(f, u)) throw new Error("Invalid checksum");
return Yt.decrypt(h, o);
}),
(Qt.asyncBitcoreDecrypt = async function(t, e) {
const r = [t, e];
return (await T.asyncClassMethod(Qt, "bitcoreDecrypt", r)).resbuf;
});
var Zt = r(8764).Buffer;
const $t = {
aes: n(),
bnjs: o(),
bs58: h(),
elliptic: u(),
hashjs: d(),
pbkdf2: l,
Buffer: Zt,
},
te = "2.0.10";
},
4297: (t) => {
function e(t) {
var e, r, i;
this._tables[0][0][0] || this._precompute();
var n = this._tables[0][4],
s = this._tables[1],
o = t.length,
a = 1;
if (4 !== o && 6 !== o && 8 !== o)
throw new Error("invalid aes key size");
this._key = [(r = t.slice(0)), (i = [])];
for (var h = o; h < 4 * o + 28; h++)
(e = r[h - 1]),
(h % o == 0 || (8 === o && h % o == 4)) &&
((e =
(n[e >>> 24] << 24) ^
(n[(e >> 16) & 255] << 16) ^
(n[(e >> 8) & 255] << 8) ^
n[255 & e]),
h % o == 0 &&
((e = (e << 8) ^ (e >>> 24) ^ (a << 24)),
(a = (a << 1) ^ (283 * (a >> 7))))),
(r[h] = r[h - o] ^ e);
for (var f = 0; h; f++, h--)
(e = r[3 & f ? h : h - 4]),
(i[f] =
h <= 4 || f < 4
? e
: s[0][n[e >>> 24]] ^
s[1][n[(e >> 16) & 255]] ^
s[2][n[(e >> 8) & 255]] ^
s[3][n[255 & e]]);
}
(t.exports = e),
(e.prototype = {
encrypt: function(t) {
return this._crypt(t, 0);
},
decrypt: function(t) {
return this._crypt(t, 1);
},
_tables: [
[
new Uint32Array(256),
new Uint32Array(256),
new Uint32Array(256),
new Uint32Array(256),
new Uint32Array(256),
],
[
new Uint32Array(256),
new Uint32Array(256),
new Uint32Array(256),
new Uint32Array(256),
new Uint32Array(256),
],
],
_precompute: function() {
var t,
e,
r,
i,
n,
s,
o,
a,
h = this._tables[0],
f = this._tables[1],
u = h[4],
c = f[4],
d = new Uint8Array(256),
l = new Uint8Array(256);
for (t = 0; t < 256; t++)
l[(d[t] = (t << 1) ^ (283 * (t >> 7))) ^ t] = t;
for (e = r = 0; !u[e]; e ^= i || 1, r = l[r] || 1)
for (
s =
((s = r ^ (r << 1) ^ (r << 2) ^ (r << 3) ^ (r << 4)) >>
8) ^
(255 & s) ^
99,
u[e] = s,
c[s] = e,
a =
(16843009 * d[(n = d[(i = d[e])])]) ^
(65537 * n) ^
(257 * i) ^
(16843008 * e),
o = (257 * d[s]) ^ (16843008 * s),
t = 0;
t < 4;
t++
)
(h[t][e] = o = (o << 24) ^ (o >>> 8)),
(f[t][s] = a = (a << 24) ^ (a >>> 8));
},
_crypt: function(t, e) {
if (4 !== t.length) throw new Error("invalid aes block size");
var r,
i,
n,
s,
o = this._key[e],
a = t[0] ^ o[0],
h = t[e ? 3 : 1] ^ o[1],
f = t[2] ^ o[2],
u = t[e ? 1 : 3] ^ o[3],
c = o.length / 4 - 2,
d = 4,
l = new Uint32Array(4),
p = this._tables[e],
b = p[0],
m = p[1],
g = p[2],
y = p[3],
w = p[4];
for (s = 0; s < c; s++)
(r =
b[a >>> 24] ^
m[(h >> 16) & 255] ^
g[(f >> 8) & 255] ^
y[255 & u] ^
o[d]),
(i =
b[h >>> 24] ^
m[(f >> 16) & 255] ^
g[(u >> 8) & 255] ^
y[255 & a] ^
o[d + 1]),
(n =
b[f >>> 24] ^
m[(u >> 16) & 255] ^
g[(a >> 8) & 255] ^
y[255 & h] ^
o[d + 2]),
(u =
b[u >>> 24] ^
m[(a >> 16) & 255] ^
g[(h >> 8) & 255] ^
y[255 & f] ^
o[d + 3]),
(d += 4),
(a = r),
(h = i),
(f = n);
for (s = 0; s < 4; s++)
(l[e ? 3 & -s : s] =
(w[a >>> 24] << 24) ^
(w[(h >> 16) & 255] << 16) ^
(w[(f >> 8) & 255] << 8) ^
w[255 & u] ^
o[d++]),
(r = a),
(a = h),
(h = f),
(f = u),
(u = r);
return l;
},
});
},
8162: (t, e, r) => {
"use strict";
var i = r(9509).Buffer;
t.exports = function(t) {
if (t.length >= 255) throw new TypeError("Alphabet too long");
for (var e = new Uint8Array(256), r = 0; r < e.length; r++)
e[r] = 255;
for (var n = 0; n < t.length; n++) {
var s = t.charAt(n),
o = s.charCodeAt(0);
if (255 !== e[o]) throw new TypeError(s + " is ambiguous");
e[o] = n;
}
var a = t.length,
h = t.charAt(0),
f = Math.log(a) / Math.log(256),
u = Math.log(256) / Math.log(a);
function c(t) {
if ("string" != typeof t) throw new TypeError("Expected String");
if (0 === t.length) return i.alloc(0);
var r = 0;
if (" " !== t[r]) {
for (var n = 0, s = 0; t[r] === h; ) n++, r++;
for (
var o = ((t.length - r) * f + 1) >>> 0, u = new Uint8Array(o);
t[r];

) {
var c = e[t.charCodeAt(r)];
if (255 === c) return;
for (
var d = 0, l = o - 1;
(0 !== c || d < s) && -1 !== l;
l--, d++
)
(c += (a * u[l]) >>> 0),
(u[l] = c % 256 >>> 0),
(c = (c / 256) >>> 0);
if (0 !== c) throw new Error("Non-zero carry");
(s = d), r++;
}
if (" " !== t[r]) {
for (var p = o - s; p !== o && 0 === u[p]; ) p++;
var b = i.allocUnsafe(n + (o - p));
b.fill(0, 0, n);
for (var m = n; p !== o; ) b[m++] = u[p++];
return b;
}
}
}
return {
encode: function(e) {
if (
((Array.isArray(e) || e instanceof Uint8Array) &&
(e = i.from(e)),
!i.isBuffer(e))
)
throw new TypeError("Expected Buffer");
if (0 === e.length) return "";
for (
var r = 0, n = 0, s = 0, o = e.length;
s !== o && 0 === e[s];

)
s++, r++;
for (
var f = ((o - s) * u + 1) >>> 0, c = new Uint8Array(f);
s !== o;

) {
for (
var d = e[s], l = 0, p = f - 1;
(0 !== d || l < n) && -1 !== p;
p--, l++
)
(d += (256 * c[p]) >>> 0),
(c[p] = d % a >>> 0),
(d = (d / a) >>> 0);
if (0 !== d) throw new Error("Non-zero carry");
(n = l), s++;
}
for (var b = f - n; b !== f && 0 === c[b]; ) b++;
for (var m = h.repeat(r); b < f; ++b) m += t.charAt(c[b]);
return m;
},
decodeUnsafe: c,
decode: function(t) {
var e = c(t);
if (e) return e;
throw new Error("Non-base" + a + " character");
},
};
};
},
9742: (t, e) => {
"use strict";
(e.byteLength = function(t) {
var e = h(t),
r = e[0],
i = e[1];
return (3 * (r + i)) / 4 - i;
}),
(e.toByteArray = function(t) {
var e,
r,
s = h(t),
o = s[0],
a = s[1],
f = new n(
(function(t, e, r) {
return (3 * (e + r)) / 4 - r;
})(0, o, a)
),
u = 0,
c = a > 0 ? o - 4 : o;
for (r = 0; r < c; r += 4)
(e =
(i[t.charCodeAt(r)] << 18) |
(i[t.charCodeAt(r + 1)] << 12) |
(i[t.charCodeAt(r + 2)] << 6) |
i[t.charCodeAt(r + 3)]),
(f[u++] = (e >> 16) & 255),
(f[u++] = (e >> 8) & 255),
(f[u++] = 255 & e);
return (
2 === a &&
((e =
(i[t.charCodeAt(r)] << 2) | (i[t.charCodeAt(r + 1)] >> 4)),
(f[u++] = 255 & e)),
1 === a &&
((e =
(i[t.charCodeAt(r)] << 10) |
(i[t.charCodeAt(r + 1)] << 4) |
(i[t.charCodeAt(r + 2)] >> 2)),
(f[u++] = (e >> 8) & 255),
(f[u++] = 255 & e)),
f
);
}),
(e.fromByteArray = function(t) {
for (
var e,
i = t.length,
n = i % 3,
s = [],
o = 16383,
a = 0,
h = i - n;
a < h;
a += o
)
s.push(f(t, a, a + o > h ? h : a + o));
return (
1 === n
? ((e = t[i - 1]),
s.push(r[e >> 2] + r[(e << 4) & 63] + "=="))
: 2 === n &&
((e = (t[i - 2] << 8) + t[i - 1]),
s.push(
r[e >> 10] + r[(e >> 4) & 63] + r[(e << 2) & 63] + "="
)),
s.join("")
);
});
for (
var r = [],
i = [],
n = "undefined" != typeof Uint8Array ? Uint8Array : Array,
s =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
o = 0,
a = s.length;
o < a;
++o
)
(r[o] = s[o]), (i[s.charCodeAt(o)] = o);
function h(t) {
var e = t.length;
if (e % 4 > 0)
throw new Error("Invalid string. Length must be a multiple of 4");
var r = t.indexOf("=");
return -1 === r && (r = e), [r, r === e ? 0 : 4 - (r % 4)];
}
function f(t, e, i) {
for (var n, s, o = [], a = e; a < i; a += 3)
(n =
((t[a] << 16) & 16711680) +
((t[a + 1] << 8) & 65280) +
(255 & t[a + 2])),
o.push(
r[((s = n) >> 18) & 63] +
r[(s >> 12) & 63] +
r[(s >> 6) & 63] +
r[63 & s]
);
return o.join("");
}
(i["-".charCodeAt(0)] = 62), (i["_".charCodeAt(0)] = 63);
},
4666: (t, e, r) => {
"use strict";
var i = e;
(i.version = r(60).i8),
(i.utils = r(7359)),
(i.rand = r(9931)),
(i.curve = r(5104)),
(i.curves = r(4626)),
(i.ec = r(5630));
},
8015: (t, e, r) => {
"use strict";
var i = r(3550),
n = r(7359),
s = n.getNAF,
o = n.getJSF,
a = n.assert;
function h(t, e) {
(this.type = t),
(this.p = new i(e.p, 16)),
(this.red = e.prime ? i.red(e.prime) : i.mont(this.p)),
(this.zero = new i(0).toRed(this.red)),
(this.one = new i(1).toRed(this.red)),
(this.two = new i(2).toRed(this.red)),
(this.n = e.n && new i(e.n, 16)),
(this.g = e.g && this.pointFromJSON(e.g, e.gRed)),
(this._wnafT1 = new Array(4)),
(this._wnafT2 = new Array(4)),
(this._wnafT3 = new Array(4)),
(this._wnafT4 = new Array(4)),
(this._bitLength = this.n ? this.n.bitLength() : 0);
var r = this.n && this.p.div(this.n);
!r || r.cmpn(100) > 0
? (this.redN = null)
: ((this._maxwellTrick = !0),
(this.redN = this.n.toRed(this.red)));
}
function f(t, e) {
(this.curve = t), (this.type = e), (this.precomputed = null);
}
(t.exports = h),
(h.prototype.point = function() {
throw new Error("Not implemented");
}),
(h.prototype.validate = function() {
throw new Error("Not implemented");
}),
(h.prototype._fixedNafMul = function(t, e) {
a(t.precomputed);
var r = t._getDoubles(),
i = s(e, 1, this._bitLength),
n = (1 << (r.step + 1)) - (r.step % 2 == 0 ? 2 : 1);
n /= 3;
for (var o = [], h = 0; h < i.length; h += r.step) {
var f = 0;
for (e = h + r.step - 1; e >= h; e--) f = (f << 1) + i[e];
o.push(f);
}
for (
var u = this.jpoint(null, null, null),
c = this.jpoint(null, null, null),
d = n;
d > 0;
d--
) {
for (h = 0; h < o.length; h++)
(f = o[h]) === d
? (c = c.mixedAdd(r.points[h]))
: f === -d && (c = c.mixedAdd(r.points[h].neg()));
u = u.add(c);
}
return u.toP();
}),
(h.prototype._wnafMul = function(t, e) {
var r = 4,
i = t._getNAFPoints(r);
r = i.wnd;
for (
var n = i.points,
o = s(e, r, this._bitLength),
h = this.jpoint(null, null, null),
f = o.length - 1;
f >= 0;
f--
) {
for (e = 0; f >= 0 && 0 === o[f]; f--) e++;
if ((f >= 0 && e++, (h = h.dblp(e)), f < 0)) break;
var u = o[f];
a(0 !== u),
(h =
"affine" === t.type
? u > 0
? h.mixedAdd(n[(u - 1) >> 1])
: h.mixedAdd(n[(-u - 1) >> 1].neg())
: u > 0
? h.add(n[(u - 1) >> 1])
: h.add(n[(-u - 1) >> 1].neg()));
}
return "affine" === t.type ? h.toP() : h;
}),
(h.prototype._wnafMulAdd = function(t, e, r, i, n) {
for (
var a = this._wnafT1,
h = this._wnafT2,
f = this._wnafT3,
u = 0,
c = 0;
c < i;
c++
) {
var d = (O = e[c])._getNAFPoints(t);
(a[c] = d.wnd), (h[c] = d.points);
}
for (c = i - 1; c >= 1; c -= 2) {
var l = c - 1,
p = c;
if (1 === a[l] && 1 === a[p]) {
var b = [e[l], null, null, e[p]];
0 === e[l].y.cmp(e[p].y)
? ((b[1] = e[l].add(e[p])),
(b[2] = e[l].toJ().mixedAdd(e[p].neg())))
: 0 === e[l].y.cmp(e[p].y.redNeg())
? ((b[1] = e[l].toJ().mixedAdd(e[p])),
(b[2] = e[l].add(e[p].neg())))
: ((b[1] = e[l].toJ().mixedAdd(e[p])),
(b[2] = e[l].toJ().mixedAdd(e[p].neg())));
var m = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
g = o(r[l], r[p]);
(u = Math.max(g[0].length, u)),
(f[l] = new Array(u)),
(f[p] = new Array(u));
for (var y = 0; y < u; y++) {
var w = 0 | g[0][y],
v = 0 | g[1][y];
(f[l][y] = m[3 * (w + 1) + (v + 1)]),
(f[p][y] = 0),
(h[l] = b);
}
} else
(f[l] = s(r[l], a[l], this._bitLength)),
(f[p] = s(r[p], a[p], this._bitLength)),
(u = Math.max(f[l].length, u)),
(u = Math.max(f[p].length, u));
}
var _ = this.jpoint(null, null, null),
S = this._wnafT4;
for (c = u; c >= 0; c--) {
for (var E = 0; c >= 0; ) {
var I = !0;
for (y = 0; y < i; y++)
(S[y] = 0 | f[y][c]), 0 !== S[y] && (I = !1);
if (!I) break;
E++, c--;
}
if ((c >= 0 && E++, (_ = _.dblp(E)), c < 0)) break;
for (y = 0; y < i; y++) {
var O,
B = S[y];
0 !== B &&
(B > 0
? (O = h[y][(B - 1) >> 1])
: B < 0 && (O = h[y][(-B - 1) >> 1].neg()),
(_ = "affine" === O.type ? _.mixedAdd(O) : _.add(O)));
}
}
for (c = 0; c < i; c++) h[c] = null;
return n ? _ : _.toP();
}),
(h.BasePoint = f),
(f.prototype.eq = function() {
throw new Error("Not implemented");
}),
(f.prototype.validate = function() {
return this.curve.validate(this);
}),
(h.prototype.decodePoint = function(t, e) {
t = n.toArray(t, e);
var r = this.p.byteLength();
if (
(4 === t[0] || 6 === t[0] || 7 === t[0]) &&
t.length - 1 == 2 * r
)
return (
6 === t[0]
? a(t[t.length - 1] % 2 == 0)
: 7 === t[0] && a(t[t.length - 1] % 2 == 1),
this.point(t.slice(1, 1 + r), t.slice(1 + r, 1 + 2 * r))
);
if ((2 === t[0] || 3 === t[0]) && t.length - 1 === r)
return this.pointFromX(t.slice(1, 1 + r), 3 === t[0]);
throw new Error("Unknown point format");
}),
(f.prototype.encodeCompressed = function(t) {
return this.encode(t, !0);
}),
(f.prototype._encode = function(t) {
var e = this.curve.p.byteLength(),
r = this.getX().toArray("be", e);
return t
? [this.getY().isEven() ? 2 : 3].concat(r)
: [4].concat(r, this.getY().toArray("be", e));
}),
(f.prototype.encode = function(t, e) {
return n.encode(this._encode(e), t);
}),
(f.prototype.precompute = function(t) {
if (this.precomputed) return this;
var e = { doubles: null, naf: null, beta: null };
return (
(e.naf = this._getNAFPoints(8)),
(e.doubles = this._getDoubles(4, t)),
(e.beta = this._getBeta()),
(this.precomputed = e),
this
);
}),
(f.prototype._hasDoubles = function(t) {
if (!this.precomputed) return !1;
var e = this.precomputed.doubles;
return (
!!e &&
e.points.length >= Math.ceil((t.bitLength() + 1) / e.step)
);
}),
(f.prototype._getDoubles = function(t, e) {
if (this.precomputed && this.precomputed.doubles)
return this.precomputed.doubles;
for (var r = [this], i = this, n = 0; n < e; n += t) {
for (var s = 0; s < t; s++) i = i.dbl();
r.push(i);
}
return { step: t, points: r };
}),
(f.prototype._getNAFPoints = function(t) {
if (this.precomputed && this.precomputed.naf)
return this.precomputed.naf;
for (
var e = [this],
r = (1 << t) - 1,
i = 1 === r ? null : this.dbl(),
n = 1;
n < r;
n++
)
e[n] = e[n - 1].add(i);
return { wnd: t, points: e };
}),
(f.prototype._getBeta = function() {
return null;
}),
(f.prototype.dblp = function(t) {
for (var e = this, r = 0; r < t; r++) e = e.dbl();
return e;
});
},
5104: (t, e, r) => {
"use strict";
var i = e;
(i.base = r(8015)), (i.short = r(8505));
},
8505: (t, e, r) => {
"use strict";
var i = r(7359),
n = r(3550),
s = r(5717),
o = r(8015),
a = i.assert;
function h(t) {
o.call(this, "short", t),
(this.a = new n(t.a, 16).toRed(this.red)),
(this.b = new n(t.b, 16).toRed(this.red)),
(this.tinv = this.two.redInvm()),
(this.zeroA = 0 === this.a.fromRed().cmpn(0)),
(this.threeA =
0 ===
this.a
.fromRed()
.sub(this.p)
.cmpn(-3)),
(this.endo = this._getEndomorphism(t)),
(this._endoWnafT1 = new Array(4)),
(this._endoWnafT2 = new Array(4));
}
function f(t, e, r, i) {
o.BasePoint.call(this, t, "affine"),
null === e && null === r
? ((this.x = null), (this.y = null), (this.inf = !0))
: ((this.x = new n(e, 16)),
(this.y = new n(r, 16)),
i &&
(this.x.forceRed(this.curve.red),
this.y.forceRed(this.curve.red)),
this.x.red || (this.x = this.x.toRed(this.curve.red)),
this.y.red || (this.y = this.y.toRed(this.curve.red)),
(this.inf = !1));
}
function u(t, e, r, i) {
o.BasePoint.call(this, t, "jacobian"),
null === e && null === r && null === i
? ((this.x = this.curve.one),
(this.y = this.curve.one),
(this.z = new n(0)))
: ((this.x = new n(e, 16)),
(this.y = new n(r, 16)),
(this.z = new n(i, 16))),
this.x.red || (this.x = this.x.toRed(this.curve.red)),
this.y.red || (this.y = this.y.toRed(this.curve.red)),
this.z.red || (this.z = this.z.toRed(this.curve.red)),
(this.zOne = this.z === this.curve.one);
}
s(h, o),
(t.exports = h),
(h.prototype._getEndomorphism = function(t) {
if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
var e, r;
if (t.beta) e = new n(t.beta, 16).toRed(this.red);
else {
var i = this._getEndoRoots(this.p);
e = (e = i[0].cmp(i[1]) < 0 ? i[0] : i[1]).toRed(this.red);
}
if (t.lambda) r = new n(t.lambda, 16);
else {
var s = this._getEndoRoots(this.n);
0 === this.g.mul(s[0]).x.cmp(this.g.x.redMul(e))
? (r = s[0])
: ((r = s[1]),
a(0 === this.g.mul(r).x.cmp(this.g.x.redMul(e))));
}
return {
beta: e,
lambda: r,
basis: t.basis
? t.basis.map(function(t) {
return { a: new n(t.a, 16), b: new n(t.b, 16) };
})
: this._getEndoBasis(r),
};
}
}),
(h.prototype._getEndoRoots = function(t) {
var e = t === this.p ? this.red : n.mont(t),
r = new n(2).toRed(e).redInvm(),
i = r.redNeg(),
s = new n(3)
.toRed(e)
.redNeg()
.redSqrt()
.redMul(r);
return [i.redAdd(s).fromRed(), i.redSub(s).fromRed()];
}),
(h.prototype._getEndoBasis = function(t) {
for (
var e,
r,
i,
s,
o,
a,
h,
f,
u,
c = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
d = t,
l = this.n.clone(),
p = new n(1),
b = new n(0),
m = new n(0),
g = new n(1),
y = 0;
0 !== d.cmpn(0);

) {
var w = l.div(d);
(f = l.sub(w.mul(d))), (u = m.sub(w.mul(p)));
var v = g.sub(w.mul(b));
if (!i && f.cmp(c) < 0)
(e = h.neg()), (r = p), (i = f.neg()), (s = u);
else if (i && 2 == ++y) break;
(h = f), (l = d), (d = f), (m = p), (p = u), (g = b), (b = v);
}
(o = f.neg()), (a = u);
var _ = i.sqr().add(s.sqr());
return (
o
.sqr()
.add(a.sqr())
.cmp(_) >= 0 && ((o = e), (a = r)),
i.negative && ((i = i.neg()), (s = s.neg())),
o.negative && ((o = o.neg()), (a = a.neg())),
[
{ a: i, b: s },
{ a: o, b: a },
]
);
}),
(h.prototype._endoSplit = function(t) {
var e = this.endo.basis,
r = e[0],
i = e[1],
n = i.b.mul(t).divRound(this.n),
s = r.b
.neg()
.mul(t)
.divRound(this.n),
o = n.mul(r.a),
a = s.mul(i.a),
h = n.mul(r.b),
f = s.mul(i.b);
return { k1: t.sub(o).sub(a), k2: h.add(f).neg() };
}),
(h.prototype.pointFromX = function(t, e) {
(t = new n(t, 16)).red || (t = t.toRed(this.red));
var r = t
.redSqr()
.redMul(t)
.redIAdd(t.redMul(this.a))
.redIAdd(this.b),
i = r.redSqrt();
if (
0 !==
i
.redSqr()
.redSub(r)
.cmp(this.zero)
)
throw new Error("invalid point");
var s = i.fromRed().isOdd();
return (
((e && !s) || (!e && s)) && (i = i.redNeg()), this.point(t, i)
);
}),
(h.prototype.validate = function(t) {
if (t.inf) return !0;
var e = t.x,
r = t.y,
i = this.a.redMul(e),
n = e
.redSqr()
.redMul(e)
.redIAdd(i)
.redIAdd(this.b);
return (
0 ===
r
.redSqr()
.redISub(n)
.cmpn(0)
);
}),
(h.prototype._endoWnafMulAdd = function(t, e, r) {
for (
var i = this._endoWnafT1, n = this._endoWnafT2, s = 0;
s < t.length;
s++
) {
var o = this._endoSplit(e[s]),
a = t[s],
h = a._getBeta();
o.k1.negative && (o.k1.ineg(), (a = a.neg(!0))),
o.k2.negative && (o.k2.ineg(), (h = h.neg(!0))),
(i[2 * s] = a),
(i[2 * s + 1] = h),
(n[2 * s] = o.k1),
(n[2 * s + 1] = o.k2);
}
for (
var f = this._wnafMulAdd(1, i, n, 2 * s, r), u = 0;
u < 2 * s;
u++
)
(i[u] = null), (n[u] = null);
return f;
}),
s(f, o.BasePoint),
(h.prototype.point = function(t, e, r) {
return new f(this, t, e, r);
}),
(h.prototype.pointFromJSON = function(t, e) {
return f.fromJSON(this, t, e);
}),
(f.prototype._getBeta = function() {
if (this.curve.endo) {
var t = this.precomputed;
if (t && t.beta) return t.beta;
var e = this.curve.point(
this.x.redMul(this.curve.endo.beta),
this.y
);
if (t) {
var r = this.curve,
i = function(t) {
return r.point(t.x.redMul(r.endo.beta), t.y);
};
(t.beta = e),
(e.precomputed = {
beta: null,
naf: t.naf && {
wnd: t.naf.wnd,
points: t.naf.points.map(i),
},
doubles: t.doubles && {
step: t.doubles.step,
points: t.doubles.points.map(i),
},
});
}
return e;
}
}),
(f.prototype.toJSON = function() {
return this.precomputed
? [
this.x,
this.y,
this.precomputed && {
doubles: this.precomputed.doubles && {
step: this.precomputed.doubles.step,
points: this.precomputed.doubles.points.slice(1),
},
naf: this.precomputed.naf && {
wnd: this.precomputed.naf.wnd,
points: this.precomputed.naf.points.slice(1),
},
},
]
: [this.x, this.y];
}),
(f.fromJSON = function(t, e, r) {
"string" == typeof e && (e = JSON.parse(e));
var i = t.point(e[0], e[1], r);
if (!e[2]) return i;
function n(e) {
return t.point(e[0], e[1], r);
}
var s = e[2];
return (
(i.precomputed = {
beta: null,
doubles: s.doubles && {
step: s.doubles.step,
points: [i].concat(s.doubles.points.map(n)),
},
naf: s.naf && {
wnd: s.naf.wnd,
points: [i].concat(s.naf.points.map(n)),
},
}),
i
);
}),
(f.prototype.inspect = function() {
return this.isInfinity()
? "<EC Point Infinity>"
: "<EC Point x: " +
this.x.fromRed().toString(16, 2) +
" y: " +
this.y.fromRed().toString(16, 2) +
">";
}),
(f.prototype.isInfinity = function() {
return this.inf;
}),
(f.prototype.add = function(t) {
if (this.inf) return t;
if (t.inf) return this;
if (this.eq(t)) return this.dbl();
if (this.neg().eq(t)) return this.curve.point(null, null);
if (0 === this.x.cmp(t.x)) return this.curve.point(null, null);
var e = this.y.redSub(t.y);
0 !== e.cmpn(0) && (e = e.redMul(this.x.redSub(t.x).redInvm()));
var r = e
.redSqr()
.redISub(this.x)
.redISub(t.x),
i = e.redMul(this.x.redSub(r)).redISub(this.y);
return this.curve.point(r, i);
}),
(f.prototype.dbl = function() {
if (this.inf) return this;
var t = this.y.redAdd(this.y);
if (0 === t.cmpn(0)) return this.curve.point(null, null);
var e = this.curve.a,
r = this.x.redSqr(),
i = t.redInvm(),
n = r
.redAdd(r)
.redIAdd(r)
.redIAdd(e)
.redMul(i),
s = n.redSqr().redISub(this.x.redAdd(this.x)),
o = n.redMul(this.x.redSub(s)).redISub(this.y);
return this.curve.point(s, o);
}),
(f.prototype.getX = function() {
return this.x.fromRed();
}),
(f.prototype.getY = function() {
return this.y.fromRed();
}),
(f.prototype.mul = function(t) {
return (
(t = new n(t, 16)),
this.isInfinity()
? this
: this._hasDoubles(t)
? this.curve._fixedNafMul(this, t)
: this.curve.endo
? this.curve._endoWnafMulAdd([this], [t])
: this.curve._wnafMul(this, t)
);
}),
(f.prototype.mulAdd = function(t, e, r) {
var i = [this, e],
n = [t, r];
return this.curve.endo
? this.curve._endoWnafMulAdd(i, n)
: this.curve._wnafMulAdd(1, i, n, 2);
}),
(f.prototype.jmulAdd = function(t, e, r) {
var i = [this, e],
n = [t, r];
return this.curve.endo
? this.curve._endoWnafMulAdd(i, n, !0)
: this.curve._wnafMulAdd(1, i, n, 2, !0);
}),
(f.prototype.eq = function(t) {
return (
this === t ||
(this.inf === t.inf &&
(this.inf ||
(0 === this.x.cmp(t.x) && 0 === this.y.cmp(t.y))))
);
}),
(f.prototype.neg = function(t) {
if (this.inf) return this;
var e = this.curve.point(this.x, this.y.redNeg());
if (t && this.precomputed) {
var r = this.precomputed,
i = function(t) {
return t.neg();
};
e.precomputed = {
naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(i) },
doubles: r.doubles && {
step: r.doubles.step,
points: r.doubles.points.map(i),
},
};
}
return e;
}),
(f.prototype.toJ = function() {
return this.inf
? this.curve.jpoint(null, null, null)
: this.curve.jpoint(this.x, this.y, this.curve.one);
}),
s(u, o.BasePoint),
(h.prototype.jpoint = function(t, e, r) {
return new u(this, t, e, r);
}),
(u.prototype.toP = function() {
if (this.isInfinity()) return this.curve.point(null, null);
var t = this.z.redInvm(),
e = t.redSqr(),
r = this.x.redMul(e),
i = this.y.redMul(e).redMul(t);
return this.curve.point(r, i);
}),
(u.prototype.neg = function() {
return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
}),
(u.prototype.add = function(t) {
if (this.isInfinity()) return t;
if (t.isInfinity()) return this;
var e = t.z.redSqr(),
r = this.z.redSqr(),
i = this.x.redMul(e),
n = t.x.redMul(r),
s = this.y.redMul(e.redMul(t.z)),
o = t.y.redMul(r.redMul(this.z)),
a = i.redSub(n),
h = s.redSub(o);
if (0 === a.cmpn(0))
return 0 !== h.cmpn(0)
? this.curve.jpoint(null, null, null)
: this.dbl();
var f = a.redSqr(),
u = f.redMul(a),
c = i.redMul(f),
d = h
.redSqr()
.redIAdd(u)
.redISub(c)
.redISub(c),
l = h.redMul(c.redISub(d)).redISub(s.redMul(u)),
p = this.z.redMul(t.z).redMul(a);
return this.curve.jpoint(d, l, p);
}),
(u.prototype.mixedAdd = function(t) {
if (this.isInfinity()) return t.toJ();
if (t.isInfinity()) return this;
var e = this.z.redSqr(),
r = this.x,
i = t.x.redMul(e),
n = this.y,
s = t.y.redMul(e).redMul(this.z),
o = r.redSub(i),
a = n.redSub(s);
if (0 === o.cmpn(0))
return 0 !== a.cmpn(0)
? this.curve.jpoint(null, null, null)
: this.dbl();
var h = o.redSqr(),
f = h.redMul(o),
u = r.redMul(h),
c = a
.redSqr()
.redIAdd(f)
.redISub(u)
.redISub(u),
d = a.redMul(u.redISub(c)).redISub(n.redMul(f)),
l = this.z.redMul(o);
return this.curve.jpoint(c, d, l);
}),
(u.prototype.dblp = function(t) {
if (0 === t) return this;
if (this.isInfinity()) return this;
if (!t) return this.dbl();
if (this.curve.zeroA || this.curve.threeA) {
for (var e = this, r = 0; r < t; r++) e = e.dbl();
return e;
}
var i = this.curve.a,
n = this.curve.tinv,
s = this.x,
o = this.y,
a = this.z,
h = a.redSqr().redSqr(),
f = o.redAdd(o);
for (r = 0; r < t; r++) {
var u = s.redSqr(),
c = f.redSqr(),
d = c.redSqr(),
l = u
.redAdd(u)
.redIAdd(u)
.redIAdd(i.redMul(h)),
p = s.redMul(c),
b = l.redSqr().redISub(p.redAdd(p)),
m = p.redISub(b),
g = l.redMul(m);
g = g.redIAdd(g).redISub(d);
var y = f.redMul(a);
r + 1 < t && (h = h.redMul(d)), (s = b), (a = y), (f = g);
}
return this.curve.jpoint(s, f.redMul(n), a);
}),
(u.prototype.dbl = function() {
return this.isInfinity()
? this
: this.curve.zeroA
? this._zeroDbl()
: this.curve.threeA
? this._threeDbl()
: this._dbl();
}),
(u.prototype._zeroDbl = function() {
var t, e, r;
if (this.zOne) {
var i = this.x.redSqr(),
n = this.y.redSqr(),
s = n.redSqr(),
o = this.x
.redAdd(n)
.redSqr()
.redISub(i)
.redISub(s);
o = o.redIAdd(o);
var a = i.redAdd(i).redIAdd(i),
h = a
.redSqr()
.redISub(o)
.redISub(o),
f = s.redIAdd(s);
(f = (f = f.redIAdd(f)).redIAdd(f)),
(t = h),
(e = a.redMul(o.redISub(h)).redISub(f)),
(r = this.y.redAdd(this.y));
} else {
var u = this.x.redSqr(),
c = this.y.redSqr(),
d = c.redSqr(),
l = this.x
.redAdd(c)
.redSqr()
.redISub(u)
.redISub(d);
l = l.redIAdd(l);
var p = u.redAdd(u).redIAdd(u),
b = p.redSqr(),
m = d.redIAdd(d);
(m = (m = m.redIAdd(m)).redIAdd(m)),
(t = b.redISub(l).redISub(l)),
(e = p.redMul(l.redISub(t)).redISub(m)),
(r = (r = this.y.redMul(this.z)).redIAdd(r));
}
return this.curve.jpoint(t, e, r);
}),
(u.prototype._threeDbl = function() {
var t, e, r;
if (this.zOne) {
var i = this.x.redSqr(),
n = this.y.redSqr(),
s = n.redSqr(),
o = this.x
.redAdd(n)
.redSqr()
.redISub(i)
.redISub(s);
o = o.redIAdd(o);
var a = i
.redAdd(i)
.redIAdd(i)
.redIAdd(this.curve.a),
h = a
.redSqr()
.redISub(o)
.redISub(o);
t = h;
var f = s.redIAdd(s);
(f = (f = f.redIAdd(f)).redIAdd(f)),
(e = a.redMul(o.redISub(h)).redISub(f)),
(r = this.y.redAdd(this.y));
} else {
var u = this.z.redSqr(),
c = this.y.redSqr(),
d = this.x.redMul(c),
l = this.x.redSub(u).redMul(this.x.redAdd(u));
l = l.redAdd(l).redIAdd(l);
var p = d.redIAdd(d),
b = (p = p.redIAdd(p)).redAdd(p);
(t = l.redSqr().redISub(b)),
(r = this.y
.redAdd(this.z)
.redSqr()
.redISub(c)
.redISub(u));
var m = c.redSqr();
(m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m)),
(e = l.redMul(p.redISub(t)).redISub(m));
}
return this.curve.jpoint(t, e, r);
}),
(u.prototype._dbl = function() {
var t = this.curve.a,
e = this.x,
r = this.y,
i = this.z,
n = i.redSqr().redSqr(),
s = e.redSqr(),
o = r.redSqr(),
a = s
.redAdd(s)
.redIAdd(s)
.redIAdd(t.redMul(n)),
h = e.redAdd(e),
f = (h = h.redIAdd(h)).redMul(o),
u = a.redSqr().redISub(f.redAdd(f)),
c = f.redISub(u),
d = o.redSqr();
d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
var l = a.redMul(c).redISub(d),
p = r.redAdd(r).redMul(i);
return this.curve.jpoint(u, l, p);
}),
(u.prototype.trpl = function() {
if (!this.curve.zeroA) return this.dbl().add(this);
var t = this.x.redSqr(),
e = this.y.redSqr(),
r = this.z.redSqr(),
i = e.redSqr(),
n = t.redAdd(t).redIAdd(t),
s = n.redSqr(),
o = this.x
.redAdd(e)
.redSqr()
.redISub(t)
.redISub(i),
a = (o = (o = (o = o.redIAdd(o)).redAdd(o).redIAdd(o)).redISub(
s
)).redSqr(),
h = i.redIAdd(i);
h = (h = (h = h.redIAdd(h)).redIAdd(h)).redIAdd(h);
var f = n
.redIAdd(o)
.redSqr()
.redISub(s)
.redISub(a)
.redISub(h),
u = e.redMul(f);
u = (u = u.redIAdd(u)).redIAdd(u);
var c = this.x.redMul(a).redISub(u);
c = (c = c.redIAdd(c)).redIAdd(c);
var d = this.y.redMul(
f.redMul(h.redISub(f)).redISub(o.redMul(a))
);
d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
var l = this.z
.redAdd(o)
.redSqr()
.redISub(r)
.redISub(a);
return this.curve.jpoint(c, d, l);
}),
(u.prototype.mul = function(t, e) {
return (t = new n(t, e)), this.curve._wnafMul(this, t);
}),
(u.prototype.eq = function(t) {
if ("affine" === t.type) return this.eq(t.toJ());
if (this === t) return !0;
var e = this.z.redSqr(),
r = t.z.redSqr();
if (
0 !==
this.x
.redMul(r)
.redISub(t.x.redMul(e))
.cmpn(0)
)
return !1;
var i = e.redMul(this.z),
n = r.redMul(t.z);
return (
0 ===
this.y
.redMul(n)
.redISub(t.y.redMul(i))
.cmpn(0)
);
}),
(u.prototype.eqXToP = function(t) {
var e = this.z.redSqr(),
r = t.toRed(this.curve.red).redMul(e);
if (0 === this.x.cmp(r)) return !0;
for (var i = t.clone(), n = this.curve.redN.redMul(e); ; ) {
if ((i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0)) return !1;
if ((r.redIAdd(n), 0 === this.x.cmp(r))) return !0;
}
}),
(u.prototype.inspect = function() {
return this.isInfinity()
? "<EC JPoint Infinity>"
: "<EC JPoint x: " +
this.x.toString(16, 2) +
" y: " +
this.y.toString(16, 2) +
" z: " +
this.z.toString(16, 2) +
">";
}),
(u.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
});
},
4626: (t, e, r) => {
"use strict";
var i,
n,
s,
o = e,
a = r(3715),
h = r(5104),
f = r(7359).assert;
function u(t) {
if ("short" !== t.type) throw new Error("invalid curve type");
(this.curve = new h.short(t)),
(this.g = this.curve.g),
(this.n = this.curve.n),
(this.hash = t.hash),
f(this.g.validate(), "Invalid curve"),
f(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
}
o.PresetCurve = u;
try {
i = r(2059);
} catch (t) {
i = void 0;
}
(n = "secp256k1"),
(s = {
type: "short",
prime: "k256",
p:
"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
a: "0",
b: "7",
n:
"ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
h: "1",
hash: a.sha256,
beta:
"7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
lambda:
"5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
basis: [
{
a: "3086d221a7d46bcde86c90e49284eb15",
b: "-e4437ed6010e88286f547fa90abfe4c3",
},
{
a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
b: "3086d221a7d46bcde86c90e49284eb15",
},
],
gRed: !1,
g: [
"79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
"483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
i,
],
}),
Object.defineProperty(o, n, {
configurable: !0,
enumerable: !0,
get: function() {
var t = new u(s);
return (
Object.defineProperty(o, n, {
configurable: !0,
enumerable: !0,
value: t,
}),
t
);
},
});
},
5630: (t, e, r) => {
"use strict";
var i = r(3550),
n = r(2156),
s = r(7359),
o = r(4626),
a = r(9931),
h = s.assert,
f = r(1119),
u = r(1911);
function c(t) {
if (!(this instanceof c)) return new c(t);
"string" == typeof t &&
(h(o.hasOwnProperty(t), "Unknown curve " + t), (t = o[t])),
t instanceof o.PresetCurve && (t = { curve: t }),
(this.curve = t.curve.curve),
(this.n = this.curve.n),
(this.nh = this.n.ushrn(1)),
(this.g = this.curve.g),
(this.g = t.curve.g),
this.g.precompute(t.curve.n.bitLength() + 1),
(this.hash = t.hash || t.curve.hash);
}
(t.exports = c),
(c.prototype.keyPair = function(t) {
return new f(this, t);
}),
(c.prototype.keyFromPrivate = function(t, e) {
return f.fromPrivate(this, t, e);
}),
(c.prototype.keyFromPublic = function(t, e) {
return f.fromPublic(this, t, e);
}),
(c.prototype.genKeyPair = function(t) {
t || (t = {});
for (
var e = new n({
hash: this.hash,
pers: t.pers,
persEnc: t.persEnc || "utf8",
entropy: t.entropy || a(this.hash.hmacStrength),
entropyEnc: (t.entropy && t.entropyEnc) || "utf8",
nonce: this.n.toArray(),
}),
r = this.n.byteLength(),
s = this.n.sub(new i(2));
;

) {
var o = new i(e.generate(r));
if (!(o.cmp(s) > 0)) return o.iaddn(1), this.keyFromPrivate(o);
}
}),
(c.prototype._truncateToN = function(t, e) {
var r = 8 * t.byteLength() - this.n.bitLength();
return (
r > 0 && (t = t.ushrn(r)),
!e && t.cmp(this.n) >= 0 ? t.sub(this.n) : t
);
}),
(c.prototype.sign = function(t, e, r, s) {
"object" == typeof r && ((s = r), (r = null)),
s || (s = {}),
(e = this.keyFromPrivate(e, r)),
(t = this._truncateToN(new i(t, 16)));
for (
var o = this.n.byteLength(),
a = e.getPrivate().toArray("be", o),
h = t.toArray("be", o),
f = new n({
hash: this.hash,
entropy: a,
nonce: h,
pers: s.pers,
persEnc: s.persEnc || "utf8",
}),
c = this.n.sub(new i(1)),
d = 0;
;
d++
) {
var l = s.k ? s.k(d) : new i(f.generate(this.n.byteLength()));
if (
!(
(l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(c) >= 0
)
) {
var p = this.g.mul(l);
if (!p.isInfinity()) {
var b = p.getX(),
m = b.umod(this.n);
if (0 !== m.cmpn(0)) {
var g = l.invm(this.n).mul(m.mul(e.getPrivate()).iadd(t));
if (0 !== (g = g.umod(this.n)).cmpn(0)) {
var y =
(p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(m) ? 2 : 0);
return (
s.canonical &&
g.cmp(this.nh) > 0 &&
((g = this.n.sub(g)), (y ^= 1)),
new u({ r: m, s: g, recoveryParam: y })
);
}
}
}
}
}
}),
(c.prototype.verify = function(t, e, r, n) {
(t = this._truncateToN(new i(t, 16))),
(r = this.keyFromPublic(r, n));
var s = (e = new u(e, "hex")).r,
o = e.s;
if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
var a,
h = o.invm(this.n),
f = h.mul(t).umod(this.n),
c = h.mul(s).umod(this.n);
return this.curve._maxwellTrick
? !(a = this.g.jmulAdd(f, r.getPublic(), c)).isInfinity() &&
a.eqXToP(s)
: !(a = this.g.mulAdd(f, r.getPublic(), c)).isInfinity() &&
0 ===
a
.getX()
.umod(this.n)
.cmp(s);
}),
(c.prototype.recoverPubKey = function(t, e, r, n) {
h((3 & r) === r, "The recovery param is more than two bits"),
(e = new u(e, n));
var s = this.n,
o = new i(t),
a = e.r,
f = e.s,
c = 1 & r,
d = r >> 1;
if (a.cmp(this.curve.p.umod(this.curve.n)) >= 0 && d)
throw new Error("Unable to find sencond key candinate");
a = d
? this.curve.pointFromX(a.add(this.curve.n), c)
: this.curve.pointFromX(a, c);
var l = e.r.invm(s),
p = s
.sub(o)
.mul(l)
.umod(s),
b = f.mul(l).umod(s);
return this.g.mulAdd(p, a, b);
}),
(c.prototype.getKeyRecoveryParam = function(t, e, r, i) {
if (null !== (e = new u(e, i)).recoveryParam)
return e.recoveryParam;
for (var n = 0; n < 4; n++) {
var s;
try {
s = this.recoverPubKey(t, e, n);
} catch (t) {
continue;
}
if (s.eq(r)) return n;
}
throw new Error("Unable to find valid recovery factor");
});
},
1119: (t, e, r) => {
"use strict";
var i = r(3550),
n = r(7359).assert;
function s(t, e) {
(this.ec = t),
(this.priv = null),
(this.pub = null),
e.priv && this._importPrivate(e.priv, e.privEnc),
e.pub && this._importPublic(e.pub, e.pubEnc);
}
(t.exports = s),
(s.fromPublic = function(t, e, r) {
return e instanceof s ? e : new s(t, { pub: e, pubEnc: r });
}),
(s.fromPrivate = function(t, e, r) {
return e instanceof s ? e : new s(t, { priv: e, privEnc: r });
}),
(s.prototype.validate = function() {
var t = this.getPublic();
return t.isInfinity()
? { result: !1, reason: "Invalid public key" }
: t.validate()
? t.mul(this.ec.curve.n).isInfinity()
? { result: !0, reason: null }
: { result: !1, reason: "Public key * N != O" }
: { result: !1, reason: "Public key is not a point" };
}),
(s.prototype.getPublic = function(t, e) {
return (
"string" == typeof t && ((e = t), (t = null)),
this.pub || (this.pub = this.ec.g.mul(this.priv)),
e ? this.pub.encode(e, t) : this.pub
);
}),
(s.prototype.getPrivate = function(t) {
return "hex" === t ? this.priv.toString(16, 2) : this.priv;
}),
(s.prototype._importPrivate = function(t, e) {
(this.priv = new i(t, e || 16)),
(this.priv = this.priv.umod(this.ec.curve.n));
}),
(s.prototype._importPublic = function(t, e) {
if (t.x || t.y)
return (
"mont" === this.ec.curve.type
? n(t.x, "Need x coordinate")
: ("short" !== this.ec.curve.type &&
"edwards" !== this.ec.curve.type) ||
n(t.x && t.y, "Need both x and y coordinate"),
void (this.pub = this.ec.curve.point(t.x, t.y))
);
this.pub = this.ec.curve.decodePoint(t, e);
}),
(s.prototype.derive = function(t) {
return t.mul(this.priv).getX();
}),
(s.prototype.sign = function(t, e, r) {
return this.ec.sign(t, this, e, r);
}),
(s.prototype.verify = function(t, e) {
return this.ec.verify(t, e, this);
}),
(s.prototype.inspect = function() {
return (
"<Key priv: " +
(this.priv && this.priv.toString(16, 2)) +
" pub: " +
(this.pub && this.pub.inspect()) +
" >"
);
});
},
1911: (t, e, r) => {
"use strict";
var i = r(3550),
n = r(7359),
s = n.assert;
function o(t, e) {
if (t instanceof o) return t;
this._importDER(t, e) ||
(s(t.r && t.s, "Signature without r or s"),
(this.r = new i(t.r, 16)),
(this.s = new i(t.s, 16)),
void 0 === t.recoveryParam
? (this.recoveryParam = null)
: (this.recoveryParam = t.recoveryParam));
}
function a() {
this.place = 0;
}
function h(t, e) {
var r = t[e.place++];
if (!(128 & r)) return r;
for (var i = 15 & r, n = 0, s = 0, o = e.place; s < i; s++, o++)
(n <<= 8), (n |= t[o]);
return (e.place = o), n;
}
function f(t) {
for (
var e = 0, r = t.length - 1;
!t[e] && !(128 & t[e + 1]) && e < r;

)
e++;
return 0 === e ? t : t.slice(e);
}
function u(t, e) {
if (e < 128) t.push(e);
else {
var r = 1 + ((Math.log(e) / Math.LN2) >>> 3);
for (t.push(128 | r); --r; ) t.push((e >>> (r << 3)) & 255);
t.push(e);
}
}
(t.exports = o),
(o.prototype._importDER = function(t, e) {
t = n.toArray(t, e);
var r = new a();
if (48 !== t[r.place++]) return !1;
if (h(t, r) + r.place !== t.length) return !1;
if (2 !== t[r.place++]) return !1;
var s = h(t, r),
o = t.slice(r.place, s + r.place);
if (((r.place += s), 2 !== t[r.place++])) return !1;
var f = h(t, r);
if (t.length !== f + r.place) return !1;
var u = t.slice(r.place, f + r.place);
return (
0 === o[0] && 128 & o[1] && (o = o.slice(1)),
0 === u[0] && 128 & u[1] && (u = u.slice(1)),
(this.r = new i(o)),
(this.s = new i(u)),
(this.recoveryParam = null),
!0
);
}),
(o.prototype.toDER = function(t) {
var e = this.r.toArray(),
r = this.s.toArray();
for (
128 & e[0] && (e = [0].concat(e)),
128 & r[0] && (r = [0].concat(r)),
e = f(e),
r = f(r);
!(r[0] || 128 & r[1]);

)
r = r.slice(1);
var i = [2];
u(i, e.length), (i = i.concat(e)).push(2), u(i, r.length);
var s = i.concat(r),
o = [48];
return u(o, s.length), (o = o.concat(s)), n.encode(o, t);
});
},
2059: (t) => {
t.exports = {
doubles: {
step: 4,
points: [
[
"e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
"f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821",
],
[
"8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
"11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf",
],
[
"175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
"d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695",
],
[
"363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
"4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9",
],
[
"8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
"4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36",
],
[
"723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
"96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f",
],
[
"eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
"5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999",
],
[
"100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
"cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09",
],
[
"e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
"9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d",
],
[
"feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
"e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088",
],
[
"da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
"9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d",
],
[
"53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
"5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8",
],
[
"8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
"10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a",
],
[
"385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
"283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453",
],
[
"6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
"7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160",
],
[
"3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
"56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0",
],
[
"85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
"7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6",
],
[
"948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
"53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589",
],
[
"6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
"bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17",
],
[
"e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
"4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda",
],
[
"e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
"7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd",
],
[
"213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
"4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2",
],
[
"4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
"17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6",
],
[
"fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
"6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f",
],
[
"76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
"c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01",
],
[
"c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
"893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3",
],
[
"d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
"febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f",
],
[
"b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
"2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7",
],
[
"e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
"eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78",
],
[
"a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
"7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1",
],
[
"90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
"e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150",
],
[
"8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
"662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82",
],
[
"e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
"1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc",
],
[
"8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
"efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b",
],
[
"e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
"2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51",
],
[
"b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
"67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45",
],
[
"d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
"db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120",
],
[
"324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
"648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84",
],
[
"4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
"35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d",
],
[
"9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
"ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d",
],
[
"6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
"9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8",
],
[
"a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
"40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8",
],
[
"7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
"34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac",
],
[
"928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
"c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f",
],
[
"85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
"1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962",
],
[
"ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
"493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907",
],
[
"827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
"c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec",
],
[
"eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
"be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d",
],
[
"e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
"4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414",
],
[
"1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
"aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd",
],
[
"146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
"b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0",
],
[
"fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
"6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811",
],
[
"da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
"8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1",
],
[
"a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
"7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c",
],
[
"174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
"ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73",
],
[
"959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
"2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd",
],
[
"d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
"e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405",
],
[
"64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
"d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589",
],
[
"8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
"38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e",
],
[
"13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
"69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27",
],
[
"bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
"d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1",
],
[
"8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
"40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482",
],
[
"8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
"620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945",
],
[
"dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
"7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573",
],
[
"f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
"ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82",
],
],
},
naf: {
wnd: 7,
points: [
[
"f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
"388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672",
],
[
"2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
"d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6",
],
[
"5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
"6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da",
],
[
"acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
"cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37",
],
[
"774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
"d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b",
],
[
"f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
"ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81",
],
[
"d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
"581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58",
],
[
"defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
"4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77",
],
[
"2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
"85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a",
],
[
"352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
"321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c",
],
[
"2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
"2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67",
],
[
"9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
"73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402",
],
[
"daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
"a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55",
],
[
"c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
"2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482",
],
[
"6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
"e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82",
],
[
"1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
"b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396",
],
[
"605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
"2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49",
],
[
"62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
"80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf",
],
[
"80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
"1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a",
],
[
"7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
"d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7",
],
[
"d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
"eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933",
],
[
"49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
"758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a",
],
[
"77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
"958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6",
],
[
"f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
"e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37",
],
[
"463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
"5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e",
],
[
"f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
"cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6",
],
[
"caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
"cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476",
],
[
"2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
"4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40",
],
[
"7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
"91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61",
],
[
"754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
"673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683",
],
[
"e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
"59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5",
],
[
"186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
"3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b",
],
[
"df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
"55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417",
],
[
"5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
"efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868",
],
[
"290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
"e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a",
],
[
"af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
"f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6",
],
[
"766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
"744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996",
],
[
"59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
"c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e",
],
[
"f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
"e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d",
],
[
"7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
"30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2",
],
[
"948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
"e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e",
],
[
"7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
"100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437",
],
[
"3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
"ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311",
],
[
"d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
"8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4",
],
[
"1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
"68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575",
],
[
"733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
"f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d",
],
[
"15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
"d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d",
],
[
"a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
"edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629",
],
[
"e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
"a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06",
],
[
"311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
"66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374",
],
[
"34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
"9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee",
],
[
"f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
"4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1",
],
[
"d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
"fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b",
],
[
"32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
"5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661",
],
[
"7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
"8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6",
],
[
"ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
"8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e",
],
[
"16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
"5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d",
],
[
"eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
"f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc",
],
[
"78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
"f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4",
],
[
"494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
"42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c",
],
[
"a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
"204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b",
],
[
"c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
"4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913",
],
[
"841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
"73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154",
],
[
"5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
"39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865",
],
[
"36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
"d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc",
],
[
"336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
"ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224",
],
[
"8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
"6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e",
],
[
"1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
"60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6",
],
[
"85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
"3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511",
],
[
"29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
"b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b",
],
[
"a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
"ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2",
],
[
"4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
"cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c",
],
[
"d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
"6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3",
],
[
"ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
"322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d",
],
[
"af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
"6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700",
],
[
"e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
"2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4",
],
[
"591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
"b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196",
],
[
"11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
"998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4",
],
[
"3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
"b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257",
],
[
"cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
"bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13",
],
[
"c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
"6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096",
],
[
"c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
"c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38",
],
[
"a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
"21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f",
],
[
"347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
"60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448",
],
[
"da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
"49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a",
],
[
"c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
"5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4",
],
[
"4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
"7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437",
],
[
"3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
"be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7",
],
[
"cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
"8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d",
],
[
"b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
"39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a",
],
[
"d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
"62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54",
],
[
"48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
"25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77",
],
[
"dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
"ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517",
],
[
"6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
"cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10",
],
[
"e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
"f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125",
],
[
"eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
"6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e",
],
[
"13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
"fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1",
],
[
"ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
"1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2",
],
[
"b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
"5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423",
],
[
"ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
"438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8",
],
[
"8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
"cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758",
],
[
"52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
"c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375",
],
[
"e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
"6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d",
],
[
"7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
"ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec",
],
[
"5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
"9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0",
],
[
"32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
"ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c",
],
[
"e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
"d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4",
],
[
"8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
"c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f",
],
[
"4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
"67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649",
],
[
"3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
"cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826",
],
[
"674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
"299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5",
],
[
"d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
"f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87",
],
[
"30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
"462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b",
],
[
"be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
"62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc",
],
[
"93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
"7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c",
],
[
"b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
"ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f",
],
[
"d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
"4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a",
],
[
"d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
"bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46",
],
[
"463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
"bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f",
],
[
"7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
"603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03",
],
[
"74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
"cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08",
],
[
"30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
"553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8",
],
[
"9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
"712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373",
],
[
"176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
"ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3",
],
[
"75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
"9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8",
],
[
"809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
"9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1",
],
[
"1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
"4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9",
],
],
},
};
},
7359: (t, e, r) => {
"use strict";
var i = e,
n = r(3550),
s = r(9746),
o = r(4504);
(i.assert = s),
(i.toArray = o.toArray),
(i.zero2 = o.zero2),
(i.toHex = o.toHex),
(i.encode = o.encode),
(i.getNAF = function(t, e, r) {
var i = new Array(Math.max(t.bitLength(), r) + 1);
i.fill(0);
for (
var n = 1 << (e + 1), s = t.clone(), o = 0;
o < i.length;
o++
) {
var a,
h = s.andln(n - 1);
s.isOdd()
? ((a = h > (n >> 1) - 1 ? (n >> 1) - h : h), s.isubn(a))
: (a = 0),
(i[o] = a),
s.iushrn(1);
}
return i;
}),
(i.getJSF = function(t, e) {
var r = [[], []];
(t = t.clone()), (e = e.clone());
for (var i = 0, n = 0; t.cmpn(-i) > 0 || e.cmpn(-n) > 0; ) {
var s,
o,
a,
h = (t.andln(3) + i) & 3,
f = (e.andln(3) + n) & 3;
3 === h && (h = -1),
3 === f && (f = -1),
(s =
0 == (1 & h)
? 0
: (3 != (a = (t.andln(7) + i) & 7) && 5 !== a) || 2 !== f
? h
: -h),
r[0].push(s),
(o =
0 == (1 & f)
? 0
: (3 != (a = (e.andln(7) + n) & 7) && 5 !== a) || 2 !== h
? f
: -f),
r[1].push(o),
2 * i === s + 1 && (i = 1 - i),
2 * n === o + 1 && (n = 1 - n),
t.iushrn(1),
e.iushrn(1);
}
return r;
}),
(i.cachedProperty = function(t, e, r) {
var i = "_" + e;
t.prototype[e] = function() {
return void 0 !== this[i] ? this[i] : (this[i] = r.call(this));
};
}),
(i.parseBytes = function(t) {
return "string" == typeof t ? i.toArray(t, "hex") : t;
}),
(i.intFromLE = function(t) {
return new n(t, "hex", "le");
});
},
60: (t) => {
"use strict";
t.exports = { i8: "7.0.1" };
},
3550: function(t, e, r) {
!(function(t, e) {
"use strict";
function i(t, e) {
if (!t) throw new Error(e || "Assertion failed");
}
function n(t, e) {
t.super_ = e;
var r = function() {};
(r.prototype = e.prototype),
(t.prototype = new r()),
(t.prototype.constructor = t);
}
function s(t, e, r) {
if (s.isBN(t)) return t;
(this.negative = 0),
(this.words = null),
(this.length = 0),
(this.red = null),
null !== t &&
(("le" !== e && "be" !== e) || ((r = e), (e = 10)),
this._init(t || 0, e || 10, r || "be"));
}
var o;
"object" == typeof t ? (t.exports = s) : (e.BN = s),
(s.BN = s),
(s.wordSize = 26);
try {
o =
"undefined" != typeof window && void 0 !== window.Buffer
? window.Buffer
: r(6601).Buffer;
} catch (t) {}
function a(t, e) {
var r = t.charCodeAt(e);
return r >= 48 && r <= 57
? r - 48
: r >= 65 && r <= 70
? r - 55
: r >= 97 && r <= 102
? r - 87
: void i(!1, "Invalid character in " + t);
}
function h(t, e, r) {
var i = a(t, r);
return r - 1 >= e && (i |= a(t, r - 1) << 4), i;
}
function f(t, e, r, n) {
for (
var s = 0, o = 0, a = Math.min(t.length, r), h = e;
h < a;
h++
) {
var f = t.charCodeAt(h) - 48;
(s *= n),
(o = f >= 49 ? f - 49 + 10 : f >= 17 ? f - 17 + 10 : f),
i(f >= 0 && o < n, "Invalid character"),
(s += o);
}
return s;
}
function u(t, e) {
(t.words = e.words),
(t.length = e.length),
(t.negative = e.negative),
(t.red = e.red);
}
if (
((s.isBN = function(t) {
return (
t instanceof s ||
(null !== t &&
"object" == typeof t &&
t.constructor.wordSize === s.wordSize &&
Array.isArray(t.words))
);
}),
(s.max = function(t, e) {
return t.cmp(e) > 0 ? t : e;
}),
(s.min = function(t, e) {
return t.cmp(e) < 0 ? t : e;
}),
(s.prototype._init = function(t, e, r) {
if ("number" == typeof t) return this._initNumber(t, e, r);
if ("object" == typeof t) return this._initArray(t, e, r);
"hex" === e && (e = 16), i(e === (0 | e) && e >= 2 && e <= 36);
var n = 0;
"-" === (t = t.toString().replace(/\s+/g, ""))[0] &&
(n++, (this.negative = 1)),
n < t.length &&
(16 === e
? this._parseHex(t, n, r)
: (this._parseBase(t, e, n),
"le" === r && this._initArray(this.toArray(), e, r)));
}),
(s.prototype._initNumber = function(t, e, r) {
t < 0 && ((this.negative = 1), (t = -t)),
t < 67108864
? ((this.words = [67108863 & t]), (this.length = 1))
: t < 4503599627370496
? ((this.words = [67108863 & t, (t / 67108864) & 67108863]),
(this.length = 2))
: (i(t < 9007199254740992),
(this.words = [
67108863 & t,
(t / 67108864) & 67108863,
1,
]),
(this.length = 3)),
"le" === r && this._initArray(this.toArray(), e, r);
}),
(s.prototype._initArray = function(t, e, r) {
if ((i("number" == typeof t.length), t.length <= 0))
return (this.words = [0]), (this.length = 1), this;
(this.length = Math.ceil(t.length / 3)),
(this.words = new Array(this.length));
for (var n = 0; n < this.length; n++) this.words[n] = 0;
var s,
o,
a = 0;
if ("be" === r)
for (n = t.length - 1, s = 0; n >= 0; n -= 3)
(o = t[n] | (t[n - 1] << 8) | (t[n - 2] << 16)),
(this.words[s] |= (o << a) & 67108863),
(this.words[s + 1] = (o >>> (26 - a)) & 67108863),
(a += 24) >= 26 && ((a -= 26), s++);
else if ("le" === r)
for (n = 0, s = 0; n < t.length; n += 3)
(o = t[n] | (t[n + 1] << 8) | (t[n + 2] << 16)),
(this.words[s] |= (o << a) & 67108863),
(this.words[s + 1] = (o >>> (26 - a)) & 67108863),
(a += 24) >= 26 && ((a -= 26), s++);
return this._strip();
}),
(s.prototype._parseHex = function(t, e, r) {
(this.length = Math.ceil((t.length - e) / 6)),
(this.words = new Array(this.length));
for (var i = 0; i < this.length; i++) this.words[i] = 0;
var n,
s = 0,
o = 0;
if ("be" === r)
for (i = t.length - 1; i >= e; i -= 2)
(n = h(t, e, i) << s),
(this.words[o] |= 67108863 & n),
s >= 18
? ((s -= 18), (o += 1), (this.words[o] |= n >>> 26))
: (s += 8);
else
for (
i = (t.length - e) % 2 == 0 ? e + 1 : e;
i < t.length;
i += 2
)
(n = h(t, e, i) << s),
(this.words[o] |= 67108863 & n),
s >= 18
? ((s -= 18), (o += 1), (this.words[o] |= n >>> 26))
: (s += 8);
this._strip();
}),
(s.prototype._parseBase = function(t, e, r) {
(this.words = [0]), (this.length = 1);
for (var i = 0, n = 1; n <= 67108863; n *= e) i++;
i--, (n = (n / e) | 0);
for (
var s = t.length - r,
o = s % i,
a = Math.min(s, s - o) + r,
h = 0,
u = r;
u < a;
u += i
)
(h = f(t, u, u + i, e)),
this.imuln(n),
this.words[0] + h < 67108864
? (this.words[0] += h)
: this._iaddn(h);
if (0 !== o) {
var c = 1;
for (h = f(t, u, t.length, e), u = 0; u < o; u++) c *= e;
this.imuln(c),
this.words[0] + h < 67108864
? (this.words[0] += h)
: this._iaddn(h);
}
this._strip();
}),
(s.prototype.copy = function(t) {
t.words = new Array(this.length);
for (var e = 0; e < this.length; e++)
t.words[e] = this.words[e];
(t.length = this.length),
(t.negative = this.negative),
(t.red = this.red);
}),
(s.prototype._move = function(t) {
u(t, this);
}),
(s.prototype.clone = function() {
var t = new s(null);
return this.copy(t), t;
}),
(s.prototype._expand = function(t) {
for (; this.length < t; ) this.words[this.length++] = 0;
return this;
}),
(s.prototype._strip = function() {
for (; this.length > 1 && 0 === this.words[this.length - 1]; )
this.length--;
return this._normSign();
}),
(s.prototype._normSign = function() {
return (
1 === this.length &&
0 === this.words[0] &&
(this.negative = 0),
this
);
}),
"undefined" != typeof Symbol && "function" == typeof Symbol.for)
)
try {
s.prototype[Symbol.for("nodejs.util.inspect.custom")] = c;
} catch (t) {
s.prototype.inspect = c;
}
else s.prototype.inspect = c;
function c() {
return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
}
var d = [
"",
"0",
"00",
"000",
"0000",
"00000",
"000000",
"0000000",
"00000000",
"000000000",
"0000000000",
"00000000000",
"000000000000",
"0000000000000",
"00000000000000",
"000000000000000",
"0000000000000000",
"00000000000000000",
"000000000000000000",
"0000000000000000000",
"00000000000000000000",
"000000000000000000000",
"0000000000000000000000",
"00000000000000000000000",
"000000000000000000000000",
"0000000000000000000000000",
],
l = [
0,
0,
25,
16,
12,
11,
10,
9,
8,
8,
7,
7,
7,
7,
6,
6,
6,
6,
6,
6,
6,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
5,
],
p = [
0,
0,
33554432,
43046721,
16777216,
48828125,
60466176,
40353607,
16777216,
43046721,
1e7,
19487171,
35831808,
62748517,
7529536,
11390625,
16777216,
24137569,
34012224,
47045881,
64e6,
4084101,
5153632,
6436343,
7962624,
9765625,
11881376,
14348907,
17210368,
20511149,
243e5,
28629151,
33554432,
39135393,
45435424,
52521875,
60466176,
];
function b(t, e, r) {
r.negative = e.negative ^ t.negative;
var i = (t.length + e.length) | 0;
(r.length = i), (i = (i - 1) | 0);
var n = 0 | t.words[0],
s = 0 | e.words[0],
o = n * s,
a = 67108863 & o,
h = (o / 67108864) | 0;
r.words[0] = a;
for (var f = 1; f < i; f++) {
for (
var u = h >>> 26,
c = 67108863 & h,
d = Math.min(f, e.length - 1),
l = Math.max(0, f - t.length + 1);
l <= d;
l++
) {
var p = (f - l) | 0;
(u +=
((o = (n = 0 | t.words[p]) * (s = 0 | e.words[l]) + c) /
67108864) |
0),
(c = 67108863 & o);
}
(r.words[f] = 0 | c), (h = 0 | u);
}
return 0 !== h ? (r.words[f] = 0 | h) : r.length--, r._strip();
}
(s.prototype.toString = function(t, e) {
var r;
if (((e = 0 | e || 1), 16 === (t = t || 10) || "hex" === t)) {
r = "";
for (var n = 0, s = 0, o = 0; o < this.length; o++) {
var a = this.words[o],
h = (16777215 & ((a << n) | s)).toString(16);
(r =
0 != (s = (a >>> (24 - n)) & 16777215) ||
o !== this.length - 1
? d[6 - h.length] + h + r
: h + r),
(n += 2) >= 26 && ((n -= 26), o--);
}
for (0 !== s && (r = s.toString(16) + r); r.length % e != 0; )
r = "0" + r;
return 0 !== this.negative && (r = "-" + r), r;
}
if (t === (0 | t) && t >= 2 && t <= 36) {
var f = l[t],
u = p[t];
r = "";
var c = this.clone();
for (c.negative = 0; !c.isZero(); ) {
var b = c.modrn(u).toString(t);
r = (c = c.idivn(u)).isZero()
? b + r
: d[f - b.length] + b + r;
}
for (this.isZero() && (r = "0" + r); r.length % e != 0; )
r = "0" + r;
return 0 !== this.negative && (r = "-" + r), r;
}
i(!1, "Base should be between 2 and 36");
}),
(s.prototype.toNumber = function() {
var t = this.words[0];
return (
2 === this.length
? (t += 67108864 * this.words[1])
: 3 === this.length && 1 === this.words[2]
? (t += 4503599627370496 + 67108864 * this.words[1])
: this.length > 2 &&
i(!1, "Number can only safely store up to 53 bits"),
0 !== this.negative ? -t : t
);
}),
(s.prototype.toJSON = function() {
return this.toString(16, 2);
}),
o &&
(s.prototype.toBuffer = function(t, e) {
return this.toArrayLike(o, t, e);
}),
(s.prototype.toArray = function(t, e) {
return this.toArrayLike(Array, t, e);
}),
(s.prototype.toArrayLike = function(t, e, r) {
this._strip();
var n = this.byteLength(),
s = r || Math.max(1, n);
i(n <= s, "byte array longer than desired length"),
i(s > 0, "Requested array length <= 0");
var o = (function(t, e) {
return t.allocUnsafe ? t.allocUnsafe(e) : new t(e);
})(t, s);
return (
this["_toArrayLike" + ("le" === e ? "LE" : "BE")](o, n), o
);
}),
(s.prototype._toArrayLikeLE = function(t, e) {
for (var r = 0, i = 0, n = 0, s = 0; n < this.length; n++) {
var o = (this.words[n] << s) | i;
(t[r++] = 255 & o),
r < t.length && (t[r++] = (o >> 8) & 255),
r < t.length && (t[r++] = (o >> 16) & 255),
6 === s
? (r < t.length && (t[r++] = (o >> 24) & 255),
(i = 0),
(s = 0))
: ((i = o >>> 24), (s += 2));
}
if (r < t.length) for (t[r++] = i; r < t.length; ) t[r++] = 0;
}),
(s.prototype._toArrayLikeBE = function(t, e) {
for (
var r = t.length - 1, i = 0, n = 0, s = 0;
n < this.length;
n++
) {
var o = (this.words[n] << s) | i;
(t[r--] = 255 & o),
r >= 0 && (t[r--] = (o >> 8) & 255),
r >= 0 && (t[r--] = (o >> 16) & 255),
6 === s
? (r >= 0 && (t[r--] = (o >> 24) & 255), (i = 0), (s = 0))
: ((i = o >>> 24), (s += 2));
}
if (r >= 0) for (t[r--] = i; r >= 0; ) t[r--] = 0;
}),
Math.clz32
? (s.prototype._countBits = function(t) {
return 32 - Math.clz32(t);
})
: (s.prototype._countBits = function(t) {
var e = t,
r = 0;
return (
e >= 4096 && ((r += 13), (e >>>= 13)),
e >= 64 && ((r += 7), (e >>>= 7)),
e >= 8 && ((r += 4), (e >>>= 4)),
e >= 2 && ((r += 2), (e >>>= 2)),
r + e
);
}),
(s.prototype._zeroBits = function(t) {
if (0 === t) return 26;
var e = t,
r = 0;
return (
0 == (8191 & e) && ((r += 13), (e >>>= 13)),
0 == (127 & e) && ((r += 7), (e >>>= 7)),
0 == (15 & e) && ((r += 4), (e >>>= 4)),
0 == (3 & e) && ((r += 2), (e >>>= 2)),
0 == (1 & e) && r++,
r
);
}),
(s.prototype.bitLength = function() {
var t = this.words[this.length - 1],
e = this._countBits(t);
return 26 * (this.length - 1) + e;
}),
(s.prototype.zeroBits = function() {
if (this.isZero()) return 0;
for (var t = 0, e = 0; e < this.length; e++) {
var r = this._zeroBits(this.words[e]);
if (((t += r), 26 !== r)) break;
}
return t;
}),
(s.prototype.byteLength = function() {
return Math.ceil(this.bitLength() / 8);
}),
(s.prototype.toTwos = function(t) {
return 0 !== this.negative
? this.abs()
.inotn(t)
.iaddn(1)
: this.clone();
}),
(s.prototype.fromTwos = function(t) {
return this.testn(t - 1)
? this.notn(t)
.iaddn(1)
.ineg()
: this.clone();
}),
(s.prototype.isNeg = function() {
return 0 !== this.negative;
}),
(s.prototype.neg = function() {
return this.clone().ineg();
}),
(s.prototype.ineg = function() {
return this.isZero() || (this.negative ^= 1), this;
}),
(s.prototype.iuor = function(t) {
for (; this.length < t.length; ) this.words[this.length++] = 0;
for (var e = 0; e < t.length; e++)
this.words[e] = this.words[e] | t.words[e];
return this._strip();
}),
(s.prototype.ior = function(t) {
return i(0 == (this.negative | t.negative)), this.iuor(t);
}),
(s.prototype.or = function(t) {
return this.length > t.length
? this.clone().ior(t)
: t.clone().ior(this);
}),
(s.prototype.uor = function(t) {
return this.length > t.length
? this.clone().iuor(t)
: t.clone().iuor(this);
}),
(s.prototype.iuand = function(t) {
var e;
e = this.length > t.length ? t : this;
for (var r = 0; r < e.length; r++)
this.words[r] = this.words[r] & t.words[r];
return (this.length = e.length), this._strip();
}),
(s.prototype.iand = function(t) {
return i(0 == (this.negative | t.negative)), this.iuand(t);
}),
(s.prototype.and = function(t) {
return this.length > t.length
? this.clone().iand(t)
: t.clone().iand(this);
}),
(s.prototype.uand = function(t) {
return this.length > t.length
? this.clone().iuand(t)
: t.clone().iuand(this);
}),
(s.prototype.iuxor = function(t) {
var e, r;
this.length > t.length
? ((e = this), (r = t))
: ((e = t), (r = this));
for (var i = 0; i < r.length; i++)
this.words[i] = e.words[i] ^ r.words[i];
if (this !== e)
for (; i < e.length; i++) this.words[i] = e.words[i];
return (this.length = e.length), this._strip();
}),
(s.prototype.ixor = function(t) {
return i(0 == (this.negative | t.negative)), this.iuxor(t);
}),
(s.prototype.xor = function(t) {
return this.length > t.length
? this.clone().ixor(t)
: t.clone().ixor(this);
}),
(s.prototype.uxor = function(t) {
return this.length > t.length
? this.clone().iuxor(t)
: t.clone().iuxor(this);
}),
(s.prototype.inotn = function(t) {
i("number" == typeof t && t >= 0);
var e = 0 | Math.ceil(t / 26),
r = t % 26;
this._expand(e), r > 0 && e--;
for (var n = 0; n < e; n++)
this.words[n] = 67108863 & ~this.words[n];
return (
r > 0 &&
(this.words[n] = ~this.words[n] & (67108863 >> (26 - r))),
this._strip()
);
}),
(s.prototype.notn = function(t) {
return this.clone().inotn(t);
}),
(s.prototype.setn = function(t, e) {
i("number" == typeof t && t >= 0);
var r = (t / 26) | 0,
n = t % 26;
return (
this._expand(r + 1),
(this.words[r] = e
? this.words[r] | (1 << n)
: this.words[r] & ~(1 << n)),
this._strip()
);
}),
(s.prototype.iadd = function(t) {
var e, r, i;
if (0 !== this.negative && 0 === t.negative)
return (
(this.negative = 0),
(e = this.isub(t)),
(this.negative ^= 1),
this._normSign()
);
if (0 === this.negative && 0 !== t.negative)
return (
(t.negative = 0),
(e = this.isub(t)),
(t.negative = 1),
e._normSign()
);
this.length > t.length
? ((r = this), (i = t))
: ((r = t), (i = this));
for (var n = 0, s = 0; s < i.length; s++)
(e = (0 | r.words[s]) + (0 | i.words[s]) + n),
(this.words[s] = 67108863 & e),
(n = e >>> 26);
for (; 0 !== n && s < r.length; s++)
(e = (0 | r.words[s]) + n),
(this.words[s] = 67108863 & e),
(n = e >>> 26);
if (((this.length = r.length), 0 !== n))
(this.words[this.length] = n), this.length++;
else if (r !== this)
for (; s < r.length; s++) this.words[s] = r.words[s];
return this;
}),
(s.prototype.add = function(t) {
var e;
return 0 !== t.negative && 0 === this.negative
? ((t.negative = 0), (e = this.sub(t)), (t.negative ^= 1), e)
: 0 === t.negative && 0 !== this.negative
? ((this.negative = 0),
(e = t.sub(this)),
(this.negative = 1),
e)
: this.length > t.length
? this.clone().iadd(t)
: t.clone().iadd(this);
}),
(s.prototype.isub = function(t) {
if (0 !== t.negative) {
t.negative = 0;
var e = this.iadd(t);
return (t.negative = 1), e._normSign();
}
if (0 !== this.negative)
return (
(this.negative = 0),
this.iadd(t),
(this.negative = 1),
this._normSign()
);
var r,
i,
n = this.cmp(t);
if (0 === n)
return (
(this.negative = 0),
(this.length = 1),
(this.words[0] = 0),
this
);
n > 0 ? ((r = this), (i = t)) : ((r = t), (i = this));
for (var s = 0, o = 0; o < i.length; o++)
(s = (e = (0 | r.words[o]) - (0 | i.words[o]) + s) >> 26),
(this.words[o] = 67108863 & e);
for (; 0 !== s && o < r.length; o++)
(s = (e = (0 | r.words[o]) + s) >> 26),
(this.words[o] = 67108863 & e);
if (0 === s && o < r.length && r !== this)
for (; o < r.length; o++) this.words[o] = r.words[o];
return (
(this.length = Math.max(this.length, o)),
r !== this && (this.negative = 1),
this._strip()
);
}),
(s.prototype.sub = function(t) {
return this.clone().isub(t);
});
var m = function(t, e, r) {
var i,
n,
s,
o = t.words,
a = e.words,
h = r.words,
f = 0,
u = 0 | o[0],
c = 8191 & u,
d = u >>> 13,
l = 0 | o[1],
p = 8191 & l,
b = l >>> 13,
m = 0 | o[2],
g = 8191 & m,
y = m >>> 13,
w = 0 | o[3],
v = 8191 & w,
_ = w >>> 13,
S = 0 | o[4],
E = 8191 & S,
I = S >>> 13,
O = 0 | o[5],
B = 8191 & O,
k = O >>> 13,
P = 0 | o[6],
R = 8191 & P,
A = P >>> 13,
N = 0 | o[7],
x = 8191 & N,
M = N >>> 13,
T = 0 | o[8],
C = 8191 & T,
L = T >>> 13,
H = 0 | o[9],
U = 8191 & H,
F = H >>> 13,
K = 0 | a[0],
D = 8191 & K,
V = K >>> 13,
j = 0 | a[1],
q = 8191 & j,
z = j >>> 13,
G = 0 | a[2],
Y = 8191 & G,
J = G >>> 13,
W = 0 | a[3],
X = 8191 & W,
Q = W >>> 13,
Z = 0 | a[4],
$ = 8191 & Z,
tt = Z >>> 13,
et = 0 | a[5],
rt = 8191 & et,
it = et >>> 13,
nt = 0 | a[6],
st = 8191 & nt,
ot = nt >>> 13,
at = 0 | a[7],
ht = 8191 & at,
ft = at >>> 13,
ut = 0 | a[8],
ct = 8191 & ut,
dt = ut >>> 13,
lt = 0 | a[9],
pt = 8191 & lt,
bt = lt >>> 13;
(r.negative = t.negative ^ e.negative), (r.length = 19);
var mt =
(((f + (i = Math.imul(c, D))) | 0) +
((8191 &
(n = ((n = Math.imul(c, V)) + Math.imul(d, D)) | 0)) <<
13)) |
0;
(f =
((((s = Math.imul(d, V)) + (n >>> 13)) | 0) + (mt >>> 26)) | 0),
(mt &= 67108863),
(i = Math.imul(p, D)),
(n = ((n = Math.imul(p, V)) + Math.imul(b, D)) | 0),
(s = Math.imul(b, V));
var gt =
(((f + (i = (i + Math.imul(c, q)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, z)) | 0) + Math.imul(d, q)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, z)) | 0) + (n >>> 13)) | 0) +
(gt >>> 26)) |
0),
(gt &= 67108863),
(i = Math.imul(g, D)),
(n = ((n = Math.imul(g, V)) + Math.imul(y, D)) | 0),
(s = Math.imul(y, V)),
(i = (i + Math.imul(p, q)) | 0),
(n = ((n = (n + Math.imul(p, z)) | 0) + Math.imul(b, q)) | 0),
(s = (s + Math.imul(b, z)) | 0);
var yt =
(((f + (i = (i + Math.imul(c, Y)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, J)) | 0) + Math.imul(d, Y)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, J)) | 0) + (n >>> 13)) | 0) +
(yt >>> 26)) |
0),
(yt &= 67108863),
(i = Math.imul(v, D)),
(n = ((n = Math.imul(v, V)) + Math.imul(_, D)) | 0),
(s = Math.imul(_, V)),
(i = (i + Math.imul(g, q)) | 0),
(n = ((n = (n + Math.imul(g, z)) | 0) + Math.imul(y, q)) | 0),
(s = (s + Math.imul(y, z)) | 0),
(i = (i + Math.imul(p, Y)) | 0),
(n = ((n = (n + Math.imul(p, J)) | 0) + Math.imul(b, Y)) | 0),
(s = (s + Math.imul(b, J)) | 0);
var wt =
(((f + (i = (i + Math.imul(c, X)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, Q)) | 0) + Math.imul(d, X)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, Q)) | 0) + (n >>> 13)) | 0) +
(wt >>> 26)) |
0),
(wt &= 67108863),
(i = Math.imul(E, D)),
(n = ((n = Math.imul(E, V)) + Math.imul(I, D)) | 0),
(s = Math.imul(I, V)),
(i = (i + Math.imul(v, q)) | 0),
(n = ((n = (n + Math.imul(v, z)) | 0) + Math.imul(_, q)) | 0),
(s = (s + Math.imul(_, z)) | 0),
(i = (i + Math.imul(g, Y)) | 0),
(n = ((n = (n + Math.imul(g, J)) | 0) + Math.imul(y, Y)) | 0),
(s = (s + Math.imul(y, J)) | 0),
(i = (i + Math.imul(p, X)) | 0),
(n = ((n = (n + Math.imul(p, Q)) | 0) + Math.imul(b, X)) | 0),
(s = (s + Math.imul(b, Q)) | 0);
var vt =
(((f + (i = (i + Math.imul(c, $)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, tt)) | 0) + Math.imul(d, $)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, tt)) | 0) + (n >>> 13)) | 0) +
(vt >>> 26)) |
0),
(vt &= 67108863),
(i = Math.imul(B, D)),
(n = ((n = Math.imul(B, V)) + Math.imul(k, D)) | 0),
(s = Math.imul(k, V)),
(i = (i + Math.imul(E, q)) | 0),
(n = ((n = (n + Math.imul(E, z)) | 0) + Math.imul(I, q)) | 0),
(s = (s + Math.imul(I, z)) | 0),
(i = (i + Math.imul(v, Y)) | 0),
(n = ((n = (n + Math.imul(v, J)) | 0) + Math.imul(_, Y)) | 0),
(s = (s + Math.imul(_, J)) | 0),
(i = (i + Math.imul(g, X)) | 0),
(n = ((n = (n + Math.imul(g, Q)) | 0) + Math.imul(y, X)) | 0),
(s = (s + Math.imul(y, Q)) | 0),
(i = (i + Math.imul(p, $)) | 0),
(n = ((n = (n + Math.imul(p, tt)) | 0) + Math.imul(b, $)) | 0),
(s = (s + Math.imul(b, tt)) | 0);
var _t =
(((f + (i = (i + Math.imul(c, rt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, it)) | 0) + Math.imul(d, rt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, it)) | 0) + (n >>> 13)) | 0) +
(_t >>> 26)) |
0),
(_t &= 67108863),
(i = Math.imul(R, D)),
(n = ((n = Math.imul(R, V)) + Math.imul(A, D)) | 0),
(s = Math.imul(A, V)),
(i = (i + Math.imul(B, q)) | 0),
(n = ((n = (n + Math.imul(B, z)) | 0) + Math.imul(k, q)) | 0),
(s = (s + Math.imul(k, z)) | 0),
(i = (i + Math.imul(E, Y)) | 0),
(n = ((n = (n + Math.imul(E, J)) | 0) + Math.imul(I, Y)) | 0),
(s = (s + Math.imul(I, J)) | 0),
(i = (i + Math.imul(v, X)) | 0),
(n = ((n = (n + Math.imul(v, Q)) | 0) + Math.imul(_, X)) | 0),
(s = (s + Math.imul(_, Q)) | 0),
(i = (i + Math.imul(g, $)) | 0),
(n = ((n = (n + Math.imul(g, tt)) | 0) + Math.imul(y, $)) | 0),
(s = (s + Math.imul(y, tt)) | 0),
(i = (i + Math.imul(p, rt)) | 0),
(n = ((n = (n + Math.imul(p, it)) | 0) + Math.imul(b, rt)) | 0),
(s = (s + Math.imul(b, it)) | 0);
var St =
(((f + (i = (i + Math.imul(c, st)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, ot)) | 0) + Math.imul(d, st)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, ot)) | 0) + (n >>> 13)) | 0) +
(St >>> 26)) |
0),
(St &= 67108863),
(i = Math.imul(x, D)),
(n = ((n = Math.imul(x, V)) + Math.imul(M, D)) | 0),
(s = Math.imul(M, V)),
(i = (i + Math.imul(R, q)) | 0),
(n = ((n = (n + Math.imul(R, z)) | 0) + Math.imul(A, q)) | 0),
(s = (s + Math.imul(A, z)) | 0),
(i = (i + Math.imul(B, Y)) | 0),
(n = ((n = (n + Math.imul(B, J)) | 0) + Math.imul(k, Y)) | 0),
(s = (s + Math.imul(k, J)) | 0),
(i = (i + Math.imul(E, X)) | 0),
(n = ((n = (n + Math.imul(E, Q)) | 0) + Math.imul(I, X)) | 0),
(s = (s + Math.imul(I, Q)) | 0),
(i = (i + Math.imul(v, $)) | 0),
(n = ((n = (n + Math.imul(v, tt)) | 0) + Math.imul(_, $)) | 0),
(s = (s + Math.imul(_, tt)) | 0),
(i = (i + Math.imul(g, rt)) | 0),
(n = ((n = (n + Math.imul(g, it)) | 0) + Math.imul(y, rt)) | 0),
(s = (s + Math.imul(y, it)) | 0),
(i = (i + Math.imul(p, st)) | 0),
(n = ((n = (n + Math.imul(p, ot)) | 0) + Math.imul(b, st)) | 0),
(s = (s + Math.imul(b, ot)) | 0);
var Et =
(((f + (i = (i + Math.imul(c, ht)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, ft)) | 0) + Math.imul(d, ht)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, ft)) | 0) + (n >>> 13)) | 0) +
(Et >>> 26)) |
0),
(Et &= 67108863),
(i = Math.imul(C, D)),
(n = ((n = Math.imul(C, V)) + Math.imul(L, D)) | 0),
(s = Math.imul(L, V)),
(i = (i + Math.imul(x, q)) | 0),
(n = ((n = (n + Math.imul(x, z)) | 0) + Math.imul(M, q)) | 0),
(s = (s + Math.imul(M, z)) | 0),
(i = (i + Math.imul(R, Y)) | 0),
(n = ((n = (n + Math.imul(R, J)) | 0) + Math.imul(A, Y)) | 0),
(s = (s + Math.imul(A, J)) | 0),
(i = (i + Math.imul(B, X)) | 0),
(n = ((n = (n + Math.imul(B, Q)) | 0) + Math.imul(k, X)) | 0),
(s = (s + Math.imul(k, Q)) | 0),
(i = (i + Math.imul(E, $)) | 0),
(n = ((n = (n + Math.imul(E, tt)) | 0) + Math.imul(I, $)) | 0),
(s = (s + Math.imul(I, tt)) | 0),
(i = (i + Math.imul(v, rt)) | 0),
(n = ((n = (n + Math.imul(v, it)) | 0) + Math.imul(_, rt)) | 0),
(s = (s + Math.imul(_, it)) | 0),
(i = (i + Math.imul(g, st)) | 0),
(n = ((n = (n + Math.imul(g, ot)) | 0) + Math.imul(y, st)) | 0),
(s = (s + Math.imul(y, ot)) | 0),
(i = (i + Math.imul(p, ht)) | 0),
(n = ((n = (n + Math.imul(p, ft)) | 0) + Math.imul(b, ht)) | 0),
(s = (s + Math.imul(b, ft)) | 0);
var It =
(((f + (i = (i + Math.imul(c, ct)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, dt)) | 0) + Math.imul(d, ct)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, dt)) | 0) + (n >>> 13)) | 0) +
(It >>> 26)) |
0),
(It &= 67108863),
(i = Math.imul(U, D)),
(n = ((n = Math.imul(U, V)) + Math.imul(F, D)) | 0),
(s = Math.imul(F, V)),
(i = (i + Math.imul(C, q)) | 0),
(n = ((n = (n + Math.imul(C, z)) | 0) + Math.imul(L, q)) | 0),
(s = (s + Math.imul(L, z)) | 0),
(i = (i + Math.imul(x, Y)) | 0),
(n = ((n = (n + Math.imul(x, J)) | 0) + Math.imul(M, Y)) | 0),
(s = (s + Math.imul(M, J)) | 0),
(i = (i + Math.imul(R, X)) | 0),
(n = ((n = (n + Math.imul(R, Q)) | 0) + Math.imul(A, X)) | 0),
(s = (s + Math.imul(A, Q)) | 0),
(i = (i + Math.imul(B, $)) | 0),
(n = ((n = (n + Math.imul(B, tt)) | 0) + Math.imul(k, $)) | 0),
(s = (s + Math.imul(k, tt)) | 0),
(i = (i + Math.imul(E, rt)) | 0),
(n = ((n = (n + Math.imul(E, it)) | 0) + Math.imul(I, rt)) | 0),
(s = (s + Math.imul(I, it)) | 0),
(i = (i + Math.imul(v, st)) | 0),
(n = ((n = (n + Math.imul(v, ot)) | 0) + Math.imul(_, st)) | 0),
(s = (s + Math.imul(_, ot)) | 0),
(i = (i + Math.imul(g, ht)) | 0),
(n = ((n = (n + Math.imul(g, ft)) | 0) + Math.imul(y, ht)) | 0),
(s = (s + Math.imul(y, ft)) | 0),
(i = (i + Math.imul(p, ct)) | 0),
(n = ((n = (n + Math.imul(p, dt)) | 0) + Math.imul(b, ct)) | 0),
(s = (s + Math.imul(b, dt)) | 0);
var Ot =
(((f + (i = (i + Math.imul(c, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(c, bt)) | 0) + Math.imul(d, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(d, bt)) | 0) + (n >>> 13)) | 0) +
(Ot >>> 26)) |
0),
(Ot &= 67108863),
(i = Math.imul(U, q)),
(n = ((n = Math.imul(U, z)) + Math.imul(F, q)) | 0),
(s = Math.imul(F, z)),
(i = (i + Math.imul(C, Y)) | 0),
(n = ((n = (n + Math.imul(C, J)) | 0) + Math.imul(L, Y)) | 0),
(s = (s + Math.imul(L, J)) | 0),
(i = (i + Math.imul(x, X)) | 0),
(n = ((n = (n + Math.imul(x, Q)) | 0) + Math.imul(M, X)) | 0),
(s = (s + Math.imul(M, Q)) | 0),
(i = (i + Math.imul(R, $)) | 0),
(n = ((n = (n + Math.imul(R, tt)) | 0) + Math.imul(A, $)) | 0),
(s = (s + Math.imul(A, tt)) | 0),
(i = (i + Math.imul(B, rt)) | 0),
(n = ((n = (n + Math.imul(B, it)) | 0) + Math.imul(k, rt)) | 0),
(s = (s + Math.imul(k, it)) | 0),
(i = (i + Math.imul(E, st)) | 0),
(n = ((n = (n + Math.imul(E, ot)) | 0) + Math.imul(I, st)) | 0),
(s = (s + Math.imul(I, ot)) | 0),
(i = (i + Math.imul(v, ht)) | 0),
(n = ((n = (n + Math.imul(v, ft)) | 0) + Math.imul(_, ht)) | 0),
(s = (s + Math.imul(_, ft)) | 0),
(i = (i + Math.imul(g, ct)) | 0),
(n = ((n = (n + Math.imul(g, dt)) | 0) + Math.imul(y, ct)) | 0),
(s = (s + Math.imul(y, dt)) | 0);
var Bt =
(((f + (i = (i + Math.imul(p, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(p, bt)) | 0) + Math.imul(b, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(b, bt)) | 0) + (n >>> 13)) | 0) +
(Bt >>> 26)) |
0),
(Bt &= 67108863),
(i = Math.imul(U, Y)),
(n = ((n = Math.imul(U, J)) + Math.imul(F, Y)) | 0),
(s = Math.imul(F, J)),
(i = (i + Math.imul(C, X)) | 0),
(n = ((n = (n + Math.imul(C, Q)) | 0) + Math.imul(L, X)) | 0),
(s = (s + Math.imul(L, Q)) | 0),
(i = (i + Math.imul(x, $)) | 0),
(n = ((n = (n + Math.imul(x, tt)) | 0) + Math.imul(M, $)) | 0),
(s = (s + Math.imul(M, tt)) | 0),
(i = (i + Math.imul(R, rt)) | 0),
(n = ((n = (n + Math.imul(R, it)) | 0) + Math.imul(A, rt)) | 0),
(s = (s + Math.imul(A, it)) | 0),
(i = (i + Math.imul(B, st)) | 0),
(n = ((n = (n + Math.imul(B, ot)) | 0) + Math.imul(k, st)) | 0),
(s = (s + Math.imul(k, ot)) | 0),
(i = (i + Math.imul(E, ht)) | 0),
(n = ((n = (n + Math.imul(E, ft)) | 0) + Math.imul(I, ht)) | 0),
(s = (s + Math.imul(I, ft)) | 0),
(i = (i + Math.imul(v, ct)) | 0),
(n = ((n = (n + Math.imul(v, dt)) | 0) + Math.imul(_, ct)) | 0),
(s = (s + Math.imul(_, dt)) | 0);
var kt =
(((f + (i = (i + Math.imul(g, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(g, bt)) | 0) + Math.imul(y, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(y, bt)) | 0) + (n >>> 13)) | 0) +
(kt >>> 26)) |
0),
(kt &= 67108863),
(i = Math.imul(U, X)),
(n = ((n = Math.imul(U, Q)) + Math.imul(F, X)) | 0),
(s = Math.imul(F, Q)),
(i = (i + Math.imul(C, $)) | 0),
(n = ((n = (n + Math.imul(C, tt)) | 0) + Math.imul(L, $)) | 0),
(s = (s + Math.imul(L, tt)) | 0),
(i = (i + Math.imul(x, rt)) | 0),
(n = ((n = (n + Math.imul(x, it)) | 0) + Math.imul(M, rt)) | 0),
(s = (s + Math.imul(M, it)) | 0),
(i = (i + Math.imul(R, st)) | 0),
(n = ((n = (n + Math.imul(R, ot)) | 0) + Math.imul(A, st)) | 0),
(s = (s + Math.imul(A, ot)) | 0),
(i = (i + Math.imul(B, ht)) | 0),
(n = ((n = (n + Math.imul(B, ft)) | 0) + Math.imul(k, ht)) | 0),
(s = (s + Math.imul(k, ft)) | 0),
(i = (i + Math.imul(E, ct)) | 0),
(n = ((n = (n + Math.imul(E, dt)) | 0) + Math.imul(I, ct)) | 0),
(s = (s + Math.imul(I, dt)) | 0);
var Pt =
(((f + (i = (i + Math.imul(v, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(v, bt)) | 0) + Math.imul(_, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(_, bt)) | 0) + (n >>> 13)) | 0) +
(Pt >>> 26)) |
0),
(Pt &= 67108863),
(i = Math.imul(U, $)),
(n = ((n = Math.imul(U, tt)) + Math.imul(F, $)) | 0),
(s = Math.imul(F, tt)),
(i = (i + Math.imul(C, rt)) | 0),
(n = ((n = (n + Math.imul(C, it)) | 0) + Math.imul(L, rt)) | 0),
(s = (s + Math.imul(L, it)) | 0),
(i = (i + Math.imul(x, st)) | 0),
(n = ((n = (n + Math.imul(x, ot)) | 0) + Math.imul(M, st)) | 0),
(s = (s + Math.imul(M, ot)) | 0),
(i = (i + Math.imul(R, ht)) | 0),
(n = ((n = (n + Math.imul(R, ft)) | 0) + Math.imul(A, ht)) | 0),
(s = (s + Math.imul(A, ft)) | 0),
(i = (i + Math.imul(B, ct)) | 0),
(n = ((n = (n + Math.imul(B, dt)) | 0) + Math.imul(k, ct)) | 0),
(s = (s + Math.imul(k, dt)) | 0);
var Rt =
(((f + (i = (i + Math.imul(E, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(E, bt)) | 0) + Math.imul(I, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(I, bt)) | 0) + (n >>> 13)) | 0) +
(Rt >>> 26)) |
0),
(Rt &= 67108863),
(i = Math.imul(U, rt)),
(n = ((n = Math.imul(U, it)) + Math.imul(F, rt)) | 0),
(s = Math.imul(F, it)),
(i = (i + Math.imul(C, st)) | 0),
(n = ((n = (n + Math.imul(C, ot)) | 0) + Math.imul(L, st)) | 0),
(s = (s + Math.imul(L, ot)) | 0),
(i = (i + Math.imul(x, ht)) | 0),
(n = ((n = (n + Math.imul(x, ft)) | 0) + Math.imul(M, ht)) | 0),
(s = (s + Math.imul(M, ft)) | 0),
(i = (i + Math.imul(R, ct)) | 0),
(n = ((n = (n + Math.imul(R, dt)) | 0) + Math.imul(A, ct)) | 0),
(s = (s + Math.imul(A, dt)) | 0);
var At =
(((f + (i = (i + Math.imul(B, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(B, bt)) | 0) + Math.imul(k, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(k, bt)) | 0) + (n >>> 13)) | 0) +
(At >>> 26)) |
0),
(At &= 67108863),
(i = Math.imul(U, st)),
(n = ((n = Math.imul(U, ot)) + Math.imul(F, st)) | 0),
(s = Math.imul(F, ot)),
(i = (i + Math.imul(C, ht)) | 0),
(n = ((n = (n + Math.imul(C, ft)) | 0) + Math.imul(L, ht)) | 0),
(s = (s + Math.imul(L, ft)) | 0),
(i = (i + Math.imul(x, ct)) | 0),
(n = ((n = (n + Math.imul(x, dt)) | 0) + Math.imul(M, ct)) | 0),
(s = (s + Math.imul(M, dt)) | 0);
var Nt =
(((f + (i = (i + Math.imul(R, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(R, bt)) | 0) + Math.imul(A, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(A, bt)) | 0) + (n >>> 13)) | 0) +
(Nt >>> 26)) |
0),
(Nt &= 67108863),
(i = Math.imul(U, ht)),
(n = ((n = Math.imul(U, ft)) + Math.imul(F, ht)) | 0),
(s = Math.imul(F, ft)),
(i = (i + Math.imul(C, ct)) | 0),
(n = ((n = (n + Math.imul(C, dt)) | 0) + Math.imul(L, ct)) | 0),
(s = (s + Math.imul(L, dt)) | 0);
var xt =
(((f + (i = (i + Math.imul(x, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(x, bt)) | 0) + Math.imul(M, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(M, bt)) | 0) + (n >>> 13)) | 0) +
(xt >>> 26)) |
0),
(xt &= 67108863),
(i = Math.imul(U, ct)),
(n = ((n = Math.imul(U, dt)) + Math.imul(F, ct)) | 0),
(s = Math.imul(F, dt));
var Mt =
(((f + (i = (i + Math.imul(C, pt)) | 0)) | 0) +
((8191 &
(n =
((n = (n + Math.imul(C, bt)) | 0) + Math.imul(L, pt)) |
0)) <<
13)) |
0;
(f =
((((s = (s + Math.imul(L, bt)) | 0) + (n >>> 13)) | 0) +
(Mt >>> 26)) |
0),
(Mt &= 67108863);
var Tt =
(((f + (i = Math.imul(U, pt))) | 0) +
((8191 &
(n = ((n = Math.imul(U, bt)) + Math.imul(F, pt)) | 0)) <<
13)) |
0;
return (
(f =
((((s = Math.imul(F, bt)) + (n >>> 13)) | 0) + (Tt >>> 26)) |
0),
(Tt &= 67108863),
(h[0] = mt),
(h[1] = gt),
(h[2] = yt),
(h[3] = wt),
(h[4] = vt),
(h[5] = _t),
(h[6] = St),
(h[7] = Et),
(h[8] = It),
(h[9] = Ot),
(h[10] = Bt),
(h[11] = kt),
(h[12] = Pt),
(h[13] = Rt),
(h[14] = At),
(h[15] = Nt),
(h[16] = xt),
(h[17] = Mt),
(h[18] = Tt),
0 !== f && ((h[19] = f), r.length++),
r
);
};
function g(t, e, r) {
(r.negative = e.negative ^ t.negative),
(r.length = t.length + e.length);
for (var i = 0, n = 0, s = 0; s < r.length - 1; s++) {
var o = n;
n = 0;
for (
var a = 67108863 & i,
h = Math.min(s, e.length - 1),
f = Math.max(0, s - t.length + 1);
f <= h;
f++
) {
var u = s - f,
c = (0 | t.words[u]) * (0 | e.words[f]),
d = 67108863 & c;
(a = 67108863 & (d = (d + a) | 0)),
(n +=
(o =
((o = (o + ((c / 67108864) | 0)) | 0) + (d >>> 26)) |
0) >>> 26),
(o &= 67108863);
}
(r.words[s] = a), (i = o), (o = n);
}
return 0 !== i ? (r.words[s] = i) : r.length--, r._strip();
}
function y(t, e, r) {
return g(t, e, r);
}
function w(t, e) {
(this.x = t), (this.y = e);
}
Math.imul || (m = b),
(s.prototype.mulTo = function(t, e) {
var r = this.length + t.length;
return 10 === this.length && 10 === t.length
? m(this, t, e)
: r < 63
? b(this, t, e)
: r < 1024
? g(this, t, e)
: y(this, t, e);
}),
(w.prototype.makeRBT = function(t) {
for (
var e = new Array(t),
r = s.prototype._countBits(t) - 1,
i = 0;
i < t;
i++
)
e[i] = this.revBin(i, r, t);
return e;
}),
(w.prototype.revBin = function(t, e, r) {
if (0 === t || t === r - 1) return t;
for (var i = 0, n = 0; n < e; n++)
(i |= (1 & t) << (e - n - 1)), (t >>= 1);
return i;
}),
(w.prototype.permute = function(t, e, r, i, n, s) {
for (var o = 0; o < s; o++) (i[o] = e[t[o]]), (n[o] = r[t[o]]);
}),
(w.prototype.transform = function(t, e, r, i, n, s) {
this.permute(s, t, e, r, i, n);
for (var o = 1; o < n; o <<= 1)
for (
var a = o << 1,
h = Math.cos((2 * Math.PI) / a),
f = Math.sin((2 * Math.PI) / a),
u = 0;
u < n;
u += a
)
for (var c = h, d = f, l = 0; l < o; l++) {
var p = r[u + l],
b = i[u + l],
m = r[u + l + o],
g = i[u + l + o],
y = c * m - d * g;
(g = c * g + d * m),
(m = y),
(r[u + l] = p + m),
(i[u + l] = b + g),
(r[u + l + o] = p - m),
(i[u + l + o] = b - g),
l !== a &&
((y = h * c - f * d), (d = h * d + f * c), (c = y));
}
}),
(w.prototype.guessLen13b = function(t, e) {
var r = 1 | Math.max(e, t),
i = 1 & r,
n = 0;
for (r = (r / 2) | 0; r; r >>>= 1) n++;
return 1 << (n + 1 + i);
}),
(w.prototype.conjugate = function(t, e, r) {
if (!(r <= 1))
for (var i = 0; i < r / 2; i++) {
var n = t[i];
(t[i] = t[r - i - 1]),
(t[r - i - 1] = n),
(n = e[i]),
(e[i] = -e[r - i - 1]),
(e[r - i - 1] = -n);
}
}),
(w.prototype.normalize13b = function(t, e) {
for (var r = 0, i = 0; i < e / 2; i++) {
var n =
8192 * Math.round(t[2 * i + 1] / e) +
Math.round(t[2 * i] / e) +
r;
(t[i] = 67108863 & n),
(r = n < 67108864 ? 0 : (n / 67108864) | 0);
}
return t;
}),
(w.prototype.convert13b = function(t, e, r, n) {
for (var s = 0, o = 0; o < e; o++)
(s += 0 | t[o]),
(r[2 * o] = 8191 & s),
(s >>>= 13),
(r[2 * o + 1] = 8191 & s),
(s >>>= 13);
for (o = 2 * e; o < n; ++o) r[o] = 0;
i(0 === s), i(0 == (-8192 & s));
}),
(w.prototype.stub = function(t) {
for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0;
return e;
}),
(w.prototype.mulp = function(t, e, r) {
var i = 2 * this.guessLen13b(t.length, e.length),
n = this.makeRBT(i),
s = this.stub(i),
o = new Array(i),
a = new Array(i),
h = new Array(i),
f = new Array(i),
u = new Array(i),
c = new Array(i),
d = r.words;
(d.length = i),
this.convert13b(t.words, t.length, o, i),
this.convert13b(e.words, e.length, f, i),
this.transform(o, s, a, h, i, n),
this.transform(f, s, u, c, i, n);
for (var l = 0; l < i; l++) {
var p = a[l] * u[l] - h[l] * c[l];
(h[l] = a[l] * c[l] + h[l] * u[l]), (a[l] = p);
}
return (
this.conjugate(a, h, i),
this.transform(a, h, d, s, i, n),
this.conjugate(d, s, i),
this.normalize13b(d, i),
(r.negative = t.negative ^ e.negative),
(r.length = t.length + e.length),
r._strip()
);
}),
(s.prototype.mul = function(t) {
var e = new s(null);
return (
(e.words = new Array(this.length + t.length)),
this.mulTo(t, e)
);
}),
(s.prototype.mulf = function(t) {
var e = new s(null);
return (
(e.words = new Array(this.length + t.length)), y(this, t, e)
);
}),
(s.prototype.imul = function(t) {
return this.clone().mulTo(t, this);
}),
(s.prototype.imuln = function(t) {
var e = t < 0;
e && (t = -t), i("number" == typeof t), i(t < 67108864);
for (var r = 0, n = 0; n < this.length; n++) {
var s = (0 | this.words[n]) * t,
o = (67108863 & s) + (67108863 & r);
(r >>= 26),
(r += (s / 67108864) | 0),
(r += o >>> 26),
(this.words[n] = 67108863 & o);
}
return (
0 !== r && ((this.words[n] = r), this.length++),
e ? this.ineg() : this
);
}),
(s.prototype.muln = function(t) {
return this.clone().imuln(t);
}),
(s.prototype.sqr = function() {
return this.mul(this);
}),
(s.prototype.isqr = function() {
return this.imul(this.clone());
}),
(s.prototype.pow = function(t) {
var e = (function(t) {
for (
var e = new Array(t.bitLength()), r = 0;
r < e.length;
r++
) {
var i = (r / 26) | 0,
n = r % 26;
e[r] = (t.words[i] >>> n) & 1;
}
return e;
})(t);
if (0 === e.length) return new s(1);
for (
var r = this, i = 0;
i < e.length && 0 === e[i];
i++, r = r.sqr()
);
if (++i < e.length)
for (var n = r.sqr(); i < e.length; i++, n = n.sqr())
0 !== e[i] && (r = r.mul(n));
return r;
}),
(s.prototype.iushln = function(t) {
i("number" == typeof t && t >= 0);
var e,
r = t % 26,
n = (t - r) / 26,
s = (67108863 >>> (26 - r)) << (26 - r);
if (0 !== r) {
var o = 0;
for (e = 0; e < this.length; e++) {
var a = this.words[e] & s,
h = ((0 | this.words[e]) - a) << r;
(this.words[e] = h | o), (o = a >>> (26 - r));
}
o && ((this.words[e] = o), this.length++);
}
if (0 !== n) {
for (e = this.length - 1; e >= 0; e--)
this.words[e + n] = this.words[e];
for (e = 0; e < n; e++) this.words[e] = 0;
this.length += n;
}
return this._strip();
}),
(s.prototype.ishln = function(t) {
return i(0 === this.negative), this.iushln(t);
}),
(s.prototype.iushrn = function(t, e, r) {
var n;
i("number" == typeof t && t >= 0),
(n = e ? (e - (e % 26)) / 26 : 0);
var s = t % 26,
o = Math.min((t - s) / 26, this.length),
a = 67108863 ^ ((67108863 >>> s) << s),
h = r;
if (((n -= o), (n = Math.max(0, n)), h)) {
for (var f = 0; f < o; f++) h.words[f] = this.words[f];
h.length = o;
}
if (0 === o);
else if (this.length > o)
for (this.length -= o, f = 0; f < this.length; f++)
this.words[f] = this.words[f + o];
else (this.words[0] = 0), (this.length = 1);
var u = 0;
for (f = this.length - 1; f >= 0 && (0 !== u || f >= n); f--) {
var c = 0 | this.words[f];
(this.words[f] = (u << (26 - s)) | (c >>> s)), (u = c & a);
}
return (
h && 0 !== u && (h.words[h.length++] = u),
0 === this.length && ((this.words[0] = 0), (this.length = 1)),
this._strip()
);
}),
(s.prototype.ishrn = function(t, e, r) {
return i(0 === this.negative), this.iushrn(t, e, r);
}),
(s.prototype.shln = function(t) {
return this.clone().ishln(t);
}),
(s.prototype.ushln = function(t) {
return this.clone().iushln(t);
}),
(s.prototype.shrn = function(t) {
return this.clone().ishrn(t);
}),
(s.prototype.ushrn = function(t) {
return this.clone().iushrn(t);
}),
(s.prototype.testn = function(t) {
i("number" == typeof t && t >= 0);
var e = t % 26,
r = (t - e) / 26,
n = 1 << e;
return !(this.length <= r || !(this.words[r] & n));
}),
(s.prototype.imaskn = function(t) {
i("number" == typeof t && t >= 0);
var e = t % 26,
r = (t - e) / 26;
if (
(i(
0 === this.negative,
"imaskn works only with positive numbers"
),
this.length <= r)
)
return this;
if (
(0 !== e && r++,
(this.length = Math.min(r, this.length)),
0 !== e)
) {
var n = 67108863 ^ ((67108863 >>> e) << e);
this.words[this.length - 1] &= n;
}
return this._strip();
}),
(s.prototype.maskn = function(t) {
return this.clone().imaskn(t);
}),
(s.prototype.iaddn = function(t) {
return (
i("number" == typeof t),
i(t < 67108864),
t < 0
? this.isubn(-t)
: 0 !== this.negative
? 1 === this.length && (0 | this.words[0]) <= t
? ((this.words[0] = t - (0 | this.words[0])),
(this.negative = 0),
this)
: ((this.negative = 0),
this.isubn(t),
(this.negative = 1),
this)
: this._iaddn(t)
);
}),
(s.prototype._iaddn = function(t) {
this.words[0] += t;
for (
var e = 0;
e < this.length && this.words[e] >= 67108864;
e++
)
(this.words[e] -= 67108864),
e === this.length - 1
? (this.words[e + 1] = 1)
: this.words[e + 1]++;
return (this.length = Math.max(this.length, e + 1)), this;
}),
(s.prototype.isubn = function(t) {
if ((i("number" == typeof t), i(t < 67108864), t < 0))
return this.iaddn(-t);
if (0 !== this.negative)
return (
(this.negative = 0),
this.iaddn(t),
(this.negative = 1),
this
);
if (
((this.words[0] -= t), 1 === this.length && this.words[0] < 0)
)
(this.words[0] = -this.words[0]), (this.negative = 1);
else
for (var e = 0; e < this.length && this.words[e] < 0; e++)
(this.words[e] += 67108864), (this.words[e + 1] -= 1);
return this._strip();
}),
(s.prototype.addn = function(t) {
return this.clone().iaddn(t);
}),
(s.prototype.subn = function(t) {
return this.clone().isubn(t);
}),
(s.prototype.iabs = function() {
return (this.negative = 0), this;
}),
(s.prototype.abs = function() {
return this.clone().iabs();
}),
(s.prototype._ishlnsubmul = function(t, e, r) {
var n,
s,
o = t.length + r;
this._expand(o);
var a = 0;
for (n = 0; n < t.length; n++) {
s = (0 | this.words[n + r]) + a;
var h = (0 | t.words[n]) * e;
(a = ((s -= 67108863 & h) >> 26) - ((h / 67108864) | 0)),
(this.words[n + r] = 67108863 & s);
}
for (; n < this.length - r; n++)
(a = (s = (0 | this.words[n + r]) + a) >> 26),
(this.words[n + r] = 67108863 & s);
if (0 === a) return this._strip();
for (i(-1 === a), a = 0, n = 0; n < this.length; n++)
(a = (s = -(0 | this.words[n]) + a) >> 26),
(this.words[n] = 67108863 & s);
return (this.negative = 1), this._strip();
}),
(s.prototype._wordDiv = function(t, e) {
var r = (this.length, t.length),
i = this.clone(),
n = t,
o = 0 | n.words[n.length - 1];
0 != (r = 26 - this._countBits(o)) &&
((n = n.ushln(r)),
i.iushln(r),
(o = 0 | n.words[n.length - 1]));
var a,
h = i.length - n.length;
if ("mod" !== e) {
((a = new s(null)).length = h + 1),
(a.words = new Array(a.length));
for (var f = 0; f < a.length; f++) a.words[f] = 0;
}
var u = i.clone()._ishlnsubmul(n, 1, h);
0 === u.negative && ((i = u), a && (a.words[h] = 1));
for (var c = h - 1; c >= 0; c--) {
var d =
67108864 * (0 | i.words[n.length + c]) +
(0 | i.words[n.length + c - 1]);
for (
d = Math.min((d / o) | 0, 67108863),
i._ishlnsubmul(n, d, c);
0 !== i.negative;

)
d--,
(i.negative = 0),
i._ishlnsubmul(n, 1, c),
i.isZero() || (i.negative ^= 1);
a && (a.words[c] = d);
}
return (
a && a._strip(),
i._strip(),
"div" !== e && 0 !== r && i.iushrn(r),
{ div: a || null, mod: i }
);
}),
(s.prototype.divmod = function(t, e, r) {
return (
i(!t.isZero()),
this.isZero()
? { div: new s(0), mod: new s(0) }
: 0 !== this.negative && 0 === t.negative
? ((a = this.neg().divmod(t, e)),
"mod" !== e && (n = a.div.neg()),
"div" !== e &&
((o = a.mod.neg()), r && 0 !== o.negative && o.iadd(t)),
{ div: n, mod: o })
: 0 === this.negative && 0 !== t.negative
? ((a = this.divmod(t.neg(), e)),
"mod" !== e && (n = a.div.neg()),
{ div: n, mod: a.mod })
: 0 != (this.negative & t.negative)
? ((a = this.neg().divmod(t.neg(), e)),
"div" !== e &&
((o = a.mod.neg()), r && 0 !== o.negative && o.isub(t)),
{ div: a.div, mod: o })
: t.length > this.length || this.cmp(t) < 0
? { div: new s(0), mod: this }
: 1 === t.length
? "div" === e
? { div: this.divn(t.words[0]), mod: null }
: "mod" === e
? { div: null, mod: new s(this.modrn(t.words[0])) }
: {
div: this.divn(t.words[0]),
mod: new s(this.modrn(t.words[0])),
}
: this._wordDiv(t, e)
);
var n, o, a;
}),
(s.prototype.div = function(t) {
return this.divmod(t, "div", !1).div;
}),
(s.prototype.mod = function(t) {
return this.divmod(t, "mod", !1).mod;
}),
(s.prototype.umod = function(t) {
return this.divmod(t, "mod", !0).mod;
}),
(s.prototype.divRound = function(t) {
var e = this.divmod(t);
if (e.mod.isZero()) return e.div;
var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
i = t.ushrn(1),
n = t.andln(1),
s = r.cmp(i);
return s < 0 || (1 === n && 0 === s)
? e.div
: 0 !== e.div.negative
? e.div.isubn(1)
: e.div.iaddn(1);
}),
(s.prototype.modrn = function(t) {
var e = t < 0;
e && (t = -t), i(t <= 67108863);
for (
var r = (1 << 26) % t, n = 0, s = this.length - 1;
s >= 0;
s--
)
n = (r * n + (0 | this.words[s])) % t;
return e ? -n : n;
}),
(s.prototype.modn = function(t) {
return this.modrn(t);
}),
(s.prototype.idivn = function(t) {
var e = t < 0;
e && (t = -t), i(t <= 67108863);
for (var r = 0, n = this.length - 1; n >= 0; n--) {
var s = (0 | this.words[n]) + 67108864 * r;
(this.words[n] = (s / t) | 0), (r = s % t);
}
return this._strip(), e ? this.ineg() : this;
}),
(s.prototype.divn = function(t) {
return this.clone().idivn(t);
}),
(s.prototype.egcd = function(t) {
i(0 === t.negative), i(!t.isZero());
var e = this,
r = t.clone();
e = 0 !== e.negative ? e.umod(t) : e.clone();
for (
var n = new s(1),
o = new s(0),
a = new s(0),
h = new s(1),
f = 0;
e.isEven() && r.isEven();

)
e.iushrn(1), r.iushrn(1), ++f;
for (var u = r.clone(), c = e.clone(); !e.isZero(); ) {
for (
var d = 0, l = 1;
0 == (e.words[0] & l) && d < 26;
++d, l <<= 1
);
if (d > 0)
for (e.iushrn(d); d-- > 0; )
(n.isOdd() || o.isOdd()) && (n.iadd(u), o.isub(c)),
n.iushrn(1),
o.iushrn(1);
for (
var p = 0, b = 1;
0 == (r.words[0] & b) && p < 26;
++p, b <<= 1
);
if (p > 0)
for (r.iushrn(p); p-- > 0; )
(a.isOdd() || h.isOdd()) && (a.iadd(u), h.isub(c)),
a.iushrn(1),
h.iushrn(1);
e.cmp(r) >= 0
? (e.isub(r), n.isub(a), o.isub(h))
: (r.isub(e), a.isub(n), h.isub(o));
}
return { a, b: h, gcd: r.iushln(f) };
}),
(s.prototype._invmp = function(t) {
i(0 === t.negative), i(!t.isZero());
var e = this,
r = t.clone();
e = 0 !== e.negative ? e.umod(t) : e.clone();
for (
var n, o = new s(1), a = new s(0), h = r.clone();
e.cmpn(1) > 0 && r.cmpn(1) > 0;

) {
for (
var f = 0, u = 1;
0 == (e.words[0] & u) && f < 26;
++f, u <<= 1
);
if (f > 0)
for (e.iushrn(f); f-- > 0; )
o.isOdd() && o.iadd(h), o.iushrn(1);
for (
var c = 0, d = 1;
0 == (r.words[0] & d) && c < 26;
++c, d <<= 1
);
if (c > 0)
for (r.iushrn(c); c-- > 0; )
a.isOdd() && a.iadd(h), a.iushrn(1);
e.cmp(r) >= 0
? (e.isub(r), o.isub(a))
: (r.isub(e), a.isub(o));
}
return (
(n = 0 === e.cmpn(1) ? o : a).cmpn(0) < 0 && n.iadd(t), n
);
}),
(s.prototype.gcd = function(t) {
if (this.isZero()) return t.abs();
if (t.isZero()) return this.abs();
var e = this.clone(),
r = t.clone();
(e.negative = 0), (r.negative = 0);
for (var i = 0; e.isEven() && r.isEven(); i++)
e.iushrn(1), r.iushrn(1);
for (;;) {
for (; e.isEven(); ) e.iushrn(1);
for (; r.isEven(); ) r.iushrn(1);
var n = e.cmp(r);
if (n < 0) {
var s = e;
(e = r), (r = s);
} else if (0 === n || 0 === r.cmpn(1)) break;
e.isub(r);
}
return r.iushln(i);
}),
(s.prototype.invm = function(t) {
return this.egcd(t).a.umod(t);
}),
(s.prototype.isEven = function() {
return 0 == (1 & this.words[0]);
}),
(s.prototype.isOdd = function() {
return 1 == (1 & this.words[0]);
}),
(s.prototype.andln = function(t) {
return this.words[0] & t;
}),
(s.prototype.bincn = function(t) {
i("number" == typeof t);
var e = t % 26,
r = (t - e) / 26,
n = 1 << e;
if (this.length <= r)
return this._expand(r + 1), (this.words[r] |= n), this;
for (var s = n, o = r; 0 !== s && o < this.length; o++) {
var a = 0 | this.words[o];
(s = (a += s) >>> 26), (a &= 67108863), (this.words[o] = a);
}
return 0 !== s && ((this.words[o] = s), this.length++), this;
}),
(s.prototype.isZero = function() {
return 1 === this.length && 0 === this.words[0];
}),
(s.prototype.cmpn = function(t) {
var e,
r = t < 0;
if (0 !== this.negative && !r) return -1;
if (0 === this.negative && r) return 1;
if ((this._strip(), this.length > 1)) e = 1;
else {
r && (t = -t), i(t <= 67108863, "Number is too big");
var n = 0 | this.words[0];
e = n === t ? 0 : n < t ? -1 : 1;
}
return 0 !== this.negative ? 0 | -e : e;
}),
(s.prototype.cmp = function(t) {
if (0 !== this.negative && 0 === t.negative) return -1;
if (0 === this.negative && 0 !== t.negative) return 1;
var e = this.ucmp(t);
return 0 !== this.negative ? 0 | -e : e;
}),
(s.prototype.ucmp = function(t) {
if (this.length > t.length) return 1;
if (this.length < t.length) return -1;
for (var e = 0, r = this.length - 1; r >= 0; r--) {
var i = 0 | this.words[r],
n = 0 | t.words[r];
if (i !== n) {
i < n ? (e = -1) : i > n && (e = 1);
break;
}
}
return e;
}),
(s.prototype.gtn = function(t) {
return 1 === this.cmpn(t);
}),
(s.prototype.gt = function(t) {
return 1 === this.cmp(t);
}),
(s.prototype.gten = function(t) {
return this.cmpn(t) >= 0;
}),
(s.prototype.gte = function(t) {
return this.cmp(t) >= 0;
}),
(s.prototype.ltn = function(t) {
return -1 === this.cmpn(t);
}),
(s.prototype.lt = function(t) {
return -1 === this.cmp(t);
}),
(s.prototype.lten = function(t) {
return this.cmpn(t) <= 0;
}),
(s.prototype.lte = function(t) {
return this.cmp(t) <= 0;
}),
(s.prototype.eqn = function(t) {
return 0 === this.cmpn(t);
}),
(s.prototype.eq = function(t) {
return 0 === this.cmp(t);
}),
(s.red = function(t) {
return new B(t);
}),
(s.prototype.toRed = function(t) {
return (
i(!this.red, "Already a number in reduction context"),
i(0 === this.negative, "red works only with positives"),
t.convertTo(this)._forceRed(t)
);
}),
(s.prototype.fromRed = function() {
return (
i(
this.red,
"fromRed works only with numbers in reduction context"
),
this.red.convertFrom(this)
);
}),
(s.prototype._forceRed = function(t) {
return (this.red = t), this;
}),
(s.prototype.forceRed = function(t) {
return (
i(!this.red, "Already a number in reduction context"),
this._forceRed(t)
);
}),
(s.prototype.redAdd = function(t) {
return (
i(this.red, "redAdd works only with red numbers"),
this.red.add(this, t)
);
}),
(s.prototype.redIAdd = function(t) {
return (
i(this.red, "redIAdd works only with red numbers"),
this.red.iadd(this, t)
);
}),
(s.prototype.redSub = function(t) {
return (
i(this.red, "redSub works only with red numbers"),
this.red.sub(this, t)
);
}),
(s.prototype.redISub = function(t) {
return (
i(this.red, "redISub works only with red numbers"),
this.red.isub(this, t)
);
}),
(s.prototype.redShl = function(t) {
return (
i(this.red, "redShl works only with red numbers"),
this.red.shl(this, t)
);
}),
(s.prototype.redMul = function(t) {
return (
i(this.red, "redMul works only with red numbers"),
this.red._verify2(this, t),
this.red.mul(this, t)
);
}),
(s.prototype.redIMul = function(t) {
return (
i(this.red, "redMul works only with red numbers"),
this.red._verify2(this, t),
this.red.imul(this, t)
);
}),
(s.prototype.redSqr = function() {
return (
i(this.red, "redSqr works only with red numbers"),
this.red._verify1(this),
this.red.sqr(this)
);
}),
(s.prototype.redISqr = function() {
return (
i(this.red, "redISqr works only with red numbers"),
this.red._verify1(this),
this.red.isqr(this)
);
}),
(s.prototype.redSqrt = function() {
return (
i(this.red, "redSqrt works only with red numbers"),
this.red._verify1(this),
this.red.sqrt(this)
);
}),
(s.prototype.redInvm = function() {
return (
i(this.red, "redInvm works only with red numbers"),
this.red._verify1(this),
this.red.invm(this)
);
}),
(s.prototype.redNeg = function() {
return (
i(this.red, "redNeg works only with red numbers"),
this.red._verify1(this),
this.red.neg(this)
);
}),
(s.prototype.redPow = function(t) {
return (
i(this.red && !t.red, "redPow(normalNum)"),
this.red._verify1(this),
this.red.pow(this, t)
);
});
var v = { k256: null, p224: null, p192: null, p25519: null };
function _(t, e) {
(this.name = t),
(this.p = new s(e, 16)),
(this.n = this.p.bitLength()),
(this.k = new s(1).iushln(this.n).isub(this.p)),
(this.tmp = this._tmp());
}
function S() {
_.call(
this,
"k256",
"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
);
}
function E() {
_.call(
this,
"p224",
"ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
);
}
function I() {
_.call(
this,
"p192",
"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
);
}
function O() {
_.call(
this,
"25519",
"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
);
}
function B(t) {
if ("string" == typeof t) {
var e = s._prime(t);
(this.m = e.p), (this.prime = e);
} else
i(t.gtn(1), "modulus must be greater than 1"),
(this.m = t),
(this.prime = null);
}
function k(t) {
B.call(this, t),
(this.shift = this.m.bitLength()),
this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
(this.r = new s(1).iushln(this.shift)),
(this.r2 = this.imod(this.r.sqr())),
(this.rinv = this.r._invmp(this.m)),
(this.minv = this.rinv
.mul(this.r)
.isubn(1)
.div(this.m)),
(this.minv = this.minv.umod(this.r)),
(this.minv = this.r.sub(this.minv));
}
(_.prototype._tmp = function() {
var t = new s(null);
return (t.words = new Array(Math.ceil(this.n / 13))), t;
}),
(_.prototype.ireduce = function(t) {
var e,
r = t;
do {
this.split(r, this.tmp),
(e = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength());
} while (e > this.n);
var i = e < this.n ? -1 : r.ucmp(this.p);
return (
0 === i
? ((r.words[0] = 0), (r.length = 1))
: i > 0
? r.isub(this.p)
: void 0 !== r.strip
? r.strip()
: r._strip(),
r
);
}),
(_.prototype.split = function(t, e) {
t.iushrn(this.n, 0, e);
}),
(_.prototype.imulK = function(t) {
return t.imul(this.k);
}),
n(S, _),
(S.prototype.split = function(t, e) {
for (
var r = 4194303, i = Math.min(t.length, 9), n = 0;
n < i;
n++
)
e.words[n] = t.words[n];
if (((e.length = i), t.length <= 9))
return (t.words[0] = 0), void (t.length = 1);
var s = t.words[9];
for (e.words[e.length++] = s & r, n = 10; n < t.length; n++) {
var o = 0 | t.words[n];
(t.words[n - 10] = ((o & r) << 4) | (s >>> 22)), (s = o);
}
(s >>>= 22),
(t.words[n - 10] = s),
0 === s && t.length > 10 ? (t.length -= 10) : (t.length -= 9);
}),
(S.prototype.imulK = function(t) {
(t.words[t.length] = 0),
(t.words[t.length + 1] = 0),
(t.length += 2);
for (var e = 0, r = 0; r < t.length; r++) {
var i = 0 | t.words[r];
(e += 977 * i),
(t.words[r] = 67108863 & e),
(e = 64 * i + ((e / 67108864) | 0));
}
return (
0 === t.words[t.length - 1] &&
(t.length--, 0 === t.words[t.length - 1] && t.length--),
t
);
}),
n(E, _),
n(I, _),
n(O, _),
(O.prototype.imulK = function(t) {
for (var e = 0, r = 0; r < t.length; r++) {
var i = 19 * (0 | t.words[r]) + e,
n = 67108863 & i;
(i >>>= 26), (t.words[r] = n), (e = i);
}
return 0 !== e && (t.words[t.length++] = e), t;
}),
(s._prime = function(t) {
if (v[t]) return v[t];
var e;
if ("k256" === t) e = new S();
else if ("p224" === t) e = new E();
else if ("p192" === t) e = new I();
else {
if ("p25519" !== t) throw new Error("Unknown prime " + t);
e = new O();
}
return (v[t] = e), e;
}),
(B.prototype._verify1 = function(t) {
i(0 === t.negative, "red works only with positives"),
i(t.red, "red works only with red numbers");
}),
(B.prototype._verify2 = function(t, e) {
i(
0 == (t.negative | e.negative),
"red works only with positives"
),
i(
t.red && t.red === e.red,
"red works only with red numbers"
);
}),
(B.prototype.imod = function(t) {
return this.prime
? this.prime.ireduce(t)._forceRed(this)
: (u(t, t.umod(this.m)._forceRed(this)), t);
}),
(B.prototype.neg = function(t) {
return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
}),
(B.prototype.add = function(t, e) {
this._verify2(t, e);
var r = t.add(e);
return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
}),
(B.prototype.iadd = function(t, e) {
this._verify2(t, e);
var r = t.iadd(e);
return r.cmp(this.m) >= 0 && r.isub(this.m), r;
}),
(B.prototype.sub = function(t, e) {
this._verify2(t, e);
var r = t.sub(e);
return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
}),
(B.prototype.isub = function(t, e) {
this._verify2(t, e);
var r = t.isub(e);
return r.cmpn(0) < 0 && r.iadd(this.m), r;
}),
(B.prototype.shl = function(t, e) {
return this._verify1(t), this.imod(t.ushln(e));
}),
(B.prototype.imul = function(t, e) {
return this._verify2(t, e), this.imod(t.imul(e));
}),
(B.prototype.mul = function(t, e) {
return this._verify2(t, e), this.imod(t.mul(e));
}),
(B.prototype.isqr = function(t) {
return this.imul(t, t.clone());
}),
(B.prototype.sqr = function(t) {
return this.mul(t, t);
}),
(B.prototype.sqrt = function(t) {
if (t.isZero()) return t.clone();
var e = this.m.andln(3);
if ((i(e % 2 == 1), 3 === e)) {
var r = this.m.add(new s(1)).iushrn(2);
return this.pow(t, r);
}
for (
var n = this.m.subn(1), o = 0;
!n.isZero() && 0 === n.andln(1);

)
o++, n.iushrn(1);
i(!n.isZero());
var a = new s(1).toRed(this),
h = a.redNeg(),
f = this.m.subn(1).iushrn(1),
u = this.m.bitLength();
for (
u = new s(2 * u * u).toRed(this);
0 !== this.pow(u, f).cmp(h);

)
u.redIAdd(h);
for (
var c = this.pow(u, n),
d = this.pow(t, n.addn(1).iushrn(1)),
l = this.pow(t, n),
p = o;
0 !== l.cmp(a);

) {
for (var b = l, m = 0; 0 !== b.cmp(a); m++) b = b.redSqr();
i(m < p);
var g = this.pow(c, new s(1).iushln(p - m - 1));
(d = d.redMul(g)),
(c = g.redSqr()),
(l = l.redMul(c)),
(p = m);
}
return d;
}),
(B.prototype.invm = function(t) {
var e = t._invmp(this.m);
return 0 !== e.negative
? ((e.negative = 0), this.imod(e).redNeg())
: this.imod(e);
}),
(B.prototype.pow = function(t, e) {
if (e.isZero()) return new s(1).toRed(this);
if (0 === e.cmpn(1)) return t.clone();
var r = new Array(16);
(r[0] = new s(1).toRed(this)), (r[1] = t);
for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], t);
var n = r[0],
o = 0,
a = 0,
h = e.bitLength() % 26;
for (0 === h && (h = 26), i = e.length - 1; i >= 0; i--) {
for (var f = e.words[i], u = h - 1; u >= 0; u--) {
var c = (f >> u) & 1;
n !== r[0] && (n = this.sqr(n)),
0 !== c || 0 !== o
? ((o <<= 1),
(o |= c),
(4 == ++a || (0 === i && 0 === u)) &&
((n = this.mul(n, r[o])), (a = 0), (o = 0)))
: (a = 0);
}
h = 26;
}
return n;
}),
(B.prototype.convertTo = function(t) {
var e = t.umod(this.m);
return e === t ? e.clone() : e;
}),
(B.prototype.convertFrom = function(t) {
var e = t.clone();
return (e.red = null), e;
}),
(s.mont = function(t) {
return new k(t);
}),
n(k, B),
(k.prototype.convertTo = function(t) {
return this.imod(t.ushln(this.shift));
}),
(k.prototype.convertFrom = function(t) {
var e = this.imod(t.mul(this.rinv));
return (e.red = null), e;
}),
(k.prototype.imul = function(t, e) {
if (t.isZero() || e.isZero())
return (t.words[0] = 0), (t.length = 1), t;
var r = t.imul(e),
i = r
.maskn(this.shift)
.mul(this.minv)
.imaskn(this.shift)
.mul(this.m),
n = r.isub(i).iushrn(this.shift),
s = n;
return (
n.cmp(this.m) >= 0
? (s = n.isub(this.m))
: n.cmpn(0) < 0 && (s = n.iadd(this.m)),
s._forceRed(this)
);
}),
(k.prototype.mul = function(t, e) {
if (t.isZero() || e.isZero()) return new s(0)._forceRed(this);
var r = t.mul(e),
i = r
.maskn(this.shift)
.mul(this.minv)
.imaskn(this.shift)
.mul(this.m),
n = r.isub(i).iushrn(this.shift),
o = n;
return (
n.cmp(this.m) >= 0
? (o = n.isub(this.m))
: n.cmpn(0) < 0 && (o = n.iadd(this.m)),
o._forceRed(this)
);
}),
(k.prototype.invm = function(t) {
return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this);
});
})((t = r.nmd(t)), this);
},
9931: (t, e, r) => {
var i;
function n(t) {
this.rand = t;
}
if (
((t.exports = function(t) {
return i || (i = new n(null)), i.generate(t);
}),
(t.exports.Rand = n),
(n.prototype.generate = function(t) {
return this._rand(t);
}),
(n.prototype._rand = function(t) {
if (this.rand.getBytes) return this.rand.getBytes(t);
for (var e = new Uint8Array(t), r = 0; r < e.length; r++)
e[r] = this.rand.getByte();
return e;
}),
"object" == typeof self)
)
self.crypto && self.crypto.getRandomValues
? (n.prototype._rand = function(t) {
var e = new Uint8Array(t);
return self.crypto.getRandomValues(e), e;
})
: self.msCrypto && self.msCrypto.getRandomValues
? (n.prototype._rand = function(t) {
var e = new Uint8Array(t);
return self.msCrypto.getRandomValues(e), e;
})
: "object" == typeof window &&
(n.prototype._rand = function() {
throw new Error("Not implemented yet");
});
else
try {
var s = r(9214);
if ("function" != typeof s.randomBytes)
throw new Error("Not supported");
n.prototype._rand = function(t) {
return s.randomBytes(t);
};
} catch (t) {}
},
7191: (t, e, r) => {
var i = r(8162);
t.exports = i(
"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);
},
8764: (t, e, r) => {
"use strict";
const i = r(9742),
n = r(645),
s =
"function" == typeof Symbol && "function" == typeof Symbol.for
? Symbol.for("nodejs.util.inspect.custom")
: null;
(e.Buffer = h),
(e.SlowBuffer = function(t) {
return +t != t && (t = 0), h.alloc(+t);
}),
(e.INSPECT_MAX_BYTES = 50);
const o = 2147483647;
function a(t) {
if (t > o)
throw new RangeError(
'The value "' + t + '" is invalid for option "size"'
);
const e = new Uint8Array(t);
return Object.setPrototypeOf(e, h.prototype), e;
}
function h(t, e, r) {
if ("number" == typeof t) {
if ("string" == typeof e)
throw new TypeError(
'The "string" argument must be of type string. Received type number'
);
return c(t);
}
return f(t, e, r);
}
function f(t, e, r) {
if ("string" == typeof t)
return (function(t, e) {
if (
(("string" == typeof e && "" !== e) || (e = "utf8"),
!h.isEncoding(e))
)
throw new TypeError("Unknown encoding: " + e);
const r = 0 | b(t, e);
let i = a(r);
const n = i.write(t, e);
return n !== r && (i = i.slice(0, n)), i;
})(t, e);
if (ArrayBuffer.isView(t))
return (function(t) {
if (W(t, Uint8Array)) {
const e = new Uint8Array(t);
return l(e.buffer, e.byteOffset, e.byteLength);
}
return d(t);
})(t);
if (null == t)
throw new TypeError(
"The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
typeof t
);
if (W(t, ArrayBuffer) || (t && W(t.buffer, ArrayBuffer)))
return l(t, e, r);
if (
"undefined" != typeof SharedArrayBuffer &&
(W(t, SharedArrayBuffer) || (t && W(t.buffer, SharedArrayBuffer)))
)
return l(t, e, r);
if ("number" == typeof t)
throw new TypeError(
'The "value" argument must not be of type number. Received type number'
);
const i = t.valueOf && t.valueOf();
if (null != i && i !== t) return h.from(i, e, r);
const n = (function(t) {
if (h.isBuffer(t)) {
const e = 0 | p(t.length),
r = a(e);
return 0 === r.length || t.copy(r, 0, 0, e), r;
}
return void 0 !== t.length
? "number" != typeof t.length || X(t.length)
? a(0)
: d(t)
: "Buffer" === t.type && Array.isArray(t.data)
? d(t.data)
: void 0;
})(t);
if (n) return n;
if (
"undefined" != typeof Symbol &&
null != Symbol.toPrimitive &&
"function" == typeof t[Symbol.toPrimitive]
)
return h.from(t[Symbol.toPrimitive]("string"), e, r);
throw new TypeError(
"The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
typeof t
);
}
function u(t) {
if ("number" != typeof t)
throw new TypeError('"size" argument must be of type number');
if (t < 0)
throw new RangeError(
'The value "' + t + '" is invalid for option "size"'
);
}
function c(t) {
return u(t), a(t < 0 ? 0 : 0 | p(t));
}
function d(t) {
const e = t.length < 0 ? 0 : 0 | p(t.length),
r = a(e);
for (let i = 0; i < e; i += 1) r[i] = 255 & t[i];
return r;
}
function l(t, e, r) {
if (e < 0 || t.byteLength < e)
throw new RangeError('"offset" is outside of buffer bounds');
if (t.byteLength < e + (r || 0))
throw new RangeError('"length" is outside of buffer bounds');
let i;
return (
(i =
void 0 === e && void 0 === r
? new Uint8Array(t)
: void 0 === r
? new Uint8Array(t, e)
: new Uint8Array(t, e, r)),
Object.setPrototypeOf(i, h.prototype),
i
);
}
function p(t) {
if (t >= o)
throw new RangeError(
"Attempt to allocate Buffer larger than maximum size: 0x" +
o.toString(16) +
" bytes"
);
return 0 | t;
}
function b(t, e) {
if (h.isBuffer(t)) return t.length;
if (ArrayBuffer.isView(t) || W(t, ArrayBuffer)) return t.byteLength;
if ("string" != typeof t)
throw new TypeError(
'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
typeof t
);
const r = t.length,
i = arguments.length > 2 && !0 === arguments[2];
if (!i && 0 === r) return 0;
let n = !1;
for (;;)
switch (e) {
case "ascii":
case "latin1":
case "binary":
return r;
case "utf8":
case "utf-8":
return G(t).length;
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * r;
case "hex":
return r >>> 1;
case "base64":
return Y(t).length;
default:
if (n) return i ? -1 : G(t).length;
(e = ("" + e).toLowerCase()), (n = !0);
}
}
function m(t, e, r) {
let i = !1;
if (((void 0 === e || e < 0) && (e = 0), e > this.length))
return "";
if (
((void 0 === r || r > this.length) && (r = this.length), r <= 0)
)
return "";
if ((r >>>= 0) <= (e >>>= 0)) return "";
for (t || (t = "utf8"); ; )
switch (t) {
case "hex":
return A(this, e, r);
case "utf8":
case "utf-8":
return B(this, e, r);
case "ascii":
return P(this, e, r);
case "latin1":
case "binary":
return R(this, e, r);
case "base64":
return O(this, e, r);
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return N(this, e, r);
default:
if (i) throw new TypeError("Unknown encoding: " + t);
(t = (t + "").toLowerCase()), (i = !0);
}
}
function g(t, e, r) {
const i = t[e];
(t[e] = t[r]), (t[r] = i);
}
function y(t, e, r, i, n) {
if (0 === t.length) return -1;
if (
("string" == typeof r
? ((i = r), (r = 0))
: r > 2147483647
? (r = 2147483647)
: r < -2147483648 && (r = -2147483648),
X((r = +r)) && (r = n ? 0 : t.length - 1),
r < 0 && (r = t.length + r),
r >= t.length)
) {
if (n) return -1;
r = t.length - 1;
} else if (r < 0) {
if (!n) return -1;
r = 0;
}
if (("string" == typeof e && (e = h.from(e, i)), h.isBuffer(e)))
return 0 === e.length ? -1 : w(t, e, r, i, n);
if ("number" == typeof e)
return (
(e &= 255),
"function" == typeof Uint8Array.prototype.indexOf
? n
? Uint8Array.prototype.indexOf.call(t, e, r)
: Uint8Array.prototype.lastIndexOf.call(t, e, r)
: w(t, [e], r, i, n)
);
throw new TypeError("val must be string, number or Buffer");
}
function w(t, e, r, i, n) {
let s,
o = 1,
a = t.length,
h = e.length;
if (
void 0 !== i &&
("ucs2" === (i = String(i).toLowerCase()) ||
"ucs-2" === i ||
"utf16le" === i ||
"utf-16le" === i)
) {
if (t.length < 2 || e.length < 2) return -1;
(o = 2), (a /= 2), (h /= 2), (r /= 2);
}
function f(t, e) {
return 1 === o ? t[e] : t.readUInt16BE(e * o);
}
if (n) {
let i = -1;
for (s = r; s < a; s++)
if (f(t, s) === f(e, -1 === i ? 0 : s - i)) {
if ((-1 === i && (i = s), s - i + 1 === h)) return i * o;
} else -1 !== i && (s -= s - i), (i = -1);
} else
for (r + h > a && (r = a - h), s = r; s >= 0; s--) {
let r = !0;
for (let i = 0; i < h; i++)
if (f(t, s + i) !== f(e, i)) {
r = !1;
break;
}
if (r) return s;
}
return -1;
}
function v(t, e, r, i) {
r = Number(r) || 0;
const n = t.length - r;
i ? (i = Number(i)) > n && (i = n) : (i = n);
const s = e.length;
let o;
for (i > s / 2 && (i = s / 2), o = 0; o < i; ++o) {
const i = parseInt(e.substr(2 * o, 2), 16);
if (X(i)) return o;
t[r + o] = i;
}
return o;
}
function _(t, e, r, i) {
return J(G(e, t.length - r), t, r, i);
}
function S(t, e, r, i) {
return J(
(function(t) {
const e = [];
for (let r = 0; r < t.length; ++r)
e.push(255 & t.charCodeAt(r));
return e;
})(e),
t,
r,
i
);
}
function E(t, e, r, i) {
return J(Y(e), t, r, i);
}
function I(t, e, r, i) {
return J(
(function(t, e) {
let r, i, n;
const s = [];
for (let o = 0; o < t.length && !((e -= 2) < 0); ++o)
(r = t.charCodeAt(o)),
(i = r >> 8),
(n = r % 256),
s.push(n),
s.push(i);
return s;
})(e, t.length - r),
t,
r,
i
);
}
function O(t, e, r) {
return 0 === e && r === t.length
? i.fromByteArray(t)
: i.fromByteArray(t.slice(e, r));
}
function B(t, e, r) {
r = Math.min(t.length, r);
const i = [];
let n = e;
for (; n < r; ) {
const e = t[n];
let s = null,
o = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
if (n + o <= r) {
let r, i, a, h;
switch (o) {
case 1:
e < 128 && (s = e);
break;
case 2:
(r = t[n + 1]),
128 == (192 & r) &&
((h = ((31 & e) << 6) | (63 & r)), h > 127 && (s = h));
break;
case 3:
(r = t[n + 1]),
(i = t[n + 2]),
128 == (192 & r) &&
128 == (192 & i) &&
((h = ((15 & e) << 12) | ((63 & r) << 6) | (63 & i)),
h > 2047 && (h < 55296 || h > 57343) && (s = h));
break;
case 4:
(r = t[n + 1]),
(i = t[n + 2]),
(a = t[n + 3]),
128 == (192 & r) &&
128 == (192 & i) &&
128 == (192 & a) &&
((h =
((15 & e) << 18) |
((63 & r) << 12) |
((63 & i) << 6) |
(63 & a)),
h > 65535 && h < 1114112 && (s = h));
}
}
null === s
? ((s = 65533), (o = 1))
: s > 65535 &&
((s -= 65536),
i.push(((s >>> 10) & 1023) | 55296),
(s = 56320 | (1023 & s))),
i.push(s),
(n += o);
}
return (function(t) {
const e = t.length;
if (e <= k) return String.fromCharCode.apply(String, t);
let r = "",
i = 0;
for (; i < e; )
r += String.fromCharCode.apply(String, t.slice(i, (i += k)));
return r;
})(i);
}
(e.kMaxLength = o),
(h.TYPED_ARRAY_SUPPORT = (function() {
try {
const t = new Uint8Array(1),
e = {
foo: function() {
return 42;
},
};
return (
Object.setPrototypeOf(e, Uint8Array.prototype),
Object.setPrototypeOf(t, e),
42 === t.foo()
);
} catch (t) {
return !1;
}
})()),
h.TYPED_ARRAY_SUPPORT ||
"undefined" == typeof console ||
"function" != typeof console.error ||
console.error(
"This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
),
Object.defineProperty(h.prototype, "parent", {
enumerable: !0,
get: function() {
if (h.isBuffer(this)) return this.buffer;
},
}),
Object.defineProperty(h.prototype, "offset", {
enumerable: !0,
get: function() {
if (h.isBuffer(this)) return this.byteOffset;
},
}),
(h.poolSize = 8192),
(h.from = function(t, e, r) {
return f(t, e, r);
}),
Object.setPrototypeOf(h.prototype, Uint8Array.prototype),
Object.setPrototypeOf(h, Uint8Array),
(h.alloc = function(t, e, r) {
return (function(t, e, r) {
return (
u(t),
t <= 0
? a(t)
: void 0 !== e
? "string" == typeof r
? a(t).fill(e, r)
: a(t).fill(e)
: a(t)
);
})(t, e, r);
}),
(h.allocUnsafe = function(t) {
return c(t);
}),
(h.allocUnsafeSlow = function(t) {
return c(t);
}),
(h.isBuffer = function(t) {
return null != t && !0 === t._isBuffer && t !== h.prototype;
}),
(h.compare = function(t, e) {
if (
(W(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)),
W(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)),
!h.isBuffer(t) || !h.isBuffer(e))
)
throw new TypeError(
'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
);
if (t === e) return 0;
let r = t.length,
i = e.length;
for (let n = 0, s = Math.min(r, i); n < s; ++n)
if (t[n] !== e[n]) {
(r = t[n]), (i = e[n]);
break;
}
return r < i ? -1 : i < r ? 1 : 0;
}),
(h.isEncoding = function(t) {
switch (String(t).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;
default:
return !1;
}
}),
(h.concat = function(t, e) {
if (!Array.isArray(t))
throw new TypeError(
'"list" argument must be an Array of Buffers'
);
if (0 === t.length) return h.alloc(0);
let r;
if (void 0 === e)
for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
const i = h.allocUnsafe(e);
let n = 0;
for (r = 0; r < t.length; ++r) {
let e = t[r];
if (W(e, Uint8Array))
n + e.length > i.length
? (h.isBuffer(e) || (e = h.from(e)), e.copy(i, n))
: Uint8Array.prototype.set.call(i, e, n);
else {
if (!h.isBuffer(e))
throw new TypeError(
'"list" argument must be an Array of Buffers'
);
e.copy(i, n);
}
n += e.length;
}
return i;
}),
(h.byteLength = b),
(h.prototype._isBuffer = !0),
(h.prototype.swap16 = function() {
const t = this.length;
if (t % 2 != 0)
throw new RangeError(
"Buffer size must be a multiple of 16-bits"
);
for (let e = 0; e < t; e += 2) g(this, e, e + 1);
return this;
}),
(h.prototype.swap32 = function() {
const t = this.length;
if (t % 4 != 0)
throw new RangeError(
"Buffer size must be a multiple of 32-bits"
);
for (let e = 0; e < t; e += 4)
g(this, e, e + 3), g(this, e + 1, e + 2);
return this;
}),
(h.prototype.swap64 = function() {
const t = this.length;
if (t % 8 != 0)
throw new RangeError(
"Buffer size must be a multiple of 64-bits"
);
for (let e = 0; e < t; e += 8)
g(this, e, e + 7),
g(this, e + 1, e + 6),
g(this, e + 2, e + 5),
g(this, e + 3, e + 4);
return this;
}),
(h.prototype.toString = function() {
const t = this.length;
return 0 === t
? ""
: 0 === arguments.length
? B(this, 0, t)
: m.apply(this, arguments);
}),
(h.prototype.toLocaleString = h.prototype.toString),
(h.prototype.equals = function(t) {
if (!h.isBuffer(t))
throw new TypeError("Argument must be a Buffer");
return this === t || 0 === h.compare(this, t);
}),
(h.prototype.inspect = function() {
let t = "";
const r = e.INSPECT_MAX_BYTES;
return (
(t = this.toString("hex", 0, r)
.replace(/(.{2})/g, "$1 ")
.trim()),
this.length > r && (t += " ... "),
"<Buffer " + t + ">"
);
}),
s && (h.prototype[s] = h.prototype.inspect),
(h.prototype.compare = function(t, e, r, i, n) {
if (
(W(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)),
!h.isBuffer(t))
)
throw new TypeError(
'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
typeof t
);
if (
(void 0 === e && (e = 0),
void 0 === r && (r = t ? t.length : 0),
void 0 === i && (i = 0),
void 0 === n && (n = this.length),
e < 0 || r > t.length || i < 0 || n > this.length)
)
throw new RangeError("out of range index");
if (i >= n && e >= r) return 0;
if (i >= n) return -1;
if (e >= r) return 1;
if (this === t) return 0;
let s = (n >>>= 0) - (i >>>= 0),
o = (r >>>= 0) - (e >>>= 0);
const a = Math.min(s, o),
f = this.slice(i, n),
u = t.slice(e, r);
for (let t = 0; t < a; ++t)
if (f[t] !== u[t]) {
(s = f[t]), (o = u[t]);
break;
}
return s < o ? -1 : o < s ? 1 : 0;
}),
(h.prototype.includes = function(t, e, r) {
return -1 !== this.indexOf(t, e, r);
}),
(h.prototype.indexOf = function(t, e, r) {
return y(this, t, e, r, !0);
}),
(h.prototype.lastIndexOf = function(t, e, r) {
return y(this, t, e, r, !1);
}),
(h.prototype.write = function(t, e, r, i) {
if (void 0 === e) (i = "utf8"), (r = this.length), (e = 0);
else if (void 0 === r && "string" == typeof e)
(i = e), (r = this.length), (e = 0);
else {
if (!isFinite(e))
throw new Error(
"Buffer.write(string, encoding, offset[, length]) is no longer supported"
);
(e >>>= 0),
isFinite(r)
? ((r >>>= 0), void 0 === i && (i = "utf8"))
: ((i = r), (r = void 0));
}
const n = this.length - e;
if (
((void 0 === r || r > n) && (r = n),
(t.length > 0 && (r < 0 || e < 0)) || e > this.length)
)
throw new RangeError("Attempt to write outside buffer bounds");
i || (i = "utf8");
let s = !1;
for (;;)
switch (i) {
case "hex":
return v(this, t, e, r);
case "utf8":
case "utf-8":
return _(this, t, e, r);
case "ascii":
case "latin1":
case "binary":
return S(this, t, e, r);
case "base64":
return E(this, t, e, r);
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return I(this, t, e, r);
default:
if (s) throw new TypeError("Unknown encoding: " + i);
(i = ("" + i).toLowerCase()), (s = !0);
}
}),
(h.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0),
};
});
const k = 4096;
function P(t, e, r) {
let i = "";
r = Math.min(t.length, r);
for (let n = e; n < r; ++n) i += String.fromCharCode(127 & t[n]);
return i;
}
function R(t, e, r) {
let i = "";
r = Math.min(t.length, r);
for (let n = e; n < r; ++n) i += String.fromCharCode(t[n]);
return i;
}
function A(t, e, r) {
const i = t.length;
(!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i);
let n = "";
for (let i = e; i < r; ++i) n += Q[t[i]];
return n;
}
function N(t, e, r) {
const i = t.slice(e, r);
let n = "";
for (let t = 0; t < i.length - 1; t += 2)
n += String.fromCharCode(i[t] + 256 * i[t + 1]);
return n;
}
function x(t, e, r) {
if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
if (t + e > r)
throw new RangeError("Trying to access beyond buffer length");
}
function M(t, e, r, i, n, s) {
if (!h.isBuffer(t))
throw new TypeError(
'"buffer" argument must be a Buffer instance'
);
if (e > n || e < s)
throw new RangeError('"value" argument is out of bounds');
if (r + i > t.length) throw new RangeError("Index out of range");
}
function T(t, e, r, i, n) {
V(e, i, n, t, r, 7);
let s = Number(e & BigInt(4294967295));
(t[r++] = s),
(s >>= 8),
(t[r++] = s),
(s >>= 8),
(t[r++] = s),
(s >>= 8),
(t[r++] = s);
let o = Number((e >> BigInt(32)) & BigInt(4294967295));
return (
(t[r++] = o),
(o >>= 8),
(t[r++] = o),
(o >>= 8),
(t[r++] = o),
(o >>= 8),
(t[r++] = o),
r
);
}
function C(t, e, r, i, n) {
V(e, i, n, t, r, 7);
let s = Number(e & BigInt(4294967295));
(t[r + 7] = s),
(s >>= 8),
(t[r + 6] = s),
(s >>= 8),
(t[r + 5] = s),
(s >>= 8),
(t[r + 4] = s);
let o = Number((e >> BigInt(32)) & BigInt(4294967295));
return (
(t[r + 3] = o),
(o >>= 8),
(t[r + 2] = o),
(o >>= 8),
(t[r + 1] = o),
(o >>= 8),
(t[r] = o),
r + 8
);
}
function L(t, e, r, i, n, s) {
if (r + i > t.length) throw new RangeError("Index out of range");
if (r < 0) throw new RangeError("Index out of range");
}
function H(t, e, r, i, s) {
return (
(e = +e),
(r >>>= 0),
s || L(t, 0, r, 4),
n.write(t, e, r, i, 23, 4),
r + 4
);
}
function U(t, e, r, i, s) {
return (
(e = +e),
(r >>>= 0),
s || L(t, 0, r, 8),
n.write(t, e, r, i, 52, 8),
r + 8
);
}
(h.prototype.slice = function(t, e) {
const r = this.length;
(t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
(e = void 0 === e ? r : ~~e) < 0
? (e += r) < 0 && (e = 0)
: e > r && (e = r),
e < t && (e = t);
const i = this.subarray(t, e);
return Object.setPrototypeOf(i, h.prototype), i;
}),
(h.prototype.readUintLE = h.prototype.readUIntLE = function(
t,
e,
r
) {
(t >>>= 0), (e >>>= 0), r || x(t, e, this.length);
let i = this[t],
n = 1,
s = 0;
for (; ++s < e && (n *= 256); ) i += this[t + s] * n;
return i;
}),
(h.prototype.readUintBE = h.prototype.readUIntBE = function(
t,
e,
r
) {
(t >>>= 0), (e >>>= 0), r || x(t, e, this.length);
let i = this[t + --e],
n = 1;
for (; e > 0 && (n *= 256); ) i += this[t + --e] * n;
return i;
}),
(h.prototype.readUint8 = h.prototype.readUInt8 = function(t, e) {
return (t >>>= 0), e || x(t, 1, this.length), this[t];
}),
(h.prototype.readUint16LE = h.prototype.readUInt16LE = function(
t,
e
) {
return (
(t >>>= 0),
e || x(t, 2, this.length),
this[t] | (this[t + 1] << 8)
);
}),
(h.prototype.readUint16BE = h.prototype.readUInt16BE = function(
t,
e
) {
return (
(t >>>= 0),
e || x(t, 2, this.length),
(this[t] << 8) | this[t + 1]
);
}),
(h.prototype.readUint32LE = h.prototype.readUInt32LE = function(
t,
e
) {
return (
(t >>>= 0),
e || x(t, 4, this.length),
(this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
16777216 * this[t + 3]
);
}),
(h.prototype.readUint32BE = h.prototype.readUInt32BE = function(
t,
e
) {
return (
(t >>>= 0),
e || x(t, 4, this.length),
16777216 * this[t] +
((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
);
}),
(h.prototype.readBigUInt64LE = Z(function(t) {
j((t >>>= 0), "offset");
const e = this[t],
r = this[t + 7];
(void 0 !== e && void 0 !== r) || q(t, this.length - 8);
const i =
e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24,
n =
this[++t] + 256 * this[++t] + 65536 * this[++t] + r * 2 ** 24;
return BigInt(i) + (BigInt(n) << BigInt(32));
})),
(h.prototype.readBigUInt64BE = Z(function(t) {
j((t >>>= 0), "offset");
const e = this[t],
r = this[t + 7];
(void 0 !== e && void 0 !== r) || q(t, this.length - 8);
const i =
e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t],
n =
this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + r;
return (BigInt(i) << BigInt(32)) + BigInt(n);
})),
(h.prototype.readIntLE = function(t, e, r) {
(t >>>= 0), (e >>>= 0), r || x(t, e, this.length);
let i = this[t],
n = 1,
s = 0;
for (; ++s < e && (n *= 256); ) i += this[t + s] * n;
return (n *= 128), i >= n && (i -= Math.pow(2, 8 * e)), i;
}),
(h.prototype.readIntBE = function(t, e, r) {
(t >>>= 0), (e >>>= 0), r || x(t, e, this.length);
let i = e,
n = 1,
s = this[t + --i];
for (; i > 0 && (n *= 256); ) s += this[t + --i] * n;
return (n *= 128), s >= n && (s -= Math.pow(2, 8 * e)), s;
}),
(h.prototype.readInt8 = function(t, e) {
return (
(t >>>= 0),
e || x(t, 1, this.length),
128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
);
}),
(h.prototype.readInt16LE = function(t, e) {
(t >>>= 0), e || x(t, 2, this.length);
const r = this[t] | (this[t + 1] << 8);
return 32768 & r ? 4294901760 | r : r;
}),
(h.prototype.readInt16BE = function(t, e) {
(t >>>= 0), e || x(t, 2, this.length);
const r = this[t + 1] | (this[t] << 8);
return 32768 & r ? 4294901760 | r : r;
}),
(h.prototype.readInt32LE = function(t, e) {
return (
(t >>>= 0),
e || x(t, 4, this.length),
this[t] |
(this[t + 1] << 8) |
(this[t + 2] << 16) |
(this[t + 3] << 24)
);
}),
(h.prototype.readInt32BE = function(t, e) {
return (
(t >>>= 0),
e || x(t, 4, this.length),
(this[t] << 24) |
(this[t + 1] << 16) |
(this[t + 2] << 8) |
this[t + 3]
);
}),
(h.prototype.readBigInt64LE = Z(function(t) {
j((t >>>= 0), "offset");
const e = this[t],
r = this[t + 7];
(void 0 !== e && void 0 !== r) || q(t, this.length - 8);
const i =
this[t + 4] +
256 * this[t + 5] +
65536 * this[t + 6] +
(r << 24);
return (
(BigInt(i) << BigInt(32)) +
BigInt(
e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24
)
);
})),
(h.prototype.readBigInt64BE = Z(function(t) {
j((t >>>= 0), "offset");
const e = this[t],
r = this[t + 7];
(void 0 !== e && void 0 !== r) || q(t, this.length - 8);
const i =
(e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
return (
(BigInt(i) << BigInt(32)) +
BigInt(
this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + r
)
);
})),
(h.prototype.readFloatLE = function(t, e) {
return (
(t >>>= 0),
e || x(t, 4, this.length),
n.read(this, t, !0, 23, 4)
);
}),
(h.prototype.readFloatBE = function(t, e) {
return (
(t >>>= 0),
e || x(t, 4, this.length),
n.read(this, t, !1, 23, 4)
);
}),
(h.prototype.readDoubleLE = function(t, e) {
return (
(t >>>= 0),
e || x(t, 8, this.length),
n.read(this, t, !0, 52, 8)
);
}),
(h.prototype.readDoubleBE = function(t, e) {
return (
(t >>>= 0),
e || x(t, 8, this.length),
n.read(this, t, !1, 52, 8)
);
}),
(h.prototype.writeUintLE = h.prototype.writeUIntLE = function(
t,
e,
r,
i
) {
(t = +t),
(e >>>= 0),
(r >>>= 0),
i || M(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
let n = 1,
s = 0;
for (this[e] = 255 & t; ++s < r && (n *= 256); )
this[e + s] = (t / n) & 255;
return e + r;
}),
(h.prototype.writeUintBE = h.prototype.writeUIntBE = function(
t,
e,
r,
i
) {
(t = +t),
(e >>>= 0),
(r >>>= 0),
i || M(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
let n = r - 1,
s = 1;
for (this[e + n] = 255 & t; --n >= 0 && (s *= 256); )
this[e + n] = (t / s) & 255;
return e + r;
}),
(h.prototype.writeUint8 = h.prototype.writeUInt8 = function(
t,
e,
r
) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 1, 255, 0),
(this[e] = 255 & t),
e + 1
);
}),
(h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(
t,
e,
r
) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 2, 65535, 0),
(this[e] = 255 & t),
(this[e + 1] = t >>> 8),
e + 2
);
}),
(h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(
t,
e,
r
) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 2, 65535, 0),
(this[e] = t >>> 8),
(this[e + 1] = 255 & t),
e + 2
);
}),
(h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(
t,
e,
r
) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 4, 4294967295, 0),
(this[e + 3] = t >>> 24),
(this[e + 2] = t >>> 16),
(this[e + 1] = t >>> 8),
(this[e] = 255 & t),
e + 4
);
}),
(h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(
t,
e,
r
) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 4, 4294967295, 0),
(this[e] = t >>> 24),
(this[e + 1] = t >>> 16),
(this[e + 2] = t >>> 8),
(this[e + 3] = 255 & t),
e + 4
);
}),
(h.prototype.writeBigUInt64LE = Z(function(t, e = 0) {
return T(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
})),
(h.prototype.writeBigUInt64BE = Z(function(t, e = 0) {
return C(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
})),
(h.prototype.writeIntLE = function(t, e, r, i) {
if (((t = +t), (e >>>= 0), !i)) {
const i = Math.pow(2, 8 * r - 1);
M(this, t, e, r, i - 1, -i);
}
let n = 0,
s = 1,
o = 0;
for (this[e] = 255 & t; ++n < r && (s *= 256); )
t < 0 && 0 === o && 0 !== this[e + n - 1] && (o = 1),
(this[e + n] = (((t / s) >> 0) - o) & 255);
return e + r;
}),
(h.prototype.writeIntBE = function(t, e, r, i) {
if (((t = +t), (e >>>= 0), !i)) {
const i = Math.pow(2, 8 * r - 1);
M(this, t, e, r, i - 1, -i);
}
let n = r - 1,
s = 1,
o = 0;
for (this[e + n] = 255 & t; --n >= 0 && (s *= 256); )
t < 0 && 0 === o && 0 !== this[e + n + 1] && (o = 1),
(this[e + n] = (((t / s) >> 0) - o) & 255);
return e + r;
}),
(h.prototype.writeInt8 = function(t, e, r) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 1, 127, -128),
t < 0 && (t = 255 + t + 1),
(this[e] = 255 & t),
e + 1
);
}),
(h.prototype.writeInt16LE = function(t, e, r) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 2, 32767, -32768),
(this[e] = 255 & t),
(this[e + 1] = t >>> 8),
e + 2
);
}),
(h.prototype.writeInt16BE = function(t, e, r) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 2, 32767, -32768),
(this[e] = t >>> 8),
(this[e + 1] = 255 & t),
e + 2
);
}),
(h.prototype.writeInt32LE = function(t, e, r) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 4, 2147483647, -2147483648),
(this[e] = 255 & t),
(this[e + 1] = t >>> 8),
(this[e + 2] = t >>> 16),
(this[e + 3] = t >>> 24),
e + 4
);
}),
(h.prototype.writeInt32BE = function(t, e, r) {
return (
(t = +t),
(e >>>= 0),
r || M(this, t, e, 4, 2147483647, -2147483648),
t < 0 && (t = 4294967295 + t + 1),
(this[e] = t >>> 24),
(this[e + 1] = t >>> 16),
(this[e + 2] = t >>> 8),
(this[e + 3] = 255 & t),
e + 4
);
}),
(h.prototype.writeBigInt64LE = Z(function(t, e = 0) {
return T(
this,
t,
e,
-BigInt("0x8000000000000000"),
BigInt("0x7fffffffffffffff")
);
})),
(h.prototype.writeBigInt64BE = Z(function(t, e = 0) {
return C(
this,
t,
e,
-BigInt("0x8000000000000000"),
BigInt("0x7fffffffffffffff")
);
})),
(h.prototype.writeFloatLE = function(t, e, r) {
return H(this, t, e, !0, r);
}),
(h.prototype.writeFloatBE = function(t, e, r) {
return H(this, t, e, !1, r);
}),
(h.prototype.writeDoubleLE = function(t, e, r) {
return U(this, t, e, !0, r);
}),
(h.prototype.writeDoubleBE = function(t, e, r) {
return U(this, t, e, !1, r);
}),
(h.prototype.copy = function(t, e, r, i) {
if (!h.isBuffer(t))
throw new TypeError("argument should be a Buffer");
if (
(r || (r = 0),
i || 0 === i || (i = this.length),
e >= t.length && (e = t.length),
e || (e = 0),
i > 0 && i < r && (i = r),
i === r)
)
return 0;
if (0 === t.length || 0 === this.length) return 0;
if (e < 0) throw new RangeError("targetStart out of bounds");
if (r < 0 || r >= this.length)
throw new RangeError("Index out of range");
if (i < 0) throw new RangeError("sourceEnd out of bounds");
i > this.length && (i = this.length),
t.length - e < i - r && (i = t.length - e + r);
const n = i - r;
return (
this === t &&
"function" == typeof Uint8Array.prototype.copyWithin
? this.copyWithin(e, r, i)
: Uint8Array.prototype.set.call(t, this.subarray(r, i), e),
n
);
}),
(h.prototype.fill = function(t, e, r, i) {
if ("string" == typeof t) {
if (
("string" == typeof e
? ((i = e), (e = 0), (r = this.length))
: "string" == typeof r && ((i = r), (r = this.length)),
void 0 !== i && "string" != typeof i)
)
throw new TypeError("encoding must be a string");
if ("string" == typeof i && !h.isEncoding(i))
throw new TypeError("Unknown encoding: " + i);
if (1 === t.length) {
const e = t.charCodeAt(0);
(("utf8" === i && e < 128) || "latin1" === i) && (t = e);
}
} else
"number" == typeof t
? (t &= 255)
: "boolean" == typeof t && (t = Number(t));
if (e < 0 || this.length < e || this.length < r)
throw new RangeError("Out of range index");
if (r <= e) return this;
let n;
if (
((e >>>= 0),
(r = void 0 === r ? this.length : r >>> 0),
t || (t = 0),
"number" == typeof t)
)
for (n = e; n < r; ++n) this[n] = t;
else {
const s = h.isBuffer(t) ? t : h.from(t, i),
o = s.length;
if (0 === o)
throw new TypeError(
'The value "' + t + '" is invalid for argument "value"'
);
for (n = 0; n < r - e; ++n) this[n + e] = s[n % o];
}
return this;
});
const F = {};
function K(t, e, r) {
F[t] = class extends r {
constructor() {
super(),
Object.defineProperty(this, "message", {
value: e.apply(this, arguments),
writable: !0,
configurable: !0,
}),
(this.name = `${this.name} [${t}]`),
this.stack,
delete this.name;
}
get code() {
return t;
}
set code(t) {
Object.defineProperty(this, "code", {
configurable: !0,
enumerable: !0,
value: t,
writable: !0,
});
}
toString() {
return `${this.name} [${t}]: ${this.message}`;
}
};
}
function D(t) {
let e = "",
r = t.length;
const i = "-" === t[0] ? 1 : 0;
for (; r >= i + 4; r -= 3) e = `_${t.slice(r - 3, r)}${e}`;
return `${t.slice(0, r)}${e}`;
}
function V(t, e, r, i, n, s) {
if (t > r || t < e) {
const i = "bigint" == typeof e ? "n" : "";
let n;
throw ((n =
s > 3
? 0 === e || e === BigInt(0)
? `>= 0${i} and < 2${i} ** ${8 * (s + 1)}${i}`
: `>= -(2${i} ** ${8 * (s + 1) - 1}${i}) and < 2 ** ${8 *
(s + 1) -
1}${i}`
: `>= ${e}${i} and <= ${r}${i}`),
new F.ERR_OUT_OF_RANGE("value", n, t));
}
!(function(t, e, r) {
j(e, "offset"),
(void 0 !== t[e] && void 0 !== t[e + r]) ||
q(e, t.length - (r + 1));
})(i, n, s);
}
function j(t, e) {
if ("number" != typeof t)
throw new F.ERR_INVALID_ARG_TYPE(e, "number", t);
}
function q(t, e, r) {
if (Math.floor(t) !== t)
throw (j(t, r),
new F.ERR_OUT_OF_RANGE(r || "offset", "an integer", t));
if (e < 0) throw new F.ERR_BUFFER_OUT_OF_BOUNDS();
throw new F.ERR_OUT_OF_RANGE(
r || "offset",
`>= ${r ? 1 : 0} and <= ${e}`,
t
);
}
K(
"ERR_BUFFER_OUT_OF_BOUNDS",
function(t) {
return t
? `${t} is outside of buffer bounds`
: "Attempt to access memory outside buffer bounds";
},
RangeError
),
K(
"ERR_INVALID_ARG_TYPE",
function(t, e) {
return `The "${t}" argument must be of type number. Received type ${typeof e}`;
},
TypeError
),
K(
"ERR_OUT_OF_RANGE",
function(t, e, r) {
let i = `The value of "${t}" is out of range.`,
n = r;
return (
Number.isInteger(r) && Math.abs(r) > 2 ** 32
? (n = D(String(r)))
: "bigint" == typeof r &&
((n = String(r)),
(r > BigInt(2) ** BigInt(32) ||
r < -(BigInt(2) ** BigInt(32))) &&
(n = D(n)),
(n += "n")),
(i += ` It must be ${e}. Received ${n}`),
i
);
},
RangeError
);
const z = /[^+/0-9A-Za-z-_]/g;
function G(t, e) {
let r;
e = e || 1 / 0;
const i = t.length;
let n = null;
const s = [];
for (let o = 0; o < i; ++o) {
if (((r = t.charCodeAt(o)), r > 55295 && r < 57344)) {
if (!n) {
if (r > 56319) {
(e -= 3) > -1 && s.push(239, 191, 189);
continue;
}
if (o + 1 === i) {
(e -= 3) > -1 && s.push(239, 191, 189);
continue;
}
n = r;
continue;
}
if (r < 56320) {
(e -= 3) > -1 && s.push(239, 191, 189), (n = r);
continue;
}
r = 65536 + (((n - 55296) << 10) | (r - 56320));
} else n && (e -= 3) > -1 && s.push(239, 191, 189);
if (((n = null), r < 128)) {
if ((e -= 1) < 0) break;
s.push(r);
} else if (r < 2048) {
if ((e -= 2) < 0) break;
s.push((r >> 6) | 192, (63 & r) | 128);
} else if (r < 65536) {
if ((e -= 3) < 0) break;
s.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
} else {
if (!(r < 1114112)) throw new Error("Invalid code point");
if ((e -= 4) < 0) break;
s.push(
(r >> 18) | 240,
((r >> 12) & 63) | 128,
((r >> 6) & 63) | 128,
(63 & r) | 128
);
}
}
return s;
}
function Y(t) {
return i.toByteArray(
(function(t) {
if (
(t = (t = t.split("=")[0]).trim().replace(z, "")).length < 2
)
return "";
for (; t.length % 4 != 0; ) t += "=";
return t;
})(t)
);
}
function J(t, e, r, i) {
let n;
for (n = 0; n < i && !(n + r >= e.length || n >= t.length); ++n)
e[n + r] = t[n];
return n;
}
function W(t, e) {
return (
t instanceof e ||
(null != t &&
null != t.constructor &&
null != t.constructor.name &&
t.constructor.name === e.name)
);
}
function X(t) {
return t != t;
}
const Q = (function() {
const t = "0123456789abcdef",
e = new Array(256);
for (let r = 0; r < 16; ++r) {
const i = 16 * r;
for (let n = 0; n < 16; ++n) e[i + n] = t[r] + t[n];
}
return e;
})();
function Z(t) {
return "undefined" == typeof BigInt ? $ : t;
}
function $() {
throw new Error("BigInt not supported");
}
},
8028: (t, e, r) => {
var i = r(2318);
t.exports = function(t) {
return new i().update(t).digest();
};
},
7187: (t) => {
"use strict";
var e,
r = "object" == typeof Reflect ? Reflect : null,
i =
r && "function" == typeof r.apply
? r.apply
: function(t, e, r) {
return Function.prototype.apply.call(t, e, r);
};
e =
r && "function" == typeof r.ownKeys
? r.ownKeys
: Object.getOwnPropertySymbols
? function(t) {
return Object.getOwnPropertyNames(t).concat(
Object.getOwnPropertySymbols(t)
);
}
: function(t) {
return Object.getOwnPropertyNames(t);
};
var n =
Number.isNaN ||
function(t) {
return t != t;
};
function s() {
s.init.call(this);
}
(t.exports = s),
(t.exports.once = function(t, e) {
return new Promise(function(r, i) {
function n(r) {
t.removeListener(e, s), i(r);
}
function s() {
"function" == typeof t.removeListener &&
t.removeListener("error", n),
r([].slice.call(arguments));
}
b(t, e, s, { once: !0 }),
"error" !== e &&
(function(t, e, r) {
"function" == typeof t.on &&
b(t, "error", e, { once: !0 });
})(t, n);
});
}),
(s.EventEmitter = s),
(s.prototype._events = void 0),
(s.prototype._eventsCount = 0),
(s.prototype._maxListeners = void 0);
var o = 10;
function a(t) {
if ("function" != typeof t)
throw new TypeError(
'The "listener" argument must be of type Function. Received type ' +
typeof t
);
}
function h(t) {
return void 0 === t._maxListeners
? s.defaultMaxListeners
: t._maxListeners;
}
function f(t, e, r, i) {
var n, s, o, f;
if (
(a(r),
void 0 === (s = t._events)
? ((s = t._events = Object.create(null)), (t._eventsCount = 0))
: (void 0 !== s.newListener &&
(t.emit("newListener", e, r.listener ? r.listener : r),
(s = t._events)),
(o = s[e])),
void 0 === o)
)
(o = s[e] = r), ++t._eventsCount;
else if (
("function" == typeof o
? (o = s[e] = i ? [r, o] : [o, r])
: i
? o.unshift(r)
: o.push(r),
(n = h(t)) > 0 && o.length > n && !o.warned)
) {
o.warned = !0;
var u = new Error(
"Possible EventEmitter memory leak detected. " +
o.length +
" " +
String(e) +
" listeners added. Use emitter.setMaxListeners() to increase limit"
);
(u.name = "MaxListenersExceededWarning"),
(u.emitter = t),
(u.type = e),
(u.count = o.length),
(f = u),
console && console.warn && console.warn(f);
}
return t;
}
function u() {
if (!this.fired)
return (
this.target.removeListener(this.type, this.wrapFn),
(this.fired = !0),
0 === arguments.length
? this.listener.call(this.target)
: this.listener.apply(this.target, arguments)
);
}
function c(t, e, r) {
var i = {
fired: !1,
wrapFn: void 0,
target: t,
type: e,
listener: r,
},
n = u.bind(i);
return (n.listener = r), (i.wrapFn = n), n;
}
function d(t, e, r) {
var i = t._events;
if (void 0 === i) return [];
var n = i[e];
return void 0 === n
? []
: "function" == typeof n
? r
? [n.listener || n]
: [n]
: r
? (function(t) {
for (var e = new Array(t.length), r = 0; r < e.length; ++r)
e[r] = t[r].listener || t[r];
return e;
})(n)
: p(n, n.length);
}
function l(t) {
var e = this._events;
if (void 0 !== e) {
var r = e[t];
if ("function" == typeof r) return 1;
if (void 0 !== r) return r.length;
}
return 0;
}
function p(t, e) {
for (var r = new Array(e), i = 0; i < e; ++i) r[i] = t[i];
return r;
}
function b(t, e, r, i) {
if ("function" == typeof t.on) i.once ? t.once(e, r) : t.on(e, r);
else {
if ("function" != typeof t.addEventListener)
throw new TypeError(
'The "emitter" argument must be of type EventEmitter. Received type ' +
typeof t
);
t.addEventListener(e, function n(s) {
i.once && t.removeEventListener(e, n), r(s);
});
}
}
Object.defineProperty(s, "defaultMaxListeners", {
enumerable: !0,
get: function() {
return o;
},
set: function(t) {
if ("number" != typeof t || t < 0 || n(t))
throw new RangeError(
'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
t +
"."
);
o = t;
},
}),
(s.init = function() {
(void 0 !== this._events &&
this._events !== Object.getPrototypeOf(this)._events) ||
((this._events = Object.create(null)), (this._eventsCount = 0)),
(this._maxListeners = this._maxListeners || void 0);
}),
(s.prototype.setMaxListeners = function(t) {
if ("number" != typeof t || t < 0 || n(t))
throw new RangeError(
'The value of "n" is out of range. It must be a non-negative number. Received ' +
t +
"."
);
return (this._maxListeners = t), this;
}),
(s.prototype.getMaxListeners = function() {
return h(this);
}),
(s.prototype.emit = function(t) {
for (var e = [], r = 1; r < arguments.length; r++)
e.push(arguments[r]);
var n = "error" === t,
s = this._events;
if (void 0 !== s) n = n && void 0 === s.error;
else if (!n) return !1;
if (n) {
var o;
if ((e.length > 0 && (o = e[0]), o instanceof Error)) throw o;
var a = new Error(
"Unhandled error." + (o ? " (" + o.message + ")" : "")
);
throw ((a.context = o), a);
}
var h = s[t];
if (void 0 === h) return !1;
if ("function" == typeof h) i(h, this, e);
else {
var f = h.length,
u = p(h, f);
for (r = 0; r < f; ++r) i(u[r], this, e);
}
return !0;
}),
(s.prototype.addListener = function(t, e) {
return f(this, t, e, !1);
}),
(s.prototype.on = s.prototype.addListener),
(s.prototype.prependListener = function(t, e) {
return f(this, t, e, !0);
}),
(s.prototype.once = function(t, e) {
return a(e), this.on(t, c(this, t, e)), this;
}),
(s.prototype.prependOnceListener = function(t, e) {
return a(e), this.prependListener(t, c(this, t, e)), this;
}),
(s.prototype.removeListener = function(t, e) {
var r, i, n, s, o;
if ((a(e), void 0 === (i = this._events))) return this;
if (void 0 === (r = i[t])) return this;
if (r === e || r.listener === e)
0 == --this._eventsCount
? (this._events = Object.create(null))
: (delete i[t],
i.removeListener &&
this.emit("removeListener", t, r.listener || e));
else if ("function" != typeof r) {
for (n = -1, s = r.length - 1; s >= 0; s--)
if (r[s] === e || r[s].listener === e) {
(o = r[s].listener), (n = s);
break;
}
if (n < 0) return this;
0 === n
? r.shift()
: (function(t, e) {
for (; e + 1 < t.length; e++) t[e] = t[e + 1];
t.pop();
})(r, n),
1 === r.length && (i[t] = r[0]),
void 0 !== i.removeListener &&
this.emit("removeListener", t, o || e);
}
return this;
}),
(s.prototype.off = s.prototype.removeListener),
(s.prototype.removeAllListeners = function(t) {
var e, r, i;
if (void 0 === (r = this._events)) return this;
if (void 0 === r.removeListener)
return (
0 === arguments.length
? ((this._events = Object.create(null)),
(this._eventsCount = 0))
: void 0 !== r[t] &&
(0 == --this._eventsCount
? (this._events = Object.create(null))
: delete r[t]),
this
);
if (0 === arguments.length) {
var n,
s = Object.keys(r);
for (i = 0; i < s.length; ++i)
"removeListener" !== (n = s[i]) && this.removeAllListeners(n);
return (
this.removeAllListeners("removeListener"),
(this._events = Object.create(null)),
(this._eventsCount = 0),
this
);
}
if ("function" == typeof (e = r[t])) this.removeListener(t, e);
else if (void 0 !== e)
for (i = e.length - 1; i >= 0; i--)
this.removeListener(t, e[i]);
return this;
}),
(s.prototype.listeners = function(t) {
return d(this, t, !0);
}),
(s.prototype.rawListeners = function(t) {
return d(this, t, !1);
}),
(s.listenerCount = function(t, e) {
return "function" == typeof t.listenerCount
? t.listenerCount(e)
: l.call(t, e);
}),
(s.prototype.listenerCount = l),
(s.prototype.eventNames = function() {
return this._eventsCount > 0 ? e(this._events) : [];
});
},
3349: (t, e, r) => {
"use strict";
var i = r(9509).Buffer,
n = r(326).Transform;
function s(t) {
n.call(this),
(this._block = i.allocUnsafe(t)),
(this._blockSize = t),
(this._blockOffset = 0),
(this._length = [0, 0, 0, 0]),
(this._finalized = !1);
}
r(5717)(s, n),
(s.prototype._transform = function(t, e, r) {
var i = null;
try {
this.update(t, e);
} catch (t) {
i = t;
}
r(i);
}),
(s.prototype._flush = function(t) {
var e = null;
try {
this.push(this.digest());
} catch (t) {
e = t;
}
t(e);
}),
(s.prototype.update = function(t, e) {
if (
((function(t, e) {
if (!i.isBuffer(t) && "string" != typeof t)
throw new TypeError("Data must be a string or a buffer");
})(t),
this._finalized)
)
throw new Error("Digest already called");
i.isBuffer(t) || (t = i.from(t, e));
for (
var r = this._block, n = 0;
this._blockOffset + t.length - n >= this._blockSize;

) {
for (var s = this._blockOffset; s < this._blockSize; )
r[s++] = t[n++];
this._update(), (this._blockOffset = 0);
}
for (; n < t.length; ) r[this._blockOffset++] = t[n++];
for (var o = 0, a = 8 * t.length; a > 0; ++o)
(this._length[o] += a),
(a = (this._length[o] / 4294967296) | 0) > 0 &&
(this._length[o] -= 4294967296 * a);
return this;
}),
(s.prototype._update = function() {
throw new Error("_update is not implemented");
}),
(s.prototype.digest = function(t) {
if (this._finalized) throw new Error("Digest already called");
this._finalized = !0;
var e = this._digest();
void 0 !== t && (e = e.toString(t)),
this._block.fill(0),
(this._blockOffset = 0);
for (var r = 0; r < 4; ++r) this._length[r] = 0;
return e;
}),
(s.prototype._digest = function() {
throw new Error("_digest is not implemented");
}),
(t.exports = s);
},
9786: (t) => {
"use strict";
var e = {};
function r(t, r, i) {
i || (i = Error);
var n = (function(t) {
var e, i;
function n(e, i, n) {
return (
t.call(
this,
(function(t, e, i) {
return "string" == typeof r ? r : r(t, e, i);
})(e, i, n)
) || this
);
}
return (
(i = t),
((e = n).prototype = Object.create(i.prototype)),
(e.prototype.constructor = e),
(e.__proto__ = i),
n
);
})(i);
(n.prototype.name = i.name), (n.prototype.code = t), (e[t] = n);
}
function i(t, e) {
if (Array.isArray(t)) {
var r = t.length;
return (
(t = t.map(function(t) {
return String(t);
})),
r > 2
? "one of "
.concat(e, " ")
.concat(t.slice(0, r - 1).join(", "), ", or ") + t[r - 1]
: 2 === r
? "one of "
.concat(e, " ")
.concat(t[0], " or ")
.concat(t[1])
: "of ".concat(e, " ").concat(t[0])
);
}
return "of ".concat(e, " ").concat(String(t));
}
r(
"ERR_INVALID_OPT_VALUE",
function(t, e) {
return 'The value "' + e + '" is invalid for option "' + t + '"';
},
TypeError
),
r(
"ERR_INVALID_ARG_TYPE",
function(t, e, r) {
var n, s, o, a, h;
if (
("string" == typeof e &&
((s = "not "), e.substr(0, s.length) === s)
? ((n = "must not be"), (e = e.replace(/^not /, "")))
: (n = "must be"),
(function(t, e, r) {
return (
(void 0 === r || r > t.length) && (r = t.length),
t.substring(r - e.length, r) === e
);
})(t, " argument"))
)
o = "The "
.concat(t, " ")
.concat(n, " ")
.concat(i(e, "type"));
else {
var f =
("number" != typeof h && (h = 0),
h + ".".length > (a = t).length || -1 === a.indexOf(".", h)
? "argument"
: "property");
o = 'The "'
.concat(t, '" ')
.concat(f, " ")
.concat(n, " ")
.concat(i(e, "type"));
}
return o + ". Received type ".concat(typeof r);
},
TypeError
),
r("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"),
r("ERR_METHOD_NOT_IMPLEMENTED", function(t) {
return "The " + t + " method is not implemented";
}),
r("ERR_STREAM_PREMATURE_CLOSE", "Premature close"),
r("ERR_STREAM_DESTROYED", function(t) {
return "Cannot call " + t + " after a stream was destroyed";
}),
r("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"),
r("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"),
r("ERR_STREAM_WRITE_AFTER_END", "write after end"),
r(
"ERR_STREAM_NULL_VALUES",
"May not write null values to stream",
TypeError
),
r(
"ERR_UNKNOWN_ENCODING",
function(t) {
return "Unknown encoding: " + t;
},
TypeError
),
r(
"ERR_STREAM_UNSHIFT_AFTER_END_EVENT",
"stream.unshift() after end event"
),
(t.exports.q = e);
},
2910: (t, e, r) => {
"use strict";
var i = r(4155),
n =
Object.keys ||
function(t) {
var e = [];
for (var r in t) e.push(r);
return e;
};
t.exports = u;
var s = r(5789),
o = r(469);
r(5717)(u, s);
for (var a = n(o.prototype), h = 0; h < a.length; h++) {
var f = a[h];
u.prototype[f] || (u.prototype[f] = o.prototype[f]);
}
function u(t) {
if (!(this instanceof u)) return new u(t);
s.call(this, t),
o.call(this, t),
(this.allowHalfOpen = !0),
t &&
(!1 === t.readable && (this.readable = !1),
!1 === t.writable && (this.writable = !1),
!1 === t.allowHalfOpen &&
((this.allowHalfOpen = !1), this.once("end", c)));
}
function c() {
this._writableState.ended || i.nextTick(d, this);
}
function d(t) {
t.end();
}
Object.defineProperty(u.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
},
}),
Object.defineProperty(u.prototype, "writableBuffer", {
enumerable: !1,
get: function() {
return this._writableState && this._writableState.getBuffer();
},
}),
Object.defineProperty(u.prototype, "writableLength", {
enumerable: !1,
get: function() {
return this._writableState.length;
},
}),
Object.defineProperty(u.prototype, "destroyed", {
enumerable: !1,
get: function() {
return (
void 0 !== this._readableState &&
void 0 !== this._writableState &&
this._readableState.destroyed &&
this._writableState.destroyed
);
},
set: function(t) {
void 0 !== this._readableState &&
void 0 !== this._writableState &&
((this._readableState.destroyed = t),
(this._writableState.destroyed = t));
},
});
},
8994: (t, e, r) => {
"use strict";
t.exports = n;
var i = r(421);
function n(t) {
if (!(this instanceof n)) return new n(t);
i.call(this, t);
}
r(5717)(n, i),
(n.prototype._transform = function(t, e, r) {
r(null, t);
});
},
5789: (t, e, r) => {
"use strict";
var i,
n = r(4155);
(t.exports = O), (O.ReadableState = I), r(7187).EventEmitter;
var s,
o = function(t, e) {
return t.listeners(e).length;
},
a = r(677),
h = r(8764).Buffer,
f = r.g.Uint8Array || function() {},
u = r(1616);
s = u && u.debuglog ? u.debuglog("stream") : function() {};
var c,
d,
l,
p = r(8354),
b = r(5072),
m = r(1222).getHighWaterMark,
g = r(9786).q,
y = g.ERR_INVALID_ARG_TYPE,
w = g.ERR_STREAM_PUSH_AFTER_EOF,
v = g.ERR_METHOD_NOT_IMPLEMENTED,
_ = g.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
r(5717)(O, a);
var S = b.errorOrDestroy,
E = ["error", "close", "destroy", "pause", "resume"];
function I(t, e, n) {
(i = i || r(2910)),
(t = t || {}),
"boolean" != typeof n && (n = e instanceof i),
(this.objectMode = !!t.objectMode),
n &&
(this.objectMode = this.objectMode || !!t.readableObjectMode),
(this.highWaterMark = m(this, t, "readableHighWaterMark", n)),
(this.buffer = new p()),
(this.length = 0),
(this.pipes = null),
(this.pipesCount = 0),
(this.flowing = null),
(this.ended = !1),
(this.endEmitted = !1),
(this.reading = !1),
(this.sync = !0),
(this.needReadable = !1),
(this.emittedReadable = !1),
(this.readableListening = !1),
(this.resumeScheduled = !1),
(this.paused = !0),
(this.emitClose = !1 !== t.emitClose),
(this.autoDestroy = !!t.autoDestroy),
(this.destroyed = !1),
(this.defaultEncoding = t.defaultEncoding || "utf8"),
(this.awaitDrain = 0),
(this.readingMore = !1),
(this.decoder = null),
(this.encoding = null),
t.encoding &&
(c || (c = r(3893).s),
(this.decoder = new c(t.encoding)),
(this.encoding = t.encoding));
}
function O(t) {
if (((i = i || r(2910)), !(this instanceof O))) return new O(t);
var e = this instanceof i;
(this._readableState = new I(t, this, e)),
(this.readable = !0),
t &&
("function" == typeof t.read && (this._read = t.read),
"function" == typeof t.destroy && (this._destroy = t.destroy)),
a.call(this);
}
function B(t, e, r, i, n) {
s("readableAddChunk", e);
var o,
a = t._readableState;
if (null === e)
(a.reading = !1),
(function(t, e) {
if ((s("onEofChunk"), !e.ended)) {
if (e.decoder) {
var r = e.decoder.end();
r &&
r.length &&
(e.buffer.push(r),
(e.length += e.objectMode ? 1 : r.length));
}
(e.ended = !0),
e.sync
? A(t)
: ((e.needReadable = !1),
e.emittedReadable ||
((e.emittedReadable = !0), N(t)));
}
})(t, a);
else if (
(n ||
(o = (function(t, e) {
var r, i;
return (
(i = e),
h.isBuffer(i) ||
i instanceof f ||
"string" == typeof e ||
void 0 === e ||
t.objectMode ||
(r = new y(
"chunk",
["string", "Buffer", "Uint8Array"],
e
)),
r
);
})(a, e)),
o)
)
S(t, o);
else if (a.objectMode || (e && e.length > 0))
if (
("string" == typeof e ||
a.objectMode ||
Object.getPrototypeOf(e) === h.prototype ||
(e = (function(t) {
return h.from(t);
})(e)),
i)
)
a.endEmitted ? S(t, new _()) : k(t, a, e, !0);
else if (a.ended) S(t, new w());
else {
if (a.destroyed) return !1;
(a.reading = !1),
a.decoder && !r
? ((e = a.decoder.write(e)),
a.objectMode || 0 !== e.length ? k(t, a, e, !1) : x(t, a))
: k(t, a, e, !1);
}
else i || ((a.reading = !1), x(t, a));
return !a.ended && (a.length < a.highWaterMark || 0 === a.length);
}
function k(t, e, r, i) {
e.flowing && 0 === e.length && !e.sync
? ((e.awaitDrain = 0), t.emit("data", r))
: ((e.length += e.objectMode ? 1 : r.length),
i ? e.buffer.unshift(r) : e.buffer.push(r),
e.needReadable && A(t)),
x(t, e);
}
Object.defineProperty(O.prototype, "destroyed", {
enumerable: !1,
get: function() {
return (
void 0 !== this._readableState && this._readableState.destroyed
);
},
set: function(t) {
this._readableState && (this._readableState.destroyed = t);
},
}),
(O.prototype.destroy = b.destroy),
(O.prototype._undestroy = b.undestroy),
(O.prototype._destroy = function(t, e) {
e(t);
}),
(O.prototype.push = function(t, e) {
var r,
i = this._readableState;
return (
i.objectMode
? (r = !0)
: "string" == typeof t &&
((e = e || i.defaultEncoding) !== i.encoding &&
((t = h.from(t, e)), (e = "")),
(r = !0)),
B(this, t, e, !1, r)
);
}),
(O.prototype.unshift = function(t) {
return B(this, t, null, !0, !1);
}),
(O.prototype.isPaused = function() {
return !1 === this._readableState.flowing;
}),
(O.prototype.setEncoding = function(t) {
c || (c = r(3893).s);
var e = new c(t);
(this._readableState.decoder = e),
(this._readableState.encoding = this._readableState.decoder.encoding);
for (
var i = this._readableState.buffer.head, n = "";
null !== i;

)
(n += e.write(i.data)), (i = i.next);
return (
this._readableState.buffer.clear(),
"" !== n && this._readableState.buffer.push(n),
(this._readableState.length = n.length),
this
);
});
var P = 1073741824;
function R(t, e) {
return t <= 0 || (0 === e.length && e.ended)
? 0
: e.objectMode
? 1
: t != t
? e.flowing && e.length
? e.buffer.head.data.length
: e.length
: (t > e.highWaterMark &&
(e.highWaterMark = (function(t) {
return (
t >= P
? (t = P)
: (t--,
(t |= t >>> 1),
(t |= t >>> 2),
(t |= t >>> 4),
(t |= t >>> 8),
(t |= t >>> 16),
t++),
t
);
})(t)),
t <= e.length
? t
: e.ended
? e.length
: ((e.needReadable = !0), 0));
}
function A(t) {
var e = t._readableState;
s("emitReadable", e.needReadable, e.emittedReadable),
(e.needReadable = !1),
e.emittedReadable ||
(s("emitReadable", e.flowing),
(e.emittedReadable = !0),
n.nextTick(N, t));
}
function N(t) {
var e = t._readableState;
s("emitReadable_", e.destroyed, e.length, e.ended),
e.destroyed ||
(!e.length && !e.ended) ||
(t.emit("readable"), (e.emittedReadable = !1)),
(e.needReadable =
!e.flowing && !e.ended && e.length <= e.highWaterMark),
H(t);
}
function x(t, e) {
e.readingMore || ((e.readingMore = !0), n.nextTick(M, t, e));
}
function M(t, e) {
for (
;
!e.reading &&
!e.ended &&
(e.length < e.highWaterMark || (e.flowing && 0 === e.length));

) {
var r = e.length;
if ((s("maybeReadMore read 0"), t.read(0), r === e.length)) break;
}
e.readingMore = !1;
}
function T(t) {
var e = t._readableState;
(e.readableListening = t.listenerCount("readable") > 0),
e.resumeScheduled && !e.paused
? (e.flowing = !0)
: t.listenerCount("data") > 0 && t.resume();
}
function C(t) {
s("readable nexttick read 0"), t.read(0);
}
function L(t, e) {
s("resume", e.reading),
e.reading || t.read(0),
(e.resumeScheduled = !1),
t.emit("resume"),
H(t),
e.flowing && !e.reading && t.read(0);
}
function H(t) {
var e = t._readableState;
for (s("flow", e.flowing); e.flowing && null !== t.read(); );
}
function U(t, e) {
return 0 === e.length
? null
: (e.objectMode
? (r = e.buffer.shift())
: !t || t >= e.length
? ((r = e.decoder
? e.buffer.join("")
: 1 === e.buffer.length
? e.buffer.first()
: e.buffer.concat(e.length)),
e.buffer.clear())
: (r = e.buffer.consume(t, e.decoder)),
r);
var r;
}
function F(t) {
var e = t._readableState;
s("endReadable", e.endEmitted),
e.endEmitted || ((e.ended = !0), n.nextTick(K, e, t));
}
function K(t, e) {
if (
(s("endReadableNT", t.endEmitted, t.length),
!t.endEmitted &&
0 === t.length &&
((t.endEmitted = !0),
(e.readable = !1),
e.emit("end"),
t.autoDestroy))
) {
var r = e._writableState;
(!r || (r.autoDestroy && r.finished)) && e.destroy();
}
}
function D(t, e) {
for (var r = 0, i = t.length; r < i; r++) if (t[r] === e) return r;
return -1;
}
(O.prototype.read = function(t) {
s("read", t), (t = parseInt(t, 10));
var e = this._readableState,
r = t;
if (
(0 !== t && (e.emittedReadable = !1),
0 === t &&
e.needReadable &&
((0 !== e.highWaterMark
? e.length >= e.highWaterMark
: e.length > 0) ||
e.ended))
)
return (
s("read: emitReadable", e.length, e.ended),
0 === e.length && e.ended ? F(this) : A(this),
null
);
if (0 === (t = R(t, e)) && e.ended)
return 0 === e.length && F(this), null;
var i,
n = e.needReadable;
return (
s("need readable", n),
(0 === e.length || e.length - t < e.highWaterMark) &&
s("length less than watermark", (n = !0)),
e.ended || e.reading
? s("reading or ended", (n = !1))
: n &&
(s("do read"),
(e.reading = !0),
(e.sync = !0),
0 === e.length && (e.needReadable = !0),
this._read(e.highWaterMark),
(e.sync = !1),
e.reading || (t = R(r, e))),
null === (i = t > 0 ? U(t, e) : null)
? ((e.needReadable = e.length <= e.highWaterMark), (t = 0))
: ((e.length -= t), (e.awaitDrain = 0)),
0 === e.length &&
(e.ended || (e.needReadable = !0),
r !== t && e.ended && F(this)),
null !== i && this.emit("data", i),
i
);
}),
(O.prototype._read = function(t) {
S(this, new v("_read()"));
}),
(O.prototype.pipe = function(t, e) {
var r = this,
i = this._readableState;
switch (i.pipesCount) {
case 0:
i.pipes = t;
break;
case 1:
i.pipes = [i.pipes, t];
break;
default:
i.pipes.push(t);
}
(i.pipesCount += 1), s("pipe count=%d opts=%j", i.pipesCount, e);
var a =
(e && !1 === e.end) || t === n.stdout || t === n.stderr ? b : h;
function h() {
s("onend"), t.end();
}
i.endEmitted ? n.nextTick(a) : r.once("end", a),
t.on("unpipe", function e(n, o) {
s("onunpipe"),
n === r &&
o &&
!1 === o.hasUnpiped &&
((o.hasUnpiped = !0),
s("cleanup"),
t.removeListener("close", l),
t.removeListener("finish", p),
t.removeListener("drain", f),
t.removeListener("error", d),
t.removeListener("unpipe", e),
r.removeListener("end", h),
r.removeListener("end", b),
r.removeListener("data", c),
(u = !0),
!i.awaitDrain ||
(t._writableState && !t._writableState.needDrain) ||
f());
});
var f = (function(t) {
return function() {
var e = t._readableState;
s("pipeOnDrain", e.awaitDrain),
e.awaitDrain && e.awaitDrain--,
0 === e.awaitDrain &&
o(t, "data") &&
((e.flowing = !0), H(t));
};
})(r);
t.on("drain", f);
var u = !1;
function c(e) {
s("ondata");
var n = t.write(e);
s("dest.write", n),
!1 === n &&
(((1 === i.pipesCount && i.pipes === t) ||
(i.pipesCount > 1 && -1 !== D(i.pipes, t))) &&
!u &&
(s("false write response, pause", i.awaitDrain),
i.awaitDrain++),
r.pause());
}
function d(e) {
s("onerror", e),
b(),
t.removeListener("error", d),
0 === o(t, "error") && S(t, e);
}
function l() {
t.removeListener("finish", p), b();
}
function p() {
s("onfinish"), t.removeListener("close", l), b();
}
function b() {
s("unpipe"), r.unpipe(t);
}
return (
r.on("data", c),
(function(t, e, r) {
if ("function" == typeof t.prependListener)
return t.prependListener(e, r);
t._events && t._events.error
? Array.isArray(t._events.error)
? t._events.error.unshift(r)
: (t._events.error = [r, t._events.error])
: t.on(e, r);
})(t, "error", d),
t.once("close", l),
t.once("finish", p),
t.emit("pipe", r),
i.flowing || (s("pipe resume"), r.resume()),
t
);
}),
(O.prototype.unpipe = function(t) {
var e = this._readableState,
r = { hasUnpiped: !1 };
if (0 === e.pipesCount) return this;
if (1 === e.pipesCount)
return (
(t && t !== e.pipes) ||
(t || (t = e.pipes),
(e.pipes = null),
(e.pipesCount = 0),
(e.flowing = !1),
t && t.emit("unpipe", this, r)),
this
);
if (!t) {
var i = e.pipes,
n = e.pipesCount;
(e.pipes = null), (e.pipesCount = 0), (e.flowing = !1);
for (var s = 0; s < n; s++)
i[s].emit("unpipe", this, { hasUnpiped: !1 });
return this;
}
var o = D(e.pipes, t);
return (
-1 === o ||
(e.pipes.splice(o, 1),
(e.pipesCount -= 1),
1 === e.pipesCount && (e.pipes = e.pipes[0]),
t.emit("unpipe", this, r)),
this
);
}),
(O.prototype.on = function(t, e) {
var r = a.prototype.on.call(this, t, e),
i = this._readableState;
return (
"data" === t
? ((i.readableListening = this.listenerCount("readable") > 0),
!1 !== i.flowing && this.resume())
: "readable" === t &&
(i.endEmitted ||
i.readableListening ||
((i.readableListening = i.needReadable = !0),
(i.flowing = !1),
(i.emittedReadable = !1),
s("on readable", i.length, i.reading),
i.length ? A(this) : i.reading || n.nextTick(C, this))),
r
);
}),
(O.prototype.addListener = O.prototype.on),
(O.prototype.removeListener = function(t, e) {
var r = a.prototype.removeListener.call(this, t, e);
return "readable" === t && n.nextTick(T, this), r;
}),
(O.prototype.removeAllListeners = function(t) {
var e = a.prototype.removeAllListeners.apply(this, arguments);
return (
("readable" !== t && void 0 !== t) || n.nextTick(T, this), e
);
}),
(O.prototype.resume = function() {
var t = this._readableState;
return (
t.flowing ||
(s("resume"),
(t.flowing = !t.readableListening),
(function(t, e) {
e.resumeScheduled ||
((e.resumeScheduled = !0), n.nextTick(L, t, e));
})(this, t)),
(t.paused = !1),
this
);
}),
(O.prototype.pause = function() {
return (
s("call pause flowing=%j", this._readableState.flowing),
!1 !== this._readableState.flowing &&
(s("pause"),
(this._readableState.flowing = !1),
this.emit("pause")),
(this._readableState.paused = !0),
this
);
}),
(O.prototype.wrap = function(t) {
var e = this,
r = this._readableState,
i = !1;
for (var n in (t.on("end", function() {
if ((s("wrapped end"), r.decoder && !r.ended)) {
var t = r.decoder.end();
t && t.length && e.push(t);
}
e.push(null);
}),
t.on("data", function(n) {
s("wrapped data"),
r.decoder && (n = r.decoder.write(n)),
(r.objectMode && null == n) ||
((r.objectMode || (n && n.length)) &&
(e.push(n) || ((i = !0), t.pause())));
}),
t))
void 0 === this[n] &&
"function" == typeof t[n] &&
(this[n] = (function(e) {
return function() {
return t[e].apply(t, arguments);
};
})(n));
for (var o = 0; o < E.length; o++)
t.on(E[o], this.emit.bind(this, E[o]));
return (
(this._read = function(e) {
s("wrapped _read", e), i && ((i = !1), t.resume());
}),
this
);
}),
"function" == typeof Symbol &&
(O.prototype[Symbol.asyncIterator] = function() {
return void 0 === d && (d = r(527)), d(this);
}),
Object.defineProperty(O.prototype, "readableHighWaterMark", {
enumerable: !1,
get: function() {
return this._readableState.highWaterMark;
},
}),
Object.defineProperty(O.prototype, "readableBuffer", {
enumerable: !1,
get: function() {
return this._readableState && this._readableState.buffer;
},
}),
Object.defineProperty(O.prototype, "readableFlowing", {
enumerable: !1,
get: function() {
return this._readableState.flowing;
},
set: function(t) {
this._readableState && (this._readableState.flowing = t);
},
}),
(O._fromList = U),
Object.defineProperty(O.prototype, "readableLength", {
enumerable: !1,
get: function() {
return this._readableState.length;
},
}),
"function" == typeof Symbol &&
(O.from = function(t, e) {
return void 0 === l && (l = r(5327)), l(O, t, e);
});
},
421: (t, e, r) => {
"use strict";
t.exports = u;
var i = r(9786).q,
n = i.ERR_METHOD_NOT_IMPLEMENTED,
s = i.ERR_MULTIPLE_CALLBACK,
o = i.ERR_TRANSFORM_ALREADY_TRANSFORMING,
a = i.ERR_TRANSFORM_WITH_LENGTH_0,
h = r(2910);
function f(t, e) {
var r = this._transformState;
r.transforming = !1;
var i = r.writecb;
if (null === i) return this.emit("error", new s());
(r.writechunk = null),
(r.writecb = null),
null != e && this.push(e),
i(t);
var n = this._readableState;
(n.reading = !1),
(n.needReadable || n.length < n.highWaterMark) &&
this._read(n.highWaterMark);
}
function u(t) {
if (!(this instanceof u)) return new u(t);
h.call(this, t),
(this._transformState = {
afterTransform: f.bind(this),
needTransform: !1,
transforming: !1,
writecb: null,
writechunk: null,
writeencoding: null,
}),
(this._readableState.needReadable = !0),
(this._readableState.sync = !1),
t &&
("function" == typeof t.transform &&
(this._transform = t.transform),
"function" == typeof t.flush && (this._flush = t.flush)),
this.on("prefinish", c);
}
function c() {
var t = this;
"function" != typeof this._flush || this._readableState.destroyed
? d(this, null, null)
: this._flush(function(e, r) {
d(t, e, r);
});
}
function d(t, e, r) {
if (e) return t.emit("error", e);
if ((null != r && t.push(r), t._writableState.length))
throw new a();
if (t._transformState.transforming) throw new o();
return t.push(null);
}
r(5717)(u, h),
(u.prototype.push = function(t, e) {
return (
(this._transformState.needTransform = !1),
h.prototype.push.call(this, t, e)
);
}),
(u.prototype._transform = function(t, e, r) {
r(new n("_transform()"));
}),
(u.prototype._write = function(t, e, r) {
var i = this._transformState;
if (
((i.writecb = r),
(i.writechunk = t),
(i.writeencoding = e),
!i.transforming)
) {
var n = this._readableState;
(i.needTransform ||
n.needReadable ||
n.length < n.highWaterMark) &&
this._read(n.highWaterMark);
}
}),
(u.prototype._read = function(t) {
var e = this._transformState;
null === e.writechunk || e.transforming
? (e.needTransform = !0)
: ((e.transforming = !0),
this._transform(
e.writechunk,
e.writeencoding,
e.afterTransform
));
}),
(u.prototype._destroy = function(t, e) {
h.prototype._destroy.call(this, t, function(t) {
e(t);
});
});
},
469: (t, e, r) => {
"use strict";
var i,
n = r(4155);
function s(t) {
var e = this;
(this.next = null),
(this.entry = null),
(this.finish = function() {
!(function(t, e, r) {
var i = t.entry;
for (t.entry = null; i; ) {
var n = i.callback;
e.pendingcb--, n(undefined), (i = i.next);
}
e.corkedRequestsFree.next = t;
})(e, t);
});
}
(t.exports = O), (O.WritableState = I);
var o,
a = { deprecate: r(4927) },
h = r(677),
f = r(8764).Buffer,
u = r.g.Uint8Array || function() {},
c = r(5072),
d = r(1222).getHighWaterMark,
l = r(9786).q,
p = l.ERR_INVALID_ARG_TYPE,
b = l.ERR_METHOD_NOT_IMPLEMENTED,
m = l.ERR_MULTIPLE_CALLBACK,
g = l.ERR_STREAM_CANNOT_PIPE,
y = l.ERR_STREAM_DESTROYED,
w = l.ERR_STREAM_NULL_VALUES,
v = l.ERR_STREAM_WRITE_AFTER_END,
_ = l.ERR_UNKNOWN_ENCODING,
S = c.errorOrDestroy;
function E() {}
function I(t, e, o) {
(i = i || r(2910)),
(t = t || {}),
"boolean" != typeof o && (o = e instanceof i),
(this.objectMode = !!t.objectMode),
o &&
(this.objectMode = this.objectMode || !!t.writableObjectMode),
(this.highWaterMark = d(this, t, "writableHighWaterMark", o)),
(this.finalCalled = !1),
(this.needDrain = !1),
(this.ending = !1),
(this.ended = !1),
(this.finished = !1),
(this.destroyed = !1);
var a = !1 === t.decodeStrings;
(this.decodeStrings = !a),
(this.defaultEncoding = t.defaultEncoding || "utf8"),
(this.length = 0),
(this.writing = !1),
(this.corked = 0),
(this.sync = !0),
(this.bufferProcessing = !1),
(this.onwrite = function(t) {
!(function(t, e) {
var r = t._writableState,
i = r.sync,
s = r.writecb;
if ("function" != typeof s) throw new m();
if (
((function(t) {
(t.writing = !1),
(t.writecb = null),
(t.length -= t.writelen),
(t.writelen = 0);
})(r),
e)
)
!(function(t, e, r, i, s) {
--e.pendingcb,
r
? (n.nextTick(s, i),
n.nextTick(N, t, e),
(t._writableState.errorEmitted = !0),
S(t, i))
: (s(i),
(t._writableState.errorEmitted = !0),
S(t, i),
N(t, e));
})(t, r, i, e, s);
else {
var o = R(r) || t.destroyed;
o ||
r.corked ||
r.bufferProcessing ||
!r.bufferedRequest ||
P(t, r),
i ? n.nextTick(k, t, r, o, s) : k(t, r, o, s);
}
})(e, t);
}),
(this.writecb = null),
(this.writelen = 0),
(this.bufferedRequest = null),
(this.lastBufferedRequest = null),
(this.pendingcb = 0),
(this.prefinished = !1),
(this.errorEmitted = !1),
(this.emitClose = !1 !== t.emitClose),
(this.autoDestroy = !!t.autoDestroy),
(this.bufferedRequestCount = 0),
(this.corkedRequestsFree = new s(this));
}
function O(t) {
var e = this instanceof (i = i || r(2910));
if (!e && !o.call(O, this)) return new O(t);
(this._writableState = new I(t, this, e)),
(this.writable = !0),
t &&
("function" == typeof t.write && (this._write = t.write),
"function" == typeof t.writev && (this._writev = t.writev),
"function" == typeof t.destroy && (this._destroy = t.destroy),
"function" == typeof t.final && (this._final = t.final)),
h.call(this);
}
function B(t, e, r, i, n, s, o) {
(e.writelen = i),
(e.writecb = o),
(e.writing = !0),
(e.sync = !0),
e.destroyed
? e.onwrite(new y("write"))
: r
? t._writev(n, e.onwrite)
: t._write(n, s, e.onwrite),
(e.sync = !1);
}
function k(t, e, r, i) {
r ||
(function(t, e) {
0 === e.length &&
e.needDrain &&
((e.needDrain = !1), t.emit("drain"));
})(t, e),
e.pendingcb--,
i(),
N(t, e);
}
function P(t, e) {
e.bufferProcessing = !0;
var r = e.bufferedRequest;
if (t._writev && r && r.next) {
var i = e.bufferedRequestCount,
n = new Array(i),
o = e.corkedRequestsFree;
o.entry = r;
for (var a = 0, h = !0; r; )
(n[a] = r), r.isBuf || (h = !1), (r = r.next), (a += 1);
(n.allBuffers = h),
B(t, e, !0, e.length, n, "", o.finish),
e.pendingcb++,
(e.lastBufferedRequest = null),
o.next
? ((e.corkedRequestsFree = o.next), (o.next = null))
: (e.corkedRequestsFree = new s(e)),
(e.bufferedRequestCount = 0);
} else {
for (; r; ) {
var f = r.chunk,
u = r.encoding,
c = r.callback;
if (
(B(t, e, !1, e.objectMode ? 1 : f.length, f, u, c),
(r = r.next),
e.bufferedRequestCount--,
e.writing)
)
break;
}
null === r && (e.lastBufferedRequest = null);
}
(e.bufferedRequest = r), (e.bufferProcessing = !1);
}
function R(t) {
return (
t.ending &&
0 === t.length &&
null === t.bufferedRequest &&
!t.finished &&
!t.writing
);
}
function A(t, e) {
t._final(function(r) {
e.pendingcb--,
r && S(t, r),
(e.prefinished = !0),
t.emit("prefinish"),
N(t, e);
});
}
function N(t, e) {
var r = R(e);
if (
r &&
((function(t, e) {
e.prefinished ||
e.finalCalled ||
("function" != typeof t._final || e.destroyed
? ((e.prefinished = !0), t.emit("prefinish"))
: (e.pendingcb++,
(e.finalCalled = !0),
n.nextTick(A, t, e)));
})(t, e),
0 === e.pendingcb &&
((e.finished = !0), t.emit("finish"), e.autoDestroy))
) {
var i = t._readableState;
(!i || (i.autoDestroy && i.endEmitted)) && t.destroy();
}
return r;
}
r(5717)(O, h),
(I.prototype.getBuffer = function() {
for (var t = this.bufferedRequest, e = []; t; )
e.push(t), (t = t.next);
return e;
}),
(function() {
try {
Object.defineProperty(I.prototype, "buffer", {
get: a.deprecate(
function() {
return this.getBuffer();
},
"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
"DEP0003"
),
});
} catch (t) {}
})(),
"function" == typeof Symbol &&
Symbol.hasInstance &&
"function" == typeof Function.prototype[Symbol.hasInstance]
? ((o = Function.prototype[Symbol.hasInstance]),
Object.defineProperty(O, Symbol.hasInstance, {
value: function(t) {
return (
!!o.call(this, t) ||
(this === O && t && t._writableState instanceof I)
);
},
}))
: (o = function(t) {
return t instanceof this;
}),
(O.prototype.pipe = function() {
S(this, new g());
}),
(O.prototype.write = function(t, e, r) {
var i,
s = this._writableState,
o = !1,
a = !s.objectMode && ((i = t), f.isBuffer(i) || i instanceof u);
return (
a &&
!f.isBuffer(t) &&
(t = (function(t) {
return f.from(t);
})(t)),
"function" == typeof e && ((r = e), (e = null)),
a ? (e = "buffer") : e || (e = s.defaultEncoding),
"function" != typeof r && (r = E),
s.ending
? (function(t, e) {
var r = new v();
S(t, r), n.nextTick(e, r);
})(this, r)
: (a ||
(function(t, e, r, i) {
var s;
return (
null === r
? (s = new w())
: "string" == typeof r ||
e.objectMode ||
(s = new p("chunk", ["string", "Buffer"], r)),
!s || (S(t, s), n.nextTick(i, s), !1)
);
})(this, s, t, r)) &&
(s.pendingcb++,
(o = (function(t, e, r, i, n, s) {
if (!r) {
var o = (function(t, e, r) {
return (
t.objectMode ||
!1 === t.decodeStrings ||
"string" != typeof e ||
(e = f.from(e, r)),
e
);
})(e, i, n);
i !== o && ((r = !0), (n = "buffer"), (i = o));
}
var a = e.objectMode ? 1 : i.length;
e.length += a;
var h = e.length < e.highWaterMark;
if ((h || (e.needDrain = !0), e.writing || e.corked)) {
var u = e.lastBufferedRequest;
(e.lastBufferedRequest = {
chunk: i,
encoding: n,
isBuf: r,
callback: s,
next: null,
}),
u
? (u.next = e.lastBufferedRequest)
: (e.bufferedRequest = e.lastBufferedRequest),
(e.bufferedRequestCount += 1);
} else B(t, e, !1, a, i, n, s);
return h;
})(this, s, a, t, e, r))),
o
);
}),
(O.prototype.cork = function() {
this._writableState.corked++;
}),
(O.prototype.uncork = function() {
var t = this._writableState;
t.corked &&
(t.corked--,
t.writing ||
t.corked ||
t.bufferProcessing ||
!t.bufferedRequest ||
P(this, t));
}),
(O.prototype.setDefaultEncoding = function(t) {
if (
("string" == typeof t && (t = t.toLowerCase()),
!(
[
"hex",
"utf8",
"utf-8",
"ascii",
"binary",
"base64",
"ucs2",
"ucs-2",
"utf16le",
"utf-16le",
"raw",
].indexOf((t + "").toLowerCase()) > -1
))
)
throw new _(t);
return (this._writableState.defaultEncoding = t), this;
}),
Object.defineProperty(O.prototype, "writableBuffer", {
enumerable: !1,
get: function() {
return this._writableState && this._writableState.getBuffer();
},
}),
Object.defineProperty(O.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
},
}),
(O.prototype._write = function(t, e, r) {
r(new b("_write()"));
}),
(O.prototype._writev = null),
(O.prototype.end = function(t, e, r) {
var i = this._writableState;
return (
"function" == typeof t
? ((r = t), (t = null), (e = null))
: "function" == typeof e && ((r = e), (e = null)),
null != t && this.write(t, e),
i.corked && ((i.corked = 1), this.uncork()),
i.ending ||
(function(t, e, r) {
(e.ending = !0),
N(t, e),
r && (e.finished ? n.nextTick(r) : t.once("finish", r)),
(e.ended = !0),
(t.writable = !1);
})(this, i, r),
this
);
}),
Object.defineProperty(O.prototype, "writableLength", {
enumerable: !1,
get: function() {
return this._writableState.length;
},
}),
Object.defineProperty(O.prototype, "destroyed", {
enumerable: !1,
get: function() {
return (
void 0 !== this._writableState &&
this._writableState.destroyed
);
},
set: function(t) {
this._writableState && (this._writableState.destroyed = t);
},
}),
(O.prototype.destroy = c.destroy),
(O.prototype._undestroy = c.undestroy),
(O.prototype._destroy = function(t, e) {
e(t);
});
},
527: (t, e, r) => {
"use strict";
var i,
n = r(4155);
function s(t, e, r) {
return (
e in t
? Object.defineProperty(t, e, {
value: r,
enumerable: !0,
configurable: !0,
writable: !0,
})
: (t[e] = r),
t
);
}
var o = r(8640),
a = Symbol("lastResolve"),
h = Symbol("lastReject"),
f = Symbol("error"),
u = Symbol("ended"),
c = Symbol("lastPromise"),
d = Symbol("handlePromise"),
l = Symbol("stream");
function p(t, e) {
return { value: t, done: e };
}
function b(t) {
var e = t[a];
if (null !== e) {
var r = t[l].read();
null !== r &&
((t[c] = null), (t[a] = null), (t[h] = null), e(p(r, !1)));
}
}
function m(t) {
n.nextTick(b, t);
}
var g = Object.getPrototypeOf(function() {}),
y = Object.setPrototypeOf(
(s(
(i = {
get stream() {
return this[l];
},
next: function() {
var t = this,
e = this[f];
if (null !== e) return Promise.reject(e);
if (this[u]) return Promise.resolve(p(void 0, !0));
if (this[l].destroyed)
return new Promise(function(e, r) {
n.nextTick(function() {
t[f] ? r(t[f]) : e(p(void 0, !0));
});
});
var r,
i = this[c];
if (i)
r = new Promise(
(function(t, e) {
return function(r, i) {
t.then(function() {
e[u] ? r(p(void 0, !0)) : e[d](r, i);
}, i);
};
})(i, this)
);
else {
var s = this[l].read();
if (null !== s) return Promise.resolve(p(s, !1));
r = new Promise(this[d]);
}
return (this[c] = r), r;
},
}),
Symbol.asyncIterator,
function() {
return this;
}
),
s(i, "return", function() {
var t = this;
return new Promise(function(e, r) {
t[l].destroy(null, function(t) {
t ? r(t) : e(p(void 0, !0));
});
});
}),
i),
g
);
t.exports = function(t) {
var e,
r = Object.create(
y,
(s((e = {}), l, { value: t, writable: !0 }),
s(e, a, { value: null, writable: !0 }),
s(e, h, { value: null, writable: !0 }),
s(e, f, { value: null, writable: !0 }),
s(e, u, { value: t._readableState.endEmitted, writable: !0 }),
s(e, d, {
value: function(t, e) {
var i = r[l].read();
i
? ((r[c] = null),
(r[a] = null),
(r[h] = null),
t(p(i, !1)))
: ((r[a] = t), (r[h] = e));
},
writable: !0,
}),
e)
);
return (
(r[c] = null),
o(t, function(t) {
if (t && "ERR_STREAM_PREMATURE_CLOSE" !== t.code) {
var e = r[h];
return (
null !== e &&
((r[c] = null), (r[a] = null), (r[h] = null), e(t)),
void (r[f] = t)
);
}
var i = r[a];
null !== i &&
((r[c] = null),
(r[a] = null),
(r[h] = null),
i(p(void 0, !0))),
(r[u] = !0);
}),
t.on("readable", m.bind(null, r)),
r
);
};
},
8354: (t, e, r) => {
"use strict";
function i(t, e) {
var r = Object.keys(t);
if (Object.getOwnPropertySymbols) {
var i = Object.getOwnPropertySymbols(t);
e &&
(i = i.filter(function(e) {
return Object.getOwnPropertyDescriptor(t, e).enumerable;
})),
r.push.apply(r, i);
}
return r;
}
function n(t, e, r) {
return (
e in t
? Object.defineProperty(t, e, {
value: r,
enumerable: !0,
configurable: !0,
writable: !0,
})
: (t[e] = r),
t
);
}
function s(t, e) {
for (var r = 0; r < e.length; r++) {
var i = e[r];
(i.enumerable = i.enumerable || !1),
(i.configurable = !0),
"value" in i && (i.writable = !0),
Object.defineProperty(t, i.key, i);
}
}
var o = r(8764).Buffer,
a = r(9386).inspect,
h = (a && a.custom) || "inspect";
t.exports = (function() {
function t() {
!(function(t, e) {
if (!(t instanceof e))
throw new TypeError("Cannot call a class as a function");
})(this, t),
(this.head = null),
(this.tail = null),
(this.length = 0);
}
var e, r;
return (
(e = t),
(r = [
{
key: "push",
value: function(t) {
var e = { data: t, next: null };
this.length > 0 ? (this.tail.next = e) : (this.head = e),
(this.tail = e),
++this.length;
},
},
{
key: "unshift",
value: function(t) {
var e = { data: t, next: this.head };
0 === this.length && (this.tail = e),
(this.head = e),
++this.length;
},
},
{
key: "shift",
value: function() {
if (0 !== this.length) {
var t = this.head.data;
return (
1 === this.length
? (this.head = this.tail = null)
: (this.head = this.head.next),
--this.length,
t
);
}
},
},
{
key: "clear",
value: function() {
(this.head = this.tail = null), (this.length = 0);
},
},
{
key: "join",
value: function(t) {
if (0 === this.length) return "";
for (var e = this.head, r = "" + e.data; (e = e.next); )
r += t + e.data;
return r;
},
},
{
key: "concat",
value: function(t) {
if (0 === this.length) return o.alloc(0);
for (
var e,
r,
i,
n = o.allocUnsafe(t >>> 0),
s = this.head,
a = 0;
s;

)
(e = s.data),
(r = n),
(i = a),
o.prototype.copy.call(e, r, i),
(a += s.data.length),
(s = s.next);
return n;
},
},
{
key: "consume",
value: function(t, e) {
var r;
return (
t < this.head.data.length
? ((r = this.head.data.slice(0, t)),
(this.head.data = this.head.data.slice(t)))
: (r =
t === this.head.data.length
? this.shift()
: e
? this._getString(t)
: this._getBuffer(t)),
r
);
},
},
{
key: "first",
value: function() {
return this.head.data;
},
},
{
key: "_getString",
value: function(t) {
var e = this.head,
r = 1,
i = e.data;
for (t -= i.length; (e = e.next); ) {
var n = e.data,
s = t > n.length ? n.length : t;
if (
(s === n.length ? (i += n) : (i += n.slice(0, t)),
0 == (t -= s))
) {
s === n.length
? (++r,
e.next
? (this.head = e.next)
: (this.head = this.tail = null))
: ((this.head = e), (e.data = n.slice(s)));
break;
}
++r;
}
return (this.length -= r), i;
},
},
{
key: "_getBuffer",
value: function(t) {
var e = o.allocUnsafe(t),
r = this.head,
i = 1;
for (r.data.copy(e), t -= r.data.length; (r = r.next); ) {
var n = r.data,
s = t > n.length ? n.length : t;
if ((n.copy(e, e.length - t, 0, s), 0 == (t -= s))) {
s === n.length
? (++i,
r.next
? (this.head = r.next)
: (this.head = this.tail = null))
: ((this.head = r), (r.data = n.slice(s)));
break;
}
++i;
}
return (this.length -= i), e;
},
},
{
key: h,
value: function(t, e) {
return a(
this,
(function(t) {
for (var e = 1; e < arguments.length; e++) {
var r = null != arguments[e] ? arguments[e] : {};
e % 2
? i(Object(r), !0).forEach(function(e) {
n(t, e, r[e]);
})
: Object.getOwnPropertyDescriptors
? Object.defineProperties(
t,
Object.getOwnPropertyDescriptors(r)
)
: i(Object(r)).forEach(function(e) {
Object.defineProperty(
t,
e,
Object.getOwnPropertyDescriptor(r, e)
);
});
}
return t;
})({}, e, { depth: 0, customInspect: !1 })
);
},
},
]) && s(e.prototype, r),
t
);
})();
},
5072: (t, e, r) => {
"use strict";
var i = r(4155);
function n(t, e) {
o(t, e), s(t);
}
function s(t) {
(t._writableState && !t._writableState.emitClose) ||
(t._readableState && !t._readableState.emitClose) ||
t.emit("close");
}
function o(t, e) {
t.emit("error", e);
}
t.exports = {
destroy: function(t, e) {
var r = this,
a = this._readableState && this._readableState.destroyed,
h = this._writableState && this._writableState.destroyed;
return a || h
? (e
? e(t)
: t &&
(this._writableState
? this._writableState.errorEmitted ||
((this._writableState.errorEmitted = !0),
i.nextTick(o, this, t))
: i.nextTick(o, this, t)),
this)
: (this._readableState && (this._readableState.destroyed = !0),
this._writableState && (this._writableState.destroyed = !0),
this._destroy(t || null, function(t) {
!e && t
? r._writableState
? r._writableState.errorEmitted
? i.nextTick(s, r)
: ((r._writableState.errorEmitted = !0),
i.nextTick(n, r, t))
: i.nextTick(n, r, t)
: e
? (i.nextTick(s, r), e(t))
: i.nextTick(s, r);
}),
this);
},
undestroy: function() {
this._readableState &&
((this._readableState.destroyed = !1),
(this._readableState.reading = !1),
(this._readableState.ended = !1),
(this._readableState.endEmitted = !1)),
this._writableState &&
((this._writableState.destroyed = !1),
(this._writableState.ended = !1),
(this._writableState.ending = !1),
(this._writableState.finalCalled = !1),
(this._writableState.prefinished = !1),
(this._writableState.finished = !1),
(this._writableState.errorEmitted = !1));
},
errorOrDestroy: function(t, e) {
var r = t._readableState,
i = t._writableState;
(r && r.autoDestroy) || (i && i.autoDestroy)
? t.destroy(e)
: t.emit("error", e);
},
};
},
8640: (t, e, r) => {
"use strict";
var i = r(9786).q.ERR_STREAM_PREMATURE_CLOSE;
function n() {}
t.exports = function t(e, r, s) {
if ("function" == typeof r) return t(e, null, r);
r || (r = {}),
(s = (function(t) {
var e = !1;
return function() {
if (!e) {
e = !0;
for (
var r = arguments.length, i = new Array(r), n = 0;
n < r;
n++
)
i[n] = arguments[n];
t.apply(this, i);
}
};
})(s || n));
var o = r.readable || (!1 !== r.readable && e.readable),
a = r.writable || (!1 !== r.writable && e.writable),
h = function() {
e.writable || u();
},
f = e._writableState && e._writableState.finished,
u = function() {
(a = !1), (f = !0), o || s.call(e);
},
c = e._readableState && e._readableState.endEmitted,
d = function() {
(o = !1), (c = !0), a || s.call(e);
},
l = function(t) {
s.call(e, t);
},
p = function() {
var t;
return o && !c
? ((e._readableState && e._readableState.ended) ||
(t = new i()),
s.call(e, t))
: a && !f
? ((e._writableState && e._writableState.ended) ||
(t = new i()),
s.call(e, t))
: void 0;
},
b = function() {
e.req.on("finish", u);
};
return (
(function(t) {
return t.setHeader && "function" == typeof t.abort;
})(e)
? (e.on("complete", u),
e.on("abort", p),
e.req ? b() : e.on("request", b))
: a && !e._writableState && (e.on("end", h), e.on("close", h)),
e.on("end", d),
e.on("finish", u),
!1 !== r.error && e.on("error", l),
e.on("close", p),
function() {
e.removeListener("complete", u),
e.removeListener("abort", p),
e.removeListener("request", b),
e.req && e.req.removeListener("finish", u),
e.removeListener("end", h),
e.removeListener("close", h),
e.removeListener("finish", u),
e.removeListener("end", d),
e.removeListener("error", l),
e.removeListener("close", p);
}
);
};
},
5327: (t) => {
t.exports = function() {
throw new Error("Readable.from is not available in the browser");
};
},
4218: (t, e, r) => {
"use strict";
var i,
n = r(9786).q,
s = n.ERR_MISSING_ARGS,
o = n.ERR_STREAM_DESTROYED;
function a(t) {
if (t) throw t;
}
function h(t, e, n, s) {
s = (function(t) {
var e = !1;
return function() {
e || ((e = !0), t.apply(void 0, arguments));
};
})(s);
var a = !1;
t.on("close", function() {
a = !0;
}),
void 0 === i && (i = r(8640)),
i(t, { readable: e, writable: n }, function(t) {
if (t) return s(t);
(a = !0), s();
});
var h = !1;
return function(e) {
if (!a && !h)
return (
(h = !0),
(function(t) {
return t.setHeader && "function" == typeof t.abort;
})(t)
? t.abort()
: "function" == typeof t.destroy
? t.destroy()
: void s(e || new o("pipe"))
);
};
}
function f(t) {
t();
}
function u(t, e) {
return t.pipe(e);
}
function c(t) {
return t.length
? "function" != typeof t[t.length - 1]
? a
: t.pop()
: a;
}
t.exports = function() {
for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
e[r] = arguments[r];
var i,
n = c(e);
if ((Array.isArray(e[0]) && (e = e[0]), e.length < 2))
throw new s("streams");
var o = e.map(function(t, r) {
var s = r < e.length - 1;
return h(t, s, r > 0, function(t) {
i || (i = t), t && o.forEach(f), s || (o.forEach(f), n(i));
});
});
return e.reduce(u);
};
},
1222: (t, e, r) => {
"use strict";
var i = r(9786).q.ERR_INVALID_OPT_VALUE;
t.exports = {
getHighWaterMark: function(t, e, r, n) {
var s = (function(t, e, r) {
return null != t.highWaterMark
? t.highWaterMark
: e
? t[r]
: null;
})(e, n, r);
if (null != s) {
if (!isFinite(s) || Math.floor(s) !== s || s < 0)
throw new i(n ? r : "highWaterMark", s);
return Math.floor(s);
}
return t.objectMode ? 16 : 16384;
},
};
},
677: (t, e, r) => {
t.exports = r(7187).EventEmitter;
},
326: (t, e, r) => {
((e = t.exports = r(5789)).Stream = e),
(e.Readable = e),
(e.Writable = r(469)),
(e.Duplex = r(2910)),
(e.Transform = r(421)),
(e.PassThrough = r(8994)),
(e.finished = r(8640)),
(e.pipeline = r(4218));
},
3893: (t, e, r) => {
"use strict";
var i = r(9509).Buffer,
n =
i.isEncoding ||
function(t) {
switch ((t = "" + t) && t.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;
default:
return !1;
}
};
function s(t) {
var e;
switch (
((this.encoding = (function(t) {
var e = (function(t) {
if (!t) return "utf8";
for (var e; ; )
switch (t) {
case "utf8":
case "utf-8":
return "utf8";
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return "utf16le";
case "latin1":
case "binary":
return "latin1";
case "base64":
case "ascii":
case "hex":
return t;
default:
if (e) return;
(t = ("" + t).toLowerCase()), (e = !0);
}
})(t);
if ("string" != typeof e && (i.isEncoding === n || !n(t)))
throw new Error("Unknown encoding: " + t);
return e || t;
})(t)),
this.encoding)
) {
case "utf16le":
(this.text = h), (this.end = f), (e = 4);
break;
case "utf8":
(this.fillLast = a), (e = 4);
break;
case "base64":
(this.text = u), (this.end = c), (e = 3);
break;
default:
return (this.write = d), void (this.end = l);
}
(this.lastNeed = 0),
(this.lastTotal = 0),
(this.lastChar = i.allocUnsafe(e));
}
function o(t) {
return t <= 127
? 0
: t >> 5 == 6
? 2
: t >> 4 == 14
? 3
: t >> 3 == 30
? 4
: t >> 6 == 2
? -1
: -2;
}
function a(t) {
var e = this.lastTotal - this.lastNeed,
r = (function(t, e, r) {
if (128 != (192 & e[0])) return (t.lastNeed = 0), "�";
if (t.lastNeed > 1 && e.length > 1) {
if (128 != (192 & e[1])) return (t.lastNeed = 1), "�";
if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2]))
return (t.lastNeed = 2), "�";
}
})(this, t);
return void 0 !== r
? r
: this.lastNeed <= t.length
? (t.copy(this.lastChar, e, 0, this.lastNeed),
this.lastChar.toString(this.encoding, 0, this.lastTotal))
: (t.copy(this.lastChar, e, 0, t.length),
void (this.lastNeed -= t.length));
}
function h(t, e) {
if ((t.length - e) % 2 == 0) {
var r = t.toString("utf16le", e);
if (r) {
var i = r.charCodeAt(r.length - 1);
if (i >= 55296 && i <= 56319)
return (
(this.lastNeed = 2),
(this.lastTotal = 4),
(this.lastChar[0] = t[t.length - 2]),
(this.lastChar[1] = t[t.length - 1]),
r.slice(0, -1)
);
}
return r;
}
return (
(this.lastNeed = 1),
(this.lastTotal = 2),
(this.lastChar[0] = t[t.length - 1]),
t.toString("utf16le", e, t.length - 1)
);
}
function f(t) {
var e = t && t.length ? this.write(t) : "";
if (this.lastNeed) {
var r = this.lastTotal - this.lastNeed;
return e + this.lastChar.toString("utf16le", 0, r);
}
return e;
}
function u(t, e) {
var r = (t.length - e) % 3;
return 0 === r
? t.toString("base64", e)
: ((this.lastNeed = 3 - r),
(this.lastTotal = 3),
1 === r
? (this.lastChar[0] = t[t.length - 1])
: ((this.lastChar[0] = t[t.length - 2]),
(this.lastChar[1] = t[t.length - 1])),
t.toString("base64", e, t.length - r));
}
function c(t) {
var e = t && t.length ? this.write(t) : "";
return this.lastNeed
? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed)
: e;
}
function d(t) {
return t.toString(this.encoding);
}
function l(t) {
return t && t.length ? this.write(t) : "";
}
(e.s = s),
(s.prototype.write = function(t) {
if (0 === t.length) return "";
var e, r;
if (this.lastNeed) {
if (void 0 === (e = this.fillLast(t))) return "";
(r = this.lastNeed), (this.lastNeed = 0);
} else r = 0;
return r < t.length
? e
? e + this.text(t, r)
: this.text(t, r)
: e || "";
}),
(s.prototype.end = function(t) {
var e = t && t.length ? this.write(t) : "";
return this.lastNeed ? e + "�" : e;
}),
(s.prototype.text = function(t, e) {
var r = (function(t, e, r) {
var i = e.length - 1;
if (i < r) return 0;
var n = o(e[i]);
return n >= 0
? (n > 0 && (t.lastNeed = n - 1), n)
: --i < r || -2 === n
? 0
: (n = o(e[i])) >= 0
? (n > 0 && (t.lastNeed = n - 2), n)
: --i < r || -2 === n
? 0
: (n = o(e[i])) >= 0
? (n > 0 && (2 === n ? (n = 0) : (t.lastNeed = n - 3)), n)
: 0;
})(this, t, e);
if (!this.lastNeed) return t.toString("utf8", e);
this.lastTotal = r;
var i = t.length - (r - this.lastNeed);
return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
}),
(s.prototype.fillLast = function(t) {
if (this.lastNeed <= t.length)
return (
t.copy(
this.lastChar,
this.lastTotal - this.lastNeed,
0,
this.lastNeed
),
this.lastChar.toString(this.encoding, 0, this.lastTotal)
);
t.copy(
this.lastChar,
this.lastTotal - this.lastNeed,
0,
t.length
),
(this.lastNeed -= t.length);
});
},
3715: (t, e, r) => {
var i = e;
(i.utils = r(6436)),
(i.common = r(5772)),
(i.sha = r(9041)),
(i.ripemd = r(2949)),
(i.hmac = r(2344)),
(i.sha1 = i.sha.sha1),
(i.sha256 = i.sha.sha256),
(i.sha224 = i.sha.sha224),
(i.sha384 = i.sha.sha384),
(i.sha512 = i.sha.sha512),
(i.ripemd160 = i.ripemd.ripemd160);
},
5772: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(9746);
function s() {
(this.pending = null),
(this.pendingTotal = 0),
(this.blockSize = this.constructor.blockSize),
(this.outSize = this.constructor.outSize),
(this.hmacStrength = this.constructor.hmacStrength),
(this.padLength = this.constructor.padLength / 8),
(this.endian = "big"),
(this._delta8 = this.blockSize / 8),
(this._delta32 = this.blockSize / 32);
}
(e.BlockHash = s),
(s.prototype.update = function(t, e) {
if (
((t = i.toArray(t, e)),
this.pending
? (this.pending = this.pending.concat(t))
: (this.pending = t),
(this.pendingTotal += t.length),
this.pending.length >= this._delta8)
) {
var r = (t = this.pending).length % this._delta8;
(this.pending = t.slice(t.length - r, t.length)),
0 === this.pending.length && (this.pending = null),
(t = i.join32(t, 0, t.length - r, this.endian));
for (var n = 0; n < t.length; n += this._delta32)
this._update(t, n, n + this._delta32);
}
return this;
}),
(s.prototype.digest = function(t) {
return (
this.update(this._pad()),
n(null === this.pending),
this._digest(t)
);
}),
(s.prototype._pad = function() {
var t = this.pendingTotal,
e = this._delta8,
r = e - ((t + this.padLength) % e),
i = new Array(r + this.padLength);
i[0] = 128;
for (var n = 1; n < r; n++) i[n] = 0;
if (((t <<= 3), "big" === this.endian)) {
for (var s = 8; s < this.padLength; s++) i[n++] = 0;
(i[n++] = 0),
(i[n++] = 0),
(i[n++] = 0),
(i[n++] = 0),
(i[n++] = (t >>> 24) & 255),
(i[n++] = (t >>> 16) & 255),
(i[n++] = (t >>> 8) & 255),
(i[n++] = 255 & t);
} else
for (
i[n++] = 255 & t,
i[n++] = (t >>> 8) & 255,
i[n++] = (t >>> 16) & 255,
i[n++] = (t >>> 24) & 255,
i[n++] = 0,
i[n++] = 0,
i[n++] = 0,
i[n++] = 0,
s = 8;
s < this.padLength;
s++
)
i[n++] = 0;
return i;
});
},
2344: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(9746);
function s(t, e, r) {
if (!(this instanceof s)) return new s(t, e, r);
(this.Hash = t),
(this.blockSize = t.blockSize / 8),
(this.outSize = t.outSize / 8),
(this.inner = null),
(this.outer = null),
this._init(i.toArray(e, r));
}
(t.exports = s),
(s.prototype._init = function(t) {
t.length > this.blockSize &&
(t = new this.Hash().update(t).digest()),
n(t.length <= this.blockSize);
for (var e = t.length; e < this.blockSize; e++) t.push(0);
for (e = 0; e < t.length; e++) t[e] ^= 54;
for (
this.inner = new this.Hash().update(t), e = 0;
e < t.length;
e++
)
t[e] ^= 106;
this.outer = new this.Hash().update(t);
}),
(s.prototype.update = function(t, e) {
return this.inner.update(t, e), this;
}),
(s.prototype.digest = function(t) {
return (
this.outer.update(this.inner.digest()), this.outer.digest(t)
);
});
},
2949: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(5772),
s = i.rotl32,
o = i.sum32,
a = i.sum32_3,
h = i.sum32_4,
f = n.BlockHash;
function u() {
if (!(this instanceof u)) return new u();
f.call(this),
(this.h = [
1732584193,
4023233417,
2562383102,
271733878,
3285377520,
]),
(this.endian = "little");
}
function c(t, e, r, i) {
return t <= 15
? e ^ r ^ i
: t <= 31
? (e & r) | (~e & i)
: t <= 47
? (e | ~r) ^ i
: t <= 63
? (e & i) | (r & ~i)
: e ^ (r | ~i);
}
function d(t) {
return t <= 15
? 0
: t <= 31
? 1518500249
: t <= 47
? 1859775393
: t <= 63
? 2400959708
: 2840853838;
}
function l(t) {
return t <= 15
? 1352829926
: t <= 31
? 1548603684
: t <= 47
? 1836072691
: t <= 63
? 2053994217
: 0;
}
i.inherits(u, f),
(e.ripemd160 = u),
(u.blockSize = 512),
(u.outSize = 160),
(u.hmacStrength = 192),
(u.padLength = 64),
(u.prototype._update = function(t, e) {
for (
var r = this.h[0],
i = this.h[1],
n = this.h[2],
f = this.h[3],
u = this.h[4],
y = r,
w = i,
v = n,
_ = f,
S = u,
E = 0;
E < 80;
E++
) {
var I = o(s(h(r, c(E, i, n, f), t[p[E] + e], d(E)), m[E]), u);
(r = u),
(u = f),
(f = s(n, 10)),
(n = i),
(i = I),
(I = o(
s(h(y, c(79 - E, w, v, _), t[b[E] + e], l(E)), g[E]),
S
)),
(y = S),
(S = _),
(_ = s(v, 10)),
(v = w),
(w = I);
}
(I = a(this.h[1], n, _)),
(this.h[1] = a(this.h[2], f, S)),
(this.h[2] = a(this.h[3], u, y)),
(this.h[3] = a(this.h[4], r, w)),
(this.h[4] = a(this.h[0], i, v)),
(this.h[0] = I);
}),
(u.prototype._digest = function(t) {
return "hex" === t
? i.toHex32(this.h, "little")
: i.split32(this.h, "little");
});
var p = [
0,
1,
2,
3,
4,
5,
6,
7,
8,
9,
10,
11,
12,
13,
14,
15,
7,
4,
13,
1,
10,
6,
15,
3,
12,
0,
9,
5,
2,
14,
11,
8,
3,
10,
14,
4,
9,
15,
8,
1,
2,
7,
0,
6,
13,
11,
5,
12,
1,
9,
11,
10,
0,
8,
12,
4,
13,
3,
7,
15,
14,
5,
6,
2,
4,
0,
5,
9,
7,
12,
2,
10,
14,
1,
3,
8,
11,
6,
15,
13,
],
b = [
5,
14,
7,
0,
9,
2,
11,
4,
13,
6,
15,
8,
1,
10,
3,
12,
6,
11,
3,
7,
0,
13,
5,
10,
14,
15,
8,
12,
4,
9,
1,
2,
15,
5,
1,
3,
7,
14,
6,
9,
11,
8,
12,
2,
10,
0,
4,
13,
8,
6,
4,
1,
3,
11,
15,
0,
5,
12,
2,
13,
9,
7,
10,
14,
12,
15,
10,
4,
1,
5,
8,
7,
6,
2,
13,
14,
0,
3,
9,
11,
],
m = [
11,
14,
15,
12,
5,
8,
7,
9,
11,
13,
14,
15,
6,
7,
9,
8,
7,
6,
8,
13,
11,
9,
7,
15,
7,
12,
15,
9,
11,
7,
13,
12,
11,
13,
6,
7,
14,
9,
13,
15,
14,
8,
13,
6,
5,
12,
7,
5,
11,
12,
14,
15,
14,
15,
9,
8,
9,
14,
5,
6,
8,
6,
5,
12,
9,
15,
5,
11,
6,
8,
13,
12,
5,
12,
13,
14,
11,
8,
5,
6,
],
g = [
8,
9,
9,
11,
13,
15,
15,
5,
7,
7,
8,
11,
14,
14,
12,
6,
9,
13,
15,
7,
12,
8,
9,
11,
7,
7,
12,
7,
6,
15,
13,
11,
9,
7,
15,
11,
8,
6,
6,
14,
12,
13,
5,
14,
13,
13,
7,
5,
15,
5,
8,
11,
14,
14,
6,
14,
6,
9,
12,
9,
12,
5,
15,
8,
8,
5,
12,
9,
12,
5,
14,
6,
8,
13,
6,
5,
15,
13,
11,
11,
];
},
9041: (t, e, r) => {
"use strict";
(e.sha1 = r(4761)),
(e.sha224 = r(799)),
(e.sha256 = r(9344)),
(e.sha384 = r(772)),
(e.sha512 = r(5900));
},
4761: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(5772),
s = r(7038),
o = i.rotl32,
a = i.sum32,
h = i.sum32_5,
f = s.ft_1,
u = n.BlockHash,
c = [1518500249, 1859775393, 2400959708, 3395469782];
function d() {
if (!(this instanceof d)) return new d();
u.call(this),
(this.h = [
1732584193,
4023233417,
2562383102,
271733878,
3285377520,
]),
(this.W = new Array(80));
}
i.inherits(d, u),
(t.exports = d),
(d.blockSize = 512),
(d.outSize = 160),
(d.hmacStrength = 80),
(d.padLength = 64),
(d.prototype._update = function(t, e) {
for (var r = this.W, i = 0; i < 16; i++) r[i] = t[e + i];
for (; i < r.length; i++)
r[i] = o(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1);
var n = this.h[0],
s = this.h[1],
u = this.h[2],
d = this.h[3],
l = this.h[4];
for (i = 0; i < r.length; i++) {
var p = ~~(i / 20),
b = h(o(n, 5), f(p, s, u, d), l, r[i], c[p]);
(l = d), (d = u), (u = o(s, 30)), (s = n), (n = b);
}
(this.h[0] = a(this.h[0], n)),
(this.h[1] = a(this.h[1], s)),
(this.h[2] = a(this.h[2], u)),
(this.h[3] = a(this.h[3], d)),
(this.h[4] = a(this.h[4], l));
}),
(d.prototype._digest = function(t) {
return "hex" === t
? i.toHex32(this.h, "big")
: i.split32(this.h, "big");
});
},
799: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(9344);
function s() {
if (!(this instanceof s)) return new s();
n.call(this),
(this.h = [
3238371032,
914150663,
812702999,
4144912697,
4290775857,
1750603025,
1694076839,
3204075428,
]);
}
i.inherits(s, n),
(t.exports = s),
(s.blockSize = 512),
(s.outSize = 224),
(s.hmacStrength = 192),
(s.padLength = 64),
(s.prototype._digest = function(t) {
return "hex" === t
? i.toHex32(this.h.slice(0, 7), "big")
: i.split32(this.h.slice(0, 7), "big");
});
},
9344: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(5772),
s = r(7038),
o = r(9746),
a = i.sum32,
h = i.sum32_4,
f = i.sum32_5,
u = s.ch32,
c = s.maj32,
d = s.s0_256,
l = s.s1_256,
p = s.g0_256,
b = s.g1_256,
m = n.BlockHash,
g = [
1116352408,
1899447441,
3049323471,
3921009573,
961987163,
1508970993,
2453635748,
2870763221,
3624381080,
310598401,
607225278,
1426881987,
1925078388,
2162078206,
2614888103,
3248222580,
3835390401,
4022224774,
264347078,
604807628,
770255983,
1249150122,
1555081692,
1996064986,
2554220882,
2821834349,
2952996808,
3210313671,
3336571891,
3584528711,
113926993,
338241895,
666307205,
773529912,
1294757372,
1396182291,
1695183700,
1986661051,
2177026350,
2456956037,
2730485921,
2820302411,
3259730800,
3345764771,
3516065817,
3600352804,
4094571909,
275423344,
430227734,
506948616,
659060556,
883997877,
958139571,
1322822218,
1537002063,
1747873779,
1955562222,
2024104815,
2227730452,
2361852424,
2428436474,
2756734187,
3204031479,
3329325298,
];
function y() {
if (!(this instanceof y)) return new y();
m.call(this),
(this.h = [
1779033703,
3144134277,
1013904242,
2773480762,
1359893119,
2600822924,
528734635,
1541459225,
]),
(this.k = g),
(this.W = new Array(64));
}
i.inherits(y, m),
(t.exports = y),
(y.blockSize = 512),
(y.outSize = 256),
(y.hmacStrength = 192),
(y.padLength = 64),
(y.prototype._update = function(t, e) {
for (var r = this.W, i = 0; i < 16; i++) r[i] = t[e + i];
for (; i < r.length; i++)
r[i] = h(b(r[i - 2]), r[i - 7], p(r[i - 15]), r[i - 16]);
var n = this.h[0],
s = this.h[1],
m = this.h[2],
g = this.h[3],
y = this.h[4],
w = this.h[5],
v = this.h[6],
_ = this.h[7];
for (o(this.k.length === r.length), i = 0; i < r.length; i++) {
var S = f(_, l(y), u(y, w, v), this.k[i], r[i]),
E = a(d(n), c(n, s, m));
(_ = v),
(v = w),
(w = y),
(y = a(g, S)),
(g = m),
(m = s),
(s = n),
(n = a(S, E));
}
(this.h[0] = a(this.h[0], n)),
(this.h[1] = a(this.h[1], s)),
(this.h[2] = a(this.h[2], m)),
(this.h[3] = a(this.h[3], g)),
(this.h[4] = a(this.h[4], y)),
(this.h[5] = a(this.h[5], w)),
(this.h[6] = a(this.h[6], v)),
(this.h[7] = a(this.h[7], _));
}),
(y.prototype._digest = function(t) {
return "hex" === t
? i.toHex32(this.h, "big")
: i.split32(this.h, "big");
});
},
772: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(5900);
function s() {
if (!(this instanceof s)) return new s();
n.call(this),
(this.h = [
3418070365,
3238371032,
1654270250,
914150663,
2438529370,
812702999,
355462360,
4144912697,
1731405415,
4290775857,
2394180231,
1750603025,
3675008525,
1694076839,
1203062813,
3204075428,
]);
}
i.inherits(s, n),
(t.exports = s),
(s.blockSize = 1024),
(s.outSize = 384),
(s.hmacStrength = 192),
(s.padLength = 128),
(s.prototype._digest = function(t) {
return "hex" === t
? i.toHex32(this.h.slice(0, 12), "big")
: i.split32(this.h.slice(0, 12), "big");
});
},
5900: (t, e, r) => {
"use strict";
var i = r(6436),
n = r(5772),
s = r(9746),
o = i.rotr64_hi,
a = i.rotr64_lo,
h = i.shr64_hi,
f = i.shr64_lo,
u = i.sum64,
c = i.sum64_hi,
d = i.sum64_lo,
l = i.sum64_4_hi,
p = i.sum64_4_lo,
b = i.sum64_5_hi,
m = i.sum64_5_lo,
g = n.BlockHash,
y = [
1116352408,
3609767458,
1899447441,
602891725,
3049323471,
3964484399,
3921009573,
2173295548,
961987163,
4081628472,
1508970993,
3053834265,
2453635748,
2937671579,
2870763221,
3664609560,
3624381080,
2734883394,
310598401,
1164996542,
607225278,
1323610764,
1426881987,
3590304994,
1925078388,
4068182383,
2162078206,
991336113,
2614888103,
633803317,
3248222580,
3479774868,
3835390401,
2666613458,
4022224774,
944711139,
264347078,
2341262773,
604807628,
2007800933,
770255983,
1495990901,
1249150122,
1856431235,
1555081692,
3175218132,
1996064986,
2198950837,
2554220882,
3999719339,
2821834349,
766784016,
2952996808,
2566594879,
3210313671,
3203337956,
3336571891,
1034457026,
3584528711,
2466948901,
113926993,
3758326383,
338241895,
168717936,
666307205,
1188179964,
773529912,
1546045734,
1294757372,
1522805485,
1396182291,
2643833823,
1695183700,
2343527390,
1986661051,
1014477480,
2177026350,
1206759142,
2456956037,
344077627,
2730485921,
1290863460,
2820302411,
3158454273,
3259730800,
3505952657,
3345764771,
106217008,
3516065817,
3606008344,
3600352804,
1432725776,
4094571909,
1467031594,
275423344,
851169720,
430227734,
3100823752,
506948616,
1363258195,
659060556,
3750685593,
883997877,
3785050280,
958139571,
3318307427,
1322822218,
3812723403,
1537002063,
2003034995,
1747873779,
3602036899,
1955562222,
1575990012,
2024104815,
1125592928,
2227730452,
2716904306,
2361852424,
442776044,
2428436474,
593698344,
2756734187,
3733110249,
3204031479,
2999351573,
3329325298,
3815920427,
3391569614,
3928383900,
3515267271,
566280711,
3940187606,
3454069534,
4118630271,
4000239992,
116418474,
1914138554,
174292421,
2731055270,
289380356,
3203993006,
460393269,
320620315,
685471733,
587496836,
852142971,
1086792851,
1017036298,
365543100,
1126000580,
2618297676,
1288033470,
3409855158,
1501505948,
4234509866,
1607167915,
987167468,
1816402316,
1246189591,
];
function w() {
if (!(this instanceof w)) return new w();
g.call(this),
(this.h = [
1779033703,
4089235720,
3144134277,
2227873595,
1013904242,
4271175723,
2773480762,
1595750129,
1359893119,
2917565137,
2600822924,
725511199,
528734635,
4215389547,
1541459225,
327033209,
]),
(this.k = y),
(this.W = new Array(160));
}
function v(t, e, r, i, n) {
var s = (t & r) ^ (~t & n);
return s < 0 && (s += 4294967296), s;
}
function _(t, e, r, i, n, s) {
var o = (e & i) ^ (~e & s);
return o < 0 && (o += 4294967296), o;
}
function S(t, e, r, i, n) {
var s = (t & r) ^ (t & n) ^ (r & n);
return s < 0 && (s += 4294967296), s;
}
function E(t, e, r, i, n, s) {
var o = (e & i) ^ (e & s) ^ (i & s);
return o < 0 && (o += 4294967296), o;
}
function I(t, e) {
var r = o(t, e, 28) ^ o(e, t, 2) ^ o(e, t, 7);
return r < 0 && (r += 4294967296), r;
}
function O(t, e) {
var r = a(t, e, 28) ^ a(e, t, 2) ^ a(e, t, 7);
return r < 0 && (r += 4294967296), r;
}
function B(t, e) {
var r = a(t, e, 14) ^ a(t, e, 18) ^ a(e, t, 9);
return r < 0 && (r += 4294967296), r;
}
function k(t, e) {
var r = o(t, e, 1) ^ o(t, e, 8) ^ h(t, e, 7);
return r < 0 && (r += 4294967296), r;
}
function P(t, e) {
var r = a(t, e, 1) ^ a(t, e, 8) ^ f(t, e, 7);
return r < 0 && (r += 4294967296), r;
}
function R(t, e) {
var r = a(t, e, 19) ^ a(e, t, 29) ^ f(t, e, 6);
return r < 0 && (r += 4294967296), r;
}
i.inherits(w, g),
(t.exports = w),
(w.blockSize = 1024),
(w.outSize = 512),
(w.hmacStrength = 192),
(w.padLength = 128),
(w.prototype._prepareBlock = function(t, e) {
for (var r = this.W, i = 0; i < 32; i++) r[i] = t[e + i];
for (; i < r.length; i += 2) {
var n =
((m = r[i - 4]),
(g = r[i - 3]),
(y = void 0),
(y = o(m, g, 19) ^ o(g, m, 29) ^ h(m, g, 6)) < 0 &&
(y += 4294967296),
y),
s = R(r[i - 4], r[i - 3]),
a = r[i - 14],
f = r[i - 13],
u = k(r[i - 30], r[i - 29]),
c = P(r[i - 30], r[i - 29]),
d = r[i - 32],
b = r[i - 31];
(r[i] = l(n, s, a, f, u, c, d, b)),
(r[i + 1] = p(n, s, a, f, u, c, d, b));
}
var m, g, y;
}),
(w.prototype._update = function(t, e) {
this._prepareBlock(t, e);
var r,
i,
n,
a = this.W,
h = this.h[0],
f = this.h[1],
l = this.h[2],
p = this.h[3],
g = this.h[4],
y = this.h[5],
w = this.h[6],
k = this.h[7],
P = this.h[8],
R = this.h[9],
A = this.h[10],
N = this.h[11],
x = this.h[12],
M = this.h[13],
T = this.h[14],
C = this.h[15];
s(this.k.length === a.length);
for (var L = 0; L < a.length; L += 2) {
var H = T,
U = C,
F =
((n = void 0),
(n = o((r = P), (i = R), 14) ^ o(r, i, 18) ^ o(i, r, 9)) <
0 && (n += 4294967296),
n),
K = B(P, R),
D = v(P, 0, A, 0, x),
V = _(0, R, 0, N, 0, M),
j = this.k[L],
q = this.k[L + 1],
z = a[L],
G = a[L + 1],
Y = b(H, U, F, K, D, V, j, q, z, G),
J = m(H, U, F, K, D, V, j, q, z, G);
(H = I(h, f)),
(U = O(h, f)),
(F = S(h, 0, l, 0, g)),
(K = E(0, f, 0, p, 0, y));
var W = c(H, U, F, K),
X = d(H, U, F, K);
(T = x),
(C = M),
(x = A),
(M = N),
(A = P),
(N = R),
(P = c(w, k, Y, J)),
(R = d(k, k, Y, J)),
(w = g),
(k = y),
(g = l),
(y = p),
(l = h),
(p = f),
(h = c(Y, J, W, X)),
(f = d(Y, J, W, X));
}
u(this.h, 0, h, f),
u(this.h, 2, l, p),
u(this.h, 4, g, y),
u(this.h, 6, w, k),
u(this.h, 8, P, R),
u(this.h, 10, A, N),
u(this.h, 12, x, M),
u(this.h, 14, T, C);
}),
(w.prototype._digest = function(t) {
return "hex" === t
? i.toHex32(this.h, "big")
: i.split32(this.h, "big");
});
},
7038: (t, e, r) => {
"use strict";
var i = r(6436).rotr32;
function n(t, e, r) {
return (t & e) ^ (~t & r);
}
function s(t, e, r) {
return (t & e) ^ (t & r) ^ (e & r);
}
function o(t, e, r) {
return t ^ e ^ r;
}
(e.ft_1 = function(t, e, r, i) {
return 0 === t
? n(e, r, i)
: 1 === t || 3 === t
? o(e, r, i)
: 2 === t
? s(e, r, i)
: void 0;
}),
(e.ch32 = n),
(e.maj32 = s),
(e.p32 = o),
(e.s0_256 = function(t) {
return i(t, 2) ^ i(t, 13) ^ i(t, 22);
}),
(e.s1_256 = function(t) {
return i(t, 6) ^ i(t, 11) ^ i(t, 25);
}),
(e.g0_256 = function(t) {
return i(t, 7) ^ i(t, 18) ^ (t >>> 3);
}),
(e.g1_256 = function(t) {
return i(t, 17) ^ i(t, 19) ^ (t >>> 10);
});
},
6436: (t, e, r) => {
"use strict";
var i = r(9746),
n = r(5717);
function s(t, e) {
return (
55296 == (64512 & t.charCodeAt(e)) &&
!(e < 0 || e + 1 >= t.length) &&
56320 == (64512 & t.charCodeAt(e + 1))
);
}
function o(t) {
return (
((t >>> 24) |
((t >>> 8) & 65280) |
((t << 8) & 16711680) |
((255 & t) << 24)) >>>
0
);
}
function a(t) {
return 1 === t.length ? "0" + t : t;
}
function h(t) {
return 7 === t.length
? "0" + t
: 6 === t.length
? "00" + t
: 5 === t.length
? "000" + t
: 4 === t.length
? "0000" + t
: 3 === t.length
? "00000" + t
: 2 === t.length
? "000000" + t
: 1 === t.length
? "0000000" + t
: t;
}
(e.inherits = n),
(e.toArray = function(t, e) {
if (Array.isArray(t)) return t.slice();
if (!t) return [];
var r = [];
if ("string" == typeof t)
if (e) {
if ("hex" === e)
for (
(t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 &&
(t = "0" + t),
n = 0;
n < t.length;
n += 2
)
r.push(parseInt(t[n] + t[n + 1], 16));
} else
for (var i = 0, n = 0; n < t.length; n++) {
var o = t.charCodeAt(n);
o < 128
? (r[i++] = o)
: o < 2048
? ((r[i++] = (o >> 6) | 192), (r[i++] = (63 & o) | 128))
: s(t, n)
? ((o =
65536 +
((1023 & o) << 10) +
(1023 & t.charCodeAt(++n))),
(r[i++] = (o >> 18) | 240),
(r[i++] = ((o >> 12) & 63) | 128),
(r[i++] = ((o >> 6) & 63) | 128),
(r[i++] = (63 & o) | 128))
: ((r[i++] = (o >> 12) | 224),
(r[i++] = ((o >> 6) & 63) | 128),
(r[i++] = (63 & o) | 128));
}
else for (n = 0; n < t.length; n++) r[n] = 0 | t[n];
return r;
}),
(e.toHex = function(t) {
for (var e = "", r = 0; r < t.length; r++)
e += a(t[r].toString(16));
return e;
}),
(e.htonl = o),
(e.toHex32 = function(t, e) {
for (var r = "", i = 0; i < t.length; i++) {
var n = t[i];
"little" === e && (n = o(n)), (r += h(n.toString(16)));
}
return r;
}),
(e.zero2 = a),
(e.zero8 = h),
(e.join32 = function(t, e, r, n) {
var s = r - e;
i(s % 4 == 0);
for (
var o = new Array(s / 4), a = 0, h = e;
a < o.length;
a++, h += 4
) {
var f;
(f =
"big" === n
? (t[h] << 24) |
(t[h + 1] << 16) |
(t[h + 2] << 8) |
t[h + 3]
: (t[h + 3] << 24) |
(t[h + 2] << 16) |
(t[h + 1] << 8) |
t[h]),
(o[a] = f >>> 0);
}
return o;
}),
(e.split32 = function(t, e) {
for (
var r = new Array(4 * t.length), i = 0, n = 0;
i < t.length;
i++, n += 4
) {
var s = t[i];
"big" === e
? ((r[n] = s >>> 24),
(r[n + 1] = (s >>> 16) & 255),
(r[n + 2] = (s >>> 8) & 255),
(r[n + 3] = 255 & s))
: ((r[n + 3] = s >>> 24),
(r[n + 2] = (s >>> 16) & 255),
(r[n + 1] = (s >>> 8) & 255),
(r[n] = 255 & s));
}
return r;
}),
(e.rotr32 = function(t, e) {
return (t >>> e) | (t << (32 - e));
}),
(e.rotl32 = function(t, e) {
return (t << e) | (t >>> (32 - e));
}),
(e.sum32 = function(t, e) {
return (t + e) >>> 0;
}),
(e.sum32_3 = function(t, e, r) {
return (t + e + r) >>> 0;
}),
(e.sum32_4 = function(t, e, r, i) {
return (t + e + r + i) >>> 0;
}),
(e.sum32_5 = function(t, e, r, i, n) {
return (t + e + r + i + n) >>> 0;
}),
(e.sum64 = function(t, e, r, i) {
var n = t[e],
s = (i + t[e + 1]) >>> 0,
o = (s < i ? 1 : 0) + r + n;
(t[e] = o >>> 0), (t[e + 1] = s);
}),
(e.sum64_hi = function(t, e, r, i) {
return (((e + i) >>> 0 < e ? 1 : 0) + t + r) >>> 0;
}),
(e.sum64_lo = function(t, e, r, i) {
return (e + i) >>> 0;
}),
(e.sum64_4_hi = function(t, e, r, i, n, s, o, a) {
var h = 0,
f = e;
return (
(h += (f = (f + i) >>> 0) < e ? 1 : 0),
(h += (f = (f + s) >>> 0) < s ? 1 : 0),
(t + r + n + o + (h += (f = (f + a) >>> 0) < a ? 1 : 0)) >>> 0
);
}),
(e.sum64_4_lo = function(t, e, r, i, n, s, o, a) {
return (e + i + s + a) >>> 0;
}),
(e.sum64_5_hi = function(t, e, r, i, n, s, o, a, h, f) {
var u = 0,
c = e;
return (
(u += (c = (c + i) >>> 0) < e ? 1 : 0),
(u += (c = (c + s) >>> 0) < s ? 1 : 0),
(u += (c = (c + a) >>> 0) < a ? 1 : 0),
(t + r + n + o + h + (u += (c = (c + f) >>> 0) < f ? 1 : 0)) >>>
0
);
}),
(e.sum64_5_lo = function(t, e, r, i, n, s, o, a, h, f) {
return (e + i + s + a + f) >>> 0;
}),
(e.rotr64_hi = function(t, e, r) {
return ((e << (32 - r)) | (t >>> r)) >>> 0;
}),
(e.rotr64_lo = function(t, e, r) {
return ((t << (32 - r)) | (e >>> r)) >>> 0;
}),
(e.shr64_hi = function(t, e, r) {
return t >>> r;
}),
(e.shr64_lo = function(t, e, r) {
return ((t << (32 - r)) | (e >>> r)) >>> 0;
});
},
2156: (t, e, r) => {
"use strict";
var i = r(3715),
n = r(4504),
s = r(9746);
function o(t) {
if (!(this instanceof o)) return new o(t);
(this.hash = t.hash),
(this.predResist = !!t.predResist),
(this.outLen = this.hash.outSize),
(this.minEntropy = t.minEntropy || this.hash.hmacStrength),
(this._reseed = null),
(this.reseedInterval = null),
(this.K = null),
(this.V = null);
var e = n.toArray(t.entropy, t.entropyEnc || "hex"),
r = n.toArray(t.nonce, t.nonceEnc || "hex"),
i = n.toArray(t.pers, t.persEnc || "hex");
s(
e.length >= this.minEntropy / 8,
"Not enough entropy. Minimum is: " + this.minEntropy + " bits"
),
this._init(e, r, i);
}
(t.exports = o),
(o.prototype._init = function(t, e, r) {
var i = t.concat(e).concat(r);
(this.K = new Array(this.outLen / 8)),
(this.V = new Array(this.outLen / 8));
for (var n = 0; n < this.V.length; n++)
(this.K[n] = 0), (this.V[n] = 1);
this._update(i),
(this._reseed = 1),
(this.reseedInterval = 281474976710656);
}),
(o.prototype._hmac = function() {
return new i.hmac(this.hash, this.K);
}),
(o.prototype._update = function(t) {
var e = this._hmac()
.update(this.V)
.update([0]);
t && (e = e.update(t)),
(this.K = e.digest()),
(this.V = this._hmac()
.update(this.V)
.digest()),
t &&
((this.K = this._hmac()
.update(this.V)
.update([1])
.update(t)
.digest()),
(this.V = this._hmac()
.update(this.V)
.digest()));
}),
(o.prototype.reseed = function(t, e, r, i) {
"string" != typeof e && ((i = r), (r = e), (e = null)),
(t = n.toArray(t, e)),
(r = n.toArray(r, i)),
s(
t.length >= this.minEntropy / 8,
"Not enough entropy. Minimum is: " + this.minEntropy + " bits"
),
this._update(t.concat(r || [])),
(this._reseed = 1);
}),
(o.prototype.generate = function(t, e, r, i) {
if (this._reseed > this.reseedInterval)
throw new Error("Reseed is required");
"string" != typeof e && ((i = r), (r = e), (e = null)),
r && ((r = n.toArray(r, i || "hex")), this._update(r));
for (var s = []; s.length < t; )
(this.V = this._hmac()
.update(this.V)
.digest()),
(s = s.concat(this.V));
var o = s.slice(0, t);
return this._update(r), this._reseed++, n.encode(o, e);
});
},
645: (t, e) => {
(e.read = function(t, e, r, i, n) {
var s,
o,
a = 8 * n - i - 1,
h = (1 << a) - 1,
f = h >> 1,
u = -7,
c = r ? n - 1 : 0,
d = r ? -1 : 1,
l = t[e + c];
for (
c += d, s = l & ((1 << -u) - 1), l >>= -u, u += a;
u > 0;
s = 256 * s + t[e + c], c += d, u -= 8
);
for (
o = s & ((1 << -u) - 1), s >>= -u, u += i;
u > 0;
o = 256 * o + t[e + c], c += d, u -= 8
);
if (0 === s) s = 1 - f;
else {
if (s === h) return o ? NaN : (1 / 0) * (l ? -1 : 1);
(o += Math.pow(2, i)), (s -= f);
}
return (l ? -1 : 1) * o * Math.pow(2, s - i);
}),
(e.write = function(t, e, r, i, n, s) {
var o,
a,
h,
f = 8 * s - n - 1,
u = (1 << f) - 1,
c = u >> 1,
d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
l = i ? 0 : s - 1,
p = i ? 1 : -1,
b = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
for (
e = Math.abs(e),
isNaN(e) || e === 1 / 0
? ((a = isNaN(e) ? 1 : 0), (o = u))
: ((o = Math.floor(Math.log(e) / Math.LN2)),
e * (h = Math.pow(2, -o)) < 1 && (o--, (h *= 2)),
(e += o + c >= 1 ? d / h : d * Math.pow(2, 1 - c)) * h >=
2 && (o++, (h /= 2)),
o + c >= u
? ((a = 0), (o = u))
: o + c >= 1
? ((a = (e * h - 1) * Math.pow(2, n)), (o += c))
: ((a = e * Math.pow(2, c - 1) * Math.pow(2, n)),
(o = 0)));
n >= 8;
t[r + l] = 255 & a, l += p, a /= 256, n -= 8
);
for (
o = (o << n) | a, f += n;
f > 0;
t[r + l] = 255 & o, l += p, o /= 256, f -= 8
);
t[r + l - p] |= 128 * b;
});
},
5717: (t) => {
"function" == typeof Object.create
? (t.exports = function(t, e) {
e &&
((t.super_ = e),
(t.prototype = Object.create(e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0,
},
})));
})
: (t.exports = function(t, e) {
if (e) {
t.super_ = e;
var r = function() {};
(r.prototype = e.prototype),
(t.prototype = new r()),
(t.prototype.constructor = t);
}
});
},
1484: (t) => {
"use strict";
var e = /([0-9]|[a-f])/gim;
t.exports = function(t) {
return (
"string" == typeof t && (t.match(e) || []).length === t.length
);
};
},
2318: (t, e, r) => {
"use strict";
var i = r(5717),
n = r(3349),
s = r(9509).Buffer,
o = new Array(16);
function a() {
n.call(this, 64),
(this._a = 1732584193),
(this._b = 4023233417),
(this._c = 2562383102),
(this._d = 271733878);
}
function h(t, e) {
return (t << e) | (t >>> (32 - e));
}
function f(t, e, r, i, n, s, o) {
return (h((t + ((e & r) | (~e & i)) + n + s) | 0, o) + e) | 0;
}
function u(t, e, r, i, n, s, o) {
return (h((t + ((e & i) | (r & ~i)) + n + s) | 0, o) + e) | 0;
}
function c(t, e, r, i, n, s, o) {
return (h((t + (e ^ r ^ i) + n + s) | 0, o) + e) | 0;
}
function d(t, e, r, i, n, s, o) {
return (h((t + (r ^ (e | ~i)) + n + s) | 0, o) + e) | 0;
}
i(a, n),
(a.prototype._update = function() {
for (var t = o, e = 0; e < 16; ++e)
t[e] = this._block.readInt32LE(4 * e);
var r = this._a,
i = this._b,
n = this._c,
s = this._d;
(r = f(r, i, n, s, t[0], 3614090360, 7)),
(s = f(s, r, i, n, t[1], 3905402710, 12)),
(n = f(n, s, r, i, t[2], 606105819, 17)),
(i = f(i, n, s, r, t[3], 3250441966, 22)),
(r = f(r, i, n, s, t[4], 4118548399, 7)),
(s = f(s, r, i, n, t[5], 1200080426, 12)),
(n = f(n, s, r, i, t[6], 2821735955, 17)),
(i = f(i, n, s, r, t[7], 4249261313, 22)),
(r = f(r, i, n, s, t[8], 1770035416, 7)),
(s = f(s, r, i, n, t[9], 2336552879, 12)),
(n = f(n, s, r, i, t[10], 4294925233, 17)),
(i = f(i, n, s, r, t[11], 2304563134, 22)),
(r = f(r, i, n, s, t[12], 1804603682, 7)),
(s = f(s, r, i, n, t[13], 4254626195, 12)),
(n = f(n, s, r, i, t[14], 2792965006, 17)),
(r = u(
r,
(i = f(i, n, s, r, t[15], 1236535329, 22)),
n,
s,
t[1],
4129170786,
5
)),
(s = u(s, r, i, n, t[6], 3225465664, 9)),
(n = u(n, s, r, i, t[11], 643717713, 14)),
(i = u(i, n, s, r, t[0], 3921069994, 20)),
(r = u(r, i, n, s, t[5], 3593408605, 5)),
(s = u(s, r, i, n, t[10], 38016083, 9)),
(n = u(n, s, r, i, t[15], 3634488961, 14)),
(i = u(i, n, s, r, t[4], 3889429448, 20)),
(r = u(r, i, n, s, t[9], 568446438, 5)),
(s = u(s, r, i, n, t[14], 3275163606, 9)),
(n = u(n, s, r, i, t[3], 4107603335, 14)),
(i = u(i, n, s, r, t[8], 1163531501, 20)),
(r = u(r, i, n, s, t[13], 2850285829, 5)),
(s = u(s, r, i, n, t[2], 4243563512, 9)),
(n = u(n, s, r, i, t[7], 1735328473, 14)),
(r = c(
r,
(i = u(i, n, s, r, t[12], 2368359562, 20)),
n,
s,
t[5],
4294588738,
4
)),
(s = c(s, r, i, n, t[8], 2272392833, 11)),
(n = c(n, s, r, i, t[11], 1839030562, 16)),
(i = c(i, n, s, r, t[14], 4259657740, 23)),
(r = c(r, i, n, s, t[1], 2763975236, 4)),
(s = c(s, r, i, n, t[4], 1272893353, 11)),
(n = c(n, s, r, i, t[7], 4139469664, 16)),
(i = c(i, n, s, r, t[10], 3200236656, 23)),
(r = c(r, i, n, s, t[13], 681279174, 4)),
(s = c(s, r, i, n, t[0], 3936430074, 11)),
(n = c(n, s, r, i, t[3], 3572445317, 16)),
(i = c(i, n, s, r, t[6], 76029189, 23)),
(r = c(r, i, n, s, t[9], 3654602809, 4)),
(s = c(s, r, i, n, t[12], 3873151461, 11)),
(n = c(n, s, r, i, t[15], 530742520, 16)),
(r = d(
r,
(i = c(i, n, s, r, t[2], 3299628645, 23)),
n,
s,
t[0],
4096336452,
6
)),
(s = d(s, r, i, n, t[7], 1126891415, 10)),
(n = d(n, s, r, i, t[14], 2878612391, 15)),
(i = d(i, n, s, r, t[5], 4237533241, 21)),
(r = d(r, i, n, s, t[12], 1700485571, 6)),
(s = d(s, r, i, n, t[3], 2399980690, 10)),
(n = d(n, s, r, i, t[10], 4293915773, 15)),
(i = d(i, n, s, r, t[1], 2240044497, 21)),
(r = d(r, i, n, s, t[8], 1873313359, 6)),
(s = d(s, r, i, n, t[15], 4264355552, 10)),
(n = d(n, s, r, i, t[6], 2734768916, 15)),
(i = d(i, n, s, r, t[13], 1309151649, 21)),
(r = d(r, i, n, s, t[4], 4149444226, 6)),
(s = d(s, r, i, n, t[11], 3174756917, 10)),
(n = d(n, s, r, i, t[2], 718787259, 15)),
(i = d(i, n, s, r, t[9], 3951481745, 21)),
(this._a = (this._a + r) | 0),
(this._b = (this._b + i) | 0),
(this._c = (this._c + n) | 0),
(this._d = (this._d + s) | 0);
}),
(a.prototype._digest = function() {
(this._block[this._blockOffset++] = 128),
this._blockOffset > 56 &&
(this._block.fill(0, this._blockOffset, 64),
this._update(),
(this._blockOffset = 0)),
this._block.fill(0, this._blockOffset, 56),
this._block.writeUInt32LE(this._length[0], 56),
this._block.writeUInt32LE(this._length[1], 60),
this._update();
var t = s.allocUnsafe(16);
return (
t.writeInt32LE(this._a, 0),
t.writeInt32LE(this._b, 4),
t.writeInt32LE(this._c, 8),
t.writeInt32LE(this._d, 12),
t
);
}),
(t.exports = a);
},
9746: (t) => {
function e(t, e) {
if (!t) throw new Error(e || "Assertion failed");
}
(t.exports = e),
(e.equal = function(t, e, r) {
if (t != e)
throw new Error(r || "Assertion failed: " + t + " != " + e);
});
},
4504: (t, e) => {
"use strict";
var r = e;
function i(t) {
return 1 === t.length ? "0" + t : t;
}
function n(t) {
for (var e = "", r = 0; r < t.length; r++)
e += i(t[r].toString(16));
return e;
}
(r.toArray = function(t, e) {
if (Array.isArray(t)) return t.slice();
if (!t) return [];
var r = [];
if ("string" != typeof t) {
for (var i = 0; i < t.length; i++) r[i] = 0 | t[i];
return r;
}
if ("hex" === e)
for (
(t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 &&
(t = "0" + t),
i = 0;
i < t.length;
i += 2
)
r.push(parseInt(t[i] + t[i + 1], 16));
else
for (i = 0; i < t.length; i++) {
var n = t.charCodeAt(i),
s = n >> 8,
o = 255 & n;
s ? r.push(s, o) : r.push(o);
}
return r;
}),
(r.zero2 = i),
(r.toHex = n),
(r.encode = function(t, e) {
return "hex" === e ? n(t) : t;
});
},
5632: (t, e, r) => {
(e.pbkdf2 = r(8638)), (e.pbkdf2Sync = r(1257));
},
8638: (t, e, r) => {
var i,
n = r(4155),
s = r(9509).Buffer,
o = r(7357),
a = r(2368),
h = r(1257),
f = r(7777),
u = r.g.crypto && r.g.crypto.subtle,
c = {
sha: "SHA-1",
"sha-1": "SHA-1",
sha1: "SHA-1",
sha256: "SHA-256",
"sha-256": "SHA-256",
sha384: "SHA-384",
"sha-384": "SHA-384",
"sha-512": "SHA-512",
sha512: "SHA-512",
},
d = [];
function l(t, e, r, i, n) {
return u
.importKey("raw", t, { name: "PBKDF2" }, !1, ["deriveBits"])
.then(function(t) {
return u.deriveBits(
{ name: "PBKDF2", salt: e, iterations: r, hash: { name: n } },
t,
i << 3
);
})
.then(function(t) {
return s.from(t);
});
}
t.exports = function(t, e, p, b, m, g) {
"function" == typeof m && ((g = m), (m = void 0));
var y = c[(m = m || "sha1").toLowerCase()];
if (!y || "function" != typeof r.g.Promise)
return n.nextTick(function() {
var r;
try {
r = h(t, e, p, b, m);
} catch (t) {
return g(t);
}
g(null, r);
});
if (
(o(p, b),
(t = f(t, a, "Password")),
(e = f(e, a, "Salt")),
"function" != typeof g)
)
throw new Error("No callback provided to pbkdf2");
!(function(t, e) {
t.then(
function(t) {
n.nextTick(function() {
e(null, t);
});
},
function(t) {
n.nextTick(function() {
e(t);
});
}
);
})(
(function(t) {
if (r.g.process && !r.g.process.browser)
return Promise.resolve(!1);
if (!u || !u.importKey || !u.deriveBits)
return Promise.resolve(!1);
if (void 0 !== d[t]) return d[t];
var e = l((i = i || s.alloc(8)), i, 10, 128, t)
.then(function() {
return !0;
})
.catch(function() {
return !1;
});
return (d[t] = e), e;
})(y).then(function(r) {
return r ? l(t, e, p, b, y) : h(t, e, p, b, m);
}),
g
);
};
},
2368: (t, e, r) => {
var i,
n = r(4155);
(i = n.browser
? "utf-8"
: n.version
? parseInt(n.version.split(".")[0].slice(1), 10) >= 6
? "utf-8"
: "binary"
: "utf-8"),
(t.exports = i);
},
7357: (t) => {
var e = Math.pow(2, 30) - 1;
t.exports = function(t, r) {
if ("number" != typeof t)
throw new TypeError("Iterations not a number");
if (t < 0) throw new TypeError("Bad iterations");
if ("number" != typeof r)
throw new TypeError("Key length not a number");
if (r < 0 || r > e || r != r) throw new TypeError("Bad key length");
};
},
1257: (t, e, r) => {
var i = r(8028),
n = r(9785),
s = r(9072),
o = r(9509).Buffer,
a = r(7357),
h = r(2368),
f = r(7777),
u = o.alloc(128),
c = {
md5: 16,
sha1: 20,
sha224: 28,
sha256: 32,
sha384: 48,
sha512: 64,
rmd160: 20,
ripemd160: 20,
};
function d(t, e, r) {
var a = (function(t) {
return "rmd160" === t || "ripemd160" === t
? function(t) {
return new n().update(t).digest();
}
: "md5" === t
? i
: function(e) {
return s(t)
.update(e)
.digest();
};
})(t),
h = "sha512" === t || "sha384" === t ? 128 : 64;
e.length > h
? (e = a(e))
: e.length < h && (e = o.concat([e, u], h));
for (
var f = o.allocUnsafe(h + c[t]),
d = o.allocUnsafe(h + c[t]),
l = 0;
l < h;
l++
)
(f[l] = 54 ^ e[l]), (d[l] = 92 ^ e[l]);
var p = o.allocUnsafe(h + r + 4);
f.copy(p, 0, 0, h),
(this.ipad1 = p),
(this.ipad2 = f),
(this.opad = d),
(this.alg = t),
(this.blocksize = h),
(this.hash = a),
(this.size = c[t]);
}
(d.prototype.run = function(t, e) {
return (
t.copy(e, this.blocksize),
this.hash(e).copy(this.opad, this.blocksize),
this.hash(this.opad)
);
}),
(t.exports = function(t, e, r, i, n) {
a(r, i);
var s = new d(
(n = n || "sha1"),
(t = f(t, h, "Password")),
(e = f(e, h, "Salt")).length
),
u = o.allocUnsafe(i),
l = o.allocUnsafe(e.length + 4);
e.copy(l, 0, 0, e.length);
for (
var p = 0, b = c[n], m = Math.ceil(i / b), g = 1;
g <= m;
g++
) {
l.writeUInt32BE(g, e.length);
for (var y = s.run(l, s.ipad1), w = y, v = 1; v < r; v++) {
w = s.run(w, s.ipad2);
for (var _ = 0; _ < b; _++) y[_] ^= w[_];
}
y.copy(u, p), (p += b);
}
return u;
});
},
7777: (t, e, r) => {
var i = r(9509).Buffer;
t.exports = function(t, e, r) {
if (i.isBuffer(t)) return t;
if ("string" == typeof t) return i.from(t, e);
if (ArrayBuffer.isView(t)) return i.from(t.buffer);
throw new TypeError(
r + " must be a string, a Buffer, a typed array or a DataView"
);
};
},
4155: (t) => {
var e,
r,
i = (t.exports = {});
function n() {
throw new Error("setTimeout has not been defined");
}
function s() {
throw new Error("clearTimeout has not been defined");
}
function o(t) {
if (e === setTimeout) return setTimeout(t, 0);
if ((e === n || !e) && setTimeout)
return (e = setTimeout), setTimeout(t, 0);
try {
return e(t, 0);
} catch (r) {
try {
return e.call(null, t, 0);
} catch (r) {
return e.call(this, t, 0);
}
}
}
!(function() {
try {
e = "function" == typeof setTimeout ? setTimeout : n;
} catch (t) {
e = n;
}
try {
r = "function" == typeof clearTimeout ? clearTimeout : s;
} catch (t) {
r = s;
}
})();
var a,
h = [],
f = !1,
u = -1;
function c() {
f &&
a &&
((f = !1),
a.length ? (h = a.concat(h)) : (u = -1),
h.length && d());
}
function d() {
if (!f) {
var t = o(c);
f = !0;
for (var e = h.length; e; ) {
for (a = h, h = []; ++u < e; ) a && a[u].run();
(u = -1), (e = h.length);
}
(a = null),
(f = !1),
(function(t) {
if (r === clearTimeout) return clearTimeout(t);
if ((r === s || !r) && clearTimeout)
return (r = clearTimeout), clearTimeout(t);
try {
r(t);
} catch (e) {
try {
return r.call(null, t);
} catch (e) {
return r.call(this, t);
}
}
})(t);
}
}
function l(t, e) {
(this.fun = t), (this.array = e);
}
function p() {}
(i.nextTick = function(t) {
var e = new Array(arguments.length - 1);
if (arguments.length > 1)
for (var r = 1; r < arguments.length; r++)
e[r - 1] = arguments[r];
h.push(new l(t, e)), 1 !== h.length || f || o(d);
}),
(l.prototype.run = function() {
this.fun.apply(null, this.array);
}),
(i.title = "browser"),
(i.browser = !0),
(i.env = {}),
(i.argv = []),
(i.version = ""),
(i.versions = {}),
(i.on = p),
(i.addListener = p),
(i.once = p),
(i.off = p),
(i.removeListener = p),
(i.removeAllListeners = p),
(i.emit = p),
(i.prependListener = p),
(i.prependOnceListener = p),
(i.listeners = function(t) {
return [];
}),
(i.binding = function(t) {
throw new Error("process.binding is not supported");
}),
(i.cwd = function() {
return "/";
}),
(i.chdir = function(t) {
throw new Error("process.chdir is not supported");
}),
(i.umask = function() {
return 0;
});
},
1798: (t, e, r) => {
"use strict";
var i = r(4155),
n = 65536,
s = r(9509).Buffer,
o = r.g.crypto || r.g.msCrypto;
o && o.getRandomValues
? (t.exports = function(t, e) {
if (t > 4294967295)
throw new RangeError("requested too many random bytes");
var r = s.allocUnsafe(t);
if (t > 0)
if (t > n)
for (var a = 0; a < t; a += n)
o.getRandomValues(r.slice(a, a + n));
else o.getRandomValues(r);
return "function" == typeof e
? i.nextTick(function() {
e(null, r);
})
: r;
})
: (t.exports = function() {
throw new Error(
"Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11"
);
});
},
9785: (t, e, r) => {
"use strict";
var i = r(8764).Buffer,
n = r(5717),
s = r(3349),
o = new Array(16),
a = [
0,
1,
2,
3,
4,
5,
6,
7,
8,
9,
10,
11,
12,
13,
14,
15,
7,
4,
13,
1,
10,
6,
15,
3,
12,
0,
9,
5,
2,
14,
11,
8,
3,
10,
14,
4,
9,
15,
8,
1,
2,
7,
0,
6,
13,
11,
5,
12,
1,
9,
11,
10,
0,
8,
12,
4,
13,
3,
7,
15,
14,
5,
6,
2,
4,
0,
5,
9,
7,
12,
2,
10,
14,
1,
3,
8,
11,
6,
15,
13,
],
h = [
5,
14,
7,
0,
9,
2,
11,
4,
13,
6,
15,
8,
1,
10,
3,
12,
6,
11,
3,
7,
0,
13,
5,
10,
14,
15,
8,
12,
4,
9,
1,
2,
15,
5,
1,
3,
7,
14,
6,
9,
11,
8,
12,
2,
10,
0,
4,
13,
8,
6,
4,
1,
3,
11,
15,
0,
5,
12,
2,
13,
9,
7,
10,
14,
12,
15,
10,
4,
1,
5,
8,
7,
6,
2,
13,
14,
0,
3,
9,
11,
],
f = [
11,
14,
15,
12,
5,
8,
7,
9,
11,
13,
14,
15,
6,
7,
9,
8,
7,
6,
8,
13,
11,
9,
7,
15,
7,
12,
15,
9,
11,
7,
13,
12,
11,
13,
6,
7,
14,
9,
13,
15,
14,
8,
13,
6,
5,
12,
7,
5,
11,
12,
14,
15,
14,
15,
9,
8,
9,
14,
5,
6,
8,
6,
5,
12,
9,
15,
5,
11,
6,
8,
13,
12,
5,
12,
13,
14,
11,
8,
5,
6,
],
u = [
8,
9,
9,
11,
13,
15,
15,
5,
7,
7,
8,
11,
14,
14,
12,
6,
9,
13,
15,
7,
12,
8,
9,
11,
7,
7,
12,
7,
6,
15,
13,
11,
9,
7,
15,
11,
8,
6,
6,
14,
12,
13,
5,
14,
13,
13,
7,
5,
15,
5,
8,
11,
14,
14,
6,
14,
6,
9,
12,
9,
12,
5,
15,
8,
8,
5,
12,
9,
12,
5,
14,
6,
8,
13,
6,
5,
15,
13,
11,
11,
],
c = [0, 1518500249, 1859775393, 2400959708, 2840853838],
d = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function l() {
s.call(this, 64),
(this._a = 1732584193),
(this._b = 4023233417),
(this._c = 2562383102),
(this._d = 271733878),
(this._e = 3285377520);
}
function p(t, e) {
return (t << e) | (t >>> (32 - e));
}
function b(t, e, r, i, n, s, o, a) {
return (p((t + (e ^ r ^ i) + s + o) | 0, a) + n) | 0;
}
function m(t, e, r, i, n, s, o, a) {
return (p((t + ((e & r) | (~e & i)) + s + o) | 0, a) + n) | 0;
}
function g(t, e, r, i, n, s, o, a) {
return (p((t + ((e | ~r) ^ i) + s + o) | 0, a) + n) | 0;
}
function y(t, e, r, i, n, s, o, a) {
return (p((t + ((e & i) | (r & ~i)) + s + o) | 0, a) + n) | 0;
}
function w(t, e, r, i, n, s, o, a) {
return (p((t + (e ^ (r | ~i)) + s + o) | 0, a) + n) | 0;
}
n(l, s),
(l.prototype._update = function() {
for (var t = o, e = 0; e < 16; ++e)
t[e] = this._block.readInt32LE(4 * e);
for (
var r = 0 | this._a,
i = 0 | this._b,
n = 0 | this._c,
s = 0 | this._d,
l = 0 | this._e,
v = 0 | this._a,
_ = 0 | this._b,
S = 0 | this._c,
E = 0 | this._d,
I = 0 | this._e,
O = 0;
O < 80;
O += 1
) {
var B, k;
O < 16
? ((B = b(r, i, n, s, l, t[a[O]], c[0], f[O])),
(k = w(v, _, S, E, I, t[h[O]], d[0], u[O])))
: O < 32
? ((B = m(r, i, n, s, l, t[a[O]], c[1], f[O])),
(k = y(v, _, S, E, I, t[h[O]], d[1], u[O])))
: O < 48
? ((B = g(r, i, n, s, l, t[a[O]], c[2], f[O])),
(k = g(v, _, S, E, I, t[h[O]], d[2], u[O])))
: O < 64
? ((B = y(r, i, n, s, l, t[a[O]], c[3], f[O])),
(k = m(v, _, S, E, I, t[h[O]], d[3], u[O])))
: ((B = w(r, i, n, s, l, t[a[O]], c[4], f[O])),
(k = b(v, _, S, E, I, t[h[O]], d[4], u[O]))),
(r = l),
(l = s),
(s = p(n, 10)),
(n = i),
(i = B),
(v = I),
(I = E),
(E = p(S, 10)),
(S = _),
(_ = k);
}
var P = (this._b + n + E) | 0;
(this._b = (this._c + s + I) | 0),
(this._c = (this._d + l + v) | 0),
(this._d = (this._e + r + _) | 0),
(this._e = (this._a + i + S) | 0),
(this._a = P);
}),
(l.prototype._digest = function() {
(this._block[this._blockOffset++] = 128),
this._blockOffset > 56 &&
(this._block.fill(0, this._blockOffset, 64),
this._update(),
(this._blockOffset = 0)),
this._block.fill(0, this._blockOffset, 56),
this._block.writeUInt32LE(this._length[0], 56),
this._block.writeUInt32LE(this._length[1], 60),
this._update();
var t = i.alloc ? i.alloc(20) : new i(20);
return (
t.writeInt32LE(this._a, 0),
t.writeInt32LE(this._b, 4),
t.writeInt32LE(this._c, 8),
t.writeInt32LE(this._d, 12),
t.writeInt32LE(this._e, 16),
t
);
}),
(t.exports = l);
},
9509: (t, e, r) => {
var i = r(8764),
n = i.Buffer;
function s(t, e) {
for (var r in t) e[r] = t[r];
}
function o(t, e, r) {
return n(t, e, r);
}
n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow
? (t.exports = i)
: (s(i, e), (e.Buffer = o)),
(o.prototype = Object.create(n.prototype)),
s(n, o),
(o.from = function(t, e, r) {
if ("number" == typeof t)
throw new TypeError("Argument must not be a number");
return n(t, e, r);
}),
(o.alloc = function(t, e, r) {
if ("number" != typeof t)
throw new TypeError("Argument must be a number");
var i = n(t);
return (
void 0 !== e
? "string" == typeof r
? i.fill(e, r)
: i.fill(e)
: i.fill(0),
i
);
}),
(o.allocUnsafe = function(t) {
if ("number" != typeof t)
throw new TypeError("Argument must be a number");
return n(t);
}),
(o.allocUnsafeSlow = function(t) {
if ("number" != typeof t)
throw new TypeError("Argument must be a number");
return i.SlowBuffer(t);
});
},
4189: (t, e, r) => {
var i = r(9509).Buffer;
function n(t, e) {
(this._block = i.alloc(t)),
(this._finalSize = e),
(this._blockSize = t),
(this._len = 0);
}
(n.prototype.update = function(t, e) {
"string" == typeof t && ((e = e || "utf8"), (t = i.from(t, e)));
for (
var r = this._block,
n = this._blockSize,
s = t.length,
o = this._len,
a = 0;
a < s;

) {
for (var h = o % n, f = Math.min(s - a, n - h), u = 0; u < f; u++)
r[h + u] = t[a + u];
(a += f), (o += f) % n == 0 && this._update(r);
}
return (this._len += s), this;
}),
(n.prototype.digest = function(t) {
var e = this._len % this._blockSize;
(this._block[e] = 128),
this._block.fill(0, e + 1),
e >= this._finalSize &&
(this._update(this._block), this._block.fill(0));
var r = 8 * this._len;
if (r <= 4294967295)
this._block.writeUInt32BE(r, this._blockSize - 4);
else {
var i = (4294967295 & r) >>> 0,
n = (r - i) / 4294967296;
this._block.writeUInt32BE(n, this._blockSize - 8),
this._block.writeUInt32BE(i, this._blockSize - 4);
}
this._update(this._block);
var s = this._hash();
return t ? s.toString(t) : s;
}),
(n.prototype._update = function() {
throw new Error("_update must be implemented by subclass");
}),
(t.exports = n);
},
9072: (t, e, r) => {
var i = (t.exports = function(t) {
t = t.toLowerCase();
var e = i[t];
if (!e)
throw new Error(
t + " is not supported (we accept pull requests)"
);
return new e();
});
(i.sha = r(4448)),
(i.sha1 = r(8336)),
(i.sha224 = r(8432)),
(i.sha256 = r(7499)),
(i.sha384 = r(1686)),
(i.sha512 = r(7816));
},
4448: (t, e, r) => {
var i = r(5717),
n = r(4189),
s = r(9509).Buffer,
o = [1518500249, 1859775393, -1894007588, -899497514],
a = new Array(80);
function h() {
this.init(), (this._w = a), n.call(this, 64, 56);
}
function f(t) {
return (t << 30) | (t >>> 2);
}
function u(t, e, r, i) {
return 0 === t
? (e & r) | (~e & i)
: 2 === t
? (e & r) | (e & i) | (r & i)
: e ^ r ^ i;
}
i(h, n),
(h.prototype.init = function() {
return (
(this._a = 1732584193),
(this._b = 4023233417),
(this._c = 2562383102),
(this._d = 271733878),
(this._e = 3285377520),
this
);
}),
(h.prototype._update = function(t) {
for (
var e,
r = this._w,
i = 0 | this._a,
n = 0 | this._b,
s = 0 | this._c,
a = 0 | this._d,
h = 0 | this._e,
c = 0;
c < 16;
++c
)
r[c] = t.readInt32BE(4 * c);
for (; c < 80; ++c)
r[c] = r[c - 3] ^ r[c - 8] ^ r[c - 14] ^ r[c - 16];
for (var d = 0; d < 80; ++d) {
var l = ~~(d / 20),
p =
0 |
((((e = i) << 5) | (e >>> 27)) +
u(l, n, s, a) +
h +
r[d] +
o[l]);
(h = a), (a = s), (s = f(n)), (n = i), (i = p);
}
(this._a = (i + this._a) | 0),
(this._b = (n + this._b) | 0),
(this._c = (s + this._c) | 0),
(this._d = (a + this._d) | 0),
(this._e = (h + this._e) | 0);
}),
(h.prototype._hash = function() {
var t = s.allocUnsafe(20);
return (
t.writeInt32BE(0 | this._a, 0),
t.writeInt32BE(0 | this._b, 4),
t.writeInt32BE(0 | this._c, 8),
t.writeInt32BE(0 | this._d, 12),
t.writeInt32BE(0 | this._e, 16),
t
);
}),
(t.exports = h);
},
8336: (t, e, r) => {
var i = r(5717),
n = r(4189),
s = r(9509).Buffer,
o = [1518500249, 1859775393, -1894007588, -899497514],
a = new Array(80);
function h() {
this.init(), (this._w = a), n.call(this, 64, 56);
}
function f(t) {
return (t << 5) | (t >>> 27);
}
function u(t) {
return (t << 30) | (t >>> 2);
}
function c(t, e, r, i) {
return 0 === t
? (e & r) | (~e & i)
: 2 === t
? (e & r) | (e & i) | (r & i)
: e ^ r ^ i;
}
i(h, n),
(h.prototype.init = function() {
return (
(this._a = 1732584193),
(this._b = 4023233417),
(this._c = 2562383102),
(this._d = 271733878),
(this._e = 3285377520),
this
);
}),
(h.prototype._update = function(t) {
for (
var e,
r = this._w,
i = 0 | this._a,
n = 0 | this._b,
s = 0 | this._c,
a = 0 | this._d,
h = 0 | this._e,
d = 0;
d < 16;
++d
)
r[d] = t.readInt32BE(4 * d);
for (; d < 80; ++d)
r[d] =
((e = r[d - 3] ^ r[d - 8] ^ r[d - 14] ^ r[d - 16]) << 1) |
(e >>> 31);
for (var l = 0; l < 80; ++l) {
var p = ~~(l / 20),
b = (f(i) + c(p, n, s, a) + h + r[l] + o[p]) | 0;
(h = a), (a = s), (s = u(n)), (n = i), (i = b);
}
(this._a = (i + this._a) | 0),
(this._b = (n + this._b) | 0),
(this._c = (s + this._c) | 0),
(this._d = (a + this._d) | 0),
(this._e = (h + this._e) | 0);
}),
(h.prototype._hash = function() {
var t = s.allocUnsafe(20);
return (
t.writeInt32BE(0 | this._a, 0),
t.writeInt32BE(0 | this._b, 4),
t.writeInt32BE(0 | this._c, 8),
t.writeInt32BE(0 | this._d, 12),
t.writeInt32BE(0 | this._e, 16),
t
);
}),
(t.exports = h);
},
8432: (t, e, r) => {
var i = r(5717),
n = r(7499),
s = r(4189),
o = r(9509).Buffer,
a = new Array(64);
function h() {
this.init(), (this._w = a), s.call(this, 64, 56);
}
i(h, n),
(h.prototype.init = function() {
return (
(this._a = 3238371032),
(this._b = 914150663),
(this._c = 812702999),
(this._d = 4144912697),
(this._e = 4290775857),
(this._f = 1750603025),
(this._g = 1694076839),
(this._h = 3204075428),
this
);
}),
(h.prototype._hash = function() {
var t = o.allocUnsafe(28);
return (
t.writeInt32BE(this._a, 0),
t.writeInt32BE(this._b, 4),
t.writeInt32BE(this._c, 8),
t.writeInt32BE(this._d, 12),
t.writeInt32BE(this._e, 16),
t.writeInt32BE(this._f, 20),
t.writeInt32BE(this._g, 24),
t
);
}),
(t.exports = h);
},
7499: (t, e, r) => {
var i = r(5717),
n = r(4189),
s = r(9509).Buffer,
o = [
1116352408,
1899447441,
3049323471,
3921009573,
961987163,
1508970993,
2453635748,
2870763221,
3624381080,
310598401,
607225278,
1426881987,
1925078388,
2162078206,
2614888103,
3248222580,
3835390401,
4022224774,
264347078,
604807628,
770255983,
1249150122,
1555081692,
1996064986,
2554220882,
2821834349,
2952996808,
3210313671,
3336571891,
3584528711,
113926993,
338241895,
666307205,
773529912,
1294757372,
1396182291,
1695183700,
1986661051,
2177026350,
2456956037,
2730485921,
2820302411,
3259730800,
3345764771,
3516065817,
3600352804,
4094571909,
275423344,
430227734,
506948616,
659060556,
883997877,
958139571,
1322822218,
1537002063,
1747873779,
1955562222,
2024104815,
2227730452,
2361852424,
2428436474,
2756734187,
3204031479,
3329325298,
],
a = new Array(64);
function h() {
this.init(), (this._w = a), n.call(this, 64, 56);
}
function f(t, e, r) {
return r ^ (t & (e ^ r));
}
function u(t, e, r) {
return (t & e) | (r & (t | e));
}
function c(t) {
return (
((t >>> 2) | (t << 30)) ^
((t >>> 13) | (t << 19)) ^
((t >>> 22) | (t << 10))
);
}
function d(t) {
return (
((t >>> 6) | (t << 26)) ^
((t >>> 11) | (t << 21)) ^
((t >>> 25) | (t << 7))
);
}
function l(t) {
return (
((t >>> 7) | (t << 25)) ^ ((t >>> 18) | (t << 14)) ^ (t >>> 3)
);
}
i(h, n),
(h.prototype.init = function() {
return (
(this._a = 1779033703),
(this._b = 3144134277),
(this._c = 1013904242),
(this._d = 2773480762),
(this._e = 1359893119),
(this._f = 2600822924),
(this._g = 528734635),
(this._h = 1541459225),
this
);
}),
(h.prototype._update = function(t) {
for (
var e,
r = this._w,
i = 0 | this._a,
n = 0 | this._b,
s = 0 | this._c,
a = 0 | this._d,
h = 0 | this._e,
p = 0 | this._f,
b = 0 | this._g,
m = 0 | this._h,
g = 0;
g < 16;
++g
)
r[g] = t.readInt32BE(4 * g);
for (; g < 64; ++g)
r[g] =
0 |
(((((e = r[g - 2]) >>> 17) | (e << 15)) ^
((e >>> 19) | (e << 13)) ^
(e >>> 10)) +
r[g - 7] +
l(r[g - 15]) +
r[g - 16]);
for (var y = 0; y < 64; ++y) {
var w = (m + d(h) + f(h, p, b) + o[y] + r[y]) | 0,
v = (c(i) + u(i, n, s)) | 0;
(m = b),
(b = p),
(p = h),
(h = (a + w) | 0),
(a = s),
(s = n),
(n = i),
(i = (w + v) | 0);
}
(this._a = (i + this._a) | 0),
(this._b = (n + this._b) | 0),
(this._c = (s + this._c) | 0),
(this._d = (a + this._d) | 0),
(this._e = (h + this._e) | 0),
(this._f = (p + this._f) | 0),
(this._g = (b + this._g) | 0),
(this._h = (m + this._h) | 0);
}),
(h.prototype._hash = function() {
var t = s.allocUnsafe(32);
return (
t.writeInt32BE(this._a, 0),
t.writeInt32BE(this._b, 4),
t.writeInt32BE(this._c, 8),
t.writeInt32BE(this._d, 12),
t.writeInt32BE(this._e, 16),
t.writeInt32BE(this._f, 20),
t.writeInt32BE(this._g, 24),
t.writeInt32BE(this._h, 28),
t
);
}),
(t.exports = h);
},
1686: (t, e, r) => {
var i = r(5717),
n = r(7816),
s = r(4189),
o = r(9509).Buffer,
a = new Array(160);
function h() {
this.init(), (this._w = a), s.call(this, 128, 112);
}
i(h, n),
(h.prototype.init = function() {
return (
(this._ah = 3418070365),
(this._bh = 1654270250),
(this._ch = 2438529370),
(this._dh = 355462360),
(this._eh = 1731405415),
(this._fh = 2394180231),
(this._gh = 3675008525),
(this._hh = 1203062813),
(this._al = 3238371032),
(this._bl = 914150663),
(this._cl = 812702999),
(this._dl = 4144912697),
(this._el = 4290775857),
(this._fl = 1750603025),
(this._gl = 1694076839),
(this._hl = 3204075428),
this
);
}),
(h.prototype._hash = function() {
var t = o.allocUnsafe(48);
function e(e, r, i) {
t.writeInt32BE(e, i), t.writeInt32BE(r, i + 4);
}
return (
e(this._ah, this._al, 0),
e(this._bh, this._bl, 8),
e(this._ch, this._cl, 16),
e(this._dh, this._dl, 24),
e(this._eh, this._el, 32),
e(this._fh, this._fl, 40),
t
);
}),
(t.exports = h);
},
7816: (t, e, r) => {
var i = r(5717),
n = r(4189),
s = r(9509).Buffer,
o = [
1116352408,
3609767458,
1899447441,
602891725,
3049323471,
3964484399,
3921009573,
2173295548,
961987163,
4081628472,
1508970993,
3053834265,
2453635748,
2937671579,
2870763221,
3664609560,
3624381080,
2734883394,
310598401,
1164996542,
607225278,
1323610764,
1426881987,
3590304994,
1925078388,
4068182383,
2162078206,
991336113,
2614888103,
633803317,
3248222580,
3479774868,
3835390401,
2666613458,
4022224774,
944711139,
264347078,
2341262773,
604807628,
2007800933,
770255983,
1495990901,
1249150122,
1856431235,
1555081692,
3175218132,
1996064986,
2198950837,
2554220882,
3999719339,
2821834349,
766784016,
2952996808,
2566594879,
3210313671,
3203337956,
3336571891,
1034457026,
3584528711,
2466948901,
113926993,
3758326383,
338241895,
168717936,
666307205,
1188179964,
773529912,
1546045734,
1294757372,
1522805485,
1396182291,
2643833823,
1695183700,
2343527390,
1986661051,
1014477480,
2177026350,
1206759142,
2456956037,
344077627,
2730485921,
1290863460,
2820302411,
3158454273,
3259730800,
3505952657,
3345764771,
106217008,
3516065817,
3606008344,
3600352804,
1432725776,
4094571909,
1467031594,
275423344,
851169720,
430227734,
3100823752,
506948616,
1363258195,
659060556,
3750685593,
883997877,
3785050280,
958139571,
3318307427,
1322822218,
3812723403,
1537002063,
2003034995,
1747873779,
3602036899,
1955562222,
1575990012,
2024104815,
1125592928,
2227730452,
2716904306,
2361852424,
442776044,
2428436474,
593698344,
2756734187,
3733110249,
3204031479,
2999351573,
3329325298,
3815920427,
3391569614,
3928383900,
3515267271,
566280711,
3940187606,
3454069534,
4118630271,
4000239992,
116418474,
1914138554,
174292421,
2731055270,
289380356,
3203993006,
460393269,
320620315,
685471733,
587496836,
852142971,
1086792851,
1017036298,
365543100,
1126000580,
2618297676,
1288033470,
3409855158,
1501505948,
4234509866,
1607167915,
987167468,
1816402316,
1246189591,
],
a = new Array(160);
function h() {
this.init(), (this._w = a), n.call(this, 128, 112);
}
function f(t, e, r) {
return r ^ (t & (e ^ r));
}
function u(t, e, r) {
return (t & e) | (r & (t | e));
}
function c(t, e) {
return (
((t >>> 28) | (e << 4)) ^
((e >>> 2) | (t << 30)) ^
((e >>> 7) | (t << 25))
);
}
function d(t, e) {
return (
((t >>> 14) | (e << 18)) ^
((t >>> 18) | (e << 14)) ^
((e >>> 9) | (t << 23))
);
}
function l(t, e) {
return (
((t >>> 1) | (e << 31)) ^ ((t >>> 8) | (e << 24)) ^ (t >>> 7)
);
}
function p(t, e) {
return (
((t >>> 1) | (e << 31)) ^
((t >>> 8) | (e << 24)) ^
((t >>> 7) | (e << 25))
);
}
function b(t, e) {
return (
((t >>> 19) | (e << 13)) ^ ((e >>> 29) | (t << 3)) ^ (t >>> 6)
);
}
function m(t, e) {
return (
((t >>> 19) | (e << 13)) ^
((e >>> 29) | (t << 3)) ^
((t >>> 6) | (e << 26))
);
}
function g(t, e) {
return t >>> 0 < e >>> 0 ? 1 : 0;
}
i(h, n),
(h.prototype.init = function() {
return (
(this._ah = 1779033703),
(this._bh = 3144134277),
(this._ch = 1013904242),
(this._dh = 2773480762),
(this._eh = 1359893119),
(this._fh = 2600822924),
(this._gh = 528734635),
(this._hh = 1541459225),
(this._al = 4089235720),
(this._bl = 2227873595),
(this._cl = 4271175723),
(this._dl = 1595750129),
(this._el = 2917565137),
(this._fl = 725511199),
(this._gl = 4215389547),
(this._hl = 327033209),
this
);
}),
(h.prototype._update = function(t) {
for (
var e = this._w,
r = 0 | this._ah,
i = 0 | this._bh,
n = 0 | this._ch,
s = 0 | this._dh,
a = 0 | this._eh,
h = 0 | this._fh,
y = 0 | this._gh,
w = 0 | this._hh,
v = 0 | this._al,
_ = 0 | this._bl,
S = 0 | this._cl,
E = 0 | this._dl,
I = 0 | this._el,
O = 0 | this._fl,
B = 0 | this._gl,
k = 0 | this._hl,
P = 0;
P < 32;
P += 2
)
(e[P] = t.readInt32BE(4 * P)),
(e[P + 1] = t.readInt32BE(4 * P + 4));
for (; P < 160; P += 2) {
var R = e[P - 30],
A = e[P - 30 + 1],
N = l(R, A),
x = p(A, R),
M = b((R = e[P - 4]), (A = e[P - 4 + 1])),
T = m(A, R),
C = e[P - 14],
L = e[P - 14 + 1],
H = e[P - 32],
U = e[P - 32 + 1],
F = (x + L) | 0,
K = (N + C + g(F, x)) | 0;
(K =
((K = (K + M + g((F = (F + T) | 0), T)) | 0) +
H +
g((F = (F + U) | 0), U)) |
0),
(e[P] = K),
(e[P + 1] = F);
}
for (var D = 0; D < 160; D += 2) {
(K = e[D]), (F = e[D + 1]);
var V = u(r, i, n),
j = u(v, _, S),
q = c(r, v),
z = c(v, r),
G = d(a, I),
Y = d(I, a),
J = o[D],
W = o[D + 1],
X = f(a, h, y),
Q = f(I, O, B),
Z = (k + Y) | 0,
$ = (w + G + g(Z, k)) | 0;
$ =
(($ =
(($ = ($ + X + g((Z = (Z + Q) | 0), Q)) | 0) +
J +
g((Z = (Z + W) | 0), W)) |
0) +
K +
g((Z = (Z + F) | 0), F)) |
0;
var tt = (z + j) | 0,
et = (q + V + g(tt, z)) | 0;
(w = y),
(k = B),
(y = h),
(B = O),
(h = a),
(O = I),
(a = (s + $ + g((I = (E + Z) | 0), E)) | 0),
(s = n),
(E = S),
(n = i),
(S = _),
(i = r),
(_ = v),
(r = ($ + et + g((v = (Z + tt) | 0), Z)) | 0);
}
(this._al = (this._al + v) | 0),
(this._bl = (this._bl + _) | 0),
(this._cl = (this._cl + S) | 0),
(this._dl = (this._dl + E) | 0),
(this._el = (this._el + I) | 0),
(this._fl = (this._fl + O) | 0),
(this._gl = (this._gl + B) | 0),
(this._hl = (this._hl + k) | 0),
(this._ah = (this._ah + r + g(this._al, v)) | 0),
(this._bh = (this._bh + i + g(this._bl, _)) | 0),
(this._ch = (this._ch + n + g(this._cl, S)) | 0),
(this._dh = (this._dh + s + g(this._dl, E)) | 0),
(this._eh = (this._eh + a + g(this._el, I)) | 0),
(this._fh = (this._fh + h + g(this._fl, O)) | 0),
(this._gh = (this._gh + y + g(this._gl, B)) | 0),
(this._hh = (this._hh + w + g(this._hl, k)) | 0);
}),
(h.prototype._hash = function() {
var t = s.allocUnsafe(64);
function e(e, r, i) {
t.writeInt32BE(e, i), t.writeInt32BE(r, i + 4);
}
return (
e(this._ah, this._al, 0),
e(this._bh, this._bl, 8),
e(this._ch, this._cl, 16),
e(this._dh, this._dl, 24),
e(this._eh, this._el, 32),
e(this._fh, this._fl, 40),
e(this._gh, this._gl, 48),
e(this._hh, this._hl, 56),
t
);
}),
(t.exports = h);
},
4927: (t, e, r) => {
function i(t) {
try {
if (!r.g.localStorage) return !1;
} catch (t) {
return !1;
}
var e = r.g.localStorage[t];
return null != e && "true" === String(e).toLowerCase();
}
t.exports = function(t, e) {
if (i("noDeprecation")) return t;
var r = !1;
return function() {
if (!r) {
if (i("throwDeprecation")) throw new Error(e);
i("traceDeprecation") ? console.trace(e) : console.warn(e),
(r = !0);
}
return t.apply(this, arguments);
};
};
},
6601: () => {},
9214: () => {},
9386: () => {},
1616: () => {},
},
e = {};
function r(i) {
var n = e[i];
if (void 0 !== n) return n.exports;
var s = (e[i] = { id: i, loaded: !1, exports: {} });
return t[i].call(s.exports, s, s.exports, r), (s.loaded = !0), s.exports;
}
return (
(r.n = (t) => {
var e = t && t.__esModule ? () => t.default : () => t;
return r.d(e, { a: e }), e;
}),
(r.d = (t, e) => {
for (var i in e)
r.o(e, i) &&
!r.o(t, i) &&
Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
}),
(r.g = (function() {
if ("object" == typeof globalThis) return globalThis;
try {
return this || new Function("return this")();
} catch (t) {
if ("object" == typeof window) return window;
}
})()),
(r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
(r.r = (t) => {
"undefined" != typeof Symbol &&
Symbol.toStringTag &&
Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
Object.defineProperty(t, "__esModule", { value: !0 });
}),
(r.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
r(3671)
);
})();
});

export default bsvjs;
//# sourceMappingURL=bsv.bundle.js.map

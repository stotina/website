/* eslint-disable */

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bsv = require('bsv');

const brfc = (title, authors, version) => {
  const autorString = authors.join(', ').trim();
  const stringToHash = [title.trim() + autorString + (version.toString() || '')].join('').trim();
  let hash = bsv.Hash.sha256Sha256(Buffer.from(stringToHash));
  hash = hash.reverse();
  return hash.toString('hex').substring(0, 12);
};

exports.brfc = brfc;


}).call(this)}).call(this,require("buffer").Buffer)
},{"bsv":3,"buffer":91}],2:[function(require,module,exports){
(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {
      Buffer = window.Buffer;
    } else {
      Buffer = require('buffer').Buffer;
    }
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
      this.negative = 1;
    }

    if (start < number.length) {
      if (base === 16) {
        this._parseHex(number, start, endian);
      } else {
        this._parseBase(number, base, start);
        if (endian === 'le') {
          this._initArray(this.toArray(), base, endian);
        }
      }
    }
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [number & 0x3ffffff];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [0];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this._strip();
  };

  function parseHex4Bits (string, index) {
    var c = string.charCodeAt(index);
    // '0' - '9'
    if (c >= 48 && c <= 57) {
      return c - 48;
    // 'A' - 'F'
    } else if (c >= 65 && c <= 70) {
      return c - 55;
    // 'a' - 'f'
    } else if (c >= 97 && c <= 102) {
      return c - 87;
    } else {
      assert(false, 'Invalid character in ' + string);
    }
  }

  function parseHexByte (string, lowerBound, index) {
    var r = parseHex4Bits(string, index);
    if (index - 1 >= lowerBound) {
      r |= parseHex4Bits(string, index - 1) << 4;
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start, endian) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    // 24-bits chunks
    var off = 0;
    var j = 0;

    var w;
    if (endian === 'be') {
      for (i = number.length - 1; i >= start; i -= 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    } else {
      var parseLength = number.length - start;
      for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    }

    this._strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var b = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        b = c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        b = c - 17 + 0xa;

      // '0' - '9'
      } else {
        b = c;
      }
      assert(c >= 0 && b < mul, 'Invalid character');
      r += b;
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [0];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    this._strip();
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  function move (dest, src) {
    dest.words = src.words;
    dest.length = src.length;
    dest.negative = src.negative;
    dest.red = src.red;
  }

  BN.prototype._move = function _move (dest) {
    move(dest, this);
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype._strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  // Check Symbol.for because not everywhere where Symbol defined
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Browser_compatibility
  if (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function') {
    try {
      BN.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspect;
    } catch (e) {
      BN.prototype.inspect = inspect;
    }
  } else {
    BN.prototype.inspect = inspect;
  }

  function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  }

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modrn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16, 2);
  };

  if (Buffer) {
    BN.prototype.toBuffer = function toBuffer (endian, length) {
      return this.toArrayLike(Buffer, endian, length);
    };
  }

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  var allocate = function allocate (ArrayType, size) {
    if (ArrayType.allocUnsafe) {
      return ArrayType.allocUnsafe(size);
    }
    return new ArrayType(size);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    this._strip();

    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    var res = allocate(ArrayType, reqLength);
    var postfix = endian === 'le' ? 'LE' : 'BE';
    this['_toArrayLike' + postfix](res, byteLength);
    return res;
  };

  BN.prototype._toArrayLikeLE = function _toArrayLikeLE (res, byteLength) {
    var position = 0;
    var carry = 0;

    for (var i = 0, shift = 0; i < this.length; i++) {
      var word = (this.words[i] << shift) | carry;

      res[position++] = word & 0xff;
      if (position < res.length) {
        res[position++] = (word >> 8) & 0xff;
      }
      if (position < res.length) {
        res[position++] = (word >> 16) & 0xff;
      }

      if (shift === 6) {
        if (position < res.length) {
          res[position++] = (word >> 24) & 0xff;
        }
        carry = 0;
        shift = 0;
      } else {
        carry = word >>> 24;
        shift += 2;
      }
    }

    if (position < res.length) {
      res[position++] = carry;

      while (position < res.length) {
        res[position++] = 0;
      }
    }
  };

  BN.prototype._toArrayLikeBE = function _toArrayLikeBE (res, byteLength) {
    var position = res.length - 1;
    var carry = 0;

    for (var i = 0, shift = 0; i < this.length; i++) {
      var word = (this.words[i] << shift) | carry;

      res[position--] = word & 0xff;
      if (position >= 0) {
        res[position--] = (word >> 8) & 0xff;
      }
      if (position >= 0) {
        res[position--] = (word >> 16) & 0xff;
      }

      if (shift === 6) {
        if (position >= 0) {
          res[position--] = (word >> 24) & 0xff;
        }
        carry = 0;
        shift = 0;
      } else {
        carry = word >>> 24;
        shift += 2;
      }
    }

    if (position >= 0) {
      res[position--] = carry;

      while (position >= 0) {
        res[position--] = 0;
      }
    }
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] >>> wbit) & 0x01;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this._strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this._strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this._strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this._strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this._strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this._strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out._strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out._strip();
  }

  function jumboMulTo (self, num, out) {
    // Temporary disable, see https://github.com/indutny/bn.js/issues/211
    // var fftm = new FFTM();
    // return fftm.mulp(self, num, out);
    return bigMulTo(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out._strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this._strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this._strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this._strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) <= num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this._strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this._strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this._strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q._strip();
    }
    a._strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modrn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modrn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || (r2 === 1 && cmp === 0)) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modrn = function modrn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return isNegNum ? -acc : acc;
  };

  // WARNING: DEPRECATED
  BN.prototype.modn = function modn (num) {
    return this.modrn(num);
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    this._strip();
    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this._strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      if (r.strip !== undefined) {
        // r is a BN v4 instance
        r.strip();
      } else {
        // r is a BN v5 instance
        r._strip();
      }
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);

    move(a, a.umod(this.m)._forceRed(this));
    return a;
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})(typeof module === 'undefined' || module, this);

},{"buffer":90}],3:[function(require,module,exports){
(function (process,Buffer){(function (){
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Aes = _interopDefault(require('aes'));
var _Bn = _interopDefault(require('bn.js'));
var bs58 = _interopDefault(require('bs58'));
var elliptic = _interopDefault(require('bitcoin-elliptic'));
var hashjs = _interopDefault(require('hash.js'));
var pbkdf2 = _interopDefault(require('pbkdf2'));
var isHex = _interopDefault(require('is-hex'));
var randomBytes = _interopDefault(require('randombytes'));

var version = "2.0.7";

function Bn(n, base, ...rest) {
  if (!(this instanceof Bn)) {
    return new Bn(n, base, ...rest);
  }

  _Bn.call(this, n, base, ...rest);
}

Object.keys(_Bn).forEach(function (key) {
  Bn[key] = _Bn[key];
});
Bn.prototype = Object.create(_Bn.prototype);
Bn.prototype.constructor = Bn;

function reverseBuf(buf) {
  const buf2 = Buffer.alloc(buf.length);

  for (let i = 0; i < buf.length; i++) {
    buf2[i] = buf[buf.length - 1 - i];
  }

  return buf2;
}

Bn.prototype.fromHex = function (hex, opts) {
  return this.fromBuffer(Buffer.from(hex, 'hex'), opts);
};

Bn.prototype.toHex = function (opts) {
  return this.toBuffer(opts).toString('hex');
};

Bn.prototype.toJSON = function () {
  return this.toString();
};

Bn.prototype.fromJSON = function (str) {
  const bn = Bn(str);
  bn.copy(this);
  return this;
};

Bn.prototype.fromNumber = function (n) {
  const bn = Bn(n);
  bn.copy(this);
  return this;
};

Bn.prototype.toNumber = function () {
  return parseInt(this.toString(10), 10);
};

Bn.prototype.fromString = function (str, base) {
  const bn = Bn(str, base);
  bn.copy(this);
  return this;
};

Bn.fromBuffer = function (buf, opts = {
  endian: 'big'
}) {
  if (opts.endian === 'little') {
    buf = reverseBuf(buf);
  }

  const hex = buf.toString('hex');
  const bn = new Bn(hex, 16);
  return bn;
};

Bn.prototype.fromBuffer = function (buf, opts) {
  const bn = Bn.fromBuffer(buf, opts);
  bn.copy(this);
  return this;
};

Bn.prototype.toBuffer = function (opts = {
  size: undefined,
  endian: 'big'
}) {
  let buf;

  if (opts.size) {
    const hex = this.toString(16, 2);
    const natlen = hex.length / 2;
    buf = Buffer.from(hex, 'hex');

    if (natlen === opts.size) ; else if (natlen > opts.size) {
      buf = buf.slice(natlen - buf.length, buf.length);
    } else if (natlen < opts.size) {
      const rbuf = Buffer.alloc(opts.size);

      for (let i = 0; i < buf.length; i++) {
        rbuf[rbuf.length - 1 - i] = buf[buf.length - 1 - i];
      }

      for (let i = 0; i < opts.size - natlen; i++) {
        rbuf[i] = 0;
      }

      buf = rbuf;
    }
  } else {
    const hex = this.toString(16, 2);
    buf = Buffer.from(hex, 'hex');
  }

  if (opts.endian === 'little') {
    buf = reverseBuf(buf);
  }

  const longzero = Buffer.from([0]);

  if (Buffer.compare(buf, longzero) === 0) {
    return Buffer.from([]);
  }

  return buf;
};

Bn.prototype.toFastBuffer = Bn.prototype.toBuffer;
Bn.fromFastBuffer = Bn.fromBuffer;
Bn.prototype.fromFastBuffer = Bn.prototype.fromBuffer;

Bn.prototype.fromSm = function (buf, opts = {
  endian: 'big'
}) {
  if (buf.length === 0) {
    this.fromBuffer(Buffer.from([0]));
  }

  const endian = opts.endian;

  if (endian === 'little') {
    buf = reverseBuf(buf);
  }

  if (buf[0] & 0x80) {
    buf[0] = buf[0] & 0x7f;
    this.fromBuffer(buf);
    this.neg().copy(this);
  } else {
    this.fromBuffer(buf);
  }

  return this;
};

Bn.prototype.toSm = function (opts = {
  endian: 'big'
}) {
  const endian = opts.endian;
  let buf;

  if (this.cmp(0) === -1) {
    buf = this.neg().toBuffer();

    if (buf[0] & 0x80) {
      buf = Buffer.concat([Buffer.from([0x80]), buf]);
    } else {
      buf[0] = buf[0] | 0x80;
    }
  } else {
    buf = this.toBuffer();

    if (buf[0] & 0x80) {
      buf = Buffer.concat([Buffer.from([0x00]), buf]);
    }
  }

  if (buf.length === 1 & buf[0] === 0) {
    buf = Buffer.from([]);
  }

  if (endian === 'little') {
    buf = reverseBuf(buf);
  }

  return buf;
};

Bn.prototype.fromBits = function (bits, opts = {
  strict: false
}) {
  let buf = Buffer.alloc(4);
  buf.writeUInt32BE(bits, 0);
  bits = buf.readInt32BE(0);

  if (opts.strict && bits & 0x00800000) {
    throw new Error('negative bit set');
  }

  const nsize = bits >> 24;
  const nword = bits & 0x007fffff;
  buf = Buffer.alloc(4);
  buf.writeInt32BE(nword);

  if (nsize <= 3) {
    buf = buf.slice(1, nsize + 1);
  } else {
    const fill = Buffer.alloc(nsize - 3);
    fill.fill(0);
    buf = Buffer.concat([buf, fill]);
  }

  this.fromBuffer(buf);

  if (bits & 0x00800000) {
    Bn(0).sub(this).copy(this);
  }

  return this;
};

Bn.prototype.toBits = function () {
  let buf;

  if (this.lt(0)) {
    buf = this.neg().toBuffer();
  } else {
    buf = this.toBuffer();
  }

  let nsize = buf.length;
  let nword;

  if (nsize > 3) {
    nword = Buffer.concat([Buffer.from([0]), buf.slice(0, 3)]).readUInt32BE(0);
  } else if (nsize <= 3) {
    const blank = Buffer.alloc(3 - nsize + 1);
    blank.fill(0);
    nword = Buffer.concat([blank, buf.slice(0, nsize)]).readUInt32BE(0);
  }

  if (nword & 0x00800000) {
    nword >>= 8;
    nsize++;
  }

  if (this.lt(0)) {
    nword |= 0x00800000;
  }

  const bits = nsize << 24 | nword;
  buf = Buffer.alloc(4);
  buf.writeInt32BE(bits, 0);
  return buf.readUInt32BE(0);
};

Bn.prototype.fromScriptNumBuffer = function (buf, fRequireMinimal, nMaxNumSize) {
  if (nMaxNumSize === undefined) {
    nMaxNumSize = 4;
  }

  if (buf.length > nMaxNumSize) {
    throw new Error('script number overflow');
  }

  if (fRequireMinimal && buf.length > 0) {
    if ((buf[buf.length - 1] & 0x7f) === 0) {
      if (buf.length <= 1 || (buf[buf.length - 2] & 0x80) === 0) {
        throw new Error('non-minimally encoded script number');
      }
    }
  }

  return this.fromSm(buf, {
    endian: 'little'
  });
};

Bn.prototype.toScriptNumBuffer = function (buf) {
  return this.toSm({
    endian: 'little'
  });
};

Bn.prototype.neg = function () {
  const _neg = _Bn.prototype.neg.call(this);

  const neg = Object.create(Bn.prototype);

  _neg.copy(neg);

  return neg;
};

Bn.prototype.add = function (bn) {
  const _bn = _Bn.prototype.add.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.sub = function (bn) {
  const _bn = _Bn.prototype.sub.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.mul = function (bn) {
  const _bn = _Bn.prototype.mul.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.mod = function (bn) {
  const _bn = _Bn.prototype.mod.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.umod = function (bn) {
  const _bn = _Bn.prototype.umod.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.invm = function (bn) {
  const _bn = _Bn.prototype.invm.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.div = function (bn) {
  const _bn = _Bn.prototype.div.call(this, bn);

  bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.ushln = function (bits) {
  const _bn = _Bn.prototype.ushln.call(this, bits);

  const bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.ushrn = function (bits) {
  const _bn = _Bn.prototype.ushrn.call(this, bits);

  const bn = Object.create(Bn.prototype);

  _bn.copy(bn);

  return bn;
};

Bn.prototype.cmp = function (bn) {
  return _Bn.prototype.cmp.call(this, bn);
};

function decorate(name) {
  Bn.prototype['_' + name] = Bn.prototype[name];

  const f = function (b) {
    if (typeof b === 'string') {
      b = new Bn(b);
    } else if (typeof b === 'number') {
      b = new Bn(b.toString());
    }

    return this['_' + name](b);
  };

  Bn.prototype[name] = f;
}

Bn.prototype.eq = function (b) {
  return this.cmp(b) === 0;
};

Bn.prototype.neq = function (b) {
  return this.cmp(b) !== 0;
};

Bn.prototype.gt = function (b) {
  return this.cmp(b) > 0;
};

Bn.prototype.geq = function (b) {
  return this.cmp(b) >= 0;
};

Bn.prototype.lt = function (b) {
  return this.cmp(b) < 0;
};

Bn.prototype.leq = function (b) {
  return this.cmp(b) <= 0;
};

decorate('add');
decorate('sub');
decorate('mul');
decorate('mod');
decorate('invm');
decorate('div');
decorate('cmp');
decorate('gt');
decorate('geq');
decorate('lt');
decorate('leq');

class Br {
  constructor(buf) {
    this.fromObject({
      buf
    });
  }

  fromObject(obj) {
    this.buf = obj.buf || this.buf || undefined;
    this.pos = obj.pos || this.pos || 0;
    return this;
  }

  eof() {
    return this.pos >= this.buf.length;
  }

  read(len = this.buf.length) {
    const buf = this.buf.slice(this.pos, this.pos + len);
    this.pos = this.pos + len;
    return buf;
  }

  readReverse(len = this.buf.length) {
    const buf = this.buf.slice(this.pos, this.pos + len);
    this.pos = this.pos + len;
    const buf2 = Buffer.alloc(buf.length);

    for (let i = 0; i < buf2.length; i++) {
      buf2[i] = buf[buf.length - 1 - i];
    }

    return buf2;
  }

  readUInt8() {
    const val = this.buf.readUInt8(this.pos);
    this.pos = this.pos + 1;
    return val;
  }

  readInt8() {
    const val = this.buf.readInt8(this.pos);
    this.pos = this.pos + 1;
    return val;
  }

  readUInt16BE() {
    const val = this.buf.readUInt16BE(this.pos);
    this.pos = this.pos + 2;
    return val;
  }

  readInt16BE() {
    const val = this.buf.readInt16BE(this.pos);
    this.pos = this.pos + 2;
    return val;
  }

  readUInt16LE() {
    const val = this.buf.readUInt16LE(this.pos);
    this.pos = this.pos + 2;
    return val;
  }

  readInt16LE() {
    const val = this.buf.readInt16LE(this.pos);
    this.pos = this.pos + 2;
    return val;
  }

  readUInt32BE() {
    const val = this.buf.readUInt32BE(this.pos);
    this.pos = this.pos + 4;
    return val;
  }

  readInt32BE() {
    const val = this.buf.readInt32BE(this.pos);
    this.pos = this.pos + 4;
    return val;
  }

  readUInt32LE() {
    const val = this.buf.readUInt32LE(this.pos);
    this.pos = this.pos + 4;
    return val;
  }

  readInt32LE() {
    const val = this.buf.readInt32LE(this.pos);
    this.pos = this.pos + 4;
    return val;
  }

  readUInt64BEBn() {
    const buf = this.buf.slice(this.pos, this.pos + 8);
    const bn = new Bn().fromBuffer(buf);
    this.pos = this.pos + 8;
    return bn;
  }

  readUInt64LEBn() {
    const buf = this.readReverse(8);
    const bn = new Bn().fromBuffer(buf);
    return bn;
  }

  readVarIntNum() {
    const first = this.readUInt8();
    let bn, n;

    switch (first) {
      case 0xfd:
        return this.readUInt16LE();

      case 0xfe:
        return this.readUInt32LE();

      case 0xff:
        bn = this.readUInt64LEBn();
        n = bn.toNumber();

        if (n <= Math.pow(2, 53)) {
          return n;
        } else {
          throw new Error('number too large to retain precision - use readVarIntBn');
        }

      default:
        return first;
    }
  }

  readVarIntBuf() {
    const first = this.buf.readUInt8(this.pos);

    switch (first) {
      case 0xfd:
        return this.read(1 + 2);

      case 0xfe:
        return this.read(1 + 4);

      case 0xff:
        return this.read(1 + 8);

      default:
        return this.read(1);
    }
  }

  readVarIntBn() {
    const first = this.readUInt8();

    switch (first) {
      case 0xfd:
        return new Bn(this.readUInt16LE());

      case 0xfe:
        return new Bn(this.readUInt32LE());

      case 0xff:
        return this.readUInt64LEBn();

      default:
        return new Bn(first);
    }
  }

}

class Bw {
  constructor(bufs) {
    this.fromObject({
      bufs
    });
  }

  fromObject(obj) {
    this.bufs = obj.bufs || this.bufs || [];
    return this;
  }

  getLength() {
    let len = 0;

    for (const i in this.bufs) {
      const buf = this.bufs[i];
      len = len + buf.length;
    }

    return len;
  }

  toBuffer() {
    return Buffer.concat(this.bufs);
  }

  write(buf) {
    this.bufs.push(buf);
    return this;
  }

  writeReverse(buf) {
    const buf2 = Buffer.alloc(buf.length);

    for (let i = 0; i < buf2.length; i++) {
      buf2[i] = buf[buf.length - 1 - i];
    }

    this.bufs.push(buf2);
    return this;
  }

  writeUInt8(n) {
    const buf = Buffer.alloc(1);
    buf.writeUInt8(n, 0);
    this.write(buf);
    return this;
  }

  writeInt8(n) {
    const buf = Buffer.alloc(1);
    buf.writeInt8(n, 0);
    this.write(buf);
    return this;
  }

  writeUInt16BE(n) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16BE(n, 0);
    this.write(buf);
    return this;
  }

  writeInt16BE(n) {
    const buf = Buffer.alloc(2);
    buf.writeInt16BE(n, 0);
    this.write(buf);
    return this;
  }

  writeUInt16LE(n) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(n, 0);
    this.write(buf);
    return this;
  }

  writeInt16LE(n) {
    const buf = Buffer.alloc(2);
    buf.writeInt16LE(n, 0);
    this.write(buf);
    return this;
  }

  writeUInt32BE(n) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(n, 0);
    this.write(buf);
    return this;
  }

  writeInt32BE(n) {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(n, 0);
    this.write(buf);
    return this;
  }

  writeUInt32LE(n) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(n, 0);
    this.write(buf);
    return this;
  }

  writeInt32LE(n) {
    const buf = Buffer.alloc(4);
    buf.writeInt32LE(n, 0);
    this.write(buf);
    return this;
  }

  writeUInt64BEBn(bn) {
    const buf = bn.toBuffer({
      size: 8
    });
    this.write(buf);
    return this;
  }

  writeUInt64LEBn(bn) {
    const buf = bn.toBuffer({
      size: 8
    });
    this.writeReverse(buf);
    return this;
  }

  writeVarIntNum(n) {
    const buf = Bw.varIntBufNum(n);
    this.write(buf);
    return this;
  }

  writeVarIntBn(bn) {
    const buf = Bw.varIntBufBn(bn);
    this.write(buf);
    return this;
  }

  static varIntBufNum(n) {
    let buf;

    if (n < 253) {
      buf = Buffer.alloc(1);
      buf.writeUInt8(n, 0);
    } else if (n < 0x10000) {
      buf = Buffer.alloc(1 + 2);
      buf.writeUInt8(253, 0);
      buf.writeUInt16LE(n, 1);
    } else if (n < 0x100000000) {
      buf = Buffer.alloc(1 + 4);
      buf.writeUInt8(254, 0);
      buf.writeUInt32LE(n, 1);
    } else {
      buf = Buffer.alloc(1 + 8);
      buf.writeUInt8(255, 0);
      buf.writeInt32LE(n & -1, 1);
      buf.writeUInt32LE(Math.floor(n / 0x100000000), 5);
    }

    return buf;
  }

  static varIntBufBn(bn) {
    let buf;
    const n = bn.toNumber();

    if (n < 253) {
      buf = Buffer.alloc(1);
      buf.writeUInt8(n, 0);
    } else if (n < 0x10000) {
      buf = Buffer.alloc(1 + 2);
      buf.writeUInt8(253, 0);
      buf.writeUInt16LE(n, 1);
    } else if (n < 0x100000000) {
      buf = Buffer.alloc(1 + 4);
      buf.writeUInt8(254, 0);
      buf.writeUInt32LE(n, 1);
    } else {
      const bw = new Bw();
      bw.writeUInt8(255);
      bw.writeUInt64LEBn(bn);
      buf = bw.toBuffer();
    }

    return buf;
  }

}

class Struct {
  constructor(obj) {
    this.fromObject(obj);
  }

  fromObject(obj) {
    if (!obj) {
      return this;
    }

    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        this[key] = obj[key];
      }
    }

    return this;
  }

  static fromObject(obj) {
    return new this().fromObject(obj);
  }

  fromBr(br) {
    if (!(br instanceof Br)) {
      throw new Error('br must be a buffer reader');
    }

    throw new Error('not implemented');
  }

  static fromBr(br) {
    return new this().fromBr(br);
  }

  asyncFromBr(br) {
    if (!(br instanceof Br)) {
      throw new Error('br must be a buffer reader');
    }

    throw new Error('not implemented');
  }

  static asyncFromBr(br) {
    return new this().asyncFromBr(br);
  }

  toBw(bw) {
    throw new Error('not implemented');
  }

  asyncToBw(bw) {
    throw new Error('not implemented');
  }

  genFromBuffers() {
    return /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            throw new Error('not implemented');

          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })();
  }

  expect(len, startbuf) {
    return /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var buf, bw, gotlen, remainderlen, overlen, remainderbuf;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            buf = startbuf;
            bw = new Bw();
            gotlen = 0;

            if (startbuf) {
              bw.write(startbuf);
              gotlen += startbuf.length;
            }

          case 4:
            if (!(gotlen < len)) {
              _context2.next = 15;
              break;
            }

            remainderlen = len - gotlen;
            _context2.next = 8;
            return remainderlen;

          case 8:
            buf = _context2.sent;

            if (buf) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("continue", 4);

          case 11:
            bw.write(buf);
            gotlen += buf.length;
            _context2.next = 4;
            break;

          case 15:
            buf = bw.toBuffer();
            overlen = gotlen - len;
            remainderbuf = buf.slice(buf.length - overlen, buf.length);
            buf = buf.slice(0, buf.length - overlen);
            return _context2.abrupt("return", {
              buf: buf,
              remainderbuf: remainderbuf
            });

          case 20:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })();
  }

  fromBuffer(buf, ...rest) {
    if (!Buffer.isBuffer(buf)) {
      throw new Error('buf must be a buffer');
    }

    const br = new Br(buf);
    return this.fromBr(br, ...rest);
  }

  static fromBuffer(...rest) {
    return new this().fromBuffer(...rest);
  }

  asyncFromBuffer(buf, ...rest) {
    if (!Buffer.isBuffer(buf)) {
      throw new Error('buf must be a buffer');
    }

    const br = new Br(buf);
    return this.asyncFromBr(br, ...rest);
  }

  static asyncFromBuffer(buf, ...rest) {
    return new this().asyncFromBuffer(buf, ...rest);
  }

  fromFastBuffer(buf, ...rest) {
    if (buf.length === 0) {
      return this;
    } else {
      return this.fromBuffer(buf, ...rest);
    }
  }

  static fromFastBuffer(...rest) {
    return new this().fromFastBuffer(...rest);
  }

  toBuffer(...rest) {
    return this.toBw(...rest).toBuffer();
  }

  asyncToBuffer(...rest) {
    return this.asyncToBw(...rest).then(bw => bw.toBuffer());
  }

  toFastBuffer(...rest) {
    if (Object.keys(this).length === 0) {
      return Buffer.alloc(0);
    } else {
      return this.toBuffer(...rest);
    }
  }

  fromHex(hex, ...rest) {
    if (!isHex(hex)) {
      throw new Error('invalid hex string');
    }

    const buf = Buffer.from(hex, 'hex');
    return this.fromBuffer(buf, ...rest);
  }

  static fromHex(hex, ...rest) {
    return new this().fromHex(hex, ...rest);
  }

  asyncFromHex(hex, ...rest) {
    if (!isHex(hex)) {
      throw new Error('invalid hex string');
    }

    const buf = Buffer.from(hex, 'hex');
    return this.asyncFromBuffer(buf, ...rest);
  }

  static asyncFromHex(hex, ...rest) {
    return new this().asyncFromHex(hex, ...rest);
  }

  fromFastHex(hex, ...rest) {
    if (!isHex(hex)) {
      throw new Error('invalid hex string');
    }

    const buf = Buffer.from(hex, 'hex');
    return this.fromFastBuffer(buf, ...rest);
  }

  static fromFastHex(hex, ...rest) {
    return new this().fromFastHex(hex, ...rest);
  }

  toHex(...rest) {
    return this.toBuffer(...rest).toString('hex');
  }

  asyncToHex(...rest) {
    return this.asyncToBuffer(...rest).then(buf => buf.toString('hex'));
  }

  toFastHex(...rest) {
    return this.toFastBuffer(...rest).toString('hex');
  }

  fromString(str, ...rest) {
    if (typeof str !== 'string') {
      throw new Error('str must be a string');
    }

    return this.fromHex(str, ...rest);
  }

  static fromString(str, ...rest) {
    return new this().fromString(str, ...rest);
  }

  asyncFromString(str, ...rest) {
    if (typeof str !== 'string') {
      throw new Error('str must be a string');
    }

    return this.asyncFromHex(str, ...rest);
  }

  static asyncFromString(str, ...rest) {
    return new this().asyncFromString(str, ...rest);
  }

  toString(...rest) {
    return this.toHex(...rest);
  }

  asyncToString(...rest) {
    return this.asyncToHex(...rest);
  }

  fromJSON(json) {
    throw new Error('not implemented');
  }

  static fromJSON(json, ...rest) {
    return new this().fromJSON(json, ...rest);
  }

  asyncFromJSON(json, ...rest) {
    throw new Error('not implemented');
  }

  static asyncFromJSON(json, ...rest) {
    return new this().asyncFromJSON(json, ...rest);
  }

  toJSON() {
    var json = {};

    for (var val in this) {
      if (Array.isArray(this[val])) {
        const arr = [];

        for (var i in this[val]) {
          if (typeof this[val][i].toJSON === 'function') {
            arr.push(this[val][i].toJSON());
          } else {
            arr.push(JSON.stringify(this[val][i]));
          }
        }

        json[val] = arr;
      } else if (this[val] === null) {
        json[val] = this[val];
      } else if (typeof this[val] === 'object' && typeof this[val].toJSON === 'function') {
        json[val] = this[val].toJSON();
      } else if (typeof this[val] === 'boolean' || typeof this[val] === 'number' || typeof this[val] === 'string') {
        json[val] = this[val];
      } else if (Buffer.isBuffer(this[val])) {
        json[val] = this[val].toString('hex');
      } else if (this[val] instanceof Map) {
        json[val] = JSON.stringify(this[val]);
      } else if (typeof this[val] === 'object') {
        throw new Error('not implemented');
      }
    }

    return json;
  }

  asyncToJSON() {
    throw new Error('not implemented');
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

class Base58 extends Struct {
  constructor(buf) {
    super({
      buf
    });
  }

  fromHex(hex) {
    return this.fromBuffer(Buffer.from(hex, 'hex'));
  }

  toHex() {
    return this.toBuffer().toString('hex');
  }

  static encode(buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new Error('Input should be a buffer');
    }

    return bs58.encode(buf);
  }

  static decode(str) {
    if (typeof str !== 'string') {
      throw new Error('Input should be a string');
    }

    return Buffer.from(bs58.decode(str));
  }

  fromBuffer(buf) {
    this.buf = buf;
    return this;
  }

  fromString(str) {
    const buf = Base58.decode(str);
    this.buf = buf;
    return this;
  }

  toBuffer() {
    return this.buf;
  }

  toString() {
    return Base58.encode(this.buf);
  }

}

const cmp = (buf1, buf2) => {
  if (!Buffer.isBuffer(buf1) || !Buffer.isBuffer(buf2)) {
    throw new Error('buf1 and buf2 must be buffers');
  }

  if (buf1.length !== buf2.length) {
    return false;
  }

  let d = 0;

  for (let i = 0; i < buf1.length; i++) {
    const x = buf1[i];
    const y = buf2[i];
    d |= x ^ y;
  }

  return d === 0;
};

class WorkersResult extends Struct {
  constructor(resbuf, isError, id) {
    super({
      resbuf,
      isError,
      id
    });
  }

  fromResult(result, id) {
    if (result.toFastBuffer) {
      this.resbuf = result.toFastBuffer();
    } else if (Buffer.isBuffer(result)) {
      this.resbuf = result;
    } else {
      this.resbuf = Buffer.from(JSON.stringify(result));
    }

    this.isError = false;
    this.id = id;
    return this;
  }

  static fromResult(result, id) {
    return new this().fromResult(result, id);
  }

  fromError(error, id) {
    this.resbuf = Buffer.from(JSON.stringify(error.message));
    this.isError = true;
    this.id = id;
    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    bw.writeVarIntNum(this.resbuf.length);
    bw.write(this.resbuf);
    bw.writeUInt8(Number(this.isError));
    bw.writeVarIntNum(this.id);
    return bw;
  }

  fromBr(br) {
    const resbuflen = br.readVarIntNum();
    this.resbuf = br.read(resbuflen);
    this.isError = Boolean(br.readUInt8());
    this.id = br.readVarIntNum();
    return this;
  }

}

let globalWorkers;

class Workers {
  constructor(nativeWorkers = [], lastid = 0, incompconsteRes = [], promisemap = new Map()) {
    this.nativeWorkers = nativeWorkers;
    this.lastid = lastid;
    this.incompconsteRes = incompconsteRes;
    this.promisemap = promisemap;
  }

  asyncObjectMethod(obj, methodname, args, id = this.lastid + 1) {
    if (!args) {
      throw new Error('must specify args');
    }

    const result = obj[methodname](...args);
    const workersResult = new WorkersResult().fromResult(result, id);
    return workersResult;
  }

  static asyncObjectMethod(obj, methodname, args, id) {
    if (!globalWorkers) {
      globalWorkers = new Workers();
    }

    return globalWorkers.asyncObjectMethod(obj, methodname, args, id);
  }

  asyncClassMethod(classObj, methodname, args, id = this.lastid + 1) {
    if (!args) {
      throw new Error('must specify args');
    }

    const result = classObj[methodname](...args);
    const workersResult = new WorkersResult().fromResult(result, id);
    return workersResult;
  }

  static asyncClassMethod(classObj, methodname, args, id) {
    if (!globalWorkers) {
      globalWorkers = new Workers();
    }

    return globalWorkers.asyncClassMethod(classObj, methodname, args, id);
  }

  static endGlobalWorkers() {
    if (globalWorkers && !process.browser) {
      globalWorkers = undefined;
    }
  }

}

class Hash {}

Hash.sha1 = function (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('sha1 hash must be of a buffer');
  }

  const Sha1 = hashjs.sha1;
  const hash = new Sha1().update(buf).digest();
  return Buffer.from(hash);
};

Hash.sha1.blockSize = 512;

Hash.asyncSha1 = function (buf) {
  try {
    const args = [buf];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha1', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha256 = function (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('sha256 hash must be of a buffer');
  }

  const Sha256 = hashjs.sha256;
  const hash = new Sha256().update(buf).digest();
  return Buffer.from(hash);
};

Hash.sha256.blockSize = 512;

Hash.asyncSha256 = function (buf) {
  try {
    const args = [buf];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha256', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha256Sha256 = function (buf) {
  try {
    return Hash.sha256(Hash.sha256(buf));
  } catch (e) {
    throw new Error('sha256Sha256 hash must be of a buffer: ' + e);
  }
};

Hash.asyncSha256Sha256 = function (buf) {
  try {
    const args = [buf];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha256Sha256', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.ripemd160 = function (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('ripemd160 hash must be of a buffer');
  }

  const Ripemd160 = hashjs.ripemd160;
  const hash = new Ripemd160().update(buf).digest();
  return Buffer.from(hash);
};

Hash.asyncRipemd160 = function (buf) {
  try {
    const args = [buf];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'ripemd160', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha256Ripemd160 = function (buf) {
  try {
    return Hash.ripemd160(Hash.sha256(buf));
  } catch (e) {
    throw new Error('sha256Ripemd160 hash must be of a buffer: ' + e);
  }
};

Hash.asyncSha256Ripemd160 = function (buf) {
  try {
    const args = [buf];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha256Ripemd160', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha512 = function (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new Error('sha512 hash must be of a buffer');
  }

  const Sha512 = hashjs.sha512;
  const hash = new Sha512().update(buf).digest();
  return Buffer.from(hash);
};

Hash.asyncSha512 = function (buf) {
  try {
    const args = [buf];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha512', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha512.blockSize = 1024;

Hash.hmac = function (hashFStr, data, key) {
  if (hashFStr !== 'sha1' && hashFStr !== 'sha256' && hashFStr !== 'sha512') {
    throw new Error('invalid choice of hash function');
  }

  const hashf = Hash[hashFStr];

  if (!Buffer.isBuffer(data) || !Buffer.isBuffer(key)) {
    throw new Error('data and key must be buffers');
  }

  const blockSize = hashf.blockSize / 8;

  if (key.length > blockSize) {
    key = hashf(key);
  }

  if (key.length < blockSize) {
    const fill = Buffer.alloc(blockSize);
    fill.fill(0, key.length);
    key.copy(fill);
    key = fill;
  }

  const oKeyPad = Buffer.alloc(blockSize);
  const iKeyPad = Buffer.alloc(blockSize);

  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = 0x5c ^ key[i];
    iKeyPad[i] = 0x36 ^ key[i];
  }

  return hashf(Buffer.concat([oKeyPad, hashf(Buffer.concat([iKeyPad, data]))]));
};

Hash.sha1Hmac = function (data, key) {
  return Hash.hmac('sha1', data, key);
};

Hash.asyncSha1Hmac = function (data, key) {
  try {
    const args = [data, key];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha1Hmac', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha1Hmac.bitsize = 160;

Hash.sha256Hmac = function (data, key) {
  return Hash.hmac('sha256', data, key);
};

Hash.asyncSha256Hmac = function (data, key) {
  try {
    const args = [data, key];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha256Hmac', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha256Hmac.bitsize = 256;

Hash.sha512Hmac = function (data, key) {
  return Hash.hmac('sha512', data, key);
};

Hash.asyncSha512Hmac = function (data, key) {
  try {
    const args = [data, key];
    return Promise.resolve(Workers.asyncClassMethod(Hash, 'sha512Hmac', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Hash.sha512Hmac.bitsize = 512;

class Base58Check extends Struct {
  constructor(buf) {
    super({
      buf
    });
  }

  fromHex(hex) {
    return this.fromBuffer(Buffer.from(hex, 'hex'));
  }

  toHex() {
    return this.toBuffer().toString('hex');
  }

  static decode(s) {
    if (typeof s !== 'string') {
      throw new Error('Input must be a string');
    }

    const buf = Base58.decode(s);

    if (buf.length < 4) {
      throw new Error('Input string too short');
    }

    const data = buf.slice(0, -4);
    const csum = buf.slice(-4);
    const hash = Hash.sha256Sha256(data);
    const hash4 = hash.slice(0, 4);

    if (!cmp(csum, hash4)) {
      throw new Error('Checksum mismatch');
    }

    return data;
  }

  static encode(buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new Error('Input must be a buffer');
    }

    const checkedBuf = Buffer.alloc(buf.length + 4);
    const hash = Hash.sha256Sha256(buf);
    buf.copy(checkedBuf);
    hash.copy(checkedBuf, buf.length);
    return Base58.encode(checkedBuf);
  }

  fromBuffer(buf) {
    this.buf = buf;
    return this;
  }

  fromString(str) {
    const buf = Base58Check.decode(str);
    this.buf = buf;
    return this;
  }

  toBuffer() {
    return this.buf;
  }

  toString() {
    return Base58Check.encode(this.buf);
  }

}

class Config {
  constructor(values) {
    this.keyDefined = key => key in values;

    this.getValue = key => values[key];
  }

  get(key) {
    if (this.keyDefined(key)) {
      return this.getValue(key);
    } else {
      throw new Error(`Unknown configuration: ${key}`);
    }
  }

}

class ConfigBuilder {
  constructor() {
    this.variables = {};
  }

  build() {
    return new Config(this.variables);
  }

  addValue(key, value) {
    if (value === undefined) {
      throw new Error(`Failed to add "${key}" property. The value cannot be undefined`);
    }

    if (key in this.variables) {
      throw new Error(`"${key}" already has a value defined.`);
    }

    this.variables[key] = value;
    return this;
  }

  addValueWithDefault(key, value, defaultValue) {
    if (defaultValue === undefined) {
      throw new Error(`Failed to add "${key}" property. Default value cannot be undefined`);
    }

    return this.addValue(key, value === undefined ? defaultValue : value);
  }

}

const config = new ConfigBuilder().addValue('NETWORK', process.env.NETWORK || 'mainnet').build();

const Constants = {};
Constants.Mainnet = {
  MaxSize: 0x02000000,
  Port: 8333,
  Address: {
    pubKeyHash: 0x00,
    payToScriptHash: 0x05
  },
  Bip32: {
    pubKey: 0x0488b21e,
    privKey: 0x0488ade4
  },
  Block: {
    maxNBits: 0x1d00ffff,
    magicNum: 0xe3e1f3e8
  },
  Msg: {
    magicNum: 0xe3e1f3e8,
    versionBytesNum: 70015
  },
  PrivKey: {
    versionByteNum: 0x80
  },
  TxBuilder: {
    dust: 546,
    feePerKbNum: 0.00000500e8
  },
  Workers: {
    timeout: 60000
  }
};
Constants.Testnet = Object.assign({}, Constants.Mainnet, {
  Port: 18333,
  Address: {
    pubKeyHash: 0x6f,
    payToScriptHash: 0xc4
  },
  Bip32: {
    pubKey: 0x043587cf,
    privKey: 0x04358394
  },
  Block: {
    maxNBits: 0x1d00ffff,
    magicNum: 0xf4e5f3f4
  },
  Msg: {
    magicNum: 0xf4e5f3f4,
    versionBytesNum: 70015
  },
  PrivKey: {
    versionByteNum: 0xef
  }
});
Constants.Regtest = Object.assign({}, Constants.Mainnet, {
  Port: 18444,
  Address: {
    pubKeyHash: 0x6f,
    payToScriptHash: 0xc4
  },
  Bip32: {
    pubKey: 0x043587cf,
    privKey: 0x04358394
  },
  Block: {
    maxNBits: 0x207fffff,
    magicNum: 0xdab5bffa
  },
  Msg: {
    magicNum: 0xdab5bffa,
    versionBytesNum: 70015
  },
  PrivKey: {
    versionByteNum: 0xef
  }
});
Constants.STN = Object.assign({}, Constants.Mainnet, {
  Port: 9333,
  Address: {
    pubKeyHash: 0x6f,
    payToScriptHash: 0xc4
  },
  Bip32: {
    pubKey: 0x043587cf,
    privKey: 0x04358394
  },
  Block: {
    maxNBits: 0x1d00ffff,
    magicNum: 0xfbcec4f9
  },
  Msg: {
    magicNum: 0xfbcec4f9,
    versionBytesNum: 70015
  },
  PrivKey: {
    versionByteNum: 0xef
  }
});

if (config.get('NETWORK') === 'testnet') {
  Constants.Default = Object.assign({}, Constants.Testnet);
} else if (config.get('NETWORK') === 'mainnet') {
  Constants.Default = Object.assign({}, Constants.Mainnet);
} else if (config.get('NETWORK') === 'regtest') {
  Constants.Default = Object.assign({}, Constants.Regtest);
} else if (config.get('NETWORK') === 'stn') {
  Constants.Default = Object.assign({}, Constants.STN);
} else {
  throw new Error(`must set network in environment variable - mainnet, testnet, regtest or stn?, received ${config.get('NETWORK')}`);
}

const getConstants = magicNum => {
  if (Constants.Mainnet.Msg.magicNum === magicNum) {
    return Constants.Mainnet;
  } else if (Constants.Testnet.Msg.magicNum === magicNum) {
    return Constants.Testnet;
  } else if (Constants.Regtest.Msg.magicNum === magicNum) {
    return Constants.Regtest;
  } else if (Constants.STN.Msg.magicNum === magicNum) {
    return Constants.STN;
  } else {
    return Constants.Default;
  }
};

const map = {
  OP_FALSE: 0x00,
  OP_0: 0x00,
  OP_PUSHDATA1: 0x4c,
  OP_PUSHDATA2: 0x4d,
  OP_PUSHDATA4: 0x4e,
  OP_1NEGATE: 0x4f,
  OP_RESERVED: 0x50,
  OP_TRUE: 0x51,
  OP_1: 0x51,
  OP_2: 0x52,
  OP_3: 0x53,
  OP_4: 0x54,
  OP_5: 0x55,
  OP_6: 0x56,
  OP_7: 0x57,
  OP_8: 0x58,
  OP_9: 0x59,
  OP_10: 0x5a,
  OP_11: 0x5b,
  OP_12: 0x5c,
  OP_13: 0x5d,
  OP_14: 0x5e,
  OP_15: 0x5f,
  OP_16: 0x60,
  OP_NOP: 0x61,
  OP_VER: 0x62,
  OP_IF: 0x63,
  OP_NOTIF: 0x64,
  OP_VERIF: 0x65,
  OP_VERNOTIF: 0x66,
  OP_ELSE: 0x67,
  OP_ENDIF: 0x68,
  OP_VERIFY: 0x69,
  OP_RETURN: 0x6a,
  OP_TOALTSTACK: 0x6b,
  OP_FROMALTSTACK: 0x6c,
  OP_2DROP: 0x6d,
  OP_2DUP: 0x6e,
  OP_3DUP: 0x6f,
  OP_2OVER: 0x70,
  OP_2ROT: 0x71,
  OP_2SWAP: 0x72,
  OP_IFDUP: 0x73,
  OP_DEPTH: 0x74,
  OP_DROP: 0x75,
  OP_DUP: 0x76,
  OP_NIP: 0x77,
  OP_OVER: 0x78,
  OP_PICK: 0x79,
  OP_ROLL: 0x7a,
  OP_ROT: 0x7b,
  OP_SWAP: 0x7c,
  OP_TUCK: 0x7d,
  OP_CAT: 0x7e,
  OP_SUBSTR: 0x7f,
  OP_SPLIT: 0x7f,
  OP_LEFT: 0x80,
  OP_NUM2BIN: 0x80,
  OP_RIGHT: 0x81,
  OP_BIN2NUM: 0x81,
  OP_SIZE: 0x82,
  OP_INVERT: 0x83,
  OP_AND: 0x84,
  OP_OR: 0x85,
  OP_XOR: 0x86,
  OP_EQUAL: 0x87,
  OP_EQUALVERIFY: 0x88,
  OP_RESERVED1: 0x89,
  OP_RESERVED2: 0x8a,
  OP_1ADD: 0x8b,
  OP_1SUB: 0x8c,
  OP_2MUL: 0x8d,
  OP_2DIV: 0x8e,
  OP_NEGATE: 0x8f,
  OP_ABS: 0x90,
  OP_NOT: 0x91,
  OP_0NOTEQUAL: 0x92,
  OP_ADD: 0x93,
  OP_SUB: 0x94,
  OP_MUL: 0x95,
  OP_DIV: 0x96,
  OP_MOD: 0x97,
  OP_LSHIFT: 0x98,
  OP_RSHIFT: 0x99,
  OP_BOOLAND: 0x9a,
  OP_BOOLOR: 0x9b,
  OP_NUMEQUAL: 0x9c,
  OP_NUMEQUALVERIFY: 0x9d,
  OP_NUMNOTEQUAL: 0x9e,
  OP_LESSTHAN: 0x9f,
  OP_GREATERTHAN: 0xa0,
  OP_LESSTHANOREQUAL: 0xa1,
  OP_GREATERTHANOREQUAL: 0xa2,
  OP_MIN: 0xa3,
  OP_MAX: 0xa4,
  OP_WITHIN: 0xa5,
  OP_RIPEMD160: 0xa6,
  OP_SHA1: 0xa7,
  OP_SHA256: 0xa8,
  OP_HASH160: 0xa9,
  OP_HASH256: 0xaa,
  OP_CODESEPARATOR: 0xab,
  OP_CHECKSIG: 0xac,
  OP_CHECKSIGVERIFY: 0xad,
  OP_CHECKMULTISIG: 0xae,
  OP_CHECKMULTISIGVERIFY: 0xaf,
  OP_NOP1: 0xb0,
  OP_NOP2: 0xb1,
  OP_CHECKLOCKTIMEVERIFY: 0xb1,
  OP_NOP3: 0xb2,
  OP_CHECKSEQUENCEVERIFY: 0xb2,
  OP_NOP4: 0xb3,
  OP_NOP5: 0xb4,
  OP_NOP6: 0xb5,
  OP_NOP7: 0xb6,
  OP_NOP8: 0xb7,
  OP_NOP9: 0xb8,
  OP_NOP10: 0xb9,
  OP_SMALLDATA: 0xf9,
  OP_SMALLINTEGER: 0xfa,
  OP_PUBKEYS: 0xfb,
  OP_PUBKEYHASH: 0xfd,
  OP_PUBKEY: 0xfe,
  OP_INVALIDOPCODE: 0xff
};

class OpCode extends Struct {
  constructor(num) {
    super({
      num
    });
  }

  fromNumber(num) {
    this.num = num;
    return this;
  }

  static fromNumber(num) {
    return new this().fromNumber(num);
  }

  toNumber() {
    return this.num;
  }

  fromString(str) {
    const num = map[str];

    if (num === undefined) {
      throw new Error('Invalid opCodeStr');
    }

    this.num = num;
    return this;
  }

  static fromString(str) {
    return new this().fromString(str);
  }

  toString() {
    const str = OpCode.str[this.num];

    if (str === undefined) {
      if (this.num > 0 && this.num < OpCode.OP_PUSHDATA1) {
        return this.num.toString();
      }

      throw new Error('OpCode does not have a string representation');
    }

    return str;
  }

}

OpCode.str = {};

for (const opCodeStr in map) {
  OpCode[opCodeStr] = map[opCodeStr];

  if (Object.prototype.hasOwnProperty.call(map, opCodeStr)) {
    OpCode.str[map[opCodeStr]] = opCodeStr;
  }
}

const ec = elliptic.curves.secp256k1;

const _point = ec.curve.point();

const _Point = _point.constructor;

class Point extends _Point {
  constructor(x, y, isRed) {
    super(ec.curve, x, y, isRed);
  }

  static fromX(isOdd, x) {
    const _point = ec.curve.pointFromX(x, isOdd);

    const point = Object.create(Point.prototype);
    return point.copyFrom(_point);
  }

  copyFrom(point) {
    if (!(point instanceof _Point)) {
      throw new Error('point should be an external point');
    }

    Object.keys(point).forEach(function (key) {
      this[key] = point[key];
    }.bind(this));
    return this;
  }

  add(p) {
    p = _Point.prototype.add.call(this, p);
    const point = Object.create(Point.prototype);
    return point.copyFrom(p);
  }

  mul(bn) {
    if (!bn.lt(Point.getN())) {
      throw new Error('point mul out of range');
    }

    const p = _Point.prototype.mul.call(this, bn);

    const point = Object.create(Point.prototype);
    return point.copyFrom(p);
  }

  mulAdd(bn1, point, bn2) {
    const p = _Point.prototype.mulAdd.call(this, bn1, point, bn2);

    point = Object.create(Point.prototype);
    return point.copyFrom(p);
  }

  getX() {
    const _x = _Point.prototype.getX.call(this);

    const x = Object.create(Bn.prototype);

    _x.copy(x);

    return x;
  }

  getY() {
    const _y = _Point.prototype.getY.call(this);

    const y = Object.create(Bn.prototype);

    _y.copy(y);

    return y;
  }

  fromX(isOdd, x) {
    const point = Point.fromX(isOdd, x);
    return this.copyFrom(point);
  }

  toJSON() {
    return {
      x: this.getX().toString(),
      y: this.getY().toString()
    };
  }

  fromJSON(json) {
    const x = new Bn().fromString(json.x);
    const y = new Bn().fromString(json.y);
    const point = new Point(x, y);
    return this.copyFrom(point);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  fromString(str) {
    const json = JSON.parse(str);
    const p = new Point().fromJSON(json);
    return this.copyFrom(p);
  }

  static getG() {
    const _g = ec.curve.g;
    const g = Object.create(Point.prototype);
    return g.copyFrom(_g);
  }

  static getN() {
    return new Bn(ec.curve.n.toArray());
  }

  validate() {
    const p2 = Point.fromX(this.getY().isOdd(), this.getX());

    if (!(p2.getY().cmp(this.getY()) === 0)) {
      throw new Error('Invalid y value of public key');
    }

    if (!(this.getX().gt(-1) && this.getX().lt(Point.getN())) || !(this.getY().gt(-1) && this.getY().lt(Point.getN()))) {
      throw new Error('Point does not lie on the curve');
    }

    return this;
  }

}

class PubKey extends Struct {
  constructor(point, compressed) {
    super({
      point,
      compressed
    });
  }

  fromJSON(json) {
    this.fromFastHex(json);
    return this;
  }

  toJSON() {
    return this.toFastHex();
  }

  fromPrivKey(privKey) {
    this.fromObject({
      point: Point.getG().mul(privKey.bn),
      compressed: privKey.compressed
    });
    return this;
  }

  static fromPrivKey(privKey) {
    return new this().fromPrivKey(privKey);
  }

  asyncFromPrivKey(privKey) {
    try {
      const _this = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this, 'fromPrivKey', [privKey])).then(function (workersResult) {
        return _this.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromPrivKey(privKey) {
    return new this().asyncFromPrivKey(privKey);
  }

  fromBuffer(buf, strict) {
    return this.fromDer(buf, strict);
  }

  asyncFromBuffer(buf, strict) {
    try {
      const _this2 = this;

      const args = [buf, strict];
      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'fromBuffer', args)).then(function (workersResult) {
        return _this2.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  fromFastBuffer(buf) {
    if (buf.length === 0) {
      return this;
    }

    const compressed = Boolean(buf[0]);
    buf = buf.slice(1);
    this.fromDer(buf);
    this.compressed = compressed;
    return this;
  }

  fromDer(buf, strict) {
    if (strict === undefined) {
      strict = true;
    } else {
      strict = false;
    }

    if (buf[0] === 0x04 || !strict && (buf[0] === 0x06 || buf[0] === 0x07)) {
      const xbuf = buf.slice(1, 33);
      const ybuf = buf.slice(33, 65);

      if (xbuf.length !== 32 || ybuf.length !== 32 || buf.length !== 65) {
        throw new Error('LEngth of x and y must be 32 bytes');
      }

      const x = new Bn(xbuf);
      const y = new Bn(ybuf);
      this.point = new Point(x, y);
      this.compressed = false;
    } else if (buf[0] === 0x03) {
      const xbuf = buf.slice(1);
      const x = new Bn(xbuf);
      this.fromX(true, x);
      this.compressed = true;
    } else if (buf[0] === 0x02) {
      const xbuf = buf.slice(1);
      const x = new Bn(xbuf);
      this.fromX(false, x);
      this.compressed = true;
    } else {
      throw new Error('Invalid DER format pubKey');
    }

    return this;
  }

  static fromDer(buf, strict) {
    return new this().fromDer(buf, strict);
  }

  fromString(str) {
    this.fromDer(Buffer.from(str, 'hex'));
    return this;
  }

  fromX(odd, x) {
    if (typeof odd !== 'boolean') {
      throw new Error('Must specify whether y is odd or not (true or false)');
    }

    this.point = Point.fromX(odd, x);
    return this;
  }

  static fromX(odd, x) {
    return new this().fromX(odd, x);
  }

  toBuffer() {
    const compressed = this.compressed === undefined ? true : this.compressed;
    return this.toDer(compressed);
  }

  toFastBuffer() {
    if (!this.point) {
      return Buffer.alloc(0);
    }

    const bw = new Bw();
    const compressed = this.compressed === undefined ? true : Boolean(this.compressed);
    bw.writeUInt8(Number(compressed));
    bw.write(this.toDer(false));
    return bw.toBuffer();
  }

  toDer(compressed) {
    compressed = compressed === undefined ? this.compressed : compressed;

    if (typeof compressed !== 'boolean') {
      throw new Error('Must specify whether the public key is compressed or not (true or false)');
    }

    const x = this.point.getX();
    const y = this.point.getY();
    const xbuf = x.toBuffer({
      size: 32
    });
    const ybuf = y.toBuffer({
      size: 32
    });
    let prefix;

    if (!compressed) {
      prefix = Buffer.from([0x04]);
      return Buffer.concat([prefix, xbuf, ybuf]);
    } else {
      const odd = ybuf[ybuf.length - 1] % 2;

      if (odd) {
        prefix = Buffer.from([0x03]);
      } else {
        prefix = Buffer.from([0x02]);
      }

      return Buffer.concat([prefix, xbuf]);
    }
  }

  toString() {
    const compressed = this.compressed === undefined ? true : this.compressed;
    return this.toDer(compressed).toString('hex');
  }

  static isCompressedOrUncompressed(buf) {
    if (buf.length < 33) {
      return false;
    }

    if (buf[0] === 0x04) {
      if (buf.length !== 65) {
        return false;
      }
    } else if (buf[0] === 0x02 || buf[0] === 0x03) {
      if (buf.length !== 33) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }

  validate() {
    if (this.point.isInfinity()) {
      throw new Error('point: Point cannot be equal to Infinity');
    }

    if (this.point.eq(new Point(new Bn(0), new Bn(0)))) {
      throw new Error('point: Point cannot be equal to 0, 0');
    }

    this.point.validate();
    return this;
  }

}

class Random {}

Random.getRandomBuffer = function (size) {
  return randomBytes(size);
};

class PrivKey extends Struct {
  constructor(bn, compressed, constants = null) {
    super({
      bn,
      compressed
    });
    constants = constants || Constants.Default.PrivKey;
    this.Constants = constants;
  }

  fromJSON(json) {
    this.fromHex(json);
    return this;
  }

  toJSON() {
    return this.toHex();
  }

  fromRandom() {
    let privBuf, bn, condition;

    do {
      privBuf = Random.getRandomBuffer(32);
      bn = new Bn().fromBuffer(privBuf);
      condition = bn.lt(Point.getN());
    } while (!condition);

    this.fromObject({
      bn: bn,
      compressed: true
    });
    return this;
  }

  static fromRandom() {
    return new this().fromRandom();
  }

  toBuffer() {
    let compressed = this.compressed;

    if (compressed === undefined) {
      compressed = true;
    }

    const privBuf = this.bn.toBuffer({
      size: 32
    });
    let buf;

    if (compressed) {
      buf = Buffer.concat([Buffer.from([this.Constants.versionByteNum]), privBuf, Buffer.from([0x01])]);
    } else {
      buf = Buffer.concat([Buffer.from([this.Constants.versionByteNum]), privBuf]);
    }

    return buf;
  }

  fromBuffer(buf) {
    if (buf.length === 1 + 32 + 1 && buf[1 + 32 + 1 - 1] === 1) {
      this.compressed = true;
    } else if (buf.length === 1 + 32) {
      this.compressed = false;
    } else {
      throw new Error('Length of privKey buffer must be 33 (uncompressed pubKey) or 34 (compressed pubKey)');
    }

    if (buf[0] !== this.Constants.versionByteNum) {
      throw new Error('Invalid versionByteNum byte');
    }

    return this.fromBn(new Bn().fromBuffer(buf.slice(1, 1 + 32)));
  }

  toBn() {
    return this.bn;
  }

  fromBn(bn) {
    this.bn = bn;
    return this;
  }

  static fromBn(bn) {
    return new this().fromBn(bn);
  }

  validate() {
    if (!this.bn.lt(Point.getN())) {
      throw new Error('Number must be less than N');
    }

    if (typeof this.compressed !== 'boolean') {
      throw new Error('Must specify whether the corresponding public key is compressed or not (true or false)');
    }

    return this;
  }

  toWif() {
    return Base58Check.encode(this.toBuffer());
  }

  fromWif(str) {
    return this.fromBuffer(Base58Check.decode(str));
  }

  static fromWif(str) {
    return new this().fromWif(str);
  }

  toString() {
    return this.toWif();
  }

  fromString(str) {
    return this.fromWif(str);
  }

}

PrivKey.Mainnet = class extends PrivKey {
  constructor(bn, compressed) {
    super(bn, compressed, Constants.Mainnet.PrivKey);
  }

};
PrivKey.Testnet = class extends PrivKey {
  constructor(bn, compressed) {
    super(bn, compressed, Constants.Testnet.PrivKey);
  }

};

class Sig extends Struct {
  constructor(r, s, nHashType, recovery, compressed) {
    super({
      r,
      s,
      nHashType,
      recovery,
      compressed
    });
  }

  fromBuffer(buf) {
    try {
      return this.fromDer(buf, true);
    } catch (e) {}

    try {
      return this.fromCompact(buf);
    } catch (e) {}

    return this.fromTxFormat(buf);
  }

  toBuffer() {
    if (this.nHashType !== undefined) {
      return this.toTxFormat();
    } else if (this.recovery !== undefined) {
      return this.toCompact();
    }

    return this.toDer();
  }

  fromCompact(buf) {
    let compressed = true;
    let recovery = buf.slice(0, 1)[0] - 27 - 4;

    if (recovery < 0) {
      compressed = false;
      recovery = recovery + 4;
    }

    if (!(recovery === 0 || recovery === 1 || recovery === 2 || recovery === 3)) {
      throw new Error('i must be 0, 1, 2, or 3');
    }

    this.compressed = compressed;
    this.recovery = recovery;
    const rsbuf = buf.slice(1);
    this.fromRS(rsbuf);
    return this;
  }

  static fromCompact(buf) {
    return new this().fromCompact(buf);
  }

  fromRS(rsbuf) {
    const b2 = rsbuf.slice(0, 32);
    const b3 = rsbuf.slice(32, 64);

    if (b2.length !== 32) {
      throw new Error('r must be 32 bytes');
    }

    if (b3.length !== 32 || rsbuf.length > 64) {
      throw new Error('s must be 32 bytes');
    }

    this.r = new Bn().fromBuffer(b2);
    this.s = new Bn().fromBuffer(b3);
    return this;
  }

  static fromRS(rsbuf) {
    return new this().fromRS(rsbuf);
  }

  fromDer(buf, strict) {
    const obj = Sig.parseDer(buf, strict);
    this.r = obj.r;
    this.s = obj.s;
    return this;
  }

  static fromDer(buf, strict) {
    return new this().fromDer(buf, strict);
  }

  fromTxFormat(buf) {
    if (buf.length === 0) {
      this.r = new Bn(1);
      this.s = new Bn(1);
      this.nHashType = 1;
      return this;
    }

    const nHashType = buf.readUInt8(buf.length - 1);
    const derbuf = buf.slice(0, buf.length - 1);
    this.fromDer(derbuf, false);
    this.nHashType = nHashType;
    return this;
  }

  static fromTxFormat(buf) {
    return new this().fromTxFormat(buf);
  }

  fromString(str) {
    return this.fromHex(str);
  }

  static parseDer(buf, strict) {
    if (strict === undefined) {
      strict = true;
    }

    if (!Buffer.isBuffer(buf)) {
      throw new Error('DER formatted signature should be a buffer');
    }

    const header = buf[0];

    if (header !== 0x30) {
      throw new Error('Header byte should be 0x30');
    }

    let length = buf[1];
    const buflength = buf.slice(2).length;

    if (strict && length !== buflength) {
      throw new Error('LEngth byte should length of what follows');
    } else {
      length = length < buflength ? length : buflength;
    }

    const rheader = buf[2 + 0];

    if (rheader !== 0x02) {
      throw new Error('Integer byte for r should be 0x02');
    }

    const rlength = buf[2 + 1];
    const rbuf = buf.slice(2 + 2, 2 + 2 + rlength);
    const r = new Bn().fromBuffer(rbuf);
    const rneg = buf[2 + 1 + 1] === 0x00;

    if (rlength !== rbuf.length) {
      throw new Error('LEngth of r incorrect');
    }

    const sheader = buf[2 + 2 + rlength + 0];

    if (sheader !== 0x02) {
      throw new Error('Integer byte for s should be 0x02');
    }

    const slength = buf[2 + 2 + rlength + 1];
    const sbuf = buf.slice(2 + 2 + rlength + 2, 2 + 2 + rlength + 2 + slength);
    const s = new Bn().fromBuffer(sbuf);
    const sneg = buf[2 + 2 + rlength + 2 + 2] === 0x00;

    if (slength !== sbuf.length) {
      throw new Error('LEngth of s incorrect');
    }

    const sumlength = 2 + 2 + rlength + 2 + slength;

    if (length !== sumlength - 2) {
      throw new Error('LEngth of signature incorrect');
    }

    const obj = {
      header: header,
      length: length,
      rheader: rheader,
      rlength: rlength,
      rneg: rneg,
      rbuf: rbuf,
      r: r,
      sheader: sheader,
      slength: slength,
      sneg: sneg,
      sbuf: sbuf,
      s: s
    };
    return obj;
  }

  static IsTxDer(buf) {
    if (buf.length < 9) {
      return false;
    }

    if (buf.length > 73) {
      return false;
    }

    if (buf[0] !== 0x30) {
      return false;
    }

    if (buf[1] !== buf.length - 3) {
      return false;
    }

    const nLEnR = buf[3];

    if (5 + nLEnR >= buf.length) {
      return false;
    }

    const nLEnS = buf[5 + nLEnR];

    if (nLEnR + nLEnS + 7 !== buf.length) {
      return false;
    }

    const R = buf.slice(4);

    if (buf[4 - 2] !== 0x02) {
      return false;
    }

    if (nLEnR === 0) {
      return false;
    }

    if (R[0] & 0x80) {
      return false;
    }

    if (nLEnR > 1 && R[0] === 0x00 && !(R[1] & 0x80)) {
      return false;
    }

    const S = buf.slice(6 + nLEnR);

    if (buf[6 + nLEnR - 2] !== 0x02) {
      return false;
    }

    if (nLEnS === 0) {
      return false;
    }

    if (S[0] & 0x80) {
      return false;
    }

    if (nLEnS > 1 && S[0] === 0x00 && !(S[1] & 0x80)) {
      return false;
    }

    return true;
  }

  hasLowS() {
    if (this.s.lt(1) || this.s.gt(Bn.fromBuffer(Buffer.from('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0', 'hex')))) {
      return false;
    }

    return true;
  }

  hasDefinedHashType() {
    if (this.nHashType < Sig.SIGHASH_ALL || this.nHashType > Sig.SIGHASH_SINGLE) {
      return false;
    }

    return true;
  }

  toCompact(recovery, compressed) {
    recovery = typeof recovery === 'number' ? recovery : this.recovery;
    compressed = typeof compressed === 'boolean' ? compressed : this.compressed;

    if (!(recovery === 0 || recovery === 1 || recovery === 2 || recovery === 3)) {
      throw new Error('recovery must be equal to 0, 1, 2, or 3');
    }

    let val = recovery + 27 + 4;

    if (compressed === false) {
      val = val - 4;
    }

    const b1 = Buffer.from([val]);
    const b2 = this.r.toBuffer({
      size: 32
    });
    const b3 = this.s.toBuffer({
      size: 32
    });
    return Buffer.concat([b1, b2, b3]);
  }

  toRS() {
    return Buffer.concat([this.r.toBuffer({
      size: 32
    }), this.s.toBuffer({
      size: 32
    })]);
  }

  toDer() {
    const rnbuf = this.r.toBuffer();
    const snbuf = this.s.toBuffer();
    const rneg = rnbuf[0] & 0x80;
    const sneg = snbuf[0] & 0x80;
    const rbuf = rneg ? Buffer.concat([Buffer.from([0x00]), rnbuf]) : rnbuf;
    const sbuf = sneg ? Buffer.concat([Buffer.from([0x00]), snbuf]) : snbuf;
    const length = 2 + rbuf.length + 2 + sbuf.length;
    const rlength = rbuf.length;
    const slength = sbuf.length;
    const rheader = 0x02;
    const sheader = 0x02;
    const header = 0x30;
    const der = Buffer.concat([Buffer.from([header, length, rheader, rlength]), rbuf, Buffer.from([sheader, slength]), sbuf]);
    return der;
  }

  toTxFormat() {
    const derbuf = this.toDer();
    const buf = Buffer.alloc(1);
    buf.writeUInt8(this.nHashType, 0);
    return Buffer.concat([derbuf, buf]);
  }

  toString() {
    return this.toHex();
  }

}

Sig.SIGHASH_ALL = 0x00000001;
Sig.SIGHASH_NONE = 0x00000002;
Sig.SIGHASH_SINGLE = 0x00000003;
Sig.SIGHASH_FORKID = 0x00000040;
Sig.SIGHASH_ANYONECANPAY = 0x00000080;

class Script extends Struct {
  constructor(chunks = []) {
    super({
      chunks
    });
  }

  fromJSON(json) {
    return this.fromString(json);
  }

  toJSON() {
    return this.toString();
  }

  fromBuffer(buf) {
    this.chunks = [];
    const br = new Br(buf);

    while (!br.eof()) {
      const opCodeNum = br.readUInt8();
      let len = 0;
      let buf = Buffer.from([]);

      if (opCodeNum > 0 && opCodeNum < OpCode.OP_PUSHDATA1) {
        len = opCodeNum;
        this.chunks.push({
          buf: br.read(len),
          len: len,
          opCodeNum: opCodeNum
        });
      } else if (opCodeNum === OpCode.OP_PUSHDATA1) {
        try {
          len = br.readUInt8();
          buf = br.read(len);
        } catch (err) {
          br.read();
        }

        this.chunks.push({
          buf: buf,
          len: len,
          opCodeNum: opCodeNum
        });
      } else if (opCodeNum === OpCode.OP_PUSHDATA2) {
        try {
          len = br.readUInt16LE();
          buf = br.read(len);
        } catch (err) {
          br.read();
        }

        this.chunks.push({
          buf: buf,
          len: len,
          opCodeNum: opCodeNum
        });
      } else if (opCodeNum === OpCode.OP_PUSHDATA4) {
        try {
          len = br.readUInt32LE();
          buf = br.read(len);
        } catch (err) {
          br.read();
        }

        this.chunks.push({
          buf: buf,
          len: len,
          opCodeNum: opCodeNum
        });
      } else {
        this.chunks.push({
          opCodeNum: opCodeNum
        });
      }
    }

    return this;
  }

  toBuffer() {
    const bw = new Bw();

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const opCodeNum = chunk.opCodeNum;
      bw.writeUInt8(opCodeNum);

      if (chunk.buf) {
        if (opCodeNum < OpCode.OP_PUSHDATA1) {
          bw.write(chunk.buf);
        } else if (opCodeNum === OpCode.OP_PUSHDATA1) {
          bw.writeUInt8(chunk.len);
          bw.write(chunk.buf);
        } else if (opCodeNum === OpCode.OP_PUSHDATA2) {
          bw.writeUInt16LE(chunk.len);
          bw.write(chunk.buf);
        } else if (opCodeNum === OpCode.OP_PUSHDATA4) {
          bw.writeUInt32LE(chunk.len);
          bw.write(chunk.buf);
        }
      }
    }

    return bw.toBuffer();
  }

  fromString(str) {
    this.chunks = [];

    if (str === '' || str === undefined) {
      return this;
    }

    const tokens = str.split(' ');
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];
      let opCodeNum;

      try {
        const opCode = new OpCode().fromString(token);
        opCodeNum = opCode.toNumber();
      } catch (err) {}

      if (opCodeNum === undefined) {
        opCodeNum = parseInt(token, 10);

        if (opCodeNum > 0 && opCodeNum < OpCode.OP_PUSHDATA1) {
          this.chunks.push({
            buf: Buffer.from(tokens[i + 1].slice(2), 'hex'),
            len: opCodeNum,
            opCodeNum: opCodeNum
          });
          i = i + 2;
        } else if (opCodeNum === 0) {
          this.chunks.push({
            opCodeNum: 0
          });
          i = i + 1;
        } else {
          throw new Error('Invalid script');
        }
      } else if (opCodeNum === OpCode.OP_PUSHDATA1 || opCodeNum === OpCode.OP_PUSHDATA2 || opCodeNum === OpCode.OP_PUSHDATA4) {
        if (tokens[i + 2].slice(0, 2) !== '0x') {
          throw new Error('Pushdata data must start with 0x');
        }

        this.chunks.push({
          buf: Buffer.from(tokens[i + 2].slice(2), 'hex'),
          len: parseInt(tokens[i + 1], 10),
          opCodeNum: opCodeNum
        });
        i = i + 3;
      } else {
        this.chunks.push({
          opCodeNum: opCodeNum
        });
        i = i + 1;
      }
    }

    return this;
  }

  toString() {
    let str = '';

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const opCodeNum = chunk.opCodeNum;

      if (!chunk.buf) {
        if (OpCode.str[opCodeNum] !== undefined) {
          str = str + ' ' + new OpCode(opCodeNum).toString();
        } else {
          str = str + ' ' + '0x' + opCodeNum.toString(16);
        }
      } else {
        if (opCodeNum === OpCode.OP_PUSHDATA1 || opCodeNum === OpCode.OP_PUSHDATA2 || opCodeNum === OpCode.OP_PUSHDATA4) {
          str = str + ' ' + new OpCode(opCodeNum).toString();
        }

        str = str + ' ' + chunk.len;
        str = str + ' ' + '0x' + chunk.buf.toString('hex');
      }
    }

    return str.substr(1);
  }

  fromBitcoindString(str) {
    const bw = new Bw();
    const tokens = str.split(' ');
    let i;

    for (i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === '') {
        continue;
      }

      if (token[0] === '0' && token[1] === 'x') {
        const hex = token.slice(2);
        bw.write(Buffer.from(hex, 'hex'));
      } else if (token[0] === "'") {
        const tstr = token.slice(1, token.length - 1);
        const cbuf = Buffer.from(tstr);
        const tbuf = new Script().writeBuffer(cbuf).toBuffer();
        bw.write(tbuf);
      } else if (OpCode['OP_' + token] !== undefined) {
        const opstr = 'OP_' + token;
        const opCodeNum = OpCode[opstr];
        bw.writeUInt8(opCodeNum);
      } else if (typeof OpCode[token] === 'number') {
        const opstr = token;
        const opCodeNum = OpCode[opstr];
        bw.writeUInt8(opCodeNum);
      } else if (!isNaN(parseInt(token, 10))) {
        const bn = new Bn(token);
        const script = new Script().writeBn(bn);
        const tbuf = script.toBuffer();
        bw.write(tbuf);
      } else {
        throw new Error('Could not determine type of script value');
      }
    }

    const buf = bw.toBuffer();
    return this.fromBuffer(buf);
  }

  static fromBitcoindString(str) {
    return new this().fromBitcoindString(str);
  }

  toBitcoindString() {
    let str = '';

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];

      if (chunk.buf) {
        const buf = new Script([chunk]).toBuffer();
        const hex = buf.toString('hex');
        str = str + ' ' + '0x' + hex;
      } else if (OpCode.str[chunk.opCodeNum] !== undefined) {
        const ostr = new OpCode(chunk.opCodeNum).toString();
        str = str + ' ' + ostr.slice(3);
      } else {
        str = str + ' ' + '0x' + chunk.opCodeNum.toString(16);
      }
    }

    return str.substr(1);
  }

  fromAsmString(str) {
    this.chunks = [];
    const tokens = str.split(' ');
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];
      let opCode, opCodeNum;

      try {
        opCode = OpCode.fromString(token);
        opCodeNum = opCode.toNumber();
      } catch (err) {
        opCode = undefined;
        opCodeNum = undefined;
      }

      if (token === '0') {
        opCodeNum = 0;
        this.chunks.push({
          opCodeNum: opCodeNum
        });
        i = i + 1;
      } else if (token === '-1') {
        opCodeNum = OpCode.OP_1NEGATE;
        this.chunks.push({
          opCodeNum: opCodeNum
        });
        i = i + 1;
      } else if (opCode === undefined) {
        const hex = tokens[i];
        const buf = Buffer.from(hex, 'hex');

        if (buf.toString('hex') !== hex) {
          throw new Error('invalid hex string in script');
        }

        const len = buf.length;

        if (len >= 0 && len < OpCode.OP_PUSHDATA1) {
          opCodeNum = len;
        } else if (len < Math.pow(2, 8)) {
          opCodeNum = OpCode.OP_PUSHDATA1;
        } else if (len < Math.pow(2, 16)) {
          opCodeNum = OpCode.OP_PUSHDATA2;
        } else if (len < Math.pow(2, 32)) {
          opCodeNum = OpCode.OP_PUSHDATA4;
        }

        this.chunks.push({
          buf: buf,
          len: buf.length,
          opCodeNum: opCodeNum
        });
        i = i + 1;
      } else {
        this.chunks.push({
          opCodeNum: opCodeNum
        });
        i = i + 1;
      }
    }

    return this;
  }

  static fromAsmString(str) {
    return new this().fromAsmString(str);
  }

  toAsmString() {
    var str = '';

    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];
      str += this._chunkToString(chunk);
    }

    return str.substr(1);
  }

  _chunkToString(chunk, type) {
    var opCodeNum = chunk.opCodeNum;
    var str = '';

    if (!chunk.buf) {
      if (typeof OpCode.str[opCodeNum] !== 'undefined') {
        if (opCodeNum === 0) {
          str = str + ' 0';
        } else if (opCodeNum === 79) {
          str = str + ' -1';
        } else {
          str = str + ' ' + new OpCode(opCodeNum).toString();
        }
      } else {
        var numstr = opCodeNum.toString(16);

        if (numstr.length % 2 !== 0) {
          numstr = '0' + numstr;
        }

        str = str + ' ' + numstr;
      }
    } else {
      if (chunk.len > 0) {
        str = str + ' ' + chunk.buf.toString('hex');
      }
    }

    return str;
  }

  fromOpReturnData(dataBuf) {
    this.writeOpCode(OpCode.OP_RETURN);
    this.writeBuffer(dataBuf);
    return this;
  }

  static fromOpReturnData(dataBuf) {
    return new this().fromOpReturnData(dataBuf);
  }

  fromSafeData(dataBuf) {
    this.writeOpCode(OpCode.OP_FALSE);
    this.writeOpCode(OpCode.OP_RETURN);
    this.writeBuffer(dataBuf);
    return this;
  }

  static fromSafeData(dataBuf) {
    return new this().fromSafeData(dataBuf);
  }

  fromSafeDataArray(dataBufs) {
    this.writeOpCode(OpCode.OP_FALSE);
    this.writeOpCode(OpCode.OP_RETURN);

    for (const i in dataBufs) {
      const dataBuf = dataBufs[i];
      this.writeBuffer(dataBuf);
    }

    return this;
  }

  static fromSafeDataArray(dataBufs) {
    return new this().fromSafeDataArray(dataBufs);
  }

  getData() {
    if (this.isSafeDataOut()) {
      const chunks = this.chunks.slice(2);
      const buffers = chunks.map(chunk => chunk.buf);
      return buffers;
    }

    if (this.isOpReturn()) {
      const chunks = this.chunks.slice(1);
      const buffers = chunks.map(chunk => chunk.buf);
      return buffers;
    }

    throw new Error('Unrecognized script type to get data from');
  }

  fromPubKeyHash(hashBuf) {
    if (hashBuf.length !== 20) {
      throw new Error('hashBuf must be a 20 byte buffer');
    }

    this.writeOpCode(OpCode.OP_DUP);
    this.writeOpCode(OpCode.OP_HASH160);
    this.writeBuffer(hashBuf);
    this.writeOpCode(OpCode.OP_EQUALVERIFY);
    this.writeOpCode(OpCode.OP_CHECKSIG);
    return this;
  }

  static fromPubKeyHash(hashBuf) {
    return new this().fromPubKeyHash(hashBuf);
  }

  static sortPubKeys(pubKeys) {
    return pubKeys.slice().sort((pubKey1, pubKey2) => {
      const buf1 = pubKey1.toBuffer();
      const buf2 = pubKey2.toBuffer();
      const len = Math.max(buf1.length, buf2.length);

      for (let i = 0; i <= len; i++) {
        if (buf1[i] === undefined) {
          return -1;
        }

        if (buf2[i] === undefined) {
          return 1;
        }

        if (buf1[i] < buf2[i]) {
          return -1;
        }

        if (buf1[i] > buf2[i]) {
          return 1;
        } else {
          continue;
        }
      }
    });
  }

  fromPubKeys(m, pubKeys, sort = true) {
    if (typeof m !== 'number') {
      throw new Error('m must be a number');
    }

    if (sort === true) {
      pubKeys = Script.sortPubKeys(pubKeys);
    }

    this.writeOpCode(m + OpCode.OP_1 - 1);

    for (const i in pubKeys) {
      this.writeBuffer(pubKeys[i].toBuffer());
    }

    this.writeOpCode(pubKeys.length + OpCode.OP_1 - 1);
    this.writeOpCode(OpCode.OP_CHECKMULTISIG);
    return this;
  }

  static fromPubKeys(m, pubKeys, sort) {
    return new this().fromPubKeys(m, pubKeys, sort);
  }

  removeCodeseparators() {
    const chunks = [];

    for (let i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].opCodeNum !== OpCode.OP_CODESEPARATOR) {
        chunks.push(this.chunks[i]);
      }
    }

    this.chunks = chunks;
    return this;
  }

  isPushOnly() {
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const opCodeNum = chunk.opCodeNum;

      if (opCodeNum > OpCode.OP_16) {
        return false;
      }
    }

    return true;
  }

  isOpReturn() {
    if (this.chunks[0].opCodeNum === OpCode.OP_RETURN && this.chunks.filter(chunk => Buffer.isBuffer(chunk.buf)).length === this.chunks.slice(1).length) {
      return true;
    } else {
      return false;
    }
  }

  isSafeDataOut() {
    if (this.chunks.length < 2) {
      return false;
    }

    if (this.chunks[0].opCodeNum !== OpCode.OP_FALSE) {
      return false;
    }

    var chunks = this.chunks.slice(1);
    var script2 = new Script(chunks);
    return script2.isOpReturn();
  }

  isPubKeyHashOut() {
    if (this.chunks[0] && this.chunks[0].opCodeNum === OpCode.OP_DUP && this.chunks[1] && this.chunks[1].opCodeNum === OpCode.OP_HASH160 && this.chunks[2].buf && this.chunks[3] && this.chunks[3].opCodeNum === OpCode.OP_EQUALVERIFY && this.chunks[4] && this.chunks[4].opCodeNum === OpCode.OP_CHECKSIG) {
      return true;
    } else {
      return false;
    }
  }

  isPubKeyHashIn() {
    if (this.chunks.length === 2 && (this.chunks[0].buf || this.chunks[0].opCodeNum === OpCode.OP_0) && (this.chunks[1].buf || this.chunks[0].opCodeNum === OpCode.OP_0)) {
      return true;
    } else {
      return false;
    }
  }

  isScriptHashOut() {
    const buf = this.toBuffer();
    return buf.length === 23 && buf[0] === OpCode.OP_HASH160 && buf[1] === 0x14 && buf[22] === OpCode.OP_EQUAL;
  }

  isScriptHashIn() {
    if (!this.isPushOnly()) {
      return false;
    }

    try {
      new Script().fromBuffer(this.chunks[this.chunks.length - 1].buf);
    } catch (err) {
      return false;
    }

    return true;
  }

  isMultiSigOut() {
    const m = this.chunks[0].opCodeNum - OpCode.OP_1 + 1;

    if (!(m >= 1 && m <= 16)) {
      return false;
    }

    const pubKeychunks = this.chunks.slice(1, this.chunks.length - 2);

    if (!pubKeychunks.every(chunk => {
      try {
        const buf = chunk.buf;
        const pubKey = new PubKey().fromDer(buf);
        pubKey.validate();
        return true;
      } catch (err) {
        return false;
      }
    })) {
      return false;
    }

    const n = this.chunks[this.chunks.length - 2].opCodeNum - OpCode.OP_1 + 1;

    if (!(n >= m && n <= 16)) {
      return false;
    }

    if (this.chunks[1 + n + 1].opCodeNum !== OpCode.OP_CHECKMULTISIG) {
      return false;
    }

    return true;
  }

  isMultiSigIn() {
    if (this.chunks[0].opCodeNum !== OpCode.OP_0) {
      return false;
    }

    const remaining = this.chunks.slice(1);

    if (remaining.length < 1) {
      return false;
    }

    return remaining.every(chunk => Buffer.isBuffer(chunk.buf) && Sig.IsTxDer(chunk.buf));
  }

  findAndDelete(script) {
    const buf = script.toBuffer();

    for (let i = 0; i < this.chunks.length; i++) {
      const script2 = new Script([this.chunks[i]]);
      const buf2 = script2.toBuffer();

      if (cmp(buf, buf2)) {
        this.chunks.splice(i, 1);
      }
    }

    return this;
  }

  writeScript(script) {
    this.chunks = this.chunks.concat(script.chunks);
    return this;
  }

  static writeScript(script) {
    return new this().writeScript(script);
  }

  writeString(str) {
    const script = new Script().fromString(str);
    this.chunks = this.chunks.concat(script.chunks);
    return this;
  }

  static writeString(str) {
    return new this().writeString(str);
  }

  writeOpCode(opCodeNum) {
    this.chunks.push({
      opCodeNum
    });
    return this;
  }

  static writeOpCode(opCodeNum) {
    return new this().writeOpCode(opCodeNum);
  }

  setChunkOpCode(i, opCodeNum) {
    this.chunks[i] = {
      opCodeNum
    };
    return this;
  }

  writeBn(bn) {
    if (bn.cmp(0) === OpCode.OP_0) {
      this.chunks.push({
        opCodeNum: OpCode.OP_0
      });
    } else if (bn.cmp(-1) === 0) {
      this.chunks.push({
        opCodeNum: OpCode.OP_1NEGATE
      });
    } else if (bn.cmp(1) >= 0 && bn.cmp(16) <= 0) {
      this.chunks.push({
        opCodeNum: bn.toNumber() + OpCode.OP_1 - 1
      });
    } else {
      const buf = bn.toSm({
        endian: 'little'
      });
      this.writeBuffer(buf);
    }

    return this;
  }

  static writeBn(bn) {
    return new this().writeBn(bn);
  }

  writeNumber(number) {
    this.writeBn(new Bn().fromNumber(number));
    return this;
  }

  static writeNumber(number) {
    return new this().writeNumber(number);
  }

  setChunkBn(i, bn) {
    this.chunks[i] = new Script().writeBn(bn).chunks[0];
    return this;
  }

  writeBuffer(buf) {
    let opCodeNum;
    const len = buf.length;

    if (buf.length > 0 && buf.length < OpCode.OP_PUSHDATA1) {
      opCodeNum = buf.length;
    } else if (buf.length === 0) {
      opCodeNum = OpCode.OP_0;
    } else if (buf.length < Math.pow(2, 8)) {
      opCodeNum = OpCode.OP_PUSHDATA1;
    } else if (buf.length < Math.pow(2, 16)) {
      opCodeNum = OpCode.OP_PUSHDATA2;
    } else if (buf.length < Math.pow(2, 32)) {
      opCodeNum = OpCode.OP_PUSHDATA4;
    } else {
      throw new Error("You can't push that much data");
    }

    this.chunks.push({
      buf: buf,
      len: len,
      opCodeNum: opCodeNum
    });
    return this;
  }

  static writeBuffer(buf) {
    return new this().writeBuffer(buf);
  }

  setChunkBuffer(i, buf) {
    this.chunks[i] = new Script().writeBuffer(buf).chunks[0];
    return this;
  }

  checkMinimalPush(i) {
    const chunk = this.chunks[i];
    const buf = chunk.buf;
    const opCodeNum = chunk.opCodeNum;

    if (!buf) {
      return true;
    }

    if (buf.length === 0) {
      return opCodeNum === OpCode.OP_0;
    } else if (buf.length === 1 && buf[0] >= 1 && buf[0] <= 16) {
      return opCodeNum === OpCode.OP_1 + (buf[0] - 1);
    } else if (buf.length === 1 && buf[0] === 0x81) {
      return opCodeNum === OpCode.OP_1NEGATE;
    } else if (buf.length <= 75) {
      return opCodeNum === buf.length;
    } else if (buf.length <= 255) {
      return opCodeNum === OpCode.OP_PUSHDATA1;
    } else if (buf.length <= 65535) {
      return opCodeNum === OpCode.OP_PUSHDATA2;
    }

    return true;
  }

}

class Address extends Struct {
  constructor(versionByteNum, hashBuf, constants = null) {
    super({
      versionByteNum,
      hashBuf
    });
    constants = constants || Constants.Default.Address;
    this.Constants = constants;
  }

  fromBuffer(buf) {
    if (buf.length !== 1 + 20) {
      throw new Error('address buffers must be exactly 21 bytes');
    }

    if (buf[0] !== this.Constants.pubKeyHash) {
      throw new Error('address: invalid versionByteNum byte');
    }

    this.versionByteNum = buf[0];
    this.hashBuf = buf.slice(1);
    return this;
  }

  fromPubKeyHashBuf(hashBuf) {
    this.hashBuf = hashBuf;
    this.versionByteNum = this.Constants.pubKeyHash;
    return this;
  }

  static fromPubKeyHashBuf(hashBuf) {
    return new this().fromPubKeyHashBuf(hashBuf);
  }

  fromPubKey(pubKey) {
    const hashBuf = Hash.sha256Ripemd160(pubKey.toBuffer());
    return this.fromPubKeyHashBuf(hashBuf);
  }

  static fromPubKey(pubKey) {
    return new this().fromPubKey(pubKey);
  }

  asyncFromPubKey(pubKey) {
    try {
      const _this = this;

      const args = [pubKey];
      return Promise.resolve(Workers.asyncObjectMethod(_this, 'fromPubKey', args)).then(function (workersResult) {
        return _this.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromPubKey(pubKey) {
    return new this().asyncFromPubKey(pubKey);
  }

  fromPrivKey(privKey) {
    const pubKey = new PubKey().fromPrivKey(privKey);
    const hashBuf = Hash.sha256Ripemd160(pubKey.toBuffer());
    return this.fromPubKeyHashBuf(hashBuf);
  }

  static fromPrivKey(privKey) {
    return new this().fromPrivKey(privKey);
  }

  asyncFromPrivKey(privKey) {
    try {
      const _this2 = this;

      const args = [privKey];
      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'fromPrivKey', args)).then(function (workersResult) {
        return _this2.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromPrivKey(privKey) {
    return new this().fromPrivKey(privKey);
  }

  fromRandom() {
    const randomPrivKey = new PrivKey().fromRandom();
    return this.fromPrivKey(randomPrivKey);
  }

  static fromRandom() {
    return new this().fromRandom();
  }

  asyncFromRandom() {
    try {
      const _this3 = this;

      const args = [];
      return Promise.resolve(Workers.asyncObjectMethod(_this3, 'fromRandom', args)).then(function (workersResult) {
        return _this3.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromRandom() {
    return new this().fromRandom();
  }

  fromString(str) {
    const buf = Base58Check.decode(str);
    return this.fromBuffer(buf);
  }

  asyncFromString(str) {
    try {
      const _this4 = this;

      const args = [str];
      return Promise.resolve(Workers.asyncObjectMethod(_this4, 'fromString', args)).then(function (workersResult) {
        return _this4.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromString(str) {
    return new this().asyncFromString(str);
  }

  static isValid(addrstr) {
    let address;

    try {
      address = new Address().fromString(addrstr);
    } catch (e) {
      return false;
    }

    return address.isValid();
  }

  isValid() {
    try {
      this.validate();
      return true;
    } catch (e) {
      return false;
    }
  }

  toTxOutScript() {
    const script = new Script();
    script.writeOpCode(OpCode.OP_DUP);
    script.writeOpCode(OpCode.OP_HASH160);
    script.writeBuffer(this.hashBuf);
    script.writeOpCode(OpCode.OP_EQUALVERIFY);
    script.writeOpCode(OpCode.OP_CHECKSIG);
    return script;
  }

  fromTxInScript(script) {
    const pubKeyHashBuf = Hash.sha256Ripemd160(script.chunks[1].buf || Buffer.from('00'.repeat(32), 'hex'));
    return this.fromPubKeyHashBuf(pubKeyHashBuf);
  }

  static fromTxInScript(script) {
    return new this().fromTxInScript(script);
  }

  fromTxOutScript(script) {
    return this.fromPubKeyHashBuf(script.chunks[2].buf);
  }

  static fromTxOutScript(script) {
    return new this().fromTxOutScript(script);
  }

  toBuffer() {
    const versionByteBuf = Buffer.from([this.versionByteNum]);
    const buf = Buffer.concat([versionByteBuf, this.hashBuf]);
    return buf;
  }

  toJSON() {
    const json = {};

    if (this.hashBuf) {
      json.hashBuf = this.hashBuf.toString('hex');
    }

    if (typeof this.versionByteNum !== 'undefined') {
      json.versionByteNum = this.versionByteNum;
    }

    return json;
  }

  fromJSON(json) {
    if (json.hashBuf) {
      this.hashBuf = Buffer.from(json.hashBuf, 'hex');
    }

    if (typeof json.versionByteNum !== 'undefined') {
      this.versionByteNum = json.versionByteNum;
    }

    return this;
  }

  toString() {
    return Base58Check.encode(this.toBuffer());
  }

  asyncToString() {
    try {
      const _this5 = this;

      const args = [];
      return Promise.resolve(Workers.asyncObjectMethod(_this5, 'toString', args)).then(function (workersResult) {
        return JSON.parse(workersResult.resbuf.toString());
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  validate() {
    if (!Buffer.isBuffer(this.hashBuf) || this.hashBuf.length !== 20) {
      throw new Error('hashBuf must be a buffer of 20 bytes');
    }

    if (this.versionByteNum !== this.Constants.pubKeyHash) {
      throw new Error('invalid versionByteNum');
    }

    return this;
  }

}

Address.Mainnet = class extends Address {
  constructor(versionByteNum, hashBuf) {
    super(versionByteNum, hashBuf, Constants.Mainnet.Address);
  }

};
Address.Testnet = class extends Address {
  constructor(versionByteNum, hashBuf) {
    super(versionByteNum, hashBuf, Constants.Testnet.Address);
  }

};

class Bip32 extends Struct {
  constructor(versionBytesNum, depth, parentFingerPrint, childIndex, chainCode, privKey, pubKey, constants = null, PrivKey$1 = PrivKey) {
    super({
      versionBytesNum,
      depth,
      parentFingerPrint,
      childIndex,
      chainCode,
      privKey,
      pubKey
    });
    constants = constants || Constants.Default.Bip32;
    this.Constants = constants;
    this.PrivKey = PrivKey$1;
  }

  fromRandom() {
    this.versionBytesNum = this.Constants.privKey;
    this.depth = 0x00;
    this.parentFingerPrint = Buffer.from([0, 0, 0, 0]);
    this.childIndex = 0;
    this.chainCode = Random.getRandomBuffer(32);
    this.privKey = new this.PrivKey().fromRandom();
    this.pubKey = new PubKey().fromPrivKey(this.privKey);
    return this;
  }

  static fromRandom() {
    return new this().fromRandom();
  }

  fromString(str) {
    return this.fromBuffer(Base58Check.decode(str));
  }

  asyncFromString(str) {
    try {
      const _this = this;

      const args = [str];
      return Promise.resolve(Workers.asyncObjectMethod(_this, 'fromString', args)).then(function (workersResult) {
        return _this.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  fromSeed(bytes) {
    if (!Buffer.isBuffer(bytes)) {
      throw new Error('bytes must be a buffer');
    }

    if (bytes.length < 128 / 8) {
      throw new Error('Need more than 128 bits of entropy');
    }

    if (bytes.length > 512 / 8) {
      throw new Error('More than 512 bits of entropy is nonstandard');
    }

    const hash = Hash.sha512Hmac(bytes, Buffer.from('Bitcoin seed'));
    this.depth = 0x00;
    this.parentFingerPrint = Buffer.from([0, 0, 0, 0]);
    this.childIndex = 0;
    this.chainCode = hash.slice(32, 64);
    this.versionBytesNum = this.Constants.privKey;
    this.privKey = new this.PrivKey().fromBn(Bn().fromBuffer(hash.slice(0, 32)));
    this.pubKey = new PubKey().fromPrivKey(this.privKey);
    return this;
  }

  static fromSeed(bytes) {
    return new this().fromSeed(bytes);
  }

  asyncFromSeed(bytes) {
    try {
      const _this2 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'fromSeed', [bytes])).then(function (workersResult) {
        return _this2.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromSeed(bytes) {
    return new this().asyncFromSeed(bytes);
  }

  fromBuffer(buf) {
    if (buf.length !== 78) {
      throw new Error('incorrect bip32 data length');
    }

    this.versionBytesNum = buf.slice(0, 4).readUInt32BE(0);
    this.depth = buf.slice(4, 5).readUInt8(0);
    this.parentFingerPrint = buf.slice(5, 9);
    this.childIndex = buf.slice(9, 13).readUInt32BE(0);
    this.chainCode = buf.slice(13, 45);
    const keyBytes = buf.slice(45, 78);
    const isPrivate = this.versionBytesNum === this.Constants.privKey;
    const isPublic = this.versionBytesNum === this.Constants.pubKey;

    if (isPrivate && keyBytes[0] === 0) {
      this.privKey = new this.PrivKey().fromBn(Bn().fromBuffer(keyBytes.slice(1, 33)));
      this.pubKey = new PubKey().fromPrivKey(this.privKey);
    } else if (isPublic && (keyBytes[0] === 0x02 || keyBytes[0] === 0x03)) {
      this.pubKey = new PubKey().fromDer(keyBytes);
    } else {
      throw new Error('Invalid key');
    }

    return this;
  }

  fromFastBuffer(buf) {
    if (buf.length === 0) {
      return this;
    }

    if (buf.length !== 78 && buf.length !== 78 + 33) {
      throw new Error('incorrect bip32 fastBuffer data length: ' + buf.length);
    }

    this.versionBytesNum = buf.slice(0, 4).readUInt32BE(0);
    this.depth = buf.slice(4, 5).readUInt8(0);
    this.parentFingerPrint = buf.slice(5, 9);
    this.childIndex = buf.slice(9, 13).readUInt32BE(0);
    this.chainCode = buf.slice(13, 45);
    const keyBytes = buf.slice(45, buf.length);
    const isPrivate = this.versionBytesNum === this.Constants.privKey;
    const isPublic = this.versionBytesNum === this.Constants.pubKey;

    if (isPrivate && keyBytes[0] === 0 && buf.length === 78) {
      this.privKey = new this.PrivKey().fromBn(Bn().fromBuffer(keyBytes.slice(1, 33)));
      this.pubKey = new PubKey().fromPrivKey(this.privKey);
    } else if (isPublic && buf.length === 78 + 33) {
      this.pubKey = new PubKey().fromFastBuffer(keyBytes);
      this.pubKey.compressed = true;
    } else {
      throw new Error('Invalid key');
    }

    return this;
  }

  derive(path) {
    const e = path.split('/');

    if (path === 'm') {
      return this;
    }

    let bip32 = this;

    for (const i in e) {
      const c = e[i];

      if (i === '0') {
        if (c !== 'm') throw new Error('invalid path');
        continue;
      }

      if (parseInt(c.replace("'", ''), 10).toString() !== c.replace("'", '')) {
        throw new Error('invalid path');
      }

      const usePrivate = c.length > 1 && c[c.length - 1] === "'";
      let childIndex = parseInt(usePrivate ? c.slice(0, c.length - 1) : c, 10) & 0x7fffffff;

      if (usePrivate) {
        childIndex += 0x80000000;
      }

      bip32 = bip32.deriveChild(childIndex);
    }

    return bip32;
  }

  asyncDerive(path) {
    try {
      const _this3 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this3, 'derive', [path])).then(function (workersResult) {
        return new _this3.constructor().fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  deriveChild(i) {
    if (typeof i !== 'number') {
      throw new Error('i must be a number');
    }

    let ib = [];
    ib.push(i >> 24 & 0xff);
    ib.push(i >> 16 & 0xff);
    ib.push(i >> 8 & 0xff);
    ib.push(i & 0xff);
    ib = Buffer.from(ib);
    const usePrivate = (i & 0x80000000) !== 0;
    const isPrivate = this.versionBytesNum === this.Constants.privKey;

    if (usePrivate && (!this.privKey || !isPrivate)) {
      throw new Error('Cannot do private key derivation without private key');
    }

    let ret = null;

    if (this.privKey) {
      let data = null;

      if (usePrivate) {
        data = Buffer.concat([Buffer.from([0]), this.privKey.bn.toBuffer({
          size: 32
        }), ib]);
      } else {
        data = Buffer.concat([this.pubKey.toBuffer({
          size: 32
        }), ib]);
      }

      const hash = Hash.sha512Hmac(data, this.chainCode);
      const il = Bn().fromBuffer(hash.slice(0, 32), {
        size: 32
      });
      const ir = hash.slice(32, 64);
      const k = il.add(this.privKey.bn).mod(Point.getN());
      ret = new this.constructor();
      ret.chainCode = ir;
      ret.privKey = new this.PrivKey().fromBn(k);
      ret.pubKey = new PubKey().fromPrivKey(ret.privKey);
    } else {
      const data = Buffer.concat([this.pubKey.toBuffer(), ib]);
      const hash = Hash.sha512Hmac(data, this.chainCode);
      const il = Bn().fromBuffer(hash.slice(0, 32));
      const ir = hash.slice(32, 64);
      const ilG = Point.getG().mul(il);
      const Kpar = this.pubKey.point;
      const Ki = ilG.add(Kpar);
      const newpub = new PubKey();
      newpub.point = Ki;
      ret = new this.constructor();
      ret.chainCode = ir;
      ret.pubKey = newpub;
    }

    ret.childIndex = i;
    const pubKeyhash = Hash.sha256Ripemd160(this.pubKey.toBuffer());
    ret.parentFingerPrint = pubKeyhash.slice(0, 4);
    ret.versionBytesNum = this.versionBytesNum;
    ret.depth = this.depth + 1;
    return ret;
  }

  toPublic() {
    const bip32 = new this.constructor().fromObject(this);
    bip32.versionBytesNum = this.Constants.pubKey;
    bip32.privKey = undefined;
    return bip32;
  }

  toBuffer() {
    const isPrivate = this.versionBytesNum === this.Constants.privKey;
    const isPublic = this.versionBytesNum === this.Constants.pubKey;

    if (isPrivate) {
      return new Bw().writeUInt32BE(this.versionBytesNum).writeUInt8(this.depth).write(this.parentFingerPrint).writeUInt32BE(this.childIndex).write(this.chainCode).writeUInt8(0).write(this.privKey.bn.toBuffer({
        size: 32
      })).toBuffer();
    } else if (isPublic) {
      if (this.pubKey.compressed === false) {
        throw new Error('cannot convert bip32 to buffer if pubKey is not compressed');
      }

      return new Bw().writeUInt32BE(this.versionBytesNum).writeUInt8(this.depth).write(this.parentFingerPrint).writeUInt32BE(this.childIndex).write(this.chainCode).write(this.pubKey.toBuffer()).toBuffer();
    } else {
      throw new Error('bip32: invalid versionBytesNum byte');
    }
  }

  toFastBuffer() {
    if (!this.versionBytesNum) {
      return Buffer.alloc(0);
    }

    const isPrivate = this.versionBytesNum === this.Constants.privKey;
    const isPublic = this.versionBytesNum === this.Constants.pubKey;

    if (isPrivate) {
      return new Bw().writeUInt32BE(this.versionBytesNum).writeUInt8(this.depth).write(this.parentFingerPrint).writeUInt32BE(this.childIndex).write(this.chainCode).writeUInt8(0).write(this.privKey.bn.toBuffer({
        size: 32
      })).toBuffer();
    } else if (isPublic) {
      return new Bw().writeUInt32BE(this.versionBytesNum).writeUInt8(this.depth).write(this.parentFingerPrint).writeUInt32BE(this.childIndex).write(this.chainCode).write(this.pubKey.toFastBuffer()).toBuffer();
    } else {
      throw new Error('bip32: invalid versionBytesNum byte');
    }
  }

  toString() {
    return Base58Check.encode(this.toBuffer());
  }

  asyncToString() {
    try {
      const _this4 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this4, 'toString', [])).then(function (workersResult) {
        return JSON.parse(workersResult.resbuf.toString());
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  toJSON() {
    return this.toFastHex();
  }

  fromJSON(json) {
    return this.fromFastHex(json);
  }

  isPrivate() {
    return this.versionBytesNum === this.Constants.privKey;
  }

}

Bip32.Mainnet = class extends Bip32 {
  constructor(versionBytesNum, depth, parentFingerPrint, childIndex, chainCode, privKey, pubKey) {
    super(versionBytesNum, depth, parentFingerPrint, childIndex, chainCode, privKey, pubKey, Constants.Mainnet.Bip32, PrivKey.Mainnet);
  }

};
Bip32.Testnet = class extends Bip32 {
  constructor(versionBytesNum, depth, parentFingerPrint, childIndex, chainCode, privKey, pubKey) {
    super(versionBytesNum, depth, parentFingerPrint, childIndex, chainCode, privKey, pubKey, Constants.Testnet.Bip32, PrivKey.Testnet);
  }

};

const wordList = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car', 'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century', 'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter', 'charge', 'chase', 'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen', 'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil', 'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control', 'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane', 'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance', 'danger', 'daring', 'dash', 'daughter', 'dawn', 'day', 'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense', 'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'demise', 'denial', 'dentist', 'deny', 'depart', 'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial', 'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'dry', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erode', 'erosion', 'error', 'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family', 'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film', 'filter', 'final', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish', 'fit', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flee', 'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog', 'foil', 'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown', 'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog', 'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub', 'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner', 'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact', 'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love', 'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make', 'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass', 'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze', 'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media', 'melody', 'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight', 'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror', 'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model', 'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month', 'moon', 'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply', 'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth', 'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net', 'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose', 'notable', 'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number', 'nurse', 'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain', 'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer', 'office', 'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion', 'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside', 'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda', 'panel', 'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot', 'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause', 'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty', 'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone', 'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece', 'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol', 'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please', 'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar', 'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position', 'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice', 'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price', 'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem', 'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property', 'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose', 'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven', 'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall', 'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse', 'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely', 'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen', 'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist', 'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal', 'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk', 'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'robust', 'rocket', 'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough', 'round', 'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run', 'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon', 'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter', 'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap', 'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second', 'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell', 'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle', 'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shuffle', 'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister', 'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small', 'smart', 'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar', 'soldier', 'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare', 'spatial', 'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere', 'spice', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon', 'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze', 'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student', 'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such', 'sudden', 'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset', 'super', 'supply', 'supreme', 'sure', 'surface', 'surge', 'surprise', 'surround', 'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear', 'sweet', 'swift', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom', 'syrup', 'system', 'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task', 'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent', 'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they', 'thing', 'this', 'thought', 'three', 'thrive', 'throw', 'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip', 'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe', 'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'topple', 'torch', 'tornado', 'tortoise', 'toss', 'total', 'tourist', 'toward', 'tower', 'town', 'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap', 'trash', 'travel', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'try', 'tube', 'tuition', 'tumble', 'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice', 'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility', 'vacant', 'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb', 'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'violin', 'virtual', 'virus', 'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal', 'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weasel', 'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra', 'zero', 'zone', 'zoo'];
wordList.space = ' ';

class Bip39 extends Struct {
  constructor(mnemonic, seed, wordlist = wordList) {
    super({
      mnemonic,
      seed
    });
    this.Wordlist = wordlist;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    if (this.mnemonic) {
      const buf = Buffer.from(this.mnemonic);
      bw.writeVarIntNum(buf.length);
      bw.write(buf);
    } else {
      bw.writeVarIntNum(0);
    }

    if (this.seed) {
      bw.writeVarIntNum(this.seed.length);
      bw.write(this.seed);
    } else {
      bw.writeVarIntNum(0);
    }

    return bw;
  }

  fromBr(br) {
    const mnemoniclen = br.readVarIntNum();

    if (mnemoniclen > 0) {
      this.mnemonic = br.read(mnemoniclen).toString();
    }

    const seedlen = br.readVarIntNum();

    if (seedlen > 0) {
      this.seed = br.read(seedlen);
    }

    return this;
  }

  fromRandom(bits) {
    if (!bits) {
      bits = 128;
    }

    if (bits % 32 !== 0) {
      throw new Error('bits must be multiple of 32');
    }

    if (bits < 128) {
      throw new Error('bits must be at least 128');
    }

    const buf = Random.getRandomBuffer(bits / 8);
    this.entropy2Mnemonic(buf);
    this.mnemonic2Seed();
    return this;
  }

  static fromRandom(bits) {
    return new this().fromRandom(bits);
  }

  asyncFromRandom(bits) {
    try {
      const _this = this;

      if (!bits) {
        bits = 128;
      }

      const buf = Random.getRandomBuffer(bits / 8);
      return Promise.resolve(Workers.asyncObjectMethod(_this, 'entropy2Mnemonic', [buf])).then(function (workersResult) {
        const bip39 = new Bip39().fromFastBuffer(workersResult.resbuf);
        return Promise.resolve(Workers.asyncObjectMethod(bip39, 'mnemonic2Seed', [])).then(function (_Workers$asyncObjectM) {
          workersResult = _Workers$asyncObjectM;
          return _this.fromFastBuffer(workersResult.resbuf);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromRandom(bits) {
    return new this().asyncFromRandom(bits);
  }

  fromEntropy(buf) {
    this.entropy2Mnemonic(buf);
    return this;
  }

  static fromEntropy(buf) {
    return new this().fromEntropy(buf);
  }

  asyncFromEntropy(buf) {
    try {
      const _this2 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'fromEntropy', [buf])).then(function (workersResult) {
        return _this2.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromEntropy(buf) {
    return new this().asyncFromEntropy(buf);
  }

  fromString(mnemonic) {
    this.mnemonic = mnemonic;
    return this;
  }

  toString() {
    return this.mnemonic;
  }

  toSeed(passphrase) {
    this.mnemonic2Seed(passphrase);
    return this.seed;
  }

  asyncToSeed(passphrase) {
    try {
      const _this3 = this;

      if (passphrase === undefined) {
        passphrase = '';
      }

      const args = [passphrase];
      return Promise.resolve(Workers.asyncObjectMethod(_this3, 'toSeed', args)).then(function (workersResult) {
        return workersResult.resbuf;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  entropy2Mnemonic(buf) {
    if (!Buffer.isBuffer(buf) || buf.length < 128 / 8) {
      throw new Error('Entropy is less than 128 bits. It must be 128 bits or more.');
    }

    const hash = Hash.sha256(buf);
    let bin = '';
    const bits = buf.length * 8;

    for (let i = 0; i < buf.length; i++) {
      bin = bin + ('00000000' + buf[i].toString(2)).slice(-8);
    }

    let hashbits = hash[0].toString(2);
    hashbits = ('00000000' + hashbits).slice(-8).slice(0, bits / 32);
    bin = bin + hashbits;

    if (bin.length % 11 !== 0) {
      throw new Error('internal error - entropy not an even multiple of 11 bits - ' + bin.length);
    }

    let mnemonic = '';

    for (let i = 0; i < bin.length / 11; i++) {
      if (mnemonic !== '') {
        mnemonic = mnemonic + this.Wordlist.space;
      }

      const wi = parseInt(bin.slice(i * 11, (i + 1) * 11), 2);
      mnemonic = mnemonic + this.Wordlist[wi];
    }

    this.mnemonic = mnemonic;
    return this;
  }

  check() {
    const mnemonic = this.mnemonic;
    const words = mnemonic.split(this.Wordlist.space);
    let bin = '';

    for (let i = 0; i < words.length; i++) {
      const ind = this.Wordlist.indexOf(words[i]);

      if (ind < 0) {
        return false;
      }

      bin = bin + ('00000000000' + ind.toString(2)).slice(-11);
    }

    if (bin.length % 11 !== 0) {
      throw new Error('internal error - entropy not an even multiple of 11 bits - ' + bin.length);
    }

    const cs = bin.length / 33;
    const hashBits = bin.slice(-cs);
    const nonhashBits = bin.slice(0, bin.length - cs);
    const buf = Buffer.alloc(nonhashBits.length / 8);

    for (let i = 0; i < nonhashBits.length / 8; i++) {
      buf.writeUInt8(parseInt(bin.slice(i * 8, (i + 1) * 8), 2), i);
    }

    const hash = Hash.sha256(buf);
    let expectedHashBits = hash[0].toString(2);
    expectedHashBits = ('00000000' + expectedHashBits).slice(-8).slice(0, cs);
    return expectedHashBits === hashBits;
  }

  mnemonic2Seed(passphrase = '') {
    let mnemonic = this.mnemonic;

    if (!this.check()) {
      throw new Error('Mnemonic does not pass the check - was the mnemonic typed incorrectly? Are there extra spaces?');
    }

    if (typeof passphrase !== 'string') {
      throw new Error('passphrase must be a string or undefined');
    }

    mnemonic = mnemonic.normalize('NFKD');
    passphrase = passphrase.normalize('NFKD');
    const mbuf = Buffer.from(mnemonic);
    const pbuf = Buffer.concat([Buffer.from('mnemonic'), Buffer.from(passphrase)]);
    this.seed = pbkdf2.pbkdf2Sync(mbuf, pbuf, 2048, 64, 'sha512');
    return this;
  }

  isValid(passphrase = '') {
    let isValid;

    try {
      isValid = !!this.mnemonic2Seed(passphrase);
    } catch (err) {
      isValid = false;
    }

    return isValid;
  }

  static isValid(mnemonic, passphrase = '') {
    return new Bip39(mnemonic).isValid(passphrase);
  }

}

const wordList$1 = ['あいこくしん', 'あいさつ', 'あいだ', 'あおぞら', 'あかちゃん', 'あきる', 'あけがた', 'あける', 'あこがれる', 'あさい', 'あさひ', 'あしあと', 'あじわう', 'あずかる', 'あずき', 'あそぶ', 'あたえる', 'あたためる', 'あたりまえ', 'あたる', 'あつい', 'あつかう', 'あっしゅく', 'あつまり', 'あつめる', 'あてな', 'あてはまる', 'あひる', 'あぶら', 'あぶる', 'あふれる', 'あまい', 'あまど', 'あまやかす', 'あまり', 'あみもの', 'あめりか', 'あやまる', 'あゆむ', 'あらいぐま', 'あらし', 'あらすじ', 'あらためる', 'あらゆる', 'あらわす', 'ありがとう', 'あわせる', 'あわてる', 'あんい', 'あんがい', 'あんこ', 'あんぜん', 'あんてい', 'あんない', 'あんまり', 'いいだす', 'いおん', 'いがい', 'いがく', 'いきおい', 'いきなり', 'いきもの', 'いきる', 'いくじ', 'いくぶん', 'いけばな', 'いけん', 'いこう', 'いこく', 'いこつ', 'いさましい', 'いさん', 'いしき', 'いじゅう', 'いじょう', 'いじわる', 'いずみ', 'いずれ', 'いせい', 'いせえび', 'いせかい', 'いせき', 'いぜん', 'いそうろう', 'いそがしい', 'いだい', 'いだく', 'いたずら', 'いたみ', 'いたりあ', 'いちおう', 'いちじ', 'いちど', 'いちば', 'いちぶ', 'いちりゅう', 'いつか', 'いっしゅん', 'いっせい', 'いっそう', 'いったん', 'いっち', 'いってい', 'いっぽう', 'いてざ', 'いてん', 'いどう', 'いとこ', 'いない', 'いなか', 'いねむり', 'いのち', 'いのる', 'いはつ', 'いばる', 'いはん', 'いびき', 'いひん', 'いふく', 'いへん', 'いほう', 'いみん', 'いもうと', 'いもたれ', 'いもり', 'いやがる', 'いやす', 'いよかん', 'いよく', 'いらい', 'いらすと', 'いりぐち', 'いりょう', 'いれい', 'いれもの', 'いれる', 'いろえんぴつ', 'いわい', 'いわう', 'いわかん', 'いわば', 'いわゆる', 'いんげんまめ', 'いんさつ', 'いんしょう', 'いんよう', 'うえき', 'うえる', 'うおざ', 'うがい', 'うかぶ', 'うかべる', 'うきわ', 'うくらいな', 'うくれれ', 'うけたまわる', 'うけつけ', 'うけとる', 'うけもつ', 'うける', 'うごかす', 'うごく', 'うこん', 'うさぎ', 'うしなう', 'うしろがみ', 'うすい', 'うすぎ', 'うすぐらい', 'うすめる', 'うせつ', 'うちあわせ', 'うちがわ', 'うちき', 'うちゅう', 'うっかり', 'うつくしい', 'うったえる', 'うつる', 'うどん', 'うなぎ', 'うなじ', 'うなずく', 'うなる', 'うねる', 'うのう', 'うぶげ', 'うぶごえ', 'うまれる', 'うめる', 'うもう', 'うやまう', 'うよく', 'うらがえす', 'うらぐち', 'うらない', 'うりあげ', 'うりきれ', 'うるさい', 'うれしい', 'うれゆき', 'うれる', 'うろこ', 'うわき', 'うわさ', 'うんこう', 'うんちん', 'うんてん', 'うんどう', 'えいえん', 'えいが', 'えいきょう', 'えいご', 'えいせい', 'えいぶん', 'えいよう', 'えいわ', 'えおり', 'えがお', 'えがく', 'えきたい', 'えくせる', 'えしゃく', 'えすて', 'えつらん', 'えのぐ', 'えほうまき', 'えほん', 'えまき', 'えもじ', 'えもの', 'えらい', 'えらぶ', 'えりあ', 'えんえん', 'えんかい', 'えんぎ', 'えんげき', 'えんしゅう', 'えんぜつ', 'えんそく', 'えんちょう', 'えんとつ', 'おいかける', 'おいこす', 'おいしい', 'おいつく', 'おうえん', 'おうさま', 'おうじ', 'おうせつ', 'おうたい', 'おうふく', 'おうべい', 'おうよう', 'おえる', 'おおい', 'おおう', 'おおどおり', 'おおや', 'おおよそ', 'おかえり', 'おかず', 'おがむ', 'おかわり', 'おぎなう', 'おきる', 'おくさま', 'おくじょう', 'おくりがな', 'おくる', 'おくれる', 'おこす', 'おこなう', 'おこる', 'おさえる', 'おさない', 'おさめる', 'おしいれ', 'おしえる', 'おじぎ', 'おじさん', 'おしゃれ', 'おそらく', 'おそわる', 'おたがい', 'おたく', 'おだやか', 'おちつく', 'おっと', 'おつり', 'おでかけ', 'おとしもの', 'おとなしい', 'おどり', 'おどろかす', 'おばさん', 'おまいり', 'おめでとう', 'おもいで', 'おもう', 'おもたい', 'おもちゃ', 'おやつ', 'おやゆび', 'およぼす', 'おらんだ', 'おろす', 'おんがく', 'おんけい', 'おんしゃ', 'おんせん', 'おんだん', 'おんちゅう', 'おんどけい', 'かあつ', 'かいが', 'がいき', 'がいけん', 'がいこう', 'かいさつ', 'かいしゃ', 'かいすいよく', 'かいぜん', 'かいぞうど', 'かいつう', 'かいてん', 'かいとう', 'かいふく', 'がいへき', 'かいほう', 'かいよう', 'がいらい', 'かいわ', 'かえる', 'かおり', 'かかえる', 'かがく', 'かがし', 'かがみ', 'かくご', 'かくとく', 'かざる', 'がぞう', 'かたい', 'かたち', 'がちょう', 'がっきゅう', 'がっこう', 'がっさん', 'がっしょう', 'かなざわし', 'かのう', 'がはく', 'かぶか', 'かほう', 'かほご', 'かまう', 'かまぼこ', 'かめれおん', 'かゆい', 'かようび', 'からい', 'かるい', 'かろう', 'かわく', 'かわら', 'がんか', 'かんけい', 'かんこう', 'かんしゃ', 'かんそう', 'かんたん', 'かんち', 'がんばる', 'きあい', 'きあつ', 'きいろ', 'ぎいん', 'きうい', 'きうん', 'きえる', 'きおう', 'きおく', 'きおち', 'きおん', 'きかい', 'きかく', 'きかんしゃ', 'ききて', 'きくばり', 'きくらげ', 'きけんせい', 'きこう', 'きこえる', 'きこく', 'きさい', 'きさく', 'きさま', 'きさらぎ', 'ぎじかがく', 'ぎしき', 'ぎじたいけん', 'ぎじにってい', 'ぎじゅつしゃ', 'きすう', 'きせい', 'きせき', 'きせつ', 'きそう', 'きぞく', 'きぞん', 'きたえる', 'きちょう', 'きつえん', 'ぎっちり', 'きつつき', 'きつね', 'きてい', 'きどう', 'きどく', 'きない', 'きなが', 'きなこ', 'きぬごし', 'きねん', 'きのう', 'きのした', 'きはく', 'きびしい', 'きひん', 'きふく', 'きぶん', 'きぼう', 'きほん', 'きまる', 'きみつ', 'きむずかしい', 'きめる', 'きもだめし', 'きもち', 'きもの', 'きゃく', 'きやく', 'ぎゅうにく', 'きよう', 'きょうりゅう', 'きらい', 'きらく', 'きりん', 'きれい', 'きれつ', 'きろく', 'ぎろん', 'きわめる', 'ぎんいろ', 'きんかくじ', 'きんじょ', 'きんようび', 'ぐあい', 'くいず', 'くうかん', 'くうき', 'くうぐん', 'くうこう', 'ぐうせい', 'くうそう', 'ぐうたら', 'くうふく', 'くうぼ', 'くかん', 'くきょう', 'くげん', 'ぐこう', 'くさい', 'くさき', 'くさばな', 'くさる', 'くしゃみ', 'くしょう', 'くすのき', 'くすりゆび', 'くせげ', 'くせん', 'ぐたいてき', 'くださる', 'くたびれる', 'くちこみ', 'くちさき', 'くつした', 'ぐっすり', 'くつろぐ', 'くとうてん', 'くどく', 'くなん', 'くねくね', 'くのう', 'くふう', 'くみあわせ', 'くみたてる', 'くめる', 'くやくしょ', 'くらす', 'くらべる', 'くるま', 'くれる', 'くろう', 'くわしい', 'ぐんかん', 'ぐんしょく', 'ぐんたい', 'ぐんて', 'けあな', 'けいかく', 'けいけん', 'けいこ', 'けいさつ', 'げいじゅつ', 'けいたい', 'げいのうじん', 'けいれき', 'けいろ', 'けおとす', 'けおりもの', 'げきか', 'げきげん', 'げきだん', 'げきちん', 'げきとつ', 'げきは', 'げきやく', 'げこう', 'げこくじょう', 'げざい', 'けさき', 'げざん', 'けしき', 'けしごむ', 'けしょう', 'げすと', 'けたば', 'けちゃっぷ', 'けちらす', 'けつあつ', 'けつい', 'けつえき', 'けっこん', 'けつじょ', 'けっせき', 'けってい', 'けつまつ', 'げつようび', 'げつれい', 'けつろん', 'げどく', 'けとばす', 'けとる', 'けなげ', 'けなす', 'けなみ', 'けぬき', 'げねつ', 'けねん', 'けはい', 'げひん', 'けぶかい', 'げぼく', 'けまり', 'けみかる', 'けむし', 'けむり', 'けもの', 'けらい', 'けろけろ', 'けわしい', 'けんい', 'けんえつ', 'けんお', 'けんか', 'げんき', 'けんげん', 'けんこう', 'けんさく', 'けんしゅう', 'けんすう', 'げんそう', 'けんちく', 'けんてい', 'けんとう', 'けんない', 'けんにん', 'げんぶつ', 'けんま', 'けんみん', 'けんめい', 'けんらん', 'けんり', 'こあくま', 'こいぬ', 'こいびと', 'ごうい', 'こうえん', 'こうおん', 'こうかん', 'ごうきゅう', 'ごうけい', 'こうこう', 'こうさい', 'こうじ', 'こうすい', 'ごうせい', 'こうそく', 'こうたい', 'こうちゃ', 'こうつう', 'こうてい', 'こうどう', 'こうない', 'こうはい', 'ごうほう', 'ごうまん', 'こうもく', 'こうりつ', 'こえる', 'こおり', 'ごかい', 'ごがつ', 'ごかん', 'こくご', 'こくさい', 'こくとう', 'こくない', 'こくはく', 'こぐま', 'こけい', 'こける', 'ここのか', 'こころ', 'こさめ', 'こしつ', 'こすう', 'こせい', 'こせき', 'こぜん', 'こそだて', 'こたい', 'こたえる', 'こたつ', 'こちょう', 'こっか', 'こつこつ', 'こつばん', 'こつぶ', 'こてい', 'こてん', 'ことがら', 'ことし', 'ことば', 'ことり', 'こなごな', 'こねこね', 'このまま', 'このみ', 'このよ', 'ごはん', 'こひつじ', 'こふう', 'こふん', 'こぼれる', 'ごまあぶら', 'こまかい', 'ごますり', 'こまつな', 'こまる', 'こむぎこ', 'こもじ', 'こもち', 'こもの', 'こもん', 'こやく', 'こやま', 'こゆう', 'こゆび', 'こよい', 'こよう', 'こりる', 'これくしょん', 'ころっけ', 'こわもて', 'こわれる', 'こんいん', 'こんかい', 'こんき', 'こんしゅう', 'こんすい', 'こんだて', 'こんとん', 'こんなん', 'こんびに', 'こんぽん', 'こんまけ', 'こんや', 'こんれい', 'こんわく', 'ざいえき', 'さいかい', 'さいきん', 'ざいげん', 'ざいこ', 'さいしょ', 'さいせい', 'ざいたく', 'ざいちゅう', 'さいてき', 'ざいりょう', 'さうな', 'さかいし', 'さがす', 'さかな', 'さかみち', 'さがる', 'さぎょう', 'さくし', 'さくひん', 'さくら', 'さこく', 'さこつ', 'さずかる', 'ざせき', 'さたん', 'さつえい', 'ざつおん', 'ざっか', 'ざつがく', 'さっきょく', 'ざっし', 'さつじん', 'ざっそう', 'さつたば', 'さつまいも', 'さてい', 'さといも', 'さとう', 'さとおや', 'さとし', 'さとる', 'さのう', 'さばく', 'さびしい', 'さべつ', 'さほう', 'さほど', 'さます', 'さみしい', 'さみだれ', 'さむけ', 'さめる', 'さやえんどう', 'さゆう', 'さよう', 'さよく', 'さらだ', 'ざるそば', 'さわやか', 'さわる', 'さんいん', 'さんか', 'さんきゃく', 'さんこう', 'さんさい', 'ざんしょ', 'さんすう', 'さんせい', 'さんそ', 'さんち', 'さんま', 'さんみ', 'さんらん', 'しあい', 'しあげ', 'しあさって', 'しあわせ', 'しいく', 'しいん', 'しうち', 'しえい', 'しおけ', 'しかい', 'しかく', 'じかん', 'しごと', 'しすう', 'じだい', 'したうけ', 'したぎ', 'したて', 'したみ', 'しちょう', 'しちりん', 'しっかり', 'しつじ', 'しつもん', 'してい', 'してき', 'してつ', 'じてん', 'じどう', 'しなぎれ', 'しなもの', 'しなん', 'しねま', 'しねん', 'しのぐ', 'しのぶ', 'しはい', 'しばかり', 'しはつ', 'しはらい', 'しはん', 'しひょう', 'しふく', 'じぶん', 'しへい', 'しほう', 'しほん', 'しまう', 'しまる', 'しみん', 'しむける', 'じむしょ', 'しめい', 'しめる', 'しもん', 'しゃいん', 'しゃうん', 'しゃおん', 'じゃがいも', 'しやくしょ', 'しゃくほう', 'しゃけん', 'しゃこ', 'しゃざい', 'しゃしん', 'しゃせん', 'しゃそう', 'しゃたい', 'しゃちょう', 'しゃっきん', 'じゃま', 'しゃりん', 'しゃれい', 'じゆう', 'じゅうしょ', 'しゅくはく', 'じゅしん', 'しゅっせき', 'しゅみ', 'しゅらば', 'じゅんばん', 'しょうかい', 'しょくたく', 'しょっけん', 'しょどう', 'しょもつ', 'しらせる', 'しらべる', 'しんか', 'しんこう', 'じんじゃ', 'しんせいじ', 'しんちく', 'しんりん', 'すあげ', 'すあし', 'すあな', 'ずあん', 'すいえい', 'すいか', 'すいとう', 'ずいぶん', 'すいようび', 'すうがく', 'すうじつ', 'すうせん', 'すおどり', 'すきま', 'すくう', 'すくない', 'すける', 'すごい', 'すこし', 'ずさん', 'すずしい', 'すすむ', 'すすめる', 'すっかり', 'ずっしり', 'ずっと', 'すてき', 'すてる', 'すねる', 'すのこ', 'すはだ', 'すばらしい', 'ずひょう', 'ずぶぬれ', 'すぶり', 'すふれ', 'すべて', 'すべる', 'ずほう', 'すぼん', 'すまい', 'すめし', 'すもう', 'すやき', 'すらすら', 'するめ', 'すれちがう', 'すろっと', 'すわる', 'すんぜん', 'すんぽう', 'せあぶら', 'せいかつ', 'せいげん', 'せいじ', 'せいよう', 'せおう', 'せかいかん', 'せきにん', 'せきむ', 'せきゆ', 'せきらんうん', 'せけん', 'せこう', 'せすじ', 'せたい', 'せたけ', 'せっかく', 'せっきゃく', 'ぜっく', 'せっけん', 'せっこつ', 'せっさたくま', 'せつぞく', 'せつだん', 'せつでん', 'せっぱん', 'せつび', 'せつぶん', 'せつめい', 'せつりつ', 'せなか', 'せのび', 'せはば', 'せびろ', 'せぼね', 'せまい', 'せまる', 'せめる', 'せもたれ', 'せりふ', 'ぜんあく', 'せんい', 'せんえい', 'せんか', 'せんきょ', 'せんく', 'せんげん', 'ぜんご', 'せんさい', 'せんしゅ', 'せんすい', 'せんせい', 'せんぞ', 'せんたく', 'せんちょう', 'せんてい', 'せんとう', 'せんぬき', 'せんねん', 'せんぱい', 'ぜんぶ', 'ぜんぽう', 'せんむ', 'せんめんじょ', 'せんもん', 'せんやく', 'せんゆう', 'せんよう', 'ぜんら', 'ぜんりゃく', 'せんれい', 'せんろ', 'そあく', 'そいとげる', 'そいね', 'そうがんきょう', 'そうき', 'そうご', 'そうしん', 'そうだん', 'そうなん', 'そうび', 'そうめん', 'そうり', 'そえもの', 'そえん', 'そがい', 'そげき', 'そこう', 'そこそこ', 'そざい', 'そしな', 'そせい', 'そせん', 'そそぐ', 'そだてる', 'そつう', 'そつえん', 'そっかん', 'そつぎょう', 'そっけつ', 'そっこう', 'そっせん', 'そっと', 'そとがわ', 'そとづら', 'そなえる', 'そなた', 'そふぼ', 'そぼく', 'そぼろ', 'そまつ', 'そまる', 'そむく', 'そむりえ', 'そめる', 'そもそも', 'そよかぜ', 'そらまめ', 'そろう', 'そんかい', 'そんけい', 'そんざい', 'そんしつ', 'そんぞく', 'そんちょう', 'ぞんび', 'ぞんぶん', 'そんみん', 'たあい', 'たいいん', 'たいうん', 'たいえき', 'たいおう', 'だいがく', 'たいき', 'たいぐう', 'たいけん', 'たいこ', 'たいざい', 'だいじょうぶ', 'だいすき', 'たいせつ', 'たいそう', 'だいたい', 'たいちょう', 'たいてい', 'だいどころ', 'たいない', 'たいねつ', 'たいのう', 'たいはん', 'だいひょう', 'たいふう', 'たいへん', 'たいほ', 'たいまつばな', 'たいみんぐ', 'たいむ', 'たいめん', 'たいやき', 'たいよう', 'たいら', 'たいりょく', 'たいる', 'たいわん', 'たうえ', 'たえる', 'たおす', 'たおる', 'たおれる', 'たかい', 'たかね', 'たきび', 'たくさん', 'たこく', 'たこやき', 'たさい', 'たしざん', 'だじゃれ', 'たすける', 'たずさわる', 'たそがれ', 'たたかう', 'たたく', 'ただしい', 'たたみ', 'たちばな', 'だっかい', 'だっきゃく', 'だっこ', 'だっしゅつ', 'だったい', 'たてる', 'たとえる', 'たなばた', 'たにん', 'たぬき', 'たのしみ', 'たはつ', 'たぶん', 'たべる', 'たぼう', 'たまご', 'たまる', 'だむる', 'ためいき', 'ためす', 'ためる', 'たもつ', 'たやすい', 'たよる', 'たらす', 'たりきほんがん', 'たりょう', 'たりる', 'たると', 'たれる', 'たれんと', 'たろっと', 'たわむれる', 'だんあつ', 'たんい', 'たんおん', 'たんか', 'たんき', 'たんけん', 'たんご', 'たんさん', 'たんじょうび', 'だんせい', 'たんそく', 'たんたい', 'だんち', 'たんてい', 'たんとう', 'だんな', 'たんにん', 'だんねつ', 'たんのう', 'たんぴん', 'だんぼう', 'たんまつ', 'たんめい', 'だんれつ', 'だんろ', 'だんわ', 'ちあい', 'ちあん', 'ちいき', 'ちいさい', 'ちえん', 'ちかい', 'ちから', 'ちきゅう', 'ちきん', 'ちけいず', 'ちけん', 'ちこく', 'ちさい', 'ちしき', 'ちしりょう', 'ちせい', 'ちそう', 'ちたい', 'ちたん', 'ちちおや', 'ちつじょ', 'ちてき', 'ちてん', 'ちぬき', 'ちぬり', 'ちのう', 'ちひょう', 'ちへいせん', 'ちほう', 'ちまた', 'ちみつ', 'ちみどろ', 'ちめいど', 'ちゃんこなべ', 'ちゅうい', 'ちゆりょく', 'ちょうし', 'ちょさくけん', 'ちらし', 'ちらみ', 'ちりがみ', 'ちりょう', 'ちるど', 'ちわわ', 'ちんたい', 'ちんもく', 'ついか', 'ついたち', 'つうか', 'つうじょう', 'つうはん', 'つうわ', 'つかう', 'つかれる', 'つくね', 'つくる', 'つけね', 'つける', 'つごう', 'つたえる', 'つづく', 'つつじ', 'つつむ', 'つとめる', 'つながる', 'つなみ', 'つねづね', 'つのる', 'つぶす', 'つまらない', 'つまる', 'つみき', 'つめたい', 'つもり', 'つもる', 'つよい', 'つるぼ', 'つるみく', 'つわもの', 'つわり', 'てあし', 'てあて', 'てあみ', 'ていおん', 'ていか', 'ていき', 'ていけい', 'ていこく', 'ていさつ', 'ていし', 'ていせい', 'ていたい', 'ていど', 'ていねい', 'ていひょう', 'ていへん', 'ていぼう', 'てうち', 'ておくれ', 'てきとう', 'てくび', 'でこぼこ', 'てさぎょう', 'てさげ', 'てすり', 'てそう', 'てちがい', 'てちょう', 'てつがく', 'てつづき', 'でっぱ', 'てつぼう', 'てつや', 'でぬかえ', 'てぬき', 'てぬぐい', 'てのひら', 'てはい', 'てぶくろ', 'てふだ', 'てほどき', 'てほん', 'てまえ', 'てまきずし', 'てみじか', 'てみやげ', 'てらす', 'てれび', 'てわけ', 'てわたし', 'でんあつ', 'てんいん', 'てんかい', 'てんき', 'てんぐ', 'てんけん', 'てんごく', 'てんさい', 'てんし', 'てんすう', 'でんち', 'てんてき', 'てんとう', 'てんない', 'てんぷら', 'てんぼうだい', 'てんめつ', 'てんらんかい', 'でんりょく', 'でんわ', 'どあい', 'といれ', 'どうかん', 'とうきゅう', 'どうぐ', 'とうし', 'とうむぎ', 'とおい', 'とおか', 'とおく', 'とおす', 'とおる', 'とかい', 'とかす', 'ときおり', 'ときどき', 'とくい', 'とくしゅう', 'とくてん', 'とくに', 'とくべつ', 'とけい', 'とける', 'とこや', 'とさか', 'としょかん', 'とそう', 'とたん', 'とちゅう', 'とっきゅう', 'とっくん', 'とつぜん', 'とつにゅう', 'とどける', 'ととのえる', 'とない', 'となえる', 'となり', 'とのさま', 'とばす', 'どぶがわ', 'とほう', 'とまる', 'とめる', 'ともだち', 'ともる', 'どようび', 'とらえる', 'とんかつ', 'どんぶり', 'ないかく', 'ないこう', 'ないしょ', 'ないす', 'ないせん', 'ないそう', 'なおす', 'ながい', 'なくす', 'なげる', 'なこうど', 'なさけ', 'なたでここ', 'なっとう', 'なつやすみ', 'ななおし', 'なにごと', 'なにもの', 'なにわ', 'なのか', 'なふだ', 'なまいき', 'なまえ', 'なまみ', 'なみだ', 'なめらか', 'なめる', 'なやむ', 'ならう', 'ならび', 'ならぶ', 'なれる', 'なわとび', 'なわばり', 'にあう', 'にいがた', 'にうけ', 'におい', 'にかい', 'にがて', 'にきび', 'にくしみ', 'にくまん', 'にげる', 'にさんかたんそ', 'にしき', 'にせもの', 'にちじょう', 'にちようび', 'にっか', 'にっき', 'にっけい', 'にっこう', 'にっさん', 'にっしょく', 'にっすう', 'にっせき', 'にってい', 'になう', 'にほん', 'にまめ', 'にもつ', 'にやり', 'にゅういん', 'にりんしゃ', 'にわとり', 'にんい', 'にんか', 'にんき', 'にんげん', 'にんしき', 'にんずう', 'にんそう', 'にんたい', 'にんち', 'にんてい', 'にんにく', 'にんぷ', 'にんまり', 'にんむ', 'にんめい', 'にんよう', 'ぬいくぎ', 'ぬかす', 'ぬぐいとる', 'ぬぐう', 'ぬくもり', 'ぬすむ', 'ぬまえび', 'ぬめり', 'ぬらす', 'ぬんちゃく', 'ねあげ', 'ねいき', 'ねいる', 'ねいろ', 'ねぐせ', 'ねくたい', 'ねくら', 'ねこぜ', 'ねこむ', 'ねさげ', 'ねすごす', 'ねそべる', 'ねだん', 'ねつい', 'ねっしん', 'ねつぞう', 'ねったいぎょ', 'ねぶそく', 'ねふだ', 'ねぼう', 'ねほりはほり', 'ねまき', 'ねまわし', 'ねみみ', 'ねむい', 'ねむたい', 'ねもと', 'ねらう', 'ねわざ', 'ねんいり', 'ねんおし', 'ねんかん', 'ねんきん', 'ねんぐ', 'ねんざ', 'ねんし', 'ねんちゃく', 'ねんど', 'ねんぴ', 'ねんぶつ', 'ねんまつ', 'ねんりょう', 'ねんれい', 'のいず', 'のおづま', 'のがす', 'のきなみ', 'のこぎり', 'のこす', 'のこる', 'のせる', 'のぞく', 'のぞむ', 'のたまう', 'のちほど', 'のっく', 'のばす', 'のはら', 'のべる', 'のぼる', 'のみもの', 'のやま', 'のらいぬ', 'のらねこ', 'のりもの', 'のりゆき', 'のれん', 'のんき', 'ばあい', 'はあく', 'ばあさん', 'ばいか', 'ばいく', 'はいけん', 'はいご', 'はいしん', 'はいすい', 'はいせん', 'はいそう', 'はいち', 'ばいばい', 'はいれつ', 'はえる', 'はおる', 'はかい', 'ばかり', 'はかる', 'はくしゅ', 'はけん', 'はこぶ', 'はさみ', 'はさん', 'はしご', 'ばしょ', 'はしる', 'はせる', 'ぱそこん', 'はそん', 'はたん', 'はちみつ', 'はつおん', 'はっかく', 'はづき', 'はっきり', 'はっくつ', 'はっけん', 'はっこう', 'はっさん', 'はっしん', 'はったつ', 'はっちゅう', 'はってん', 'はっぴょう', 'はっぽう', 'はなす', 'はなび', 'はにかむ', 'はぶらし', 'はみがき', 'はむかう', 'はめつ', 'はやい', 'はやし', 'はらう', 'はろうぃん', 'はわい', 'はんい', 'はんえい', 'はんおん', 'はんかく', 'はんきょう', 'ばんぐみ', 'はんこ', 'はんしゃ', 'はんすう', 'はんだん', 'ぱんち', 'ぱんつ', 'はんてい', 'はんとし', 'はんのう', 'はんぱ', 'はんぶん', 'はんぺん', 'はんぼうき', 'はんめい', 'はんらん', 'はんろん', 'ひいき', 'ひうん', 'ひえる', 'ひかく', 'ひかり', 'ひかる', 'ひかん', 'ひくい', 'ひけつ', 'ひこうき', 'ひこく', 'ひさい', 'ひさしぶり', 'ひさん', 'びじゅつかん', 'ひしょ', 'ひそか', 'ひそむ', 'ひたむき', 'ひだり', 'ひたる', 'ひつぎ', 'ひっこし', 'ひっし', 'ひつじゅひん', 'ひっす', 'ひつぜん', 'ぴったり', 'ぴっちり', 'ひつよう', 'ひてい', 'ひとごみ', 'ひなまつり', 'ひなん', 'ひねる', 'ひはん', 'ひびく', 'ひひょう', 'ひほう', 'ひまわり', 'ひまん', 'ひみつ', 'ひめい', 'ひめじし', 'ひやけ', 'ひやす', 'ひよう', 'びょうき', 'ひらがな', 'ひらく', 'ひりつ', 'ひりょう', 'ひるま', 'ひるやすみ', 'ひれい', 'ひろい', 'ひろう', 'ひろき', 'ひろゆき', 'ひんかく', 'ひんけつ', 'ひんこん', 'ひんしゅ', 'ひんそう', 'ぴんち', 'ひんぱん', 'びんぼう', 'ふあん', 'ふいうち', 'ふうけい', 'ふうせん', 'ぷうたろう', 'ふうとう', 'ふうふ', 'ふえる', 'ふおん', 'ふかい', 'ふきん', 'ふくざつ', 'ふくぶくろ', 'ふこう', 'ふさい', 'ふしぎ', 'ふじみ', 'ふすま', 'ふせい', 'ふせぐ', 'ふそく', 'ぶたにく', 'ふたん', 'ふちょう', 'ふつう', 'ふつか', 'ふっかつ', 'ふっき', 'ふっこく', 'ぶどう', 'ふとる', 'ふとん', 'ふのう', 'ふはい', 'ふひょう', 'ふへん', 'ふまん', 'ふみん', 'ふめつ', 'ふめん', 'ふよう', 'ふりこ', 'ふりる', 'ふるい', 'ふんいき', 'ぶんがく', 'ぶんぐ', 'ふんしつ', 'ぶんせき', 'ふんそう', 'ぶんぽう', 'へいあん', 'へいおん', 'へいがい', 'へいき', 'へいげん', 'へいこう', 'へいさ', 'へいしゃ', 'へいせつ', 'へいそ', 'へいたく', 'へいてん', 'へいねつ', 'へいわ', 'へきが', 'へこむ', 'べにいろ', 'べにしょうが', 'へらす', 'へんかん', 'べんきょう', 'べんごし', 'へんさい', 'へんたい', 'べんり', 'ほあん', 'ほいく', 'ぼうぎょ', 'ほうこく', 'ほうそう', 'ほうほう', 'ほうもん', 'ほうりつ', 'ほえる', 'ほおん', 'ほかん', 'ほきょう', 'ぼきん', 'ほくろ', 'ほけつ', 'ほけん', 'ほこう', 'ほこる', 'ほしい', 'ほしつ', 'ほしゅ', 'ほしょう', 'ほせい', 'ほそい', 'ほそく', 'ほたて', 'ほたる', 'ぽちぶくろ', 'ほっきょく', 'ほっさ', 'ほったん', 'ほとんど', 'ほめる', 'ほんい', 'ほんき', 'ほんけ', 'ほんしつ', 'ほんやく', 'まいにち', 'まかい', 'まかせる', 'まがる', 'まける', 'まこと', 'まさつ', 'まじめ', 'ますく', 'まぜる', 'まつり', 'まとめ', 'まなぶ', 'まぬけ', 'まねく', 'まほう', 'まもる', 'まゆげ', 'まよう', 'まろやか', 'まわす', 'まわり', 'まわる', 'まんが', 'まんきつ', 'まんぞく', 'まんなか', 'みいら', 'みうち', 'みえる', 'みがく', 'みかた', 'みかん', 'みけん', 'みこん', 'みじかい', 'みすい', 'みすえる', 'みせる', 'みっか', 'みつかる', 'みつける', 'みてい', 'みとめる', 'みなと', 'みなみかさい', 'みねらる', 'みのう', 'みのがす', 'みほん', 'みもと', 'みやげ', 'みらい', 'みりょく', 'みわく', 'みんか', 'みんぞく', 'むいか', 'むえき', 'むえん', 'むかい', 'むかう', 'むかえ', 'むかし', 'むぎちゃ', 'むける', 'むげん', 'むさぼる', 'むしあつい', 'むしば', 'むじゅん', 'むしろ', 'むすう', 'むすこ', 'むすぶ', 'むすめ', 'むせる', 'むせん', 'むちゅう', 'むなしい', 'むのう', 'むやみ', 'むよう', 'むらさき', 'むりょう', 'むろん', 'めいあん', 'めいうん', 'めいえん', 'めいかく', 'めいきょく', 'めいさい', 'めいし', 'めいそう', 'めいぶつ', 'めいれい', 'めいわく', 'めぐまれる', 'めざす', 'めした', 'めずらしい', 'めだつ', 'めまい', 'めやす', 'めんきょ', 'めんせき', 'めんどう', 'もうしあげる', 'もうどうけん', 'もえる', 'もくし', 'もくてき', 'もくようび', 'もちろん', 'もどる', 'もらう', 'もんく', 'もんだい', 'やおや', 'やける', 'やさい', 'やさしい', 'やすい', 'やすたろう', 'やすみ', 'やせる', 'やそう', 'やたい', 'やちん', 'やっと', 'やっぱり', 'やぶる', 'やめる', 'ややこしい', 'やよい', 'やわらかい', 'ゆうき', 'ゆうびんきょく', 'ゆうべ', 'ゆうめい', 'ゆけつ', 'ゆしゅつ', 'ゆせん', 'ゆそう', 'ゆたか', 'ゆちゃく', 'ゆでる', 'ゆにゅう', 'ゆびわ', 'ゆらい', 'ゆれる', 'ようい', 'ようか', 'ようきゅう', 'ようじ', 'ようす', 'ようちえん', 'よかぜ', 'よかん', 'よきん', 'よくせい', 'よくぼう', 'よけい', 'よごれる', 'よさん', 'よしゅう', 'よそう', 'よそく', 'よっか', 'よてい', 'よどがわく', 'よねつ', 'よやく', 'よゆう', 'よろこぶ', 'よろしい', 'らいう', 'らくがき', 'らくご', 'らくさつ', 'らくだ', 'らしんばん', 'らせん', 'らぞく', 'らたい', 'らっか', 'られつ', 'りえき', 'りかい', 'りきさく', 'りきせつ', 'りくぐん', 'りくつ', 'りけん', 'りこう', 'りせい', 'りそう', 'りそく', 'りてん', 'りねん', 'りゆう', 'りゅうがく', 'りよう', 'りょうり', 'りょかん', 'りょくちゃ', 'りょこう', 'りりく', 'りれき', 'りろん', 'りんご', 'るいけい', 'るいさい', 'るいじ', 'るいせき', 'るすばん', 'るりがわら', 'れいかん', 'れいぎ', 'れいせい', 'れいぞうこ', 'れいとう', 'れいぼう', 'れきし', 'れきだい', 'れんあい', 'れんけい', 'れんこん', 'れんさい', 'れんしゅう', 'れんぞく', 'れんらく', 'ろうか', 'ろうご', 'ろうじん', 'ろうそく', 'ろくが', 'ろこつ', 'ろじうら', 'ろしゅつ', 'ろせん', 'ろてん', 'ろめん', 'ろれつ', 'ろんぎ', 'ろんぱ', 'ろんぶん', 'ろんり', 'わかす', 'わかめ', 'わかやま', 'わかれる', 'わしつ', 'わじまし', 'わすれもの', 'わらう', 'われる'];
wordList$1.space = '　';

class KeyPair extends Struct {
  constructor(privKey, pubKey, PrivKey$1 = PrivKey) {
    super({
      privKey,
      pubKey
    });
    this.PrivKey = PrivKey$1;
  }

  fromJSON(json) {
    if (json.privKey) {
      this.privKey = this.PrivKey.fromJSON(json.privKey);
    }

    if (json.pubKey) {
      this.pubKey = PubKey.fromJSON(json.pubKey);
    }

    return this;
  }

  fromBr(br) {
    const buflen1 = br.readUInt8();

    if (buflen1 > 0) {
      this.privKey = new this.PrivKey().fromFastBuffer(br.read(buflen1));
    }

    const buflen2 = br.readUInt8();

    if (buflen2 > 0) {
      this.pubKey = new PubKey().fromFastBuffer(br.read(buflen2));
    }

    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    if (this.privKey) {
      const privKeybuf = this.privKey.toFastBuffer();
      bw.writeUInt8(privKeybuf.length);
      bw.write(privKeybuf);
    } else {
      bw.writeUInt8(0);
    }

    if (this.pubKey) {
      const pubKeybuf = this.pubKey.toFastBuffer();
      bw.writeUInt8(pubKeybuf.length);
      bw.write(pubKeybuf);
    } else {
      bw.writeUInt8(0);
    }

    return bw;
  }

  fromString(str) {
    return this.fromJSON(JSON.parse(str));
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toPublic() {
    const keyPair = new KeyPair().fromObject(this);
    keyPair.privKey = undefined;
    return keyPair;
  }

  fromPrivKey(privKey) {
    this.privKey = privKey;
    this.pubKey = new PubKey().fromPrivKey(privKey);
    return this;
  }

  static fromPrivKey(privKey) {
    return new this().fromPrivKey(privKey);
  }

  asyncFromPrivKey(privKey) {
    try {
      const _this = this;

      _this.privKey = privKey;
      return Promise.resolve(new PubKey().asyncFromPrivKey(privKey)).then(function (_PubKey$asyncFromPriv) {
        _this.pubKey = _PubKey$asyncFromPriv;
        return _this;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromPrivKey(privKey) {
    return new this().asyncFromPrivKey(privKey);
  }

  fromRandom() {
    this.privKey = new this.PrivKey().fromRandom();
    this.pubKey = new PubKey().fromPrivKey(this.privKey);
    return this;
  }

  static fromRandom() {
    return new this().fromRandom();
  }

  asyncFromRandom() {
    try {
      const _this2 = this;

      _this2.privKey = new _this2.PrivKey().fromRandom();
      return Promise.resolve(_this2.asyncFromPrivKey(_this2.privKey));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static asyncFromRandom() {
    return new this().asyncFromRandom();
  }

}

KeyPair.Mainnet = class extends KeyPair {
  constructor(privKey, pubKey) {
    super(privKey, pubKey, PrivKey.Mainnet);
  }

};
KeyPair.Testnet = class extends KeyPair {
  constructor(privKey, pubKey) {
    super(privKey, pubKey, PrivKey.Testnet);
  }

};

class Ecdsa extends Struct {
  constructor(sig, keyPair, hashBuf, k, endian, verified) {
    super({
      sig,
      keyPair,
      hashBuf,
      k,
      endian,
      verified
    });
  }

  toJSON() {
    return {
      sig: this.sig ? this.sig.toString() : undefined,
      keyPair: this.keyPair ? this.keyPair.toBuffer().toString('hex') : undefined,
      hashBuf: this.hashBuf ? this.hashBuf.toString('hex') : undefined,
      k: this.k ? this.k.toString() : undefined,
      endian: this.endian,
      verified: this.verified
    };
  }

  fromJSON(json) {
    this.sig = json.sig ? new Sig().fromString(json.sig) : undefined;
    this.keyPair = json.keyPair ? new KeyPair().fromBuffer(Buffer.from(json.keyPair, 'hex')) : undefined;
    this.hashBuf = json.hashBuf ? Buffer.from(json.hashBuf, 'hex') : undefined;
    this.k = json.k ? new Bn().fromString(json.k) : undefined;
    this.endian = json.endian;
    this.verified = json.verified;
    return this;
  }

  toBuffer() {
    const str = JSON.stringify(this.toJSON());
    return Buffer.from(str);
  }

  fromBuffer(buf) {
    const json = JSON.parse(buf.toString());
    return this.fromJSON(json);
  }

  calcrecovery() {
    for (let recovery = 0; recovery < 4; recovery++) {
      let Qprime;
      this.sig.recovery = recovery;

      try {
        Qprime = this.sig2PubKey();
      } catch (e) {
        continue;
      }

      if (Qprime.point.eq(this.keyPair.pubKey.point)) {
        const compressed = this.keyPair.pubKey.compressed;
        this.sig.compressed = this.keyPair.pubKey.compressed === undefined ? true : compressed;
        return this;
      }
    }

    this.sig.recovery = undefined;
    throw new Error('Unable to find valid recovery factor');
  }

  asyncCalcrecovery() {
    try {
      const _this = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this, 'calcrecovery', [])).then(function (workersResult) {
        return _this.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static calcrecovery(sig, pubKey, hashBuf) {
    const ecdsa = new Ecdsa().fromObject({
      sig: sig,
      keyPair: new KeyPair().fromObject({
        pubKey: pubKey
      }),
      hashBuf: hashBuf
    });
    return ecdsa.calcrecovery().sig;
  }

  static asyncCalcrecovery(sig, pubKey, hashBuf) {
    try {
      return Promise.resolve(Workers.asyncClassMethod(Ecdsa, 'calcrecovery', [sig, pubKey, hashBuf])).then(function (workersResult) {
        return new Sig().fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  fromString(str) {
    const obj = JSON.parse(str);

    if (obj.hashBuf) {
      this.hashBuf = Buffer.from(obj.hashBuf, 'hex');
    }

    if (obj.keyPair) {
      this.keyPair = new KeyPair().fromString(obj.keyPair);
    }

    if (obj.sig) {
      this.sig = new Sig().fromString(obj.sig);
    }

    if (obj.k) {
      this.k = new Bn(obj.k, 10);
    }

    return this;
  }

  randomK() {
    const N = Point.getN();
    let k;

    do {
      k = new Bn().fromBuffer(Random.getRandomBuffer(32));
    } while (!(k.lt(N) && k.gt(0)));

    this.k = k;
    return this;
  }

  deterministicK(badrs) {
    let v = Buffer.alloc(32);
    v.fill(0x01);
    let k = Buffer.alloc(32);
    k.fill(0x00);
    const x = this.keyPair.privKey.bn.toBuffer({
      size: 32
    });
    k = Hash.sha256Hmac(Buffer.concat([v, Buffer.from([0x00]), x, this.hashBuf]), k);
    v = Hash.sha256Hmac(v, k);
    k = Hash.sha256Hmac(Buffer.concat([v, Buffer.from([0x01]), x, this.hashBuf]), k);
    v = Hash.sha256Hmac(v, k);
    v = Hash.sha256Hmac(v, k);
    let T = new Bn().fromBuffer(v);
    const N = Point.getN();

    if (badrs === undefined) {
      badrs = 0;
    }

    for (let i = 0; i < badrs || !(T.lt(N) && T.gt(0)); i++) {
      k = Hash.sha256Hmac(Buffer.concat([v, Buffer.from([0x00])]), k);
      v = Hash.sha256Hmac(v, k);
      v = Hash.sha256Hmac(v, k);
      T = new Bn().fromBuffer(v);
    }

    this.k = T;
    return this;
  }

  sig2PubKey() {
    const recovery = this.sig.recovery;

    if (!(recovery === 0 || recovery === 1 || recovery === 2 || recovery === 3)) {
      throw new Error('i must be equal to 0, 1, 2, or 3');
    }

    const e = new Bn().fromBuffer(this.hashBuf);
    const r = this.sig.r;
    const s = this.sig.s;
    const isYOdd = recovery & 1;
    const isSecondKey = recovery >> 1;
    const n = Point.getN();
    const G = Point.getG();
    const x = isSecondKey ? r.add(n) : r;
    const R = Point.fromX(isYOdd, x);
    let errm = '';

    try {
      R.mul(n);
    } catch (err) {
      errm = err.message;
    }

    if (errm !== 'point mul out of range') {
      throw new Error('nR is not a valid curve point');
    }

    const eNeg = e.neg().umod(n);
    const rInv = r.invm(n);
    const Q = R.mul(s).add(G.mul(eNeg)).mul(rInv);
    const pubKey = new PubKey(Q);
    pubKey.compressed = this.sig.compressed;
    pubKey.validate();
    return pubKey;
  }

  asyncSig2PubKey() {
    try {
      const _this2 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'sig2PubKey', [])).then(function (workersResult) {
        return PubKey.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static sig2PubKey(sig, hashBuf) {
    const ecdsa = new Ecdsa().fromObject({
      sig: sig,
      hashBuf: hashBuf
    });
    return ecdsa.sig2PubKey();
  }

  static asyncSig2PubKey(sig, hashBuf) {
    try {
      const ecdsa = new Ecdsa().fromObject({
        sig: sig,
        hashBuf: hashBuf
      });
      return Promise.resolve(ecdsa.asyncSig2PubKey());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  verifyStr(enforceLowS = true) {
    if (!Buffer.isBuffer(this.hashBuf) || this.hashBuf.length !== 32) {
      return 'hashBuf must be a 32 byte buffer';
    }

    try {
      this.keyPair.pubKey.validate();
    } catch (e) {
      return 'Invalid pubKey: ' + e;
    }

    const r = this.sig.r;
    const s = this.sig.s;

    if (!(r.gt(0) && r.lt(Point.getN())) || !(s.gt(0) && s.lt(Point.getN()))) {
      return 'r and s not in range';
    }

    if (enforceLowS) {
      if (!this.sig.hasLowS()) {
        return 's is too high and does not satisfy low s contraint - see bip 62';
      }
    }

    const e = new Bn().fromBuffer(this.hashBuf, this.endian ? {
      endian: this.endian
    } : undefined);
    const n = Point.getN();
    const sinv = s.invm(n);
    const u1 = sinv.mul(e).mod(n);
    const u2 = sinv.mul(r).mod(n);
    const p = Point.getG().mulAdd(u1, this.keyPair.pubKey.point, u2);

    if (p.isInfinity()) {
      return 'p is infinity';
    }

    if (!(p.getX().mod(n).cmp(r) === 0)) {
      return 'Invalid signature';
    } else {
      return false;
    }
  }

  sign() {
    const hashBuf = this.endian === 'little' ? new Br(this.hashBuf).readReverse() : this.hashBuf;
    const privKey = this.keyPair.privKey;
    const d = privKey.bn;

    if (!hashBuf || !privKey || !d) {
      throw new Error('invalid parameters');
    }

    if (!Buffer.isBuffer(hashBuf) || hashBuf.length !== 32) {
      throw new Error('hashBuf must be a 32 byte buffer');
    }

    const N = Point.getN();
    const G = Point.getG();
    const e = new Bn().fromBuffer(hashBuf);
    let badrs = 0;
    let k, Q, r, s;

    do {
      if (!this.k || badrs > 0) {
        this.deterministicK(badrs);
      }

      badrs++;
      k = this.k;
      Q = G.mul(k);
      r = Q.getX().mod(N);
      s = k.invm(N).mul(e.add(d.mul(r))).mod(N);
    } while (r.cmp(0) <= 0 || s.cmp(0) <= 0);

    if (s.gt(new Bn().fromBuffer(Buffer.from('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0', 'hex')))) {
      s = Point.getN().sub(s);
    }

    this.sig = Sig.fromObject({
      r: r,
      s: s,
      compressed: this.keyPair.pubKey.compressed
    });
    return this;
  }

  asyncSign() {
    try {
      const _this3 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this3, 'sign', [])).then(function (workersResult) {
        return _this3.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  signRandomK() {
    this.randomK();
    return this.sign();
  }

  toString() {
    const obj = {};

    if (this.hashBuf) {
      obj.hashBuf = this.hashBuf.toString('hex');
    }

    if (this.keyPair) {
      obj.keyPair = this.keyPair.toString();
    }

    if (this.sig) {
      obj.sig = this.sig.toString();
    }

    if (this.k) {
      obj.k = this.k.toString();
    }

    return JSON.stringify(obj);
  }

  verify(enforceLowS = true) {
    if (!this.verifyStr(enforceLowS)) {
      this.verified = true;
    } else {
      this.verified = false;
    }

    return this;
  }

  asyncVerify(enforceLowS = true) {
    try {
      const _this4 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this4, 'verify', [enforceLowS])).then(function (workersResult) {
        return _this4.fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static sign(hashBuf, keyPair, endian) {
    return new Ecdsa().fromObject({
      hashBuf: hashBuf,
      endian: endian,
      keyPair: keyPair
    }).sign().sig;
  }

  static asyncSign(hashBuf, keyPair, endian) {
    try {
      const ecdsa = new Ecdsa().fromObject({
        hashBuf: hashBuf,
        endian: endian,
        keyPair: keyPair
      });
      return Promise.resolve(ecdsa.asyncSign()).then(function () {
        return ecdsa.sig;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static verify(hashBuf, sig, pubKey, endian, enforceLowS = true) {
    return new Ecdsa().fromObject({
      hashBuf: hashBuf,
      endian: endian,
      sig: sig,
      keyPair: new KeyPair().fromObject({
        pubKey: pubKey
      })
    }).verify(enforceLowS).verified;
  }

  static asyncVerify(hashBuf, sig, pubKey, endian, enforceLowS = true) {
    try {
      const ecdsa = new Ecdsa().fromObject({
        hashBuf: hashBuf,
        endian: endian,
        sig: sig,
        keyPair: new KeyPair().fromObject({
          pubKey: pubKey
        })
      });
      return Promise.resolve(ecdsa.asyncVerify(enforceLowS)).then(function () {
        return ecdsa.verified;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

}

class Bsm extends Struct {
  constructor(messageBuf, keyPair, sig, address, verified) {
    super({
      messageBuf,
      keyPair,
      sig,
      address,
      verified
    });
  }

  static magicHash(messageBuf) {
    if (!Buffer.isBuffer(messageBuf)) {
      throw new Error('messageBuf must be a buffer');
    }

    const bw = new Bw();
    bw.writeVarIntNum(Bsm.magicBytes.length);
    bw.write(Bsm.magicBytes);
    bw.writeVarIntNum(messageBuf.length);
    bw.write(messageBuf);
    const buf = bw.toBuffer();
    const hashBuf = Hash.sha256Sha256(buf);
    return hashBuf;
  }

  static asyncMagicHash(messageBuf) {
    try {
      const args = [messageBuf];
      return Promise.resolve(Workers.asyncClassMethod(Bsm, 'magicHash', args)).then(function (workersResult) {
        return workersResult.resbuf;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static sign(messageBuf, keyPair) {
    const m = new Bsm(messageBuf, keyPair);
    m.sign();
    const sigbuf = m.sig.toCompact();
    const sigstr = sigbuf.toString('base64');
    return sigstr;
  }

  static asyncSign(messageBuf, keyPair) {
    try {
      const args = [messageBuf, keyPair];
      return Promise.resolve(Workers.asyncClassMethod(Bsm, 'sign', args)).then(function (workersResult) {
        const sigstr = JSON.parse(workersResult.resbuf.toString());
        return sigstr;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static verify(messageBuf, sigstr, address) {
    const sigbuf = Buffer.from(sigstr, 'base64');
    const message = new Bsm();
    message.messageBuf = messageBuf;
    message.sig = new Sig().fromCompact(sigbuf);
    message.address = address;
    return message.verify().verified;
  }

  static asyncVerify(messageBuf, sigstr, address) {
    try {
      const args = [messageBuf, sigstr, address];
      return Promise.resolve(Workers.asyncClassMethod(Bsm, 'verify', args)).then(function (workersResult) {
        const res = JSON.parse(workersResult.resbuf.toString());
        return res;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  sign() {
    const hashBuf = Bsm.magicHash(this.messageBuf);
    const ecdsa = new Ecdsa().fromObject({
      hashBuf: hashBuf,
      keyPair: this.keyPair
    });
    ecdsa.sign();
    ecdsa.calcrecovery();
    this.sig = ecdsa.sig;
    return this;
  }

  verify() {
    const hashBuf = Bsm.magicHash(this.messageBuf);
    const ecdsa = new Ecdsa();
    ecdsa.hashBuf = hashBuf;
    ecdsa.sig = this.sig;
    ecdsa.keyPair = new KeyPair();
    ecdsa.keyPair.pubKey = ecdsa.sig2PubKey();

    if (!ecdsa.verify()) {
      this.verified = false;
      return this;
    }

    const address = new Address().fromPubKey(ecdsa.keyPair.pubKey, undefined, this.sig.compressed);

    if (cmp(address.hashBuf, this.address.hashBuf)) {
      this.verified = true;
    } else {
      this.verified = false;
    }

    return this;
  }

}

Bsm.magicBytes = Buffer.from('Bitcoin Signed Message:\n');

class BlockHeader extends Struct {
  constructor(versionBytesNum, prevBlockHashBuf, merkleRootBuf, time, bits, nonce) {
    super({
      versionBytesNum,
      prevBlockHashBuf,
      merkleRootBuf,
      time,
      bits,
      nonce
    });
  }

  fromJSON(json) {
    this.fromObject({
      versionBytesNum: json.versionBytesNum,
      prevBlockHashBuf: Buffer.from(json.prevBlockHashBuf, 'hex'),
      merkleRootBuf: Buffer.from(json.merkleRootBuf, 'hex'),
      time: json.time,
      bits: json.bits,
      nonce: json.nonce
    });
    return this;
  }

  toJSON() {
    return {
      versionBytesNum: this.versionBytesNum,
      prevBlockHashBuf: this.prevBlockHashBuf.toString('hex'),
      merkleRootBuf: this.merkleRootBuf.toString('hex'),
      time: this.time,
      bits: this.bits,
      nonce: this.nonce
    };
  }

  fromBr(br) {
    this.versionBytesNum = br.readUInt32LE();
    this.prevBlockHashBuf = br.read(32);
    this.merkleRootBuf = br.read(32);
    this.time = br.readUInt32LE();
    this.bits = br.readUInt32LE();
    this.nonce = br.readUInt32LE();
    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    bw.writeUInt32LE(this.versionBytesNum);
    bw.write(this.prevBlockHashBuf);
    bw.write(this.merkleRootBuf);
    bw.writeUInt32LE(this.time);
    bw.writeUInt32LE(this.bits);
    bw.writeUInt32LE(this.nonce);
    return bw;
  }

}

class Merkle extends Struct {
  constructor(hashBuf, buf, merkle1, merkle2) {
    super({
      hashBuf,
      buf,
      merkle1,
      merkle2
    });
  }

  hash() {
    if (this.hashBuf) {
      return this.hashBuf;
    }

    if (this.buf) {
      return Hash.sha256Sha256(this.buf);
    }

    const hashBuf1 = this.merkle1.hash();
    const hashBuf2 = this.merkle2.hash();
    this.buf = Buffer.concat([hashBuf1, hashBuf2]);
    return Hash.sha256Sha256(this.buf);
  }

  fromBuffers(bufs) {
    if (bufs.length < 1) {
      throw new Error('buffers must have a length');
    }

    bufs = bufs.slice();
    const log = Math.log2(bufs.length);

    if (!Number.isInteger(log)) {
      const lastval = bufs[bufs.length - 1];
      var len = Math.pow(2, Math.ceil(log));

      for (let i = bufs.length; i < len; i++) {
        bufs.push(lastval);
      }
    }

    const bufs1 = bufs.slice(0, bufs.length / 2);
    const bufs2 = bufs.slice(bufs.length / 2);
    this.fromBufferArrays(bufs1, bufs2);
    return this;
  }

  static fromBuffers(bufs) {
    return new this().fromBuffers(bufs);
  }

  fromBufferArrays(bufs1, bufs2) {
    if (bufs1.length === 1) {
      this.merkle1 = new Merkle(undefined, bufs1[0]);
      this.merkle2 = new Merkle(undefined, bufs2[0]);
      return this;
    }

    const bufs11 = bufs1.slice(0, bufs1.length / 2);
    const bufs12 = bufs1.slice(bufs1.length / 2);
    this.merkle1 = new Merkle().fromBufferArrays(bufs11, bufs12);
    const bufs21 = bufs2.slice(0, bufs2.length / 2);
    const bufs22 = bufs2.slice(bufs2.length / 2);
    this.merkle2 = new Merkle().fromBufferArrays(bufs21, bufs22);
    return this;
  }

  static fromBufferArrays(bufs1, bufs2) {
    return new this().fromBufferArrays(bufs1, bufs2);
  }

  leavesNum() {
    if (this.merkle1) {
      return this.merkle1.leavesNum() + this.merkle2.leavesNum();
    }

    if (this.buf) {
      return 1;
    }

    throw new Error('invalid number of leaves');
  }

}

class HashCache extends Struct {
  constructor(prevoutsHashBuf, sequenceHashBuf, outputsHashBuf) {
    super();
    this.fromObject({
      prevoutsHashBuf,
      sequenceHashBuf,
      outputsHashBuf
    });
  }

  fromBuffer(buf) {
    return this.fromJSON(JSON.parse(buf.toString()));
  }

  toBuffer() {
    return Buffer.from(JSON.stringify(this.toJSON()));
  }

  fromJSON(json) {
    this.prevoutsHashBuf = json.prevoutsHashBuf ? Buffer.from(json.prevoutsHashBuf, 'hex') : undefined;
    this.sequenceHashBuf = json.sequenceHashBuf ? Buffer.from(json.sequenceHashBuf, 'hex') : undefined;
    this.outputsHashBuf = json.outputsHashBuf ? Buffer.from(json.outputsHashBuf, 'hex') : undefined;
    return this;
  }

  toJSON() {
    return {
      prevoutsHashBuf: this.prevoutsHashBuf ? this.prevoutsHashBuf.toString('hex') : undefined,
      sequenceHashBuf: this.sequenceHashBuf ? this.sequenceHashBuf.toString('hex') : undefined,
      outputsHashBuf: this.outputsHashBuf ? this.outputsHashBuf.toString('hex') : undefined
    };
  }

}

class VarInt extends Struct {
  constructor(buf) {
    super({
      buf
    });
  }

  fromJSON(json) {
    this.fromObject({
      buf: Buffer.from(json, 'hex')
    });
    return this;
  }

  toJSON() {
    return this.buf.toString('hex');
  }

  fromBuffer(buf) {
    this.buf = buf;
    return this;
  }

  fromBr(br) {
    this.buf = br.readVarIntBuf();
    return this;
  }

  fromBn(bn) {
    this.buf = new Bw().writeVarIntBn(bn).toBuffer();
    return this;
  }

  static fromBn(bn) {
    return new this().fromBn(bn);
  }

  fromNumber(num) {
    this.buf = new Bw().writeVarIntNum(num).toBuffer();
    return this;
  }

  static fromNumber(num) {
    return new this().fromNumber(num);
  }

  toBuffer() {
    return this.buf;
  }

  toBn() {
    return new Br(this.buf).readVarIntBn();
  }

  toNumber() {
    return new Br(this.buf).readVarIntNum();
  }

}

class TxIn extends Struct {
  constructor(txHashBuf, txOutNum, scriptVi, script, nSequence = 0xffffffff) {
    super({
      txHashBuf,
      txOutNum,
      scriptVi,
      script,
      nSequence
    });
  }

  setScript(script) {
    this.scriptVi = VarInt.fromNumber(script.toBuffer().length);
    this.script = script;
    return this;
  }

  fromProperties(txHashBuf, txOutNum, script, nSequence) {
    this.fromObject({
      txHashBuf,
      txOutNum,
      nSequence
    });
    this.setScript(script);
    return this;
  }

  static fromProperties(txHashBuf, txOutNum, script, nSequence) {
    return new this().fromProperties(txHashBuf, txOutNum, script, nSequence);
  }

  fromJSON(json) {
    this.fromObject({
      txHashBuf: typeof json.txHashBuf !== 'undefined' ? Buffer.from(json.txHashBuf, 'hex') : undefined,
      txOutNum: json.txOutNum,
      scriptVi: typeof json.scriptVi !== 'undefined' ? VarInt.fromJSON(json.scriptVi) : undefined,
      script: typeof json.script !== 'undefined' ? Script.fromJSON(json.script) : undefined,
      nSequence: json.nSequence
    });
    return this;
  }

  toJSON() {
    return {
      txHashBuf: typeof this.txHashBuf !== 'undefined' ? this.txHashBuf.toString('hex') : undefined,
      txOutNum: this.txOutNum,
      scriptVi: typeof this.scriptVi !== 'undefined' ? this.scriptVi.toJSON() : undefined,
      script: typeof this.script !== 'undefined' ? this.script.toJSON() : undefined,
      nSequence: this.nSequence
    };
  }

  fromBr(br) {
    this.txHashBuf = br.read(32);
    this.txOutNum = br.readUInt32LE();
    this.scriptVi = VarInt.fromBuffer(br.readVarIntBuf());
    this.script = Script.fromBuffer(br.read(this.scriptVi.toNumber()));
    this.nSequence = br.readUInt32LE();
    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    bw.write(this.txHashBuf);
    bw.writeUInt32LE(this.txOutNum);
    bw.write(this.scriptVi.buf);
    bw.write(this.script.toBuffer());
    bw.writeUInt32LE(this.nSequence);
    return bw;
  }

  fromPubKeyHashTxOut(txHashBuf, txOutNum, txOut, pubKey) {
    const script = new Script();

    if (txOut.script.isPubKeyHashOut()) {
      script.writeOpCode(OpCode.OP_0);

      if (pubKey) {
        script.writeBuffer(pubKey.toBuffer());
      } else {
        script.writeOpCode(OpCode.OP_0);
      }
    } else {
      throw new Error('txOut must be of type pubKeyHash');
    }

    this.txHashBuf = txHashBuf;
    this.txOutNum = txOutNum;
    this.setScript(script);
    return this;
  }

  hasNullInput() {
    const hex = this.txHashBuf.toString('hex');

    if (hex === '0000000000000000000000000000000000000000000000000000000000000000' && this.txOutNum === 0xffffffff) {
      return true;
    }

    return false;
  }

  setNullInput() {
    this.txHashBuf = Buffer.alloc(32);
    this.txHashBuf.fill(0);
    this.txOutNum = 0xffffffff;
  }

}

TxIn.LOCKTIME_VERIFY_SEQUENCE = 1 << 0;
TxIn.SEQUENCE_FINAL = 0xffffffff;
TxIn.SEQUENCE_LOCKTIME_DISABLE_FLAG = 1 << 31;
TxIn.SEQUENCE_LOCKTIME_TYPE_FLAG = 1 << 22;
TxIn.SEQUENCE_LOCKTIME_MASK = 0x0000ffff;
TxIn.SEQUENCE_LOCKTIME_GRANULARITY = 9;

class TxOut extends Struct {
  constructor(valueBn, scriptVi, script) {
    super({
      valueBn,
      scriptVi,
      script
    });
  }

  setScript(script) {
    this.scriptVi = VarInt.fromNumber(script.toBuffer().length);
    this.script = script;
    return this;
  }

  fromProperties(valueBn, script) {
    this.fromObject({
      valueBn
    });
    this.setScript(script);
    return this;
  }

  static fromProperties(valueBn, script) {
    return new this().fromProperties(valueBn, script);
  }

  fromJSON(json) {
    this.fromObject({
      valueBn: new Bn().fromJSON(json.valueBn),
      scriptVi: new VarInt().fromJSON(json.scriptVi),
      script: new Script().fromJSON(json.script)
    });
    return this;
  }

  toJSON() {
    return {
      valueBn: this.valueBn.toJSON(),
      scriptVi: this.scriptVi.toJSON(),
      script: this.script.toJSON()
    };
  }

  fromBr(br) {
    this.valueBn = br.readUInt64LEBn();
    this.scriptVi = VarInt.fromNumber(br.readVarIntNum());
    this.script = new Script().fromBuffer(br.read(this.scriptVi.toNumber()));
    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    bw.writeUInt64LEBn(this.valueBn);
    bw.write(this.scriptVi.buf);
    bw.write(this.script.toBuffer());
    return bw;
  }

}

class Tx extends Struct {
  constructor(versionBytesNum = 1, txInsVi = VarInt.fromNumber(0), txIns = [], txOutsVi = VarInt.fromNumber(0), txOuts = [], nLockTime = 0) {
    super({
      versionBytesNum,
      txInsVi,
      txIns,
      txOutsVi,
      txOuts,
      nLockTime
    });
  }

  fromJSON(json) {
    const txIns = [];
    json.txIns.forEach(function (txIn) {
      txIns.push(new TxIn().fromJSON(txIn));
    });
    const txOuts = [];
    json.txOuts.forEach(function (txOut) {
      txOuts.push(new TxOut().fromJSON(txOut));
    });
    this.fromObject({
      versionBytesNum: json.versionBytesNum,
      txInsVi: new VarInt().fromJSON(json.txInsVi),
      txIns: txIns,
      txOutsVi: new VarInt().fromJSON(json.txOutsVi),
      txOuts: txOuts,
      nLockTime: json.nLockTime
    });
    return this;
  }

  toJSON() {
    const txIns = [];
    this.txIns.forEach(function (txIn) {
      txIns.push(txIn.toJSON());
    });
    const txOuts = [];
    this.txOuts.forEach(function (txOut) {
      txOuts.push(txOut.toJSON());
    });
    return {
      versionBytesNum: this.versionBytesNum,
      txInsVi: this.txInsVi.toJSON(),
      txIns: txIns,
      txOutsVi: this.txOutsVi.toJSON(),
      txOuts: txOuts,
      nLockTime: this.nLockTime
    };
  }

  fromBr(br) {
    this.versionBytesNum = br.readUInt32LE();
    this.txInsVi = new VarInt(br.readVarIntBuf());
    const txInsNum = this.txInsVi.toNumber();
    this.txIns = [];

    for (let i = 0; i < txInsNum; i++) {
      this.txIns.push(new TxIn().fromBr(br));
    }

    this.txOutsVi = new VarInt(br.readVarIntBuf());
    const txOutsNum = this.txOutsVi.toNumber();
    this.txOuts = [];

    for (let i = 0; i < txOutsNum; i++) {
      this.txOuts.push(new TxOut().fromBr(br));
    }

    this.nLockTime = br.readUInt32LE();
    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    bw.writeUInt32LE(this.versionBytesNum);
    bw.write(this.txInsVi.buf);

    for (let i = 0; i < this.txIns.length; i++) {
      this.txIns[i].toBw(bw);
    }

    bw.write(this.txOutsVi.buf);

    for (let i = 0; i < this.txOuts.length; i++) {
      this.txOuts[i].toBw(bw);
    }

    bw.writeUInt32LE(this.nLockTime);
    return bw;
  }

  hashPrevouts() {
    const bw = new Bw();

    for (const i in this.txIns) {
      const txIn = this.txIns[i];
      bw.write(txIn.txHashBuf);
      bw.writeUInt32LE(txIn.txOutNum);
    }

    return Hash.sha256Sha256(bw.toBuffer());
  }

  hashSequence() {
    const bw = new Bw();

    for (const i in this.txIns) {
      const txIn = this.txIns[i];
      bw.writeUInt32LE(txIn.nSequence);
    }

    return Hash.sha256Sha256(bw.toBuffer());
  }

  hashOutputs() {
    const bw = new Bw();

    for (const i in this.txOuts) {
      const txOut = this.txOuts[i];
      bw.write(txOut.toBuffer());
    }

    return Hash.sha256Sha256(bw.toBuffer());
  }

  sighash(nHashType, nIn, subScript, valueBn, flags = 0, hashCache = new HashCache()) {
    if (nHashType & Sig.SIGHASH_FORKID && flags & Tx.SCRIPT_ENABLE_SIGHASH_FORKID) {
      let hashPrevouts = Buffer.alloc(32, 0);
      let hashSequence = Buffer.alloc(32, 0);
      let hashOutputs = Buffer.alloc(32, 0);

      if (!(nHashType & Sig.SIGHASH_ANYONECANPAY)) {
        hashPrevouts = hashCache.prevoutsHashBuf ? hashCache.prevoutsHashBuf : hashCache.prevoutsHashBuf = this.hashPrevouts();
      }

      if (!(nHashType & Sig.SIGHASH_ANYONECANPAY) && (nHashType & 0x1f) !== Sig.SIGHASH_SINGLE && (nHashType & 0x1f) !== Sig.SIGHASH_NONE) {
        hashSequence = hashCache.sequenceHashBuf ? hashCache.sequenceHashBuf : hashCache.sequenceHashBuf = this.hashSequence();
      }

      if ((nHashType & 0x1f) !== Sig.SIGHASH_SINGLE && (nHashType & 0x1f) !== Sig.SIGHASH_NONE) {
        hashOutputs = hashCache.outputsHashBuf ? hashCache.outputsHashBuf : hashCache.outputsHashBuf = this.hashOutputs();
      } else if ((nHashType & 0x1f) === Sig.SIGHASH_SINGLE && nIn < this.txOuts.length) {
        hashOutputs = Hash.sha256Sha256(this.txOuts[nIn].toBuffer());
      }

      const bw = new Bw();
      bw.writeUInt32LE(this.versionBytesNum);
      bw.write(hashPrevouts);
      bw.write(hashSequence);
      bw.write(this.txIns[nIn].txHashBuf);
      bw.writeUInt32LE(this.txIns[nIn].txOutNum);
      bw.writeVarIntNum(subScript.toBuffer().length);
      bw.write(subScript.toBuffer());
      bw.writeUInt64LEBn(valueBn);
      bw.writeUInt32LE(this.txIns[nIn].nSequence);
      bw.write(hashOutputs);
      bw.writeUInt32LE(this.nLockTime);
      bw.writeUInt32LE(nHashType >>> 0);
      return new Br(Hash.sha256Sha256(bw.toBuffer())).readReverse();
    }

    const txcopy = this.cloneByBuffer();
    subScript = new Script().fromBuffer(subScript.toBuffer());
    subScript.removeCodeseparators();

    for (let i = 0; i < txcopy.txIns.length; i++) {
      txcopy.txIns[i] = TxIn.fromBuffer(txcopy.txIns[i].toBuffer()).setScript(new Script());
    }

    txcopy.txIns[nIn] = TxIn.fromBuffer(txcopy.txIns[nIn].toBuffer()).setScript(subScript);

    if ((nHashType & 31) === Sig.SIGHASH_NONE) {
      txcopy.txOuts.length = 0;
      txcopy.txOutsVi = VarInt.fromNumber(0);

      for (let i = 0; i < txcopy.txIns.length; i++) {
        if (i !== nIn) {
          txcopy.txIns[i].nSequence = 0;
        }
      }
    } else if ((nHashType & 31) === Sig.SIGHASH_SINGLE) {
      if (nIn > txcopy.txOuts.length - 1) {
        return Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
      }

      txcopy.txOuts.length = nIn + 1;
      txcopy.txOutsVi = VarInt.fromNumber(nIn + 1);

      for (let i = 0; i < txcopy.txOuts.length; i++) {
        if (i < nIn) {
          txcopy.txOuts[i] = TxOut.fromProperties(new Bn().fromBuffer(Buffer.from('ffffffffffffffff', 'hex')), new Script());
        }
      }

      for (let i = 0; i < txcopy.txIns.length; i++) {
        if (i !== nIn) {
          txcopy.txIns[i].nSequence = 0;
        }
      }
    }

    if (nHashType & Sig.SIGHASH_ANYONECANPAY) {
      txcopy.txIns[0] = txcopy.txIns[nIn];
      txcopy.txIns.length = 1;
      txcopy.txInsVi = VarInt.fromNumber(1);
    }

    const buf = new Bw().write(txcopy.toBuffer()).writeInt32LE(nHashType).toBuffer();
    return new Br(Hash.sha256Sha256(buf)).readReverse();
  }

  asyncSighash(nHashType, nIn, subScript, valueBn, flags = 0, hashCache = {}) {
    try {
      const _this = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this, 'sighash', [nHashType, nIn, subScript, valueBn, flags, hashCache])).then(function (workersResult) {
        return workersResult.resbuf;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  sign(keyPair, nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID, nIn, subScript, valueBn, flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID, hashCache = {}) {
    const hashBuf = this.sighash(nHashType, nIn, subScript, valueBn, flags, hashCache);
    const sig = Ecdsa.sign(hashBuf, keyPair, 'little').fromObject({
      nHashType: nHashType
    });
    return sig;
  }

  asyncSign(keyPair, nHashType, nIn, subScript, valueBn, flags, hashCache = {}) {
    try {
      const _this2 = this;

      if (nHashType === undefined) nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID;
      if (flags === undefined) flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID;
      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'sign', [keyPair, nHashType, nIn, subScript, valueBn, flags, hashCache])).then(function (workersResult) {
        return new Sig().fromFastBuffer(workersResult.resbuf);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  verify(sig, pubKey, nIn, subScript, enforceLowS = false, valueBn, flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID, hashCache = {}) {
    const hashBuf = this.sighash(sig.nHashType, nIn, subScript, valueBn, flags, hashCache);
    return Ecdsa.verify(hashBuf, sig, pubKey, 'little', enforceLowS);
  }

  asyncVerify(sig, pubKey, nIn, subScript, enforceLowS = false, valueBn, flags, hashCache = {}) {
    try {
      const _this3 = this;

      if (flags === undefined) flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID;
      return Promise.resolve(Workers.asyncObjectMethod(_this3, 'verify', [sig, pubKey, nIn, subScript, enforceLowS, valueBn, flags, hashCache])).then(function (workersResult) {
        return JSON.parse(workersResult.resbuf.toString());
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  hash() {
    return Hash.sha256Sha256(this.toBuffer());
  }

  asyncHash() {
    try {
      const _this4 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this4, 'hash', [])).then(function (workersResult) {
        return workersResult.resbuf;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  id() {
    return new Br(this.hash()).readReverse().toString('hex');
  }

  asyncId() {
    try {
      const _this5 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this5, 'id', [])).then(function (workersResult) {
        return JSON.parse(workersResult.resbuf.toString());
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  addTxIn(txHashBuf, txOutNum, script, nSequence) {
    let txIn;

    if (txHashBuf instanceof TxIn) {
      txIn = txHashBuf;
    } else {
      txIn = new TxIn().fromObject({
        txHashBuf,
        txOutNum,
        nSequence
      }).setScript(script);
    }

    this.txIns.push(txIn);
    this.txInsVi = VarInt.fromNumber(this.txInsVi.toNumber() + 1);
    return this;
  }

  addTxOut(valueBn, script) {
    let txOut;

    if (valueBn instanceof TxOut) {
      txOut = valueBn;
    } else {
      txOut = new TxOut().fromObject({
        valueBn
      }).setScript(script);
    }

    this.txOuts.push(txOut);
    this.txOutsVi = VarInt.fromNumber(this.txOutsVi.toNumber() + 1);
    return this;
  }

  isCoinbase() {
    return this.txIns.length === 1 && this.txIns[0].hasNullInput();
  }

  sort() {
    this.txIns.sort((first, second) => {
      return new Br(first.txHashBuf).readReverse().compare(new Br(second.txHashBuf).readReverse()) || first.txOutNum - second.txOutNum;
    });
    this.txOuts.sort((first, second) => {
      return first.valueBn.sub(second.valueBn).toNumber() || first.script.toBuffer().compare(second.script.toBuffer());
    });
    return this;
  }

}

Tx.MAX_MONEY = 21000000 * 1e8;
Tx.SCRIPT_ENABLE_SIGHASH_FORKID = 1 << 16;

class Block extends Struct {
  constructor(blockHeader, txsVi, txs) {
    super({
      blockHeader,
      txsVi,
      txs
    });
  }

  fromJSON(json) {
    const txs = [];
    json.txs.forEach(function (tx) {
      txs.push(new Tx().fromJSON(tx));
    });
    this.fromObject({
      blockHeader: new BlockHeader().fromJSON(json.blockHeader),
      txsVi: new VarInt().fromJSON(json.txsVi),
      txs: txs
    });
    return this;
  }

  toJSON() {
    const txs = [];
    this.txs.forEach(function (tx) {
      txs.push(tx.toJSON());
    });
    return {
      blockHeader: this.blockHeader.toJSON(),
      txsVi: this.txsVi.toJSON(),
      txs: txs
    };
  }

  fromBr(br) {
    this.blockHeader = new BlockHeader().fromBr(br);
    this.txsVi = new VarInt(br.readVarIntBuf());
    const txsNum = this.txsVi.toNumber();
    this.txs = [];

    for (let i = 0; i < txsNum; i++) {
      this.txs.push(new Tx().fromBr(br));
    }

    return this;
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    bw.write(this.blockHeader.toBuffer());
    bw.write(this.txsVi.buf);
    const txsNum = this.txsVi.toNumber();

    for (let i = 0; i < txsNum; i++) {
      this.txs[i].toBw(bw);
    }

    return bw;
  }

  hash() {
    return Hash.sha256Sha256(this.blockHeader.toBuffer());
  }

  asyncHash() {
    try {
      const _this = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this, 'hash', [])).then(function (workersResult) {
        return workersResult.resbuf;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  id() {
    return new Br(this.hash()).readReverse().toString('hex');
  }

  asyncId() {
    try {
      const _this2 = this;

      return Promise.resolve(Workers.asyncObjectMethod(_this2, 'id', [])).then(function (workersResult) {
        return JSON.parse(workersResult.resbuf.toString());
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  verifyMerkleRoot() {
    const txsbufs = this.txs.map(tx => tx.toBuffer());
    const merkleRootBuf = Merkle.fromBuffers(txsbufs).hash();
    return Buffer.compare(merkleRootBuf, this.blockHeader.merkleRootBuf);
  }

  static iterateTxs(blockBuf) {
    const br = new Br(blockBuf);
    const blockHeader = new BlockHeader().fromBr(br);
    const txsVi = new VarInt(br.readVarIntBuf());
    const txsNum = txsVi.toNumber();
    return {
      blockHeader,
      txsVi,
      txsNum,

      [Symbol.iterator]() {
        return /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var i;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < txsNum)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return new Tx().fromBr(br);

              case 4:
                i++;
                _context.next = 1;
                break;

              case 7:
              case "end":
                return _context.stop();
            }
          }, _callee);
        })();
      }

    };
  }

}

Block.MAX_BLOCK_SIZE = 1000000;

class Interp extends Struct {
  constructor(script, tx, nIn, stack = [], altStack = [], pc = 0, pBeginCodeHash = 0, nOpCount = 0, ifStack = [], errStr = '', flags = Interp.defaultFlags, valueBn = new Bn(0)) {
    super({
      script,
      tx,
      nIn,
      stack,
      altStack,
      pc,
      pBeginCodeHash,
      nOpCount,
      ifStack,
      errStr,
      flags,
      valueBn
    });
  }

  initialize() {
    this.script = new Script();
    this.stack = [];
    this.altStack = [];
    this.pc = 0;
    this.pBeginCodeHash = 0;
    this.nOpCount = 0;
    this.ifStack = [];
    this.errStr = '';
    this.flags = Interp.defaultFlags;
    return this;
  }

  fromJSON(json) {
    this.fromJSONNoTx(json);
    this.tx = json.tx ? new Tx().fromJSON(json.tx) : undefined;
    return this;
  }

  fromJSONNoTx(json) {
    this.fromObject({
      script: json.script !== undefined ? new Script().fromJSON(json.script) : undefined,
      nIn: json.nIn
    });
    this.stack = [];
    json.stack.forEach(function (hex) {
      this.stack.push(Buffer.from(hex, 'hex'));
    }.bind(this));
    this.altStack = [];
    json.altStack.forEach(function (hex) {
      this.altStack.push(Buffer.from(hex, 'hex'));
    }.bind(this));
    this.fromObject({
      pc: json.pc,
      pBeginCodeHash: json.pBeginCodeHash,
      nOpCount: json.nOpCount,
      ifStack: json.ifStack,
      errStr: json.errStr,
      flags: json.flags
    });
    return this;
  }

  fromBr(br) {
    let jsonNoTxBufLEn = br.readVarIntNum();
    let jsonNoTxBuf = br.read(jsonNoTxBufLEn);
    this.fromJSONNoTx(JSON.parse(jsonNoTxBuf.toString()));
    let txbuflen = br.readVarIntNum();

    if (txbuflen > 0) {
      let txbuf = br.read(txbuflen);
      this.tx = new Tx().fromFastBuffer(txbuf);
    }

    return this;
  }

  toJSON() {
    let json = this.toJSONNoTx();
    json.tx = this.tx ? this.tx.toJSON() : undefined;
    return json;
  }

  toJSONNoTx() {
    let stack = [];
    this.stack.forEach(function (buf) {
      stack.push(buf.toString('hex'));
    });
    let altStack = [];
    this.altStack.forEach(function (buf) {
      altStack.push(buf.toString('hex'));
    });
    return {
      script: this.script ? this.script.toJSON() : undefined,
      nIn: this.nIn,
      stack: stack,
      altStack: altStack,
      pc: this.pc,
      pBeginCodeHash: this.pBeginCodeHash,
      nOpCount: this.nOpCount,
      ifStack: this.ifStack,
      errStr: this.errStr,
      flags: this.flags
    };
  }

  toBw(bw) {
    if (!bw) {
      bw = new Bw();
    }

    let jsonNoTxBuf = Buffer.from(JSON.stringify(this.toJSONNoTx()));
    bw.writeVarIntNum(jsonNoTxBuf.length);
    bw.write(jsonNoTxBuf);

    if (this.tx) {
      let txbuf = this.tx.toFastBuffer();
      bw.writeVarIntNum(txbuf.length);
      bw.write(txbuf);
    } else {
      bw.writeVarIntNum(0);
    }

    return bw;
  }

  static getFlags(flagstr) {
    let flags = 0;

    if (flagstr.indexOf('NONE') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_NONE;
    }

    if (flagstr.indexOf('P2SH') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_P2SH;
    }

    if (flagstr.indexOf('STRICTENC') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_STRICTENC;
    }

    if (flagstr.indexOf('DERSIG') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_DERSIG;
    }

    if (flagstr.indexOf('LOW_S') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_LOW_S;
    }

    if (flagstr.indexOf('NULLDUMMY') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_NULLDUMMY;
    }

    if (flagstr.indexOf('SIGPUSHONLY') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_SIGPUSHONLY;
    }

    if (flagstr.indexOf('MINIMALDATA') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_MINIMALDATA;
    }

    if (flagstr.indexOf('DISCOURAGE_UPGRADABLE_NOPS') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS;
    }

    if (flagstr.indexOf('CLEANSTACK') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_CLEANSTACK;
    }

    if (flagstr.indexOf('CHECKLOCKTIMEVERIFY') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY;
    }

    if (flagstr.indexOf('CHECKSEQUENCEVERIFY') !== -1) {
      flags = flags | Interp.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY;
    }

    if (flagstr.indexOf('SIGHASH_FORKID') !== -1) {
      flags = flags | Interp.SCRIPT_ENABLE_SIGHASH_FORKID;
    }

    return flags;
  }

  static castToBool(buf) {
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] !== 0) {
        if (i === buf.length - 1 && buf[i] === 0x80) {
          return false;
        }

        return true;
      }
    }

    return false;
  }

  checkSigEncoding(buf) {
    if (buf.length === 0) {
      return true;
    }

    if ((this.flags & (Interp.SCRIPT_VERIFY_DERSIG | Interp.SCRIPT_VERIFY_LOW_S | Interp.SCRIPT_VERIFY_STRICTENC)) !== 0 && !Sig.IsTxDer(buf)) {
      this.errStr = 'SCRIPT_ERR_SIG_DER';
      return false;
    } else if ((this.flags & Interp.SCRIPT_VERIFY_LOW_S) !== 0) {
      let sig = new Sig().fromTxFormat(buf);

      if (!sig.hasLowS()) {
        this.errStr = 'SCRIPT_ERR_SIG_DER';
        return false;
      }
    } else if ((this.flags & Interp.SCRIPT_VERIFY_STRICTENC) !== 0) {
      let sig = new Sig().fromTxFormat(buf);

      if (!sig.hasDefinedHashType()) {
        this.errStr = 'SCRIPT_ERR_SIG_HASHTYPE';
        return false;
      }
    }

    return true;
  }

  checkPubKeyEncoding(buf) {
    if ((this.flags & Interp.SCRIPT_VERIFY_STRICTENC) !== 0 && !PubKey.isCompressedOrUncompressed(buf)) {
      this.errStr = 'SCRIPT_ERR_PUBKEYTYPE';
      return false;
    }

    return true;
  }

  checkLockTime(nLockTime) {
    if (!(this.tx.nLockTime < Interp.LOCKTIME_THRESHOLD && nLockTime < Interp.LOCKTIME_THRESHOLD || this.tx.nLockTime >= Interp.LOCKTIME_THRESHOLD && nLockTime >= Interp.LOCKTIME_THRESHOLD)) {
      return false;
    }

    if (nLockTime > this.tx.nLockTime) {
      return false;
    }

    if (TxIn.SEQUENCE_FINAL === this.tx.txIns[this.nIn].nSequence) {
      return false;
    }

    return true;
  }

  checkSequence(nSequence) {
    let txToSequence = this.tx.txIns[this.nIn].nSequence;

    if (this.tx.versionBytesNum < 2) {
      return false;
    }

    if (txToSequence & TxIn.SEQUENCE_LOCKTIME_DISABLE_FLAG) {
      return false;
    }

    let nLockTimeMask = TxIn.SEQUENCE_LOCKTIME_TYPE_FLAG | TxIn.SEQUENCE_LOCKTIME_MASK;
    let txToSequenceMasked = txToSequence & nLockTimeMask;
    let nSequenceMasked = nSequence & nLockTimeMask;

    if (!(txToSequenceMasked < TxIn.SEQUENCE_LOCKTIME_TYPE_FLAG && nSequenceMasked < TxIn.SEQUENCE_LOCKTIME_TYPE_FLAG || txToSequenceMasked >= TxIn.SEQUENCE_LOCKTIME_TYPE_FLAG && nSequenceMasked >= TxIn.SEQUENCE_LOCKTIME_TYPE_FLAG)) {
      return false;
    }

    if (nSequenceMasked > txToSequenceMasked) {
      return false;
    }

    return true;
  }

  eval() {
    var _this = this;

    return /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var fSuccess;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(_this.script.toBuffer().length > 10000)) {
              _context.next = 4;
              break;
            }

            _this.errStr = 'SCRIPT_ERR_SCRIPT_SIZE';
            _context.next = 4;
            return false;

          case 4:
            _context.prev = 4;

          case 5:
            if (!(_this.pc < _this.script.chunks.length)) {
              _context.next = 16;
              break;
            }

            fSuccess = _this.step();

            if (fSuccess) {
              _context.next = 12;
              break;
            }

            _context.next = 10;
            return false;

          case 10:
            _context.next = 14;
            break;

          case 12:
            _context.next = 14;
            return fSuccess;

          case 14:
            _context.next = 5;
            break;

          case 16:
            if (!(_this.stack.length + _this.altStack.length > 1000)) {
              _context.next = 20;
              break;
            }

            _this.errStr = 'SCRIPT_ERR_STACK_SIZE';
            _context.next = 20;
            return false;

          case 20:
            _context.next = 27;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](4);
            _this.errStr = 'SCRIPT_ERR_UNKNOWN_ERROR: ' + _context.t0;
            _context.next = 27;
            return false;

          case 27:
            if (!(_this.ifStack.length > 0)) {
              _context.next = 31;
              break;
            }

            _this.errStr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
            _context.next = 31;
            return false;

          case 31:
            _context.next = 33;
            return true;

          case 33:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 22]]);
    })();
  }

  step() {
    let fRequireMinimal = (this.flags & Interp.SCRIPT_VERIFY_MINIMALDATA) !== 0;
    let fExec = !(this.ifStack.indexOf(false) + 1);
    let chunk = this.script.chunks[this.pc];
    this.pc++;
    let opCodeNum = chunk.opCodeNum;

    if (opCodeNum === undefined) {
      this.errStr = 'SCRIPT_ERR_BAD_OPCODE';
      return false;
    }

    if (chunk.buf && chunk.buf.length > Interp.MAX_SCRIPT_ELEMENT_SIZE) {
      this.errStr = 'SCRIPT_ERR_PUSH_SIZE';
      return false;
    }

    if (opCodeNum > OpCode.OP_16 && ++this.nOpCount > 201) {
      this.errStr = 'SCRIPT_ERR_OP_COUNT';
      return false;
    }

    if (opCodeNum === OpCode.OP_LEFT || opCodeNum === OpCode.OP_RIGHT || opCodeNum === OpCode.OP_2MUL || opCodeNum === OpCode.OP_2DIV) {
      this.errStr = 'SCRIPT_ERR_DISABLED_OPCODE';
      return false;
    }

    if (fExec && opCodeNum >= 0 && opCodeNum <= OpCode.OP_PUSHDATA4) {
      if (fRequireMinimal && !this.script.checkMinimalPush(this.pc - 1)) {
        this.errStr = 'SCRIPT_ERR_MINIMALDATA';
        return false;
      }

      if (!chunk.buf) {
        this.stack.push(Interp.false);
      } else if (chunk.len !== chunk.buf.length) {
        throw new Error('LEngth of push value not equal to length of data');
      } else {
        this.stack.push(chunk.buf);
      }
    } else if (fExec || OpCode.OP_IF <= opCodeNum && opCodeNum <= OpCode.OP_ENDIF) {
      switch (opCodeNum) {
        case OpCode.OP_1NEGATE:
        case OpCode.OP_1:
        case OpCode.OP_2:
        case OpCode.OP_3:
        case OpCode.OP_4:
        case OpCode.OP_5:
        case OpCode.OP_6:
        case OpCode.OP_7:
        case OpCode.OP_8:
        case OpCode.OP_9:
        case OpCode.OP_10:
        case OpCode.OP_11:
        case OpCode.OP_12:
        case OpCode.OP_13:
        case OpCode.OP_14:
        case OpCode.OP_15:
        case OpCode.OP_16:
          {
            let n = opCodeNum - (OpCode.OP_1 - 1);
            let buf = new Bn(n).toScriptNumBuffer();
            this.stack.push(buf);
          }
          break;

        case OpCode.OP_NOP:
          break;

        case OpCode.OP_CHECKLOCKTIMEVERIFY:
          {
            if (!(this.flags & Interp.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY)) {
              if (this.flags & Interp.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
                this.errStr = 'SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS';
                return false;
              }

              break;
            }

            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let nLockTimebuf = this.stack[this.stack.length - 1];
            let nLockTimebn = new Bn().fromScriptNumBuffer(nLockTimebuf, fRequireMinimal, 5);
            let nLockTime = nLockTimebn.toNumber();

            if (nLockTime < 0) {
              this.errStr = 'SCRIPT_ERR_NEGATIVE_LOCKTIME';
              return false;
            }

            if (!this.checkLockTime(nLockTime)) {
              this.errStr = 'SCRIPT_ERR_UNSATISFIED_LOCKTIME';
              return false;
            }
          }
          break;

        case OpCode.OP_CHECKSEQUENCEVERIFY:
          {
            if (!(this.flags & Interp.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY)) {
              if (this.flags & Interp.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
                this.errStr = 'SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS';
                return false;
              }

              break;
            }

            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let nSequencebuf = this.stack[this.stack.length - 1];
            let nSequencebn = new Bn().fromScriptNumBuffer(nSequencebuf, fRequireMinimal, 5);
            let nSequence = nSequencebn.toNumber();

            if (nSequence < 0) {
              this.errStr = 'SCRIPT_ERR_NEGATIVE_LOCKTIME';
              return false;
            }

            if ((nSequence & TxIn.SEQUENCE_LOCKTIME_DISABLE_FLAG) !== 0) {
              break;
            }

            if (!this.checkSequence(nSequence)) {
              this.errStr = 'SCRIPT_ERR_UNSATISFIED_LOCKTIME';
              return false;
            }
          }
          break;

        case OpCode.OP_NOP1:
        case OpCode.OP_NOP3:
        case OpCode.OP_NOP4:
        case OpCode.OP_NOP5:
        case OpCode.OP_NOP6:
        case OpCode.OP_NOP7:
        case OpCode.OP_NOP8:
        case OpCode.OP_NOP9:
        case OpCode.OP_NOP10:
          if (this.flags & Interp.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS) {
            this.errStr = 'SCRIPT_ERR_DISCOURAGE_UPGRADABLE_NOPS';
            return false;
          }

          break;

        case OpCode.OP_IF:
        case OpCode.OP_NOTIF:
          {
            let fValue = false;

            if (fExec) {
              if (this.stack.length < 1) {
                this.errStr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
                return false;
              }

              let buf = this.stack.pop();
              fValue = Interp.castToBool(buf);

              if (opCodeNum === OpCode.OP_NOTIF) {
                fValue = !fValue;
              }
            }

            this.ifStack.push(fValue);
          }
          break;

        case OpCode.OP_ELSE:
          if (this.ifStack.length === 0) {
            this.errStr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
            return false;
          }

          this.ifStack[this.ifStack.length - 1] = !this.ifStack[this.ifStack.length - 1];
          break;

        case OpCode.OP_ENDIF:
          if (this.ifStack.length === 0) {
            this.errStr = 'SCRIPT_ERR_UNBALANCED_CONDITIONAL';
            return false;
          }

          this.ifStack.pop();
          break;

        case OpCode.OP_VERIFY:
          {
            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf = this.stack[this.stack.length - 1];
            let fValue = Interp.castToBool(buf);

            if (fValue) {
              this.stack.pop();
            } else {
              this.errStr = 'SCRIPT_ERR_VERIFY';
              return false;
            }
          }
          break;

        case OpCode.OP_RETURN:
          {
            this.errStr = 'SCRIPT_ERR_OP_RETURN';
            return false;
          }

        case OpCode.OP_TOALTSTACK:
          if (this.stack.length < 1) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.altStack.push(this.stack.pop());
          break;

        case OpCode.OP_FROMALTSTACK:
          if (this.altStack.length < 1) {
            this.errStr = 'SCRIPT_ERR_INVALID_ALTSTACK_OPERATION';
            return false;
          }

          this.stack.push(this.altStack.pop());
          break;

        case OpCode.OP_2DROP:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.stack.pop();
          this.stack.pop();
          break;

        case OpCode.OP_2DUP:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf1 = this.stack[this.stack.length - 2];
            let buf2 = this.stack[this.stack.length - 1];
            this.stack.push(buf1);
            this.stack.push(buf2);
          }
          break;

        case OpCode.OP_3DUP:
          {
            if (this.stack.length < 3) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf1 = this.stack[this.stack.length - 3];
            let buf2 = this.stack[this.stack.length - 2];
            let buf3 = this.stack[this.stack.length - 1];
            this.stack.push(buf1);
            this.stack.push(buf2);
            this.stack.push(buf3);
          }
          break;

        case OpCode.OP_2OVER:
          {
            if (this.stack.length < 4) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf1 = this.stack[this.stack.length - 4];
            let buf2 = this.stack[this.stack.length - 3];
            this.stack.push(buf1);
            this.stack.push(buf2);
          }
          break;

        case OpCode.OP_2ROT:
          {
            if (this.stack.length < 6) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let spliced = this.stack.splice(this.stack.length - 6, 2);
            this.stack.push(spliced[0]);
            this.stack.push(spliced[1]);
          }
          break;

        case OpCode.OP_2SWAP:
          {
            if (this.stack.length < 4) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let spliced = this.stack.splice(this.stack.length - 4, 2);
            this.stack.push(spliced[0]);
            this.stack.push(spliced[1]);
          }
          break;

        case OpCode.OP_IFDUP:
          {
            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf = this.stack[this.stack.length - 1];
            let fValue = Interp.castToBool(buf);

            if (fValue) {
              this.stack.push(buf);
            }
          }
          break;

        case OpCode.OP_DEPTH:
          {
            let buf = new Bn(this.stack.length).toScriptNumBuffer();
            this.stack.push(buf);
          }
          break;

        case OpCode.OP_DROP:
          if (this.stack.length < 1) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.stack.pop();
          break;

        case OpCode.OP_DUP:
          if (this.stack.length < 1) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.stack.push(this.stack[this.stack.length - 1]);
          break;

        case OpCode.OP_NIP:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.stack.splice(this.stack.length - 2, 1);
          break;

        case OpCode.OP_OVER:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.stack.push(this.stack[this.stack.length - 2]);
          break;

        case OpCode.OP_PICK:
        case OpCode.OP_ROLL:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf = this.stack[this.stack.length - 1];
            let bn = new Bn().fromScriptNumBuffer(buf, fRequireMinimal);
            let n = bn.toNumber();
            this.stack.pop();

            if (n < 0 || n >= this.stack.length) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            buf = this.stack[this.stack.length - n - 1];

            if (opCodeNum === OpCode.OP_ROLL) {
              this.stack.splice(this.stack.length - n - 1, 1);
            }

            this.stack.push(buf);
          }
          break;

        case OpCode.OP_ROT:
          {
            if (this.stack.length < 3) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let x1 = this.stack[this.stack.length - 3];
            let x2 = this.stack[this.stack.length - 2];
            let x3 = this.stack[this.stack.length - 1];
            this.stack[this.stack.length - 3] = x2;
            this.stack[this.stack.length - 2] = x3;
            this.stack[this.stack.length - 1] = x1;
          }
          break;

        case OpCode.OP_SWAP:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let x1 = this.stack[this.stack.length - 2];
            let x2 = this.stack[this.stack.length - 1];
            this.stack[this.stack.length - 2] = x2;
            this.stack[this.stack.length - 1] = x1;
          }
          break;

        case OpCode.OP_TUCK:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          this.stack.splice(this.stack.length - 2, 0, this.stack[this.stack.length - 1]);
          break;

        case OpCode.OP_SIZE:
          {
            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let bn = new Bn(this.stack[this.stack.length - 1].length);
            this.stack.push(bn.toScriptNumBuffer());
          }
          break;

        case OpCode.OP_OR:
        case OpCode.OP_AND:
        case OpCode.OP_XOR:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          let buf1 = this.stack[this.stack.length - 2];
          let buf2 = this.stack[this.stack.length - 1];

          if (buf1.length != buf2.length) {
            this.errStr = 'SCRIPT_ERR_INVALID_OPERAND_SIZE';
            return false;
          }

          switch (opCodeNum) {
            case OpCode.OP_AND:
              for (let i = 0; i < buf1.length; i++) {
                buf1[i] &= buf2[i];
              }

              break;

            case OpCode.OP_OR:
              for (let i = 0; i < buf1.length; i++) {
                buf1[i] |= buf2[i];
              }

              break;

            case OpCode.OP_XOR:
              for (let i = 0; i < buf1.length; i++) {
                buf1[i] ^= buf2[i];
              }

              break;
          }

          this.stack.pop();
          break;

        case OpCode.OP_INVERT:
          if (this.stack.length < 1) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          let buf = this.stack[this.stack.length - 1];

          for (let i = 0; i < buf.length; i++) {
            buf[i] = ~buf[i];
          }

          break;

        case OpCode.OP_LSHIFT:
        case OpCode.OP_RSHIFT:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf1 = this.stack[this.stack.length - 2];
            let value = new Bn(buf1);
            let n = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal).toNumber();

            if (n < 0) {
              this.errStr = 'SCRIPT_ERR_INVALID_NUMBER_RANGE';
              return false;
            }

            this.stack.pop();
            this.stack.pop();

            switch (opCodeNum) {
              case OpCode.OP_LSHIFT:
                value = value.ushln(n);
                break;

              case OpCode.OP_RSHIFT:
                value = value.ushrn(n);
                break;
            }

            let buf2 = value.toBuffer().slice(-buf1.length);

            if (buf2.length < buf1.length) {
              buf2 = Buffer.concat([Buffer.alloc(buf1.length - buf2.length), buf2]);
            }

            this.stack.push(buf2);
            break;
          }

        case OpCode.OP_EQUAL:
        case OpCode.OP_EQUALVERIFY:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf1 = this.stack[this.stack.length - 2];
            let buf2 = this.stack[this.stack.length - 1];
            let fEqual = cmp(buf1, buf2);
            this.stack.pop();
            this.stack.pop();
            this.stack.push(fEqual ? Interp.true : Interp.false);

            if (opCodeNum === OpCode.OP_EQUALVERIFY) {
              if (fEqual) {
                this.stack.pop();
              } else {
                this.errStr = 'SCRIPT_ERR_EQUALVERIFY';
                return false;
              }
            }
          }
          break;

        case OpCode.OP_1ADD:
        case OpCode.OP_1SUB:
        case OpCode.OP_NEGATE:
        case OpCode.OP_ABS:
        case OpCode.OP_NOT:
        case OpCode.OP_0NOTEQUAL:
          {
            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf = this.stack[this.stack.length - 1];
            let bn = new Bn().fromScriptNumBuffer(buf, fRequireMinimal);

            switch (opCodeNum) {
              case OpCode.OP_1ADD:
                bn = bn.add(1);
                break;

              case OpCode.OP_1SUB:
                bn = bn.sub(1);
                break;

              case OpCode.OP_NEGATE:
                bn = bn.neg();
                break;

              case OpCode.OP_ABS:
                if (bn.lt(0)) bn = bn.neg();
                break;

              case OpCode.OP_NOT:
                bn = new Bn(bn.eq(0) + 0);
                break;

              case OpCode.OP_0NOTEQUAL:
                bn = new Bn(bn.neq(0) + 0);
                break;
            }

            this.stack.pop();
            this.stack.push(bn.toScriptNumBuffer());
          }
          break;

        case OpCode.OP_ADD:
        case OpCode.OP_SUB:
        case OpCode.OP_MUL:
        case OpCode.OP_DIV:
        case OpCode.OP_MOD:
        case OpCode.OP_BOOLAND:
        case OpCode.OP_BOOLOR:
        case OpCode.OP_NUMEQUAL:
        case OpCode.OP_NUMEQUALVERIFY:
        case OpCode.OP_NUMNOTEQUAL:
        case OpCode.OP_LESSTHAN:
        case OpCode.OP_GREATERTHAN:
        case OpCode.OP_LESSTHANOREQUAL:
        case OpCode.OP_GREATERTHANOREQUAL:
        case OpCode.OP_MIN:
        case OpCode.OP_MAX:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let bn1 = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 2], fRequireMinimal);
            let bn2 = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal);
            let bn = new Bn(0);

            switch (opCodeNum) {
              case OpCode.OP_ADD:
                bn = bn1.add(bn2);
                break;

              case OpCode.OP_SUB:
                bn = bn1.sub(bn2);
                break;

              case OpCode.OP_MUL:
                bn = bn1.mul(bn2);
                break;

              case OpCode.OP_DIV:
                if (bn2 == 0) {
                  this.errStr = "SCRIPT_ERR_DIV_BY_ZERO";
                  return false;
                }

                bn = bn1.div(bn2);
                break;

              case OpCode.OP_MOD:
                if (bn2 == 0) {
                  this.errStr = "SCRIPT_ERR_DIV_BY_ZERO";
                  return false;
                }

                bn = bn1.mod(bn2);
                break;

              case OpCode.OP_BOOLAND:
                bn = new Bn((bn1.neq(0) && bn2.neq(0)) + 0);
                break;

              case OpCode.OP_BOOLOR:
                bn = new Bn((bn1.neq(0) || bn2.neq(0)) + 0);
                break;

              case OpCode.OP_NUMEQUAL:
                bn = new Bn(bn1.eq(bn2) + 0);
                break;

              case OpCode.OP_NUMEQUALVERIFY:
                bn = new Bn(bn1.eq(bn2) + 0);
                break;

              case OpCode.OP_NUMNOTEQUAL:
                bn = new Bn(bn1.neq(bn2) + 0);
                break;

              case OpCode.OP_LESSTHAN:
                bn = new Bn(bn1.lt(bn2) + 0);
                break;

              case OpCode.OP_GREATERTHAN:
                bn = new Bn(bn1.gt(bn2) + 0);
                break;

              case OpCode.OP_LESSTHANOREQUAL:
                bn = new Bn(bn1.leq(bn2) + 0);
                break;

              case OpCode.OP_GREATERTHANOREQUAL:
                bn = new Bn(bn1.geq(bn2) + 0);
                break;

              case OpCode.OP_MIN:
                bn = bn1.lt(bn2) ? bn1 : bn2;
                break;

              case OpCode.OP_MAX:
                bn = bn1.gt(bn2) ? bn1 : bn2;
                break;
            }

            this.stack.pop();
            this.stack.pop();
            this.stack.push(bn.toScriptNumBuffer());

            if (opCodeNum === OpCode.OP_NUMEQUALVERIFY) {
              if (Interp.castToBool(this.stack[this.stack.length - 1])) {
                this.stack.pop();
              } else {
                this.errStr = 'SCRIPT_ERR_NUMEQUALVERIFY';
                return false;
              }
            }
          }
          break;

        case OpCode.OP_WITHIN:
          {
            if (this.stack.length < 3) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let bn1 = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 3], fRequireMinimal);
            let bn2 = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 2], fRequireMinimal);
            let bn3 = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal);
            let fValue = bn2.leq(bn1) && bn1.lt(bn3);
            this.stack.pop();
            this.stack.pop();
            this.stack.pop();
            this.stack.push(fValue ? Interp.true : Interp.false);
          }
          break;

        case OpCode.OP_RIPEMD160:
        case OpCode.OP_SHA1:
        case OpCode.OP_SHA256:
        case OpCode.OP_HASH160:
        case OpCode.OP_HASH256:
          {
            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let buf = this.stack[this.stack.length - 1];
            let bufHash;

            if (opCodeNum === OpCode.OP_RIPEMD160) {
              bufHash = Hash.ripemd160(buf);
            } else if (opCodeNum === OpCode.OP_SHA1) {
              bufHash = Hash.sha1(buf);
            } else if (opCodeNum === OpCode.OP_SHA256) {
              bufHash = Hash.sha256(buf);
            } else if (opCodeNum === OpCode.OP_HASH160) {
              bufHash = Hash.sha256Ripemd160(buf);
            } else if (opCodeNum === OpCode.OP_HASH256) {
              bufHash = Hash.sha256Sha256(buf);
            }

            this.stack.pop();
            this.stack.push(bufHash);
          }
          break;

        case OpCode.OP_CODESEPARATOR:
          this.pBeginCodeHash = this.pc;
          break;

        case OpCode.OP_CHECKSIG:
        case OpCode.OP_CHECKSIGVERIFY:
          {
            if (this.stack.length < 2) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let bufSig = this.stack[this.stack.length - 2];
            let bufPubKey = this.stack[this.stack.length - 1];
            let subScript = new Script().fromObject({
              chunks: this.script.chunks.slice(this.pBeginCodeHash)
            });
            let nHashType = bufSig.length > 0 ? bufSig.readUInt8(bufSig.length - 1) : 0;

            if (nHashType & Sig.SIGHASH_FORKID) {
              if (!(this.flags & Interp.SCRIPT_ENABLE_SIGHASH_FORKID)) {
                this.errStr = 'SCRIPT_ERR_ILLEGAL_FORKID';
                return false;
              }
            } else {
              subScript.findAndDelete(new Script().writeBuffer(bufSig));
            }

            if (!this.checkSigEncoding(bufSig) || !this.checkPubKeyEncoding(bufPubKey)) {
              return false;
            }

            let fSuccess;

            try {
              let sig = new Sig().fromTxFormat(bufSig);
              let pubKey = new PubKey().fromBuffer(bufPubKey, false);
              fSuccess = this.tx.verify(sig, pubKey, this.nIn, subScript, Boolean(this.flags & Interp.SCRIPT_VERIFY_LOW_S), this.valueBn, this.flags);
            } catch (e) {
              fSuccess = false;
            }

            this.stack.pop();
            this.stack.pop();
            this.stack.push(fSuccess ? Interp.true : Interp.false);

            if (opCodeNum === OpCode.OP_CHECKSIGVERIFY) {
              if (fSuccess) {
                this.stack.pop();
              } else {
                this.errStr = 'SCRIPT_ERR_CHECKSIGVERIFY';
                return false;
              }
            }
          }
          break;

        case OpCode.OP_CHECKMULTISIG:
        case OpCode.OP_CHECKMULTISIGVERIFY:
          {
            let i = 1;

            if (this.stack.length < i) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let nKeysCount = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - i], fRequireMinimal).toNumber();

            if (nKeysCount < 0 || nKeysCount > 20) {
              this.errStr = 'SCRIPT_ERR_PUBKEY_COUNT';
              return false;
            }

            this.nOpCount += nKeysCount;

            if (this.nOpCount > 201) {
              this.errStr = 'SCRIPT_ERR_OP_COUNT';
              return false;
            }

            let ikey = ++i;
            i += nKeysCount;

            if (this.stack.length < i) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let nSigsCount = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - i], fRequireMinimal).toNumber();

            if (nSigsCount < 0 || nSigsCount > nKeysCount) {
              this.errStr = 'SCRIPT_ERR_SIG_COUNT';
              return false;
            }

            let isig = ++i;
            i += nSigsCount;

            if (this.stack.length < i) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            let subScript = new Script().fromObject({
              chunks: this.script.chunks.slice(this.pBeginCodeHash)
            });

            for (let k = 0; k < nSigsCount; k++) {
              let bufSig = this.stack[this.stack.length - isig - k];
              let nHashType = bufSig.length > 0 ? bufSig.readUInt8(bufSig.length - 1) : 0;

              if (nHashType & Sig.SIGHASH_FORKID) {
                if (!(this.flags & Interp.SCRIPT_ENABLE_SIGHASH_FORKID)) {
                  this.errStr = 'SCRIPT_ERR_ILLEGAL_FORKID';
                  return false;
                }
              } else {
                subScript.findAndDelete(new Script().writeBuffer(bufSig));
              }
            }

            let fSuccess = true;

            while (fSuccess && nSigsCount > 0) {
              let bufSig = this.stack[this.stack.length - isig];
              let bufPubKey = this.stack[this.stack.length - ikey];

              if (!this.checkSigEncoding(bufSig) || !this.checkPubKeyEncoding(bufPubKey)) {
                return false;
              }

              let fOk;

              try {
                let sig = new Sig().fromTxFormat(bufSig);
                let pubKey = new PubKey().fromBuffer(bufPubKey, false);
                fOk = this.tx.verify(sig, pubKey, this.nIn, subScript, Boolean(this.flags & Interp.SCRIPT_VERIFY_LOW_S), this.valueBn, this.flags);
              } catch (e) {
                fOk = false;
              }

              if (fOk) {
                isig++;
                nSigsCount--;
              }

              ikey++;
              nKeysCount--;

              if (nSigsCount > nKeysCount) {
                fSuccess = false;
              }
            }

            while (i-- > 1) {
              this.stack.pop();
            }

            if (this.stack.length < 1) {
              this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
              return false;
            }

            if (this.flags & Interp.SCRIPT_VERIFY_NULLDUMMY && this.stack[this.stack.length - 1].length) {
              this.errStr = 'SCRIPT_ERR_SIG_NULLDUMMY';
              return false;
            }

            this.stack.pop();
            this.stack.push(fSuccess ? Interp.true : Interp.false);

            if (opCodeNum === OpCode.OP_CHECKMULTISIGVERIFY) {
              if (fSuccess) {
                this.stack.pop();
              } else {
                this.errStr = 'SCRIPT_ERR_CHECKMULTISIGVERIFY';
                return false;
              }
            }
          }
          break;

        case OpCode.OP_CAT:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          let vch1 = this.stack[this.stack.length - 2];
          let vch2 = this.stack[this.stack.length - 1];
          this.stack[this.stack.length - 2] = Buffer.concat([vch1, vch2]);
          this.stack.pop();
          break;

        case OpCode.OP_SPLIT:
          if (this.stack.length < 2) {
            this.errStr = 'SCRIPT_ERR_INVALID_STACK_OPERATION';
            return false;
          }

          let data = this.stack[this.stack.length - 2];
          let position = new Bn().fromScriptNumBuffer(this.stack[this.stack.length - 1], fRequireMinimal);

          if (position.lt(0) || position.gt(data.length)) {
            this.errStr = 'SCRIPT_ERR_INVALID_SPLIT_RANGE';
            return false;
          }

          let n1 = data.slice(0, position);
          let n2 = data.slice(position);
          this.stack.pop();
          this.stack.pop();
          this.stack.push(n1);
          this.stack.push(n2);
          break;

        default:
          this.errStr = 'SCRIPT_ERR_BAD_OPCODE';
          return false;
      }
    }

    return true;
  }

  verify(scriptSig, scriptPubKey, tx, nIn, flags, valueBn) {
    let results = this.results(scriptSig, scriptPubKey, tx, nIn, flags, valueBn);

    for (let success of results) {
      if (!success) {
        return false;
      }
    }

    return true;
  }

  results(scriptSig, scriptPubKey, tx, nIn, flags, valueBn) {
    var _this2 = this;

    return /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var stackCopy, stack, buf, tmp, pubKeySerialized, scriptPubKey2;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _this2.fromObject({
              script: scriptSig,
              tx: tx,
              nIn: nIn,
              flags: flags,
              valueBn: valueBn
            });

            if (!((flags & Interp.SCRIPT_VERIFY_SIGPUSHONLY) !== 0 && !scriptSig.isPushOnly())) {
              _context2.next = 5;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_SIG_PUSHONLY';
            _context2.next = 5;
            return false;

          case 5:
            return _context2.delegateYield(_this2.eval(), "t0", 6);

          case 6:
            if (flags & Interp.SCRIPT_VERIFY_P2SH) {
              stackCopy = _this2.stack.slice();
            }

            stack = _this2.stack;

            _this2.initialize();

            _this2.fromObject({
              script: scriptPubKey,
              stack: stack,
              tx: tx,
              nIn: nIn,
              flags: flags,
              valueBn: valueBn
            });

            return _context2.delegateYield(_this2.eval(), "t1", 11);

          case 11:
            if (!(_this2.stack.length === 0)) {
              _context2.next = 15;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_EVAL_FALSE';
            _context2.next = 15;
            return false;

          case 15:
            buf = _this2.stack[_this2.stack.length - 1];

            if (Interp.castToBool(buf)) {
              _context2.next = 20;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_EVAL_FALSE';
            _context2.next = 20;
            return false;

          case 20:
            if (!(flags & Interp.SCRIPT_VERIFY_P2SH && scriptPubKey.isScriptHashOut())) {
              _context2.next = 48;
              break;
            }

            if (scriptSig.isPushOnly()) {
              _context2.next = 25;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_SIG_PUSHONLY';
            _context2.next = 25;
            return false;

          case 25:
            tmp = stack;
            stack = stackCopy;
            stackCopy = tmp;

            if (!(stack.length === 0)) {
              _context2.next = 30;
              break;
            }

            throw new Error('internal error - stack copy empty');

          case 30:
            pubKeySerialized = stack[stack.length - 1];
            scriptPubKey2 = new Script().fromBuffer(pubKeySerialized);
            stack.pop();

            _this2.initialize();

            _this2.fromObject({
              script: scriptPubKey2,
              stack: stack,
              tx: tx,
              nIn: nIn,
              flags: flags,
              valueBn: valueBn
            });

            return _context2.delegateYield(_this2.eval(), "t2", 36);

          case 36:
            if (!(stack.length === 0)) {
              _context2.next = 40;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_EVAL_FALSE';
            _context2.next = 40;
            return false;

          case 40:
            if (Interp.castToBool(stack[stack.length - 1])) {
              _context2.next = 46;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_EVAL_FALSE';
            _context2.next = 44;
            return false;

          case 44:
            _context2.next = 48;
            break;

          case 46:
            _context2.next = 48;
            return true;

          case 48:
            if (!((flags & Interp.SCRIPT_VERIFY_CLEANSTACK) !== 0)) {
              _context2.next = 55;
              break;
            }

            if (flags & Interp.SCRIPT_VERIFY_P2SH) {
              _context2.next = 51;
              break;
            }

            throw new Error('cannot use CLEANSTACK without P2SH');

          case 51:
            if (!(stack.length !== 1)) {
              _context2.next = 55;
              break;
            }

            _this2.errStr = _this2.errStr || 'SCRIPT_ERR_CLEANSTACK';
            _context2.next = 55;
            return false;

          case 55:
            _context2.next = 57;
            return true;

          case 57:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })();
  }

  getDebugObject() {
    let pc = this.pc - 1;
    return {
      errStr: this.errStr,
      scriptStr: this.script ? this.script.toString() : 'no script found',
      pc: pc,
      stack: this.stack.map(buf => buf.toString('hex')),
      altStack: this.altStack.map(buf => buf.toString('hex')),
      opCodeStr: this.script ? OpCode.fromNumber(this.script.chunks[pc].opCodeNum).toString() : 'no script found'
    };
  }

  getDebugString() {
    return JSON.stringify(this.getDebugObject(), null, 2);
  }

}

Interp.true = Buffer.from([1]);
Interp.false = Buffer.from([]);
Interp.MAX_SCRIPT_ELEMENT_SIZE = 520;
Interp.LOCKTIME_THRESHOLD = 500000000;
Interp.SCRIPT_VERIFY_NONE = 0;
Interp.SCRIPT_VERIFY_P2SH = 1 << 0;
Interp.SCRIPT_VERIFY_STRICTENC = 1 << 1;
Interp.SCRIPT_VERIFY_DERSIG = 1 << 2;
Interp.SCRIPT_VERIFY_LOW_S = 1 << 3;
Interp.SCRIPT_VERIFY_NULLDUMMY = 1 << 4;
Interp.SCRIPT_VERIFY_SIGPUSHONLY = 1 << 5;
Interp.SCRIPT_VERIFY_MINIMALDATA = 1 << 6;
Interp.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 1 << 7;
Interp.SCRIPT_VERIFY_CLEANSTACK = 1 << 8;
Interp.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY = 1 << 9;
Interp.SCRIPT_VERIFY_CHECKSEQUENCEVERIFY = 1 << 10;
Interp.SCRIPT_ENABLE_SIGHASH_FORKID = 1 << 16;
Interp.defaultFlags = Interp.SCRIPT_VERIFY_P2SH | Interp.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY;

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

class SigOperations extends Struct {
  constructor(map = new Map()) {
    super({
      map
    });
  }

  toJSON() {
    const json = {};
    this.map.forEach((arr, label) => {
      json[label] = arr.map(obj => ({
        nScriptChunk: obj.nScriptChunk,
        type: obj.type,
        addressStr: obj.addressStr,
        nHashType: obj.nHashType,
        log: obj.log
      }));
    });
    return json;
  }

  fromJSON(json) {
    Object.keys(json).forEach(label => {
      this.map.set(label, json[label].map(obj => ({
        nScriptChunk: obj.nScriptChunk,
        type: obj.type,
        addressStr: obj.addressStr,
        nHashType: obj.nHashType,
        log: obj.log
      })));
    });
    return this;
  }

  setOne(txHashBuf, txOutNum, nScriptChunk, type = 'sig', addressStr, nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID) {
    const label = txHashBuf.toString('hex') + ':' + txOutNum;
    const obj = {
      nScriptChunk,
      type,
      addressStr,
      nHashType
    };
    this.map.set(label, [obj]);
    return this;
  }

  setMany(txHashBuf, txOutNum, arr) {
    const label = txHashBuf.toString('hex') + ':' + txOutNum;
    arr = arr.map(obj => _extends({
      type: obj.type || 'sig',
      nHashType: obj.nHashType || Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID
    }, obj));
    this.map.set(label, arr);
    return this;
  }

  addOne(txHashBuf, txOutNum, nScriptChunk, type = 'sig', addressStr, nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID) {
    const arr = this.get(txHashBuf, txOutNum) || [];
    arr.push({
      nScriptChunk,
      type,
      addressStr,
      nHashType
    });
    this.setMany(txHashBuf, txOutNum, arr);
    return this;
  }

  get(txHashBuf, txOutNum) {
    const label = txHashBuf.toString('hex') + ':' + txOutNum;
    return this.map.get(label) || [];
  }

}

class TxOutMap extends Struct {
  constructor(map = new Map()) {
    super({
      map
    });
  }

  toJSON() {
    const json = {};
    this.map.forEach((txOut, label) => {
      json[label] = txOut.toHex();
    });
    return json;
  }

  fromJSON(json) {
    Object.keys(json).forEach(label => {
      this.map.set(label, TxOut.fromHex(json[label]));
    });
    return this;
  }

  set(txHashBuf, txOutNum, txOut) {
    const label = txHashBuf.toString('hex') + ':' + txOutNum;
    this.map.set(label, txOut);
    return this;
  }

  get(txHashBuf, txOutNum) {
    const label = txHashBuf.toString('hex') + ':' + txOutNum;
    return this.map.get(label);
  }

  setTx(tx) {
    const txhashhex = tx.hash().toString('hex');
    tx.txOuts.forEach((txOut, index) => {
      const label = txhashhex + ':' + index;
      this.map.set(label, txOut);
    });
    return this;
  }

}

const Constants$1 = Constants.Default.TxBuilder;

class TxBuilder extends Struct {
  constructor(tx = new Tx(), txIns = [], txOuts = [], uTxOutMap = new TxOutMap(), sigOperations = new SigOperations(), changeScript, changeAmountBn, feeAmountBn, feePerKbNum = Constants$1.feePerKbNum, nLockTime = 0, versionBytesNum = 1, sigsPerInput = 1, dust = Constants$1.dust, dustChangeToFees = false, hashCache = new HashCache()) {
    super({
      tx,
      txIns,
      txOuts,
      uTxOutMap,
      sigOperations,
      changeScript,
      changeAmountBn,
      feeAmountBn,
      feePerKbNum,
      nLockTime,
      versionBytesNum,
      sigsPerInput,
      dust,
      dustChangeToFees,
      hashCache
    });
  }

  toJSON() {
    const json = {};
    json.tx = this.tx.toHex();
    json.txIns = this.txIns.map(txIn => txIn.toHex());
    json.txOuts = this.txOuts.map(txOut => txOut.toHex());
    json.uTxOutMap = this.uTxOutMap.toJSON();
    json.sigOperations = this.sigOperations.toJSON();
    json.changeScript = this.changeScript ? this.changeScript.toHex() : undefined;
    json.changeAmountBn = this.changeAmountBn ? this.changeAmountBn.toNumber() : undefined;
    json.feeAmountBn = this.feeAmountBn ? this.feeAmountBn.toNumber() : undefined;
    json.feePerKbNum = this.feePerKbNum;
    json.sigsPerInput = this.sigsPerInput;
    json.dust = this.dust;
    json.dustChangeToFees = this.dustChangeToFees;
    json.hashCache = this.hashCache.toJSON();
    return json;
  }

  fromJSON(json) {
    this.tx = new Tx().fromHex(json.tx);
    this.txIns = json.txIns.map(txIn => TxIn.fromHex(txIn));
    this.txOuts = json.txOuts.map(txOut => TxOut.fromHex(txOut));
    this.uTxOutMap = new TxOutMap().fromJSON(json.uTxOutMap);
    this.sigOperations = new SigOperations().fromJSON(json.sigOperations);
    this.changeScript = json.changeScript ? new Script().fromHex(json.changeScript) : undefined;
    this.changeAmountBn = json.changeAmountBn ? new Bn(json.changeAmountBn) : undefined;
    this.feeAmountBn = json.feeAmountBn ? new Bn(json.feeAmountBn) : undefined;
    this.feePerKbNum = json.feePerKbNum || this.feePerKbNum;
    this.sigsPerInput = json.sigsPerInput || this.sigsPerInput;
    this.dust = json.dust || this.dust;
    this.dustChangeToFees = json.dustChangeToFees || this.dustChangeToFees;
    this.hashCache = HashCache.fromJSON(json.hashCache);
    return this;
  }

  setFeePerKbNum(feePerKbNum) {
    if (typeof feePerKbNum !== 'number' || feePerKbNum < 0) {
      throw new Error('cannot set a fee of zero or less');
    }

    this.feePerKbNum = feePerKbNum;
    return this;
  }

  setChangeAddress(changeAddress) {
    this.changeScript = changeAddress.toTxOutScript();
    return this;
  }

  setChangeScript(changeScript) {
    this.changeScript = changeScript;
    return this;
  }

  setNLocktime(nLockTime) {
    this.nLockTime = nLockTime;
    return this;
  }

  setVersion(versionBytesNum) {
    this.versionBytesNum = versionBytesNum;
    return this;
  }

  setDust(dust = Constants$1.dust) {
    this.dust = dust;
    return this;
  }

  sendDustChangeToFees(dustChangeToFees = false) {
    this.dustChangeToFees = dustChangeToFees;
    return this;
  }

  importPartiallySignedTx(tx, uTxOutMap = this.uTxOutMap, sigOperations = this.sigOperations) {
    this.tx = tx;
    this.uTxOutMap = uTxOutMap;
    this.sigOperations = sigOperations;
    return this;
  }

  inputFromScript(txHashBuf, txOutNum, txOut, script, nSequence) {
    if (!Buffer.isBuffer(txHashBuf) || !(typeof txOutNum === 'number') || !(txOut instanceof TxOut) || !(script instanceof Script)) {
      throw new Error('invalid one of: txHashBuf, txOutNum, txOut, script');
    }

    this.txIns.push(TxIn.fromProperties(txHashBuf, txOutNum, script, nSequence));
    this.uTxOutMap.set(txHashBuf, txOutNum, txOut);
    return this;
  }

  addSigOperation(txHashBuf, txOutNum, nScriptChunk, type, addressStr, nHashType) {
    this.sigOperations.addOne(txHashBuf, txOutNum, nScriptChunk, type, addressStr, nHashType);
    return this;
  }

  inputFromPubKeyHash(txHashBuf, txOutNum, txOut, pubKey, nSequence, nHashType) {
    if (!Buffer.isBuffer(txHashBuf) || typeof txOutNum !== 'number' || !(txOut instanceof TxOut)) {
      throw new Error('invalid one of: txHashBuf, txOutNum, txOut');
    }

    this.txIns.push(new TxIn().fromObject({
      nSequence
    }).fromPubKeyHashTxOut(txHashBuf, txOutNum, txOut, pubKey));
    this.uTxOutMap.set(txHashBuf, txOutNum, txOut);
    const addressStr = Address.fromTxOutScript(txOut.script).toString();
    this.addSigOperation(txHashBuf, txOutNum, 0, 'sig', addressStr, nHashType);
    this.addSigOperation(txHashBuf, txOutNum, 1, 'pubKey', addressStr);
    return this;
  }

  outputToAddress(valueBn, addr) {
    if (!(addr instanceof Address) || !(valueBn instanceof Bn)) {
      throw new Error('addr must be an Address, and valueBn must be a Bn');
    }

    const script = new Script().fromPubKeyHash(addr.hashBuf);
    this.outputToScript(valueBn, script);
    return this;
  }

  outputToScript(valueBn, script) {
    if (!(script instanceof Script) || !(valueBn instanceof Bn)) {
      throw new Error('script must be a Script, and valueBn must be a Bn');
    }

    const txOut = TxOut.fromProperties(valueBn, script);
    this.txOuts.push(txOut);
    return this;
  }

  buildOutputs() {
    let outAmountBn = new Bn(0);
    this.txOuts.forEach(txOut => {
      if (txOut.valueBn.lt(this.dust) && !txOut.script.isOpReturn() && !txOut.script.isSafeDataOut()) {
        throw new Error('cannot create output lesser than dust');
      }

      outAmountBn = outAmountBn.add(txOut.valueBn);
      this.tx.addTxOut(txOut);
    });
    return outAmountBn;
  }

  buildInputs(outAmountBn, extraInputsNum = 0) {
    let inAmountBn = new Bn(0);

    for (const txIn of this.txIns) {
      const txOut = this.uTxOutMap.get(txIn.txHashBuf, txIn.txOutNum);
      inAmountBn = inAmountBn.add(txOut.valueBn);
      this.tx.addTxIn(txIn);

      if (inAmountBn.geq(outAmountBn)) {
        if (extraInputsNum <= 0) {
          break;
        }

        extraInputsNum--;
      }
    }

    if (inAmountBn.lt(outAmountBn)) {
      throw new Error('not enough funds for outputs: inAmountBn ' + inAmountBn.toNumber() + ' outAmountBn ' + outAmountBn.toNumber());
    }

    return inAmountBn;
  }

  estimateSize() {
    const sigSize = 1 + 1 + 1 + 1 + 32 + 1 + 1 + 32 + 1 + 1;
    const pubKeySize = 1 + 1 + 33;
    let size = this.tx.toBuffer().length;
    this.tx.txIns.forEach(txIn => {
      const {
        txHashBuf,
        txOutNum
      } = txIn;
      const sigOperations = this.sigOperations.get(txHashBuf, txOutNum);
      sigOperations.forEach(obj => {
        const {
          nScriptChunk,
          type
        } = obj;
        const script = new Script([txIn.script.chunks[nScriptChunk]]);
        const scriptSize = script.toBuffer().length;
        size -= scriptSize;

        if (type === 'sig') {
          size += sigSize;
        } else if (obj.type === 'pubKey') {
          size += pubKeySize;
        } else {
          throw new Error('unsupported sig operations type');
        }
      });
    });
    size = size + 1;
    return Math.round(size);
  }

  estimateFee(extraFeeAmount = new Bn(0)) {
    const fee = Math.ceil(this.estimateSize() / 1000 * this.feePerKbNum);
    return new Bn(fee).add(extraFeeAmount);
  }

  build(opts = {
    useAllInputs: false
  }) {
    let minFeeAmountBn;

    if (this.txIns.length <= 0) {
      throw Error('tx-builder number of inputs must be greater than 0');
    }

    if (!this.changeScript) {
      throw new Error('must specify change script to use build method');
    }

    for (let extraInputsNum = opts.useAllInputs ? this.txIns.length - 1 : 0; extraInputsNum < this.txIns.length; extraInputsNum++) {
      this.tx = new Tx();
      const outAmountBn = this.buildOutputs();
      const changeTxOut = TxOut.fromProperties(new Bn(0), this.changeScript);
      this.tx.addTxOut(changeTxOut);
      let inAmountBn;

      try {
        inAmountBn = this.buildInputs(outAmountBn, extraInputsNum);
      } catch (err) {
        if (err.message.includes('not enough funds for outputs')) {
          throw new Error('unable to gather enough inputs for outputs and fee');
        } else {
          throw err;
        }
      }

      this.changeAmountBn = inAmountBn.sub(outAmountBn);
      changeTxOut.valueBn = this.changeAmountBn;
      minFeeAmountBn = this.estimateFee();

      if (this.changeAmountBn.geq(minFeeAmountBn) && this.changeAmountBn.sub(minFeeAmountBn).gt(this.dust)) {
        break;
      }
    }

    if (this.changeAmountBn.geq(minFeeAmountBn)) {
      this.feeAmountBn = minFeeAmountBn;
      this.changeAmountBn = this.changeAmountBn.sub(this.feeAmountBn);
      this.tx.txOuts[this.tx.txOuts.length - 1].valueBn = this.changeAmountBn;

      if (this.changeAmountBn.lt(this.dust)) {
        if (this.dustChangeToFees) {
          this.tx.txOuts.pop();
          this.tx.txOutsVi = VarInt.fromNumber(this.tx.txOutsVi.toNumber() - 1);
          this.feeAmountBn = this.feeAmountBn.add(this.changeAmountBn);
          this.changeAmountBn = new Bn(0);
        } else {
          throw new Error('unable to create change amount greater than dust');
        }
      }

      this.tx.nLockTime = this.nLockTime;
      this.tx.versionBytesNum = this.versionBytesNum;

      if (this.tx.txOuts.length === 0) {
        throw new Error('outputs length is zero - unable to create any outputs greater than dust');
      }

      return this;
    } else {
      throw new Error('unable to gather enough inputs for outputs and fee');
    }
  }

  sort() {
    this.tx.sort();
    return this;
  }

  static allSigsPresent(m, script) {
    let present = 0;

    for (let i = 1; i < script.chunks.length - 1; i++) {
      if (script.chunks[i].buf) {
        present++;
      }
    }

    return present === m;
  }

  static removeBlankSigs(script) {
    script = new Script(script.chunks.slice());

    for (let i = 1; i < script.chunks.length - 1; i++) {
      if (!script.chunks[i].buf) {
        script.chunks.splice(i, 1);
      }
    }

    return script;
  }

  fillSig(nIn, nScriptChunk, sig) {
    const txIn = this.tx.txIns[nIn];
    txIn.script.chunks[nScriptChunk] = new Script().writeBuffer(sig.toTxFormat()).chunks[0];
    txIn.scriptVi = VarInt.fromNumber(txIn.script.toBuffer().length);
    return this;
  }

  getSig(keyPair, nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID, nIn, subScript, flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID) {
    let valueBn;

    if (nHashType & Sig.SIGHASH_FORKID && flags & Tx.SCRIPT_ENABLE_SIGHASH_FORKID) {
      const txHashBuf = this.tx.txIns[nIn].txHashBuf;
      const txOutNum = this.tx.txIns[nIn].txOutNum;
      const txOut = this.uTxOutMap.get(txHashBuf, txOutNum);

      if (!txOut) {
        throw new Error('for SIGHASH_FORKID must provide UTXOs');
      }

      valueBn = txOut.valueBn;
    }

    return this.tx.sign(keyPair, nHashType, nIn, subScript, valueBn, flags, this.hashCache);
  }

  asyncGetSig(keyPair, nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID, nIn, subScript, flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID) {
    let valueBn;

    if (nHashType & Sig.SIGHASH_FORKID && flags & Tx.SCRIPT_ENABLE_SIGHASH_FORKID) {
      const txHashBuf = this.tx.txIns[nIn].txHashBuf;
      const txOutNum = this.tx.txIns[nIn].txOutNum;
      const txOut = this.uTxOutMap.get(txHashBuf, txOutNum);

      if (!txOut) {
        throw new Error('for SIGHASH_FORKID must provide UTXOs');
      }

      valueBn = txOut.valueBn;
    }

    return this.tx.asyncSign(keyPair, nHashType, nIn, subScript, valueBn, flags, this.hashCache);
  }

  signTxIn(nIn, keyPair, txOut, nScriptChunk, nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID, flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID) {
    const txIn = this.tx.txIns[nIn];
    const script = txIn.script;

    if (nScriptChunk === undefined && script.isPubKeyHashIn()) {
      nScriptChunk = 0;
    }

    if (nScriptChunk === undefined) {
      throw new Error('cannot sign unknown script type for input ' + nIn);
    }

    const txHashBuf = txIn.txHashBuf;
    const txOutNum = txIn.txOutNum;

    if (!txOut) {
      txOut = this.uTxOutMap.get(txHashBuf, txOutNum);
    }

    const outScript = txOut.script;
    const subScript = outScript;
    const sig = this.getSig(keyPair, nHashType, nIn, subScript, flags, this.hashCache);
    this.fillSig(nIn, nScriptChunk, sig);
    return this;
  }

  asyncSignTxIn(nIn, keyPair, txOut, nScriptChunk, nHashType, flags) {
    try {
      const _this = this;

      if (nHashType === undefined) nHashType = Sig.SIGHASH_ALL | Sig.SIGHASH_FORKID;
      if (flags === undefined) flags = Tx.SCRIPT_ENABLE_SIGHASH_FORKID;
      const txIn = _this.tx.txIns[nIn];
      const script = txIn.script;

      if (nScriptChunk === undefined && script.isPubKeyHashIn()) {
        nScriptChunk = 0;
      }

      if (nScriptChunk === undefined) {
        throw new Error('cannot sign unknown script type for input ' + nIn);
      }

      const txHashBuf = txIn.txHashBuf;
      const txOutNum = txIn.txOutNum;

      if (!txOut) {
        txOut = _this.uTxOutMap.get(txHashBuf, txOutNum);
      }

      const outScript = txOut.script;
      const subScript = outScript;
      return Promise.resolve(_this.asyncGetSig(keyPair, nHashType, nIn, subScript, flags, _this.hashCache)).then(function (sig) {
        _this.fillSig(nIn, nScriptChunk, sig);

        return _this;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  signWithKeyPairs(keyPairs) {
    const addressStrMap = {};

    for (const keyPair of keyPairs) {
      const addressStr = Address.fromPubKey(keyPair.pubKey).toString();
      addressStrMap[addressStr] = keyPair;
    }

    for (const nIn in this.tx.txIns) {
      const txIn = this.tx.txIns[nIn];
      const arr = this.sigOperations.get(txIn.txHashBuf, txIn.txOutNum);

      for (const obj of arr) {
        const {
          nScriptChunk,
          type,
          addressStr,
          nHashType
        } = obj;
        const keyPair = addressStrMap[addressStr];

        if (!keyPair) {
          obj.log = `cannot find keyPair for addressStr ${addressStr}`;
          continue;
        }

        const txOut = this.uTxOutMap.get(txIn.txHashBuf, txIn.txOutNum);

        if (type === 'sig') {
          this.signTxIn(nIn, keyPair, txOut, nScriptChunk, nHashType);
          obj.log = 'successfully inserted signature';
        } else if (type === 'pubKey') {
          txIn.script.chunks[nScriptChunk] = new Script().writeBuffer(keyPair.pubKey.toBuffer()).chunks[0];
          txIn.setScript(txIn.script);
          obj.log = 'successfully inserted public key';
        } else {
          obj.log = `cannot perform operation of type ${type}`;
          continue;
        }
      }
    }

    return this;
  }

}

function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    const observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}

const _Pact = /*#__PURE__*/function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    const result = new _Pact();
    const state = this.s;

    if (state) {
      const callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        const value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}

function _for(test, update, body) {
  var stage;

  for (;;) {
    var shouldContinue = test();

    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }

    if (!shouldContinue) {
      return result;
    }

    if (shouldContinue.then) {
      stage = 0;
      break;
    }

    var result = body();

    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }

    if (update) {
      var updateValue = update();

      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }

  var pact = new _Pact();

  var reject = _settle.bind(null, pact, 2);

  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;

  function _resumeAfterBody(value) {
    result = value;

    do {
      if (update) {
        updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }

      shouldContinue = test();

      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);

        return;
      }

      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }

      result = body();

      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);

    result.then(_resumeAfterBody).then(void 0, reject);
  }

  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }

  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}

class TxVerifier extends Struct {
  constructor(tx, txOutMap, errStr, interp) {
    super({
      tx,
      txOutMap,
      errStr,
      interp
    });
  }

  verify(flags = Interp.SCRIPT_ENABLE_SIGHASH_FORKID) {
    return !this.checkStr() && !this.verifyStr(flags);
  }

  asyncVerify(flags) {
    try {
      const _this = this;

      return Promise.resolve(_this.asyncVerifyStr(flags)).then(function (verifyStr) {
        return !_this.checkStr() && !verifyStr;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static verify(tx, txOutMap, flags) {
    return new TxVerifier(tx, txOutMap).verify(flags);
  }

  static asyncVerify(tx, txOutMap, flags) {
    return new TxVerifier(tx, txOutMap).asyncVerify(flags);
  }

  checkStr() {
    if (this.tx.txIns.length === 0 || this.tx.txInsVi.toNumber() === 0) {
      this.errStr = 'transaction txIns empty';
      return this.errStr;
    }

    if (this.tx.txOuts.length === 0 || this.tx.txOutsVi.toNumber() === 0) {
      this.errStr = 'transaction txOuts empty';
      return this.errStr;
    }

    if (this.tx.toBuffer().length > Block.MAX_BLOCK_SIZE) {
      this.errStr = 'transaction over the maximum block size';
      return this.errStr;
    }

    let valueoutbn = new Bn(0);

    for (let i = 0; i < this.tx.txOuts.length; i++) {
      const txOut = this.tx.txOuts[i];

      if (txOut.valueBn.lt(0)) {
        this.errStr = 'transaction txOut ' + i + ' negative';
        return this.errStr;
      }

      if (txOut.valueBn.gt(Tx.MAX_MONEY)) {
        this.errStr = 'transaction txOut ' + i + ' greater than MAX_MONEY';
        return this.errStr;
      }

      valueoutbn = valueoutbn.add(txOut.valueBn);

      if (valueoutbn.gt(Tx.MAX_MONEY)) {
        this.errStr = 'transaction txOut ' + i + ' total output greater than MAX_MONEY';
        return this.errStr;
      }
    }

    const txInmap = {};

    for (let i = 0; i < this.tx.txIns.length; i++) {
      const txIn = this.tx.txIns[i];
      const inputid = txIn.txHashBuf.toString('hex') + ':' + txIn.txOutNum;

      if (txInmap[inputid] !== undefined) {
        this.errStr = 'transaction input ' + i + ' duplicate input';
        return this.errStr;
      }

      txInmap[inputid] = true;
    }

    if (this.tx.isCoinbase()) {
      const buf = this.tx.txIns[0].script.toBuffer();

      if (buf.length < 2 || buf.length > 100) {
        this.errStr = 'coinbase trasaction script size invalid';
        return this.errStr;
      }
    } else {
      for (let i = 0; i < this.tx.txIns.length; i++) {
        if (this.tx.txIns[i].hasNullInput()) {
          this.errStr = 'transaction input ' + i + ' has null input';
          return this.errStr;
        }
      }
    }

    return false;
  }

  verifyStr(flags) {
    for (let i = 0; i < this.tx.txIns.length; i++) {
      if (!this.verifyNIn(i, flags)) {
        this.errStr = 'input ' + i + ' failed script verify';
        return this.errStr;
      }
    }

    return false;
  }

  asyncVerifyStr(flags) {
    try {
      let _exit;

      const _this2 = this;

      let i = 0;

      const _temp = _for(function () {
        return !_exit && i < _this2.tx.txIns.length;
      }, function () {
        return i++;
      }, function () {
        return Promise.resolve(_this2.asyncVerifyNIn(i, flags)).then(function (verifyNIn) {
          if (!verifyNIn) {
            _this2.errStr = 'input ' + i + ' failed script verify';
            _exit = 1;
            return _this2.errStr;
          }
        });
      });

      return Promise.resolve(_temp && _temp.then ? _temp.then(function (_result) {
        return _exit ? _result : false;
      }) : _exit ? _temp : false);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  verifyNIn(nIn, flags) {
    const txIn = this.tx.txIns[nIn];
    const scriptSig = txIn.script;
    const txOut = this.txOutMap.get(txIn.txHashBuf, txIn.txOutNum);

    if (!txOut) {
      console.log('output ' + txIn.txOutNum + ' not found');
      return false;
    }

    const scriptPubKey = txOut.script;
    const valueBn = txOut.valueBn;
    this.interp = new Interp();
    const verified = this.interp.verify(scriptSig, scriptPubKey, this.tx, nIn, flags, valueBn);
    return verified;
  }

  asyncVerifyNIn(nIn, flags) {
    try {
      const _this3 = this;

      const txIn = _this3.tx.txIns[nIn];
      const scriptSig = txIn.script;

      const txOut = _this3.txOutMap.get(txIn.txHashBuf, txIn.txOutNum);

      if (!txOut) {
        console.log('output ' + txIn.txOutNum + ' not found');
        return Promise.resolve(false);
      }

      const scriptPubKey = txOut.script;
      const valueBn = txOut.valueBn;
      _this3.interp = new Interp();
      return Promise.resolve(Workers.asyncObjectMethod(_this3.interp, 'verify', [scriptSig, scriptPubKey, _this3.tx, nIn, flags, valueBn])).then(function (workersResult) {
        const verified = JSON.parse(workersResult.resbuf.toString());
        return verified;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  getDebugObject() {
    return {
      errStr: this.errStr,
      interpFailure: this.interp ? this.interp.getDebugObject() : undefined
    };
  }

  getDebugString() {
    return JSON.stringify(this.getDebugObject(), null, 2);
  }

}

class Aes {}

Aes.encrypt = function (messageBuf, keyBuf) {
  const key = Aes.buf2Words(keyBuf);
  const message = Aes.buf2Words(messageBuf);
  const a = new _Aes(key);
  const enc = a.encrypt(message);
  const encBuf = Aes.words2Buf(enc);
  return encBuf;
};

Aes.decrypt = function (encBuf, keyBuf) {
  const enc = Aes.buf2Words(encBuf);
  const key = Aes.buf2Words(keyBuf);
  const a = new _Aes(key);
  const message = a.decrypt(enc);
  const messageBuf = Aes.words2Buf(message);
  return messageBuf;
};

Aes.buf2Words = function (buf) {
  if (buf.length % 4) {
    throw new Error('buf length must be a multiple of 4');
  }

  const words = [];

  for (let i = 0; i < buf.length / 4; i++) {
    words.push(buf.readUInt32BE(i * 4));
  }

  return words;
};

Aes.words2Buf = function (words) {
  const buf = Buffer.alloc(words.length * 4);

  for (let i = 0; i < words.length; i++) {
    buf.writeUInt32BE(words[i], i * 4);
  }

  return buf;
};

class Cbc {}

Cbc.buf2BlocksBuf = function (buf, blockSize) {
  const bytesize = blockSize / 8;
  const blockBufs = [];

  for (let i = 0; i <= buf.length / bytesize; i++) {
    let blockBuf = buf.slice(i * bytesize, i * bytesize + bytesize);

    if (blockBuf.length < blockSize) {
      blockBuf = Cbc.pkcs7Pad(blockBuf, blockSize);
    }

    blockBufs.push(blockBuf);
  }

  return blockBufs;
};

Cbc.blockBufs2Buf = function (blockBufs) {
  let last = blockBufs[blockBufs.length - 1];
  last = Cbc.pkcs7Unpad(last);
  blockBufs[blockBufs.length - 1] = last;
  const buf = Buffer.concat(blockBufs);
  return buf;
};

Cbc.encrypt = function (messageBuf, ivBuf, blockCipher, cipherKeyBuf) {
  const blockSize = ivBuf.length * 8;
  const blockBufs = Cbc.buf2BlocksBuf(messageBuf, blockSize);
  const encBufs = Cbc.encryptBlocks(blockBufs, ivBuf, blockCipher, cipherKeyBuf);
  const encBuf = Buffer.concat(encBufs);
  return encBuf;
};

Cbc.decrypt = function (encBuf, ivBuf, blockCipher, cipherKeyBuf) {
  const bytesize = ivBuf.length;
  const encBufs = [];

  for (let i = 0; i < encBuf.length / bytesize; i++) {
    encBufs.push(encBuf.slice(i * bytesize, i * bytesize + bytesize));
  }

  const blockBufs = Cbc.decryptBlocks(encBufs, ivBuf, blockCipher, cipherKeyBuf);
  const buf = Cbc.blockBufs2Buf(blockBufs);
  return buf;
};

Cbc.encryptBlock = function (blockBuf, ivBuf, blockCipher, cipherKeyBuf) {
  const xorbuf = Cbc.xorBufs(blockBuf, ivBuf);
  const encBuf = blockCipher.encrypt(xorbuf, cipherKeyBuf);
  return encBuf;
};

Cbc.decryptBlock = function (encBuf, ivBuf, blockCipher, cipherKeyBuf) {
  const xorbuf = blockCipher.decrypt(encBuf, cipherKeyBuf);
  const blockBuf = Cbc.xorBufs(xorbuf, ivBuf);
  return blockBuf;
};

Cbc.encryptBlocks = function (blockBufs, ivBuf, blockCipher, cipherKeyBuf) {
  const encBufs = [];

  for (let i = 0; i < blockBufs.length; i++) {
    const blockBuf = blockBufs[i];
    const encBuf = Cbc.encryptBlock(blockBuf, ivBuf, blockCipher, cipherKeyBuf);
    encBufs.push(encBuf);
    ivBuf = encBuf;
  }

  return encBufs;
};

Cbc.decryptBlocks = function (encBufs, ivBuf, blockCipher, cipherKeyBuf) {
  const blockBufs = [];

  for (let i = 0; i < encBufs.length; i++) {
    const encBuf = encBufs[i];
    const blockBuf = Cbc.decryptBlock(encBuf, ivBuf, blockCipher, cipherKeyBuf);
    blockBufs.push(blockBuf);
    ivBuf = encBuf;
  }

  return blockBufs;
};

Cbc.pkcs7Pad = function (buf, blockSize) {
  const bytesize = blockSize / 8;
  const padbytesize = bytesize - buf.length;
  const pad = Buffer.alloc(padbytesize);
  pad.fill(padbytesize);
  const paddedbuf = Buffer.concat([buf, pad]);
  return paddedbuf;
};

Cbc.pkcs7Unpad = function (paddedbuf) {
  const padlength = paddedbuf[paddedbuf.length - 1];
  const padbuf = paddedbuf.slice(paddedbuf.length - padlength, paddedbuf.length);
  const padbuf2 = Buffer.alloc(padlength);
  padbuf2.fill(padlength);

  if (!cmp(padbuf, padbuf2)) {
    throw new Error('invalid padding');
  }

  return paddedbuf.slice(0, paddedbuf.length - padlength);
};

Cbc.xorBufs = function (buf1, buf2) {
  if (buf1.length !== buf2.length) {
    throw new Error('bufs must have the same length');
  }

  const buf = Buffer.alloc(buf1.length);

  for (let i = 0; i < buf1.length; i++) {
    buf[i] = buf1[i] ^ buf2[i];
  }

  return buf;
};

class Aescbc {}

Aescbc.encrypt = function (messageBuf, cipherKeyBuf, ivBuf, concatIvBuf = true) {
  ivBuf = ivBuf || Random.getRandomBuffer(128 / 8);
  const ctBuf = Cbc.encrypt(messageBuf, ivBuf, Aes, cipherKeyBuf);

  if (concatIvBuf) {
    return Buffer.concat([ivBuf, ctBuf]);
  } else {
    return ctBuf;
  }
};

Aescbc.decrypt = function (encBuf, cipherKeyBuf, ivBuf = false) {
  if (!ivBuf) {
    const ivBuf = encBuf.slice(0, 128 / 8);
    const ctBuf = encBuf.slice(128 / 8);
    return Cbc.decrypt(ctBuf, ivBuf, Aes, cipherKeyBuf);
  } else {
    const ctBuf = encBuf;
    return Cbc.decrypt(ctBuf, ivBuf, Aes, cipherKeyBuf);
  }
};

class Ach {}

Ach.encrypt = function (messageBuf, cipherKeyBuf, ivBuf) {
  const encBuf = Aescbc.encrypt(messageBuf, cipherKeyBuf, ivBuf);
  const hmacbuf = Hash.sha256Hmac(encBuf, cipherKeyBuf);
  return Buffer.concat([hmacbuf, encBuf]);
};

Ach.asyncEncrypt = function (messageBuf, cipherKeyBuf, ivBuf) {
  try {
    if (!ivBuf) {
      ivBuf = Random.getRandomBuffer(128 / 8);
    }

    const args = [messageBuf, cipherKeyBuf, ivBuf];
    return Promise.resolve(Workers.asyncClassMethod(Ach, 'encrypt', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

Ach.decrypt = function (encBuf, cipherKeyBuf) {
  if (encBuf.length < (256 + 128 + 128) / 8) {
    throw new Error('The encrypted data must be at least 256+128+128 bits, which is the length of the Hmac plus the iv plus the smallest encrypted data size');
  }

  const hmacbuf = encBuf.slice(0, 256 / 8);
  encBuf = encBuf.slice(256 / 8, encBuf.length);
  const hmacbuf2 = Hash.sha256Hmac(encBuf, cipherKeyBuf);

  if (!cmp(hmacbuf, hmacbuf2)) {
    throw new Error('Message authentication failed - Hmacs are not equivalent');
  }

  return Aescbc.decrypt(encBuf, cipherKeyBuf);
};

Ach.asyncDecrypt = function (encBuf, cipherKeyBuf) {
  try {
    const args = [encBuf, cipherKeyBuf];
    return Promise.resolve(Workers.asyncClassMethod(Ach, 'decrypt', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

class Ecies {}

Ecies.ivkEkM = function (privKey, pubKey) {
  const r = privKey.bn;
  const KB = pubKey.point;
  const P = KB.mul(r);
  const S = new PubKey(P);
  const Sbuf = S.toBuffer();
  const hash = Hash.sha512(Sbuf);
  return {
    iv: hash.slice(0, 16),
    kE: hash.slice(16, 32),
    kM: hash.slice(32, 64)
  };
};

Ecies.electrumEncrypt = function (messageBuf, toPubKey, fromKeyPair, noKey = false) {
  if (!Buffer.isBuffer(messageBuf)) {
    throw new Error('messageBuf must be a buffer');
  }

  let Rbuf;

  if (fromKeyPair === null) {
    fromKeyPair = KeyPair.fromRandom();
  }

  if (!noKey) {
    Rbuf = fromKeyPair.pubKey.toDer(true);
  }

  const {
    iv,
    kE,
    kM
  } = Ecies.ivkEkM(fromKeyPair.privKey, toPubKey);
  const ciphertext = Aescbc.encrypt(messageBuf, kE, iv, false);
  const BIE1 = Buffer.from('BIE1');
  let encBuf;

  if (Rbuf) {
    encBuf = Buffer.concat([BIE1, Rbuf, ciphertext]);
  } else {
    encBuf = Buffer.concat([BIE1, ciphertext]);
  }

  const hmac = Hash.sha256Hmac(encBuf, kM);
  return Buffer.concat([encBuf, hmac]);
};

Ecies.electrumDecrypt = function (encBuf, toPrivKey, fromPubKey = null) {
  if (!Buffer.isBuffer(encBuf)) {
    throw new Error('encBuf must be a buffer');
  }

  const tagLength = 32;
  const magic = encBuf.slice(0, 4);

  if (!magic.equals(Buffer.from('BIE1'))) {
    throw new Error('Invalid Magic');
  }

  let offset = 4;

  if (fromPubKey === null) {
    const pub = encBuf.slice(4, 37);
    fromPubKey = PubKey.fromDer(pub);
    offset = 37;
  }

  const {
    iv,
    kE,
    kM
  } = Ecies.ivkEkM(toPrivKey, fromPubKey);
  const ciphertext = encBuf.slice(offset, encBuf.length - tagLength);
  const hmac = encBuf.slice(encBuf.length - tagLength, encBuf.length);
  const hmac2 = Hash.sha256Hmac(encBuf.slice(0, encBuf.length - tagLength), kM);

  if (!hmac.equals(hmac2)) {
    throw new Error('Invalid checksum');
  }

  return Aescbc.decrypt(ciphertext, kE, iv);
};

Ecies.bitcoreEncrypt = function (messageBuf, toPubKey, fromKeyPair, ivBuf) {
  if (!fromKeyPair) {
    fromKeyPair = KeyPair.fromRandom();
  }

  const r = fromKeyPair.privKey.bn;
  const RPubKey = fromKeyPair.pubKey;
  const RBuf = RPubKey.toDer(true);
  const KB = toPubKey.point;
  const P = KB.mul(r);
  const S = P.getX();
  const Sbuf = S.toBuffer({
    size: 32
  });
  const kEkM = Hash.sha512(Sbuf);
  const kE = kEkM.slice(0, 32);
  const kM = kEkM.slice(32, 64);
  const c = Aescbc.encrypt(messageBuf, kE, ivBuf);
  const d = Hash.sha256Hmac(c, kM);
  const encBuf = Buffer.concat([RBuf, c, d]);
  return encBuf;
};

Ecies.asyncBitcoreEncrypt = function (messageBuf, toPubKey, fromKeyPair, ivBuf) {
  try {
    function _temp2() {
      if (!ivBuf) {
        ivBuf = Random.getRandomBuffer(128 / 8);
      }

      const args = [messageBuf, toPubKey, fromKeyPair, ivBuf];
      return Promise.resolve(Workers.asyncClassMethod(Ecies, 'bitcoreEncrypt', args)).then(function (workersResult) {
        return workersResult.resbuf;
      });
    }

    const _temp = function () {
      if (!fromKeyPair) {
        return Promise.resolve(KeyPair.asyncFromRandom()).then(function (_KeyPair$asyncFromRan) {
          fromKeyPair = _KeyPair$asyncFromRan;
        });
      }
    }();

    return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
  } catch (e) {
    return Promise.reject(e);
  }
};

Ecies.bitcoreDecrypt = function (encBuf, toPrivKey) {
  const kB = toPrivKey.bn;
  const fromPubKey = PubKey.fromDer(encBuf.slice(0, 33));
  const R = fromPubKey.point;
  const P = R.mul(kB);

  if (P.eq(new Point())) {
    throw new Error('P equals 0');
  }

  const S = P.getX();
  const Sbuf = S.toBuffer({
    size: 32
  });
  const kEkM = Hash.sha512(Sbuf);
  const kE = kEkM.slice(0, 32);
  const kM = kEkM.slice(32, 64);
  const c = encBuf.slice(33, encBuf.length - 32);
  const d = encBuf.slice(encBuf.length - 32, encBuf.length);
  const d2 = Hash.sha256Hmac(c, kM);

  if (!cmp(d, d2)) {
    throw new Error('Invalid checksum');
  }

  const messageBuf = Aescbc.decrypt(c, kE);
  return messageBuf;
};

Ecies.asyncBitcoreDecrypt = function (encBuf, toPrivKey) {
  try {
    const args = [encBuf, toPrivKey];
    return Promise.resolve(Workers.asyncClassMethod(Ecies, 'bitcoreDecrypt', args)).then(function (workersResult) {
      return workersResult.resbuf;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

const deps = {
  aes: _Aes,
  bnjs: _Bn,
  bs58,
  elliptic,
  hashjs,
  pbkdf2
};

exports.Ach = Ach;
exports.Address = Address;
exports.Aes = Aes;
exports.Aescbc = Aescbc;
exports.Base58 = Base58;
exports.Base58Check = Base58Check;
exports.Bip32 = Bip32;
exports.Bip39 = Bip39;
exports.Block = Block;
exports.BlockHeader = BlockHeader;
exports.Bn = Bn;
exports.Br = Br;
exports.Bsm = Bsm;
exports.Bw = Bw;
exports.Cbc = Cbc;
exports.Constants = Constants;
exports.Ecdsa = Ecdsa;
exports.Ecies = Ecies;
exports.Hash = Hash;
exports.Interp = Interp;
exports.KeyPair = KeyPair;
exports.OpCode = OpCode;
exports.Point = Point;
exports.PrivKey = PrivKey;
exports.PubKey = PubKey;
exports.Random = Random;
exports.Script = Script;
exports.Sig = Sig;
exports.SigOperations = SigOperations;
exports.Struct = Struct;
exports.Tx = Tx;
exports.TxBuilder = TxBuilder;
exports.TxIn = TxIn;
exports.TxOut = TxOut;
exports.TxOutMap = TxOutMap;
exports.TxVerifier = TxVerifier;
exports.VarInt = VarInt;
exports.Workers = Workers;
exports.WorkersResult = WorkersResult;
exports.cmp = cmp;
exports.deps = deps;
exports.en = wordList;
exports.getConstants = getConstants;
exports.jp = wordList$1;
exports.version = version;


}).call(this)}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":94,"aes":8,"bitcoin-elliptic":10,"bn.js":2,"bs58":23,"buffer":91,"hash.js":27,"is-hex":47,"pbkdf2":53,"randombytes":59}],4:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var brfc = require('@moneybutton/brfc');
var AbortController = _interopDefault(require('abort-controller'));
var moment = _interopDefault(require('moment'));
var fetch = _interopDefault(require('isomorphic-fetch'));
var HttpStatus = _interopDefault(require('http-status-codes'));

const CapabilityCodes = {
  pki: 'pki',
  paymentDestination: 'paymentDestination',
  requestSenderValidation: brfc.brfc('bsvalias Payment Addressing (Payer Validation)', ['andy (nChain)'], ''),
  verifyPublicKeyOwner: brfc.brfc('bsvalias public key verify (Verify Public Key Owner)', [], ''),
  publicProfile: brfc.brfc('Public Profile (Name & Avatar)', ['Ryan X. Charles (Money Button)'], '1'),
  receiveTransaction: brfc.brfc('Send raw transaction', ['Miguel Duarte (Money Button)', 'Ryan X. Charles (Money Button)', 'Ivan Mlinaric (Handcash)', 'Rafa (Handcash)'], '1.1'),
  p2pPaymentDestination: brfc.brfc('Get no monitored payment destination (p2p payment destination)', ['Miguel Duarte (Money Button)', 'Ryan X. Charles (Money Button)', 'Ivan Mlinaric (Handcash)', 'Rafa (Handcash)'], '1.1'),
  assetInformation: brfc.brfc('Asset Information', ['Fabriik'], '1'),
  p2pPaymentDestinationWithTokensSupport: brfc.brfc('P2P Payment Destination with Tokens Support', ['Fabriik'], '1'),
  sfpBuildAction: brfc.brfc('Simple Fabriik Protocol for Tokens Build Action', ['Fabriik'], '1'),
  sfpAuthoriseAction: brfc.brfc('Simple Fabriik Protocol for Tokens Authorise Action', ['Fabriik'], '1')
};

// import { DnsOverHttps } from "./dns-over-https"
class DnsClient {
  constructor(dns, doh) {
    this.dns = dns;
    this.doh = doh;
  }

  async checkSrv(aDomain) {
    return new Promise((resolve, reject) => {
      this.dns.resolveSrv(`_bsvalias._tcp.${aDomain}`, async (err, result) => {
        try {
          if (err && (err.code === 'ENODATA' || err.code === 'ENOTFOUND')) {
            return resolve({
              domain: aDomain,
              port: 443,
              isSecure: true
            });
          }

          if (err) {
            return reject(err);
          }

          const {
            name: domainFromDns,
            port,
            isSecure
          } = result[0];
          resolve({
            domain: domainFromDns,
            port,
            isSecure: this.checkDomainIsSecure(domainFromDns, aDomain) || isSecure
          });
        } catch (err) {
          return reject(err);
        }
      });
    }).then(result => {
      if (result.isSecure) {
        return result;
      } else {
        return this.validateDnssec(aDomain);
      }
    }, err => {
      console.error(err);
      return err;
    });
  }

  checkDomainIsSecure(srvResponseDomain, originalDomain) {
    if (this.domainsAreEqual(srvResponseDomain, originalDomain)) {
      return true;
    } else if (this.responseIsWwwSubdomain(srvResponseDomain, originalDomain)) {
      return true;
    } else if (this.isHandcashDomain(originalDomain)) {
      // tell rafa to fix handcash and we can remove the special case :)
      return this.domainsAreEqual('handcash-paymail-production.herokuapp.com', srvResponseDomain) || this.domainsAreEqual('handcash-cloud-production.herokuapp.com', srvResponseDomain);
    } else if (this.isHandcashInternalDomain(originalDomain)) {
      return this.domainsAreEqual('handcash-cloud-staging.herokuapp.com', srvResponseDomain);
    } else if (this.domainsAreEqual('localhost', srvResponseDomain)) {
      return true;
    } else if (this.isMoneyButtonDomain(srvResponseDomain)) {
      return true;
    } else {
      return false;
    }
  }

  isMoneyButtonDomain(aDomain) {
    return this.domainsAreEqual(aDomain, 'moneybutton.com') || this.domainsAreEqual(aDomain, 'www.moneybutton.com');
  }

  responseIsWwwSubdomain(srvResponseDomain, originalDomain) {
    return this.domainsAreEqual(srvResponseDomain, `www.${originalDomain}`);
  }

  isHandcashDomain(aDomain) {
    return this.domainsAreEqual('handcash.io', aDomain);
  }

  isHandcashInternalDomain(aDomain) {
    return this.domainsAreEqual('internal.handcash.io', aDomain);
  }

  async validateDnssec(aDomain) {
    const dnsResponse = await this.doh.queryBsvaliasDomain(aDomain);

    if (dnsResponse.Status !== 0 || !dnsResponse.Answer) {
      throw new Error(`Insecure domain.`);
    }

    const data = dnsResponse.Answer[0].data.split(' ');
    const port = data[2];
    const responseDomain = data[3];

    if (!dnsResponse.AD && !this.domainsAreEqual(aDomain, responseDomain)) {
      throw new Error(`Insecure domain.`);
    }

    return {
      port,
      domain: responseDomain,
      isSecure: dnsResponse.AD
    };
  }

  domainsAreEqual(domain1, domain2) {
    return domain1.replace(/\.$/, '') === domain2.replace(/\.$/, '');
  }

}

class DnsOverHttps {
  constructor(fetch, config) {
    this.fetch = fetch;
    this.config = config;
  }

  async resolveSrv(aDomain) {
    const response = await this.fetch(`${this.config.baseUrl}?name=${aDomain}&type=SRV&cd=0`);
    const body = await response.json();
    return body;
  }

  async queryBsvaliasDomain(aDomain) {
    return this.resolveSrv(`_bsvalias._tcp.${aDomain}`);
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

class Http {
  constructor(fetch) {
    this.fetch = fetch;
  }

  async get(url) {
    return this._basicRequest(url);
  }

  async postJson(url, body) {
    return this._basicRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }

  async _basicRequest(url, options = {}) {
    var controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    return this.fetch(url, _objectSpread2({}, options, {
      credentials: 'omit',
      signal: controller.signal
    })).then(result => {
      clearTimeout(timer);
      return result;
    });
  }

}

class EndpointResolver {
  constructor(dns = null, fetch) {
    this.dnsClient = new DnsClient(dns, new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.google.com/resolve'
    }));
    this.http = new Http(fetch);
    this._cache = {};
  }

  static create(dnsClient, fetch) {
    const instance = new EndpointResolver(null, fetch);
    instance.dnsClient = dnsClient;
    return instance;
  }

  async getIdentityUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.pki);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const identityUrl = apiDescriptor.capabilities.pki.replace('{alias}', alias).replace('{domain.tld}', domain);
    return identityUrl;
  }

  async getAddressUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.paymentDestination);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const addressUrl = apiDescriptor.capabilities.paymentDestination.replace('{alias}', alias).replace('{domain.tld}', domain);
    return addressUrl;
  }

  async getVerifyUrlFor(aPaymail, aPubkey) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.verifyPublicKeyOwner);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.verifyPublicKeyOwner].replace('{alias}', alias).replace('{domain.tld}', domain).replace('{pubkey}', aPubkey);
    return url;
  }

  async getPublicProfileUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.publicProfile);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.publicProfile].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getSendTxUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.receiveTransaction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.receiveTransaction].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getP2pPaymentDestinationUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.p2pPaymentDestination);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.p2pPaymentDestination].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getP2pPaymentDestinationWithTokensSupportUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.p2pPaymentDestinationWithTokensSupport);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.p2pPaymentDestinationWithTokensSupport].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getSfpBuildActionUrlFor(aPaymail) {
    const [, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.sfpBuildAction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.sfpBuildAction];
    return url;
  }

  async getSfpAuthoriseActionUrlFor(aPaymail) {
    const [, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.sfpAuthoriseAction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.sfpAuthoriseAction];
    return url;
  }

  async getAssetInformationUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.assetInformation);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.assetInformation].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async domainHasCapability(aDomain, capability) {
    const apiDescriptor = await this.getApiDescriptionFor(aDomain);
    return !!apiDescriptor.capabilities[capability];
  }

  async getApiDescriptionFor(aDomain) {
    if (this._cache[aDomain]) {
      return this._cache[aDomain];
    }

    const {
      domain,
      port
    } = await this.getWellKnownBaseUrl(aDomain);
    const apiDescriptor = this.fetchApiDescriptor(domain, port);
    this._cache[aDomain] = apiDescriptor;
    return apiDescriptor;
  }

  async fetchApiDescriptor(domain, port) {
    const protocol = domain === 'localhost' || domain === 'localhost.' ? 'http' : 'https';
    const requestPort = port.toString() === '443' ? '' : `:${port}`;
    const requestDomain = /^(.*?)\.?$/.exec(domain)[1]; // Get value from capture group

    if (!requestDomain) {
      throw new Error(`Invalid domain: ${domain}`);
    }

    const wellKnown = await this.http.get(`${protocol}://${requestDomain}${requestPort}/.well-known/bsvalias`);
    const apiDescriptor = await wellKnown.json();
    return apiDescriptor;
  }

  async getWellKnownBaseUrl(aDomain) {
    return this.dnsClient.checkSrv(aDomain);
  }

  async ensureCapabilityFor(aDomain, aCapability) {
    if (!(await this.domainHasCapability(aDomain, aCapability))) {
      throw new Error(`Unknown capability "${aCapability}" for "${aDomain}"`);
    }
  }

}

class VerifiableMessage {
  constructor(parts, bsv = null) {
    if (bsv === null) {
      bsv = require('bsv');
    }

    this.bsv = bsv;
    this.concatenated = Buffer.from(parts.join(''));
  }

  static forBasicAddressResolution({
    senderHandle,
    amount,
    dt,
    purpose
  }) {
    if (dt.toISOString) {
      dt = dt.toISOString();
    }

    return new VerifiableMessage([senderHandle, amount || '0', dt, purpose]);
  }

  sign(wifPrivKey) {
    let privKey = this.bsv.PrivKey.fromWif(wifPrivKey);
    let keyPair = this.bsv.KeyPair.fromPrivKey(privKey);
    return this.bsv.Bsm.sign(this.concatenated, keyPair);
  }

  verify(keyAddress, signature) {
    return this.bsv.Bsm.verify(this.concatenated, signature, this.bsv.Address.fromString(keyAddress));
  }

}

class RequestBodyFactory {
  constructor(clock) {
    this.clock = clock;
  }

  buildBodyToRequestAddress(senderInfo, privateKey = null) {
    const {
      senderHandle,
      amount,
      senderName,
      purpose,
      pubkey,
      signature: providedSignature
    } = senderInfo;

    if (!providedSignature && privateKey === null) {
      throw new Error('Missing private key or signature');
    }

    let dt, signature;

    if (providedSignature) {
      if (!senderInfo.dt) {
        throw new Error('missing datetime for given signature');
      }

      dt = senderInfo.dt;
      signature = providedSignature;
    } else {
      dt = this.clock.now();
      signature = VerifiableMessage.forBasicAddressResolution({
        senderHandle,
        amount,
        dt,
        purpose
      }).sign(privateKey);
    }

    return {
      senderHandle,
      senderName,
      purpose,
      dt,
      amount: amount || null,
      pubkey,
      signature
    };
  }

  buildBodySendTx(hexTransaction, reference, metadata) {
    return {
      hex: hexTransaction,
      metadata,
      reference
    };
  }

  buildBodyP2pPaymentDestination(satoshis) {
    return {
      satoshis
    };
  }

}

class Clock {
  now() {
    return moment();
  }

}

class PaymailNotFound extends Error {
  constructor(message, paymail) {
    super(message);
    this.paymail = paymail;
  }

}

class BrowserDns {
  constructor(fetch) {
    this.doh = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.google.com/resolve'
    });
  }

  async resolveSrv(aDomain, aCallback) {
    try {
      const response = await this.doh.resolveSrv(aDomain);

      if (response.Status === 0 && response.Answer) {
        const data = response.Answer.map(record => {
          const [priority, weight, port, name] = record.data.split(' ');
          return {
            priority,
            weight,
            port,
            name,
            isSecure: response.AD
          };
        });
        aCallback(null, data);
      } else if (response.Status === 3 || !response.Answer) {
        aCallback({
          code: 'ENODATA'
        });
      } else {
        aCallback(new Error('error during dns query'));
      }
    } catch (e) {
      aCallback(e);
    }
  }

}

class ProtocolNotSupported extends Error {
  constructor(message, protocol) {
    super(message);
    this.protocol = protocol;
  }

}

class AssetNotAccepted extends Error {
  constructor(message, asset) {
    super(message);
    this.asset = asset;
  }

}

class AuthoriserNotFound extends Error {
  constructor(message, domain) {
    super(message);
    this.domain = domain;
  }

}

class PaymailClient {
  constructor(dns = null, fetch2 = null, clock = null, bsv = null) {
    if (fetch2 === null) {
      fetch2 = fetch;
    }

    if (dns === null) {
      dns = new BrowserDns(fetch2);
    }

    if (bsv === null) {
      bsv = require('bsv');
    }

    this.bsv = bsv;
    this.resolver = new EndpointResolver(dns, fetch2);
    this.http = new Http(fetch2);
    this.requestBodyFactory = new RequestBodyFactory(clock !== null ? clock : new Clock());
    this.VerifiableMessage = VerifiableMessage;
  }
  /**
   * Uses pki flow to query for an identity key for a given paymail address.
   *
   * @param {String} paymail - a paymail address
   */


  async getPublicKey(paymail) {
    const identityUrl = await this.resolver.getIdentityUrlFor(paymail);
    const response = await this.http.get(identityUrl);
    const {
      pubkey
    } = await response.json();
    return pubkey;
  }
  /**
   * Uses `Basic Address Resolution` flow to query for a payment for output for the
   * given paymail address.
   *
   * @param {String} aPaymail - a paymail address
   * @param {Object} senderInfo - Object containing sender info
   * @param {String} senderInfo.senderHandle - Sender paymail address
   * @param {String} senderInfo.amount - Optional. Required amount.
   * @param {String} senderInfo.senderName - Optional. Sender name.
   * @param {String} senderInfo.purpose - Optional. Purpose of the payment.
   * @param {String} senderInfo.pubkey - Optional. Public key used to sign the message.
   * @param {String} senderInfo.signature - Optional. Valid signature according to paymail specification.
   * @param {String} privateKey - Optional. private key to sign the request.
   */


  async getOutputFor(aPaymail, senderInfo, privateKey = null) {
    const addressUrl = await this.resolver.getAddressUrlFor(aPaymail);
    const response = await this.http.postJson(addressUrl, this.requestBodyFactory.buildBodyToRequestAddress(senderInfo, privateKey));

    if (!response.ok) {
      throw new PaymailNotFound(`Paymail not found: ${aPaymail}`, aPaymail);
    }

    const {
      output
    } = await response.json();
    return output;
  }
  /**
   * Verify if the given public address belongs to the given
   * paymail address.
   *
   * @param {String} pubkey - Public key to check.
   * @param {String} paymail - a paymail address
   */


  async verifyPubkeyOwner(pubkey, paymail) {
    const url = await this.resolver.getVerifyUrlFor(paymail, pubkey);
    const response = await this.http.get(url);
    const body = await response.json();
    const {
      match
    } = body;
    return match;
  }
  /**
   * Verifies if a given signature is valid for a given message. It uses
   * different strategies depending on the capabilities of the server
   * and the parameters Given. The priority order is.
   * - If paymail is not provided, then normal signature verification is performed.
   * - Use provided key (and check that belongs to given paymail address).
   * - Get a new pubkey for given paymail address using pki.
   * - If there is no way to intereact with the owner of the domain to verify the public key it returns false.
   *
   * @param {Message} message - Message to verify
   * @param {String} signature - Signature
   * @param {String} paymail - Signature owner paymail
   * @param {String} pubkey - Optional. Public key that validates the signature.
   */


  async isValidSignature(message, signature, paymail = null, pubkey = null) {
    if (paymail == null && pubkey === null) {
      throw new Error('Must specify either paymail or pubkey');
    }

    let senderPubKey;

    if (paymail) {
      if (pubkey && (await this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.verifyPublicKeyOwner))) {
        if (await this.verifyPubkeyOwner(pubkey, paymail)) {
          senderPubKey = this.bsv.PubKey.fromString(pubkey);
        } else {
          return false;
        }
      } else {
        const hasPki = await this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.pki);

        if (hasPki) {
          const identityKey = await this.getPublicKey(paymail);
          senderPubKey = this.bsv.PubKey.fromString(identityKey);
        } else {
          return false;
        }
      }
    }

    const senderKeyAddress = this.bsv.Address.fromPubKey(senderPubKey || pubkey);

    try {
      const verified = message.verify(senderKeyAddress.toString(), signature);
      return verified;
    } catch (err) {
      // console.log(err)
      return false;
    }
  }
  /**
   * Gets the public profile information using the "Public Profile" protocol.
   *
   * @param {String} paymail - a paymail address
   * @param {String} s - the preferred size of the image
   */


  async getPublicProfile(paymail) {
    let publicProfileUrl = await this.resolver.getPublicProfileUrlFor(paymail);
    const response = await this.http.get(publicProfileUrl);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(`Server failed with: ${JSON.stringify(body)}`);
    }

    const {
      avatar,
      name
    } = await response.json();
    return {
      avatar,
      name
    };
  }

  async sendRawTx(targetPaymail, hexTransaction, reference, metadata = {}) {
    if (!hexTransaction) {
      throw new Error('transaction hex cannot be empty');
    }

    let receiveTxUrl = await this.resolver.getSendTxUrlFor(targetPaymail);
    const response = await this.http.postJson(receiveTxUrl, this.requestBodyFactory.buildBodySendTx(hexTransaction, reference, metadata));

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Server failed with: ${body}`);
    }

    return response.json();
  }

  async getP2pPaymentDestination(targetPaymail, satoshis) {
    if (!satoshis) {
      throw new Error('Amount in satohis needs to be specified');
    }

    let paymentDestinationUrl = await this.resolver.getP2pPaymentDestinationUrlFor(targetPaymail);
    const response = await this.http.postJson(paymentDestinationUrl, this.requestBodyFactory.buildBodyP2pPaymentDestination(satoshis));

    if (!response.ok) {
      const body = await response.json();
      throw new Error(`Server failed with: ${JSON.stringify(body)}`);
    }

    const body = await response.json();

    if (!body.outputs) {
      throw new Error('Server answered with a wrong format. Missing outputs');
    }

    return body;
  }

  async getP2pPaymentDestinationWithTokensSupport(targetPaymail, amount, asset, protocol) {
    const UNAVAILABLE_FOR_LEGAL_REASONS = 451;

    if (!amount) {
      throw new Error('Amount needs to be specified');
    }

    let paymentDestinationUrl = await this.resolver.getP2pPaymentDestinationWithTokensSupportUrlFor(targetPaymail);
    const response = await this.http.postJson(paymentDestinationUrl, {
      amount,
      asset,
      protocol
    });

    if (response.status === HttpStatus.NOT_ACCEPTABLE) {
      throw new ProtocolNotSupported(`Protocol ${protocol} is not supported by paymail ${targetPaymail}`, protocol);
    }

    if (response.status === UNAVAILABLE_FOR_LEGAL_REASONS) {
      throw new AssetNotAccepted(`Paymail ${targetPaymail} cannot accept asset ${asset}`);
    }

    if (!response.ok) {
      const body = await response.json();
      throw new Error(`Server failed with: ${JSON.stringify(body)}`);
    }

    const body = await response.json();

    if (!body.outputs) {
      throw new Error('Server answered with a wrong format. Missing outputs');
    }

    return body;
  }

  async sendSfpBuildAction(targetAssetPaymail, params) {
    let buildActionUrl;

    try {
      buildActionUrl = await this.resolver.getSfpBuildActionUrlFor(targetAssetPaymail);
    } catch (err) {
      if (err.message.includes('Unexpected token')) {
        throw new AuthoriserNotFound(`Invalid authoriser for ${targetAssetPaymail}`);
      }
    }

    const response = await this.http.postJson(buildActionUrl, params);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    return response.json();
  }

  async sendSfpAuthoriseAction(targetAssetPaymail, params) {
    let authoriseActionUrl = await this.resolver.getSfpAuthoriseActionUrlFor(targetAssetPaymail);
    const response = await this.http.postJson(authoriseActionUrl, params);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    return response.json();
  }

  async getAssetInformation(assetTargetPaymail) {
    let assetInformationUrl = await this.resolver.getAssetInformationUrlFor(assetTargetPaymail);
    const response = await this.http.get(assetInformationUrl);

    if (response.status === HttpStatus.NOT_FOUND) {
      throw new Error(`Asset ${assetTargetPaymail} was not found`);
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Server failed with: ${body}`);
    }

    return response.json();
  }

}

exports.AssetNotAccepted = AssetNotAccepted;
exports.AuthoriserNotFound = AuthoriserNotFound;
exports.BrowserDns = BrowserDns;
exports.CapabilityCodes = CapabilityCodes;
exports.Clock = Clock;
exports.PaymailClient = PaymailClient;
exports.PaymailNotFound = PaymailNotFound;
exports.ProtocolNotSupported = ProtocolNotSupported;
exports.RequestBodyFactory = RequestBodyFactory;
exports.VerifiableMessage = VerifiableMessage;


}).call(this)}).call(this,require("buffer").Buffer)
},{"@moneybutton/brfc":1,"abort-controller":7,"bsv":6,"buffer":91,"http-status-codes":40,"isomorphic-fetch":48,"moment":52}],5:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"buffer":90,"dup":2}],6:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"_process":94,"aes":8,"bitcoin-elliptic":10,"bn.js":5,"bs58":23,"buffer":91,"dup":3,"hash.js":27,"is-hex":47,"pbkdf2":53,"randombytes":59}],7:[function(require,module,exports){
/*globals self, window */
"use strict"

/*eslint-disable @mysticatea/prettier */
const { AbortController, AbortSignal } =
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    /* otherwise */ undefined
/*eslint-enable @mysticatea/prettier */

module.exports = AbortController
module.exports.AbortSignal = AbortSignal
module.exports.default = AbortController

},{}],8:[function(require,module,exports){


module.exports = AES;

//@param {Array} key The key as an array of 4, 6 or 8 words.
function AES (key) {
  if (!this._tables[0][0][0]) this._precompute();
  
  var tmp, encKey, decKey;
  var sbox = this._tables[0][4];
  var decTable = this._tables[1];
  var keyLen = key.length; 
  var rcon = 1;
  
  if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
    throw new Error("invalid aes key size");
  }
  
  this._key = [encKey = key.slice(0), decKey = []];
  
  // schedule encryption keys
  for (var i = keyLen; i < 4 * keyLen + 28; i++) {
    tmp = encKey[i-1];
    
    // apply sbox
    if (i % keyLen === 0 || (keyLen === 8 && i % keyLen === 4)) {
      tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255]<< 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
      
      // shift rows and add rcon
      if (i % keyLen === 0) {
        tmp = tmp << 8 ^ tmp >>> 24 ^ rcon<<24;
        rcon = rcon << 1 ^ (rcon >> 7) * 283;
      }
    }
    
    encKey[i] = encKey[i-keyLen] ^ tmp;
  }
  
  // schedule decryption keys
  for (var j = 0; i; j++, i--) {
    tmp = encKey[j&3 ? i : i - 4];
    if (i<=4 || j<4) {
      decKey[j] = tmp;
    } else {
      decKey[j] = decTable[0][sbox[tmp>>>24      ]] ^
                  decTable[1][sbox[tmp>>16  & 255]] ^
                  decTable[2][sbox[tmp>>8   & 255]] ^
                  decTable[3][sbox[tmp      & 255]];
    }
  }
};

AES.prototype = {
  
  /**
   * Encrypt an array of 4 big-endian words.
   * @param {Array} data The plaintext.
   * @return {Array} The ciphertext.
   */
  encrypt:function (data) { return this._crypt(data, 0); },
  
  /**
   * Decrypt an array of 4 big-endian words.
   * @param {Array} data The ciphertext.
   * @return {Array} The plaintext.
   */
  decrypt:function (data) { return this._crypt(data, 1); },
  
  /**
   * The expanded S-box and inverse S-box tables.  These will be computed
   * on the client so that we don't have to send them down the wire.
   *
   * There are two tables, _tables[0] is for encryption and
   * _tables[1] is for decryption.
   *
   * The first 4 sub-tables are the expanded S-box with MixColumns.  The
   * last (_tables[01][4]) is the S-box itself.
   *
   * @private
   */
  _tables: [
    [ new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256) ],
    [ new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256) ]
  ],

  //Expand the S-box tables.
  _precompute: function () {
    var encTable = this._tables[0], decTable = this._tables[1],
       sbox = encTable[4], sboxInv = decTable[4],
       i, x, xInv, d=new Uint8Array(256), th=new Uint8Array(256), x2, x4, x8, s, tEnc, tDec;

    // Compute double and third tables
    for (i = 0; i < 256; i++) {
      th[( d[i] = i<<1 ^ (i>>7)*283 )^i]=i;
    }
   
    for (x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
      // Compute sbox
      s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
      s = s >> 8 ^ s & 255 ^ 99;
      sbox[x] = s;
      sboxInv[s] = x;
       
      // Compute MixColumns
      x8 = d[x4 = d[x2 = d[x]]];
      tDec = x8*0x1010101 ^ x4*0x10001 ^ x2*0x101 ^ x*0x1010100;
      tEnc = d[s]*0x101 ^ s*0x1010100;
       
      for (i = 0; i < 4; i++) {
        encTable[i][x] = tEnc = tEnc<<24 ^ tEnc>>>8;
        decTable[i][s] = tDec = tDec<<24 ^ tDec>>>8;
      }
    }
  },
  
  /**
   * Encryption and decryption core.
   * @param {Array} input Four words to be encrypted or decrypted.
   * @param dir The direction, 0 for encrypt and 1 for decrypt.
   * @return {Array} The four encrypted or decrypted words.
   * @private
   */
  _crypt:function (input, dir) {
    if (input.length !== 4) {
      throw new Error("invalid aes block size");
    }
    
    var key = this._key[dir],
        // state variables a,b,c,d are loaded with pre-whitened data
        a = input[0]           ^ key[0],
        b = input[dir ? 3 : 1] ^ key[1],
        c = input[2]           ^ key[2],
        d = input[dir ? 1 : 3] ^ key[3],
        a2, b2, c2,
        
        nInnerRounds = key.length/4 - 2,
        i,
        kIndex = 4,
        out = new Uint32Array(4),// <--- this is slower in Node.js, about the same in Chrome */ 
        table = this._tables[dir],
        
        // load up the tables
        t0    = table[0],
        t1    = table[1],
        t2    = table[2],
        t3    = table[3],
        sbox  = table[4];
 
    // Inner rounds.  Cribbed from OpenSSL.
    for (i = 0; i < nInnerRounds; i++) {
      a2 = t0[a>>>24] ^ t1[b>>16 & 255] ^ t2[c>>8 & 255] ^ t3[d & 255] ^ key[kIndex];
      b2 = t0[b>>>24] ^ t1[c>>16 & 255] ^ t2[d>>8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
      c2 = t0[c>>>24] ^ t1[d>>16 & 255] ^ t2[a>>8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
      d  = t0[d>>>24] ^ t1[a>>16 & 255] ^ t2[b>>8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
      kIndex += 4;
      a=a2; b=b2; c=c2;
    }
        
    // Last round.
    for (i = 0; i < 4; i++) {
      out[dir ? 3&-i : i] =
        sbox[a>>>24      ]<<24 ^ 
        sbox[b>>16  & 255]<<16 ^
        sbox[c>>8   & 255]<<8  ^
        sbox[d      & 255]     ^
        key[kIndex++];
      a2=a; a=b; b=c; c=d; d=a2;
    }
    
    return out;
  }
};

},{}],9:[function(require,module,exports){
'use strict'
// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// @ts-ignore
var _Buffer = require('safe-buffer').Buffer
function base (ALPHABET) {
  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
  var BASE_MAP = new Uint8Array(256)
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i
  }
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
  function encode (source) {
    if (Array.isArray(source) || source instanceof Uint8Array) { source = _Buffer.from(source) }
    if (!_Buffer.isBuffer(source)) { throw new TypeError('Expected Buffer') }
    if (source.length === 0) { return '' }
        // Skip & count leading zeroes.
    var zeroes = 0
    var length = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }
        // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
        // Process the bytes.
    while (pbegin !== pend) {
      var carry = source[pbegin]
            // Apply "b58 = b58 * 256 + ch".
      var i = 0
      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
        carry += (256 * b58[it1]) >>> 0
        b58[it1] = (carry % BASE) >>> 0
        carry = (carry / BASE) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      pbegin++
    }
        // Skip leading zeroes in base58 result.
    var it2 = size - length
    while (it2 !== size && b58[it2] === 0) {
      it2++
    }
        // Translate the result into a string.
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]) }
    return str
  }
  function decodeUnsafe (source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return _Buffer.alloc(0) }
    var psz = 0
        // Skip leading spaces.
    if (source[psz] === ' ') { return }
        // Skip and count leading '1's.
    var zeroes = 0
    var length = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }
        // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size)
        // Process the characters.
    while (source[psz]) {
            // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)]
            // Invalid character
      if (carry === 255) { return }
      var i = 0
      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
        carry += (BASE * b256[it3]) >>> 0
        b256[it3] = (carry % 256) >>> 0
        carry = (carry / 256) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      psz++
    }
        // Skip trailing spaces.
    if (source[psz] === ' ') { return }
        // Skip leading zeroes in b256.
    var it4 = size - length
    while (it4 !== size && b256[it4] === 0) {
      it4++
    }
    var vch = _Buffer.allocUnsafe(zeroes + (size - it4))
    vch.fill(0x00, 0, zeroes)
    var j = zeroes
    while (it4 !== size) {
      vch[j++] = b256[it4++]
    }
    return vch
  }
  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
  }
  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}
module.exports = base

},{"safe-buffer":76}],10:[function(require,module,exports){
'use strict';

var elliptic = exports;

elliptic.version = require('../package.json').version;
elliptic.utils = require('./elliptic/utils');
elliptic.rand = require('brorand');
elliptic.curve = require('./elliptic/curve');
elliptic.curves = require('./elliptic/curves');

// Protocols
elliptic.ec = require('./elliptic/ec');

},{"../package.json":21,"./elliptic/curve":12,"./elliptic/curves":14,"./elliptic/ec":15,"./elliptic/utils":19,"brorand":22}],11:[function(require,module,exports){
'use strict';

var BN = require('bn.js');
var utils = require('../utils');
var getNAF = utils.getNAF;
var getJSF = utils.getJSF;
var assert = utils.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new BN(conf.p, 16);

  // Use Montgomery, when there is no fast reduction for the prime
  this.red = conf.prime ? BN.red(conf.prime) : BN.mont(this.p);

  // Useful for many curves
  this.zero = new BN(0).toRed(this.red);
  this.one = new BN(1).toRed(this.red);
  this.two = new BN(2).toRed(this.red);

  // Curve configuration, optional
  this.n = conf.n && new BN(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  // Temporary arrays
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  this._bitLength = this.n ? this.n.bitLength() : 0;

  // Generalized Greg Maxwell's trick
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
module.exports = BaseCurve;

BaseCurve.prototype.point = function point() {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function validate() {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
  assert(p.precomputed);
  var doubles = p._getDoubles();

  var naf = getNAF(k, 1, this._bitLength);
  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
  I /= 3;

  // Translate into more windowed form
  var repr = [];
  for (var j = 0; j < naf.length; j += doubles.step) {
    var nafW = 0;
    for (var k = j + doubles.step - 1; k >= j; k--)
      nafW = (nafW << 1) + naf[k];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  var b = this.jpoint(null, null, null);
  for (var i = I; i > 0; i--) {
    for (var j = 0; j < repr.length; j++) {
      var nafW = repr[j];
      if (nafW === i)
        b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i)
        b = b.mixedAdd(doubles.points[j].neg());
    }
    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
  var w = 4;

  // Precompute window
  var nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points;

  // Get NAF form
  var naf = getNAF(k, w, this._bitLength);

  // Add `this`*(N+1) for every w-NAF index
  var acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    // Count zeroes
    for (var k = 0; i >= 0 && naf[i] === 0; i--)
      k++;
    if (i >= 0)
      k++;
    acc = acc.dblp(k);

    if (i < 0)
      break;
    var z = naf[i];
    assert(z !== 0);
    if (p.type === 'affine') {
      // J +- P
      if (z > 0)
        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
      else
        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
    } else {
      // J +- J
      if (z > 0)
        acc = acc.add(wnd[(z - 1) >> 1]);
      else
        acc = acc.add(wnd[(-z - 1) >> 1].neg());
    }
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
                                                       points,
                                                       coeffs,
                                                       len,
                                                       jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;

  // Fill all arrays
  var max = 0;
  for (var i = 0; i < len; i++) {
    var p = points[i];
    var nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  // Comb small window NAFs
  for (var i = len - 1; i >= 1; i -= 2) {
    var a = i - 1;
    var b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
      naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [
      points[a], /* 1 */
      null, /* 3 */
      null, /* 5 */
      points[b] /* 7 */
    ];

    // Try to avoid Projective points, if possible
    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [
      -3, /* -1 -1 */
      -1, /* -1 0 */
      -5, /* -1 1 */
      -7, /* 0 -1 */
      0, /* 0 0 */
      7, /* 0 1 */
      5, /* 1 -1 */
      1, /* 1 0 */
      3  /* 1 1 */
    ];

    var jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (var j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0;
      var jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (var i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (var j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k++;
      i--;
    }
    if (i >= 0)
      k++;
    acc = acc.dblp(k);
    if (i < 0)
      break;

    for (var j = 0; j < len; j++) {
      var z = tmp[j];
      var p;
      if (z === 0)
        continue;
      else if (z > 0)
        p = wnd[j][(z - 1) >> 1];
      else if (z < 0)
        p = wnd[j][(-z - 1) >> 1].neg();

      if (p.type === 'affine')
        acc = acc.mixedAdd(p);
      else
        acc = acc.add(p);
    }
  }
  // Zeroify references
  for (var i = 0; i < len; i++)
    wnd[i] = null;

  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function eq(/*other*/) {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function validate() {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils.toArray(bytes, enc);

  var len = this.p.byteLength();

  // uncompressed, hybrid-odd, hybrid-even
  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 === 2 * len) {
    if (bytes[0] === 0x06)
      assert(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 0x07)
      assert(bytes[bytes.length - 1] % 2 === 1);

    var res =  this.point(bytes.slice(1, 1 + len),
                          bytes.slice(1 + len, 1 + 2 * len));

    return res;
  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
              bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
  }
  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x = this.getX().toArray('be', len);

  if (compact)
    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

  return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
};

BasePoint.prototype.encode = function encode(enc, compact) {
  return utils.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;

  var precomputed = {
    doubles: null,
    naf: null,
    beta: null
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
  if (!this.precomputed)
    return false;

  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;

  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;

  var doubles = [ this ];
  var acc = this;
  for (var i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step: step,
    points: doubles
  };
};

BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;

  var res = [ this ];
  var max = (1 << wnd) - 1;
  var dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++)
    res[i] = res[i - 1].add(dbl);
  return {
    wnd: wnd,
    points: res
  };
};

BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};

BasePoint.prototype.dblp = function dblp(k) {
  var r = this;
  for (var i = 0; i < k; i++)
    r = r.dbl();
  return r;
};

},{"../utils":19,"bn.js":20}],12:[function(require,module,exports){
'use strict';

var curve = exports;

curve.base = require('./base');
curve.short = require('./short');

},{"./base":11,"./short":13}],13:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var BN = require('bn.js');
var inherits = require('inherits');
var Base = require('./base');

var assert = utils.assert;

function ShortCurve(conf) {
  Base.call(this, 'short', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  // If the curve is endomorphic, precalculate beta and lambda
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits(ShortCurve, Base);
module.exports = ShortCurve;

ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  // No efficient endomorphism
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;

  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new BN(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    // Choose the smallest beta
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new BN(conf.lambda, 16);
  } else {
    // Choose the lambda that is matching selected beta
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  // Get basis vectors, used for balanced length-two representation
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new BN(vec.a, 16),
        b: new BN(vec.b, 16)
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }

  return {
    beta: beta,
    lambda: lambda,
    basis: basis
  };
};

ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  // Find roots of for x^2 + x + 1 in F
  // Root = (-1 +- Sqrt(-3)) / 2
  //
  var red = num === this.p ? this.red : BN.mont(num);
  var tinv = new BN(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();

  var s = new BN(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  var l1 = ntinv.redAdd(s).fromRed();
  var l2 = ntinv.redSub(s).fromRed();
  return [ l1, l2 ];
};

ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  // aprxSqrt >= sqrt(this.n)
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

  // 3.74
  // Run EGCD, until r(L + 1) < aprxSqrt
  var u = lambda;
  var v = this.n.clone();
  var x1 = new BN(1);
  var y1 = new BN(0);
  var x2 = new BN(0);
  var y2 = new BN(1);

  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
  var a0;
  var b0;
  // First vector
  var a1;
  var b1;
  // Second vector
  var a2;
  var b2;

  var prevR;
  var i = 0;
  var r;
  var x;
  while (u.cmpn(0) !== 0) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i === 2) {
      break;
    }
    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a2.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  // Normalize signs
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 }
  ];
};

ShortCurve.prototype._endoSplit = function _endoSplit(k) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v2 = basis[1];

  var c1 = v2.b.mul(k).divRound(this.n);
  var c2 = v1.b.neg().mul(k).divRound(this.n);

  var p1 = c1.mul(v1.a);
  var p2 = c2.mul(v2.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v2.b);

  // Calculate answer
  var k1 = k.sub(p1).sub(p2);
  var k2 = q1.add(q2).neg();
  return { k1: k1, k2: k2 };
};

ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new BN(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  // XXX Is there any way to tell if the number is odd without converting it
  // to non-red form?
  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function validate(point) {
  if (point.inf)
    return true;

  var x = point.x;
  var y = point.y;

  var ax = this.a.redMul(x);
  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd =
    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
  var npoints = this._endoWnafT1;
  var ncoeffs = this._endoWnafT2;
  for (var i = 0; i < points.length; i++) {
    var split = this._endoSplit(coeffs[i]);
    var p = points[i];
    var beta = p._getBeta();

    if (split.k1.negative) {
      split.k1.ineg();
      p = p.neg(true);
    }
    if (split.k2.negative) {
      split.k2.ineg();
      beta = beta.neg(true);
    }

    npoints[i * 2] = p;
    npoints[i * 2 + 1] = beta;
    ncoeffs[i * 2] = split.k1;
    ncoeffs[i * 2 + 1] = split.k2;
  }
  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

  // Clean-up references to points and coefficients
  for (var j = 0; j < i * 2; j++) {
    npoints[j] = null;
    ncoeffs[j] = null;
  }
  return res;
};

function Point(curve, x, y, isRed) {
  Base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    // Force redgomery representation when loading from JSON
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits(Point, Base.BasePoint);

ShortCurve.prototype.point = function point(x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function _getBeta() {
  if (!this.curve.endo)
    return;

  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function(p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul)
      }
    };
  }
  return beta;
};

Point.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [ this.x, this.y ];

  return [ this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  } ];
};

Point.fromJSON = function fromJSON(curve, obj, red) {
  if (typeof obj === 'string')
    obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [ res ].concat(pre.doubles.points.map(obj2point))
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [ res ].concat(pre.naf.points.map(obj2point))
    }
  };
  return res;
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  return this.inf;
};

Point.prototype.add = function add(p) {
  // O + P = P
  if (this.inf)
    return p;

  // P + O = P
  if (p.inf)
    return this;

  // P + P = 2P
  if (this.eq(p))
    return this.dbl();

  // P + (-P) = O
  if (this.neg().eq(p))
    return this.curve.point(null, null);

  // P + Q = O
  if (this.x.cmp(p.x) === 0)
    return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0)
    c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x);
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function dbl() {
  if (this.inf)
    return this;

  // 2P = O
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);

  var a = this.curve.a;

  var x2 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function getX() {
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  return this.y.fromRed();
};

Point.prototype.mul = function mul(k) {
  k = new BN(k, 16);
  if (this.isInfinity())
    return this;
  else if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([ this ], [ k ]);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function eq(p) {
  return this === p ||
         this.inf === p.inf &&
             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
};

Point.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate)
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate)
      }
    };
  }
  return res;
};

Point.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);

  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};

function JPoint(curve, x, y, z) {
  Base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new BN(0);
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = new BN(z, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);

  this.zOne = this.z === this.curve.one;
}
inherits(JPoint, Base.BasePoint);

ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);

  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function neg() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function add(p) {
  // O + P = P
  if (this.isInfinity())
    return p;

  // P + O = P
  if (p.isInfinity())
    return this;

  // 12M + 4S + 7A
  var pz2 = p.z.redSqr();
  var z2 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u2 = p.x.redMul(z2);
  var s1 = this.y.redMul(pz2.redMul(p.z));
  var s2 = p.y.redMul(z2.redMul(this.z));

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function mixedAdd(p) {
  // O + P = P
  if (this.isInfinity())
    return p.toJ();

  // P + O = P
  if (p.isInfinity())
    return this;

  // 8M + 3S + 7A
  var z2 = this.z.redSqr();
  var u1 = this.x;
  var u2 = p.x.redMul(z2);
  var s1 = this.y;
  var s2 = p.y.redMul(z2).redMul(this.z);

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function dblp(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();

  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (var i = 0; i < pow; i++)
      r = r.dbl();
    return r;
  }

  // 1M + 2S + 1A + N * (4S + 5M + 8A)
  // N = 1 => 6M + 6S + 9A
  var a = this.curve.a;
  var tinv = this.curve.tinv;

  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  // Reuse results
  var jyd = jy.redAdd(jy);
  for (var i = 0; i < pow; i++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var t1 = jx.redMul(jyd2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow)
      jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};

JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 14A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s);

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);

    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-dbl-2009-l
    // 2M + 5S + 13A

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = B^2
    var c = b.redSqr();
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a);
    // F = E^2
    var f = e.redSqr();

    // 8 * C
    var c8 = c.redIAdd(c);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d);
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 15A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    // T = M^2 - 2 * S
    var t = m.redSqr().redISub(s).redISub(s);
    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2 * Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
    // 3M + 5S

    // delta = Z1^2
    var delta = this.z.redSqr();
    // gamma = Y1^2
    var gamma = this.y.redSqr();
    // beta = X1 * gamma
    var beta = this.x.redMul(gamma);
    // alpha = 3 * (X1 - delta) * (X1 + delta)
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    // X3 = alpha^2 - 8 * beta
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    // Z3 = (Y1 + Z1)^2 - gamma - delta
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function _dbl() {
  var a = this.curve.a;

  // 4M + 6S + 10A
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();

  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);

  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);

  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
  // 5M + 10S + ...

  // XX = X1^2
  var xx = this.x.redSqr();
  // YY = Y1^2
  var yy = this.y.redSqr();
  // ZZ = Z1^2
  var zz = this.z.redSqr();
  // YYYY = YY^2
  var yyyy = yy.redSqr();
  // M = 3 * XX + a * ZZ2; a = 0
  var m = xx.redAdd(xx).redIAdd(xx);
  // MM = M^2
  var mm = m.redSqr();
  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  // EE = E^2
  var ee = e.redSqr();
  // T = 16*YYYY
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  // U = (M + E)^2 - MM - EE - T
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
  // X3 = 4 * (X1 * EE - 4 * YY * U)
  var yyu4 = yy.redMul(u);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  // Z3 = (Z1 + E)^2 - ZZ - EE
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function mul(k, kbase) {
  k = new BN(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function eq(p) {
  if (p.type === 'affine')
    return this.eq(p.toJ());

  if (this === p)
    return true;

  // x1 * z2^2 == x2 * z1^2
  var z2 = this.z.redSqr();
  var pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
    return false;

  // y1 * z2^3 == y2 * z1^3
  var z3 = z2.redMul(this.z);
  var pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function eqXToP(x) {
  var zs = this.z.redSqr();
  var rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(zs);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};

JPoint.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC JPoint Infinity>';
  return '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

},{"../utils":19,"./base":11,"bn.js":20,"inherits":46}],14:[function(require,module,exports){
'use strict';

var curves = exports;

var hash = require('hash.js');
var curve = require('./curve');
var utils = require('./utils');

var assert = utils.assert;

function PresetCurve(options) {
  if (options.type !== 'short')
    throw new Error('invalid curve type')
  this.curve = new curve.short(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function() {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve
      });
      return curve;
    }
  });
}

var pre;
try {
  pre = require('./precomputed/secp256k1');
} catch (e) {
  pre = undefined;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: hash.sha256,

  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3'
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15'
    }
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre
  ]
});

},{"./curve":12,"./precomputed/secp256k1":18,"./utils":19,"hash.js":27}],15:[function(require,module,exports){
'use strict';

var BN = require('bn.js');
var HmacDRBG = require('hmac-drbg');
var utils = require('../utils');
var curves = require('../curves');
var rand = require('brorand');
var assert = utils.assert;

var KeyPair = require('./key');
var Signature = require('./signature');

function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);

  // Shortcut `elliptic.ec(curve-name)`
  if (typeof options === 'string') {
    assert(curves.hasOwnProperty(options), 'Unknown curve ' + options);

    options = curves[options];
  }

  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
  if (options instanceof curves.PresetCurve)
    options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  // Point on curve
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  // Hash for function for DRBG
  this.hash = options.hash || options.curve.hash;
}
module.exports = EC;

EC.prototype.keyPair = function keyPair(options) {
  return new KeyPair(this, options);
};

EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
  return KeyPair.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
  return KeyPair.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || rand(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: this.n.toArray()
  });

  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new BN(2));
  do {
    var priv = new BN(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  } while (true);
};

EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};

EC.prototype.sign = function sign(msg, key, enc, options) {
  if (typeof enc === 'object') {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new BN(msg, 16));

  // Zero-extend key to provide enough entropy
  var bytes = this.n.byteLength();
  var bkey = key.getPrivate().toArray('be', bytes);

  // Zero-extend nonce to have the same byte size as N
  var nonce = msg.toArray('be', bytes);

  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8'
  });

  // Number of bytes to generate
  var ns1 = this.n.sub(new BN(1));

  for (var iter = 0; true; iter++) {
    var k = options.k ?
        options.k(iter) :
        new BN(drbg.generate(this.n.byteLength()));
    k = this._truncateToN(k, true);
    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
      continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity())
      continue;

    var kpX = kp.getX();
    var r = kpX.umod(this.n);
    if (r.cmpn(0) === 0)
      continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    s = s.umod(this.n);
    if (s.cmpn(0) === 0)
      continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                        (kpX.cmp(r) !== 0 ? 2 : 0);

    // Use complement of `s`, if it is > `n / 2`
    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new Signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function verify(msg, signature, key, enc) {
  msg = this._truncateToN(new BN(msg, 16));
  key = this.keyFromPublic(key, enc);
  signature = new Signature(signature, 'hex');

  // Perform primitive values validation
  var r = signature.r;
  var s = signature.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
    return false;
  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  // Validate signature
  var sinv = s.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u2 = sinv.mul(r).umod(this.n);

  if (!this.curve._maxwellTrick) {
    var p = this.g.mulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    return p.getX().umod(this.n).cmp(r) === 0;
  }

  // NOTE: Greg Maxwell's trick, inspired by:
  // https://git.io/vad3K

  var p = this.g.jmulAdd(u1, key.getPublic(), u2);
  if (p.isInfinity())
    return false;

  // Compare `p.x` of Jacobian point with `r`,
  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
  // inverse of `p.z^2`
  return p.eqXToP(r);
};

EC.prototype.recoverPubKey = function(msg, signature, j, enc) {
  assert((3 & j) === j, 'The recovery param is more than two bits');
  signature = new Signature(signature, enc);

  var n = this.n;
  var e = new BN(msg);
  var r = signature.r;
  var s = signature.s;

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = j & 1;
  var isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  // 1.1. Let x = r + jn.
  if (isSecondKey)
    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
  else
    r = this.curve.pointFromX(r, isYOdd);

  var rInv = signature.r.invm(n);
  var s1 = n.sub(e).mul(rInv).umod(n);
  var s2 = s.mul(rInv).umod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
  signature = new Signature(signature, enc);
  if (signature.recoveryParam !== null)
    return signature.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature, i);
    } catch (e) {
      continue;
    }

    if (Qprime.eq(Q))
      return i;
  }
  throw new Error('Unable to find valid recovery factor');
};

},{"../curves":14,"../utils":19,"./key":16,"./signature":17,"bn.js":20,"brorand":22,"hmac-drbg":39}],16:[function(require,module,exports){
'use strict';

var BN = require('bn.js');
var utils = require('../utils');
var assert = utils.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
module.exports = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    return pub;

  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    return priv;

  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: 'Public key * N != O' };

  return { result: true, reason: null };
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    return this.pub;

  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    return this.priv.toString(16, 2);
  else
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new BN(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};

},{"../utils":19,"bn.js":20}],17:[function(require,module,exports){
'use strict';

var BN = require('bn.js');

var utils = require('../utils');
var assert = utils.assert;

function Signature(options, enc) {
  if (options instanceof Signature)
    return options;

  if (this._importDER(options, enc))
    return;

  assert(options.r && options.s, 'Signature without r or s');
  this.r = new BN(options.r, 16);
  this.s = new BN(options.s, 16);
  if (options.recoveryParam === undefined)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
module.exports = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) {
    return initial;
  }
  var octetLen = initial & 0xf;
  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
  }
  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  var len = buf.length - 1;
  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
    i++;
  }
  if (i === 0) {
    return buf;
  }
  return buf.slice(i);
}

Signature.prototype._importDER = function _importDER(data, enc) {
  data = utils.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) {
    return false;
  }
  var len = getLength(data, p);
  if ((len + p.place) !== data.length) {
    return false;
  }
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var rlen = getLength(data, p);
  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var slen = getLength(data, p);
  if (data.length !== slen + p.place) {
    return false;
  }
  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0 && (r[1] & 0x80)) {
    r = r.slice(1);
  }
  if (s[0] === 0 && (s[1] & 0x80)) {
    s = s.slice(1);
  }

  this.r = new BN(r);
  this.s = new BN(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 0x80);
  while (--octets) {
    arr.push((len >>> (octets << 3)) & 0xff);
  }
  arr.push(len);
}

Signature.prototype.toDER = function toDER(enc) {
  var r = this.r.toArray();
  var s = this.s.toArray();

  // Pad values
  if (r[0] & 0x80)
    r = [ 0 ].concat(r);
  // Pad values
  if (s[0] & 0x80)
    s = [ 0 ].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!s[0] && !(s[1] & 0x80)) {
    s = s.slice(1);
  }
  var arr = [ 0x02 ];
  constructLength(arr, r.length);
  arr = arr.concat(r);
  arr.push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s);
  var res = [ 0x30 ];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils.encode(res, enc);
};

},{"../utils":19,"bn.js":20}],18:[function(require,module,exports){
module.exports = {
  doubles: {
    step: 4,
    points: [
      [
        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
      ],
      [
        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
      ],
      [
        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
      ],
      [
        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
      ],
      [
        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
      ],
      [
        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
      ],
      [
        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
      ],
      [
        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
      ],
      [
        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
      ],
      [
        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
      ],
      [
        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
      ],
      [
        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
      ],
      [
        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
      ],
      [
        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
      ],
      [
        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
      ],
      [
        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
      ],
      [
        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
      ],
      [
        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
      ],
      [
        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
      ],
      [
        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
      ],
      [
        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
      ],
      [
        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
      ],
      [
        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
      ],
      [
        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
      ],
      [
        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
      ],
      [
        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
      ],
      [
        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
      ],
      [
        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
      ],
      [
        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
      ],
      [
        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
      ],
      [
        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
      ],
      [
        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
      ],
      [
        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
      ],
      [
        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
      ],
      [
        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
      ],
      [
        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
      ],
      [
        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
      ],
      [
        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
      ],
      [
        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
      ],
      [
        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
      ],
      [
        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
      ],
      [
        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
      ],
      [
        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
      ],
      [
        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
      ],
      [
        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
      ],
      [
        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
      ],
      [
        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
      ],
      [
        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
      ],
      [
        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
      ],
      [
        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
      ],
      [
        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
      ],
      [
        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
      ],
      [
        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
      ],
      [
        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
      ],
      [
        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
      ],
      [
        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
      ],
      [
        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
      ],
      [
        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
      ],
      [
        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
      ],
      [
        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
      ],
      [
        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
      ],
      [
        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
      ],
      [
        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
      ],
      [
        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
      ],
      [
        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
      ]
    ]
  },
  naf: {
    wnd: 7,
    points: [
      [
        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
      ],
      [
        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
      ],
      [
        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
      ],
      [
        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
      ],
      [
        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
      ],
      [
        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
      ],
      [
        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
      ],
      [
        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
      ],
      [
        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
      ],
      [
        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
      ],
      [
        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
      ],
      [
        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
      ],
      [
        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
      ],
      [
        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
      ],
      [
        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
      ],
      [
        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
      ],
      [
        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
      ],
      [
        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
      ],
      [
        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
      ],
      [
        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
      ],
      [
        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
      ],
      [
        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
      ],
      [
        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
      ],
      [
        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
      ],
      [
        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
      ],
      [
        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
      ],
      [
        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
      ],
      [
        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
      ],
      [
        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
      ],
      [
        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
      ],
      [
        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
      ],
      [
        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
      ],
      [
        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
      ],
      [
        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
      ],
      [
        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
      ],
      [
        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
      ],
      [
        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
      ],
      [
        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
      ],
      [
        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
      ],
      [
        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
      ],
      [
        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
      ],
      [
        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
      ],
      [
        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
      ],
      [
        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
      ],
      [
        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
      ],
      [
        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
      ],
      [
        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
      ],
      [
        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
      ],
      [
        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
      ],
      [
        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
      ],
      [
        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
      ],
      [
        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
      ],
      [
        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
      ],
      [
        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
      ],
      [
        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
      ],
      [
        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
      ],
      [
        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
      ],
      [
        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
      ],
      [
        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
      ],
      [
        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
      ],
      [
        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
      ],
      [
        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
      ],
      [
        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
      ],
      [
        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
      ],
      [
        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
      ],
      [
        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
      ],
      [
        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
      ],
      [
        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
      ],
      [
        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
      ],
      [
        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
      ],
      [
        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
      ],
      [
        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
      ],
      [
        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
      ],
      [
        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
      ],
      [
        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
      ],
      [
        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
      ],
      [
        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
      ],
      [
        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
      ],
      [
        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
      ],
      [
        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
      ],
      [
        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
      ],
      [
        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
      ],
      [
        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
      ],
      [
        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
      ],
      [
        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
      ],
      [
        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
      ],
      [
        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
      ],
      [
        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
      ],
      [
        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
      ],
      [
        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
      ],
      [
        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
      ],
      [
        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
      ],
      [
        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
      ],
      [
        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
      ],
      [
        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
      ],
      [
        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
      ],
      [
        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
      ],
      [
        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
      ],
      [
        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
      ],
      [
        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
      ],
      [
        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
      ],
      [
        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
      ],
      [
        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
      ],
      [
        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
      ],
      [
        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
      ],
      [
        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
      ],
      [
        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
      ],
      [
        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
      ],
      [
        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
      ],
      [
        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
      ],
      [
        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
      ],
      [
        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
      ],
      [
        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
      ],
      [
        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
      ],
      [
        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
      ],
      [
        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
      ],
      [
        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
      ],
      [
        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
      ],
      [
        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
      ],
      [
        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
      ],
      [
        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
      ],
      [
        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
      ],
      [
        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
      ],
      [
        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
      ],
      [
        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
      ],
      [
        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
      ],
      [
        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
      ]
    ]
  }
};

},{}],19:[function(require,module,exports){
'use strict';

var utils = exports;
var BN = require('bn.js');
var minAssert = require('minimalistic-assert');
var minUtils = require('minimalistic-crypto-utils');

utils.assert = minAssert;
utils.toArray = minUtils.toArray;
utils.zero2 = minUtils.zero2;
utils.toHex = minUtils.toHex;
utils.encode = minUtils.encode;

// Represent num in a w-NAF form
function getNAF(num, w, bits) {
  var naf = new Array(Math.max(num.bitLength(), bits) + 1);
  naf.fill(0);

  var ws = 1 << (w + 1);
  var k = num.clone();

  for (var i = 0; i < naf.length; i++) {
    var z;
    var mod = k.andln(ws - 1);
    if (k.isOdd()) {
      if (mod > (ws >> 1) - 1)
        z = (ws >> 1) - mod;
      else
        z = mod;
      k.isubn(z);
    } else {
      z = 0;
    }

    naf[i] = z;
    k.iushrn(1);
  }

  return naf;
}
utils.getNAF = getNAF;

// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
  var jsf = [
    [],
    []
  ];

  k1 = k1.clone();
  k2 = k2.clone();
  var d1 = 0;
  var d2 = 0;
  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

    // First phase
    var m14 = (k1.andln(3) + d1) & 3;
    var m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3)
      m14 = -1;
    if (m24 === 3)
      m24 = -1;
    var u1;
    if ((m14 & 1) === 0) {
      u1 = 0;
    } else {
      var m8 = (k1.andln(7) + d1) & 7;
      if ((m8 === 3 || m8 === 5) && m24 === 2)
        u1 = -m14;
      else
        u1 = m14;
    }
    jsf[0].push(u1);

    var u2;
    if ((m24 & 1) === 0) {
      u2 = 0;
    } else {
      var m8 = (k2.andln(7) + d2) & 7;
      if ((m8 === 3 || m8 === 5) && m14 === 2)
        u2 = -m24;
      else
        u2 = m24;
    }
    jsf[1].push(u2);

    // Second phase
    if (2 * d1 === u1 + 1)
      d1 = 1 - d1;
    if (2 * d2 === u2 + 1)
      d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function cachedProperty() {
    return this[key] !== undefined ? this[key] :
           this[key] = computer.call(this);
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
                                     bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new BN(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;


},{"bn.js":20,"minimalistic-assert":50,"minimalistic-crypto-utils":51}],20:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"buffer":90,"dup":2}],21:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "bitcoin-elliptic@7.0.1",
      "/home/aleks/Projects/bitUriParser"
    ]
  ],
  "_from": "bitcoin-elliptic@7.0.1",
  "_id": "bitcoin-elliptic@7.0.1",
  "_inBundle": false,
  "_integrity": "sha512-eJIERwXIIjJK7gfVoevk0G1CbYbxezZ6ePZXIxngjyI+QQHXWqXMbY+gpxsND8FCLvWl050fw6W+PVZge5fBHw==",
  "_location": "/bitcoin-elliptic",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "bitcoin-elliptic@7.0.1",
    "name": "bitcoin-elliptic",
    "escapedName": "bitcoin-elliptic",
    "rawSpec": "7.0.1",
    "saveSpec": null,
    "fetchSpec": "7.0.1"
  },
  "_requiredBy": [
    "/@moneybutton/brfc/bsv",
    "/@moneybutton/paymail-client/bsv"
  ],
  "_resolved": "https://registry.npmjs.org/bitcoin-elliptic/-/bitcoin-elliptic-7.0.1.tgz",
  "_spec": "7.0.1",
  "_where": "/home/aleks/Projects/bitUriParser",
  "author": {
    "name": "Fedor Indutny",
    "email": "fedor@indutny.com"
  },
  "bugs": {
    "url": "https://github.com/indutny/elliptic/issues"
  },
  "contributors": [
    {
      "name": "Ryan X. Charles",
      "email": "ryanxcharles@gmail.com"
    }
  ],
  "dependencies": {
    "bn.js": "^5.1.1",
    "brorand": "^1.0.1",
    "hash.js": "^1.0.0",
    "hmac-drbg": "^1.0.0",
    "inherits": "^2.0.1",
    "minimalistic-assert": "^1.0.0",
    "minimalistic-crypto-utils": "^1.0.0"
  },
  "description": "EC cryptography",
  "devDependencies": {
    "brfs": "^2.0.2",
    "coveralls": "^3.0.8",
    "grunt": "^1.0.4",
    "grunt-browserify": "^5.0.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-connect": "^2.1.0",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-uglify": "^4.0.1",
    "grunt-mocha-istanbul": "^5.0.2",
    "grunt-saucelabs": "^9.0.1",
    "istanbul": "^0.4.2",
    "jscs": "^3.0.7",
    "jshint": "^2.11.1",
    "mocha": "^7.1.2"
  },
  "files": [
    "lib"
  ],
  "homepage": "https://github.com/moneybutton/elliptic",
  "keywords": [
    "EC",
    "Elliptic",
    "curve",
    "Cryptography"
  ],
  "license": "MIT",
  "main": "lib/elliptic.js",
  "name": "bitcoin-elliptic",
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/moneybutton/elliptic.git"
  },
  "scripts": {
    "jscs": "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
    "jshint": "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
    "lint": "npm run jscs && npm run jshint",
    "test": "npm run lint && npm run unit",
    "unit": "istanbul test _mocha --reporter=spec test/index.js",
    "version": "grunt dist && git add dist/"
  },
  "version": "7.0.1"
}

},{}],22:[function(require,module,exports){
var r;

module.exports = function rand(len) {
  if (!r)
    r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;

Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
  if (this.rand.getBytes)
    return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++)
    res[i] = this.rand.getByte();
  return res;
};

if (typeof self === 'object') {
  if (self.crypto && self.crypto.getRandomValues) {
    // Modern browsers
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    // IE
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };

  // Safari's WebWorkers do not have `crypto`
  } else if (typeof window === 'object') {
    // Old junk
    Rand.prototype._rand = function() {
      throw new Error('Not implemented yet');
    };
  }
} else {
  // Node.js or Web worker with no crypto support
  try {
    var crypto = require('crypto');
    if (typeof crypto.randomBytes !== 'function')
      throw new Error('Not supported');

    Rand.prototype._rand = function _rand(n) {
      return crypto.randomBytes(n);
    };
  } catch (e) {
  }
}

},{"crypto":90}],23:[function(require,module,exports){
var basex = require('base-x')
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)

},{"base-x":9}],24:[function(require,module,exports){
var MD5 = require('md5.js')

module.exports = function (buffer) {
  return new MD5().update(buffer).digest()
}

},{"md5.js":49}],25:[function(require,module,exports){
'use strict'
var Buffer = require('safe-buffer').Buffer
var Transform = require('readable-stream').Transform
var inherits = require('inherits')

function throwIfNotStringOrBuffer (val, prefix) {
  if (!Buffer.isBuffer(val) && typeof val !== 'string') {
    throw new TypeError(prefix + ' must be a string or a buffer')
  }
}

function HashBase (blockSize) {
  Transform.call(this)

  this._block = Buffer.allocUnsafe(blockSize)
  this._blockSize = blockSize
  this._blockOffset = 0
  this._length = [0, 0, 0, 0]

  this._finalized = false
}

inherits(HashBase, Transform)

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    this.update(chunk, encoding)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this.digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype.update = function (data, encoding) {
  throwIfNotStringOrBuffer(data, 'Data')
  if (this._finalized) throw new Error('Digest already called')
  if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding)

  // consume data
  var block = this._block
  var offset = 0
  while (this._blockOffset + data.length - offset >= this._blockSize) {
    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++]
    this._update()
    this._blockOffset = 0
  }
  while (offset < data.length) block[this._blockOffset++] = data[offset++]

  // update length
  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
    this._length[j] += carry
    carry = (this._length[j] / 0x0100000000) | 0
    if (carry > 0) this._length[j] -= 0x0100000000 * carry
  }

  return this
}

HashBase.prototype._update = function () {
  throw new Error('_update is not implemented')
}

HashBase.prototype.digest = function (encoding) {
  if (this._finalized) throw new Error('Digest already called')
  this._finalized = true

  var digest = this._digest()
  if (encoding !== undefined) digest = digest.toString(encoding)

  // reset state
  this._block.fill(0)
  this._blockOffset = 0
  for (var i = 0; i < 4; ++i) this._length[i] = 0

  return digest
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

module.exports = HashBase

},{"inherits":26,"readable-stream":74,"safe-buffer":76}],26:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],27:[function(require,module,exports){
var hash = exports;

hash.utils = require('./hash/utils');
hash.common = require('./hash/common');
hash.sha = require('./hash/sha');
hash.ripemd = require('./hash/ripemd');
hash.hmac = require('./hash/hmac');

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;

},{"./hash/common":28,"./hash/hmac":29,"./hash/ripemd":30,"./hash/sha":31,"./hash/utils":38}],28:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var assert = require('minimalistic-assert');

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};

},{"./utils":38,"minimalistic-assert":50}],29:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var assert = require('minimalistic-assert');

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};

},{"./utils":38,"minimalistic-assert":50}],30:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var common = require('./common');

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];

},{"./common":28,"./utils":38}],31:[function(require,module,exports){
'use strict';

exports.sha1 = require('./sha/1');
exports.sha224 = require('./sha/224');
exports.sha256 = require('./sha/256');
exports.sha384 = require('./sha/384');
exports.sha512 = require('./sha/512');

},{"./sha/1":32,"./sha/224":33,"./sha/256":34,"./sha/384":35,"./sha/512":36}],32:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var common = require('../common');
var shaCommon = require('./common');

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

},{"../common":28,"../utils":38,"./common":37}],33:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var SHA256 = require('./256');

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};


},{"../utils":38,"./256":34}],34:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var common = require('../common');
var shaCommon = require('./common');
var assert = require('minimalistic-assert');

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

},{"../common":28,"../utils":38,"./common":37,"minimalistic-assert":50}],35:[function(require,module,exports){
'use strict';

var utils = require('../utils');

var SHA512 = require('./512');

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};

},{"../utils":38,"./512":36}],36:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var common = require('../common');
var assert = require('minimalistic-assert');

var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;

var BlockHash = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

},{"../common":28,"../utils":38,"minimalistic-assert":50}],37:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;

},{"../utils":38}],38:[function(require,module,exports){
'use strict';

var assert = require('minimalistic-assert');
var inherits = require('inherits');

exports.inherits = inherits;

function isSurrogatePair(msg, i) {
  if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
    return false;
  }
  if (i < 0 || i + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      // Inspired by stringToUtf8ByteArray() in closure-library by Google
      // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
      // Apache License 2.0
      // https://github.com/google/closure-library/blob/master/LICENSE
      var p = 0;
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) {
          res[p++] = c;
        } else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;

},{"inherits":46,"minimalistic-assert":50}],39:[function(require,module,exports){
'use strict';

var hash = require('hash.js');
var utils = require('minimalistic-crypto-utils');
var assert = require('minimalistic-assert');

function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG))
    return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils.toArray(options.entropy, options.entropyEnc || 'hex');
  var nonce = utils.toArray(options.nonce, options.nonceEnc || 'hex');
  var pers = utils.toArray(options.pers, options.persEnc || 'hex');
  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
module.exports = HmacDRBG;

HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;  // 2^48
};

HmacDRBG.prototype._hmac = function hmac() {
  return new hash.hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function update(seed) {
  var kmac = this._hmac()
                 .update(this.V)
                 .update([ 0x00 ]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;

  this.K = this._hmac()
               .update(this.V)
               .update([ 0x01 ])
               .update(seed)
               .digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
  // Optional entropy enc
  if (typeof entropyEnc !== 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils.toArray(entropy, entropyEnc);
  add = utils.toArray(add, addEnc);

  assert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error('Reseed is required');

  // Optional encoding
  if (typeof enc !== 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  // Optional additional data
  if (add) {
    add = utils.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils.encode(res, enc);
};

},{"hash.js":27,"minimalistic-assert":50,"minimalistic-crypto-utils":51}],40:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var legacy_1 = __importDefault(require("./legacy"));
var utils_functions_1 = require("./utils-functions");
var utils_functions_2 = require("./utils-functions");
Object.defineProperty(exports, "getStatusCode", { enumerable: true, get: function () { return utils_functions_2.getStatusCode; } });
Object.defineProperty(exports, "getReasonPhrase", { enumerable: true, get: function () { return utils_functions_2.getReasonPhrase; } });
Object.defineProperty(exports, "getStatusText", { enumerable: true, get: function () { return utils_functions_2.getStatusText; } });
var status_codes_1 = require("./status-codes");
Object.defineProperty(exports, "StatusCodes", { enumerable: true, get: function () { return status_codes_1.StatusCodes; } });
var reason_phrases_1 = require("./reason-phrases");
Object.defineProperty(exports, "ReasonPhrases", { enumerable: true, get: function () { return reason_phrases_1.ReasonPhrases; } });
__exportStar(require("./legacy"), exports);
exports.default = __assign(__assign({}, legacy_1.default), { getStatusCode: utils_functions_1.getStatusCode,
    getStatusText: utils_functions_1.getStatusText });

},{"./legacy":41,"./reason-phrases":42,"./status-codes":43,"./utils-functions":44}],41:[function(require,module,exports){
"use strict";
// Exporting constants directly to maintain compatability with v1
// These are deprecated. Please don't add any new codes here.
Object.defineProperty(exports, "__esModule", { value: true });
exports.USE_PROXY = exports.UNSUPPORTED_MEDIA_TYPE = exports.UNPROCESSABLE_ENTITY = exports.UNAUTHORIZED = exports.TOO_MANY_REQUESTS = exports.TEMPORARY_REDIRECT = exports.SWITCHING_PROTOCOLS = exports.SERVICE_UNAVAILABLE = exports.SEE_OTHER = exports.RESET_CONTENT = exports.REQUESTED_RANGE_NOT_SATISFIABLE = exports.REQUEST_URI_TOO_LONG = exports.REQUEST_TOO_LONG = exports.REQUEST_TIMEOUT = exports.REQUEST_HEADER_FIELDS_TOO_LARGE = exports.PROXY_AUTHENTICATION_REQUIRED = exports.PROCESSING = exports.PRECONDITION_REQUIRED = exports.PRECONDITION_FAILED = exports.PERMANENT_REDIRECT = exports.PAYMENT_REQUIRED = exports.PARTIAL_CONTENT = exports.OK = exports.NOT_MODIFIED = exports.NOT_IMPLEMENTED = exports.NOT_FOUND = exports.NOT_ACCEPTABLE = exports.NON_AUTHORITATIVE_INFORMATION = exports.NO_CONTENT = exports.NETWORK_AUTHENTICATION_REQUIRED = exports.MULTIPLE_CHOICES = exports.MULTI_STATUS = exports.MOVED_TEMPORARILY = exports.MOVED_PERMANENTLY = exports.METHOD_NOT_ALLOWED = exports.METHOD_FAILURE = exports.LOCKED = exports.LENGTH_REQUIRED = exports.INTERNAL_SERVER_ERROR = exports.INSUFFICIENT_STORAGE = exports.INSUFFICIENT_SPACE_ON_RESOURCE = exports.IM_A_TEAPOT = exports.HTTP_VERSION_NOT_SUPPORTED = exports.GONE = exports.GATEWAY_TIMEOUT = exports.FORBIDDEN = exports.FAILED_DEPENDENCY = exports.EXPECTATION_FAILED = exports.CREATED = exports.CONTINUE = exports.CONFLICT = exports.BAD_REQUEST = exports.BAD_GATEWAY = exports.ACCEPTED = void 0;
/**
 * @deprecated Please use StatusCodes.ACCEPTED
 *
 * */
exports.ACCEPTED = 202;
/**
 * @deprecated Please use StatusCodes.BAD_GATEWAY
 *
 * */
exports.BAD_GATEWAY = 502;
/**
 * @deprecated Please use StatusCodes.BAD_REQUEST
 *
 * */
exports.BAD_REQUEST = 400;
/**
 * @deprecated Please use StatusCodes.CONFLICT
 *
 * */
exports.CONFLICT = 409;
/**
 * @deprecated Please use StatusCodes.CONTINUE
 *
 * */
exports.CONTINUE = 100;
/**
 * @deprecated Please use StatusCodes.CREATED
 *
 * */
exports.CREATED = 201;
/**
 * @deprecated Please use StatusCodes.EXPECTATION_FAILED
 *
 * */
exports.EXPECTATION_FAILED = 417;
/**
 * @deprecated Please use StatusCodes.FAILED_DEPENDENCY
 *
 * */
exports.FAILED_DEPENDENCY = 424;
/**
 * @deprecated Please use StatusCodes.FORBIDDEN
 *
 * */
exports.FORBIDDEN = 403;
/**
 * @deprecated Please use StatusCodes.GATEWAY_TIMEOUT
 *
 * */
exports.GATEWAY_TIMEOUT = 504;
/**
 * @deprecated Please use StatusCodes.GONE
 *
 * */
exports.GONE = 410;
/**
 * @deprecated Please use StatusCodes.HTTP_VERSION_NOT_SUPPORTED
 *
 * */
exports.HTTP_VERSION_NOT_SUPPORTED = 505;
/**
 * @deprecated Please use StatusCodes.IM_A_TEAPOT
 *
 * */
exports.IM_A_TEAPOT = 418;
/**
 * @deprecated Please use StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE
 *
 * */
exports.INSUFFICIENT_SPACE_ON_RESOURCE = 419;
/**
 * @deprecated Please use StatusCodes.INSUFFICIENT_STORAGE
 *
 * */
exports.INSUFFICIENT_STORAGE = 507;
/**
 * @deprecated Please use StatusCodes.INTERNAL_SERVER_ERROR
 *
 * */
exports.INTERNAL_SERVER_ERROR = 500;
/**
 * @deprecated Please use StatusCodes.LENGTH_REQUIRED
 *
 * */
exports.LENGTH_REQUIRED = 411;
/**
 * @deprecated Please use StatusCodes.LOCKED
 *
 * */
exports.LOCKED = 423;
/**
 * @deprecated Please use StatusCodes.METHOD_FAILURE
 *
 * */
exports.METHOD_FAILURE = 420;
/**
 * @deprecated Please use StatusCodes.METHOD_NOT_ALLOWED
 *
 * */
exports.METHOD_NOT_ALLOWED = 405;
/**
 * @deprecated Please use StatusCodes.MOVED_PERMANENTLY
 *
 * */
exports.MOVED_PERMANENTLY = 301;
/**
 * @deprecated Please use StatusCodes.MOVED_TEMPORARILY
 *
 * */
exports.MOVED_TEMPORARILY = 302;
/**
 * @deprecated Please use StatusCodes.MULTI_STATUS
 *
 * */
exports.MULTI_STATUS = 207;
/**
 * @deprecated Please use StatusCodes.MULTIPLE_CHOICES
 *
 * */
exports.MULTIPLE_CHOICES = 300;
/**
 * @deprecated Please use StatusCodes.NETWORK_AUTHENTICATION_REQUIRED
 *
 * */
exports.NETWORK_AUTHENTICATION_REQUIRED = 511;
/**
 * @deprecated Please use StatusCodes.NO_CONTENT
 *
 * */
exports.NO_CONTENT = 204;
/**
 * @deprecated Please use StatusCodes.NON_AUTHORITATIVE_INFORMATION
 *
 * */
exports.NON_AUTHORITATIVE_INFORMATION = 203;
/**
 * @deprecated Please use StatusCodes.NOT_ACCEPTABLE
 *
 * */
exports.NOT_ACCEPTABLE = 406;
/**
 * @deprecated Please use StatusCodes.NOT_FOUND
 *
 * */
exports.NOT_FOUND = 404;
/**
 * @deprecated Please use StatusCodes.NOT_IMPLEMENTED
 *
 * */
exports.NOT_IMPLEMENTED = 501;
/**
 * @deprecated Please use StatusCodes.NOT_MODIFIED
 *
 * */
exports.NOT_MODIFIED = 304;
/**
 * @deprecated Please use StatusCodes.OK
 *
 * */
exports.OK = 200;
/**
 * @deprecated Please use StatusCodes.PARTIAL_CONTENT
 *
 * */
exports.PARTIAL_CONTENT = 206;
/**
 * @deprecated Please use StatusCodes.PAYMENT_REQUIRED
 *
 * */
exports.PAYMENT_REQUIRED = 402;
/**
 * @deprecated Please use StatusCodes.PERMANENT_REDIRECT
 *
 * */
exports.PERMANENT_REDIRECT = 308;
/**
 * @deprecated Please use StatusCodes.PRECONDITION_FAILED
 *
 * */
exports.PRECONDITION_FAILED = 412;
/**
 * @deprecated Please use StatusCodes.PRECONDITION_REQUIRED
 *
 * */
exports.PRECONDITION_REQUIRED = 428;
/**
 * @deprecated Please use StatusCodes.PROCESSING
 *
 * */
exports.PROCESSING = 102;
/**
 * @deprecated Please use StatusCodes.PROXY_AUTHENTICATION_REQUIRED
 *
 * */
exports.PROXY_AUTHENTICATION_REQUIRED = 407;
/**
 * @deprecated Please use StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
 *
 * */
exports.REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
/**
 * @deprecated Please use StatusCodes.REQUEST_TIMEOUT
 *
 * */
exports.REQUEST_TIMEOUT = 408;
/**
 * @deprecated Please use StatusCodes.REQUEST_TOO_LONG
 *
 * */
exports.REQUEST_TOO_LONG = 413;
/**
 * @deprecated Please use StatusCodes.REQUEST_URI_TOO_LONG
 *
 * */
exports.REQUEST_URI_TOO_LONG = 414;
/**
 * @deprecated Please use StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE
 *
 * */
exports.REQUESTED_RANGE_NOT_SATISFIABLE = 416;
/**
 * @deprecated Please use StatusCodes.RESET_CONTENT
 *
 * */
exports.RESET_CONTENT = 205;
/**
 * @deprecated Please use StatusCodes.SEE_OTHER
 *
 * */
exports.SEE_OTHER = 303;
/**
 * @deprecated Please use StatusCodes.SERVICE_UNAVAILABLE
 *
 * */
exports.SERVICE_UNAVAILABLE = 503;
/**
 * @deprecated Please use StatusCodes.SWITCHING_PROTOCOLS
 *
 * */
exports.SWITCHING_PROTOCOLS = 101;
/**
 * @deprecated Please use StatusCodes.TEMPORARY_REDIRECT
 *
 * */
exports.TEMPORARY_REDIRECT = 307;
/**
 * @deprecated Please use StatusCodes.TOO_MANY_REQUESTS
 *
 * */
exports.TOO_MANY_REQUESTS = 429;
/**
 * @deprecated Please use StatusCodes.UNAUTHORIZED
 *
 * */
exports.UNAUTHORIZED = 401;
/**
 * @deprecated Please use StatusCodes.UNPROCESSABLE_ENTITY
 *
 * */
exports.UNPROCESSABLE_ENTITY = 422;
/**
 * @deprecated Please use StatusCodes.UNSUPPORTED_MEDIA_TYPE
 *
 * */
exports.UNSUPPORTED_MEDIA_TYPE = 415;
/**
 * @deprecated Please use StatusCodes.USE_PROXY
 *
 * */
exports.USE_PROXY = 305;
exports.default = {
    ACCEPTED: exports.ACCEPTED,
    BAD_GATEWAY: exports.BAD_GATEWAY,
    BAD_REQUEST: exports.BAD_REQUEST,
    CONFLICT: exports.CONFLICT,
    CONTINUE: exports.CONTINUE,
    CREATED: exports.CREATED,
    EXPECTATION_FAILED: exports.EXPECTATION_FAILED,
    FORBIDDEN: exports.FORBIDDEN,
    GATEWAY_TIMEOUT: exports.GATEWAY_TIMEOUT,
    GONE: exports.GONE,
    HTTP_VERSION_NOT_SUPPORTED: exports.HTTP_VERSION_NOT_SUPPORTED,
    IM_A_TEAPOT: exports.IM_A_TEAPOT,
    INSUFFICIENT_SPACE_ON_RESOURCE: exports.INSUFFICIENT_SPACE_ON_RESOURCE,
    INSUFFICIENT_STORAGE: exports.INSUFFICIENT_STORAGE,
    INTERNAL_SERVER_ERROR: exports.INTERNAL_SERVER_ERROR,
    LENGTH_REQUIRED: exports.LENGTH_REQUIRED,
    LOCKED: exports.LOCKED,
    METHOD_FAILURE: exports.METHOD_FAILURE,
    METHOD_NOT_ALLOWED: exports.METHOD_NOT_ALLOWED,
    MOVED_PERMANENTLY: exports.MOVED_PERMANENTLY,
    MOVED_TEMPORARILY: exports.MOVED_TEMPORARILY,
    MULTI_STATUS: exports.MULTI_STATUS,
    MULTIPLE_CHOICES: exports.MULTIPLE_CHOICES,
    NETWORK_AUTHENTICATION_REQUIRED: exports.NETWORK_AUTHENTICATION_REQUIRED,
    NO_CONTENT: exports.NO_CONTENT,
    NON_AUTHORITATIVE_INFORMATION: exports.NON_AUTHORITATIVE_INFORMATION,
    NOT_ACCEPTABLE: exports.NOT_ACCEPTABLE,
    NOT_FOUND: exports.NOT_FOUND,
    NOT_IMPLEMENTED: exports.NOT_IMPLEMENTED,
    NOT_MODIFIED: exports.NOT_MODIFIED,
    OK: exports.OK,
    PARTIAL_CONTENT: exports.PARTIAL_CONTENT,
    PAYMENT_REQUIRED: exports.PAYMENT_REQUIRED,
    PERMANENT_REDIRECT: exports.PERMANENT_REDIRECT,
    PRECONDITION_FAILED: exports.PRECONDITION_FAILED,
    PRECONDITION_REQUIRED: exports.PRECONDITION_REQUIRED,
    PROCESSING: exports.PROCESSING,
    PROXY_AUTHENTICATION_REQUIRED: exports.PROXY_AUTHENTICATION_REQUIRED,
    REQUEST_HEADER_FIELDS_TOO_LARGE: exports.REQUEST_HEADER_FIELDS_TOO_LARGE,
    REQUEST_TIMEOUT: exports.REQUEST_TIMEOUT,
    REQUEST_TOO_LONG: exports.REQUEST_TOO_LONG,
    REQUEST_URI_TOO_LONG: exports.REQUEST_URI_TOO_LONG,
    REQUESTED_RANGE_NOT_SATISFIABLE: exports.REQUESTED_RANGE_NOT_SATISFIABLE,
    RESET_CONTENT: exports.RESET_CONTENT,
    SEE_OTHER: exports.SEE_OTHER,
    SERVICE_UNAVAILABLE: exports.SERVICE_UNAVAILABLE,
    SWITCHING_PROTOCOLS: exports.SWITCHING_PROTOCOLS,
    TEMPORARY_REDIRECT: exports.TEMPORARY_REDIRECT,
    TOO_MANY_REQUESTS: exports.TOO_MANY_REQUESTS,
    UNAUTHORIZED: exports.UNAUTHORIZED,
    UNPROCESSABLE_ENTITY: exports.UNPROCESSABLE_ENTITY,
    UNSUPPORTED_MEDIA_TYPE: exports.UNSUPPORTED_MEDIA_TYPE,
    USE_PROXY: exports.USE_PROXY,
};

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReasonPhrases = void 0;
// Generated file. Do not edit
var ReasonPhrases;
(function (ReasonPhrases) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    ReasonPhrases["ACCEPTED"] = "Accepted";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    ReasonPhrases["BAD_GATEWAY"] = "Bad Gateway";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    ReasonPhrases["BAD_REQUEST"] = "Bad Request";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    ReasonPhrases["CONFLICT"] = "Conflict";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    ReasonPhrases["CONTINUE"] = "Continue";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    ReasonPhrases["CREATED"] = "Created";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    ReasonPhrases["EXPECTATION_FAILED"] = "Expectation Failed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    ReasonPhrases["FAILED_DEPENDENCY"] = "Failed Dependency";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    ReasonPhrases["FORBIDDEN"] = "Forbidden";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    ReasonPhrases["GATEWAY_TIMEOUT"] = "Gateway Timeout";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    ReasonPhrases["GONE"] = "Gone";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    ReasonPhrases["HTTP_VERSION_NOT_SUPPORTED"] = "HTTP Version Not Supported";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    ReasonPhrases["IM_A_TEAPOT"] = "I'm a teapot";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    ReasonPhrases["INSUFFICIENT_SPACE_ON_RESOURCE"] = "Insufficient Space on Resource";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    ReasonPhrases["INSUFFICIENT_STORAGE"] = "Insufficient Storage";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    ReasonPhrases["INTERNAL_SERVER_ERROR"] = "Internal Server Error";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    ReasonPhrases["LENGTH_REQUIRED"] = "Length Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    ReasonPhrases["LOCKED"] = "Locked";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    ReasonPhrases["METHOD_FAILURE"] = "Method Failure";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    ReasonPhrases["METHOD_NOT_ALLOWED"] = "Method Not Allowed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    ReasonPhrases["MOVED_PERMANENTLY"] = "Moved Permanently";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    ReasonPhrases["MOVED_TEMPORARILY"] = "Moved Temporarily";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    ReasonPhrases["MULTI_STATUS"] = "Multi-Status";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    ReasonPhrases["MULTIPLE_CHOICES"] = "Multiple Choices";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    ReasonPhrases["NETWORK_AUTHENTICATION_REQUIRED"] = "Network Authentication Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    ReasonPhrases["NO_CONTENT"] = "No Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    ReasonPhrases["NON_AUTHORITATIVE_INFORMATION"] = "Non Authoritative Information";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    ReasonPhrases["NOT_ACCEPTABLE"] = "Not Acceptable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
     */
    ReasonPhrases["NOT_FOUND"] = "Not Found";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    ReasonPhrases["NOT_IMPLEMENTED"] = "Not Implemented";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    ReasonPhrases["NOT_MODIFIED"] = "Not Modified";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    ReasonPhrases["OK"] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    ReasonPhrases["PARTIAL_CONTENT"] = "Partial Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    ReasonPhrases["PAYMENT_REQUIRED"] = "Payment Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    ReasonPhrases["PERMANENT_REDIRECT"] = "Permanent Redirect";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    ReasonPhrases["PRECONDITION_FAILED"] = "Precondition Failed";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    ReasonPhrases["PRECONDITION_REQUIRED"] = "Precondition Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    ReasonPhrases["PROCESSING"] = "Processing";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    ReasonPhrases["PROXY_AUTHENTICATION_REQUIRED"] = "Proxy Authentication Required";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    ReasonPhrases["REQUEST_HEADER_FIELDS_TOO_LARGE"] = "Request Header Fields Too Large";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    ReasonPhrases["REQUEST_TIMEOUT"] = "Request Timeout";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    ReasonPhrases["REQUEST_TOO_LONG"] = "Request Entity Too Large";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    ReasonPhrases["REQUEST_URI_TOO_LONG"] = "Request-URI Too Long";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    ReasonPhrases["REQUESTED_RANGE_NOT_SATISFIABLE"] = "Requested Range Not Satisfiable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    ReasonPhrases["RESET_CONTENT"] = "Reset Content";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    ReasonPhrases["SEE_OTHER"] = "See Other";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    ReasonPhrases["SERVICE_UNAVAILABLE"] = "Service Unavailable";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    ReasonPhrases["SWITCHING_PROTOCOLS"] = "Switching Protocols";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    ReasonPhrases["TEMPORARY_REDIRECT"] = "Temporary Redirect";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    ReasonPhrases["TOO_MANY_REQUESTS"] = "Too Many Requests";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    ReasonPhrases["UNAUTHORIZED"] = "Unauthorized";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    ReasonPhrases["UNAVAILABLE_FOR_LEGAL_REASONS"] = "Unavailable For Legal Reasons";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    ReasonPhrases["UNPROCESSABLE_ENTITY"] = "Unprocessable Entity";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    ReasonPhrases["UNSUPPORTED_MEDIA_TYPE"] = "Unsupported Media Type";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    ReasonPhrases["USE_PROXY"] = "Use Proxy";
})(ReasonPhrases = exports.ReasonPhrases || (exports.ReasonPhrases = {}));

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = void 0;
// Generated file. Do not edit
var StatusCodes;
(function (StatusCodes) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    StatusCodes[StatusCodes["ACCEPTED"] = 202] = "ACCEPTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    StatusCodes[StatusCodes["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    StatusCodes[StatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    StatusCodes[StatusCodes["CONFLICT"] = 409] = "CONFLICT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    StatusCodes[StatusCodes["CONTINUE"] = 100] = "CONTINUE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    StatusCodes[StatusCodes["CREATED"] = 201] = "CREATED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    StatusCodes[StatusCodes["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    StatusCodes[StatusCodes["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    StatusCodes[StatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    StatusCodes[StatusCodes["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    StatusCodes[StatusCodes["GONE"] = 410] = "GONE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    StatusCodes[StatusCodes["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    StatusCodes[StatusCodes["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_SPACE_ON_RESOURCE"] = 419] = "INSUFFICIENT_SPACE_ON_RESOURCE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    StatusCodes[StatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    StatusCodes[StatusCodes["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    StatusCodes[StatusCodes["LOCKED"] = 423] = "LOCKED";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    StatusCodes[StatusCodes["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    StatusCodes[StatusCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    StatusCodes[StatusCodes["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    StatusCodes[StatusCodes["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    StatusCodes[StatusCodes["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    StatusCodes[StatusCodes["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    StatusCodes[StatusCodes["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    StatusCodes[StatusCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    StatusCodes[StatusCodes["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    StatusCodes[StatusCodes["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
     */
    StatusCodes[StatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    StatusCodes[StatusCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    StatusCodes[StatusCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    StatusCodes[StatusCodes["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    StatusCodes[StatusCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    StatusCodes[StatusCodes["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    StatusCodes[StatusCodes["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    StatusCodes[StatusCodes["PROCESSING"] = 102] = "PROCESSING";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    StatusCodes[StatusCodes["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    StatusCodes[StatusCodes["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    StatusCodes[StatusCodes["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    StatusCodes[StatusCodes["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    StatusCodes[StatusCodes["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    StatusCodes[StatusCodes["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    StatusCodes[StatusCodes["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    StatusCodes[StatusCodes["SEE_OTHER"] = 303] = "SEE_OTHER";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    StatusCodes[StatusCodes["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    StatusCodes[StatusCodes["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    StatusCodes[StatusCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    StatusCodes[StatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    StatusCodes[StatusCodes["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    StatusCodes[StatusCodes["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    StatusCodes[StatusCodes["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    StatusCodes[StatusCodes["USE_PROXY"] = 305] = "USE_PROXY";
})(StatusCodes = exports.StatusCodes || (exports.StatusCodes = {}));

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusText = exports.getStatusCode = exports.getReasonPhrase = void 0;
var utils_1 = require("./utils");
/**
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, an error is thrown.
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
function getReasonPhrase(statusCode) {
    var result = utils_1.statusCodeToReasonPhrase[statusCode.toString()];
    if (!result) {
        throw new Error("Status code does not exist: " + statusCode);
    }
    return result;
}
exports.getReasonPhrase = getReasonPhrase;
/**
 * Returns the status code for the given reason phrase.
 * If the given reason phrase does not exist, undefined is returned.
 *
 * @param {string} reasonPhrase The HTTP reason phrase (e.g. "Bad Request", "OK")
 * @returns {string} The associated status code
 * */
function getStatusCode(reasonPhrase) {
    var result = utils_1.reasonPhraseToStatusCode[reasonPhrase];
    if (!result) {
        throw new Error("Reason phrase does not exist: " + reasonPhrase);
    }
    return result;
}
exports.getStatusCode = getStatusCode;
/**
 * @deprecated
 *
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, undefined is returned.
 *
 * Deprecated in favor of getReasonPhrase
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string|undefined} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
exports.getStatusText = getReasonPhrase;

},{"./utils":45}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reasonPhraseToStatusCode = exports.statusCodeToReasonPhrase = void 0;
// Generated file. Do not edit
exports.statusCodeToReasonPhrase = {
    "202": "Accepted",
    "502": "Bad Gateway",
    "400": "Bad Request",
    "409": "Conflict",
    "100": "Continue",
    "201": "Created",
    "417": "Expectation Failed",
    "424": "Failed Dependency",
    "403": "Forbidden",
    "504": "Gateway Timeout",
    "410": "Gone",
    "505": "HTTP Version Not Supported",
    "418": "I'm a teapot",
    "419": "Insufficient Space on Resource",
    "507": "Insufficient Storage",
    "500": "Internal Server Error",
    "411": "Length Required",
    "423": "Locked",
    "420": "Method Failure",
    "405": "Method Not Allowed",
    "301": "Moved Permanently",
    "302": "Moved Temporarily",
    "207": "Multi-Status",
    "300": "Multiple Choices",
    "511": "Network Authentication Required",
    "204": "No Content",
    "203": "Non Authoritative Information",
    "406": "Not Acceptable",
    "404": "Not Found",
    "501": "Not Implemented",
    "304": "Not Modified",
    "200": "OK",
    "206": "Partial Content",
    "402": "Payment Required",
    "308": "Permanent Redirect",
    "412": "Precondition Failed",
    "428": "Precondition Required",
    "102": "Processing",
    "407": "Proxy Authentication Required",
    "431": "Request Header Fields Too Large",
    "408": "Request Timeout",
    "413": "Request Entity Too Large",
    "414": "Request-URI Too Long",
    "416": "Requested Range Not Satisfiable",
    "205": "Reset Content",
    "303": "See Other",
    "503": "Service Unavailable",
    "101": "Switching Protocols",
    "307": "Temporary Redirect",
    "429": "Too Many Requests",
    "401": "Unauthorized",
    "451": "Unavailable For Legal Reasons",
    "422": "Unprocessable Entity",
    "415": "Unsupported Media Type",
    "305": "Use Proxy"
};
exports.reasonPhraseToStatusCode = {
    "Accepted": 202,
    "Bad Gateway": 502,
    "Bad Request": 400,
    "Conflict": 409,
    "Continue": 100,
    "Created": 201,
    "Expectation Failed": 417,
    "Failed Dependency": 424,
    "Forbidden": 403,
    "Gateway Timeout": 504,
    "Gone": 410,
    "HTTP Version Not Supported": 505,
    "I'm a teapot": 418,
    "Insufficient Space on Resource": 419,
    "Insufficient Storage": 507,
    "Internal Server Error": 500,
    "Length Required": 411,
    "Locked": 423,
    "Method Failure": 420,
    "Method Not Allowed": 405,
    "Moved Permanently": 301,
    "Moved Temporarily": 302,
    "Multi-Status": 207,
    "Multiple Choices": 300,
    "Network Authentication Required": 511,
    "No Content": 204,
    "Non Authoritative Information": 203,
    "Not Acceptable": 406,
    "Not Found": 404,
    "Not Implemented": 501,
    "Not Modified": 304,
    "OK": 200,
    "Partial Content": 206,
    "Payment Required": 402,
    "Permanent Redirect": 308,
    "Precondition Failed": 412,
    "Precondition Required": 428,
    "Processing": 102,
    "Proxy Authentication Required": 407,
    "Request Header Fields Too Large": 431,
    "Request Timeout": 408,
    "Request Entity Too Large": 413,
    "Request-URI Too Long": 414,
    "Requested Range Not Satisfiable": 416,
    "Reset Content": 205,
    "See Other": 303,
    "Service Unavailable": 503,
    "Switching Protocols": 101,
    "Temporary Redirect": 307,
    "Too Many Requests": 429,
    "Unauthorized": 401,
    "Unavailable For Legal Reasons": 451,
    "Unprocessable Entity": 422,
    "Unsupported Media Type": 415,
    "Use Proxy": 305
};

},{}],46:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],47:[function(require,module,exports){
'use strict'

var hexRegEx = /([0-9]|[a-f])/gim

module.exports = function (input) {
  return typeof input === 'string' &&
    (input.match(hexRegEx) || []).length === input.length
}

},{}],48:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":87}],49:[function(require,module,exports){
'use strict'
var inherits = require('inherits')
var HashBase = require('hash-base')
var Buffer = require('safe-buffer').Buffer

var ARRAY16 = new Array(16)

function MD5 () {
  HashBase.call(this, 64)

  // state
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
}

inherits(MD5, HashBase)

MD5.prototype._update = function () {
  var M = ARRAY16
  for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(i * 4)

  var a = this._a
  var b = this._b
  var c = this._c
  var d = this._d

  a = fnF(a, b, c, d, M[0], 0xd76aa478, 7)
  d = fnF(d, a, b, c, M[1], 0xe8c7b756, 12)
  c = fnF(c, d, a, b, M[2], 0x242070db, 17)
  b = fnF(b, c, d, a, M[3], 0xc1bdceee, 22)
  a = fnF(a, b, c, d, M[4], 0xf57c0faf, 7)
  d = fnF(d, a, b, c, M[5], 0x4787c62a, 12)
  c = fnF(c, d, a, b, M[6], 0xa8304613, 17)
  b = fnF(b, c, d, a, M[7], 0xfd469501, 22)
  a = fnF(a, b, c, d, M[8], 0x698098d8, 7)
  d = fnF(d, a, b, c, M[9], 0x8b44f7af, 12)
  c = fnF(c, d, a, b, M[10], 0xffff5bb1, 17)
  b = fnF(b, c, d, a, M[11], 0x895cd7be, 22)
  a = fnF(a, b, c, d, M[12], 0x6b901122, 7)
  d = fnF(d, a, b, c, M[13], 0xfd987193, 12)
  c = fnF(c, d, a, b, M[14], 0xa679438e, 17)
  b = fnF(b, c, d, a, M[15], 0x49b40821, 22)

  a = fnG(a, b, c, d, M[1], 0xf61e2562, 5)
  d = fnG(d, a, b, c, M[6], 0xc040b340, 9)
  c = fnG(c, d, a, b, M[11], 0x265e5a51, 14)
  b = fnG(b, c, d, a, M[0], 0xe9b6c7aa, 20)
  a = fnG(a, b, c, d, M[5], 0xd62f105d, 5)
  d = fnG(d, a, b, c, M[10], 0x02441453, 9)
  c = fnG(c, d, a, b, M[15], 0xd8a1e681, 14)
  b = fnG(b, c, d, a, M[4], 0xe7d3fbc8, 20)
  a = fnG(a, b, c, d, M[9], 0x21e1cde6, 5)
  d = fnG(d, a, b, c, M[14], 0xc33707d6, 9)
  c = fnG(c, d, a, b, M[3], 0xf4d50d87, 14)
  b = fnG(b, c, d, a, M[8], 0x455a14ed, 20)
  a = fnG(a, b, c, d, M[13], 0xa9e3e905, 5)
  d = fnG(d, a, b, c, M[2], 0xfcefa3f8, 9)
  c = fnG(c, d, a, b, M[7], 0x676f02d9, 14)
  b = fnG(b, c, d, a, M[12], 0x8d2a4c8a, 20)

  a = fnH(a, b, c, d, M[5], 0xfffa3942, 4)
  d = fnH(d, a, b, c, M[8], 0x8771f681, 11)
  c = fnH(c, d, a, b, M[11], 0x6d9d6122, 16)
  b = fnH(b, c, d, a, M[14], 0xfde5380c, 23)
  a = fnH(a, b, c, d, M[1], 0xa4beea44, 4)
  d = fnH(d, a, b, c, M[4], 0x4bdecfa9, 11)
  c = fnH(c, d, a, b, M[7], 0xf6bb4b60, 16)
  b = fnH(b, c, d, a, M[10], 0xbebfbc70, 23)
  a = fnH(a, b, c, d, M[13], 0x289b7ec6, 4)
  d = fnH(d, a, b, c, M[0], 0xeaa127fa, 11)
  c = fnH(c, d, a, b, M[3], 0xd4ef3085, 16)
  b = fnH(b, c, d, a, M[6], 0x04881d05, 23)
  a = fnH(a, b, c, d, M[9], 0xd9d4d039, 4)
  d = fnH(d, a, b, c, M[12], 0xe6db99e5, 11)
  c = fnH(c, d, a, b, M[15], 0x1fa27cf8, 16)
  b = fnH(b, c, d, a, M[2], 0xc4ac5665, 23)

  a = fnI(a, b, c, d, M[0], 0xf4292244, 6)
  d = fnI(d, a, b, c, M[7], 0x432aff97, 10)
  c = fnI(c, d, a, b, M[14], 0xab9423a7, 15)
  b = fnI(b, c, d, a, M[5], 0xfc93a039, 21)
  a = fnI(a, b, c, d, M[12], 0x655b59c3, 6)
  d = fnI(d, a, b, c, M[3], 0x8f0ccc92, 10)
  c = fnI(c, d, a, b, M[10], 0xffeff47d, 15)
  b = fnI(b, c, d, a, M[1], 0x85845dd1, 21)
  a = fnI(a, b, c, d, M[8], 0x6fa87e4f, 6)
  d = fnI(d, a, b, c, M[15], 0xfe2ce6e0, 10)
  c = fnI(c, d, a, b, M[6], 0xa3014314, 15)
  b = fnI(b, c, d, a, M[13], 0x4e0811a1, 21)
  a = fnI(a, b, c, d, M[4], 0xf7537e82, 6)
  d = fnI(d, a, b, c, M[11], 0xbd3af235, 10)
  c = fnI(c, d, a, b, M[2], 0x2ad7d2bb, 15)
  b = fnI(b, c, d, a, M[9], 0xeb86d391, 21)

  this._a = (this._a + a) | 0
  this._b = (this._b + b) | 0
  this._c = (this._c + c) | 0
  this._d = (this._d + d) | 0
}

MD5.prototype._digest = function () {
  // create padding and handle blocks
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  // produce result
  var buffer = Buffer.allocUnsafe(16)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  return buffer
}

function rotl (x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fnF (a, b, c, d, m, k, s) {
  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + b) | 0
}

function fnG (a, b, c, d, m, k, s) {
  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + b) | 0
}

function fnH (a, b, c, d, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + b) | 0
}

function fnI (a, b, c, d, m, k, s) {
  return (rotl((a + ((c ^ (b | (~d)))) + m + k) | 0, s) + b) | 0
}

module.exports = MD5

},{"hash-base":25,"inherits":46,"safe-buffer":76}],50:[function(require,module,exports){
module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};

},{}],51:[function(require,module,exports){
'use strict';

var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};

},{}],52:[function(require,module,exports){
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate (y) {
        var date;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            var args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays (ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays :
            this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
        return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
            : (m) ? weekdays[m.day()] : weekdays;
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    var MS_PER_SECOND = 1000;
    var MS_PER_MINUTE = 60 * MS_PER_SECOND;
    var MS_PER_HOUR = 60 * MS_PER_MINUTE;
    var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':   return months;
                case 'quarter': return months / 3;
                case 'year':    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asQuarters     = makeAs('Q');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asQuarters     = asQuarters;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.24.0';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

},{}],53:[function(require,module,exports){
exports.pbkdf2 = require('./lib/async')
exports.pbkdf2Sync = require('./lib/sync')

},{"./lib/async":54,"./lib/sync":57}],54:[function(require,module,exports){
(function (process,global){(function (){
var Buffer = require('safe-buffer').Buffer

var checkParameters = require('./precondition')
var defaultEncoding = require('./default-encoding')
var sync = require('./sync')
var toBuffer = require('./to-buffer')

var ZERO_BUF
var subtle = global.crypto && global.crypto.subtle
var toBrowser = {
  sha: 'SHA-1',
  'sha-1': 'SHA-1',
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  'sha-256': 'SHA-256',
  sha384: 'SHA-384',
  'sha-384': 'SHA-384',
  'sha-512': 'SHA-512',
  sha512: 'SHA-512'
}
var checks = []
function checkNative (algo) {
  if (global.process && !global.process.browser) {
    return Promise.resolve(false)
  }
  if (!subtle || !subtle.importKey || !subtle.deriveBits) {
    return Promise.resolve(false)
  }
  if (checks[algo] !== undefined) {
    return checks[algo]
  }
  ZERO_BUF = ZERO_BUF || Buffer.alloc(8)
  var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo)
    .then(function () {
      return true
    }).catch(function () {
      return false
    })
  checks[algo] = prom
  return prom
}

function browserPbkdf2 (password, salt, iterations, length, algo) {
  return subtle.importKey(
    'raw', password, { name: 'PBKDF2' }, false, ['deriveBits']
  ).then(function (key) {
    return subtle.deriveBits({
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: {
        name: algo
      }
    }, key, length << 3)
  }).then(function (res) {
    return Buffer.from(res)
  })
}

function resolvePromise (promise, callback) {
  promise.then(function (out) {
    process.nextTick(function () {
      callback(null, out)
    })
  }, function (e) {
    process.nextTick(function () {
      callback(e)
    })
  })
}
module.exports = function (password, salt, iterations, keylen, digest, callback) {
  if (typeof digest === 'function') {
    callback = digest
    digest = undefined
  }

  digest = digest || 'sha1'
  var algo = toBrowser[digest.toLowerCase()]

  if (!algo || typeof global.Promise !== 'function') {
    return process.nextTick(function () {
      var out
      try {
        out = sync(password, salt, iterations, keylen, digest)
      } catch (e) {
        return callback(e)
      }
      callback(null, out)
    })
  }

  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')
  if (typeof callback !== 'function') throw new Error('No callback provided to pbkdf2')

  resolvePromise(checkNative(algo).then(function (resp) {
    if (resp) return browserPbkdf2(password, salt, iterations, keylen, algo)

    return sync(password, salt, iterations, keylen, digest)
  }), callback)
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./default-encoding":55,"./precondition":56,"./sync":57,"./to-buffer":58,"_process":94,"safe-buffer":76}],55:[function(require,module,exports){
(function (process){(function (){
var defaultEncoding
/* istanbul ignore next */
if (process.browser) {
  defaultEncoding = 'utf-8'
} else if (process.version) {
  var pVersionMajor = parseInt(process.version.split('.')[0].slice(1), 10)

  defaultEncoding = pVersionMajor >= 6 ? 'utf-8' : 'binary'
} else {
  defaultEncoding = 'utf-8'
}
module.exports = defaultEncoding

}).call(this)}).call(this,require('_process'))
},{"_process":94}],56:[function(require,module,exports){
var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs

module.exports = function (iterations, keylen) {
  if (typeof iterations !== 'number') {
    throw new TypeError('Iterations not a number')
  }

  if (iterations < 0) {
    throw new TypeError('Bad iterations')
  }

  if (typeof keylen !== 'number') {
    throw new TypeError('Key length not a number')
  }

  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) { /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length')
  }
}

},{}],57:[function(require,module,exports){
var md5 = require('create-hash/md5')
var RIPEMD160 = require('ripemd160')
var sha = require('sha.js')
var Buffer = require('safe-buffer').Buffer

var checkParameters = require('./precondition')
var defaultEncoding = require('./default-encoding')
var toBuffer = require('./to-buffer')

var ZEROS = Buffer.alloc(128)
var sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
}

function Hmac (alg, key, saltLen) {
  var hash = getDigest(alg)
  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  if (key.length > blocksize) {
    key = hash(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = Buffer.allocUnsafe(blocksize + sizes[alg])
  var opad = Buffer.allocUnsafe(blocksize + sizes[alg])
  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var ipad1 = Buffer.allocUnsafe(blocksize + saltLen + 4)
  ipad.copy(ipad1, 0, 0, blocksize)
  this.ipad1 = ipad1
  this.ipad2 = ipad
  this.opad = opad
  this.alg = alg
  this.blocksize = blocksize
  this.hash = hash
  this.size = sizes[alg]
}

Hmac.prototype.run = function (data, ipad) {
  data.copy(ipad, this.blocksize)
  var h = this.hash(ipad)
  h.copy(this.opad, this.blocksize)
  return this.hash(this.opad)
}

function getDigest (alg) {
  function shaFunc (data) {
    return sha(alg).update(data).digest()
  }
  function rmd160Func (data) {
    return new RIPEMD160().update(data).digest()
  }

  if (alg === 'rmd160' || alg === 'ripemd160') return rmd160Func
  if (alg === 'md5') return md5
  return shaFunc
}

function pbkdf2 (password, salt, iterations, keylen, digest) {
  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')

  digest = digest || 'sha1'

  var hmac = new Hmac(digest, password, salt.length)

  var DK = Buffer.allocUnsafe(keylen)
  var block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  var destPos = 0
  var hLen = sizes[digest]
  var l = Math.ceil(keylen / hLen)

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

    var T = hmac.run(block1, hmac.ipad1)
    var U = T

    for (var j = 1; j < iterations; j++) {
      U = hmac.run(U, hmac.ipad2)
      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    T.copy(DK, destPos)
    destPos += hLen
  }

  return DK
}

module.exports = pbkdf2

},{"./default-encoding":55,"./precondition":56,"./to-buffer":58,"create-hash/md5":24,"ripemd160":75,"safe-buffer":76,"sha.js":78}],58:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer

module.exports = function (thing, encoding, name) {
  if (Buffer.isBuffer(thing)) {
    return thing
  } else if (typeof thing === 'string') {
    return Buffer.from(thing, encoding)
  } else if (ArrayBuffer.isView(thing)) {
    return Buffer.from(thing.buffer)
  } else {
    throw new TypeError(name + ' must be a string, a Buffer, a typed array or a DataView')
  }
}

},{"safe-buffer":76}],59:[function(require,module,exports){
(function (process,global){(function (){
'use strict'

// limit of Crypto.getRandomValues()
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
var MAX_BYTES = 65536

// Node supports requesting up to this number of bytes
// https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
var MAX_UINT32 = 4294967295

function oldBrowser () {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
}

var Buffer = require('safe-buffer').Buffer
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

  var bytes = Buffer.allocUnsafe(size)

  if (size > 0) {  // getRandomValues fails on IE if size == 0
    if (size > MAX_BYTES) { // this is the max bytes crypto.getRandomValues
      // can do at once see https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
      for (var generated = 0; generated < size; generated += MAX_BYTES) {
        // buffer.slice automatically checks if the end is past the end of
        // the buffer so we don't have to here
        crypto.getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
      }
    } else {
      crypto.getRandomValues(bytes)
    }
  }

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":94,"safe-buffer":76}],60:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

},{}],61:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';
/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;

var Readable = require('./_stream_readable');

var Writable = require('./_stream_writable');

require('inherits')(Duplex, Readable);

{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});
}).call(this)}).call(this,require('_process'))
},{"./_stream_readable":63,"./_stream_writable":65,"_process":94,"inherits":46}],62:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

require('inherits')(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":64,"inherits":46}],63:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

module.exports = Readable;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = require('events').EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/


var debugUtil = require('util');

var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = require('./internal/streams/buffer_list');

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder;
var createReadableStreamAsyncIterator;
var from;

require('inherits')(Readable, Stream);

var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
    ;
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require('./internal/streams/from');
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../errors":60,"./_stream_duplex":61,"./internal/streams/async_iterator":66,"./internal/streams/buffer_list":67,"./internal/streams/destroy":68,"./internal/streams/from":70,"./internal/streams/state":72,"./internal/streams/stream":73,"_process":94,"buffer":91,"events":92,"inherits":46,"string_decoder/":85,"util":90}],64:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';

module.exports = Transform;

var _require$codes = require('../errors').codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

var Duplex = require('./_stream_duplex');

require('inherits')(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}
},{"../errors":60,"./_stream_duplex":61,"inherits":46}],65:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';

module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/

var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

var errorOrDestroy = destroyImpl.errorOrDestroy;

require('inherits')(Writable, Stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../errors":60,"./_stream_duplex":61,"./internal/streams/destroy":68,"./internal/streams/state":72,"./internal/streams/stream":73,"_process":94,"buffer":91,"inherits":46,"util-deprecate":86}],66:[function(require,module,exports){
(function (process){(function (){
'use strict';

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var finished = require('./end-of-stream');

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;
}).call(this)}).call(this,require('_process'))
},{"./end-of-stream":69,"_process":94}],67:[function(require,module,exports){
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('buffer'),
    Buffer = _require.Buffer;

var _require2 = require('util'),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();
},{"buffer":91,"util":90}],68:[function(require,module,exports){
(function (process){(function (){
'use strict'; // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this)}).call(this,require('_process'))
},{"_process":94}],69:[function(require,module,exports){
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop() {}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

module.exports = eos;
},{"../../../errors":60}],70:[function(require,module,exports){
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

},{}],71:[function(require,module,exports){
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = require('../../../errors').codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require('./end-of-stream');
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

module.exports = pipeline;
},{"../../../errors":60,"./end-of-stream":69}],72:[function(require,module,exports){
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};
},{"../../../errors":60}],73:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":92}],74:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
exports.finished = require('./lib/internal/streams/end-of-stream.js');
exports.pipeline = require('./lib/internal/streams/pipeline.js');

},{"./lib/_stream_duplex.js":61,"./lib/_stream_passthrough.js":62,"./lib/_stream_readable.js":63,"./lib/_stream_transform.js":64,"./lib/_stream_writable.js":65,"./lib/internal/streams/end-of-stream.js":69,"./lib/internal/streams/pipeline.js":71}],75:[function(require,module,exports){
'use strict'
var Buffer = require('buffer').Buffer
var inherits = require('inherits')
var HashBase = require('hash-base')

var ARRAY16 = new Array(16)

var zl = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
]

var zr = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
]

var sl = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
]

var sr = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
]

var hl = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]
var hr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]

function RIPEMD160 () {
  HashBase.call(this, 64)

  // state
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0
}

inherits(RIPEMD160, HashBase)

RIPEMD160.prototype._update = function () {
  var words = ARRAY16
  for (var j = 0; j < 16; ++j) words[j] = this._block.readInt32LE(j * 4)

  var al = this._a | 0
  var bl = this._b | 0
  var cl = this._c | 0
  var dl = this._d | 0
  var el = this._e | 0

  var ar = this._a | 0
  var br = this._b | 0
  var cr = this._c | 0
  var dr = this._d | 0
  var er = this._e | 0

  // computation
  for (var i = 0; i < 80; i += 1) {
    var tl
    var tr
    if (i < 16) {
      tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i])
      tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i])
    } else if (i < 32) {
      tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i])
      tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i])
    } else if (i < 48) {
      tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i])
      tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i])
    } else if (i < 64) {
      tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i])
      tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i])
    } else { // if (i<80) {
      tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i])
      tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i])
    }

    al = el
    el = dl
    dl = rotl(cl, 10)
    cl = bl
    bl = tl

    ar = er
    er = dr
    dr = rotl(cr, 10)
    cr = br
    br = tr
  }

  // update state
  var t = (this._b + cl + dr) | 0
  this._b = (this._c + dl + er) | 0
  this._c = (this._d + el + ar) | 0
  this._d = (this._e + al + br) | 0
  this._e = (this._a + bl + cr) | 0
  this._a = t
}

RIPEMD160.prototype._digest = function () {
  // create padding and handle blocks
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  // produce result
  var buffer = Buffer.alloc ? Buffer.alloc(20) : new Buffer(20)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  buffer.writeInt32LE(this._e, 16)
  return buffer
}

function rotl (x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fn1 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
}

function fn2 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0
}

function fn3 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0
}

function fn4 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0
}

function fn5 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0
}

module.exports = RIPEMD160

},{"buffer":91,"hash-base":25,"inherits":46}],76:[function(require,module,exports){
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":91}],77:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer

// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block
  var blockSize = this._blockSize
  var length = data.length
  var accum = this._len

  for (var offset = 0; offset < length;) {
    var assigned = accum % blockSize
    var remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) {
      block[assigned + i] = data[offset + i]
    }

    accum += remainder
    offset += remainder

    if ((accum % blockSize) === 0) {
      this._update(block)
    }
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  // uint32
  if (bits <= 0xffffffff) {
    this._block.writeUInt32BE(bits, this._blockSize - 4)

  // uint64
  } else {
    var lowBits = (bits & 0xffffffff) >>> 0
    var highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash

},{"safe-buffer":76}],78:[function(require,module,exports){
var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = require('./sha')
exports.sha1 = require('./sha1')
exports.sha224 = require('./sha224')
exports.sha256 = require('./sha256')
exports.sha384 = require('./sha384')
exports.sha512 = require('./sha512')

},{"./sha":79,"./sha1":80,"./sha224":81,"./sha256":82,"./sha384":83,"./sha512":84}],79:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */

var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha

},{"./hash":77,"inherits":46,"safe-buffer":76}],80:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1

},{"./hash":77,"inherits":46,"safe-buffer":76}],81:[function(require,module,exports){
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('inherits')
var Sha256 = require('./sha256')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var W = new Array(64)

function Sha224 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224

},{"./hash":77,"./sha256":82,"inherits":46,"safe-buffer":76}],82:[function(require,module,exports){
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
}

function sigma1 (x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
}

function gamma0 (x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
}

function gamma1 (x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0
  var f = this._f | 0
  var g = this._g | 0
  var h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0
    var T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256

},{"./hash":77,"inherits":46,"safe-buffer":76}],83:[function(require,module,exports){
var inherits = require('inherits')
var SHA512 = require('./sha512')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var W = new Array(160)

function Sha384 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = Buffer.allocUnsafe(48)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384

},{"./hash":77,"./sha512":84,"inherits":46,"safe-buffer":76}],84:[function(require,module,exports){
var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x, xl) {
  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
}

function sigma1 (x, xl) {
  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
}

function Gamma0 (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
}

function Gamma0l (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
}

function Gamma1 (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
}

function Gamma1l (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
}

function getCarry (a, b) {
  return (a >>> 0) < (b >>> 0) ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w

  var ah = this._ah | 0
  var bh = this._bh | 0
  var ch = this._ch | 0
  var dh = this._dh | 0
  var eh = this._eh | 0
  var fh = this._fh | 0
  var gh = this._gh | 0
  var hh = this._hh | 0

  var al = this._al | 0
  var bl = this._bl | 0
  var cl = this._cl | 0
  var dl = this._dl | 0
  var el = this._el | 0
  var fl = this._fl | 0
  var gl = this._gl | 0
  var hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 15 * 2]
    var xl = W[i - 15 * 2 + 1]
    var gamma0 = Gamma0(xh, xl)
    var gamma0l = Gamma0l(xl, xh)

    xh = W[i - 2 * 2]
    xl = W[i - 2 * 2 + 1]
    var gamma1 = Gamma1(xh, xl)
    var gamma1l = Gamma1l(xl, xh)

    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    var Wi7h = W[i - 7 * 2]
    var Wi7l = W[i - 7 * 2 + 1]

    var Wi16h = W[i - 16 * 2]
    var Wi16l = W[i - 16 * 2 + 1]

    var Wil = (gamma0l + Wi7l) | 0
    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wil = (Wil + gamma1l) | 0
    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0
    Wil = (Wil + Wi16l) | 0
    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch)
    var majl = maj(al, bl, cl)

    var sigma0h = sigma0(ah, al)
    var sigma0l = sigma0(al, ah)
    var sigma1h = sigma1(eh, el)
    var sigma1l = sigma1(el, eh)

    // t1 = h + sigma1 + ch + K[j] + W[j]
    var Kih = K[j]
    var Kil = K[j + 1]

    var chh = Ch(eh, fh, gh)
    var chl = Ch(el, fl, gl)

    var t1l = (hl + sigma1l) | 0
    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1l = (t1l + chl) | 0
    t1h = (t1h + chh + getCarry(t1l, chl)) | 0
    t1l = (t1l + Kil) | 0
    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0
    t1l = (t1l + Wil) | 0
    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0

    // t2 = sigma0 + maj
    var t2l = (sigma0l + majl) | 0
    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    el = (dl + t1l) | 0
    eh = (dh + t1h + getCarry(el, dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    al = (t1l + t2l) | 0
    ah = (t1h + t2h + getCarry(al, t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = Buffer.allocUnsafe(64)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512

},{"./hash":77,"inherits":46,"safe-buffer":76}],85:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":76}],86:[function(require,module,exports){
(function (global){(function (){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],87:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof self !== 'undefined' && self) ||
    (typeof global !== 'undefined' && global);

  var support = {
    searchParams: 'URLSearchParams' in global,
    iterable: 'Symbol' in global && 'iterator' in Symbol,
    blob:
      'FileReader' in global &&
      'Blob' in global &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in global,
    arrayBuffer: 'ArrayBuffer' in global
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
      throw new TypeError('Invalid character in header field name: "' + name + '"')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      /*
        fetch-mock wraps the Response object in an ES6 Proxy to
        provide useful test harness features such as flush. However, on
        ES5 browsers without fetch or Proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the Proxy is created. This change ensures
        Response.bodyUsed exists on the instance, while maintaining the
        semantic of setting Request.bodyUsed in the constructor before
        _initBody is called.
      */
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          var isConsumed = consumed(this);
          if (isConsumed) {
            return isConsumed
          }
          if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
            return Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            )
          } else {
            return Promise.resolve(this._bodyArrayBuffer)
          }
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    if (!(this instanceof Request)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }

    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);

    if (this.method === 'GET' || this.method === 'HEAD') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        var reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
        }
      }
    }
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
    // https://github.com/github/fetch/issues/748
    // https://github.com/zloirock/core-js/issues/751
    preProcessedHeaders
      .split('\r')
      .map(function(header) {
        return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
      })
      .forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          headers.append(key, value);
        }
      });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = global.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };

      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.onabort = function() {
        setTimeout(function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        }, 0);
      };

      function fixUrl(url) {
        try {
          return url === '' && global.location.href ? global.location.href : url
        } catch (e) {
          return url
        }
      }

      xhr.open(request.method, fixUrl(request.url), true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr) {
        if (support.blob) {
          xhr.responseType = 'blob';
        } else if (
          support.arrayBuffer &&
          request.headers.get('Content-Type') &&
          request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
        ) {
          xhr.responseType = 'arraybuffer';
        }
      }

      if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
        });
      } else {
        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });
      }

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!global.fetch) {
    global.fetch = fetch;
    global.Headers = Headers;
    global.Request = Request;
    global.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],88:[function(require,module,exports){
var paymail = require("@moneybutton/paymail-client");
window.paymail = paymail
},{"@moneybutton/paymail-client":4}],89:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],90:[function(require,module,exports){

},{}],91:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":89,"buffer":91,"ieee754":93}],92:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],93:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],94:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[88]);

export default window.paymail
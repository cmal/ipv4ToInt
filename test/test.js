var should = require('chai').should();

describe('ipv4->integer', function() {

  var ipv4 = require('../index.js')
  var ipv4ToInt = ipv4.ipv4ToInt;
  var errInt8 = ipv4.errInt8;
  var errSpace = ipv4.errSpace;
  var errChar = ipv4.errChar;
  var errOther = ipv4.errOther;

  var checkError = function(f, s, err) {
    (function() {
      f(s)
    }).should.throw(err);
  }

  describe('#ipv4ToInt()', function() {

    it ('plain ipv4 string should return', function() {
      ipv4ToInt('0.0.0.0').should.equal(0);
      ipv4ToInt('00.00000.0.0000000').should.equal(0);
      ipv4ToInt('172.168.5.1').should.equal(2896692481);
      ipv4ToInt('255.255.255.255').should.equal(4294967295);
    });

    it ('invalid ipv4 string should throw', function() {
      checkError(ipv4ToInt, '255.255.255.256', errInt8);
      checkError(ipv4ToInt, '256.0.0.0', errInt8);
      checkError(ipv4ToInt, '1.5.256.1', errInt8);
    });

    it ('space between a digit and a dot should return', function() {
      ipv4ToInt(' 0.0.0.0').should.equal(0);
      ipv4ToInt(' 0.0.0.0 ').should.equal(0);
      ipv4ToInt(' 0  . 0   . 0 .  0   ').should.equal(0);
      ipv4ToInt('172 . 168.5.1').should.equal(2896692481);
      ipv4ToInt('172 . 168.  5 .  1 ').should.equal(2896692481);
      ipv4ToInt('255.255.255.255 ').should.equal(4294967295);
    });

    it ('space between two digits should throw', function() {
      checkError(ipv4ToInt, '1 72.168.5.1', errSpace);
      checkError(ipv4ToInt, '172.168.5 11', errSpace);
      checkError(ipv4ToInt, '172.168.5 1.1', errSpace);
    });

    it ('invalid character should throw', function() {
      checkError(ipv4ToInt, '0.0.o.0', errChar);
      checkError(ipv4ToInt, '0.0.-1.0', errChar);
    });

    it ('mix errors should throw the first', function() {
      checkError(ipv4ToInt, '255.255.256.2 55', errInt8);
      checkError(ipv4ToInt, '1 72.168.5.256', errSpace);
      checkError(ipv4ToInt, '-1 72.168.5.256', errChar);
    });

    it ('mix errors should throw the first', function() {
      checkError(ipv4ToInt, '255.255.256.2 55', errInt8);
      checkError(ipv4ToInt, '1 72.168.5.256', errSpace);
      checkError(ipv4ToInt, '0.0.o.0', errChar);
    });

    it ('other invalid string should throw', function() {
      checkError(ipv4ToInt, '', errOther);
      checkError(ipv4ToInt, '...', errOther);
      checkError(ipv4ToInt, '.0.0.0', errOther);
      checkError(ipv4ToInt, '.0.0.0.0', errOther);
      checkError(ipv4ToInt, '0.0.0.0.', errOther);
      checkError(ipv4ToInt, '0.0.0.', errOther);
      checkError(ipv4ToInt, '0.0. .0', errOther);
    });

  });
});

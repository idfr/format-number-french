'use strict';

var rewire = require('rewire'),
    assert = require('assert'),
    formatNumber = rewire('../');

describe('Format-number-french Tests', function () {
    // Private methods to test
    var checkValue = formatNumber.__get__('__isNumber');
    var addSpacesSeparator = formatNumber.__get__('__addSpacesSeparator');

    it('Value is valid if it contains only numbers and a coma (or not)', function () {
        assert.ok(checkValue('123456789'), 'The value is not a number.');
        assert.notEqual(checkValue('1234aaaa56789'), 'The value is not a number.');
        assert.ok(checkValue('1234567,89'), 'The value is not a number.');
    });

    it('Integer part of the value is well formatted', function () {
        assert.equal(addSpacesSeparator(5365), '5 365', 'fails for thousands');
        assert.equal(addSpacesSeparator(14567890), '14 567 890', 'fails for millions');
        assert.equal(addSpacesSeparator(766333444555), '766 333 444 555', 'fails for billions');
    });

    it('Decimal number is well formatted', function () {
        assert.equal(formatNumber('1234567'), '1 234 567', 'fail to format a integer number');
        assert.equal(formatNumber('1234567,5678'), '1 234 567,5678', 'fails to format a decimal number');
    });

    it('It add a suffix €', function () {
        assert.equal(formatNumber('1234567,5678', {suffix: '€'}), '1 234 567,5678 €', 'fails to add a suffix');
    });

    describe('if reduce option exits...', function () {
        it('it formats value with kilo suffix if 100 000 < number < 999 999', function () {
            assert.equal(formatNumber('234567,5678', {suffix: '€', reduce: true}), '234 k€');
            assert.notEqual(formatNumber('99999,5678', {suffix: '€', reduce: true}), '99 k€');
        });
        it('it formats value with Mega suffix if 1 000 000 < number < 999 999 999', function () {
            assert.equal(formatNumber('444234567,5678', {suffix: '€', reduce: true}), '444 M€');
        });
        it('it formats value with Mrd suffix if 999 999 999 < number', function () {
            assert.equal(formatNumber('33444234567,5678', {suffix: '€', reduce: true}), '33 Mrd€');
        });
    });
});
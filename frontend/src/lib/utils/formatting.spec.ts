import { describe, it, expect } from 'vitest';
import { formatListenCount, formatReleaseDate } from './formatting';

describe('formatListenCount', () => {
	it('returns empty string for null', () => {
		expect.assertions(1);
		expect(formatListenCount(null)).toBe('');
	});

	it('formats zero as "0 plays"', () => {
		expect.assertions(1);
		expect(formatListenCount(0)).toBe('0 plays');
	});

	it('formats zero compact as "0"', () => {
		expect.assertions(1);
		expect(formatListenCount(0, true)).toBe('0');
	});

	it('formats small number with suffix', () => {
		expect.assertions(1);
		expect(formatListenCount(42)).toBe('42 plays');
	});

	it('formats thousands', () => {
		expect.assertions(1);
		expect(formatListenCount(1500)).toBe('1.5K plays');
	});

	it('formats thousands compact', () => {
		expect.assertions(1);
		expect(formatListenCount(1500, true)).toBe('1.5K');
	});

	it('formats millions', () => {
		expect.assertions(1);
		expect(formatListenCount(2500000)).toBe('2.5M plays');
	});

	it('formats millions compact', () => {
		expect.assertions(1);
		expect(formatListenCount(2500000, true)).toBe('2.5M');
	});

	it('formats billions', () => {
		expect.assertions(1);
		expect(formatListenCount(3596400000)).toBe('3.6B plays');
	});

	it('formats billions compact', () => {
		expect.assertions(1);
		expect(formatListenCount(3596400000, true)).toBe('3.6B');
	});
});

describe('formatReleaseDate', () => {
	it('formats ISO release timestamps without timezone drift', () => {
		expect.assertions(1);
		expect(formatReleaseDate('1982-11-30T00:00:00Z')).toBe('November 30, 1982');
	});

	it('formats partial MusicBrainz dates', () => {
		expect.assertions(2);
		expect(formatReleaseDate('1982-11')).toBe('November 1982');
		expect(formatReleaseDate('1982')).toBe('1982');
	});

	it('falls back to the original value when a date is not parseable', () => {
		expect.assertions(1);
		expect(formatReleaseDate('unknown')).toBe('unknown');
	});
});

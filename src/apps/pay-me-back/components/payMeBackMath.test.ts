import { describe, it, expect } from 'vitest';
import { calculate } from './payMeBackMath';

describe('payMeBackMath calculate function', () => {
    it('calculates standard receipt with percentage tax and tip', () => {
        const result = calculate({
            items: [
                { name: 'Burger', price: 50, participants: ['Alice'] },
                { name: 'Pizza', price: 50, participants: ['Bob'] },
            ],
            participants: ['Alice', 'Bob'],
            tax: { amount: 0.10, unit: 'percent' },
            tip: { amount: 0.20, unit: 'percent' },
            taxWithSubtotal: false,
            tipWithSubtotal: false,
        });

        expect(result.subtotal).toBe(100);
        // Tax = 10, Tip = 20, Total = 130
        expect(result.total).toBe(130);
        expect(result.perParticipant['Alice']).toBe(65);
        expect(result.perParticipant['Bob']).toBe(65);
    });

    it('calculates standard receipt with dollar tax and tip', () => {
        const result = calculate({
            items: [
                { name: 'Burger', price: 50, participants: ['Alice'] },
                { name: 'Pizza', price: 50, participants: ['Bob'] },
            ],
            participants: ['Alice', 'Bob'],
            tax: { amount: 10, unit: 'dollar' },
            tip: { amount: 20, unit: 'dollar' },
            taxWithSubtotal: false,
            tipWithSubtotal: false,
        });

        expect(result.subtotal).toBe(100);
        // Tax = 10, Tip = 20, Total = 130
        expect(result.total).toBe(130);
        expect(result.perParticipant['Alice']).toBe(65);
        expect(result.perParticipant['Bob']).toBe(65);
    });

    it('calculates tax on tip correctly (auto-gratuity scenario)', () => {
        const result = calculate({
            items: [
                { name: 'Burger', price: 50, participants: ['Alice'] },
                { name: 'Pizza', price: 50, participants: ['Bob'] },
            ],
            participants: ['Alice', 'Bob'],
            tax: { amount: 0.10, unit: 'percent' },
            tip: { amount: 0.20, unit: 'percent' },
            taxWithSubtotal: false,
            tipWithSubtotal: true, // tax calculated on (subtotal + tip)
        });

        expect(result.subtotal).toBe(100);
        // Tip = 20% of 100 = 20
        // Tax = 10% of (100 + 20) = 12
        // Total = 132
        expect(result.total).toBe(132);
        expect(result.perParticipant['Alice']).toBe(66);
        expect(result.perParticipant['Bob']).toBe(66);
    });

    it('calculates tip on tax correctly (POS scenario)', () => {
        const result = calculate({
            items: [
                { name: 'Burger', price: 50, participants: ['Alice'] },
                { name: 'Pizza', price: 50, participants: ['Bob'] },
            ],
            participants: ['Alice', 'Bob'],
            tax: { amount: 0.10, unit: 'percent' },
            tip: { amount: 0.20, unit: 'percent' },
            taxWithSubtotal: true, // tip calculated on (subtotal + tax)
            tipWithSubtotal: false, 
        });

        expect(result.subtotal).toBe(100);
        // Tax = 10% of 100 = 10
        // Tip = 20% of (100 + 10) = 22
        // Total = 132
        expect(result.total).toBe(132);
        expect(result.perParticipant['Alice']).toBe(66);
        expect(result.perParticipant['Bob']).toBe(66);
    });

    it('handles shared items properly', () => {
        const result = calculate({
            items: [
                { name: 'Fries', price: 30, participants: ['Alice', 'Bob', 'Charlie'] },
            ],
            participants: ['Alice', 'Bob', 'Charlie'],
            tax: { amount: 3, unit: 'dollar' },
            tip: { amount: 6, unit: 'dollar' },
            taxWithSubtotal: false,
            tipWithSubtotal: false,
        });

        expect(result.subtotal).toBe(30);
        expect(result.total).toBe(39);
        expect(result.perParticipant['Alice']).toBe(13);
        expect(result.perParticipant['Bob']).toBe(13);
        expect(result.perParticipant['Charlie']).toBe(13);
    });
});

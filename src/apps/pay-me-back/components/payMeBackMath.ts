import { Unit } from "./UnitSwitch";

export type ReceiptItem = {
    name: string;
    price: number;
    participants: string[];
}

export type CalculatedOutput = {
    subtotal: number;
    total: number;
    perParticipant: {
        [key: string]: number;
    }
}

function getPercentage(amount: number, unit: Unit, base: number) {
    switch (unit) {
        case "dollar":
            return amount / base;
        case "percent":
            return amount;
    }
}

export function calculate({
    items,
    participants,
    tip,
    tax,

    taxWithSubtotal,
    tipWithSubtotal,
}: {
    items: ReceiptItem[];
    participants: string[];
    tip: { amount: number, unit: "dollar" | "percent" };
    tax: { amount: number, unit: "dollar" | "percent" };
    taxWithSubtotal: boolean;
    tipWithSubtotal: boolean;
}) {
    let subtotal = items.reduce((acc, item) => acc + item.price, 0);


    let effectiveTaxPercentage: number;
    let effectiveTipPercentage: number;

    if (taxWithSubtotal) {
        effectiveTaxPercentage = getPercentage(tax.amount, tax.unit, subtotal);
        effectiveTipPercentage = getPercentage(tip.amount, tip.unit, subtotal * (1 + effectiveTaxPercentage));
    } else if (tipWithSubtotal) {
        effectiveTipPercentage = getPercentage(tip.amount, tip.unit, subtotal);
        effectiveTaxPercentage = getPercentage(tax.amount, tax.unit, subtotal * (1 + effectiveTipPercentage));
    } else {
        effectiveTaxPercentage = getPercentage(tax.amount, tax.unit, subtotal);
        effectiveTipPercentage = getPercentage(tip.amount, tip.unit, subtotal);
    }

    const perParticipant: Record<string, number> = {}
    // construct empty dict
    for (const participant of participants) perParticipant[participant] = 0;

    // iterate through items
    for (const item of items) {
        const numParticipants = item.participants.length;
        if (numParticipants == 0) continue;

        for (const participant of item.participants) {
            if (!taxWithSubtotal && !tipWithSubtotal) {
                const taxAmount = item.price * effectiveTaxPercentage;
                const tipAmount = item.price * effectiveTipPercentage;

                perParticipant[participant] += (item.price + taxAmount + tipAmount) / numParticipants;
            }
            else if (taxWithSubtotal || tipWithSubtotal) {
                perParticipant[participant] += (item.price / numParticipants) * (1 + effectiveTaxPercentage) * (1 + effectiveTipPercentage);
            }
        }
    }

    const total = Object.values(perParticipant).reduce((acc, amount) => acc + amount, 0);

    return {
        subtotal,
        total,
        perParticipant,
    }
}
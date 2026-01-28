import { Fragment, useCallback, useMemo, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import './PayMeBack.css';
import smileSvg from "./smile.svg";

type Item = {
  "name": string;
  "price": string;
  "participants": string[];
}

function PayMeBack() {
  const [newParticipantName, setNewParticipantName] = useState("");

  const [participants, setParticipants] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const handleAddParticipant = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newParticipantName.length === 0) return;

    setParticipants([...participants, newParticipantName]);
    setNewParticipantName("");
  }, [participants, newParticipantName]);

  const [tipAmount, setTipAmount] = useState<string | undefined>();
  const [taxPercent, setTaxPercent] = useState<string | undefined>();


  const multiplier = useMemo(() => {
    let subtotal = 0;
    for (const item of items)
      subtotal += Number(item.price);

    if (subtotal == 0) return 1;

    let multiplier = 1;

    multiplier += Number(taxPercent ?? "0") / 100;
    multiplier += Number(tipAmount ?? "0") / subtotal;

    return multiplier;
  }, [items, tipAmount, taxPercent]);

  const perParticipant = useMemo(() => {
    const out: {
      [key: string]: number
    } = {};

    for (const p of participants) out[p] = 0;

    for (const item of items)
      for (const p of item.participants) {
        out[p] += Number(item.price) * multiplier / item.participants.length;
      }

    return out;
  }, [participants, items, multiplier]);

  return (
    <div className={"root"}>
      <div className="flex gap-4">
        <h1 className="text-4xl font-black">Pay Me Back</h1>
        <img src={smileSvg} className="w-10" />
      </div>
      <p className="mt-2">Splitting A Check Has Never Been This Easy</p>

      <h2 className="mt-6 font-bold">Participants</h2>

      <form className="mt-6 flex gap-4" onSubmit={handleAddParticipant}>
        <input placeholder='Add Participant' value={newParticipantName} onChange={e => setNewParticipantName(e.currentTarget.value)} className="input flex-1" />
        <button type="submit" className="button primary" disabled={newParticipantName.length === 0}>Add</button>
      </form>

      <div className="flex flex-row gap-2 flex-wrap mt-6">
        {participants.map((participant) => <div className={"name-display"}>{participant}</div>)}
      </div>


      <h2 className="mt-8 font-bold">Items</h2>

      <div>
        {items.map((item, i) => (
          <Fragment key={i}>
            <div key={i} className={`flex gap-2 mt-6`}>
              <input className="input flex-1" placeholder={"Item Name"} value={item.name} onChange={e => {
                const copy = [...items];
                copy[i].name = e.currentTarget.value;
                setItems(copy);
              }} />

              <CurrencyInput placeholder="$0.00" fixedDecimalLength={2} className="input w-24 text-right" prefix="$" value={item.price} onValueChange={(value) => {
                const copy = [...items];
                copy[i].price = value ?? "";
                setItems(copy);
              }} />
            </div>

            <p className="mt-1.5 text-subtle text-[0.5875rem]">who bought this?</p>

            <div className="mt-1.5 flex gap-2 flex-wrap">
              {participants.map(participant => (
                <button className="button secondary" onClick={() => {
                  const copy = [...items];
                  if (!copy[i].participants.includes(participant))
                    copy[i].participants.push(participant);
                  else
                    copy[i].participants = copy[i].participants.filter(p => p !== participant);

                  setItems(copy);
                }} data-selected={item.participants.includes(participant)}>
                  {participant}
                </button>
              ))}
            </div>
          </Fragment>
        ))}
      </div>

      <button className="button primary mt-6 w-full" disabled={participants.length === 0} onClick={() => setItems([...items, { name: "", price: "", participants: [] }])}>Add Item</button>

      <div className="flex gap-8 mt-6 justify-between">
        <div className="w-32">
          <p className="font-bold">Tip </p>
          <CurrencyInput placeholder="$0.00" fixedDecimalLength={2} className="mt-1 input w-full text-right" prefix="$" value={tipAmount} onValueChange={(value) => {
            setTipAmount(value);
          }} />
        </div>
        <div className="w-32">
          <p className="font-bold">Tax Percentage</p>
          <CurrencyInput placeholder="0.00%" decimalsLimit={3} className="mt-1 input w-full text-right" suffix="%" value={taxPercent} onValueChange={(value) => {
            setTaxPercent(value);
          }} />
        </div>
      </div>

      {
        Object.entries(perParticipant).length > 0 && (
          <>
            <p className="mt-8 font-bold">Total</p>
            <div className="mt-4">
              {Object.entries(perParticipant).map(([name, amount]) => (
                <div className="flex">
                  <p className="font-bold flex-1 total-name">{name}</p>
                  <p className="total-price">${amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </>
        )
      }
    </div>
  )
}

export default PayMeBack;

import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';
import './PayMeBack.css';
import smileSvg from "../assets/smile.svg";
import UnitSwitch, { Unit } from './UnitSwitch';
import { calculate } from './payMeBackMath';
import PayMeBackHead from './PayMeBackHead';
import PayMeBackScreenshot from './PayMeBackScreenshot';
import html2canvas from 'html2canvas';

type Item = {
  "name": string;
  "price": string;
  "participants": string[];
}

function getCurrencyInputProps(unit: Unit): CurrencyInputProps {
  if (unit === "dollar") return {
    placeholder: "$0.00",
    prefix: "$",
    fixedDecimalLength: 2,
  };
  else return {
    placeholder: "0.00%",
    suffix: "%",
    decimalsLimit: 3,
  };
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
  const [tipUnit, setTipUnit] = useState<Unit>("dollar");

  const [taxAmount, setTaxAmount] = useState<string | undefined>();
  const [taxUnit, setTaxUnit] = useState<Unit>("dollar");

  const [taxOnTip, setTaxOnTip] = useState(false);
  const [tipOnTax, setTipOnTax] = useState(false);

  const calculatedOutput = useMemo(() => {
    if (items.length === 0 || participants.length === 0)
      return null;

    const calculationArgs = {
      items: items.map((item) => {
        const itemPrice = parseFloat(item.price);
        return {
          name: item.name,
          price: isNaN(itemPrice) ? 0 : itemPrice,
          participants: item.participants,
        }
      }),
      participants: participants,
      tax: { amount: parseFloat(taxAmount ?? "0") / (taxUnit === "dollar" ? 1 : 100), unit: taxUnit },
      tip: { amount: parseFloat(tipAmount ?? "0") / (tipUnit === "dollar" ? 1 : 100), unit: tipUnit },

      taxWithSubtotal: tipOnTax,
      tipWithSubtotal: taxOnTip,
    }

    const calculation = calculate(calculationArgs);

    console.log("==============");
    console.log("calculation args", calculationArgs);
    console.log("raw calculation", calculation);

    return calculation;
  }, [items, participants, taxAmount, taxUnit, taxOnTip, tipAmount, tipUnit, tipOnTax]);

  const screenshotRef = useRef<HTMLDivElement>(null);
  const handleScreenshot = () => {
    if (!screenshotRef.current) return;
    html2canvas(screenshotRef.current, {
      scale: 2,
      backgroundColor: "white",
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      // Convert canvas to data URL and download as PNG
      const link = document.createElement('a');
      link.download = `pay-me-back-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }).catch((error) => {
      console.error("Error generating screenshot:", error);
    });
  }

  return (
    <div className={"root"}>
      <PayMeBackHead />
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

          <CurrencyInput {...getCurrencyInputProps(tipUnit)} className="mt-1 input w-full text-right" value={tipAmount} onValueChange={(value) => {
            setTipAmount(value);
          }} />

          <UnitSwitch className='mt-1' unit={tipUnit} onChange={setTipUnit} />
        </div>
        <div className="w-32">
          <p className="font-bold">Tax</p>

          <CurrencyInput {...getCurrencyInputProps(taxUnit)} className="mt-1 input w-full text-right" value={taxAmount} onValueChange={(value) => {
            setTaxAmount(value);
          }} />

          <UnitSwitch className='mt-1' unit={taxUnit} onChange={setTaxUnit} />
        </div>
      </div>

      <div className="mt-4">
        <p className="font-bold">Additional Options</p>
        <div className="flex gap-2 mt-1 items-center">
          <input type="checkbox" id={"tip-on-tax"} onChange={e => {
            setTipOnTax(e.currentTarget.checked);
            setTaxOnTip(false);
          }} checked={tipOnTax} />
          <label htmlFor={"tip-on-tax"}>
            Tip calculated on tax
          </label>
        </div>

        <div className="flex gap-2 mt-1 items-center">
          <input type="checkbox" id={"tax-on-tip"} onChange={e => {
            setTaxOnTip(e.currentTarget.checked);
            setTipOnTax(false);
          }} checked={taxOnTip} />
          <label htmlFor={"tax-on-tip"}>
            Tax calculated on tip
          </label>
        </div>
      </div>

      {
        calculatedOutput && (
          <>
            <div className="mt-8 flex">
              <p className="font-bold flex-1">Subtotal</p>
              <p className="total-price">${calculatedOutput.subtotal.toFixed(2)}</p>
            </div>


            <div className="mt-4">
              {Object.entries(calculatedOutput.perParticipant).map(([name, amount]) => (
                <div className="flex">
                  <p className="font-bold flex-1 total-name">{name}</p>
                  <p className="total-price">${amount.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex">
              <p className="font-bold flex-1">Total <span className="font-light text-xs italic">use to double check</span></p>
              <p className="total-price">${calculatedOutput.total.toFixed(2)}</p>
            </div>

            <button className="mt-4 button secondary" onClick={handleScreenshot}>Share Screenshot</button>
          </>
        )
      }
      {calculatedOutput && <PayMeBackScreenshot calculatedOutput={calculatedOutput} ref={screenshotRef} />}
    </div>
  )
}

export default PayMeBack;

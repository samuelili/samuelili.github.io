import { Fragment, useCallback, useMemo, useState } from 'react';
import './PayMeBack.css';

type Item = {
  "name": string;
  "price": number;
  "participants": string[];
}

function PayMeBack() {
  const [newParticipantName, setNewParticipantName] = useState("");

  const [participants, setParticipants] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const handleAddParticipant = useCallback(() => {
    if (newParticipantName.length === 0) return;

    setParticipants([...participants, newParticipantName]);
    setNewParticipantName("");
  }, [participants, newParticipantName]);

  const perParticipant = useMemo(() => {
    const out: {
      [key: string]: number
    } = {};

    for (const p of participants) out[p] = 0;

    for (const item of items)
      for (const p of item.participants)
        out[p] += item.price / item.participants.length;

    return out;
  }, [participants, items]);

  return (
    <div className={"root"}>
      <h1 className="text-4xl font-bold">Pay Me Back</h1>
      <p className="mt-2">Splitting a check has never been this easy</p>

      <h2 className="mt-4">Participants</h2>

      <div className="flex gap-2">
        <input placeholder='Add Participant' value={newParticipantName} onChange={e => setNewParticipantName(e.currentTarget.value)} className="flex-1" />
        <button onClick={handleAddParticipant} data-primary disabled={newParticipantName.length === 0}>Add</button>
      </div>

      <div className="flex flex-row gap-2 flex-wrap mt-2">
        {participants.map((participant) => <div className={"name-display"}>{participant}</div>)}
      </div>


      <h2>Items</h2>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <Fragment key={i}>
            <div key={i} className="flex gap-2">
              <button className="icon-button">
                <img src="./trash.svg" />
              </button>
              <input className="flex-1" value={item.name} onChange={e => {
                const copy = [...items];
                copy[i].name = e.currentTarget.value;
                setItems(copy);
              }} />

              <input className="w-16" type={"number"} value={item.price} onChange={e => {
                const copy = [...items];
                copy[i].price = Number(e.currentTarget.value);
                setItems(copy);
              }} />
            </div>
            <div className="flex gap-2">
              {participants.map(participant => (
                <button data-secondary onClick={() => {
                  const copy = [...items];
                  if (!copy[i].participants.includes(participant))
                    copy[i].participants.push(participant);
                  else
                    copy[i].participants = copy[i].participants.filter(p => p !== participant);

                  setItems(copy);
                }} className={item.participants.includes(participant) ? "bg-[#ccc] text-[#333]" : ""}>
                  {participant}
                </button>
              ))}
            </div>
          </Fragment>
        ))}
      </div>

      <button data-primary className="w-full" onClick={() => setItems([...items, { name: "", price: 0, participants: [] }])}>Add Item</button>

      <div className="mt-8">
        {Object.entries(perParticipant).map(([name, amount]) => (
          <div>
            <b>{name}</b>: ${amount}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PayMeBack;

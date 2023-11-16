import React, { useMemo, useState } from 'react';
import './PayMeBack.css';

type Item = {
  "name": string;
  "price": number;
  "participants": string[];
}

function PayMeBack() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

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
    <div style={{maxWidth: "24rem", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h1>Pay Me Back</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2>Participants</h2>
        <button onClick={() => setParticipants([...participants, ""])}>Add</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {participants.map((participant, i) => <input value={participant} key={i} style={{ width: "12rem" }} onChange={e => {
          const copy = [...participants];
          copy[i] = e.currentTarget.value;
          setParticipants(copy);
        }} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2>Items</h2>
        <button onClick={() => setItems([...items, { name: "", price: 0, participants: [] }])}>Add</button>
      </div>


      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
            <input style={{ width: "12rem" }} value={item.name} onChange={e => {
              const copy = [...items];
              copy[i].name = e.currentTarget.value;
              setItems(copy);
            }} />

            <input style={{ width: "4rem" }} type={"number"} value={item.price} onChange={e => {
              const copy = [...items];
              copy[i].price = Number(e.currentTarget.value);
              setItems(copy);
            }} />

            {participants.map(participant => (
              <button onClick={() => {
                const copy = [...items];
                if (!copy[i].participants.includes(participant))
                  copy[i].participants.push(participant);
                else
                  copy[i].participants = copy[i].participants.filter(p => p !== participant);

                setItems(copy);
              }} style={item.participants.includes(participant) ? { background: "#ccc", color: "#333" } : {}}>
                {participant}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{marginTop: 32}}>
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

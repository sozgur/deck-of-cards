import Card from "./Card";
import "./DeckOfCards.css";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

const DeckOfCards = () => {
    const deckId = useRef();
    const timerId = useRef();
    const [autoDraw, setAutoDraw] = useState(false);
    const [cards, setCards] = useState([]);

    // Load new deck from Api
    useEffect(() => {
        async function NewDeck() {
            try {
                const res = await axios.get(
                    "http://deckofcardsapi.com/api/deck/new/"
                );
                deckId.current = res.data.deck_id;
            } catch (err) {
                alert(err);
            }
        }
        NewDeck();
    }, [deckId]);

    // Draw card every second if autoDraw is true and timerId is null
    useEffect(() => {
        if (autoDraw && !timerId.current) {
            timerId.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerId.current);
            timerId.current = null;
        };
    }, [cards, autoDraw, deckId]);

    const toggleDrawing = () => {
        setAutoDraw(!autoDraw);
    };

    // Get card form Api and set angle and x, y
    const getCard = async () => {
        let angle = Math.random() * 90 - 45;
        let randomX = Math.random() * 40 - 20;
        let randomY = Math.random() * 40 - 20;

        try {
            const res = await axios.get(
                `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`
            );

            if (res.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error("no cards remaining!");
            }

            const cardId = 52 - res.data.remaining;
            setCards([
                ...cards,
                { ...res.data.cards[0], id: cardId, angle, randomX, randomY },
            ]);
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="DeckOfCards">
            <button onClick={toggleDrawing}>
                {autoDraw ? `Stop` : `Start`} drawing!
            </button>
            <div className="DeckOfCards-card-content">
                {cards.map((card) => (
                    <Card
                        imgURL={card.image}
                        suit={card.suit}
                        value={card.value}
                        key={card.id}
                        angle={card.angle}
                        randomX={card.randomX}
                        randomY={card.randomY}
                    />
                ))}
            </div>
        </div>
    );
};

export default DeckOfCards;

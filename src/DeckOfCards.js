import Card from "./Card";
import "./DeckOfCards.css";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

const DeckOfCards = () => {
    const deckId = useRef();
    const [remaining, setRemaining] = useState(52);
    const [cards, setCards] = useState([]);

    useEffect(function createDeckWhenMounted() {
        async function NewDeck() {
            try {
                const res = await axios.get(
                    "http://deckofcardsapi.com/api/deck/new/"
                );
                console.log(res.data.deck_id);
                deckId.current = res.data.deck_id;
            } catch (err) {
                throw `New deck can't created ${err}`;
            }
        }
        NewDeck();
    }, []);

    const handleCard = async () => {
        let angle = Math.random() * 90 - 45;
        let randomX = Math.random() * 40 - 20;
        let randomY = Math.random() * 40 - 20;

        try {
            const res = await axios.get(
                `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`
            );
            console.log(res.data.cards[0]);
            setRemaining(res.data.remaining);
            const cardId = 52 - res.data.remaining;
            setCards([
                ...cards,
                { ...res.data.cards[0], id: cardId, angle, randomX, randomY },
            ]);
        } catch (err) {
            throw `Can't get card ${err}`;
        }
    };
    return (
        <div className="DeckOfCards">
            {remaining !== 0 && (
                <button onClick={handleCard}>GIMME ACARD!</button>
            )}
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
